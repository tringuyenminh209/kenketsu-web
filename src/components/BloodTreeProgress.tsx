import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { supabase } from '../lib/supabase'
import { EVENT_CONFIG } from '../config/event'

const GOAL = EVENT_CONFIG.capacity

// [cx, cy, rotationDeg] — 50 leaves spread across 5 branch clusters
const LEAF_DATA: [number, number, number][] = [
  [38, 155, -30], [48, 145, 15], [55, 158, -20], [35, 165, 25], [62, 148, -10],
  [42, 168, 35], [52, 138, -25], [65, 162, 10], [28, 158, -15], [58, 172, 30],
  [85, 158, 20], [95, 148, -35], [105, 142, 5], [88, 168, -20], [112, 155, 30],
  [78, 150, -10], [100, 165, 25], [115, 148, -30], [82, 160, 15], [108, 158, -25],
  [135, 148, -15], [145, 135, 20], [150, 118, -30], [158, 132, 10], [165, 148, 35],
  [140, 155, -20], [148, 148, 15], [160, 155, -25], [128, 142, 30], [168, 142, -10],
  [185, 158, 25], [195, 148, -15], [205, 142, 35], [182, 168, -20], [212, 155, 10],
  [178, 150, -30], [200, 165, 20], [215, 148, -25], [188, 160, 15], [208, 158, -35],
  [242, 155, 10], [252, 145, -20], [238, 158, 30], [265, 165, -15], [248, 148, 25],
  [258, 168, -10], [235, 138, 35], [262, 162, -25], [272, 158, 15], [245, 172, -30],
]

const LEAF_SHADES = ['#43a047', '#4caf50', '#66bb6a', '#388e3c', '#81c784']

export function BloodTreeProgress() {
  const { t } = useTranslation()
  const [count, setCount] = useState<number | null>(null)

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

    return () => {
      void supabase.removeChannel(ch)
    }
  }, [])

  const displayCount = count ?? 0
  const pct = Math.min((displayCount / GOAL) * 100, 100)
  const remaining = Math.max(GOAL - displayCount, 0)

  return (
    <section className="tree-section reveal" id="progress">
      <div className="tree-header">
        <h2>{t('tree.title')}</h2>
        <p>{t('tree.subtitle')}</p>
      </div>
      <div className="tree-body">
        <svg
          className="blood-tree-svg"
          viewBox="0 0 300 360"
          aria-label={`${displayCount}/${GOAL}人申込済み`}
          role="img"
        >
          <ellipse cx="150" cy="354" rx="52" ry="7" fill="#8d6e63" opacity="0.35" />
          <line x1="150" y1="354" x2="150" y2="248" stroke="#6d4c41" strokeWidth="16" strokeLinecap="round" />
          <path d="M148,268 Q110,242 78,212 Q58,196 42,172" stroke="#6d4c41" fill="none" strokeWidth="8" strokeLinecap="round" />
          <path d="M42,172 Q28,155 25,135" stroke="#6d4c41" fill="none" strokeWidth="4" strokeLinecap="round" />
          <path d="M42,172 Q54,154 58,135" stroke="#6d4c41" fill="none" strokeWidth="4" strokeLinecap="round" />
          <path d="M148,268 Q125,248 102,215" stroke="#6d4c41" fill="none" strokeWidth="6" strokeLinecap="round" />
          <path d="M102,215 Q92,192 88,165" stroke="#6d4c41" fill="none" strokeWidth="3" strokeLinecap="round" />
          <path d="M102,215 Q108,192 112,165" stroke="#6d4c41" fill="none" strokeWidth="3" strokeLinecap="round" />
          <path d="M152,268 Q190,242 222,212 Q242,196 258,172" stroke="#6d4c41" fill="none" strokeWidth="8" strokeLinecap="round" />
          <path d="M258,172 Q272,155 275,135" stroke="#6d4c41" fill="none" strokeWidth="4" strokeLinecap="round" />
          <path d="M258,172 Q246,154 242,135" stroke="#6d4c41" fill="none" strokeWidth="4" strokeLinecap="round" />
          <path d="M152,268 Q175,248 198,215" stroke="#6d4c41" fill="none" strokeWidth="6" strokeLinecap="round" />
          <path d="M198,215 Q208,192 212,165" stroke="#6d4c41" fill="none" strokeWidth="3" strokeLinecap="round" />
          <path d="M198,215 Q192,192 188,165" stroke="#6d4c41" fill="none" strokeWidth="3" strokeLinecap="round" />
          <line x1="150" y1="260" x2="148" y2="188" stroke="#6d4c41" strokeWidth="7" strokeLinecap="round" />
          <path d="M148,188 Q136,168 128,148" stroke="#6d4c41" fill="none" strokeWidth="4" strokeLinecap="round" />
          <path d="M148,188 Q160,168 168,148" stroke="#6d4c41" fill="none" strokeWidth="4" strokeLinecap="round" />
          <line x1="148" y1="188" x2="148" y2="148" stroke="#6d4c41" strokeWidth="3" strokeLinecap="round" />
          {LEAF_DATA.map(([cx, cy, rot], i) => {
            const active = i < displayCount
            return (
              <g key={i} transform={`translate(${cx},${cy}) rotate(${rot})`}>
                <ellipse
                  cx={0}
                  cy={0}
                  rx={10}
                  ry={6}
                  fill={active ? LEAF_SHADES[i % LEAF_SHADES.length] : '#d8d8d8'}
                  opacity={active ? 1 : 0.4}
                  className={active ? 'tree-leaf-active' : undefined}
                  style={active ? { animationDelay: `${Math.min(i * 22, 600)}ms` } : undefined}
                />
              </g>
            )
          })}
        </svg>

        <div className="tree-stats">
          <div className="tree-count-display">
            <span className="tree-count-num">{displayCount}</span>
            <span className="tree-count-sep"> / </span>
            <span className="tree-count-goal">{GOAL}</span>
            <span className="tree-count-unit">{t('tree.unit')}</span>
          </div>
          <div className="tree-progress-wrap">
            <div className="tree-progress-bar">
              <div className="tree-progress-fill" style={{ width: `${pct}%` }} />
            </div>
            <span className="tree-progress-pct">{Math.round(pct)}%</span>
          </div>
          {displayCount >= GOAL ? (
            <p className="tree-goal-badge">{t('tree.goalReached')}</p>
          ) : (
            <p className="tree-remaining">{t('tree.remaining', { remaining })}</p>
          )}
        </div>
      </div>
    </section>
  )
}
