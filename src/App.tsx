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
import reasonSafetyImage from './assets/reason-safety.webp'
import processPrecheckImage from './assets/process/process-precheck.webp'
import processInterviewImage from './assets/process/process-interview-test.webp'
import processDonationImage from './assets/process/process-donation.webp'
import { EVENT_CONFIG } from './config/event'
import { Icon, SiteHeader, usePageMotion } from './lib/shared'
import { checkDuplicateRegistration, insertRegistration, insertSurvey, sendConfirmationEmail } from './lib/supabase'
import { BloodTreeProgress } from './components/BloodTreeProgress'
import { ForeignStudentSection } from './components/ForeignStudentSection'
import { ImpactSection } from './components/ImpactSection'
import { LastYearSection } from './components/LastYearSection'
import { LottieIcon } from './components/LottieIcon'
import './App.css'

const AdminPage = lazy(() => import('./pages/AdminPage'))

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
    name: '', email: '', studentId: '', phone: '', department: '', birthDate: '', gender: '',
  })
  const [fieldTouched, setFieldTouched] = useState({ studentId: false, birthDate: false })
  const studentIdValid = regForm.studentId.trim().length >= 4
  const birthDateValid = regForm.birthDate.trim().length > 0 && normalizeBirthDateInput(regForm.birthDate) !== null
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
        class: regForm.department,
        email: regForm.email || undefined,
        phone: regForm.phone || undefined,
        birth_date: normalizedBirthDate,
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
                <LottieIcon src="/animations/heartbeat.json" size={36} />
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
            <div className="hero-lottie-badge">
              <LottieIcon src="/animations/blood-drop.json" size={72} />
            </div>
          </figure>
        </section>

        {/* Quick-access nav — saiseikai style */}
        <nav className="quick-access" aria-label="クイックアクセス">
          {([
            { href: '#register', icon: 'users' as const, label: '参加申込', sub: '申込フォームへ' },
            { href: '#info', icon: 'calendar' as const, label: 'イベント情報', sub: '日時・場所・持ち物' },
            { href: '#precautions', icon: 'shield' as const, label: '注意事項', sub: '当日までの準備' },
            { href: '#knowledge', icon: 'book' as const, label: '献血とは', sub: '仕組みと意義' },
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

        {/* ⑤ 去年の活動 — 登録前に信頼感を高める */}
        <LastYearSection />

        <BloodTreeProgress />

        <ForeignStudentSection />

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
            <button className="eligibility-btn" type="button" onClick={() => setShowEligibility(true)}>
              献血基準の詳細を見る →
            </button>
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
          <div>
            <h2>{t('footerCta.title')}</h2>
            <p className="ai-image-note">{t('footerCta.aiImageNote')}</p>
          </div>
          <a className="button primary" href="#register">{t('footerCta.cta')}</a>
        </footer>
      </main>
        {showEligibility && (
          <div className="eligibility-overlay" role="dialog" aria-modal="true" aria-label="献血基準表" onClick={() => setShowEligibility(false)}>
            <div className="eligibility-dialog" onClick={e => e.stopPropagation()}>
              <div className="eligibility-dialog-header">
                <h3>献血基準表</h3>
                <button className="eligibility-close" type="button" aria-label="閉じる" onClick={() => setShowEligibility(false)}>✕</button>
              </div>
              <div className="eligibility-table-wrap">
                <table className="eligibility-table">
                  <thead>
                    <tr>
                      <th rowSpan={2}>採血の種類</th>
                      <th colSpan={2}>全血採血</th>
                      <th colSpan={2}>成分採血</th>
                    </tr>
                    <tr>
                      <th>200mL</th>
                      <th>400mL</th>
                      <th>血漿</th>
                      <th>血小板</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1回採血量</td>
                      <td>200mL</td>
                      <td>400mL</td>
                      <td colSpan={2}>600mL以下<small>（循環血液量の12%以内）</small></td>
                    </tr>
                    <tr>
                      <td rowSpan={2}>年齢</td>
                      <td>16〜69歳</td>
                      <td>男性: 17〜69歳<br />女性: 18〜69歳</td>
                      <td>18〜69歳</td>
                      <td>男性: 18〜69歳<br />女性: 18〜54歳</td>
                    </tr>
                    <tr>
                      <td colSpan={4} className="eligibility-note-cell">ただし、65〜69歳の方については、60歳に達した日から65歳に達した日の前日までの間に採血が行われた方に限る。</td>
                    </tr>
                    <tr>
                      <td>体重</td>
                      <td>男性45kg以上<br />女性40kg以上</td>
                      <td>男女50kg以上</td>
                      <td colSpan={2}>男性45kg以上<br />女性40kg以上</td>
                    </tr>
                    <tr><td>最高血圧</td><td colSpan={4}>90mmHg以上180mmHg未満</td></tr>
                    <tr><td>最低血圧</td><td colSpan={4}>50mmHg以上110mmHg未満</td></tr>
                    <tr><td>脈拍</td><td colSpan={4}>40回/分以上100回/分以下</td></tr>
                    <tr><td>体温</td><td colSpan={4}>37.5℃未満</td></tr>
                    <tr>
                      <td>血色素量</td>
                      <td>男性: 12.5g/dL以上<br />女性: 12.0g/dL以上</td>
                      <td>男性: 13.0g/dL以上<br />女性: 12.5g/dL以上</td>
                      <td>12.0g/dL以上<br /><small>（赤血球指数が標準域*にある女性は11.5g/dL以上）<br />*MCV: 81〜100fL / MCH: 26〜35pg / MCHC: 31〜36%</small></td>
                      <td>12.0g/dL以上</td>
                    </tr>
                    <tr>
                      <td>血小板数</td>
                      <td>—</td><td>—</td><td>—</td>
                      <td>15万/μL以上<br />60万/μL以下</td>
                    </tr>
                    <tr>
                      <td rowSpan={4}>採血間隔<br /><small>（前回採血）</small></td>
                      <td>200mL全血</td>
                      <td colSpan={3}>男女とも4週間後の同じ曜日から</td>
                    </tr>
                    <tr>
                      <td>400mL全血</td>
                      <td>男性は12週間後、<br />女性は16週間後の同じ曜日から</td>
                      <td colSpan={2}>男女とも8週間後の同じ曜日から</td>
                    </tr>
                    <tr>
                      <td>血漿成分</td>
                      <td colSpan={3}>男女とも2週間後の同じ曜日から</td>
                    </tr>
                    <tr>
                      <td>血小板成分</td>
                      <td colSpan={3}>血漿を含まない場合1週間後に血小板成分採血が可能。ただし、4週間に4回実施した場合には次回までに4週間あける。</td>
                    </tr>
                    <tr>
                      <td>年間総採血量<br /><small>（1年は52週として換算）</small></td>
                      <td colSpan={2}>200mL・400mL全血を合わせて<br />男性 1,200mL以内 / 女性 800mL以内</td>
                      <td>—</td><td>—</td>
                    </tr>
                    <tr>
                      <td>年間採血回数<br /><small>（1年は52週として換算）</small></td>
                      <td>男性6回以内<br />女性4回以内</td>
                      <td>男性3回以内<br />女性2回以内</td>
                      <td colSpan={2}>血小板成分採血1回を2回分に換算して血漿成分採血と合計で24回以内</td>
                    </tr>
                    <tr>
                      <td>共通事項</td>
                      <td colSpan={4} className="eligibility-common-cell">
                        次の方からは採血しない。<br />
                        ① 妊娠していると認められる方、又は過去6ヶ月以内に妊娠していたと認められる方<br />
                        ② 採血により悪化するおそれのある循環系疾患、血液疾患その他の疾患に罹っていると認められる方<br />
                        ③ 有熱者その他健康状態が不良であると認められる方
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="eligibility-footer-note">※ 期間の計算は直近の採血を行った日から起算します。</p>
            </div>
          </div>
        )}
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
