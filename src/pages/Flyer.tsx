import { QRCodeSVG } from 'qrcode.react'
import { EVENT_CONFIG } from '../config/event'
import flyerBg from '../assets/flyer-bg.png'

const SITE_URL = 'https://kenketsu-web.vercel.app'

export function Flyer() {
  return (
    <div className="flyer-shell">
      <div className="flyer-page" style={{ backgroundImage: `url(${flyerBg})` }}>

        {/* ── Headline ── */}
        <div className="flyer-headline-section">
          <p className="flyer-loc-line">{EVENT_CONFIG.location}で</p>
          <h1 className="flyer-title">献血しませんか？</h1>
          <p className="flyer-desc">
            献血はみんなでつなぐ命のリレーです。<br />
            あなたの血液を必要としている誰かのために、<br />
            ぜひ献血にご協力ください。
          </p>
        </div>

        {/* ── Info box ── */}
        <div className="flyer-infobox">
          <div className="flyer-inforow">
            <span className="flyer-infokey">日にち</span>
            <span className="flyer-infoval">
              <strong className="flyer-date-big">{EVENT_CONFIG.date}</strong>
            </span>
          </div>
          <div className="flyer-infohr" />
          <div className="flyer-inforow">
            <span className="flyer-infokey">時　間</span>
            <strong className="flyer-infoval-text">{EVENT_CONFIG.time}</strong>
          </div>
          <div className="flyer-infohr" />
          <div className="flyer-inforow">
            <span className="flyer-infokey">会　場</span>
            <strong className="flyer-infoval-text">
              {EVENT_CONFIG.location}<br />
              {EVENT_CONFIG.locationDetail}
            </strong>
          </div>
        </div>

        {/* ── Gift + QR ── */}
        <div className="flyer-bottom-row">
          <div className="flyer-gift-block">
            <p className="flyer-gift-line">献血にご協力いただいた方には</p>
            <p className="flyer-gift-highlight">🎁 ライオンズクラブより記念品プレゼント！</p>
          </div>
          <div className="flyer-qr-corner">
            <div className="flyer-qr-frame">
              <QRCodeSVG
                value={SITE_URL}
                size={80}
                bgColor="#ffffff"
                fgColor="#0f172a"
                level="M"
                marginSize={1}
              />
            </div>
            <p className="flyer-qr-label">事前申込QR</p>
          </div>
        </div>

        {/* ── Footer ── */}
        <p className="flyer-footer-line">
          主催：{EVENT_CONFIG.organizer}　協力：{EVENT_CONFIG.sponsor}　後援：日本赤十字社
        </p>

      </div>

      <button className="flyer-print-btn no-print" onClick={() => window.print()}>
        🖨️ 印刷 / Print
      </button>
    </div>
  )
}
