import { QRCodeSVG } from 'qrcode.react'
import { EVENT_CONFIG } from '../config/event'
import flyerBg from '../assets/flyer-bg.png'

const SITE_URL = 'https://kenketsu-web.vercel.app'

export function Flyer() {
  return (
    <div className="flyer-shell">
      <div className="flyer-page" style={{ backgroundImage: `url(${flyerBg})` }}>

        {/* ── TOP ── */}
        <div className="fp-top">
          <p className="fp-eyebrow">{EVENT_CONFIG.organizer} 主催</p>
          <h1 className="fp-title">献血しませんか？</h1>
          <p className="fp-tagline">あなたの血液が、誰かの命をつなぎます</p>
        </div>

        {/* rabbit shows through */}
        <div className="fp-spacer" />

        {/* ── BOTTOM ── */}
        <div className="fp-bottom">

          {/* Event info rows with icons */}
          <div className="fp-info">
            <div className="fp-row">
              <span className="fp-icon">📅</span>
              <div className="fp-row-body">
                <span className="fp-label">日にち</span>
                <p className="fp-date">{EVENT_CONFIG.date}</p>
              </div>
            </div>
            <div className="fp-row">
              <span className="fp-icon">🕐</span>
              <div className="fp-row-body">
                <span className="fp-label">時　間</span>
                <p className="fp-time">{EVENT_CONFIG.time}</p>
              </div>
            </div>
            <div className="fp-row">
              <span className="fp-icon">📍</span>
              <div className="fp-row-body">
                <span className="fp-label">会　場</span>
                <p className="fp-place">{EVENT_CONFIG.location}</p>
                <p className="fp-place">{EVENT_CONFIG.locationDetail}</p>
              </div>
            </div>
          </div>

          {/* Gift + QR */}
          <div className="fp-gift-qr">
            <div className="fp-gift-block">
              <p className="fp-gift">🎁 献血ご協力者全員に記念品プレゼント！</p>
              <p className="fp-gift-sub">{EVENT_CONFIG.sponsor}よりご提供</p>
              <p className="fp-footer">主催：{EVENT_CONFIG.organizer}　後援：日本赤十字社</p>
            </div>
            <div className="fp-qr-wrap">
              <div className="fp-qr-box">
                <QRCodeSVG
                  value={SITE_URL}
                  size={76}
                  bgColor="#ffffff"
                  fgColor="#0f172a"
                  level="M"
                  marginSize={1}
                />
              </div>
              <p className="fp-qr-caption">事前申込QR</p>
            </div>
          </div>

        </div>
      </div>

      <button className="flyer-print-btn no-print" onClick={() => window.print()}>
        🖨️ 印刷 / Print
      </button>
    </div>
  )
}
