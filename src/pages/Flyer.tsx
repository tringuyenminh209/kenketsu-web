import { QRCodeSVG } from 'qrcode.react'
import { EVENT_CONFIG } from '../config/event'
import flyerBg from '../assets/flyer-bg.png'

const SITE_URL = 'https://kenketsu-web.vercel.app'

export function Flyer() {
  return (
    <div className="flyer-shell">
      <div className="flyer-page" style={{ backgroundImage: `url(${flyerBg})` }}>

        <div className="fp-content">

          {/* 1. Headline */}
          <div className="fp-head">
            <p className="fp-loc">{EVENT_CONFIG.location}で</p>
            <h1 className="fp-title">献血しませんか？</h1>
          </div>

          {/* 2. Description */}
          <p className="fp-desc">
            献血はみんなでつなぐ命のリレーです<br />
            あなたの血液を必要としている誰かのため<br />
            ECC専門学校での献血にぜひご協力ください
          </p>

          {/* 3. Event info */}
          <div className="fp-info">
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
              <strong className="fp-ival">{EVENT_CONFIG.location}　{EVENT_CONFIG.locationDetail}</strong>
            </div>
            <div className="fp-irow">
              <span className="fp-ikey">対　象</span>
              <strong className="fp-ival">16〜65歳・体重50kg以上（健康な方）</strong>
            </div>
            <div className="fp-irow">
              <span className="fp-ikey">持ち物</span>
              <strong className="fp-ival">身分証明書（学生証など）</strong>
            </div>
          </div>

          {/* 4. 献血の意義 + gift */}
          <div className="fp-message">
            <p className="fp-gift-text">
              一人の献血で最大３人の命が救われます<br />
              あなたの一歩が、誰かの未来を守ります
            </p>
            <p className="fp-gift-note">
              🎁 ご協力いただいた方に、ささやかなプレゼントをご用意しています
            </p>
          </div>

          {/* 5. Footer */}
          <div className="fp-foot-row">
            <p className="fp-org">
              主催：{EVENT_CONFIG.organizer}<br />
              後援：日本赤十字社
            </p>
            <div className="fp-qr">
              <div className="fp-qr-box">
                <QRCodeSVG
                  value={SITE_URL}
                  size={108}
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
