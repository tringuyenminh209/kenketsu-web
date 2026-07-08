import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import emergencySurgeryImage from '../assets/impact/impact-emergency-surgery.webp'
import cancerTreatmentImage from '../assets/impact/impact-cancer-treatment.webp'
import maternityNewbornImage from '../assets/impact/impact-maternity-newborn.webp'
import longTermCareImage from '../assets/impact/impact-long-term-care.webp'

function CountUp({ to, active, duration = 1400 }: { to: number; active: boolean; duration?: number }) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!active) return
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1)
      const eased = 1 - (1 - t) ** 3
      setVal(Math.round(eased * to))
      if (t < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [to, duration, active])
  return <>{val.toLocaleString()}</>
}

const WHO_NEEDS_META = [
  {
    overlay: 'linear-gradient(160deg, rgba(160,10,10,0.80) 0%, rgba(80,0,0,0.85) 100%)',
    image: emergencySurgeryImage,
    bgPos: 'center top',
  },
  {
    overlay: 'linear-gradient(160deg, rgba(90,10,140,0.80) 0%, rgba(40,0,80,0.85) 100%)',
    image: cancerTreatmentImage,
    bgPos: 'right center',
  },
  {
    overlay: 'linear-gradient(160deg, rgba(10,60,140,0.80) 0%, rgba(0,30,90,0.85) 100%)',
    image: maternityNewbornImage,
    bgPos: 'left center',
  },
  {
    overlay: 'linear-gradient(160deg, rgba(10,90,60,0.80) 0%, rgba(0,50,30,0.85) 100%)',
    image: longTermCareImage,
    bgPos: 'center bottom',
  },
]

const JOURNEY_META = [
  {
    num: '01',
    icon: (
      <svg viewBox="0 0 40 40" aria-hidden="true">
        <circle cx="20" cy="13" r="7" strokeWidth="2.5" />
        <path d="M6 38c0-7.7 6.3-14 14-14s14 6.3 14 14" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    num: '02',
    icon: (
      <svg viewBox="0 0 40 40" aria-hidden="true">
        <path d="M20 4C20 4 10 16 10 24a10 10 0 0 0 20 0C30 16 20 4 20 4Z" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M14 26a6 6 0 0 0 8 4" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    num: '03',
    icon: (
      <svg viewBox="0 0 40 40" aria-hidden="true">
        <path d="M15 5v16l-6 10a2 2 0 0 0 1.7 3h18.6A2 2 0 0 0 31 31L25 21V5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M13 5h14" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="17" cy="27" r="2" />
        <circle cx="23" cy="24" r="1.5" />
      </svg>
    ),
  },
  {
    num: '04',
    icon: (
      <svg viewBox="0 0 40 40" aria-hidden="true">
        <rect x="5" y="18" width="30" height="18" rx="2" strokeWidth="2.5" />
        <path d="M13 18V12a7 7 0 0 1 14 0v6" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M20 25v6M17 28h6" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    ),
  },
]

function RedCrossLogo() {
  const { t } = useTranslation()
  return (
    <svg className="trust-redcross-logo" viewBox="0 0 48 48" aria-label={t('impact.trust.redcross_org')}>
      <rect width="48" height="48" rx="4" fill="#ce0017" />
      <rect x="18" y="8" width="12" height="32" fill="white" />
      <rect x="8" y="18" width="32" height="12" fill="white" />
    </svg>
  )
}

export function ImpactSection() {
  const { t } = useTranslation()
  const statsRef = useRef<HTMLDivElement>(null)
  const [statsActive, setStatsActive] = useState(false)

  useEffect(() => {
    const el = statsRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsActive(true) },
      { threshold: 0.3 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const whoNeeds = (t('impact.who_needs.cards', { returnObjects: true }) as { title: string; body: string }[]).map(
    (card, i) => ({ ...card, ...WHO_NEEDS_META[i] })
  )

  const journey = (t('impact.journey.steps', { returnObjects: true }) as { title: string; sub: string }[]).map(
    (step, i) => ({ ...step, ...JOURNEY_META[i] })
  )

  return (
    <>
      {/* ── Stat numbers ─────────────────────────── */}
      <div className="impact-stats reveal" ref={statsRef}>
        <div className="impact-stat-inner">
          <p className="impact-stat-eyebrow">{t('impact.stats.save_title')}</p>
          <div className="impact-stat-num">
            <CountUp to={Number(t('impact.stats.save_to'))} active={statsActive} duration={900} />
            <span className="impact-stat-unit">{t('impact.stats.save_unit')}</span>
          </div>
          <p className="impact-stat-desc">{t('impact.stats.save_desc')}</p>
        </div>
        <div className="impact-stat-divider" />
        <div className="impact-stat-inner">
          <p className="impact-stat-eyebrow">{t('impact.stats.platelet_title')}</p>
          <div className="impact-stat-num">
            <CountUp to={Number(t('impact.stats.platelet_to'))} active={statsActive} duration={700} />
            <span className="impact-stat-unit">{t('impact.stats.platelet_unit')}</span>
          </div>
          <p className="impact-stat-desc">{t('impact.stats.platelet_desc')}</p>
        </div>
        <div className="impact-stat-divider" />
        <div className="impact-stat-inner">
          <p className="impact-stat-eyebrow">{t('impact.stats.annual_title')}</p>
          <div className="impact-stat-num">
            <CountUp to={Number(t('impact.stats.annual_to'))} active={statsActive} duration={1400} />
            <span className="impact-stat-unit">{t('impact.stats.annual_unit')}</span>
          </div>
          <p className="impact-stat-desc">{t('impact.stats.annual_desc')}</p>
        </div>
      </div>

      {/* ── Who needs blood ──────────────────────── */}
      <section className="impact-who reveal">
        <div className="impact-who-lead">
          <span className="impact-label">{t('impact.who_needs.eyebrow')}</span>
          <h2>{t('impact.who_needs.title')}</h2>
          <p>{t('impact.who_needs.desc')}</p>
        </div>
        <div className="impact-who-grid">
          {whoNeeds.map((item) => (
            <div
              key={item.title}
              className="who-card"
              style={{ '--card-overlay': item.overlay, '--card-bg-pos': item.bgPos } as React.CSSProperties}
            >
              <div
                className="who-card-photo"
                style={{ backgroundImage: `url(${item.image})` }}
              />
              <div className="who-card-overlay" />
              <div className="who-card-body">
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Journey ──────────────────────────────── */}
      <section className="impact-journey reveal">
        <div className="impact-label-wrap">
          <span className="impact-label">{t('impact.journey.eyebrow')}</span>
          <h2>{t('impact.journey.title')}</h2>
        </div>
        <div className="journey-steps">
          {journey.map((step, i) => (
            <div className="journey-step" key={step.num}>
              <div className="journey-icon">{step.icon}</div>
              <div className="journey-num">{step.num}</div>
              <strong>{step.title}</strong>
              <p>{step.sub}</p>
              {i < journey.length - 1 && <div className="journey-arrow" aria-hidden="true" />}
            </div>
          ))}
        </div>
      </section>

      {/* ── Trust ────────────────────────────────── */}
      <section className="impact-trust reveal">
        <p className="impact-trust-label">{t('impact.trust.label')}</p>
        <div className="trust-orgs">
          <div className="trust-org">
            <RedCrossLogo />
            <div>
              <strong>{t('impact.trust.redcross_org')}</strong>
              <span>{t('impact.trust.redcross_dept')}</span>
              <span className="trust-role">{t('impact.trust.redcross_role')}</span>
            </div>
          </div>
          <div className="trust-divider" />
          <div className="trust-org">
            <div className="trust-school-icon">
              <svg viewBox="0 0 48 48" aria-hidden="true">
                <path d="M24 6L4 18l20 12 20-12L24 6Z" strokeWidth="2.5" strokeLinejoin="round" />
                <path d="M8 22v12c4 4 8 6 16 6s12-2 16-6V22" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                <line x1="40" y1="18" x2="40" y2="30" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <strong>{t('impact.trust.school_org')}</strong>
              <span>{t('impact.trust.school_dept')}</span>
              <span className="trust-role">{t('impact.trust.school_role')}</span>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
