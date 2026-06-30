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

interface LeafInfo {
  x: number
  y: number
  scale: number
  rotate: number
  color: string
  stage: number
  isHeart?: boolean
}

const LEAF_DATA: LeafInfo[] = [
  // === STAGE 0 === (14 items)
  { x: 25, y: 130, scale: 0.65, rotate: -45, color: '#d32f2f', stage: 0 },
  { x: 58, y: 130, scale: 0.65, rotate: 15, color: '#ef5350', stage: 0 },
  { x: 88, y: 160, scale: 0.65, rotate: -15, color: '#e53935', stage: 0 },
  { x: 112, y: 160, scale: 0.65, rotate: 30, color: '#f44336', stage: 0 },
  { x: 128, y: 142, scale: 0.65, rotate: -30, color: '#d32f2f', stage: 0 },
  { x: 168, y: 142, scale: 0.65, rotate: 35, color: '#f44336', stage: 0 },
  { x: 148, y: 142, scale: 0.75, rotate: 0, color: '#b71c1c', stage: 0 },
  { x: 188, y: 160, scale: 0.65, rotate: -25, color: '#e53935', stage: 0 },
  { x: 212, y: 160, scale: 0.65, rotate: 20, color: '#ef5350', stage: 0 },
  { x: 242, y: 130, scale: 0.65, rotate: -10, color: '#d32f2f', stage: 0 },
  { x: 275, y: 130, scale: 0.65, rotate: 50, color: '#ef5350', stage: 0 },
  { x: 148, y: 125, scale: 0.55, rotate: 10, color: '#ce0017', stage: 0, isHeart: true },
  { x: 42, y: 155, scale: 0.55, rotate: -20, color: '#ce0017', stage: 0, isHeart: true },
  { x: 258, y: 155, scale: 0.55, rotate: 20, color: '#ce0017', stage: 0, isHeart: true },

  // === STAGE 1 === (23 items)
  { x: 20, y: 145, scale: 0.6, rotate: -60, color: '#e91e63', stage: 1 },
  { x: 35, y: 115, scale: 0.7, rotate: -30, color: '#f06292', stage: 1 },
  { x: 50, y: 140, scale: 0.55, rotate: 0, color: '#ff8a80', stage: 1 },
  { x: 70, y: 125, scale: 0.65, rotate: 45, color: '#ef5350', stage: 1 },
  { x: 80, y: 150, scale: 0.6, rotate: -20, color: '#d32f2f', stage: 1 },
  { x: 95, y: 140, scale: 0.7, rotate: 10, color: '#e53935', stage: 1 },
  { x: 110, y: 175, scale: 0.55, rotate: -10, color: '#f44336', stage: 1 },
  { x: 122, y: 130, scale: 0.65, rotate: -40, color: '#b71c1c', stage: 1 },
  { x: 135, y: 155, scale: 0.6, rotate: 15, color: '#ef5350', stage: 1 },
  { x: 160, y: 130, scale: 0.65, rotate: 30, color: '#e53935', stage: 1 },
  { x: 162, y: 155, scale: 0.6, rotate: -15, color: '#d32f2f', stage: 1 },
  { x: 180, y: 145, scale: 0.7, rotate: 5, color: '#f06292', stage: 1 },
  { x: 190, y: 175, scale: 0.55, rotate: 15, color: '#ff8a80', stage: 1 },
  { x: 205, y: 140, scale: 0.65, rotate: -35, color: '#ef5350', stage: 1 },
  { x: 220, y: 150, scale: 0.6, rotate: 25, color: '#d32f2f', stage: 1 },
  { x: 230, y: 125, scale: 0.65, rotate: -45, color: '#e53935', stage: 1 },
  { x: 250, y: 140, scale: 0.55, rotate: 10, color: '#ff8a80', stage: 1 },
  { x: 265, y: 115, scale: 0.7, rotate: 25, color: '#f06292', stage: 1 },
  { x: 280, y: 145, scale: 0.6, rotate: 65, color: '#e91e63', stage: 1 },
  { x: 75, y: 175, scale: 0.65, rotate: 0, color: '#e91e63', stage: 1, isHeart: true },
  { x: 148, y: 165, scale: 0.75, rotate: -10, color: '#d32f2f', stage: 1, isHeart: true },
  { x: 225, y: 175, scale: 0.65, rotate: 10, color: '#e91e63', stage: 1, isHeart: true },
  { x: 148, y: 105, scale: 0.6, rotate: 5, color: '#ff4081', stage: 1, isHeart: true },

  // === STAGE 2 === (26 items)
  { x: 30, y: 160, scale: 0.55, rotate: -45, color: '#b71c1c', stage: 2 },
  { x: 45, y: 110, scale: 0.6, rotate: -15, color: '#d32f2f', stage: 2 },
  { x: 60, y: 155, scale: 0.5, rotate: 30, color: '#f44336', stage: 2 },
  { x: 65, y: 105, scale: 0.65, rotate: -35, color: '#e91e63', stage: 2 },
  { x: 85, y: 135, scale: 0.6, rotate: 10, color: '#ff8a80', stage: 2 },
  { x: 90, y: 115, scale: 0.7, rotate: -20, color: '#f06292', stage: 2 },
  { x: 105, y: 150, scale: 0.55, rotate: -5, color: '#ef5350', stage: 2 },
  { x: 115, y: 110, scale: 0.65, rotate: 45, color: '#d32f2f', stage: 2 },
  { x: 130, y: 145, scale: 0.5, rotate: -15, color: '#b71c1c', stage: 2 },
  { x: 135, y: 95, scale: 0.7, rotate: -10, color: '#ffb74d', stage: 2 },
  { x: 150, y: 150, scale: 0.55, rotate: 20, color: '#e53935', stage: 2 },
  { x: 160, y: 95, scale: 0.7, rotate: 15, color: '#f06292', stage: 2 },
  { x: 170, y: 145, scale: 0.5, rotate: -25, color: '#b71c1c', stage: 2 },
  { x: 185, y: 110, scale: 0.65, rotate: -35, color: '#d32f2f', stage: 2 },
  { x: 195, y: 150, scale: 0.55, rotate: 10, color: '#ef5350', stage: 2 },
  { x: 210, y: 115, scale: 0.7, rotate: 25, color: '#ffb74d', stage: 2 },
  { x: 215, y: 135, scale: 0.6, rotate: -10, color: '#e91e63', stage: 2 },
  { x: 235, y: 105, scale: 0.65, rotate: 40, color: '#f06292', stage: 2 },
  { x: 240, y: 155, scale: 0.5, rotate: -30, color: '#f44336', stage: 2 },
  { x: 255, y: 110, scale: 0.6, rotate: 20, color: '#d32f2f', stage: 2 },
  { x: 270, y: 160, scale: 0.55, rotate: 50, color: '#b71c1c', stage: 2 },
  { x: 55, y: 125, scale: 0.7, rotate: -10, color: '#ce0017', stage: 2, isHeart: true },
  { x: 110, y: 130, scale: 0.7, rotate: 5, color: '#ff4081', stage: 2, isHeart: true },
  { x: 188, y: 130, scale: 0.7, rotate: -5, color: '#ff4081', stage: 2, isHeart: true },
  { x: 245, y: 125, scale: 0.7, rotate: 10, color: '#ce0017', stage: 2, isHeart: true },
  { x: 148, y: 80, scale: 0.75, rotate: 0, color: '#ce0017', stage: 2, isHeart: true },

  // === STAGE 3 === (24 items)
  { x: 148, y: 65, scale: 0.75, rotate: 0, color: '#ff4081', stage: 3 },
  { x: 130, y: 80, scale: 0.7, rotate: -25, color: '#f06292', stage: 3 },
  { x: 166, y: 80, scale: 0.7, rotate: 25, color: '#e91e63', stage: 3 },
  { x: 110, y: 90, scale: 0.65, rotate: -40, color: '#d32f2f', stage: 3 },
  { x: 186, y: 90, scale: 0.65, rotate: 40, color: '#d32f2f', stage: 3 },
  { x: 40, y: 95, scale: 0.6, rotate: -15, color: '#ef5350', stage: 3 },
  { x: 260, y: 95, scale: 0.6, rotate: 15, color: '#ef5350', stage: 3 },
  { x: 75, y: 90, scale: 0.65, rotate: -30, color: '#f06292', stage: 3 },
  { x: 225, y: 90, scale: 0.65, rotate: 30, color: '#f06292', stage: 3 },
  { x: 95, y: 100, scale: 0.6, rotate: -10, color: '#ffb74d', stage: 3 },
  { x: 205, y: 100, scale: 0.6, rotate: 10, color: '#ffb74d', stage: 3 },
  { x: 90, y: 80, scale: 0.7, rotate: -15, color: '#ce0017', stage: 3, isHeart: true },
  { x: 210, y: 80, scale: 0.7, rotate: 15, color: '#ce0017', stage: 3, isHeart: true },
  { x: 148, y: 50, scale: 0.8, rotate: 0, color: '#ff1744', stage: 3, isHeart: true },
  { x: 120, y: 70, scale: 0.65, rotate: -10, color: '#ff4081', stage: 3, isHeart: true },
  { x: 176, y: 70, scale: 0.65, rotate: 10, color: '#ff4081', stage: 3, isHeart: true },
  // Falling petals / ground decoration
  { x: 105, y: 325, scale: 0.5, rotate: 45, color: '#ff8a80', stage: 3 },
  { x: 120, y: 345, scale: 0.45, rotate: 75, color: '#f06292', stage: 3 },
  { x: 180, y: 340, scale: 0.5, rotate: -60, color: '#e91e63', stage: 3 },
  { x: 195, y: 325, scale: 0.45, rotate: -30, color: '#ff8a80', stage: 3 },
  { x: 75, y: 305, scale: 0.55, rotate: 90, color: '#ff4081', stage: 3, isHeart: true },
  { x: 225, y: 305, scale: 0.55, rotate: -90, color: '#ff4081', stage: 3, isHeart: true },
  { x: 135, y: 350, scale: 0.55, rotate: 15, color: '#ce0017', stage: 3, isHeart: true },
  { x: 165, y: 352, scale: 0.55, rotate: -15, color: '#ce0017', stage: 3, isHeart: true },
]

function TreeIllustration({ stage }: { stage: -1 | 0 | 1 | 2 | 3 }) {
  const trunkStroke = stage === -1 ? 'url(#trunk-dry)' : 'url(#trunk-live)'

  return (
    <svg viewBox="0 0 300 360" aria-hidden="true" className="blood-tree-svg">
      <defs>
        <linearGradient id="trunk-live" gradientUnits="userSpaceOnUse" x1="150" y1="360" x2="150" y2="60">
          <stop offset="0%" stopColor="#271810" />
          <stop offset="60%" stopColor="#4e342e" />
          <stop offset="100%" stopColor="#8d6e63" />
        </linearGradient>
        <linearGradient id="trunk-dry" gradientUnits="userSpaceOnUse" x1="150" y1="360" x2="150" y2="60">
          <stop offset="0%" stopColor="#37474f" />
          <stop offset="60%" stopColor="#78909c" />
          <stop offset="100%" stopColor="#cfd8dc" />
        </linearGradient>
      </defs>

      <ellipse cx="150" cy="354" rx="70" ry="8" fill="#5d4037" opacity={stage === -1 ? 0.15 : 0.25} />

      {/* Trunk */}
      <path d="M142,354 L146,248 Q150,244 154,248 L158,354 Z" fill={trunkStroke} />
      {/* Left major branch */}
      <path d="M148,268 Q110,242 78,212 Q58,196 42,172" stroke={trunkStroke} fill="none" strokeWidth="8" strokeLinecap="round" />
      <path d="M42,172 Q28,155 25,135" stroke={trunkStroke} fill="none" strokeWidth="4" strokeLinecap="round" />
      <path d="M42,172 Q54,154 58,135" stroke={trunkStroke} fill="none" strokeWidth="4" strokeLinecap="round" />
      {/* Left inner branch */}
      <path d="M148,268 Q125,248 102,215" stroke={trunkStroke} fill="none" strokeWidth="6" strokeLinecap="round" />
      <path d="M102,215 Q92,192 88,165" stroke={trunkStroke} fill="none" strokeWidth="3" strokeLinecap="round" />
      <path d="M102,215 Q108,192 112,165" stroke={trunkStroke} fill="none" strokeWidth="3" strokeLinecap="round" />
      {/* Right major branch */}
      <path d="M152,268 Q190,242 222,212 Q242,196 258,172" stroke={trunkStroke} fill="none" strokeWidth="8" strokeLinecap="round" />
      <path d="M258,172 Q272,155 275,135" stroke={trunkStroke} fill="none" strokeWidth="4" strokeLinecap="round" />
      <path d="M258,172 Q246,154 242,135" stroke={trunkStroke} fill="none" strokeWidth="4" strokeLinecap="round" />
      {/* Right inner branch */}
      <path d="M152,268 Q175,248 198,215" stroke={trunkStroke} fill="none" strokeWidth="6" strokeLinecap="round" />
      <path d="M198,215 Q208,192 212,165" stroke={trunkStroke} fill="none" strokeWidth="3" strokeLinecap="round" />
      <path d="M198,215 Q192,192 188,165" stroke={trunkStroke} fill="none" strokeWidth="3" strokeLinecap="round" />
      {/* Center branch */}
      <line x1="150" y1="260" x2="148" y2="188" stroke={trunkStroke} strokeWidth="7" strokeLinecap="round" />
      <path d="M148,188 Q136,168 128,148" stroke={trunkStroke} fill="none" strokeWidth="4" strokeLinecap="round" />
      <path d="M148,188 Q160,168 168,148" stroke={trunkStroke} fill="none" strokeWidth="4" strokeLinecap="round" />
      <line x1="148" y1="188" x2="148" y2="148" stroke={trunkStroke} strokeWidth="3" strokeLinecap="round" />

      {stage >= 0 && (
        <g className="canopy-group">
          {LEAF_DATA.filter(leaf => leaf.stage <= stage).map((leaf, index) => {
            if (leaf.isHeart) {
              return (
                <g key={index} transform={`translate(${leaf.x - 12 * leaf.scale}, ${leaf.y - 12 * leaf.scale}) scale(${leaf.scale})`}>
                  <g transform={`rotate(${leaf.rotate}, 12, 12)`}>
                    <path
                      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                      fill={leaf.color}
                      className="tree-leaf-pop"
                      style={{ animationDelay: `${index * 12}ms` }}
                    />
                  </g>
                </g>
              )
            }
            return (
              <g key={index} transform={`translate(${leaf.x - 12 * leaf.scale}, ${leaf.y - 12 * leaf.scale}) scale(${leaf.scale})`}>
                <g transform={`rotate(${leaf.rotate}, 12, 12)`}>
                  <path
                    d="M12,2 C8,7 6,14 12,22 C18,14 16,7 12,2 Z"
                    fill={leaf.color}
                    className="tree-leaf-pop"
                    style={{ animationDelay: `${index * 12}ms` }}
                  />
                  <path
                    d="M12,6 L12,20"
                    stroke="rgba(255,255,255,0.35)"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                </g>
              </g>
            )
          })}
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
