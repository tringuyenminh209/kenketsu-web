import { useTranslation } from 'react-i18next'
import img101 from '../assets/last-year/lastyear-101.webp'
import img102 from '../assets/last-year/lastyear-102.webp'
import img201 from '../assets/last-year/lastyear-201.webp'
import img202 from '../assets/last-year/lastyear-202.webp'
import img203 from '../assets/last-year/lastyear-203.webp'
import img204 from '../assets/last-year/lastyear-204.webp'

const PHOTOS = [img101, img102, img201, img202, img203, img204]

export function LastYearSection() {
  const { t } = useTranslation()
  const captions = t('lastYear.captions', { returnObjects: true }) as string[]

  return (
    <section className="last-year-section reveal" id="last-year">
      <div className="last-year-header">
        <span className="last-year-badge">{t('lastYear.badge')}</span>
        <h2>{t('lastYear.title')}</h2>
        <p>{t('lastYear.summary')}</p>
      </div>
      <div className="last-year-grid">
        {PHOTOS.map((src, i) => (
          <figure key={i} className="last-year-photo">
            <img src={src} alt={captions[i]} loading="lazy" />
            <figcaption>{captions[i]}</figcaption>
          </figure>
        ))}
      </div>
      <p className="last-year-source">
        {t('lastYear.sourceLabel')}{' '}
        <a href="https://npo.ecc.ac.jp/activities/index.php?c=topics_view&pk=1760425294&cn=7" target="_blank" rel="noopener noreferrer">
          {t('lastYear.sourceLink')}
        </a>
      </p>
    </section>
  )
}
