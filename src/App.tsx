import { lazy, Suspense, useRef, useState } from 'react'
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
import { checkDuplicateRegistration, insertRegistration, insertSurvey } from './lib/supabase'
import { BloodTreeProgress } from './components/BloodTreeProgress'
import { ForeignStudentSection } from './components/ForeignStudentSection'
import { ImpactSection } from './components/ImpactSection'
import { LastYearSection } from './components/LastYearSection'
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
