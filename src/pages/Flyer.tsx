import { QRCodeSVG } from 'qrcode.react'
import { EVENT_CONFIG } from '../config/event'
import flyerBg from '../assets/flyer-bg.png'

const SITE_URL = 'https://kenketsu-web.vercel.app'

export function Flyer() {
  return (
    <div className="flyer-shell">
      <div className="flyer-page" style={{ backgroundImage: `url(${flyerBg})` }}>

        {/* ── TOP: headline ── */}
        <div className="fp-top">
          <p className="fp-eyebrow">{EVENT_CONFIG.organizer} 主催</p>
          <h1 className="fp-title">献血しませんか？</h1>
          <p className="fp-tagline">あなたの血液が、誰かの命をつなぎます</p>
        </div>

        {/* ── spacer: rabbit shows through ── */}
        <div className="fp-spacer" />

        {/* ── BOTTOM: event info ── */}
        <div className="fp-bottom">
          <div className="fp-info">
            <p className="fp-date">{EVENT_CONFIG.date}</p>
            <p className="fp-time">{EVENT_CONFIG.time}</p>
            <p className="fp-place">
              {EVENT_CONFIG.location}　{EVENT_CONFIG.locationDetail}
            </p>
          </div>

          <p className="fp-gift">🎁 献血ご協力者全員に記念品プレゼント！</p>
          <p className="fp-gift-sub">{EVENT_CONFIG.sponsor}よりご提供</p>

          <div className="fp-qr-row">
            <div className="fp-qr-box">
              <QRCodeSVG
                value={SITE_URL}
                size={72}
                bgColor="#ffffff"
                fgColor="#0f172a"
                level="M"
                marginSize={1}
              />
            </div>
            <div className="fp-qr-label">
              <p>詳細・事前申込</p>
              <p>はこちら ↑</p>
            </div>
          </div>

          <p className="fp-footer">
            主催：{EVENT_CONFIG.organizer}　後援：日本赤十字社
          </p>
        </div>

      </div>

      <button className="flyer-print-btn no-print" onClick={() => window.print()}>
        🖨️ 印刷 / Print
      </button>
    </div>
  )
}
