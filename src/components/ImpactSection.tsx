import { useEffect, useRef, useState } from 'react'
import heroImage from '../assets/blood-donation-hero.png'

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
  return <>{val.toLocaleString('ja-JP')}</>
}

const WHO_NEEDS = [
  {
    title: '手術・緊急救命',
    body: '交通事故や急な手術では短時間で大量の血液が必要になります。血がなければ助けられない命があります。',
    overlay: 'linear-gradient(160deg, rgba(160,10,10,0.80) 0%, rgba(80,0,0,0.85) 100%)',
    bgPos: 'center top',
  },
  {
    title: 'がん・血液疾患',
    body: '抗がん剤治療や白血病では、血小板や赤血球の継続的な補充が治療の前提条件になります。',
    overlay: 'linear-gradient(160deg, rgba(90,10,140,0.80) 0%, rgba(40,0,80,0.85) 100%)',
    bgPos: 'right center',
  },
  {
    title: '出産・新生児',
    body: '分娩時の大量出血や、早産で生まれた赤ちゃんへの輸血は、命を守るための最前線です。',
    overlay: 'linear-gradient(160deg, rgba(10,60,140,0.80) 0%, rgba(0,30,90,0.85) 100%)',
    bgPos: 'left center',
  },
  {
    title: '慢性疾患・長期治療',
    body: '腎臓病・再生不良性貧血など、長期にわたる治療を続けるために血液が定期的に必要です。',
    overlay: 'linear-gradient(160deg, rgba(10,90,60,0.80) 0%, rgba(0,50,30,0.85) 100%)',
    bgPos: 'center bottom',
  },
]

const JOURNEY = [
  {
    num: '01',
    title: '受付・問診',
    sub: '体調・体重を確認（約5分）',
    icon: (
      <svg viewBox="0 0 40 40" aria-hidden="true">
        <circle cx="20" cy="13" r="7" strokeWidth="2.5" />
        <path d="M6 38c0-7.7 6.3-14 14-14s14 6.3 14 14" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    num: '02',
    title: '採血',
    sub: '全血で約10〜15分',
    icon: (
      <svg viewBox="0 0 40 40" aria-hidden="true">
        <path d="M20 4C20 4 10 16 10 24a10 10 0 0 0 20 0C30 16 20 4 20 4Z" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M14 26a6 6 0 0 0 8 4" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    num: '03',
    title: '検査・成分分離',
    sub: '24時間以内に安全確認',
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
    title: '患者さんへ届く',
    sub: '全国の病院・手術室へ',
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
  return (
    <svg className="trust-redcross-logo" viewBox="0 0 48 48" aria-label="日本赤十字社">
      <rect width="48" height="48" rx="4" fill="#ce0017" />
      <rect x="18" y="8" width="12" height="32" fill="white" />
      <rect x="8" y="18" width="32" height="12" fill="white" />
    </svg>
  )
}

export function ImpactSection() {
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

  return (
    <>
      {/* ── Stat numbers ─────────────────────────── */}
      <div className="impact-stats reveal" ref={statsRef}>
        <div className="impact-stat-inner">
          <p className="impact-stat-eyebrow">1回の献血で救える</p>
          <div className="impact-stat-num">
            <CountUp to={3} active={statsActive} duration={900} />
            <span className="impact-stat-unit">人</span>
          </div>
          <p className="impact-stat-desc">血液は成分に分けて複数の患者さんに使われます</p>
        </div>
        <div className="impact-stat-divider" />
        <div className="impact-stat-inner">
          <p className="impact-stat-eyebrow">血小板の保存期限</p>
          <div className="impact-stat-num">
            <CountUp to={4} active={statsActive} duration={700} />
            <span className="impact-stat-unit">日</span>
          </div>
          <p className="impact-stat-desc">だから毎日、新しい献血が必要とされています</p>
        </div>
        <div className="impact-stat-divider" />
        <div className="impact-stat-inner">
          <p className="impact-stat-eyebrow">年間輸血が必要な人</p>
          <div className="impact-stat-num">
            <CountUp to={500} active={statsActive} duration={1400} />
            <span className="impact-stat-unit">万人</span>
          </div>
          <p className="impact-stat-desc">手術・がん・出産・事故など日常の医療を支えています</p>
        </div>
      </div>

      {/* ── Who needs blood ──────────────────────── */}
      <section className="impact-who reveal">
        <div className="impact-who-lead">
          <span className="impact-label">あなたの血は、誰のもとへ？</span>
          <h2>輸血が必要な人たちの現実</h2>
          <p>「病院」「手術」というのは他人事ではありません。毎日、何千人もの人が輸血を必要としています。</p>
        </div>
        <div className="impact-who-grid">
          {WHO_NEEDS.map((item) => (
            <div
              key={item.title}
              className="who-card"
              style={{ '--card-overlay': item.overlay, '--card-bg-pos': item.bgPos } as React.CSSProperties}
            >
              <div
                className="who-card-photo"
                style={{ backgroundImage: `url(${heroImage})` }}
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
          <span className="impact-label">献血から患者さんの元へ</span>
          <h2>あなたの血が届くまで</h2>
        </div>
        <div className="journey-steps">
          {JOURNEY.map((step, i) => (
            <div className="journey-step" key={step.num}>
              <div className="journey-icon">{step.icon}</div>
              <div className="journey-num">{step.num}</div>
              <strong>{step.title}</strong>
              <p>{step.sub}</p>
              {i < JOURNEY.length - 1 && <div className="journey-arrow" aria-hidden="true" />}
            </div>
          ))}
        </div>
      </section>

      {/* ── Trust ────────────────────────────────── */}
      <section className="impact-trust reveal">
        <p className="impact-trust-label">このイベントは正式な機関と連携した安全な献血活動です</p>
        <div className="trust-orgs">
          <div className="trust-org">
            <RedCrossLogo />
            <div>
              <strong>日本赤十字社</strong>
              <span>山口県赤十字血液センター</span>
              <span className="trust-role">血液管理・安全保証</span>
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
              <strong>ECC コンピュータ専門学校</strong>
              <span>山口学園 ECC専門学校</span>
              <span className="trust-role">会場提供・共催</span>
            </div>
          </div>
          <div className="trust-divider" />
          <div className="trust-org trust-hotline">
            <div className="trust-phone-icon">
              <svg viewBox="0 0 48 48" aria-hidden="true">
                <path d="M10 8h8l3 9-4.5 2.5A20 20 0 0 0 30.5 33.5L33 29l9 3v8a2 2 0 0 1-2 2C14 42 6 14 8 10a2 2 0 0 1 2-2Z" strokeWidth="2.5" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <strong>献血相談窓口</strong>
              <a className="trust-phone" href="tel:0120326759">0120-326-759</a>
              <span className="trust-role">月〜土 9:00〜17:30（無料）</span>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
