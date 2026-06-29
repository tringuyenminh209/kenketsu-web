import { useTranslation } from 'react-i18next'

type Status = 'ok' | 'wait' | 'check' | 'lifting'

const ROWS: { flag: string; nameKey: string; regions: { labelKey: string; status: Status }[] }[] = [
  {
    flag: '🇻🇳',
    nameKey: 'fs.vn_name',
    regions: [
      { labelKey: 'fs.vn_urban', status: 'ok' },
      { labelKey: 'fs.vn_rural', status: 'wait' },
    ],
  },
  {
    flag: '🇲🇲',
    nameKey: 'fs.mm_name',
    regions: [
      { labelKey: 'fs.mm_city', status: 'check' },
      { labelKey: 'fs.mm_rural', status: 'wait' },
    ],
  },
  {
    flag: '🇳🇵',
    nameKey: 'fs.ne_name',
    regions: [
      { labelKey: 'fs.ne_city', status: 'ok' },
      { labelKey: 'fs.ne_rural', status: 'wait' },
    ],
  },
  {
    flag: '🇨🇳',
    nameKey: 'fs.cn_name',
    regions: [
      { labelKey: 'fs.cn_city', status: 'ok' },
      { labelKey: 'fs.cn_rural', status: 'check' },
    ],
  },
  {
    flag: '🌍',
    nameKey: 'fs.af_name',
    regions: [{ labelKey: 'fs.af_all', status: 'check' }],
  },
  {
    flag: '🇪🇺',
    nameKey: 'fs.eu_name',
    regions: [{ labelKey: 'fs.eu_all', status: 'lifting' }],
  },
]

const STATUS_ICON: Record<Status, string> = {
  ok: '✅',
  wait: '⏳',
  check: '⚠️',
  lifting: 'ℹ️',
}

export function ForeignStudentSection() {
  const { t } = useTranslation()

  const statusLabel: Record<Status, string> = {
    ok: t('fs.statusOk'),
    wait: t('fs.statusWait'),
    check: t('fs.statusCheck'),
    lifting: t('fs.statusLifting'),
  }

  return (
    <section className="fs-section reveal" id="foreigners">
      <div className="fs-inner">
        <div className="fs-header">
          <span className="fs-globe" aria-hidden="true">🌏</span>
          <h2>{t('fs.title')}</h2>
          <p>{t('fs.subtitle')}</p>
        </div>

        <div className="fs-rules">
          {(
            [
              { icon: '✅', titleKey: 'fs.r1_title', bodyKey: 'fs.r1_body', mod: 'green' },
              { icon: '⏳', titleKey: 'fs.r2_title', bodyKey: 'fs.r2_body', mod: 'amber' },
              { icon: '🦟', titleKey: 'fs.r3_title', bodyKey: 'fs.r3_body', mod: 'red' },
            ] as const
          ).map(({ icon, titleKey, bodyKey, mod }) => (
            <div key={titleKey} className={`fs-rule-card fs-rule-card--${mod}`}>
              <span className="fs-rule-icon" aria-hidden="true">{icon}</span>
              <div>
                <h3>{t(titleKey)}</h3>
                <p>{t(bodyKey)}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="fs-table-wrap">
          <h3 className="fs-table-title">{t('fs.tableTitle')}</h3>
          <div className="fs-table" role="list">
            {ROWS.map((country) => (
              <div key={country.nameKey} className="fs-country-row" role="listitem">
                <div className="fs-country-name">
                  <span aria-hidden="true">{country.flag}</span>
                  <strong>{t(country.nameKey)}</strong>
                </div>
                <div className="fs-region-list">
                  {country.regions.map((r) => (
                    <div key={r.labelKey} className="fs-region-item">
                      <span className="fs-region-label">{t(r.labelKey)}</span>
                      <span className={`fs-status fs-status--${r.status}`}>
                        <span aria-hidden="true">{STATUS_ICON[r.status]}</span>
                        {statusLabel[r.status]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <p className="fs-table-note">{t('fs.tableNote')}</p>
        </div>

        <div className="fs-lang-note">
          <span className="fs-lang-icon" aria-hidden="true">🗣️</span>
          <div>
            <strong>{t('fs.langTitle')}</strong>
            <p>{t('fs.langBody')}</p>
          </div>
        </div>

        <div className="fs-cta">
          <span className="fs-cta-icon" aria-hidden="true">💬</span>
          <div>
            <strong>{t('fs.ctaTitle')}</strong>
            <p>{t('fs.ctaBody')}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
