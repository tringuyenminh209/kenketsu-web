import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { fetchPublishedMemories } from '../lib/supabase'
import type { EventMemory } from '../types'
import { LEGACY_LAST_YEAR_PHOTOS, resolveLegacyPhotoUrl } from '../lib/legacyPhotos'

export function LastYearSection() {
  const { t, i18n } = useTranslation()
  const [memories, setMemories] = useState<EventMemory[]>([])
  const [selectedYear, setSelectedYear] = useState<number>(2025)

  useEffect(() => {
    fetchPublishedMemories()
      .then((data) => {
        if (data && data.length > 0) {
          setMemories(data)
          setSelectedYear(data[0].event_year)
        }
      })
  }, [])


  const currentMemory = memories.find((m) => m.event_year === selectedYear)
  const lang = i18n.language?.slice(0, 2) || 'ja'
  // Admin dan noi dung da dich cho tung ngon ngu vao `translations[lang]`.
  const tr = lang !== 'ja' ? currentMemory?.translations?.[lang] : undefined
  // Nam 2025 (du lieu seed goc) da duoc dich san day du sang 12 ngon ngu
  // qua cac session truoc (khoa `lastYear.*` trong locales), truoc khi he
  // thong DB dong nay ton tai. Uu tien ban dich san nay hon cot tieng Nhat
  // trong DB de khong "che mat" ban dich da co — chi ap dung rieng cho
  // nam 2025 va khi admin chua tu dan ban dich rieng (`tr`).
  const useLegacyTranslation = selectedYear === 2025 && lang !== 'ja' && !tr
  const legacyCaptions = useLegacyTranslation
    ? (t('lastYear.captions', { returnObjects: true, defaultValue: [] }) as string[])
    : null

  const badge = tr?.badge || (useLegacyTranslation ? t('lastYear.badge') : '') || currentMemory?.badge || t('lastYear.badge', '昨年の記録')
  const title = tr?.title || (useLegacyTranslation ? t('lastYear.title') : '') || currentMemory?.title || t('lastYear.title', '2025年の学内献血は、こんな様子でした。')
  const summary = tr?.summary || (useLegacyTranslation ? t('lastYear.summary') : '') || currentMemory?.summary || t('lastYear.summary', '2025年9月24日、ECCコンピュータ専門学校1号館ラウンジを会場に開催。学生・教職員が献血に協力し、学生ボランティアも大活躍しました。')
  const photos = currentMemory?.photos && currentMemory.photos.length > 0 ? currentMemory.photos : LEGACY_LAST_YEAR_PHOTOS
  const sourceLink = currentMemory?.source_link || 'https://npo.ecc.ac.jp/activities/index.php?c=topics_view&pk=1760425294&cn=7'
  const sourceLabel = tr?.source_label || (useLegacyTranslation ? t('lastYear.sourceLink') : '') || currentMemory?.source_label || t('lastYear.sourceLink', '活動報告はこちら')

  return (
    <section className="last-year-section reveal" id="last-year">
      <div className="last-year-header">
        <span className="last-year-badge">{badge}</span>
        <h2>{title}</h2>
        <p>{summary}</p>
      </div>

      {memories.length > 1 && (
        <div className="last-year-tabs" role="tablist" aria-label="year">
          {memories.map((m) => (
            <button
              key={m.event_year}
              type="button"
              role="tab"
              aria-selected={m.event_year === selectedYear}
              className={`last-year-tab ${m.event_year === selectedYear ? 'is-active' : ''}`}
              onClick={() => setSelectedYear(m.event_year)}
            >
              {m.event_year}
            </button>
          ))}
        </div>
      )}

      <div className="last-year-grid">
        {photos.map((item, i) => {
          const caption = tr?.photoCaptions?.[item.url] || legacyCaptions?.[i] || item.caption
          return (
            <figure key={i} className="last-year-photo">
              <img src={resolveLegacyPhotoUrl(item.url)} alt={caption || `photo-${i}`} loading="lazy" />
              {caption && <figcaption>{caption}</figcaption>}
            </figure>
          )
        })}
      </div>

      {sourceLink && (
        <p className="last-year-source">
          {t('lastYear.sourceLabel', '出典：')}{' '}
          <a href={sourceLink} target="_blank" rel="noopener noreferrer">
            {sourceLabel}
          </a>
        </p>
      )}
    </section>
  )
}
