import { useEffect, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useTranslation } from 'react-i18next'
import { supabase } from '../lib/supabase'
import { EVENT_CONFIG } from '../config/event'

gsap.registerPlugin(useGSAP)

const GOAL = EVENT_CONFIG.capacity

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

const LEAF_COLORS = [
  '#43a047', '#4caf50', '#66bb6a', '#388e3c', '#81c784',
  '#a5d6a7', '#2e7d32', '#558b2f', '#33691e', '#689f38',
]

const LEAF_EMOJI = [
  '🌸', '🦋', '🐝', '🌺', '🍀', '🎋', '🦊', '🌻', '🐿', '🐞',
  '🌷', '🦜', '🌿', '🍁', '🦔', '🌼', '🐦', '🍃', '🌱', '🦩',
  '🌈', '🐠', '🌙', '⭐', '🦝', '🌴', '🐧', '🍂', '🦌', '🐬',
  '🌊', '🦅', '🌵', '🐻', '🦢', '🌾', '🐥', '🦄', '🌹', '🦭',
  '🍄', '🦉', '🐇', '🐋', '🎐', '🐼', '🦀', '🐙', '🌠', '🌟',
]

const SPARK_COLORS = [
  '#ff5722', '#ff9800', '#ffc107', '#4caf50',
  '#2196f3', '#e91e63', '#9c27b0', '#00bcd4',
]

const MILESTONES = [
  { count: Math.round(GOAL * 0.2), icon: '🌱' },
  { count: Math.round(GOAL * 0.5), icon: '🌿' },
  { count: GOAL, icon: '🌳' },
]

function playCrystalSound() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
    if (!AudioContextClass) return
    const ctx = new AudioContextClass()
    const now = ctx.currentTime

    const osc1 = ctx.createOscillator()
    const osc2 = ctx.createOscillator()
    const gainNode = ctx.createGain()

    osc1.type = 'sine'
    osc1.frequency.setValueAtTime(1100 + Math.random() * 300, now)

    osc2.type = 'sine'
    osc2.frequency.setValueAtTime(2200 + Math.random() * 600, now)

    gainNode.gain.setValueAtTime(0.08, now)
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 1.0)

    osc1.connect(gainNode)
    osc2.connect(gainNode)
    gainNode.connect(ctx.destination)

    osc1.start(now)
    osc2.start(now)
    osc1.stop(now + 1.0)
    osc2.stop(now + 1.0)
  } catch (e) {
    console.error('Audio synthesis failed', e)
  }
}

type TooltipState = { index: number; x: number; y: number } | null

export function BloodTreeProgress() {
  const { t } = useTranslation()
  const [count, setCount] = useState<number | null>(null)
  const [prevCount, setPrevCount] = useState(0)
  const [animatedCount, setAnimatedCount] = useState(0)
  const animatedCountRef = useRef(0)
  const hasAnimatedRef = useRef(false)
  const [tooltip, setTooltip] = useState<TooltipState>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const particleLayerRef = useRef<SVGGElement>(null)
  const leafRefs = useRef<(SVGGElement | null)[]>(Array(GOAL).fill(null))

  useEffect(() => {
    void supabase
      .from('registration_counts')
      .select('count')
      .eq('event_year', EVENT_CONFIG.year)
      .maybeSingle()
      .then(({ data }) => {
        const c = data?.count ?? 0
        setCount(c)
        setPrevCount(c)
      })

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
          setCount((prev) => {
            setPrevCount(prev ?? 0)
            return row.count
          })
        },
      )
      .subscribe()

    return () => {
      void supabase.removeChannel(ch)
    }
  }, [])

  useEffect(() => {
    if (count === null) return

    const animateTo = (from: number, to: number, dur: number) => {
      const obj = { val: from }
      gsap.to(obj, {
        val: to,
        duration: dur,
        ease: 'power2.out',
        onUpdate: () => {
          const v = Math.round(obj.val)
          animatedCountRef.current = v
          setAnimatedCount(v)
        },
      })
    }

    if (!hasAnimatedRef.current) {
      const el = containerRef.current
      if (!el) return
      const { top, bottom } = el.getBoundingClientRect()
      if (top < window.innerHeight && bottom > 0) {
        hasAnimatedRef.current = true
        animateTo(0, count, count > 0 ? 1.4 : 0)
      } else {
        const obs = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              hasAnimatedRef.current = true
              animateTo(0, count, count > 0 ? 1.4 : 0)
              obs.disconnect()
            }
          },
          { threshold: 0.3 },
        )
        obs.observe(el)
        return () => obs.disconnect()
      }
    } else {
      animateTo(animatedCountRef.current, count, 0.7)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count])

  const spawnParticles = (cx: number, cy: number) => {
    const layer = particleLayerRef.current
    if (!layer) return
    const ns = 'http://www.w3.org/2000/svg'
    for (let p = 0; p < 10; p++) {
      const circle = document.createElementNS(ns, 'circle')
      const angle = (p / 10) * Math.PI * 2 + Math.random() * 0.5
      const dist = 18 + Math.random() * 22
      circle.setAttribute('cx', String(cx))
      circle.setAttribute('cy', String(cy))
      circle.setAttribute('r', String(2 + Math.random() * 2.5))
      circle.setAttribute('fill', SPARK_COLORS[p % SPARK_COLORS.length])
      circle.setAttribute('opacity', '1')
      layer.appendChild(circle)
      gsap.to(circle, {
        attr: {
          cx: cx + Math.cos(angle) * dist,
          cy: cy + Math.sin(angle) * dist,
          r: 0,
        },
        opacity: 0,
        duration: 0.65 + Math.random() * 0.35,
        ease: 'power2.out',
        onComplete: () => {
          if (layer.contains(circle)) layer.removeChild(circle)
        },
      })
    }
  }

  const { contextSafe } = useGSAP(
    () => {
      const displayCount = count ?? 0

      leafRefs.current.forEach((el, i) => {
        if (!el) return
        gsap.set(el, { transformBox: 'fill-box', transformOrigin: '50% 50%' })
        if (i >= displayCount) return

        // Continuous organic sway — staggered phase per leaf
        gsap.to(el, {
          rotation: `+=${(i % 2 === 0 ? 1 : -1) * (2.5 + (i % 4))}`,
          y: i % 2 === 0 ? 1.5 : -1.5,
          duration: 1.6 + (i % 7) * 0.22,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          delay: (i * 0.17) % 2.8,
        })
      })

      // Pop-in animation for newly registered leaves
      if (count !== null && count > prevCount) {
        for (let i = prevCount; i < Math.min(count, GOAL); i++) {
          const el = leafRefs.current[i]
          if (!el) continue
          const delay = (i - prevCount) * 0.09
          gsap.fromTo(
            el,
            { scale: 0 },
            { scale: 1, duration: 0.65, ease: 'back.out(2.2)', delay },
          )
          const [cx, cy] = LEAF_DATA[i]
          setTimeout(() => spawnParticles(cx, cy), delay * 1000 + 180)
        }
      }
    },
    { scope: containerRef, dependencies: [count], revertOnUpdate: true },
  )

  const handleLeafEnter = contextSafe((index: number, clientX: number, clientY: number) => {
    const el = leafRefs.current[index]
    if (!el) return
    gsap.to(el, { scale: 1.65, duration: 0.16, ease: 'power2.out' })
    setTooltip({ index, x: clientX, y: clientY })
  })

  const handleLeafLeave = contextSafe((index: number) => {
    const el = leafRefs.current[index]
    if (!el) return
    gsap.to(el, { scale: 1, duration: 0.5, ease: 'elastic.out(1, 0.45)' })
    setTooltip(null)
  })

  const handleLeafClick = contextSafe((index: number) => {
    const el = leafRefs.current[index]
    if (!el) return
    gsap.timeline()
      .to(el, { scale: 1.9, duration: 0.11, ease: 'power2.in' })
      .to(el, { scale: 0.82, duration: 0.09 })
      .to(el, { scale: 1.18, duration: 0.11 })
      .to(el, { scale: 1, duration: 0.22, ease: 'elastic.out(1, 0.75)' })
    const [cx, cy] = LEAF_DATA[index]
    spawnParticles(cx, cy)
    playCrystalSound()
  })

  const displayCount = count ?? 0
  const pct = Math.min((displayCount / GOAL) * 100, 100)
  const remaining = Math.max(GOAL - displayCount, 0)

  return (
    <section
      className="tree-section reveal"
      id="progress"
      style={{ '--tree-fill': pct / 100 } as React.CSSProperties}
    >
      <div ref={containerRef} style={{ position: 'relative' }}>
        {tooltip !== null && displayCount > tooltip.index && (
          <div
            className="leaf-tooltip"
            style={{
              left: tooltip.x + 14,
              top: tooltip.y - 72,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: '4px',
              padding: '8px 14px',
              borderRadius: '12px',
              maxWidth: '240px',
              whiteSpace: 'normal',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'bold' }}>
              <span className="leaf-tooltip-emoji">
                {LEAF_EMOJI[tooltip.index % LEAF_EMOJI.length]}
              </span>
              <span>{t('tree.participantNum', { n: tooltip.index + 1 })}</span>
            </div>
            <div style={{ fontSize: '0.75rem', opacity: 0.9, fontStyle: 'italic', lineHeight: '1.3' }}>
              {t(`tree.loveMessage.${tooltip.index % 10}`)}
            </div>
          </div>
        )}

        <div className="tree-header">
          <h2>{t('tree.title')}</h2>
          <p>{t('tree.subtitle')}</p>
        </div>

        <div className="tree-body">
          <div className="tree-svg-wrap">
            <svg
              className="blood-tree-svg"
              viewBox="0 0 300 360"
              aria-label={`${displayCount}/${GOAL}人申込済み`}
              role="img"
            >
              {/* Ground shadow */}
              <ellipse cx="150" cy="354" rx="52" ry="7" fill="#8d6e63" opacity="0.35" />

              {/* Trunk */}
              <line x1="150" y1="354" x2="150" y2="248" stroke="#6d4c41" strokeWidth="16" strokeLinecap="round" />

              {/* Left major branch */}
              <path d="M148,268 Q110,242 78,212 Q58,196 42,172" stroke="#6d4c41" fill="none" strokeWidth="8" strokeLinecap="round" />
              <path d="M42,172 Q28,155 25,135" stroke="#6d4c41" fill="none" strokeWidth="4" strokeLinecap="round" />
              <path d="M42,172 Q54,154 58,135" stroke="#6d4c41" fill="none" strokeWidth="4" strokeLinecap="round" />

              {/* Left minor branch */}
              <path d="M148,268 Q125,248 102,215" stroke="#6d4c41" fill="none" strokeWidth="6" strokeLinecap="round" />
              <path d="M102,215 Q92,192 88,165" stroke="#6d4c41" fill="none" strokeWidth="3" strokeLinecap="round" />
              <path d="M102,215 Q108,192 112,165" stroke="#6d4c41" fill="none" strokeWidth="3" strokeLinecap="round" />

              {/* Right major branch */}
              <path d="M152,268 Q190,242 222,212 Q242,196 258,172" stroke="#6d4c41" fill="none" strokeWidth="8" strokeLinecap="round" />
              <path d="M258,172 Q272,155 275,135" stroke="#6d4c41" fill="none" strokeWidth="4" strokeLinecap="round" />
              <path d="M258,172 Q246,154 242,135" stroke="#6d4c41" fill="none" strokeWidth="4" strokeLinecap="round" />

              {/* Right minor branch */}
              <path d="M152,268 Q175,248 198,215" stroke="#6d4c41" fill="none" strokeWidth="6" strokeLinecap="round" />
              <path d="M198,215 Q208,192 212,165" stroke="#6d4c41" fill="none" strokeWidth="3" strokeLinecap="round" />
              <path d="M198,215 Q192,192 188,165" stroke="#6d4c41" fill="none" strokeWidth="3" strokeLinecap="round" />

              {/* Center branch */}
              <line x1="150" y1="260" x2="148" y2="188" stroke="#6d4c41" strokeWidth="7" strokeLinecap="round" />
              <path d="M148,188 Q136,168 128,148" stroke="#6d4c41" fill="none" strokeWidth="4" strokeLinecap="round" />
              <path d="M148,188 Q160,168 168,148" stroke="#6d4c41" fill="none" strokeWidth="4" strokeLinecap="round" />
              <line x1="148" y1="188" x2="148" y2="148" stroke="#6d4c41" strokeWidth="3" strokeLinecap="round" />

              {/* Leaves */}
              {LEAF_DATA.map(([cx, cy, rot], i) => {
                const active = i < displayCount
                return (
                  <g
                    key={i}
                    ref={(el) => {
                      leafRefs.current[i] = el
                    }}
                    className={`tree-leaf-group ${active ? 'is-active' : ''}`}
                    transform={`translate(${cx},${cy}) rotate(${rot})`}
                    style={{ cursor: active ? 'pointer' : 'default' }}
                    tabIndex={active ? 0 : -1}
                    role={active ? 'button' : undefined}
                    aria-label={active ? t('tree.leafAriaLabel', { n: i + 1 }) : undefined}
                    onMouseEnter={
                      active
                        ? (e) => handleLeafEnter(i, e.clientX, e.clientY)
                        : undefined
                    }
                    onMouseLeave={active ? () => handleLeafLeave(i) : undefined}
                    onClick={active ? () => handleLeafClick(i) : undefined}
                    onKeyDown={
                      active
                        ? (e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault()
                              handleLeafClick(i)
                            }
                          }
                        : undefined
                    }
                  >
                    <ellipse
                      cx={0}
                      cy={0}
                      rx={11}
                      ry={6.5}
                      fill={active ? LEAF_COLORS[i % LEAF_COLORS.length] : '#d0d0d0'}
                      opacity={active ? 0.93 : 0.32}
                    />
                    {active && (
                      <line
                        x1={-8}
                        y1={0}
                        x2={8}
                        y2={0}
                        stroke="#1b5e20"
                        strokeWidth={0.75}
                        strokeLinecap="round"
                        opacity={0.4}
                      />
                    )}
                  </g>
                )
              })}

              {/* Particle burst layer — rendered on top */}
              <g ref={particleLayerRef} />
            </svg>

            {displayCount > 0 && (
              <p className="tree-click-hint">
                {displayCount >= GOAL ? '🎉' : '👆'}{' '}
                {displayCount >= GOAL ? t('tree.goalReached') : t('tree.clickHint')}
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
                <div className="tree-milestone-row" aria-hidden="true">
                  {MILESTONES.map((m) => (
                    <div
                      key={m.count}
                      className={`tree-ms-item ${displayCount >= m.count ? 'reached' : ''}`}
                      style={{ left: `${(m.count / GOAL) * 100}%` }}
                    >
                      <span className="tree-ms-icon">{m.icon}</span>
                    </div>
                  ))}
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
      </div>
    </section>
  )
}
