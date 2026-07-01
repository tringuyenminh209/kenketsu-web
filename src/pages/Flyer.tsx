import { QRCodeSVG } from 'qrcode.react'
import { EVENT_CONFIG } from '../config/event'

const SITE_URL = 'https://kenketsu-web.vercel.app'

function BloodDropMascot() {
  return (
    <svg viewBox="0 0 100 136" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Body */}
      <path d="M50 6C50 6 10 56 10 84C10 107.2 27.9 126 50 126C72.1 126 90 107.2 90 84C90 56 50 6 50 6Z"
        fill="#7a0010" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5"/>
      {/* Cheeks */}
      <ellipse cx="30" cy="84" rx="7" ry="5" fill="rgba(255,100,100,0.45)"/>
      <ellipse cx="70" cy="84" rx="7" ry="5" fill="rgba(255,100,100,0.45)"/>
      {/* Eyes */}
      <circle cx="37" cy="78" r="6.5" fill="white"/>
      <circle cx="63" cy="78" r="6.5" fill="white"/>
      <circle cx="38.5" cy="78.5" r="3.5" fill="#1a0000"/>
      <circle cx="64.5" cy="78.5" r="3.5" fill="#1a0000"/>
      <circle cx="40" cy="77" r="1.4" fill="white"/>
      <circle cx="66" cy="77" r="1.4" fill="white"/>
      {/* Smile */}
      <path d="M37 92 Q50 103 63 92" stroke="white" strokeWidth="2.8" strokeLinecap="round" fill="none"/>
      {/* Arms */}
      <path d="M12 76 C4 64 2 52 10 48" stroke="#7a0010" strokeWidth="9" strokeLinecap="round" fill="none"/>
      <path d="M12 76 C4 64 2 52 10 48" stroke="rgba(255,255,255,0.15)" strokeWidth="9" strokeLinecap="round" fill="none"/>
      <path d="M88 76 C96 64 98 52 90 48" stroke="#7a0010" strokeWidth="9" strokeLinecap="round" fill="none"/>
      <path d="M88 76 C96 64 98 52 90 48" stroke="rgba(255,255,255,0.15)" strokeWidth="9" strokeLinecap="round" fill="none"/>
      {/* Badge */}
      <rect x="30" y="104" width="40" height="15" rx="7.5" fill="rgba(255,255,255,0.22)"/>
      <text x="50" y="115.5" textAnchor="middle" fill="white" fontSize="8.5" fontWeight="700" fontFamily="'Noto Sans JP', sans-serif">けんけつ</text>
    </svg>
  )
}

function BloodBag() {
  return (
    <svg viewBox="0 0 100 130" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Hanger tube */}
      <line x1="50" y1="0" x2="50" y2="14" stroke="rgba(255,255,255,0.7)" strokeWidth="3" strokeLinecap="round"/>
      {/* Hook ring */}
      <path d="M41 14 C41 8 59 8 59 14" stroke="rgba(255,255,255,0.7)" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      {/* Bag body */}
      <rect x="8" y="20" width="84" height="92" rx="16" fill="rgba(255,255,255,0.93)"/>
      {/* Red cross */}
      <rect x="42" y="38" width="16" height="56" rx="6" fill="#ce0017"/>
      <rect x="26" y="54" width="48" height="16" rx="6" fill="#ce0017"/>
      {/* Tube out bottom */}
      <rect x="44" y="110" width="12" height="20" rx="6" fill="rgba(255,255,255,0.7)"/>
    </svg>
  )
}

export function Flyer() {
  return (
    <div className="flyer-shell">
      <div className="flyer-page">

        {/* ── Illustration row ── */}
        <div className="flyer-illust-row">
          <div className="flyer-mascot-wrap">
            <BloodDropMascot />
          </div>
          <div className="flyer-bloodbag-wrap">
            <BloodBag />
          </div>
        </div>

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
