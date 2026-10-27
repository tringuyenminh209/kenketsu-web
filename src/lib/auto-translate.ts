import type { MemoryTranslation, PhotoItem, QuestionOption } from '../types'
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
  value: T
  translatedCount: number
  failedLangs: string[]
}

// Dich cung mot danh sach van ban sang nhieu ngon ngu; ngon ngu loi khong lam hong ngon ngu khac.
async function translateToLangs<T>(
  initial: T,
  texts: string[],
  langs: string[],
  apply: (current: T, lang: string, results: string[]) => T,
): Promise<AutoTranslateResult<T>> {
  const settled = await Promise.allSettled(langs.map((lang) => translateTexts(texts, lang)))
  let value = initial
  const failedLangs: string[] = []
  settled.forEach((r, i) => {
    if (r.status === 'fulfilled') value = apply(value, langs[i], r.value)
    else failedLangs.push(langs[i])
  })
  return { value, translatedCount: texts.length, failedLangs }
}

export async function autoTranslateDrafts<T extends TranslatableDraft>(
  drafts: T[],
  langs: string[],
): Promise<AutoTranslateResult<T[]>> {
  const { slots, texts } = collectSlots(drafts)
  if (texts.length === 0) return { value: drafts, translatedCount: 0, failedLangs: [] }
  return translateToLangs(drafts, texts, langs, (current, lang, results) => applyTranslations(current, slots, lang, results))
}

type MemoryTextKey = 'badge' | 'title' | 'summary' | 'source_label'
const MEMORY_TEXT_KEYS: MemoryTextKey[] = ['badge', 'title', 'summary', 'source_label']

type MemorySlot = { kind: 'field'; key: MemoryTextKey } | { kind: 'caption'; url: string }

interface TranslatableMemory {
  badge?: string
  title?: string
  summary?: string
  source_label?: string
  photos?: PhotoItem[]
  translations?: Record<string, MemoryTranslation>
}

function collectMemorySlots(memory: TranslatableMemory): { slots: MemorySlot[]; texts: string[] } {
  const slots: MemorySlot[] = []
  const texts: string[] = []
  for (const key of MEMORY_TEXT_KEYS) {
    const text = (memory[key] ?? '').trim()
    if (!text) continue
    slots.push({ kind: 'field', key })
    texts.push(text)
  }
  for (const photo of memory.photos ?? []) {
    const caption = photo.caption.trim()
    if (!caption) continue
    slots.push({ kind: 'caption', url: photo.url })
    texts.push(caption)
  }
  return { slots, texts }
}

function applyMemoryTranslations<T extends TranslatableMemory>(memory: T, slots: MemorySlot[], lang: string, results: string[]): T {
  const translations = memory.translations ?? {}
  const entry: MemoryTranslation = { ...(translations[lang] ?? {}) }
  slots.forEach((slot, i) => {
    if (slot.kind === 'field') entry[slot.key] = results[i]
    else entry.photoCaptions = { ...(entry.photoCaptions ?? {}), [slot.url]: results[i] }
  })
  return { ...memory, translations: { ...translations, [lang]: entry } }
}

export async function autoTranslateMemory<T extends TranslatableMemory>(
  memory: T,
  langs: string[],
): Promise<AutoTranslateResult<T>> {
  const { slots, texts } = collectMemorySlots(memory)
  if (texts.length === 0) return { value: memory, translatedCount: 0, failedLangs: [] }
  return translateToLangs(memory, texts, langs, (current, lang, results) => applyMemoryTranslations(current, slots, lang, results))
}
