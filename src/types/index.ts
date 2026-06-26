export type Language = "ja" | "my" | "ne" | "zh"

export interface Registration {
  id: string
  event_year: number
  student_id: string
  name: string
  email: string | null
  phone: string | null
  class: string
  birth_date: string | null
  gender: string | null
  created_at: string
}

export interface RegistrationInsert {
  event_year: number
  student_id: string
  name: string
  class: string
  email?: string
  phone?: string
  birth_date?: string
  gender?: string
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
  how_found: string
  comment?: string
}
