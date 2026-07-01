import { QRCodeSVG } from 'qrcode.react'
import { EVENT_CONFIG } from '../config/event'

const SITE_URL = 'https://kenketsu-web.vercel.app'

export function Flyer() {
  return (
    <div className="flyer-shell">
      <div className="flyer-page">

        {/* ── HERO ── */}
        <div className="flyer-hero">
          {/* Decorative blood drops */}
          <svg className="flyer-deco-drop flyer-deco-drop--lg" viewBox="0 0 140 188" aria-hidden="true">
            <path d="M70 6C70 6 6 84 6 126C6 161.35 34.65 190 70 190C105.35 190 134 161.35 134 126C134 84 70 6 70 6Z" fill="rgba(255,255,255,0.10)" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5"/>
            <path d="M70 160C70 160 46 144 46 131C46 122.72 52.72 116 61 116C65.24 116 69.04 117.9 71.5 120.9C73.96 117.9 77.76 116 82 116C90.28 116 97 122.72 97 131C97 144 70 160 70 160Z" fill="rgba(255,255,255,0.28)"/>
          </svg>
          <svg className="flyer-deco-drop flyer-deco-drop--sm" viewBox="0 0 80 108" aria-hidden="true">
            <path d="M40 5C40 5 5 50 5 73C5 92.33 20.67 108 40 108C59.33 108 75 92.33 75 73C75 50 40 5 40 5Z" fill="rgba(255,255,255,0.07)"/>
          </svg>

          <div className="flyer-hero-content">
            <p className="flyer-eyebrow">ECC社会貢献センター 主催</p>

            <h1 className="flyer-headline">
              献血に<br />参加<span className="flyer-headline-accent">しませんか</span>？
            </h1>

            <p className="flyer-subline">
              あなたの血液が、誰かの命をつなぎます
            </p>

            {/* Date + place chips inside hero */}
            <div className="flyer-hero-chips">
              <div className="flyer-chip">
                <span className="flyer-chip-icon">📅</span>
                <div>
                  <span className="flyer-chip-label">日時</span>
                  <strong>{EVENT_CONFIG.date}</strong>
                  <span className="flyer-chip-sub">{EVENT_CONFIG.time}</span>
                </div>
              </div>
              <div className="flyer-chip">
                <span className="flyer-chip-icon">📍</span>
                <div>
                  <span className="flyer-chip-label">場所</span>
                  <strong>{EVENT_CONFIG.location}</strong>
                  <span className="flyer-chip-sub">{EVENT_CONFIG.locationDetail}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── BENEFITS BAR ── */}
        <div className="flyer-bar">
          <div className="flyer-bar-item">
            <span className="flyer-bar-icon">💉</span>
            <div>
              <strong>無料血液検査</strong>
              <span>血液型・健康状態をチェック</span>
            </div>
          </div>
          <div className="flyer-bar-sep" aria-hidden="true" />
          <div className="flyer-bar-item">
            <span className="flyer-bar-icon">❤️</span>
            <div>
              <strong>最大3人の命を救える</strong>
              <span>1回の献血で複数の患者様へ</span>
            </div>
          </div>
          <div className="flyer-bar-sep" aria-hidden="true" />
          <div className="flyer-bar-item flyer-bar-item--gift">
            <span className="flyer-bar-icon">🎁</span>
            <div>
              <strong>記念品プレゼント！</strong>
              <span>ライオンズクラブ様よりご提供</span>
            </div>
          </div>
        </div>

        {/* ── BOTTOM ── */}
        <div className="flyer-bottom">

          {/* Left: notes + organizer */}
          <div className="flyer-bottom-left">
            <div className="flyer-note-block">
              <p className="flyer-note-title">
                <span className="flyer-note-title-bar" aria-hidden="true" />
                ご参加にあたって
              </p>
              <ul className="flyer-note-list">
                <li>前日・当日は十分な睡眠と食事をとってください</li>
                <li>激しい運動・飲酒の翌日は参加できません</li>
                <li>来日から<strong>4週間以上</strong>経過している方が対象</li>
                <li>体調の優れない方はご遠慮ください</li>
                <li>外国人留学生も参加歓迎です（問診は日本語）</li>
              </ul>
            </div>

            <div className="flyer-note-block">
              <p className="flyer-note-title">
                <span className="flyer-note-title-bar" aria-hidden="true" />
                当日の流れ
              </p>
              <div className="flyer-flow">
                {['受付・問診票記入', '医師による問診', '献血（約10〜15分）', '休憩・記念品受取'].map((step, i) => (
                  <div key={step} className="flyer-flow-step">
                    <span className="flyer-flow-num">{i + 1}</span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flyer-organizer">
              <p><strong>主催：</strong>{EVENT_CONFIG.organizer}</p>
              <p><strong>協力：</strong>{EVENT_CONFIG.sponsor}</p>
              <p><strong>後援：</strong>日本赤十字社</p>
            </div>
          </div>

          {/* Right: QR */}
          <div className="flyer-bottom-right">
            <div className="flyer-qr-block">
              <p className="flyer-qr-title">詳細情報・<br />事前申込はこちら</p>
              <div className="flyer-qr-frame">
                <QRCodeSVG
                  value={SITE_URL}
                  size={180}
                  bgColor="#ffffff"
                  fgColor="#0f172a"
                  level="M"
                  marginSize={2}
                />
              </div>
              <p className="flyer-qr-cta">↑ カメラで読み取り</p>
              <p className="flyer-qr-url">{SITE_URL.replace('https://', '')}</p>
              <p className="flyer-qr-note">
                事前予約で当日の<br />手続きがスムーズに！
              </p>
            </div>
          </div>
        </div>

        {/* ── FOOTER ── */}
        <footer className="flyer-footer">
          ご不明な点は当日スタッフまでお気軽にお声がけください
        </footer>
      </div>

      <button className="flyer-print-btn no-print" onClick={() => window.print()}>
        🖨️ 印刷 / Print
      </button>
    </div>
  )
}
