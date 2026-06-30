import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { supabase } from '../lib/supabase'
import { EVENT_CONFIG } from '../config/event'

const GOAL = EVENT_CONFIG.capacity

const STAGES = [
  { max: 10,       icon: '🌱', labelKey: 'tree.stage0' as const },
  { max: 25,       icon: '🌿', labelKey: 'tree.stage1' as const },
  { max: 40,       icon: '🌳', labelKey: 'tree.stage2' as const },
  { max: Infinity, icon: '🌸', labelKey: 'tree.stage3' as const },
]

const MILESTONES = [
  { count: 10,   icon: '🌱' },
  { count: 25,   icon: '🌿' },
  { count: 40,   icon: '🌳' },
  { count: GOAL, icon: '❤️' },
]

function getStageIndex(count: number): -1 | 0 | 1 | 2 | 3 {
  if (count === 0) return -1
  if (count <= 10) return 0
  if (count <= 25) return 1
  if (count <= 40) return 2
  return 3
}

function useCountUp(target: number | null, duration = 1200): number {
  const [display, setDisplay] = useState(0)
  const rafRef = useRef<number | undefined>(undefined)
  const prevRef = useRef(0)

  useEffect(() => {
    if (target === null) return
    const from = prevRef.current
    prevRef.current = target
    const start = performance.now()

    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setDisplay(Math.round(from + (target - from) * eased))
      if (p < 1) rafRef.current = requestAnimationFrame(tick)
    }

    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(tick)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [target, duration])

  return display
}

const HEART_PATH =
  'M20.8 4.6c-1.9-1.9-5-1.8-6.8.3L12 7.1 10 4.9C8.2 2.8 5.1 2.7 3.2 4.6c-2.1 2.1-2.1 5.5 0 7.6L12 21l8.8-8.8c2.1-2.1 2.1-5.5 0-7.6Z'

function Heart({ cx, cy, s }: { cx: number; cy: number; s: number }) {
  return (
    <g transform={`translate(${cx - 12 * s},${cy - 12 * s}) scale(${s})`}>
      <path d={HEART_PATH} fill="white" opacity="0.85" />
    </g>
  )
}

function TreeIllustration({ stage }: { stage: -1 | 0 | 1 | 2 | 3 }) {
  const trunkColor = stage === -1 ? '#c8bdb9' : '#6d4c41'

  return (
    <svg viewBox="0 0 300 360" aria-hidden="true" className="blood-tree-svg">
      <defs>
        {/* Goo/blob filter: Gaussian blur + alpha threshold → organic blob shapes */}
        <filter id="canopy-goo" x="-30%" y="-30%" width="160%" height="160%" colorInterpolationFilters="sRGB">
          <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
          <feColorMatrix in="blur" type="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -9"
            result="goo" />
        </filter>
      </defs>

      <ellipse cx="150" cy="354" rx="52" ry="7" fill="#8d6e63" opacity="0.35" />

      {/* Trunk */}
      <line x1="150" y1="354" x2="150" y2="248" stroke={trunkColor} strokeWidth="16" strokeLinecap="round" />
      {/* Left major branch */}
      <path d="M148,268 Q110,242 78,212 Q58,196 42,172" stroke={trunkColor} fill="none" strokeWidth="8" strokeLinecap="round" />
      <path d="M42,172 Q28,155 25,135" stroke={trunkColor} fill="none" strokeWidth="4" strokeLinecap="round" />
      <path d="M42,172 Q54,154 58,135" stroke={trunkColor} fill="none" strokeWidth="4" strokeLinecap="round" />
      {/* Left inner branch */}
      <path d="M148,268 Q125,248 102,215" stroke={trunkColor} fill="none" strokeWidth="6" strokeLinecap="round" />
      <path d="M102,215 Q92,192 88,165" stroke={trunkColor} fill="none" strokeWidth="3" strokeLinecap="round" />
      <path d="M102,215 Q108,192 112,165" stroke={trunkColor} fill="none" strokeWidth="3" strokeLinecap="round" />
      {/* Right major branch */}
      <path d="M152,268 Q190,242 222,212 Q242,196 258,172" stroke={trunkColor} fill="none" strokeWidth="8" strokeLinecap="round" />
      <path d="M258,172 Q272,155 275,135" stroke={trunkColor} fill="none" strokeWidth="4" strokeLinecap="round" />
      <path d="M258,172 Q246,154 242,135" stroke={trunkColor} fill="none" strokeWidth="4" strokeLinecap="round" />
      {/* Right inner branch */}
      <path d="M152,268 Q175,248 198,215" stroke={trunkColor} fill="none" strokeWidth="6" strokeLinecap="round" />
      <path d="M198,215 Q208,192 212,165" stroke={trunkColor} fill="none" strokeWidth="3" strokeLinecap="round" />
      <path d="M198,215 Q192,192 188,165" stroke={trunkColor} fill="none" strokeWidth="3" strokeLinecap="round" />
      {/* Center branch */}
      <line x1="150" y1="260" x2="148" y2="188" stroke={trunkColor} strokeWidth="7" strokeLinecap="round" />
      <path d="M148,188 Q136,168 128,148" stroke={trunkColor} fill="none" strokeWidth="4" strokeLinecap="round" />
      <path d="M148,188 Q160,168 168,148" stroke={trunkColor} fill="none" strokeWidth="4" strokeLinecap="round" />
      <line x1="148" y1="188" x2="148" y2="148" stroke={trunkColor} strokeWidth="3" strokeLinecap="round" />

      {stage >= 0 && (
        <g className="canopy-group">
          <g filter="url(#canopy-goo)">
          {/* Stage 0+: 3 puffs at branch tips */}
          <circle cx="40"  cy="138" r="30" fill="#ce0017" />
          <circle cx="260" cy="138" r="30" fill="#ce0017" />
          <circle cx="148" cy="142" r="28" fill="#d32f2f" />

          {/* Stage 1+: inner branch puffs, start bridging the gaps */}
          {stage >= 1 && (
            <>
              <circle cx="96"  cy="162" r="32" fill="#d32f2f" />
              <circle cx="204" cy="162" r="32" fill="#d32f2f" />
              <circle cx="148" cy="122" r="30" fill="#e53935" />
            </>
          )}

          {/* Stage 2+: fill the middle, canopy becomes one mass */}
          {stage >= 2 && (
            <>
              <circle cx="66"  cy="155" r="30" fill="#ce0017" />
              <circle cx="234" cy="155" r="30" fill="#ce0017" />
              <circle cx="120" cy="145" r="28" fill="#e53935" />
              <circle cx="176" cy="145" r="28" fill="#ef5350" />
              <circle cx="148" cy="108" r="28" fill="#d32f2f" />
            </>
          )}

          {/* Stage 3: lush top canopy */}
          {stage >= 3 && (
            <>
              <circle cx="38"  cy="120" r="26" fill="#ce0017" />
              <circle cx="262" cy="120" r="26" fill="#ce0017" />
              <circle cx="110" cy="116" r="24" fill="#e53935" />
              <circle cx="186" cy="116" r="24" fill="#ef5350" />
              <circle cx="148" cy="90"  r="30" fill="#ef5350" />
            </>
          )}
          </g>
          {stage >= 3 && (
            <>
              <Heart cx={40}  cy={138} s={0.45} />
              <Heart cx={260} cy={138} s={0.45} />
              <Heart cx={148} cy={90}  s={0.55} />
            </>
          )}
        </g>
      )}
    </svg>
  )
}

export function BloodTreeProgress() {
  const { t } = useTranslation()
  const [count, setCount] = useState<number | null>(null)
  const [visible, setVisible] = useState(false)
  const [previewStage, setPreviewStage] = useState<null | 0 | 1 | 2 | 3>(null)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.2 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    void supabase
      .from('registration_counts')
      .select('count')
      .eq('event_year', EVENT_CONFIG.year)
      .maybeSingle()
      .then(({ data }) => setCount(data?.count ?? 0))

    const ch = supabase
      .channel('tree_realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'registration_counts',
          filter: `event_year=eq.${EVENT_CONFIG.year}`,
        },
        (payload) => {
          const row = payload.new as { count: number }
          setCount(row.count)
        },
      )
      .subscribe()

    return () => { void supabase.removeChannel(ch) }
  }, [])

  const displayCount = count ?? 0
  const animatedCount = useCountUp(visible && count !== null ? count : null)
  const stage = getStageIndex(displayCount)
  const renderStage = previewStage ?? stage
  const pct = Math.min((displayCount / GOAL) * 100, 100)
  const remaining = Math.max(GOAL - displayCount, 0)
  const stageInfo = renderStage >= 0 ? STAGES[renderStage] : null

  return (
    <section
      ref={sectionRef}
      className="tree-section reveal"
      id="progress"
      style={{ '--tree-fill': pct / 100 } as React.CSSProperties}
    >
      <div className="tree-header">
        <h2>{t('tree.title')}</h2>
        <p>{t('tree.subtitle')}</p>
      </div>

      <div className="tree-body">
        <div key={renderStage} className="tree-illustration">
          <TreeIllustration stage={renderStage} />
          {stageInfo && (
            <p className="tree-stage-badge">
              <span role="img" aria-hidden="true">{stageInfo.icon}</span>
              {t(stageInfo.labelKey)}
            </p>
          )}
        </div>

        <div className="tree-stats">
          <div className="tree-count-display">
            <span className="tree-count-num">{animatedCount}</span>
            <span className="tree-count-sep"> / </span>
            <span className="tree-count-goal">{GOAL}</span>
            <span className="tree-count-unit">{t('tree.unit')}</span>
          </div>

          <div className="tree-progress-section">
            <div className="tree-progress-outer">
              <div className="tree-progress-bar">
                <div className="tree-progress-fill" style={{ width: `${pct}%` }} />
              </div>
              <div className="tree-milestone-row">
                {MILESTONES.map((m, i) => {
                  const msStage = i as 0 | 1 | 2 | 3
                  return (
                    <div
                      key={m.count}
                      className={`tree-ms-item ${displayCount >= m.count ? 'reached' : ''} ${previewStage === msStage ? 'previewing' : ''}`}
                      style={{ left: `${(m.count / GOAL) * 100}%` }}
                      onClick={() => setPreviewStage(prev => prev === msStage ? null : msStage)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => { if (e.key === 'Enter') setPreviewStage(prev => prev === msStage ? null : msStage) }}
                    >
                      <span className="tree-ms-icon">{m.icon}</span>
                    </div>
                  )
                })}
              </div>
            </div>
            <span className="tree-progress-pct">{Math.round(pct)}%</span>
          </div>

          {displayCount >= GOAL ? (
            <p className="tree-goal-badge">{t('tree.goalReached')}</p>
          ) : (
            <p className="tree-remaining">{t('tree.remaining', { remaining })}</p>
          )}

          {displayCount === 0 && count !== null && (
            <div className="tree-empty-cta">
              <p className="tree-empty-msg">{t('tree.beFirst')}</p>
              <a href="#register" className="tree-empty-btn">
                {t('tree.beFIrstBtn')} →
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
