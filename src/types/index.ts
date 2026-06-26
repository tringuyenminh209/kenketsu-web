export type Language = "ja" | "my" | "ne" | "zh"

export interface Registration {
  id: string
  event_year: number
  student_id: string
  name: string
  class: string
  created_at: string
}

export interface RegistrationInsert {
  event_year: number
  student_id: string
  name: string
  class: string
}

export interface SurveyResponse {
  id: string
  event_year: number
  rating: number | null
  found_info_useful: boolean | null
  would_participate: boolean | null
  comment: string | null
  created_at: string
}

export interface SurveyInsert {
  event_year: number
  rating: number | null
  found_info_useful: boolean | null
  would_participate: boolean | null
  comment: string | null
}

export interface AdminStats {
  totalRegistrations: number
  averageRating: number | null
  usefulCount: number
  wouldParticipateCount: number
}
