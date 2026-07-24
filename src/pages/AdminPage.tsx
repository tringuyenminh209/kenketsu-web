import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Icon, SiteHeader, usePageMotion } from '../lib/shared'
import { EVENT_CONFIG, TIME_SLOTS } from '../config/event'
import {
  fetchRegistrations,
  fetchSurveys,
  getSession,
  parseStructuredComment,
  registrationsToRows,
  signInAdmin,
  signOutAdmin,
  surveysToRows,
} from '../lib/supabase'
import type { Registration, SurveyResponse } from '../types'
import { downloadXLSX } from '../lib/utils'

interface ChartDatum {
  label: string
  count: number
}

function countBy(values: string[]): ChartDatum[] {
  const counts = new Map<string, number>()
  for (const v of values) {
    if (!v || v === '—') continue
    counts.set(v, (counts.get(v) ?? 0) + 1)
  }
  return [...counts.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count)
}

function BarChart({ title, data }: { title: string; data: ChartDatum[] }) {
  const max = Math.max(1, ...data.map((d) => d.count))
  return (
    <div className="chart-block">
      <h3>{title}</h3>
      {data.length === 0 ? (
        <p className="chart-empty">データがありません</p>
      ) : (
        <div className="chart-bars">
          {data.map(({ label, count }) => (
            <div className="chart-bar-row" key={label}>
              <span className="chart-bar-label">{label}</span>
              <div className="chart-bar-track">
                <div className="chart-bar-fill" style={{ width: `${(count / max) * 100}%` }} />
              </div>
              <span className="chart-bar-value">{count}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function AdminPage() {
  const rootRef = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [surveys, setSurveys] = useState<SurveyResponse[]>([])
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginError, setLoginError] = useState<string | null>(null)
  const [loginSubmitting, setLoginSubmitting] = useState(false)
  usePageMotion(rootRef)

  useEffect(() => {
    getSession().then((session) => {
      if (session) {
        setIsAuthenticated(true)
        Promise.all([
          fetchRegistrations(EVENT_CONFIG.year),
          fetchSurveys(EVENT_CONFIG.year),
        ]).then(([regData, surveyData]) => {
          setRegistrations(regData)
          setSurveys(surveyData)
        })
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
      const [regData, surveyData] = await Promise.all([
        fetchRegistrations(EVENT_CONFIG.year),
        fetchSurveys(EVENT_CONFIG.year),
      ])
      setRegistrations(regData)
      setSurveys(surveyData)
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
    setSurveys([])
  }

  const handleRegistrationsExport = () => {
    const data = registrationsToRows(registrations)
    downloadXLSX(data, `registrations_${EVENT_CONFIG.year}.xlsx`, '申込データ')
  }

  const handleSurveyExport = () => {
    const data = surveysToRows(surveys)
    downloadXLSX(data, `surveys_${EVENT_CONFIG.year}.xlsx`, 'アンケート回答データ')
  }

  const surveyCharts = useMemo(() => {
    const donationLabel = (count: string | null) =>
      count === 'once' ? 'ある（1回）' :
      count === 'few' ? 'ある（2〜4回）' :
      count === 'many' ? 'ある（5回以上）' :
      count === 'none' ? 'ない' : ''

    const parsedRows = surveys.map((s) => parseStructuredComment(s.comment))

    return {
      q1: countBy(surveys.map((s) => donationLabel(s.donation_count))),
      q2: countBy(parsedRows.flatMap((p) => p.impressionsList)),
      q3: countBy(parsedRows.flatMap((p) => p.reasonsList)),
      q4: countBy(parsedRows.map((p) => p.knewCampus)),
      q5: countBy(parsedRows.map((p) => p.wantParticipate)),
      q6: countBy(parsedRows.flatMap((p) => p.conditionsList)),
      q7: countBy(parsedRows.map((p) => p.reservation)),
    }
  }, [surveys])

  // Registrations per time slot, kept in chronological order (not sorted
  // by count) so the schedule reads left-to-right like a timetable.
  const slotChart = useMemo(() => {
    const counts = new Map<string, number>()
    for (const r of registrations) {
      if (!r.time_slot) continue
      counts.set(r.time_slot, (counts.get(r.time_slot) ?? 0) + 1)
    }
    return TIME_SLOTS.map((slot) => ({
      slot,
      label: slot.replace('-', '～'),
      count: counts.get(slot) ?? 0,
    }))
  }, [registrations])

  const selectedSlotRegistrants = useMemo(
    () => (selectedSlot ? registrations.filter((r) => r.time_slot === selectedSlot) : []),
    [registrations, selectedSlot],
  )

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
            <p>申込状況、Excel出力を確認するための管理者向け画面です。</p>
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
            <span>アンケート回答数</span>
            <strong>{surveys.length}</strong>
            <small>申込者のうち回答した人数</small>
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
          <div className="admin-panel-header">
            <div className="section-title">
              <Icon type="chart" />
              <h2>申込データ</h2>
            </div>
            <button
              className="button outline"
              type="button"
              onClick={handleRegistrationsExport}
              disabled={registrations.length === 0}
            >
              Excelエクスポート
            </button>
          </div>
          <div className="chart-grid">
            <div className="chart-block chart-block--wide">
              <h3>受付希望時間ごとの申込数（クリックで内訳を表示）</h3>
              <div className="chart-bars">
                {slotChart.map(({ slot, label, count }) => (
                  <button
                    type="button"
                    key={slot}
                    className={`chart-bar-row chart-bar-row--clickable${selectedSlot === slot ? ' is-selected' : ''}`}
                    onClick={() => setSelectedSlot(selectedSlot === slot ? null : slot)}
                  >
                    <span className="chart-bar-label">{label}</span>
                    <div className="chart-bar-track">
                      <div
                        className="chart-bar-fill"
                        style={{ width: `${(count / EVENT_CONFIG.slotCapacity) * 100}%` }}
                      />
                    </div>
                    <span className="chart-bar-value">{count}/{EVENT_CONFIG.slotCapacity}</span>
                  </button>
                ))}
              </div>
              {selectedSlot && (
                <div className="slot-detail">
                  <div className="slot-detail-header">
                    <strong>{selectedSlot.replace('-', '～')} の申込者（{selectedSlotRegistrants.length}名）</strong>
                    <button type="button" className="slot-detail-close" onClick={() => setSelectedSlot(null)}>✕</button>
                  </div>
                  {selectedSlotRegistrants.length === 0 ? (
                    <p className="chart-empty">この時間帯の申込者はいません</p>
                  ) : (
                    <div className="table-wrap">
                      <table>
                        <thead>
                          <tr>
                            <th>学生番号</th>
                            <th>氏名</th>
                            <th>フリガナ</th>
                            <th>学校名</th>
                            <th>所属</th>
                            <th>電話番号</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedSlotRegistrants.map((r) => (
                            <tr key={r.id}>
                              <td>{r.student_id}</td>
                              <td>{r.name}</td>
                              <td>{r.furigana ?? '—'}</td>
                              <td>{r.school ?? '—'}</td>
                              <td>{r.class}</td>
                              <td>{r.phone ?? '—'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="admin-content">
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>申込日時</th>
                    <th>学生番号</th>
                    <th>氏名</th>
                    <th>フリガナ</th>
                    <th>学校名</th>
                    <th>所属</th>
                    <th>メール</th>
                    <th>電話番号</th>
                    <th>生年月日</th>
                    <th>性別</th>
                    <th>受付希望時間</th>
                    <th>献血経験</th>
                  </tr>
                </thead>
                <tbody>
                  {registrations.length === 0 ? (
                    <tr>
                      <td colSpan={12} style={{ textAlign: 'center', padding: '2rem' }}>
                        申込データがありません
                      </td>
                    </tr>
                  ) : (
                    registrations.map((row) => {
                      const genderLabel = row.gender === 'male' ? '男性' :
                                          row.gender === 'female' ? '女性' :
                                          row.gender === 'other' ? 'その他' :
                                          row.gender === 'no_answer' ? '回答しない' : row.gender ?? '—';
                      const experienceLabel = row.donation_experience === 'yes' ? 'ある' :
                                              row.donation_experience === 'no' ? 'ない' : row.donation_experience ?? '—';
                      return (
                        <tr key={row.id}>
                          <td>{new Date(row.created_at).toLocaleString('ja-JP')}</td>
                          <td>{row.student_id}</td>
                          <td>{row.name}</td>
                          <td>{row.furigana ?? '—'}</td>
                          <td>{row.school ?? '—'}</td>
                          <td>{row.class}</td>
                          <td>{row.email ?? '—'}</td>
                          <td>{row.phone ?? '—'}</td>
                          <td>{row.birth_date ?? '—'}</td>
                          <td>{genderLabel}</td>
                          <td>{row.time_slot?.replace('-', '～') ?? '—'}</td>
                          <td>{experienceLabel}</td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="admin-preview admin-page-panel reveal" style={{ marginTop: '2rem' }}>
          <div className="admin-panel-header">
            <div className="section-title">
              <Icon type="book" />
              <h2>アンケート回答データ</h2>
            </div>
            <button
              className="button outline"
              type="button"
              onClick={handleSurveyExport}
              disabled={surveys.length === 0}
            >
              Excelエクスポート
            </button>
          </div>
          <div className="chart-grid">
            <BarChart title="Q1. 献血経験" data={surveyCharts.q1} />
            <BarChart title="Q2. 印象（複数回答）" data={surveyCharts.q2} />
            {surveyCharts.q3.length > 0 && (
              <BarChart title="Q3. 未経験の理由（複数回答）" data={surveyCharts.q3} />
            )}
            <BarChart title="Q4. 学内献血を知っていたか" data={surveyCharts.q4} />
            <BarChart title="Q5. 参加意向" data={surveyCharts.q5} />
            <BarChart title="Q6. 参加しやすくなる条件（複数回答）" data={surveyCharts.q6} />
            <BarChart title="Q7. 事前予約について" data={surveyCharts.q7} />
          </div>
          <div className="admin-content">
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>回答日時</th>
                    <th>献血経験</th>
                    <th>印象</th>
                    <th>印象その他</th>
                    <th>未経験の理由</th>
                    <th>未経験理由その他</th>
                    <th>学内献血を知っていたか</th>
                    <th>参加意向</th>
                    <th>参加しやすくなる条件</th>
                    <th>条件その他</th>
                    <th>事前予約</th>
                  </tr>
                </thead>
                <tbody>
                  {surveys.length === 0 ? (
                    <tr>
                      <td colSpan={11} style={{ textAlign: 'center', padding: '2rem' }}>
                        アンケート回答データがありません
                      </td>
                    </tr>
                  ) : (
                    surveys.map((row) => {
                      const parsed = parseStructuredComment(row.comment)
                      const countLabel = row.donation_count === 'once' ? 'ある（1回）' :
                                         row.donation_count === 'few' ? 'ある（2〜4回）' :
                                         row.donation_count === 'many' ? 'ある（5回以上）' :
                                         row.donation_count === 'none' ? 'ない' : row.donation_count ?? '—';
                      return (
                        <tr key={row.id}>
                          <td>{new Date(row.created_at).toLocaleString('ja-JP')}</td>
                          <td>{countLabel}</td>
                          <td>{parsed.impressions}</td>
                          <td>{parsed.impressionsOther}</td>
                          <td>{parsed.reasons}</td>
                          <td>{parsed.reasonsOther}</td>
                          <td>{parsed.knewCampus}</td>
                          <td>{parsed.wantParticipate}</td>
                          <td>{parsed.conditions}</td>
                          <td>{parsed.conditionsOther}</td>
                          <td>{parsed.reservation}</td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
