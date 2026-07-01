import { QRCodeSVG } from 'qrcode.react'
import { EVENT_CONFIG } from '../config/event'
import flyerBg from '../assets/flyer-bg.png'

const SITE_URL = 'https://kenketsu-web.vercel.app'

export function Flyer() {
  return (
    <div className="flyer-shell">
      <div className="flyer-page" style={{ backgroundImage: `url(${flyerBg})` }}>

        {/* rabbit shows at top */}
        <div className="fp-spacer" />

        {/* space-between stretches content across remaining page */}
        <div className="fp-content">

          {/* 1. Headline */}
          <div className="fp-head">
            <p className="fp-loc">{EVENT_CONFIG.location}で</p>
            <h1 className="fp-title">献血しませんか？</h1>
            <p className="fp-tagline">あなたの血液が、誰かの命をつなぎます</p>
            <div className="fp-badge">
              🎁 参加者全員に{EVENT_CONFIG.sponsor}より記念品プレゼント！
            </div>
          </div>

          {/* 2. Info rows */}
          <div className="fp-infobox">
            <div className="fp-irow">
              <span className="fp-ikey">日にち</span>
              <strong className="fp-ival fp-ival--date">{EVENT_CONFIG.date}</strong>
            </div>
            <div className="fp-irow">
              <span className="fp-ikey">時　間</span>
              <strong className="fp-ival">{EVENT_CONFIG.time}</strong>
            </div>
            <div className="fp-irow">
              <span className="fp-ikey">会　場</span>
              <strong className="fp-ival">
                {EVENT_CONFIG.location}　{EVENT_CONFIG.locationDetail}
              </strong>
            </div>
            <div className="fp-irow">
              <span className="fp-ikey">対　象</span>
              <strong className="fp-ival">16〜65歳・体重50kg以上（健康な方）</strong>
            </div>
            <div className="fp-irow">
              <span className="fp-ikey">所要時間</span>
              <strong className="fp-ival">約30〜60分　予約優先・当日参加可</strong>
            </div>
            <div className="fp-irow">
              <span className="fp-ikey">定　員</span>
              <strong className="fp-ival">{EVENT_CONFIG.capacity}名（先着順）</strong>
            </div>
          </div>

          {/* 3. Footer */}
          <div className="fp-foot">
            <div className="fp-notes">
              <p className="fp-note">※ 当日は学生証などの身分証明書をご持参ください</p>
              <p className="fp-note">※ 前日は十分な睡眠をとり、朝食後・水分補給をしてご来場ください</p>
            </div>
            <div className="fp-foot-bottom">
              <p className="fp-org">
                主催：{EVENT_CONFIG.organizer}<br />
                後援：日本赤十字社
              </p>
              <div className="fp-qr">
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
                <p className="fp-qr-cap">事前申込QR</p>
              </div>
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
