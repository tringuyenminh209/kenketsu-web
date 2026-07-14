import { createClient } from "@supabase/supabase-js"
import type { Registration, RegistrationInsert, SurveyInsert, SurveyResponse } from "../types"

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ── 参加申込 ──────────────────────────────────────
export async function insertRegistration(data: RegistrationInsert) {
  const { error } = await supabase.from("registrations").insert(data)
  if (error) throw error
}

// Public aggregate-only counts per time slot (RLS blocks direct SELECT on
// registrations for anon; this calls a SECURITY DEFINER function that only
// ever returns a slot name + count, never personal data).
export async function fetchSlotCounts(eventYear: number): Promise<Record<string, number>> {
  const { data, error } = await supabase.rpc("get_slot_counts", { p_event_year: eventYear })
  if (error) throw error
  const counts: Record<string, number> = {}
  for (const row of (data ?? []) as { time_slot: string; cnt: number }[]) {
    counts[row.time_slot] = Number(row.cnt)
  }
  return counts
}

export function sendConfirmationEmail(registrationId: string): void {
  void supabase.functions.invoke("send-confirmation", {
    body: { registration_id: registrationId },
  })
}

export async function checkDuplicateRegistration(
  studentId: string,
  eventYear: number
): Promise<boolean> {
  const { data, error } = await supabase
    .from("registrations")
    .select("id")
    .eq("student_id", studentId)
    .eq("event_year", eventYear)
    .maybeSingle()
  if (error) throw error
  return data !== null
}

// ── アンケート ────────────────────────────────────
export async function insertSurvey(data: SurveyInsert) {
  const { error } = await supabase.from("survey_responses").insert(data)
  if (error) throw error
}

export async function fetchSurveys(eventYear: number): Promise<SurveyResponse[]> {
  const { data, error } = await supabase
    .from("survey_responses")
    .select("*")
    .eq("event_year", eventYear)
    .order("created_at", { ascending: true })
  if (error) throw error
  return data ?? []
}

// ── Admin（要認証） ───────────────────────────────
export async function signInAdmin(email: string, password: string) {
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
}

export async function signOutAdmin() {
  await supabase.auth.signOut()
}

export async function getSession() {
  const { data } = await supabase.auth.getSession()
  return data.session
}

export async function fetchRegistrations(eventYear: number): Promise<Registration[]> {
  const { data, error } = await supabase
    .from("registrations")
    .select("*")
    .eq("event_year", eventYear)
    .order("created_at", { ascending: true })
  if (error) throw error
  return data ?? []
}

export async function fetchAvailableYears(): Promise<number[]> {
  const { data, error } = await supabase
    .from("registrations")
    .select("event_year")
    .order("event_year", { ascending: false })
  if (error) throw error
  return [...new Set((data ?? []).map((r) => r.event_year))]
}

// CSV export helper
export function registrationsToCSV(rows: Registration[]): string {
  const header = "学生番号,名前,フリガナ,学校名,所属,メール,電話番号,生年月日,性別,受付希望時間,献血経験,申込日時\n"
  const body = rows
    .map((r) => {
      const genderLabel = r.gender === 'male' ? '男性' :
                          r.gender === 'female' ? '女性' :
                          r.gender === 'other' ? 'その他' :
                          r.gender === 'no_answer' ? '回答しない' : r.gender ?? '';
      const experienceLabel = r.donation_experience === 'yes' ? 'ある' :
                              r.donation_experience === 'no' ? 'ない' : r.donation_experience ?? '';
      return [
        r.student_id,
        r.name,
        r.furigana ?? "",
        r.school ?? "",
        r.class,
        r.email ?? "",
        r.phone ?? "",
        r.birth_date ?? "",
        genderLabel,
        r.time_slot ?? "",
        experienceLabel,
        r.created_at
      ].join(",")
    })
    .join("\n")
  return header + body
}

export interface ParsedComment {
  impressions: string
  impressionsOther: string
  reasons: string
  reasonsOther: string
  knewCampus: string
  wantParticipate: string
  conditions: string
  conditionsOther: string
  reservation: string
}

const Q2_IMPRESSION_MAP: Record<string, string> = {
  help_others: '人の役に立てる',
  social_contribution: '社会貢献になる',
  health_check: '健康チェックになる',
  scary: '痛そう・怖い',
  time_consuming: '時間がかかる',
  dont_understand: 'よく分からない',
  not_interested: '特に興味がない',
  other: 'その他',
}

const Q3_REASON_MAP: Record<string, string> = {
  no_opportunity: '機会がなかった',
  afraid_needle: '注射が苦手',
  anxious: '不安がある',
  no_time: '時間がない',
  dont_know_conditions: '献血できる条件が分からない',
  health_reason: '健康面でできない',
  not_interested: '興味がない',
  other: 'その他',
}

const Q6_CONDITION_MAP: Record<string, string> = {
  easy_reservation: '事前予約が簡単',
  flexible_time: '空き時間に参加できる',
  short_duration: '所要時間が短い',
  clear_process: '献血の流れが分かる',
  with_friend: '友達と一緒に参加できる',
  detailed_explanation: '献血について詳しい説明がある',
  other: 'その他',
}

const Q4_KNEW_MAP: Record<string, string> = {
  knew: '知っていた',
  first_time: '今日初めて知った',
}

const Q5_PARTICIPATE_MAP: Record<string, string> = {
  yes: 'ぜひ参加したい',
  maybe: 'できれば参加したい',
  unsure: 'まだ分からない',
  no: '今回は参加しない',
}

const Q7_RESERVATION_MAP: Record<string, string> = {
  now: '今すぐ予約したい',
  later: '後で検討したい',
  no: '今回は予約しない',
}

function mapCommaList(value: string, map: Record<string, string>): string {
  return value.split(',').filter(Boolean).map((v) => map[v] ?? v).join('、')
}

export function parseStructuredComment(commentStr: string | null): ParsedComment {
  const result: ParsedComment = {
    impressions: '—',
    impressionsOther: '—',
    reasons: '—',
    reasonsOther: '—',
    knewCampus: '—',
    wantParticipate: '—',
    conditions: '—',
    conditionsOther: '—',
    reservation: '—',
  }
  if (!commentStr) return result

  const lines = commentStr.split('\n')
  for (const line of lines) {
    const [key, ...valueParts] = line.split('=')
    const value = valueParts.join('=')
    if (!key) continue

    if (key === 'q2_impressions') {
      result.impressions = mapCommaList(value, Q2_IMPRESSION_MAP) || '—'
    } else if (key === 'q2_other') {
      result.impressionsOther = value
    } else if (key === 'q3_reasons') {
      result.reasons = mapCommaList(value, Q3_REASON_MAP) || '—'
    } else if (key === 'q3_other') {
      result.reasonsOther = value
    } else if (key === 'q4_knew_campus') {
      result.knewCampus = Q4_KNEW_MAP[value] ?? value
    } else if (key === 'q5_want_participate') {
      result.wantParticipate = Q5_PARTICIPATE_MAP[value] ?? value
    } else if (key === 'q6_conditions') {
      result.conditions = mapCommaList(value, Q6_CONDITION_MAP) || '—'
    } else if (key === 'q6_other') {
      result.conditionsOther = value
    } else if (key === 'q7_reservation') {
      result.reservation = Q7_RESERVATION_MAP[value] ?? value
    }
  }

  return result
}

export function surveysToCSV(rows: SurveyResponse[]): string {
  const header = "回答日時,献血経験,印象,印象その他,未経験の理由,未経験理由その他,学内献血を知っていたか,参加意向,参加しやすくなる条件,条件その他,事前予約\n"
  const body = rows
    .map((r) => {
      const countLabel = r.donation_count === 'once' ? 'ある（1回）' :
                          r.donation_count === 'few' ? 'ある（2〜4回）' :
                          r.donation_count === 'many' ? 'ある（5回以上）' :
                          r.donation_count === 'none' ? 'ない' : r.donation_count ?? '';
      const parsed = parseStructuredComment(r.comment)
      return [
        r.created_at,
        countLabel,
        `"${parsed.impressions.replace(/"/g, '""')}"`,
        `"${parsed.impressionsOther.replace(/"/g, '""')}"`,
        `"${parsed.reasons.replace(/"/g, '""')}"`,
        `"${parsed.reasonsOther.replace(/"/g, '""')}"`,
        `"${parsed.knewCampus.replace(/"/g, '""')}"`,
        `"${parsed.wantParticipate.replace(/"/g, '""')}"`,
        `"${parsed.conditions.replace(/"/g, '""')}"`,
        `"${parsed.conditionsOther.replace(/"/g, '""')}"`,
        `"${parsed.reservation.replace(/"/g, '""')}"`
      ].join(",")
    })
    .join("\n")
  return header + body
}
