import { useEffect, useRef, useState, type RefObject } from 'react'
import { BrowserRouter, Link, NavLink, Route, Routes } from 'react-router-dom'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import heroImage from './assets/blood-donation-hero.png'
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
import './App.css'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const eventInfo = [
  { label: '開催日', value: EVENT_CONFIG.date },
  { label: '時間', value: EVENT_CONFIG.time },
  { label: '会場', value: `${EVENT_CONFIG.location} ${EVENT_CONFIG.locationDetail}` },
  { label: '定員', value: `先着${EVENT_CONFIG.capacity}名` },
]

const eligibility = [
  '16歳から69歳まで（65歳以上は献血経験がある方）',
  '男性45kg以上、女性40kg以上',
  '当日の体調が良好で、十分な睡眠を取っていること',
]

const steps = [
  ['事前チェック', '条件と体調を確認'],
  ['問診・検査', 'スタッフが安全を確認'],
  ['採血', '約10-15分で完了'],
]

const knowledgeCards = [
  {
    title: '献血は医療を支える社会インフラ',
    text: '手術、出産時の大量出血、がん治療など、輸血を必要とする場面は日々あります。血液は人工的につくれず、長期保存もできません。',
    detail:
      '病院では、毎日のように輸血を必要とする治療があります。血液は薬のように工場でつくれないため、地域の人たちの協力が医療現場を支えています。',
    imagePosition: 'center',
  },
  {
    title: '一回の協力が複数の患者さんへ',
    text: '献血された血液は成分ごとに分けられ、赤血球・血小板・血漿などとして必要な患者さんに届けられます。',
    detail:
      '献血された血液は、必要な成分ごとに分けて使われます。だから一人の協力が、複数の患者さんの治療につながることがあります。',
    imagePosition: 'right center',
  },
  {
    title: '若い世代の参加が未来を守る',
    text: '少子高齢化で献血できる人は減り、輸血を必要とする人は増えます。学生の参加は地域医療の継続につながります。',
    detail:
      '若い世代が献血を知り、参加する文化を持つことは、これからの医療を守る力になります。今回参加しなくても、知って伝えることから始められます。',
    imagePosition: 'center top',
  },
]

const benefits = [
  {
    title: '自分の体調を見直すきっかけ',
    text: '受付時の確認や事前チェックを通じて、健康への意識が高まります。',
    detail:
      '献血前には体調、睡眠、食事、血圧などを確認します。これは「献血できるか」を判断するだけでなく、自分の生活習慣や健康状態に目を向ける良い機会になります。',
    imagePosition: 'center',
  },
  {
    title: '命を支える実感',
    text: '短い時間の協力が、誰かの治療や回復を支える力になります。',
    detail:
      '血液は人工的につくることができず、長期保存もできません。あなたの協力は、手術、事故、出産、がん治療などで輸血を必要とする人を支える現実的な力になります。',
    imagePosition: 'right center',
  },
  {
    title: 'キャンパスの連帯感',
    text: '友人や教職員と一緒に参加することで、助け合いの文化を広げられます。',
    detail:
      '一人では不安でも、友人や先生と一緒なら参加しやすくなります。イベントとして取り組むことで、学校全体に「困っている誰かを支える」空気が生まれます。',
    imagePosition: 'center top',
  },
  {
    title: '社会貢献の第一歩',
    text: '難しい準備がなくても、身近な場所から医療支援に参加できます。',
    detail:
      '社会貢献は大きな活動だけではありません。身近なキャンパスで参加し、正しい情報を周りに届けることも、地域医療を支える大切な行動です。',
    imagePosition: 'left center',
  },
]

const pledgeItems = [
  '正しい知識を知り、不安を一人で抱え込まない',
  '参加できる人は一歩踏み出し、参加できない人も周りへ情報を届ける',
  '献血を一回のイベントではなく、継続的な思いやりの文化にする',
]

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
  const [language, setLanguage] = useState(i18n.language?.slice(0, 2) || 'ja')

  return (
    <header className="site-header">
      <Link className="brand" to="/" aria-label="Campus Care top">
        <span className="brand-mark">+</span>
        <span>
          <strong>Campus Care</strong>
          <small>献血ボランティアイベント</small>
        </span>
      </Link>
      <nav className="nav-links" aria-label="メインナビゲーション">
        {isAdmin ? (
          <>
            <NavLink to="/">ユーザーサイト</NavLink>
            <NavLink to="/admin">管理</NavLink>
          </>
        ) : (
          <>
            <a href="#knowledge">知る</a>
            <a href="#benefits">メリット</a>
            <a href="#info">イベント情報</a>
            <a href="#register">参加申込</a>
            <a href="#survey">アンケート</a>
            <NavLink to="/admin">管理</NavLink>
          </>
        )}
      </nav>
      <label className="language-select" aria-label="言語切替">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM3.6 9h16.8M3.6 15h16.8M12 3c2.2 2.3 3.4 5.3 3.4 9s-1.2 6.7-3.4 9M12 3C9.8 5.3 8.6 8.3 8.6 12s1.2 6.7 3.4 9" />
        </svg>
        <select
          value={language}
          onChange={(e) => {
            setLanguage(e.target.value)
            i18n.changeLanguage(e.target.value)
          }}
        >
          <option value="ja">日本語</option>
          <option value="my">Myanmar</option>
          <option value="ne">Nepali</option>
          <option value="zh">中文</option>
        </select>
      </label>
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
  const [selectedKnowledge, setSelectedKnowledge] = useState(0)
  const [selectedBenefit, setSelectedBenefit] = useState(0)
  const rootRef = useRef<HTMLDivElement>(null)
  const knowledgeDetailRef = useRef<HTMLElement>(null)
  const benefitDetailRef = useRef<HTMLElement>(null)
  usePageMotion(rootRef)
  const activeKnowledge = knowledgeCards[selectedKnowledge]
  const activeBenefit = benefits[selectedBenefit]

  // ── 参加申込フォーム ──────────────────────────────
  const [regForm, setRegForm] = useState({
    name: '', email: '', studentId: '', phone: '', department: '', birthDate: '', gender: '',
  })
  const [regSubmitting, setRegSubmitting] = useState(false)
  const [regSuccess, setRegSuccess] = useState(false)
  const [regError, setRegError] = useState<string | null>(null)

  // ── アンケートフォーム ────────────────────────────
  const [surveyForm, setSurveyForm] = useState({
    donationCount: 'first', howFound: 'poster', comment: '',
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
      const isDuplicate = await checkDuplicateRegistration(regForm.studentId, EVENT_CONFIG.year)
      if (isDuplicate) {
        setRegError('この学生番号はすでに申込済みです。')
        return
      }
      await insertRegistration({
        event_year: EVENT_CONFIG.year,
        student_id: regForm.studentId,
        name: regForm.name,
        class: regForm.department,
        email: regForm.email || undefined,
        phone: regForm.phone || undefined,
        birth_date: regForm.birthDate || undefined,
        gender: regForm.gender || undefined,
      })
      setRegSuccess(true)
    } catch {
      setRegError('エラーが発生しました。もう一度お試しください。')
    } finally {
      setRegSubmitting(false)
    }
  }

  const handleSurveySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSurveySubmitting(true)
    setSurveyError(null)
    try {
      await insertSurvey({
        event_year: EVENT_CONFIG.year,
        donation_count: surveyForm.donationCount,
        how_found: surveyForm.howFound,
        comment: surveyForm.comment || undefined,
      })
      setSurveySuccess(true)
    } catch {
      setSurveyError('エラーが発生しました。もう一度お試しください。')
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
            <h1 id="hero-title">献血ボランティアイベント</h1>
            <p className="hero-lead">知ることから、支える一歩へ。あなたのやさしさが誰かの明日をつくります。</p>
            <div className="hero-actions">
              <a className="button primary" href="#register">参加申込はこちら</a>
              <a className="button secondary" href="#knowledge">献血について知る</a>
            </div>
            <div className="impact-row" aria-label="イベントの特徴">
              <article>
                <Icon type="heart" />
                <strong>命をつなぐ</strong>
                <span>多くの患者さんを支えます</span>
              </article>
              <article>
                <Icon type="book" />
                <strong>正しく知る</strong>
                <span>不安を知識に変えます</span>
              </article>
              <article>
                <Icon type="users" />
                <strong>みんなで広げる</strong>
                <span>キャンパスから社会貢献</span>
              </article>
            </div>
          </div>
          <figure className="hero-media">
            <img src={heroImage} alt="学校の献血会場で学生が安心して献血に参加している様子" />
          </figure>
        </section>

        <section className="knowledge-section reveal" id="knowledge">
          <div className="knowledge-lead">
            <Icon type="book" />
            <h2>献血を知ることは、命を支える準備です。</h2>
            <p>
              献血は特別な人だけの活動ではありません。正しい知識を持つことで、不安は小さくなり、参加できる人も、周りへ伝える人も、地域医療を支える仲間になります。
            </p>
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
                <small>詳しく読む</small>
              </button>
            ))}
          </div>
          <article className="knowledge-detail" aria-live="polite" ref={knowledgeDetailRef}>
            <div
              className="knowledge-detail-image"
              style={{
                backgroundImage: `url(${heroImage})`,
                backgroundPosition: activeKnowledge.imagePosition,
              }}
              role="img"
              aria-label={`${activeKnowledge.title}の説明イメージ`}
            />
            <div>
              <span className="detail-label">いま読んでいる内容</span>
              <h3>{activeKnowledge.title}</h3>
              <p>{activeKnowledge.detail}</p>
              <a className="text-link" href="#benefits">献血でできる貢献も見る</a>
            </div>
          </article>
        </section>

        <section className="benefits-section" id="benefits">
          <div className="section-title">
            <Icon type="spark" />
            <h2>献血が生むメリットと社会への貢献</h2>
          </div>
          <p className="section-helper">気になるカードを選ぶと、写真と一緒に詳しい説明を確認できます。</p>
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
                    backgroundImage: `url(${heroImage})`,
                    backgroundPosition: benefit.imagePosition,
                  }}
                />
                <span className="benefit-card-body">
                  <strong>{benefit.title}</strong>
                  <p>{benefit.text}</p>
                  <span className="benefit-card-action">詳しく見る</span>
                </span>
              </button>
            ))}
          </div>
          <article className="benefit-detail" aria-live="polite" ref={benefitDetailRef}>
            <div
              className="benefit-detail-image"
              style={{
                backgroundImage: `url(${heroImage})`,
                backgroundPosition: activeBenefit.imagePosition,
              }}
              role="img"
              aria-label={`${activeBenefit.title}の説明イメージ`}
            />
            <div>
              <span className="detail-label">選択中の内容</span>
              <h3>{activeBenefit.title}</h3>
              <p>{activeBenefit.detail}</p>
              <a className="text-link" href="#register">この内容を理解して参加申込へ進む</a>
            </div>
          </article>
        </section>

        <section className="info-strip reveal" id="info" aria-label="イベント情報">
          <div className="section-title compact">
            <Icon type="calendar" />
            <h2>イベント情報</h2>
          </div>
          <dl>
            {eventInfo.map((item) => (
              <div key={item.label}>
                <dt>{item.label}</dt>
                <dd>{item.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="reason-grid reveal" id="reason">
          <article className="reason-story motion-card">
            <div className="reason-visual">
              <img src={heroImage} alt="献血会場で学生が安心して参加している様子" />
            </div>
            <div>
              <Icon type="heart" />
              <h2>なぜ献血が必要？</h2>
              <p>
                血液は人工的につくることができず、長く保存することもできません。だからこそ、手術や治療で輸血を必要とする人のために、日々の協力が必要です。
              </p>
              <a href="#benefits">メリットと貢献を詳しく見る</a>
            </div>
          </article>
          <article className="reason-process motion-card">
            <div className="section-title">
              <Icon type="shield" />
              <h2>安全で安心の献血</h2>
            </div>
            <p className="reason-note">
              はじめての人でも流れを理解できるよう、当日はスタッフが一つずつ確認します。不安な点はその場で相談できます。
            </p>
            <ol className="step-list">
              {steps.map(([title, text]) => (
                <li key={title}>
                  <span>{title}</span>
                  <small>{text}</small>
                </li>
              ))}
            </ol>
          </article>
          <article className="reason-community motion-card">
            <Icon type="users" />
            <h2>みんなで支える社会貢献</h2>
            <p>
              参加できる人は献血で、参加できない人も情報共有で貢献できます。一人の行動が、キャンパス全体の思いやりを広げます。
            </p>
            <ul>
              <li>友人に正しい情報を伝える</li>
              <li>不安な人と一緒に説明を聞く</li>
              <li>次回も続く献血文化をつくる</li>
            </ul>
          </article>
        </section>

        <section className="pledge-section reveal">
          <div>
            <Icon type="heart" />
            <h2>キャンパスから広げる献血文化</h2>
          </div>
          <ul>
            {pledgeItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="work-area reveal">
          {regSuccess ? (
            <div className="panel register-panel motion-card success-panel">
              <Icon type="heart" />
              <h2>申込を受け付けました！</h2>
              <p>ご参加ありがとうございます。当日スタッフがお待ちしております。</p>
            </div>
          ) : (
            <form
              className="panel register-panel motion-card"
              id="register"
              onSubmit={handleRegSubmit}
            >
              <div className="section-title">
                <Icon type="users" />
                <h2>参加申込</h2>
              </div>
              <div className="form-grid">
                <label>
                  氏名 <span>必須</span>
                  <input
                    required
                    placeholder="例）山田 太郎"
                    value={regForm.name}
                    onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                  />
                </label>
                <label>
                  メールアドレス <span>必須</span>
                  <input
                    required
                    type="email"
                    placeholder="example@school.ac.jp"
                    value={regForm.email}
                    onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                  />
                </label>
                <label>
                  学生番号 / 教職員番号 <span>必須</span>
                  <input
                    required
                    placeholder="例）S1234567"
                    value={regForm.studentId}
                    onChange={(e) => setRegForm({ ...regForm, studentId: e.target.value })}
                  />
                </label>
                <label>
                  電話番号 <span>必須</span>
                  <input
                    required
                    inputMode="tel"
                    placeholder="090-1234-5678"
                    value={regForm.phone}
                    onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                  />
                </label>
                <label>
                  所属 <span>必須</span>
                  <select
                    required
                    value={regForm.department}
                    onChange={(e) => setRegForm({ ...regForm, department: e.target.value })}
                  >
                    <option value="" disabled>選択してください</option>
                    <option value="ITカレッジ">ITカレッジ</option>
                    <option value="電子工学科">電子工学科</option>
                    <option value="自動車工学科">自動車工学科</option>
                    <option value="教職員">教職員</option>
                  </select>
                </label>
                <label>
                  生年月日 <span>必須</span>
                  <input
                    required
                    type="date"
                    value={regForm.birthDate}
                    onChange={(e) => setRegForm({ ...regForm, birthDate: e.target.value })}
                  />
                </label>
              </div>
              <fieldset>
                <legend>性別</legend>
                {(['male', 'female', 'other', 'no_answer'] as const).map((val, i) => (
                  <label key={val}>
                    <input
                      name="gender"
                      type="radio"
                      value={val}
                      checked={regForm.gender === val}
                      onChange={(e) => setRegForm({ ...regForm, gender: e.target.value })}
                    />
                    {['男性', '女性', 'その他', '回答しない'][i]}
                  </label>
                ))}
              </fieldset>
              {regError && <p className="error-message">{regError}</p>}
              <button className="button primary wide" type="submit" disabled={regSubmitting}>
                {regSubmitting ? '送信中...' : '確認画面へ進む'}
              </button>
            </form>
          )}

          <aside className="panel gentle-precautions motion-card" id="precautions">
            <div className="section-title calm">
              <Icon type="shield" />
              <h2>参加前に、無理なく確認しておきたいこと</h2>
            </div>
            <p className="precaution-intro">
              これは厳しい注意ではなく、あなた自身の体調を守るための確認です。不安なことがあれば、当日スタッフにそのまま相談してください。
            </p>
            <h3>参加前のめやす</h3>
            <ul className="check-list">
              {eligibility.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <h3>当日はこのくらいで大丈夫です</h3>
            <p>前日は十分な睡眠を取り、食事を済ませてください。発熱や体調不良がある場合は参加を控えてください。</p>
            <a className="text-link" href="#survey">参加後アンケートへ</a>
          </aside>

          {surveySuccess ? (
            <div className="panel survey-panel motion-card success-panel">
              <Icon type="heart" />
              <h2>ご回答ありがとうございました！</h2>
              <p>いただいたご意見を今後のサイト改善に役立てます。</p>
            </div>
          ) : (
            <form
              className="panel survey-panel motion-card"
              id="survey"
              onSubmit={handleSurveySubmit}
            >
              <div className="section-title">
                <Icon type="heart" />
                <h2>アンケート</h2>
              </div>
              <label>
                Q1. 献血は何回目ですか？
                <select
                  value={surveyForm.donationCount}
                  onChange={(e) => setSurveyForm({ ...surveyForm, donationCount: e.target.value })}
                >
                  <option value="first">初めて</option>
                  <option value="few">2〜4回目</option>
                  <option value="many">5回以上</option>
                </select>
              </label>
              <label>
                Q2. このイベントを何で知りましたか？
                <select
                  value={surveyForm.howFound}
                  onChange={(e) => setSurveyForm({ ...surveyForm, howFound: e.target.value })}
                >
                  <option value="poster">学校の掲示</option>
                  <option value="teacher">先生・職員からの案内</option>
                  <option value="friend">友人からの紹介</option>
                  <option value="sns">SNS</option>
                </select>
              </label>
              <label>
                Q3. 不安や質問があれば教えてください
                <textarea
                  rows={4}
                  placeholder="例）痛みはありますか？時間はどのくらいですか？"
                  value={surveyForm.comment}
                  onChange={(e) => setSurveyForm({ ...surveyForm, comment: e.target.value })}
                />
              </label>
              {surveyError && <p className="error-message">{surveyError}</p>}
              <button className="button primary wide" type="submit" disabled={surveySubmitting}>
                {surveySubmitting ? '送信中...' : 'アンケートを送信する'}
              </button>
            </form>
          )}
        </section>

        <footer className="final-cta reveal">
          <h2>一人ではなく、キャンパスみんなで支える献血へ。</h2>
          <a className="button primary" href="#register">参加申込へ戻る</a>
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
