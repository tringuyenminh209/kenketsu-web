import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Icon, SiteHeader, usePageMotion } from '../lib/shared'
import { EVENT_CONFIG } from '../config/event'
import {
  fetchRegistrations,
  fetchSurveys,
  getSession,
  registrationsToCSV,
  signInAdmin,
  signOutAdmin,
  surveysToCSV,
} from '../lib/supabase'
import type { Registration, SurveyResponse } from '../types'
import { downloadCSV } from '../lib/utils'

export default function AdminPage() {
  const rootRef = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [surveys, setSurveys] = useState<SurveyResponse[]>([])
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

  const handleCsvExport = () => {
    const csv = registrationsToCSV(registrations)
    downloadCSV(csv, `registrations_${EVENT_CONFIG.year}.csv`)
  }

  const handleSurveyCsvExport = () => {
    const csv = surveysToCSV(surveys)
    downloadCSV(csv, `surveys_${EVENT_CONFIG.year}.csv`)
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

        <section className="admin-preview admin-page-panel reveal" style={{ marginTop: '2rem' }}>
          <div className="section-title">
            <Icon type="book" />
            <h2>アンケート回答データ</h2>
          </div>
          <div className="admin-content">
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>回答日時</th>
                    <th>献血回数</th>
                    <th>知ったきっかけ</th>
                    <th>自由回答・コメント</th>
                  </tr>
                </thead>
                <tbody>
                  {surveys.length === 0 ? (
                    <tr>
                      <td colSpan={4} style={{ textAlign: 'center', padding: '2rem' }}>
                        アンケート回答データがありません
                      </td>
                    </tr>
                  ) : (
                    surveys.map((row) => (
                      <tr key={row.id}>
                        <td>{new Date(row.created_at).toLocaleString('ja-JP')}</td>
                        <td>
                          {row.donation_count === 'first' ? '初めて' :
                           row.donation_count === 'few' ? '2〜4回' :
                           row.donation_count === 'many' ? '5回以上' : row.donation_count ?? '—'}
                        </td>
                        <td>
                          {row.how_found === 'poster' ? 'ポスター' :
                           row.how_found === 'teacher' ? '先生の紹介' :
                           row.how_found === 'friend' ? '友人の紹介' :
                           row.how_found === 'sns' ? 'SNS' : row.how_found ?? '—'}
                        </td>
                        <td style={{ whiteSpace: 'pre-line', fontSize: '0.85rem', textAlign: 'left' }}>
                          {row.comment ?? '—'}
                        </td>
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
                onClick={handleSurveyCsvExport}
                disabled={surveys.length === 0}
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
