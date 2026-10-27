import type { QuestionOption } from '../types'
import { translateTexts } from './supabase'

interface TranslatableDraft {
  key: string
  label_override: string
  label_translations: Record<string, string>
  is_custom: boolean
  options: QuestionOption[]
}

type Slot = { key: string; optionIndex: number | null }

// Chi dich phan giao vien da nhap tieng Nhat (nhan, cau hoi tu them, lua chon da sua).
// Muc mac dinh chua sua da co ban dich chuan trong locales/*.json nen bo qua.
function collectSlots(drafts: TranslatableDraft[]): { slots: Slot[]; texts: string[] } {
  const slots: Slot[] = []
  const texts: string[] = []
  for (const d of drafts) {
    const label = d.label_override.trim()
    if (label) {
      slots.push({ key: d.key, optionIndex: null })
      texts.push(label)
    }
    d.options.forEach((o, i) => {
      const value = o.value.trim()
      if (!value) return
      slots.push({ key: d.key, optionIndex: i })
      texts.push(value)
    })
  }
  return { slots, texts }
}

function applyTranslations<T extends TranslatableDraft>(drafts: T[], slots: Slot[], lang: string, results: string[]): T[] {
  return drafts.map((d) => {
    let next = d
    slots.forEach((slot, i) => {
      if (slot.key !== d.key) return
      if (slot.optionIndex === null) {
        next = { ...next, label_translations: { ...next.label_translations, [lang]: results[i] } }
        return
      }
      const options = next.options.map((o, j) =>
        j === slot.optionIndex ? { ...o, translations: { ...o.translations, [lang]: results[i] } } : o,
      )
      next = { ...next, options }
    })
    return next
  })
}

export interface AutoTranslateResult<T> {
  drafts: T[]
  translatedCount: number
  failedLangs: string[]
}

export async function autoTranslateDrafts<T extends TranslatableDraft>(
  drafts: T[],
  langs: string[],
): Promise<AutoTranslateResult<T>> {
  const { slots, texts } = collectSlots(drafts)
  if (texts.length === 0) return { drafts, translatedCount: 0, failedLangs: [] }

  const settled = await Promise.allSettled(langs.map((lang) => translateTexts(texts, lang)))
  let next = drafts
  const failedLangs: string[] = []
  settled.forEach((r, i) => {
    if (r.status === 'fulfilled') next = applyTranslations(next, slots, langs[i], r.value)
    else failedLangs.push(langs[i])
  })
  return { drafts: next, translatedCount: texts.length, failedLangs }
}
