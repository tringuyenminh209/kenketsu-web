import { QRCodeSVG } from 'qrcode.react'
import { EVENT_CONFIG } from '../config/event'

const SITE_URL = 'https://kenketsu-web.vercel.app'

export function Flyer() {
  return (
    <div className="flyer-shell">
      <div className="flyer-page">

        {/* ── Hero ── */}
        <div className="flyer-hero">
          <div className="flyer-hero-bg" aria-hidden="true">
            <svg className="flyer-hero-drop" viewBox="0 0 120 160" fill="none">
              <path d="M60 8C60 8 8 72 8 108C8 136.719 31.386 160 60 160C88.614 160 112 136.719 112 108C112 72 60 8 60 8Z" fill="rgba(255,255,255,0.10)"/>
              <path d="M60 8C60 8 8 72 8 108C8 136.719 31.386 160 60 160C88.614 160 112 136.719 112 108C112 72 60 8 60 8Z" stroke="rgba(255,255,255,0.22)" strokeWidth="2" fill="none"/>
            </svg>
            <svg className="flyer-hero-drop flyer-hero-drop--sm" viewBox="0 0 80 108" fill="none">
              <path d="M40 5C40 5 5 48 5 72C5 91.33 20.67 107 40 107C59.33 107 75 91.33 75 72C75 48 40 5 40 5Z" fill="rgba(255,255,255,0.07)"/>
            </svg>
          </div>

          <p className="flyer-eyebrow">ECC社会貢献センター 主催イベント</p>
          <h1 className="flyer-headline">
            <span className="flyer-headline-line1">献血に</span>
            <span className="flyer-headline-line2">参加しませんか？</span>
          </h1>
          <p className="flyer-subline">
            あなたの血液が、誰かの命をつなぎます
          </p>

          <div className="flyer-heart-row" aria-hidden="true">
            <span>❤</span><span>❤</span><span>❤</span>
          </div>
        </div>

        {/* ── Event details ── */}
        <div className="flyer-details">
          <div className="flyer-detail-card">
            <span className="flyer-detail-icon">📅</span>
            <div>
              <span className="flyer-detail-label">日時</span>
              <strong>{EVENT_CONFIG.date}</strong>
              <span className="flyer-detail-sub">{EVENT_CONFIG.time}</span>
            </div>
          </div>
          <div className="flyer-detail-card">
            <span className="flyer-detail-icon">📍</span>
            <div>
              <span className="flyer-detail-label">場所</span>
              <strong>{EVENT_CONFIG.location}</strong>
              <span className="flyer-detail-sub">{EVENT_CONFIG.locationDetail}</span>
            </div>
          </div>
          <div className="flyer-detail-card flyer-detail-card--gift">
            <span className="flyer-detail-icon">🎁</span>
            <div>
              <span className="flyer-detail-label">特典</span>
              <strong>参加者全員に記念品プレゼント！</strong>
              <span className="flyer-detail-sub">ライオンズクラブ様よりご提供</span>
            </div>
          </div>
        </div>

        {/* ── Notes ── */}
        <div className="flyer-notes">
          <p className="flyer-notes-title">ご参加にあたって</p>
          <div className="flyer-notes-grid">
            <span>✔ 当日は食事をとってから来てください</span>
            <span>✔ 来日4週間以上経過している方が対象</span>
            <span>✔ 体調の優れない方はご遠慮ください</span>
            <span>✔ 外国人留学生も参加歓迎です</span>
          </div>
        </div>

        {/* ── QR CTA ── */}
        <div className="flyer-cta">
          <div className="flyer-cta-left">
            <p className="flyer-cta-head">詳細・事前予約はこちら</p>
            <p className="flyer-cta-desc">
              事前予約で当日の手続きがスムーズに！<br />
              予約は必須ではありませんが、推奨します。
            </p>
            <p className="flyer-cta-url">{SITE_URL.replace('https://', '')}</p>
          </div>
          <div className="flyer-qr-wrap">
            <QRCodeSVG
              value={SITE_URL}
              size={148}
              bgColor="#ffffff"
              fgColor="#0f172a"
              level="M"
              marginSize={2}
            />
          </div>
        </div>

        {/* ── Footer ── */}
        <footer className="flyer-footer">
          <span>主催：{EVENT_CONFIG.organizer}</span>
          <span className="flyer-footer-dot">·</span>
          <span>協力：{EVENT_CONFIG.sponsor}</span>
          <span className="flyer-footer-dot">·</span>
          <span>後援：日本赤十字社</span>
        </footer>
      </div>

      <button className="flyer-print-btn no-print" onClick={() => window.print()}>
        🖨️ 印刷 / Print
      </button>
    </div>
  )
}
