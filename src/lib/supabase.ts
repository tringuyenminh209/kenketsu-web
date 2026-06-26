import { createClient } from "@supabase/supabase-js"
import type { Registration, RegistrationInsert, SurveyInsert } from "../types"

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ── 参加申込 ──────────────────────────────────────
export async function insertRegistration(data: RegistrationInsert) {
  const { error } = await supabase.from("registrations").insert(data)
  if (error) throw error
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
  const header = "学生番号,名前,所属,メール,電話番号,性別,申込日時\n"
  const body = rows
    .map((r) =>
      [r.student_id, r.name, r.class, r.email ?? "", r.phone ?? "", r.gender ?? "", r.created_at].join(",")
    )
    .join("\n")
  return header + body
}
