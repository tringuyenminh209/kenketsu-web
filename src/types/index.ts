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
