import { QRCodeSVG } from 'qrcode.react'
import { EVENT_CONFIG } from '../config/event'

const SITE_URL = 'https://kenketsu-web.vercel.app'

export function Flyer() {
  return (
    <div className="flyer-shell">
      <div className="flyer-page">

        {/* ── Header ── */}
        <header className="flyer-header">
          <div className="flyer-header-accent" />
          <div className="flyer-header-body">
            <div className="flyer-drop-icon" aria-hidden="true">
              <svg viewBox="0 0 48 64" fill="none">
                <path d="M24 4C24 4 4 28 4 42C4 53.046 13.059 62 24 62C34.941 62 44 53.046 44 42C44 28 24 4 24 4Z" fill="white" opacity="0.92"/>
                <path d="M18 46C18 42.686 20.686 40 24 40C27.314 40 30 42.686 30 46" stroke="rgba(206,0,23,0.5)" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
              </svg>
            </div>
            <div className="flyer-header-text">
              <p className="flyer-header-label">ECC社会貢献センター主催</p>
              <h1 className="flyer-title">献血ボランティア活動</h1>
              <p className="flyer-tagline">あなたの「血液」が、誰かの「命」をつなぐ</p>
            </div>
          </div>
        </header>

        {/* ── Event Info ── */}
        <section className="flyer-info-band">
          <div className="flyer-info-item">
            <span className="flyer-info-icon">📅</span>
            <div>
              <span className="flyer-info-label">日時</span>
              <strong>{EVENT_CONFIG.date}</strong>
              <span className="flyer-info-sub">{EVENT_CONFIG.time}</span>
            </div>
          </div>
          <div className="flyer-info-divider" />
          <div className="flyer-info-item">
            <span className="flyer-info-icon">📍</span>
            <div>
              <span className="flyer-info-label">場所</span>
              <strong>{EVENT_CONFIG.location}</strong>
              <span className="flyer-info-sub">{EVENT_CONFIG.locationDetail}</span>
            </div>
          </div>
          <div className="flyer-info-divider" />
          <div className="flyer-info-item">
            <span className="flyer-info-icon">👥</span>
            <div>
              <span className="flyer-info-label">定員</span>
              <strong>{EVENT_CONFIG.capacity}名</strong>
              <span className="flyer-info-sub">事前予約推奨</span>
            </div>
          </div>
        </section>

        {/* ── Main body ── */}
        <div className="flyer-body">

          {/* Left column */}
          <div className="flyer-col">

            {/* Gift badge */}
            <div className="flyer-gift-badge">
              <span className="flyer-gift-icon" aria-hidden="true">🎁</span>
              <div>
                <strong>献血記念品プレゼント</strong>
                <p>ライオンズクラブ様より、献血ご協力者全員に記念品を贈呈いたします。</p>
              </div>
            </div>

            {/* Benefits */}
            <div className="flyer-section">
              <h2 className="flyer-section-title">
                <span className="flyer-section-num">01</span>
                献血で得られること
              </h2>
              <ul className="flyer-benefits">
                <li>
                  <span className="flyer-benefit-icon">💉</span>
                  <div>
                    <strong>無料で血液検査が受けられる</strong>
                    <p>血液型・感染症・血球数などを無料チェック。結果は後日お知らせ。</p>
                  </div>
                </li>
                <li>
                  <span className="flyer-benefit-icon">❤️</span>
                  <div>
                    <strong>1回の献血で最大3人を救える</strong>
                    <p>分離された血液成分がそれぞれ別の患者さんの治療に使われます。</p>
                  </div>
                </li>
                <li>
                  <span className="flyer-benefit-icon">🌱</span>
                  <div>
                    <strong>社会貢献活動の一歩になる</strong>
                    <p>所要時間は約30〜60分。学生でも気軽に参加できます。</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Precautions */}
            <div className="flyer-section">
              <h2 className="flyer-section-title">
                <span className="flyer-section-num">02</span>
                参加前の注意事項
              </h2>
              <ul className="flyer-checks">
                <li>前日・当日は十分な睡眠と食事をとってください</li>
                <li>激しい運動・飲酒の翌日は献血できません</li>
                <li>来日から4週間以上経過している方が対象です</li>
                <li>体調が優れない方は参加をご遠慮ください</li>
                <li>問診は日本語で行います（外国人学生も参加可）</li>
              </ul>
            </div>
          </div>

          {/* Right column */}
          <div className="flyer-col flyer-col--right">

            {/* QR code */}
            <div className="flyer-qr-card">
              <p className="flyer-qr-label">詳細情報・事前申込はこちら</p>
              <div className="flyer-qr-code">
                <QRCodeSVG
                  value={SITE_URL}
                  size={160}
                  bgColor="#ffffff"
                  fgColor="#101828"
                  level="M"
                  marginSize={2}
                />
              </div>
              <p className="flyer-qr-url">{SITE_URL.replace('https://', '')}</p>
              <p className="flyer-qr-note">
                QRコードを読み取ると、<br />
                イベント情報・申込フォームに<br />
                アクセスできます。
              </p>
            </div>

            {/* Flow */}
            <div className="flyer-section">
              <h2 className="flyer-section-title">
                <span className="flyer-section-num">03</span>
                当日の流れ
              </h2>
              <ol className="flyer-flow">
                <li><span>受付・問診票記入</span></li>
                <li><span>医師による問診</span></li>
                <li><span>血圧・体重測定</span></li>
                <li><span>献血（約10〜15分）</span></li>
                <li><span>休憩・記念品受取</span></li>
              </ol>
            </div>

            {/* Sponsors */}
            <div className="flyer-sponsors">
              <p className="flyer-sponsors-label">主催・協力</p>
              <p className="flyer-sponsors-body">{EVENT_CONFIG.organizer}</p>
              <p className="flyer-sponsors-body">{EVENT_CONFIG.sponsor}</p>
              <p className="flyer-sponsors-body">日本赤十字社（後援）</p>
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <footer className="flyer-footer">
          <p>ご不明な点は当日スタッフまでお気軽にお声がけください</p>
        </footer>
      </div>

      {/* Print button (screen only) */}
      <button className="flyer-print-btn no-print" onClick={() => window.print()}>
        🖨️ 印刷 / Print
      </button>
    </div>
  )
}
