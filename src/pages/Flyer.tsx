import { QRCodeSVG } from 'qrcode.react'
import { EVENT_CONFIG } from '../config/event'
import flyerBg from '../assets/flyer-bg.png'

const SITE_URL = 'https://kenketsu-web.vercel.app'

export function Flyer() {
  return (
    <div className="flyer-shell">
      <div className="flyer-page" style={{ backgroundImage: `url(${flyerBg})` }}>

        {/* small spacer — text overlaps lower part of rabbit */}
        <div className="fp-spacer" />

        <div className="fp-content">

          <p className="fp-loc">{EVENT_CONFIG.location}で</p>
          <h1 className="fp-title">献血しませんか？</h1>
          <p className="fp-desc">
            献血はみんなでつなぐ命のリレーです。<br />
            あなたの血液を必要としている誰かのために、<br />
            ECC専門学校での献血にぜひご協力ください！
          </p>

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
          </div>

          <p className="fp-note">
            ※ 前日は十分に睡眠をとり、当日は朝食を済ませてご来場ください。水分補給もお忘れなく。
          </p>

          <div className="fp-footer-row">
            <div className="fp-footer-left">
              <p className="fp-gift">🎁 {EVENT_CONFIG.giftNote}</p>
              <p className="fp-org">主催：{EVENT_CONFIG.organizer}　後援：日本赤十字社</p>
            </div>
            <div className="fp-qr">
              <div className="fp-qr-box">
                <QRCodeSVG
                  value={SITE_URL}
                  size={68}
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

      <button className="flyer-print-btn no-print" onClick={() => window.print()}>
        🖨️ 印刷 / Print
      </button>
    </div>
  )
}
