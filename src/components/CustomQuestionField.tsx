import type { ReactNode } from 'react'
import type { CustomAnswers, FormFieldSetting, QuestionOption } from '../types'

export type CustomValues = Record<string, string[]>

export const getCustomSettings = (settings: FormFieldSetting[]) =>
  settings.filter((s) => s.is_custom && s.is_visible)

// Nguoi dung nhin thay lua chon theo ngon ngu cua ho, nhung gia tri luu vao DB
// luon la ban tieng Nhat de admin doc duoc.
export const optionText = (opt: QuestionOption, lang: string) =>
  (lang !== 'ja' && opt.translations?.[lang]?.trim()) || opt.value

export function collectCustomAnswers(settings: FormFieldSetting[], values: CustomValues): CustomAnswers | undefined {
  const answers: CustomAnswers = {}
  for (const s of getCustomSettings(settings)) {
    const a = (values[s.field_key] ?? []).map((v) => v.trim()).filter(Boolean).join('、')
    if (a) answers[s.field_key] = { q: s.label_override?.trim() ?? '', a }
  }
  return Object.keys(answers).length > 0 ? answers : undefined
}

interface Props {
  setting: FormFieldSetting
  label: string
  required: boolean
  order: number
  lang: string
  values: CustomValues
  onChange: (key: string, value: string[]) => void
  requiredMark?: ReactNode
  selectPlaceholder: string
  className?: string
}

export function CustomQuestionField({ setting, label, required, order, lang, values, onChange, requiredMark, selectPlaceholder, className }: Props) {
  const key = setting.field_key
  const current = values[key] ?? []
  const heading = <>{label} {required && requiredMark}</>

  if (setting.question_type === 'checkbox') {
    return (
      <fieldset className={`survey-checkbox-group ${className ?? ''}`} style={{ order }}>
        <legend>{heading}</legend>
        {setting.options.map((opt) => (
          <label key={opt.value}>
            <input
              type="checkbox"
              required={required && current.length === 0}
              checked={current.includes(opt.value)}
              onChange={() => onChange(key, current.includes(opt.value) ? current.filter((v) => v !== opt.value) : [...current, opt.value])}
            />
            {optionText(opt, lang)}
          </label>
        ))}
      </fieldset>
    )
  }

  return (
    <label className={className} style={{ order }}>
      {heading}
      {setting.question_type === 'select' ? (
        <select required={required} value={current[0] ?? ''} onChange={(e) => onChange(key, [e.target.value])}>
          <option value="" disabled>{selectPlaceholder}</option>
          {setting.options.map((opt) => (
            <option key={opt.value} value={opt.value}>{optionText(opt, lang)}</option>
          ))}
        </select>
      ) : setting.question_type === 'textarea' ? (
        <textarea required={required} rows={3} value={current[0] ?? ''} onChange={(e) => onChange(key, [e.target.value])} />
      ) : (
        <input type="text" required={required} value={current[0] ?? ''} onChange={(e) => onChange(key, [e.target.value])} />
      )}
    </label>
  )
}
