import { useTranslation } from 'react-i18next'
import { Icon } from '../lib/shared'

type Status = 'ok' | 'wait' | 'check' | 'lifting'

const ROWS: { code: string; nameKey: string; regions: { labelKey: string; status: Status }[] }[] = [
  {
    code: 'VN',
    nameKey: 'fs.vn_name',
    regions: [
      { labelKey: 'fs.vn_urban', status: 'ok' },
      { labelKey: 'fs.vn_rural', status: 'wait' },
    ],
  },
  {
    code: 'MM',
    nameKey: 'fs.mm_name',
    regions: [
      { labelKey: 'fs.mm_city', status: 'check' },
      { labelKey: 'fs.mm_rural', status: 'wait' },
    ],
  },
  {
    code: 'NP',
    nameKey: 'fs.ne_name',
    regions: [
      { labelKey: 'fs.ne_city', status: 'ok' },
      { labelKey: 'fs.ne_rural', status: 'wait' },
    ],
  },
  {
    code: 'CN',
    nameKey: 'fs.cn_name',
    regions: [
      { labelKey: 'fs.cn_city', status: 'ok' },
      { labelKey: 'fs.cn_rural', status: 'check' },
    ],
  },
  {
    code: 'AF',
    nameKey: 'fs.af_name',
    regions: [{ labelKey: 'fs.af_all', status: 'check' }],
  },
  {
    code: 'EU',
    nameKey: 'fs.eu_name',
    regions: [{ labelKey: 'fs.eu_all', status: 'lifting' }],
  },
]

const RULES = [
  { iconType: 'shield' as const, titleKey: 'fs.r1_title', bodyKey: 'fs.r1_body', mod: 'green' },
  { iconType: 'calendar' as const, titleKey: 'fs.r2_title', bodyKey: 'fs.r2_body', mod: 'amber' },
  { iconType: 'alert' as const, titleKey: 'fs.r3_title', bodyKey: 'fs.r3_body', mod: 'red' },
] as const

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
        <div className="section-title">
          <Icon type="shield" />
          <h2>{t('fs.title')}</h2>
        </div>
        <p className="fs-subtitle">{t('fs.subtitle')}</p>

        <div className="fs-rules">
          {RULES.map(({ iconType, titleKey, bodyKey, mod }) => (
            <div key={titleKey} className={`fs-rule-card fs-rule-card--${mod} motion-card`}>
              <div className="fs-rule-icon-wrap">
                <Icon type={iconType} />
              </div>
              <div>
                <h3>{t(titleKey)}</h3>
                <p>{t(bodyKey)}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="fs-table-wrap motion-card">
          <p className="fs-table-title">{t('fs.tableTitle')}</p>
          <div className="fs-table" role="list">
            {ROWS.map((country) => (
              <div key={country.nameKey} className="fs-country-row" role="listitem">
                <div className="fs-country-name">
                  <strong>{t(country.nameKey)}</strong>
                </div>
                <div className="fs-region-list">
                  {country.regions.map((r) => (
                    <div key={r.labelKey} className="fs-region-item">
                      <span className="fs-region-label">{t(r.labelKey)}</span>
                      <span className={`fs-status fs-status--${r.status}`}>
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

        <div className="fs-footer">
          <div className="fs-lang-note motion-card">
            <div className="fs-note-icon-wrap fs-note-icon-wrap--neutral">
              <Icon type="users" />
            </div>
            <div>
              <strong>{t('fs.langTitle')}</strong>
              <p>{t('fs.langBody')}</p>
            </div>
          </div>
          <div className="fs-cta motion-card">
            <div className="fs-note-icon-wrap fs-note-icon-wrap--red">
              <Icon type="heart" />
            </div>
            <div>
              <strong>{t('fs.ctaTitle')}</strong>
              <p>{t('fs.ctaBody')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
