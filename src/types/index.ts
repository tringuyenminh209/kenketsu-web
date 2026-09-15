export type Language = "ja" | "my" | "ne" | "zh"

export interface Registration {
  id: string
  event_year: number
  student_id: string
  name: string
  furigana: string | null
  email: string | null
  phone: string | null
  school: string | null
  class: string
  birth_date: string | null
  gender: string | null
  time_slot: string | null
  donation_experience: string | null
  created_at: string
}

export interface RegistrationInsert {
  id?: string
  event_year: number
  student_id: string
  name: string
  class: string
  furigana?: string
  email?: string
  phone?: string
  school?: string
  birth_date?: string
  gender?: string
  time_slot?: string
  donation_experience?: string
}

export interface SurveyResponse {
  id: string
  event_year: number
  donation_count: string | null
  how_found: string | null
  comment: string | null
  created_at: string
}

export interface SurveyInsert {
  event_year: number
  donation_count: string
  comment?: string
}

export interface SheetData {
  headers: string[]
  rows: (string | number)[][]
}

export interface OfficialSlotCapacity {
  event_year: number
  time_slot: string
  remaining: number
  updated_at: string
}

export interface EventItem {
  id: string
  year: number
  title: string
  date_display: string
  time_display: string
  location: string
  location_detail: string
  capacity: number
  slot_capacity: number
  sponsor: string
  reservation_note: string
  gift_note: string
  show_pending_notice: boolean
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface PhotoItem {
  url: string
  caption: string
}

export interface MemoryTranslation {
  badge?: string
  title?: string
  summary?: string
  source_label?: string
  photoCaptions?: Record<string, string>
}

export interface EventMemory {
  id: string
  event_year: number
  badge: string
  title: string
  summary: string
  photos: PhotoItem[]
  source_label?: string
  source_link?: string
  translations: Record<string, MemoryTranslation>
  is_published: boolean
  created_at: string
  updated_at: string
}

export type FormType = "registration" | "survey"

export interface FormFieldSetting {
  id: string
  form_type: FormType
  field_key: string
  label_override: string | null
  is_visible: boolean
  is_required: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

