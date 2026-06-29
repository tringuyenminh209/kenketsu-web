import { useEffect, useRef, useState, type RefObject } from 'react'
import { useTranslation } from 'react-i18next'
import { BrowserRouter, Link, NavLink, Route, Routes } from 'react-router-dom'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import heroImage from './assets/blood-donation-hero.png'
import knowledgeInfrastructureImage from './assets/knowledge-infrastructure.webp'
import knowledgeMultiplePatientsImage from './assets/knowledge-multiple-patients.webp'
import knowledgeYouthImage from './assets/knowledge-youth.webp'
import benefitHealthCheckImage from './assets/benefit-health-check.webp'
import benefitLifeSupportImage from './assets/benefit-life-support.webp'
import benefitCampusSolidarityImage from './assets/benefit-campus-solidarity.webp'
import benefitSocialContributionImage from './assets/benefit-social-contribution.webp'
import reasonSafetyImage from './assets/reason-safety.webp'
import logoMark from './assets/campus-care-mark.svg'
import { EVENT_CONFIG } from './config/event'
import i18n from './lib/i18n'
import {
  checkDuplicateRegistration,
  fetchRegistrations,
  getSession,
  insertRegistration,
  insertSurvey,
  registrationsToCSV,
  signInAdmin,
  signOutAdmin,
} from './lib/supabase'
import type { Registration } from './types'
import { downloadCSV } from './lib/utils'
import { BloodTreeProgress } from './components/BloodTreeProgress'
import { ImpactSection } from './components/ImpactSection'
import { LastYearSection } from './components/LastYearSection'
import './App.css'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const LANGS = [
  { code: 'ja', label: '日本語' },
  { code: 'vi', label: 'Tiếng Việt' },
  { code: 'en', label: 'English' },
  { code: 'my', label: 'မြန်မာ' },
  { code: 'ne', label: 'नेपाली' },
  { code: 'zh', label: '中文' },
]

function LanguageSelect() {
  const [open, setOpen] = useState(false)
  const [lang, setLang] = useState(i18n.language?.slice(0, 2) || 'ja')
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onMouse = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onMouse)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onMouse)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const select = (code: string) => {
    setLang(code)
    void i18n.changeLanguage(code)
    setOpen(false)
  }

  const currentLabel = LANGS.find((l) => l.code === lang)?.label ?? '日本語'

  return (
    <div className="lang-select" ref={ref}>
      <button
        className="lang-select-btn"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        type="button"
      >
        <svg className="lang-globe" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM3.6 9h16.8M3.6 15h16.8M12 3c2.2 2.3 3.4 5.3 3.4 9s-1.2 6.7-3.4 9M12 3C9.8 5.3 8.6 8.3 8.6 12s1.2 6.7 3.4 9" />
        </svg>
        <span className="lang-label">{currentLabel}</span>
        <svg
          className="lang-chevron"
          viewBox="0 0 24 24"
          aria-hidden="true"
          style={{ transform: open ? 'rotate(180deg)' : undefined }}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {open && (
        <ul className="lang-panel" role="listbox" aria-label="言語選択">
          {LANGS.map((l) => (
            <li
              key={l.code}
              role="option"
              aria-selected={l.code === lang}
              className={`lang-opt${l.code === lang ? ' is-active' : ''}`}
              onClick={() => select(l.code)}
            >
              {l.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function normalizeBirthDateInput(value: string) {
  const trimmed = value.trim()
  const compact = trimmed.replace(/[./\-\s]/g, '')
  const match = compact.match(/^(\d{4})(\d{2})(\d{2})$/)

  if (!match) return null

  const [, year, month, day] = match
  const date = new Date(Number(year), Number(month) - 1, Number(day))
  const isValidDate =
    date.getFullYear() === Number(year) &&
    date.getMonth() === Number(month) - 1 &&
    date.getDate() === Number(day)

  return isValidDate ? `${year}-${month}-${day}` : null
}

const KNOWLEDGE_IMAGE_POSITIONS = ['center', 'right center', 'center top'] as const
const BENEFIT_IMAGE_POSITIONS = ['center', 'right center', 'center top', 'left center'] as const
const KNOWLEDGE_IMAGES = [knowledgeInfrastructureImage, knowledgeMultiplePatientsImage, knowledgeYouthImage]
const BENEFIT_IMAGES = [benefitHealthCheckImage, benefitLifeSupportImage, benefitCampusSolidarityImage, benefitSocialContributionImage]

type IconType =
  | 'heart'
  | 'shield'
  | 'users'
  | 'calendar'
  | 'alert'
  | 'monitor'
  | 'book'
  | 'spark'
  | 'chart'

function Icon({ type }: { type: IconType }) {
  const paths: Record<IconType, string> = {
    heart: 'M20.8 4.6c-1.9-1.9-5-1.8-6.8.3L12 7.1 10 4.9C8.2 2.8 5.1 2.7 3.2 4.6c-2.1 2.1-2.1 5.5 0 7.6L12 21l8.8-8.8c2.1-2.1 2.1-5.5 0-7.6Z',
    shield: 'M12 3 20 6v6c0 5-3.4 8-8 9-4.6-1-8-4-8-9V6l8-3Zm-3 9 2 2 4-5',
    users: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm13 10v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8',
    calendar: 'M7 2v4M17 2v4M3 9h18M5 4h14a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z',
    alert: 'M12 3 22 20H2L12 3Zm0 6v5m0 3h.01',
    monitor: 'M3 4h18v12H3V4Zm7 17h4m-6 0h8',
    book: 'M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21V5.5Zm0 0V21m4-14h8m-8 4h8',
    spark: 'M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2Zm7 13 1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3Z',
    chart: 'M4 19V5m0 14h16M8 16v-5m4 5V8m4 8v-7',
  }

  return (
    <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d={paths[type]} />
    </svg>
  )
}

function SiteHeader({ isAdmin = false }: { isAdmin?: boolean }) {
  const { t } = useTranslation()

  return (
    <header className="site-header">
      <Link className="brand" to="/" aria-label="Campus Care top">
        <img className="brand-mark" src={logoMark} alt="" />
        <span>
          <strong>Campus Care</strong>
          <small>{t('hero.eventLabel')}</small>
        </span>
      </Link>
      <nav className="nav-links" aria-label={t('nav.ariaLabel')}>
        {isAdmin ? (
          <>
            <NavLink to="/">{t('nav.userSite')}</NavLink>
            <NavLink to="/admin">{t('nav.admin')}</NavLink>
          </>
        ) : (
          <>
            <a href="#knowledge">{t('nav.know')}</a>
            <a href="#benefits">{t('nav.benefits')}</a>
            <a href="#info">{t('nav.info')}</a>
            <a href="#register">{t('nav.register')}</a>
            <a href="#survey">{t('nav.survey')}</a>
            <NavLink to="/admin">{t('nav.admin')}</NavLink>
          </>
        )}
      </nav>
      <LanguageSelect />
    </header>
  )
}

function usePageMotion(rootRef: RefObject<HTMLDivElement | null>) {
  useGSAP(
    () => {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      if (reduceMotion) {
        gsap.set('.reveal, .motion-card, .hero-copy > *, .hero-media', {
          clearProps: 'all',
        })
        return
      }

      gsap.from('.site-header', {
        y: -24,
        autoAlpha: 0,
        duration: 0.7,
        ease: 'power3.out',
      })

      if (document.querySelector('.hero-copy')) {
        gsap.from('.hero-copy > *', {
          y: 34,
          autoAlpha: 0,
          duration: 0.9,
          stagger: 0.09,
          ease: 'power3.out',
        })
      }

      if (document.querySelector('.hero-media img')) {
        gsap.fromTo(
          '.hero-media img',
          { scale: 1.06, autoAlpha: 0 },
          {
            scale: 1,
            autoAlpha: 1,
            duration: 1.15,
            ease: 'power3.out',
          },
        )

        gsap.to('.hero-media img', {
          scale: 1.035,
          yPercent: -3,
          ease: 'none',
          scrollTrigger: {
            trigger: '.hero-section',
            start: 'top top',
            end: 'bottom top',
            scrub: 0.6,
          },
        })
      }

      gsap.utils.toArray<HTMLElement>('.reveal').forEach((element) => {
        gsap.from(element, {
          y: 42,
          autoAlpha: 0,
          duration: 0.75,
          ease: 'power3.out',
          immediateRender: false,
          scrollTrigger: {
            trigger: element,
            start: 'top 82%',
            toggleActions: 'play none none none',
            once: true,
          },
        })
      })

      gsap.utils.toArray<HTMLElement>('.motion-card').forEach((card) => {
        gsap.from(card, {
          y: 24,
          autoAlpha: 0,
          scale: 0.98,
          duration: 0.65,
          ease: 'power2.out',
          immediateRender: false,
          scrollTrigger: {
            trigger: card,
            start: 'top 88%',
            toggleActions: 'play none none none',
            once: true,
          },
        })
      })
    },
    { scope: rootRef },
  )
}

function UserPage() {
  const { t } = useTranslation()
  const [selectedKnowledge, setSelectedKnowledge] = useState(0)
  const [selectedBenefit, setSelectedBenefit] = useState(0)
  const rootRef = useRef<HTMLDivElement>(null)
  const knowledgeDetailRef = useRef<HTMLElement>(null)
  const benefitDetailRef = useRef<HTMLElement>(null)
  usePageMotion(rootRef)

  const knowledgeCards = (t('knowledge.cards', { returnObjects: true }) as { title: string; text: string; detail: string }[]).map(
    (card, i) => ({ ...card, imagePosition: KNOWLEDGE_IMAGE_POSITIONS[i], image: KNOWLEDGE_IMAGES[i] }),
  )
  const benefits = (t('benefits.cards', { returnObjects: true }) as { title: string; text: string; detail: string }[]).map(
    (card, i) => ({ ...card, imagePosition: BENEFIT_IMAGE_POSITIONS[i], image: BENEFIT_IMAGES[i] }),
  )
  const steps = t('steps', { returnObjects: true }) as { title: string; text: string }[]
  const pledgeItems = t('pledge.items', { returnObjects: true }) as string[]

  const activeKnowledge = knowledgeCards[selectedKnowledge]
  const activeBenefit = benefits[selectedBenefit]

  const eventInfo = [
    { label: t('info.date_label'), value: t('info.date_value') },
    { label: t('info.time_label'), value: t('info.time_value') },
    { label: t('info.location_label'), value: t('info.location_value') },
    { label: t('info.sponsor_label'), value: t('info.sponsor_value') },
    { label: t('info.reservation_label'), value: t('info.reservation_value') },
    { label: t('info.gift_label'), value: t('info.gift_value') },
    { label: t('info.capacity_label'), value: t('info.capacity_value', { capacity: EVENT_CONFIG.capacity }) },
  ]
  const eligibilityItems = t('precautions.eligibilityItems', { returnObjects: true }) as string[]

  // ── 参加申込フォーム ──────────────────────────────
  const [regForm, setRegForm] = useState({
    name: '', email: '', studentId: '', phone: '', department: '', birthDate: '', gender: '',
  })
  const [regSubmitting, setRegSubmitting] = useState(false)
  const [regSuccess, setRegSuccess] = useState(false)
  const [regError, setRegError] = useState<string | null>(null)

  // ── アンケートフォーム ────────────────────────────
  const [surveyForm, setSurveyForm] = useState({
    donationCount: 'first',
    howFound: 'poster',
    motivation: 'save_life',
    concern: 'pain',
    preferredSupport: 'staff',
    recommend: 'yes',
    comment: '',
  })
  const [surveySubmitting, setSurveySubmitting] = useState(false)
  const [surveySuccess, setSurveySuccess] = useState(false)
  const [surveyError, setSurveyError] = useState<string | null>(null)

  const handleKnowledgeSelect = (index: number) => {
    setSelectedKnowledge(index)
    window.requestAnimationFrame(() => {
      knowledgeDetailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    })
  }

  const handleBenefitSelect = (index: number) => {
    setSelectedBenefit(index)
    window.requestAnimationFrame(() => {
      benefitDetailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    })
  }

  const handleRegSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setRegSubmitting(true)
    setRegError(null)
    try {
      const normalizedBirthDate = normalizeBirthDateInput(regForm.birthDate)
      if (!normalizedBirthDate) {
        setRegError(t('register.errorInvalidBirthDate'))
        return
      }
      const isDuplicate = await checkDuplicateRegistration(regForm.studentId, EVENT_CONFIG.year)
      if (isDuplicate) {
        setRegError(t('register.errorDuplicate'))
        return
      }
      await insertRegistration({
        event_year: EVENT_CONFIG.year,
        student_id: regForm.studentId,
        name: regForm.name,
        class: regForm.department,
        email: regForm.email || undefined,
        phone: regForm.phone || undefined,
        birth_date: normalizedBirthDate,
        gender: regForm.gender || undefined,
      })
      setRegSuccess(true)
    } catch {
      setRegError(t('register.errorGeneral'))
    } finally {
      setRegSubmitting(false)
    }
  }

  const handleSurveySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSurveySubmitting(true)
    setSurveyError(null)
    try {
      const structuredComment = [
        `motivation=${surveyForm.motivation}`,
        `concern=${surveyForm.concern}`,
        `preferred_support=${surveyForm.preferredSupport}`,
        `recommend=${surveyForm.recommend}`,
        surveyForm.comment ? `free_comment=${surveyForm.comment}` : '',
      ].filter(Boolean).join('\n')

      await insertSurvey({
        event_year: EVENT_CONFIG.year,
        donation_count: surveyForm.donationCount,
        how_found: surveyForm.howFound,
        comment: structuredComment || undefined,
      })
      setSurveySuccess(true)
    } catch {
      setSurveyError(t('survey.errorGeneral'))
    } finally {
      setSurveySubmitting(false)
    }
  }

  return (
    <div className="app-shell" ref={rootRef}>
      <SiteHeader />
      <main id="top">
        <section className="hero-section" aria-labelledby="hero-title">
          <div className="hero-copy">
            <h1 id="hero-title">{t('hero.title')}</h1>
            <p className="hero-lead">{t('hero.lead')}</p>
            <div className="hero-actions">
              <a className="button primary" href="#register">{t('hero.cta')}</a>
              <a className="button secondary" href="#knowledge">{t('hero.cta2')}</a>
            </div>
            <div className="impact-row" aria-label={t('hero.featuresAriaLabel')}>
              <article>
                <Icon type="heart" />
                <strong>{t('hero.feature1Title')}</strong>
                <span>{t('hero.feature1Desc')}</span>
              </article>
              <article>
                <Icon type="book" />
                <strong>{t('hero.feature2Title')}</strong>
                <span>{t('hero.feature2Desc')}</span>
              </article>
              <article>
                <Icon type="users" />
                <strong>{t('hero.feature3Title')}</strong>
                <span>{t('hero.feature3Desc')}</span>
              </article>
            </div>
          </div>
          <figure className="hero-media">
            <img src={heroImage} alt={t('hero.imageAlt')} />
          </figure>
        </section>

        <ImpactSection />

        <LastYearSection />

        <section className="knowledge-section reveal" id="knowledge">
          <div className="knowledge-lead">
            <Icon type="book" />
            <h2>{t('knowledge.sectionTitle')}</h2>
            <p>{t('knowledge.sectionBody')}</p>
          </div>
          <div className="knowledge-grid">
            {knowledgeCards.map((card, index) => (
              <button
                className={`knowledge-card ${selectedKnowledge === index ? 'is-active' : ''}`}
                key={card.title}
                type="button"
                onClick={() => handleKnowledgeSelect(index)}
                aria-pressed={selectedKnowledge === index}
              >
                <span>{String(index + 1).padStart(2, '0')}</span>
                <strong>{card.title}</strong>
                <p>{card.text}</p>
                <small>{t('knowledge.readMore')}</small>
              </button>
            ))}
          </div>
          <article className="knowledge-detail" aria-live="polite" ref={knowledgeDetailRef}>
            <div
              className="knowledge-detail-image"
              style={{
                backgroundImage: `url(${activeKnowledge.image})`,
                backgroundPosition: activeKnowledge.imagePosition,
              }}
              role="img"
              aria-label={t('knowledge.imageAlt', { title: activeKnowledge.title })}
            />
            <div>
              <span className="detail-label">{t('knowledge.currentLabel')}</span>
              <h3>{activeKnowledge.title}</h3>
              <p>{activeKnowledge.detail}</p>
              <a className="text-link" href="#benefits">{t('knowledge.seeContributions')}</a>
            </div>
          </article>
        </section>

        <section className="benefits-section" id="benefits">
          <div className="section-title">
            <Icon type="spark" />
            <h2>{t('benefits.sectionTitle')}</h2>
          </div>
          <p className="section-helper">{t('benefits.sectionHelper')}</p>
          <div className="benefit-list">
            {benefits.map((benefit, index) => (
              <button
                className={`benefit-card ${selectedBenefit === index ? 'is-active' : ''}`}
                key={benefit.title}
                type="button"
                onClick={() => handleBenefitSelect(index)}
                aria-pressed={selectedBenefit === index}
              >
                <span
                  className="benefit-thumb"
                  style={{
                    backgroundImage: `url(${benefit.image})`,
                    backgroundPosition: benefit.imagePosition,
                  }}
                />
                <span className="benefit-card-body">
                  <strong>{benefit.title}</strong>
                  <p>{benefit.text}</p>
                  <span className="benefit-card-action">{t('benefits.seeMore')}</span>
                </span>
              </button>
            ))}
          </div>
          <article className="benefit-detail" aria-live="polite" ref={benefitDetailRef}>
            <div
              className="benefit-detail-image"
              style={{
                backgroundImage: `url(${activeBenefit.image})`,
                backgroundPosition: activeBenefit.imagePosition,
              }}
              role="img"
              aria-label={t('benefits.imageAlt', { title: activeBenefit.title })}
            />
            <div>
              <span className="detail-label">{t('benefits.currentLabel')}</span>
              <h3>{activeBenefit.title}</h3>
              <p>{activeBenefit.detail}</p>
              <a className="text-link" href="#register">{t('benefits.toRegister')}</a>
            </div>
          </article>
        </section>

        <section className="info-strip reveal" id="info" aria-label={t('nav.info')}>
          <div className="section-title compact">
            <Icon type="calendar" />
            <h2>{t('nav.info')}</h2>
          </div>
          <dl>
            {eventInfo.map((item) => (
              <div key={item.label}>
                <dt>{item.label}</dt>
                <dd>{item.value}</dd>
              </div>
            ))}
          </dl>
          <div className="app-reservation-links" aria-label={t('info.appLinksLabel')}>
            <div>
              <strong>{t('info.appLinksTitle')}</strong>
              <span>{t('info.appLinksText')}</span>
            </div>
            <a href={EVENT_CONFIG.appLinks.appStore} target="_blank" rel="noreferrer">
              App Store
            </a>
            <a href={EVENT_CONFIG.appLinks.googlePlay} target="_blank" rel="noreferrer">
              Google Play
            </a>
          </div>
        </section>

        <section className="reason-grid reveal" id="reason">
          <article className="reason-story motion-card">
            <div className="reason-visual">
              <img src={reasonSafetyImage} alt={t('reason.imageAlt')} />
            </div>
            <div>
              <Icon type="heart" />
              <h2>{t('reason.whyTitle')}</h2>
              <p>{t('reason.whyBody')}</p>
              <a href="#benefits">{t('reason.whyLink')}</a>
            </div>
          </article>
          <article className="reason-process motion-card">
            <div className="section-title">
              <Icon type="shield" />
              <h2>{t('reason.processTitle')}</h2>
            </div>
            <p className="reason-note">{t('reason.processNote')}</p>
            <ol className="step-list">
              {steps.map(({ title, text }) => (
                <li key={title}>
                  <span>{title}</span>
                  <small>{text}</small>
                </li>
              ))}
            </ol>
          </article>
          <article className="reason-community motion-card">
            <Icon type="users" />
            <h2>{t('reason.communityTitle')}</h2>
            <p>{t('reason.communityBody')}</p>
            <ul>
              {(t('reason.communityItems', { returnObjects: true }) as string[]).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </section>

        <section className="pledge-section reveal">
          <div>
            <Icon type="heart" />
            <h2>{t('pledge.title')}</h2>
          </div>
          <ul>
            {pledgeItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <BloodTreeProgress />

        <section className="work-area reveal">
          {regSuccess ? (
            <div className="panel register-panel motion-card success-panel">
              <Icon type="heart" />
              <h2>{t('register.successTitle')}</h2>
              <p>{t('register.successBody')}</p>
            </div>
          ) : (
            <form
              className="panel register-panel motion-card"
              id="register"
              onSubmit={handleRegSubmit}
            >
              <div className="section-title">
                <Icon type="users" />
                <h2>{t('register.title')}</h2>
              </div>
              <div className="form-grid">
                <label>
                  {t('register.name')} <span>{t('register.required')}</span>
                  <input
                    required
                    placeholder={t('register.namePlaceholder')}
                    value={regForm.name}
                    onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                  />
                </label>
                <label>
                  {t('register.email')} <span>{t('register.required')}</span>
                  <input
                    required
                    type="email"
                    placeholder={t('register.emailPlaceholder')}
                    value={regForm.email}
                    onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                  />
                </label>
                <label>
                  {t('register.studentId')} <span>{t('register.required')}</span>
                  <input
                    required
                    placeholder={t('register.studentIdPlaceholder')}
                    value={regForm.studentId}
                    onChange={(e) => setRegForm({ ...regForm, studentId: e.target.value })}
                  />
                </label>
                <label>
                  {t('register.phone')} <span>{t('register.required')}</span>
                  <input
                    required
                    inputMode="tel"
                    placeholder={t('register.phonePlaceholder')}
                    value={regForm.phone}
                    onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                  />
                </label>
                <label>
                  {t('register.department')} <span>{t('register.required')}</span>
                  <input
                    required
                    placeholder={t('register.departmentPlaceholder')}
                    value={regForm.department}
                    onChange={(e) => setRegForm({ ...regForm, department: e.target.value })}
                  />
                </label>
                <label>
                  {t('register.birthDate')} <span>{t('register.required')}</span>
                  <input
                    required
                    inputMode="numeric"
                    placeholder={t('register.birthDatePlaceholder')}
                    value={regForm.birthDate}
                    onChange={(e) => setRegForm({ ...regForm, birthDate: e.target.value })}
                  />
                </label>
              </div>
              <fieldset>
                <legend>{t('register.gender')}</legend>
                {(['male', 'female', 'other', 'no_answer'] as const).map((val) => (
                  <label key={val}>
                    <input
                      name="gender"
                      type="radio"
                      value={val}
                      checked={regForm.gender === val}
                      onChange={(e) => setRegForm({ ...regForm, gender: e.target.value })}
                    />
                    {t(`register.gender${val === 'male' ? 'Male' : val === 'female' ? 'Female' : val === 'other' ? 'Other' : 'NoAnswer'}`)}
                  </label>
                ))}
              </fieldset>
              {regError && <p className="error-message">{regError}</p>}
              <button className="button primary wide" type="submit" disabled={regSubmitting}>
                {regSubmitting ? t('register.submitting') : t('register.submit')}
              </button>
            </form>
          )}

          <aside className="panel gentle-precautions motion-card" id="precautions">
            <div className="section-title calm">
              <Icon type="shield" />
              <h2>{t('precautions.title')}</h2>
            </div>
            <p className="precaution-intro">{t('precautions.intro')}</p>
            <h3>{t('precautions.eligibilityTitle')}</h3>
            <ul className="check-list">
              {eligibilityItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <h3>{t('precautions.dayOfTitle')}</h3>
            <p>{t('precautions.dayOfNote')}</p>
            <a className="text-link" href="#survey">{t('precautions.toSurvey')}</a>
          </aside>

          {surveySuccess ? (
            <div className="panel survey-panel motion-card success-panel">
              <Icon type="heart" />
              <h2>{t('survey.successTitle')}</h2>
              <p>{t('survey.successBody')}</p>
            </div>
          ) : (
            <form
              className="panel survey-panel motion-card"
              id="survey"
              onSubmit={handleSurveySubmit}
            >
              <div className="section-title">
                <Icon type="heart" />
                <h2>{t('survey.title')}</h2>
              </div>
              <label>
                {t('survey.q1Label')}
                <select
                  value={surveyForm.donationCount}
                  onChange={(e) => setSurveyForm({ ...surveyForm, donationCount: e.target.value })}
                >
                  <option value="first">{t('survey.q1First')}</option>
                  <option value="few">{t('survey.q1Few')}</option>
                  <option value="many">{t('survey.q1Many')}</option>
                </select>
              </label>
              <label>
                {t('survey.q2Label')}
                <select
                  value={surveyForm.howFound}
                  onChange={(e) => setSurveyForm({ ...surveyForm, howFound: e.target.value })}
                >
                  <option value="poster">{t('survey.q2Poster')}</option>
                  <option value="teacher">{t('survey.q2Teacher')}</option>
                  <option value="friend">{t('survey.q2Friend')}</option>
                  <option value="sns">{t('survey.q2Sns')}</option>
                </select>
              </label>
              <label>
                {t('survey.q3Label')}
                <select
                  value={surveyForm.motivation}
                  onChange={(e) => setSurveyForm({ ...surveyForm, motivation: e.target.value })}
                >
                  <option value="save_life">{t('survey.q3SaveLife')}</option>
                  <option value="school_event">{t('survey.q3SchoolEvent')}</option>
                  <option value="first_step">{t('survey.q3FirstStep')}</option>
                  <option value="friend">{t('survey.q3Friend')}</option>
                </select>
              </label>
              <label>
                {t('survey.q4Label')}
                <select
                  value={surveyForm.concern}
                  onChange={(e) => setSurveyForm({ ...surveyForm, concern: e.target.value })}
                >
                  <option value="pain">{t('survey.q4Pain')}</option>
                  <option value="time">{t('survey.q4Time')}</option>
                  <option value="health">{t('survey.q4Health')}</option>
                  <option value="none">{t('survey.q4None')}</option>
                </select>
              </label>
              <label>
                {t('survey.q5Label')}
                <select
                  value={surveyForm.preferredSupport}
                  onChange={(e) => setSurveyForm({ ...surveyForm, preferredSupport: e.target.value })}
                >
                  <option value="staff">{t('survey.q5Staff')}</option>
                  <option value="guide">{t('survey.q5Guide')}</option>
                  <option value="friend">{t('survey.q5Friend')}</option>
                  <option value="quiet">{t('survey.q5Quiet')}</option>
                </select>
              </label>
              <label>
                {t('survey.q6Label')}
                <select
                  value={surveyForm.recommend}
                  onChange={(e) => setSurveyForm({ ...surveyForm, recommend: e.target.value })}
                >
                  <option value="yes">{t('survey.q6Yes')}</option>
                  <option value="maybe">{t('survey.q6Maybe')}</option>
                  <option value="not_yet">{t('survey.q6NotYet')}</option>
                </select>
              </label>
              <label>
                {t('survey.q7Label')}
                <textarea
                  rows={4}
                  placeholder={t('survey.q7Placeholder')}
                  value={surveyForm.comment}
                  onChange={(e) => setSurveyForm({ ...surveyForm, comment: e.target.value })}
                />
              </label>
              {surveyError && <p className="error-message">{surveyError}</p>}
              <button className="button primary wide" type="submit" disabled={surveySubmitting}>
                {surveySubmitting ? t('survey.submitting') : t('survey.submit')}
              </button>
            </form>
          )}
        </section>

        <footer className="final-cta reveal">
          <h2>{t('footerCta.title')}</h2>
          <a className="button primary" href="#register">{t('footerCta.cta')}</a>
        </footer>
      </main>
    </div>
  )
}

function AdminPage() {
  const rootRef = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginError, setLoginError] = useState<string | null>(null)
  const [loginSubmitting, setLoginSubmitting] = useState(false)
  usePageMotion(rootRef)

  useEffect(() => {
    getSession().then((session) => {
      if (session) {
        setIsAuthenticated(true)
        fetchRegistrations(EVENT_CONFIG.year).then(setRegistrations)
      }
      setLoading(false)
    })
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginSubmitting(true)
    setLoginError(null)
    try {
      await signInAdmin(loginEmail, loginPassword)
      setIsAuthenticated(true)
      const data = await fetchRegistrations(EVENT_CONFIG.year)
      setRegistrations(data)
    } catch {
      setLoginError('メールアドレスまたはパスワードが正しくありません。')
    } finally {
      setLoginSubmitting(false)
    }
  }

  const handleLogout = async () => {
    await signOutAdmin()
    setIsAuthenticated(false)
    setRegistrations([])
  }

  const handleCsvExport = () => {
    const csv = registrationsToCSV(registrations)
    downloadCSV(csv, `registrations_${EVENT_CONFIG.year}.csv`)
  }

  if (loading) {
    return (
      <div className="app-shell">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
          読み込み中...
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="app-shell admin-shell" ref={rootRef}>
        <SiteHeader isAdmin />
        <main className="admin-page">
          <section className="admin-login-section">
            <form className="admin-login-form panel motion-card" onSubmit={handleLogin}>
              <Icon type="monitor" />
              <h1>管理者ログイン</h1>
              <p>先生専用の管理画面です。</p>
              <label>
                メールアドレス
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                />
              </label>
              <label>
                パスワード
                <input
                  type="password"
                  required
                  autoComplete="current-password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                />
              </label>
              {loginError && <p className="error-message">{loginError}</p>}
              <button className="button primary wide" type="submit" disabled={loginSubmitting}>
                {loginSubmitting ? 'ログイン中...' : 'ログイン'}
              </button>
            </form>
          </section>
        </main>
      </div>
    )
  }

  return (
    <div className="app-shell admin-shell" ref={rootRef}>
      <SiteHeader isAdmin />
      <main className="admin-page">
        <section className="admin-hero">
          <div>
            <Icon type="monitor" />
            <h1>管理ダッシュボード</h1>
            <p>申込状況、CSV出力を確認するための管理者向け画面です。</p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link className="button secondary" to="/">ユーザーサイトへ戻る</Link>
            <button className="button outline" type="button" onClick={handleLogout}>ログアウト</button>
          </div>
        </section>

        <section className="admin-metrics reveal">
          <article className="motion-card">
            <span>申込数</span>
            <strong>{registrations.length}</strong>
            <small>定員{EVENT_CONFIG.capacity}名まであと{EVENT_CONFIG.capacity - registrations.length}名</small>
          </article>
          <article className="motion-card">
            <span>年度</span>
            <strong>{EVENT_CONFIG.year}</strong>
            <small>{EVENT_CONFIG.date}</small>
          </article>
          <article className="motion-card">
            <span>会場</span>
            <strong style={{ fontSize: '0.85rem' }}>{EVENT_CONFIG.location}</strong>
            <small>{EVENT_CONFIG.locationDetail}</small>
          </article>
        </section>

        <section className="admin-preview admin-page-panel reveal">
          <div className="section-title">
            <Icon type="chart" />
            <h2>申込データ</h2>
          </div>
          <div className="admin-content">
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>申込日時</th>
                    <th>学生番号</th>
                    <th>氏名</th>
                    <th>所属</th>
                    <th>メール</th>
                    <th>電話番号</th>
                  </tr>
                </thead>
                <tbody>
                  {registrations.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>
                        申込データがありません
                      </td>
                    </tr>
                  ) : (
                    registrations.map((row) => (
                      <tr key={row.id}>
                        <td>{new Date(row.created_at).toLocaleString('ja-JP')}</td>
                        <td>{row.student_id}</td>
                        <td>{row.name}</td>
                        <td>{row.class}</td>
                        <td>{row.email ?? '—'}</td>
                        <td>{row.phone ?? '—'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="admin-actions">
              <button
                className="button outline"
                type="button"
                onClick={handleCsvExport}
                disabled={registrations.length === 0}
              >
                CSVエクスポート
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UserPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
