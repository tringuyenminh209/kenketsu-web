import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import heroImage from './assets/blood-donation-hero.png'
import knowledgeInfrastructureImage from './assets/knowledge-infrastructure.webp'
import knowledgeMultiplePatientsImage from './assets/knowledge-multiple-patients.webp'
import knowledgeYouthImage from './assets/knowledge-youth.webp'
import benefitHealthCheckImage from './assets/benefit-health-check.webp'
import benefitLifeSupportImage from './assets/benefit-life-support.webp'
import benefitCampusSolidarityImage from './assets/benefit-campus-solidarity.webp'
import benefitSocialContributionImage from './assets/benefit-social-contribution.webp'
import processPrecheckImage from './assets/process/process-precheck.webp'
import processInterviewImage from './assets/process/process-interview-test.webp'
import processDonationImage from './assets/process/process-donation.webp'
import { EVENT_CONFIG } from './config/event'
import { Icon, SiteHeader, usePageMotion } from './lib/shared'
import { checkDuplicateRegistration, fetchSlotCounts, insertRegistration, insertSurvey, sendConfirmationEmail } from './lib/supabase'
import { BloodTreeProgress } from './components/BloodTreeProgress'
import { ForeignStudentSection } from './components/ForeignStudentSection'
import { ImpactSection } from './components/ImpactSection'
import { LastYearSection } from './components/LastYearSection'
import { BackToTop } from './components/BackToTop'
import './App.css'

const AdminPage = lazy(() => import('./pages/AdminPage'))
const Flyer = lazy(() => import('./pages/Flyer').then(m => ({ default: m.Flyer })))

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
const PROCESS_IMAGES = [processPrecheckImage, processInterviewImage, processDonationImage]

const SURVEY_Q2_OPTIONS = ['help_others', 'social_contribution', 'health_check', 'scary', 'time_consuming', 'dont_understand', 'not_interested', 'other']
const SURVEY_Q3_OPTIONS = ['no_opportunity', 'afraid_needle', 'anxious', 'no_time', 'dont_know_conditions', 'health_reason', 'not_interested', 'other']
const SURVEY_Q6_OPTIONS = ['easy_reservation', 'flexible_time', 'short_duration', 'clear_process', 'with_friend', 'detailed_explanation', 'other']

const TIME_SLOTS = [
  '9:30-10:00', '10:00-10:30', '10:30-11:00', '11:00-11:30',
  '12:30-13:00', '13:00-13:30', '13:30-14:00', '14:00-14:30',
  '14:30-15:00', '15:00-15:30', '15:30-16:00', '16:00-16:30',
]

// The event's calendar date (YYYY-MM-DD in JST), independent of the
// browser's own timezone, so we can compare "is this slot already over?"
const EVENT_DATE_JST = EVENT_CONFIG.targetDate.toLocaleDateString('en-CA', { timeZone: 'Asia/Tokyo' })

function getSlotEndTime(slot: string): Date {
  const [, endStr] = slot.split('-')
  return new Date(`${EVENT_DATE_JST}T${endStr}:00+09:00`)
}

function UserPage() {
  const { t } = useTranslation()
  const [selectedKnowledge, setSelectedKnowledge] = useState(0)
  const [selectedBenefit, setSelectedBenefit] = useState(0)
  const [selectedProcessStep, setSelectedProcessStep] = useState(0)
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
  const steps = (t('steps', { returnObjects: true }) as { title: string; text: string; detail: string; checks: string[] }[]).map(
    (step, i) => ({ ...step, image: PROCESS_IMAGES[i] }),
  )
  const pledgeItems = t('pledge.items', { returnObjects: true }) as string[]

  const activeKnowledge = knowledgeCards[selectedKnowledge]
  const activeBenefit = benefits[selectedBenefit]
  const activeProcessStep = steps[selectedProcessStep]

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
    name: '', furigana: '', email: '', studentId: '', phone: '', school: '', department: '',
    birthDate: '', timeSlot: '', donationExperience: '', gender: '',
  })
  const [slotCounts, setSlotCounts] = useState<Record<string, number>>({})
  useEffect(() => {
    fetchSlotCounts(EVENT_CONFIG.year).then(setSlotCounts).catch(() => {})
  }, [])
  const now = useRef(new Date()).current
  const timeSlotStatus = TIME_SLOTS.map((slot) => {
    const remaining = EVENT_CONFIG.slotCapacity - (slotCounts[slot] ?? 0)
    const isPast = now > getSlotEndTime(slot)
    return { slot, remaining, isPast, isFull: remaining <= 0 }
  })
  const [fieldTouched, setFieldTouched] = useState({ studentId: false, birthDate: false })
  const studentIdValid = regForm.studentId.trim().length >= 4
  const birthDateValid = regForm.birthDate.trim().length > 0 && normalizeBirthDateInput(regForm.birthDate) !== null
  const [regSubmitting, setRegSubmitting] = useState(false)
  const [regSuccess, setRegSuccess] = useState(false)
  const [regError, setRegError] = useState<string | null>(null)

  // ── アンケートフォーム ────────────────────────────
  const [surveyForm, setSurveyForm] = useState({
    donationCount: 'once',
    impressions: [] as string[],
    impressionsOther: '',
    reasons: [] as string[],
    reasonsOther: '',
    knewCampus: 'knew',
    wantParticipate: 'yes',
    conditions: [] as string[],
    conditionsOther: '',
    reservation: 'later',
  })
  const toggleSurveyCheckbox = (field: 'impressions' | 'reasons' | 'conditions', value: string) => {
    setSurveyForm((prev) => {
      const current = prev[field]
      const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value]
      return { ...prev, [field]: next }
    })
  }
  const [surveySubmitting, setSurveySubmitting] = useState(false)
  const [surveySuccess, setSurveySuccess] = useState(false)
  const [surveyError, setSurveyError] = useState<string | null>(null)
  const [showEligibility, setShowEligibility] = useState(false)

  useEffect(() => {
    if (!showEligibility) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setShowEligibility(false) }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [showEligibility])

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
      const registrationId = crypto.randomUUID()
      await insertRegistration({
        id: registrationId,
        event_year: EVENT_CONFIG.year,
        student_id: regForm.studentId,
        name: regForm.name,
        furigana: regForm.furigana || undefined,
        class: regForm.department,
        email: regForm.email || undefined,
        phone: regForm.phone || undefined,
        school: regForm.school || undefined,
        birth_date: normalizedBirthDate,
        time_slot: regForm.timeSlot || undefined,
        donation_experience: regForm.donationExperience || undefined,
        gender: regForm.gender || undefined,
      })
      sendConfirmationEmail(registrationId)
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
        `q2_impressions=${surveyForm.impressions.join(',')}`,
        surveyForm.impressions.includes('other') && surveyForm.impressionsOther
          ? `q2_other=${surveyForm.impressionsOther}` : '',
        surveyForm.donationCount === 'none'
          ? `q3_reasons=${surveyForm.reasons.join(',')}` : '',
        surveyForm.donationCount === 'none' && surveyForm.reasons.includes('other') && surveyForm.reasonsOther
          ? `q3_other=${surveyForm.reasonsOther}` : '',
        `q4_knew_campus=${surveyForm.knewCampus}`,
        `q5_want_participate=${surveyForm.wantParticipate}`,
        `q6_conditions=${surveyForm.conditions.join(',')}`,
        surveyForm.conditions.includes('other') && surveyForm.conditionsOther
          ? `q6_other=${surveyForm.conditionsOther}` : '',
        `q7_reservation=${surveyForm.reservation}`,
      ].filter(Boolean).join('\n')

      await insertSurvey({
        event_year: EVENT_CONFIG.year,
        donation_count: surveyForm.donationCount,
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
              <a className="button secondary" href="#survey">{t('hero.cta3')}</a>
            </div>
            <div className="impact-row" aria-label={t('hero.featuresAriaLabel')}>
              <article>
                <Icon type="heart" />
                <strong>{t('hero.feature1Title')}</strong>
                <span>{t('hero.feature1Desc')}</span>
              </article>
              <article>
                <Icon type="spark" />
                <strong>{t('hero.feature2Title')}</strong>
                <span>{t('hero.feature2Desc')}</span>
              </article>
              <article>
                <Icon type="globe" />
                <strong>{t('hero.feature3Title')}</strong>
                <span>{t('hero.feature3Desc')}</span>
              </article>
            </div>
          </div>
          <figure className="hero-media">
            <img src={heroImage} alt={t('hero.imageAlt')} />
          </figure>
        </section>

        {/* Quick-access nav — saiseikai style */}
        <nav className="quick-access" aria-label={t('quickAccess.ariaLabel')}>
          {([
            { href: '#register', icon: 'users' as const, label: t('quickAccess.register.label'), sub: t('quickAccess.register.sub') },
            { href: '#info', icon: 'calendar' as const, label: t('quickAccess.info.label'), sub: t('quickAccess.info.sub') },
            { href: '#precautions', icon: 'shield' as const, label: t('quickAccess.precautions.label'), sub: t('quickAccess.precautions.sub') },
            { href: '#knowledge', icon: 'book' as const, label: t('quickAccess.about.label'), sub: t('quickAccess.about.sub') },
          ] as const).map(({ href, icon, label, sub }) => (
            <a key={href} href={href} className="qa-card">
              <div className="qa-icon">
                <Icon type={icon} />
              </div>
              <div className="qa-text">
                <strong>{label}</strong>
                <span>{sub}</span>
              </div>
              <span className="qa-arrow">→</span>
            </a>
          ))}
        </nav>

        <ImpactSection />

        {/* ② FAQ — 不安解消 */}
        <section className="faq-section reveal" id="faq">
          <div className="section-title">
            <Icon type="shield" />
            <h2>{t('faqSection.title')}</h2>
          </div>
          <p className="section-helper">{t('faqSection.subtitle')}</p>
          <div className="faq-list">
            {([
              {
                q: t('faqSection.q1'),
                a: t('faqSection.a1'),
                icon: 'shield' as const,
              },
              {
                q: t('faqSection.q2'),
                a: t('faqSection.a2'),
                icon: 'heart' as const,
              },
              {
                q: t('faqSection.q3'),
                a: t('faqSection.a3'),
                icon: 'users' as const,
              },
              {
                q: t('faqSection.q4'),
                a: t('faqSection.a4'),
                icon: 'book' as const,
              },
            ] as const).map(({ q, a, icon }, i) => (
              <FaqItem key={i} q={q} a={a} icon={icon} />
            ))}
          </div>
        </section>

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
              <div className="knowledge-detail-content">
                {activeKnowledge.detail.split('\n').map((line, idx) => {
                  if (line.trim().startsWith('- ')) {
                    return <li key={idx} className="detail-bullet">{line.trim().substring(2)}</li>
                  }
                  return <p key={idx} className="detail-paragraph">{line}</p>
                })}
              </div>
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
              <div className="benefit-detail-content">
                {activeBenefit.detail.split('\n').map((line, idx) => {
                  if (line.trim().startsWith('- ')) {
                    return <li key={idx} className="detail-bullet">{line.trim().substring(2)}</li>
                  }
                  return <p key={idx} className="detail-paragraph">{line}</p>
                })}
              </div>
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
          <article className="reason-card motion-card">
            <Icon type="heart" />
            <h2>{t('reason.whyTitle')}</h2>
            <p>{t('reason.whyBody')}</p>
          </article>
          <article className="reason-card motion-card">
            <Icon type="shield" />
            <h2>{t('reason.processTitle')}</h2>
            <p>{t('reason.processNote')}</p>
          </article>
          <article className="reason-card reason-card--accent motion-card">
            <Icon type="globe" />
            <h2>{t('reason.communityTitle')}</h2>
            <p>{t('reason.communityBody')}</p>
            <ul>
              {(t('reason.communityItems', { returnObjects: true }) as string[]).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </section>

        <section className="process-section reveal" id="process">
          <div className="process-header">
            <div className="section-title">
              <Icon type="shield" />
              <h2>{t('reason.processTitle')}</h2>
            </div>
            <p className="section-helper">{t('reason.processNote')}</p>
          </div>
          <div className="step-list" role="list">
            {steps.map(({ title, text }, index) => (
              <button
                className={`step-card ${selectedProcessStep === index ? 'is-active' : ''}`}
                key={title}
                type="button"
                onClick={() => setSelectedProcessStep(index)}
                aria-pressed={selectedProcessStep === index}
              >
                <span>{title}</span>
                <small>{text}</small>
                <em>{t('reason.stepReadMore')}</em>
              </button>
            ))}
          </div>
          <article className="process-detail" aria-live="polite">
            <img src={activeProcessStep.image} alt={t('reason.processImageAlt', { title: activeProcessStep.title })} />
            <div>
              <span className="detail-label">{t('reason.processDetailLabel')}</span>
              <h3>{activeProcessStep.title}</h3>
              <p>{activeProcessStep.detail}</p>
              <ul>
                {activeProcessStep.checks.map((check) => (
                  <li key={check}>{check}</li>
                ))}
              </ul>
            </div>
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

        {/* ⑤ 去年の活動 — 登録前に信頼感を高める */}
        <LastYearSection />

        <BloodTreeProgress />

        <ForeignStudentSection />

        <section className="work-area reveal">
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
            <p className="precaution-note">{t('precautions.note200mL')}</p>
            <h3>{t('precautions.dayOfTitle')}</h3>
            <p>{t('precautions.dayOfNote')}</p>
            <button className="eligibility-btn" type="button" onClick={() => setShowEligibility(true)}>
              {t('precautions.detailsBtn')}
            </button>
          </aside>

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
              <p className="register-note">{t('register.note')}</p>
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
                  {t('register.furigana')} <span>{t('register.required')}</span>
                  <input
                    required
                    placeholder={t('register.furiganaPlaceholder')}
                    value={regForm.furigana}
                    onChange={(e) => setRegForm({ ...regForm, furigana: e.target.value })}
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
                <label className={fieldTouched.studentId ? (studentIdValid ? 'field-valid' : 'field-invalid') : ''}>
                  {t('register.studentId')} <span>{t('register.required')}</span>
                  <div className="input-wrap">
                    <input
                      required
                      placeholder={t('register.studentIdPlaceholder')}
                      value={regForm.studentId}
                      onChange={(e) => {
                        setRegForm({ ...regForm, studentId: e.target.value })
                        setFieldTouched((p) => ({ ...p, studentId: true }))
                      }}
                    />
                    {fieldTouched.studentId && (
                      <span className={`field-indicator ${studentIdValid ? 'ok' : 'ng'}`}>
                        {studentIdValid ? '✓' : '✗'}
                      </span>
                    )}
                  </div>
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
                  {t('register.school')} <span>{t('register.required')}</span>
                  <select
                    required
                    value={regForm.school}
                    onChange={(e) => setRegForm({ ...regForm, school: e.target.value })}
                  >
                    <option value="" disabled>{t('register.departmentSelect')}</option>
                    {(['school1', 'school2', 'school3', 'school4', 'school5'] as const).map((val) => (
                      <option key={val} value={t(`register.${val}`)}>{t(`register.${val}`)}</option>
                    ))}
                  </select>
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
                <label className={fieldTouched.birthDate ? (birthDateValid ? 'field-valid' : 'field-invalid') : ''}>
                  {t('register.birthDate')} <span>{t('register.required')}</span>
                  <div className="input-wrap">
                    <input
                      required
                      inputMode="numeric"
                      placeholder={t('register.birthDatePlaceholder')}
                      value={regForm.birthDate}
                      onChange={(e) => {
                        setRegForm({ ...regForm, birthDate: e.target.value })
                        setFieldTouched((p) => ({ ...p, birthDate: true }))
                      }}
                    />
                    {fieldTouched.birthDate && (
                      <span className={`field-indicator ${birthDateValid ? 'ok' : 'ng'}`}>
                        {birthDateValid ? '✓' : '✗'}
                      </span>
                    )}
                  </div>
                </label>
                <label>
                  {t('register.timeSlot')} <span>{t('register.required')}</span>
                  <select
                    required
                    value={regForm.timeSlot}
                    onChange={(e) => setRegForm({ ...regForm, timeSlot: e.target.value })}
                  >
                    <option value="" disabled>{t('register.departmentSelect')}</option>
                    {timeSlotStatus.filter(({ isPast }) => !isPast).map(({ slot, remaining, isFull }) => (
                      <option key={slot} value={slot} disabled={isFull}>
                        {slot.replace('-', '～')}
                        {isFull
                          ? `（${t('register.timeSlotFull')}）`
                          : `（${t('register.timeSlotRemaining', { count: remaining })}）`}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  {t('register.donationExperience')} <span>{t('register.required')}</span>
                  <select
                    required
                    value={regForm.donationExperience}
                    onChange={(e) => setRegForm({ ...regForm, donationExperience: e.target.value })}
                  >
                    <option value="" disabled>{t('register.departmentSelect')}</option>
                    <option value="yes">{t('register.donationExperienceYes')}</option>
                    <option value="no">{t('register.donationExperienceNo')}</option>
                  </select>
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
        </section>

        <section className="survey-area reveal" id="survey">
          {surveySuccess ? (
            <div className="survey-success motion-card">
              <Icon type="heart" />
              <h2>{t('survey.successTitle')}</h2>
              <p>{t('survey.successBody')}</p>
            </div>
          ) : (
            <form className="survey-form motion-card" onSubmit={handleSurveySubmit}>
              <div className="survey-form-header">
                <div className="section-title">
                  <Icon type="heart" />
                  <h2>{t('survey.title')}</h2>
                </div>
                <p className="section-helper">{t('survey.subtitle')}</p>
              </div>
              <div className="survey-grid">
                {/* Q1 */}
                <label>
                  {t('survey.q1Label')}
                  <select
                    value={surveyForm.donationCount}
                    onChange={(e) => setSurveyForm({ ...surveyForm, donationCount: e.target.value })}
                  >
                    <option value="once">{t('survey.q1Once')}</option>
                    <option value="few">{t('survey.q1Few')}</option>
                    <option value="many">{t('survey.q1Many')}</option>
                    <option value="none">{t('survey.q1None')}</option>
                  </select>
                </label>

                {/* Q2 — checkboxes */}
                <fieldset className="survey-full survey-checkbox-group">
                  <legend>{t('survey.q2Label')}</legend>
                  {SURVEY_Q2_OPTIONS.map((val) => (
                    <label key={val}>
                      <input
                        type="checkbox"
                        checked={surveyForm.impressions.includes(val)}
                        onChange={() => toggleSurveyCheckbox('impressions', val)}
                      />
                      {t(`survey.q2_${val}`)}
                    </label>
                  ))}
                  {surveyForm.impressions.includes('other') && (
                    <input
                      className="survey-other-input"
                      type="text"
                      placeholder={t('survey.q2OtherPlaceholder')}
                      value={surveyForm.impressionsOther}
                      onChange={(e) => setSurveyForm({ ...surveyForm, impressionsOther: e.target.value })}
                    />
                  )}
                </fieldset>

                {/* Q3 — only for those who have never donated */}
                {surveyForm.donationCount === 'none' && (
                  <fieldset className="survey-full survey-checkbox-group">
                    <legend>
                      {t('survey.q3Intro')}<br />
                      {t('survey.q3Label')}
                    </legend>
                    {SURVEY_Q3_OPTIONS.map((val) => (
                      <label key={val}>
                        <input
                          type="checkbox"
                          checked={surveyForm.reasons.includes(val)}
                          onChange={() => toggleSurveyCheckbox('reasons', val)}
                        />
                        {t(`survey.q3_${val}`)}
                      </label>
                    ))}
                    {surveyForm.reasons.includes('other') && (
                      <input
                        className="survey-other-input"
                        type="text"
                        placeholder={t('survey.q3OtherPlaceholder')}
                        value={surveyForm.reasonsOther}
                        onChange={(e) => setSurveyForm({ ...surveyForm, reasonsOther: e.target.value })}
                      />
                    )}
                  </fieldset>
                )}

                {/* Q4 */}
                <label>
                  {t('survey.q4Label')}
                  <select
                    value={surveyForm.knewCampus}
                    onChange={(e) => setSurveyForm({ ...surveyForm, knewCampus: e.target.value })}
                  >
                    <option value="knew">{t('survey.q4Knew')}</option>
                    <option value="first_time">{t('survey.q4FirstTime')}</option>
                  </select>
                </label>

                {/* Q5 */}
                <label>
                  {t('survey.q5Label')}
                  <select
                    value={surveyForm.wantParticipate}
                    onChange={(e) => setSurveyForm({ ...surveyForm, wantParticipate: e.target.value })}
                  >
                    <option value="yes">{t('survey.q5Yes')}</option>
                    <option value="maybe">{t('survey.q5Maybe')}</option>
                    <option value="unsure">{t('survey.q5Unsure')}</option>
                    <option value="no">{t('survey.q5No')}</option>
                  </select>
                </label>

                {/* Q6 — checkboxes */}
                <fieldset className="survey-full survey-checkbox-group">
                  <legend>{t('survey.q6Label')}</legend>
                  {SURVEY_Q6_OPTIONS.map((val) => (
                    <label key={val}>
                      <input
                        type="checkbox"
                        checked={surveyForm.conditions.includes(val)}
                        onChange={() => toggleSurveyCheckbox('conditions', val)}
                      />
                      {t(`survey.q6_${val}`)}
                    </label>
                  ))}
                  {surveyForm.conditions.includes('other') && (
                    <input
                      className="survey-other-input"
                      type="text"
                      placeholder={t('survey.q6OtherPlaceholder')}
                      value={surveyForm.conditionsOther}
                      onChange={(e) => setSurveyForm({ ...surveyForm, conditionsOther: e.target.value })}
                    />
                  )}
                </fieldset>

                {/* Q7 */}
                <label>
                  {t('survey.q7Label')}
                  <select
                    value={surveyForm.reservation}
                    onChange={(e) => setSurveyForm({ ...surveyForm, reservation: e.target.value })}
                  >
                    <option value="now">{t('survey.q7Now')}</option>
                    <option value="later">{t('survey.q7Later')}</option>
                    <option value="no">{t('survey.q7No')}</option>
                  </select>
                </label>
                {surveyForm.reservation === 'now' && (
                  <p className="survey-full survey-note">
                    <a href="#register">{t('survey.q7NowNote')}</a>
                  </p>
                )}
              </div>
              {surveyError && <p className="error-message">{surveyError}</p>}
              <button className="button primary" type="submit" disabled={surveySubmitting}>
                {surveySubmitting ? t('survey.submitting') : t('survey.submit')}
              </button>
            </form>
          )}
        </section>

        <footer className="final-cta reveal">
          <div>
            <h2>{t('footerCta.title')}</h2>
            <p className="ai-image-note">{t('footerCta.aiImageNote')}</p>
          </div>
          <a className="button primary" href="#register">{t('footerCta.cta')}</a>
        </footer>
      </main>
        {showEligibility && (
          <div className="eligibility-overlay" role="dialog" aria-modal="true" aria-label={t('eligibility.title')} onClick={() => setShowEligibility(false)}>
            <div className="eligibility-dialog" onClick={e => e.stopPropagation()}>
              <div className="eligibility-dialog-header">
                <h3>{t('eligibility.title')}</h3>
                <button className="eligibility-close" type="button" aria-label={t('eligibility.closeAria')} onClick={() => setShowEligibility(false)}>✕</button>
              </div>
              <div className="eligibility-table-wrap">
                <table className="eligibility-table">
                  <thead>
                    <tr>
                      <th rowSpan={2}>{t('eligibility.colType')}</th>
                      <th colSpan={2}>{t('eligibility.colWhole')}</th>
                      <th colSpan={2}>{t('eligibility.colComponent')}</th>
                    </tr>
                    <tr>
                      <th>200mL</th>
                      <th>400mL</th>
                      <th>{t('eligibility.colPlasma')}</th>
                      <th>{t('eligibility.colPlatelet')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{t('eligibility.rowVolume')}</td>
                      <td>200mL</td>
                      <td>400mL</td>
                      <td colSpan={2} dangerouslySetInnerHTML={{ __html: t('eligibility.cellVolumePlasma') }} />
                    </tr>
                    <tr>
                      <td rowSpan={2}>{t('eligibility.rowAge')}</td>
                      <td>{t('eligibility.cellAge200')}</td>
                      <td dangerouslySetInnerHTML={{ __html: t('eligibility.cellAge400') }} />
                      <td>{t('eligibility.cellAgePlasma')}</td>
                      <td dangerouslySetInnerHTML={{ __html: t('eligibility.cellAgePlatelet') }} />
                    </tr>
                    <tr>
                      <td colSpan={4} className="eligibility-note-cell">{t('eligibility.cellAgeNote')}</td>
                    </tr>
                    <tr>
                      <td>{t('eligibility.rowWeight')}</td>
                      <td dangerouslySetInnerHTML={{ __html: t('eligibility.cellWeight200') }} />
                      <td>{t('eligibility.cellWeight400')}</td>
                      <td colSpan={2} dangerouslySetInnerHTML={{ __html: t('eligibility.cellWeightPlasma') }} />
                    </tr>
                    <tr><td>{t('eligibility.rowBpMax')}</td><td colSpan={4}>{t('eligibility.cellBpMax')}</td></tr>
                    <tr><td>{t('eligibility.rowBpMin')}</td><td colSpan={4}>{t('eligibility.cellBpMin')}</td></tr>
                    <tr><td>{t('eligibility.rowPulse')}</td><td colSpan={4}>{t('eligibility.cellPulse')}</td></tr>
                    <tr><td>{t('eligibility.rowTemp')}</td><td colSpan={4}>{t('eligibility.cellTemp')}</td></tr>
                    <tr>
                      <td>{t('eligibility.rowHemoglobin')}</td>
                      <td dangerouslySetInnerHTML={{ __html: t('eligibility.cellHemo200') }} />
                      <td dangerouslySetInnerHTML={{ __html: t('eligibility.cellHemo400') }} />
                      <td dangerouslySetInnerHTML={{ __html: t('eligibility.cellHemoPlasma') }} />
                      <td>{t('eligibility.cellHemoPlatelet')}</td>
                    </tr>
                    <tr>
                      <td>{t('eligibility.rowPlateletCount')}</td>
                      <td>—</td><td>—</td><td>—</td>
                      <td dangerouslySetInnerHTML={{ __html: t('eligibility.cellPlateletCountVal') }} />
                    </tr>
                    <tr>
                      <td rowSpan={4} dangerouslySetInnerHTML={{ __html: t('eligibility.rowInterval') }} />
                      <td>{t('eligibility.cellInterval200')}</td>
                      <td colSpan={3}>{t('eligibility.cellInterval200Val')}</td>
                    </tr>
                    <tr>
                      <td>{t('eligibility.cellInterval400')}</td>
                      <td dangerouslySetInnerHTML={{ __html: t('eligibility.cellInterval400Val') }} />
                      <td colSpan={2}>{t('eligibility.cellInterval400ValPlasma')}</td>
                    </tr>
                    <tr>
                      <td>{t('eligibility.cellIntervalPlasma')}</td>
                      <td colSpan={3}>{t('eligibility.cellIntervalPlasmaVal')}</td>
                    </tr>
                    <tr>
                      <td>{t('eligibility.cellIntervalPlatelet')}</td>
                      <td colSpan={3} dangerouslySetInnerHTML={{ __html: t('eligibility.cellIntervalPlateletVal') }} />
                    </tr>
                    <tr>
                      <td dangerouslySetInnerHTML={{ __html: t('eligibility.rowAnnualVolume') }} />
                      <td colSpan={2} dangerouslySetInnerHTML={{ __html: t('eligibility.cellAnnualVolumeVal') }} />
                      <td>—</td><td>—</td>
                    </tr>
                    <tr>
                      <td dangerouslySetInnerHTML={{ __html: t('eligibility.rowAnnualCount') }} />
                      <td dangerouslySetInnerHTML={{ __html: t('eligibility.cellAnnualCount200') }} />
                      <td dangerouslySetInnerHTML={{ __html: t('eligibility.cellAnnualCount400') }} />
                      <td colSpan={2} dangerouslySetInnerHTML={{ __html: t('eligibility.cellAnnualCountComponent') }} />
                    </tr>
                    <tr>
                      <td>{t('eligibility.rowCommon')}</td>
                      <td colSpan={4} className="eligibility-common-cell" dangerouslySetInnerHTML={{ __html: t('eligibility.cellCommonVal') }} />
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="eligibility-footer-note">{t('eligibility.footerNote')}</p>
            </div>
          </div>
        )}
        <BackToTop />
    </div>
  )
}

type IconType = 'shield' | 'heart' | 'users' | 'book' | 'calendar' | 'spark' | 'alert'

function FaqItem({ q, a, icon }: { q: string; a: string; icon: IconType }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`faq-item ${open ? 'is-open' : ''}`}>
      <button
        className="faq-q"
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span className="faq-icon-wrap"><Icon type={icon} /></span>
        <span>{q}</span>
        <span className="faq-chevron">{open ? '−' : '+'}</span>
      </button>
      {open && <div className="faq-a"><p>{a}</p></div>}
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UserPage />} />
        <Route
          path="/flyer"
          element={
            <Suspense fallback={<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>読み込み中...</div>}>
              <Flyer />
            </Suspense>
          }
        />
        <Route
          path="/admin"
          element={
            <Suspense fallback={<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>読み込み中...</div>}>
              <AdminPage />
            </Suspense>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
