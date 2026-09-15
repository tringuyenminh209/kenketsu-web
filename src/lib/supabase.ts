import { createClient } from "@supabase/supabase-js"
import type { EventItem, EventMemory, FormFieldSetting, FormType, Registration, RegistrationInsert, SheetData, SurveyInsert, SurveyResponse } from "../types"

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

// Lấy số lượng chỗ còn lại thực tế từ Hội Chữ Thập Đỏ đã lưu trong DB
export async function fetchOfficialSlotCapacities(eventYear: number): Promise<Record<string, number>> {
  const { data, error } = await supabase
    .from("official_slot_capacities")
    .select("time_slot, remaining")
    .eq("event_year", eventYear)

  if (error) throw error
  const capacities: Record<string, number> = {}
  for (const row of (data ?? []) as { time_slot: string; remaining: number }[]) {
    capacities[row.time_slot] = Number(row.remaining)
  }
  return capacities
}

// Admin cập nhật số chỗ còn lại thực tế từ Hội Chữ Thập Đỏ
export async function updateOfficialSlotCapacities(
  eventYear: number,
  capacities: Record<string, number>
): Promise<void> {
  const rows = Object.entries(capacities).map(([time_slot, remaining]) => ({
    event_year: eventYear,
    time_slot,
    remaining,
    updated_at: new Date().toISOString(),
  }))

  const { error } = await supabase
    .from("official_slot_capacities")
    .upsert(rows, { onConflict: "event_year,time_slot" })

  if (error) throw error
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

// Excel export helper — structured rows (no CSV escaping needed; the
// xlsx writer takes cell values directly).
export function registrationsToRows(rows: Registration[]): SheetData {
  const headers = ["学生番号", "名前", "フリガナ", "学校名", "所属", "メール", "電話番号", "生年月日", "性別", "受付希望時間", "献血経験", "申込日時"]
  const body = rows.map((r) => {
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
      new Date(r.created_at).toLocaleString('ja-JP'),
    ]
  })
  return { headers, rows: body }
}

export interface ParsedComment {
  impressions: string
  impressionsList: string[]
  impressionsOther: string
  reasons: string
  reasonsList: string[]
  reasonsOther: string
  knewCampus: string
  wantParticipate: string
  conditions: string
  conditionsList: string[]
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

function mapCommaListArray(value: string, map: Record<string, string>): string[] {
  return value.split(',').filter(Boolean).map((v) => map[v] ?? v)
}

export function parseStructuredComment(commentStr: string | null): ParsedComment {
  const result: ParsedComment = {
    impressions: '—',
    impressionsList: [],
    impressionsOther: '—',
    reasons: '—',
    reasonsList: [],
    reasonsOther: '—',
    knewCampus: '—',
    wantParticipate: '—',
    conditions: '—',
    conditionsList: [],
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
      result.impressionsList = mapCommaListArray(value, Q2_IMPRESSION_MAP)
      result.impressions = result.impressionsList.join('、') || '—'
    } else if (key === 'q2_other') {
      result.impressionsOther = value
    } else if (key === 'q3_reasons') {
      result.reasonsList = mapCommaListArray(value, Q3_REASON_MAP)
      result.reasons = result.reasonsList.join('、') || '—'
    } else if (key === 'q3_other') {
      result.reasonsOther = value
    } else if (key === 'q4_knew_campus') {
      result.knewCampus = Q4_KNEW_MAP[value] ?? value
    } else if (key === 'q5_want_participate') {
      result.wantParticipate = Q5_PARTICIPATE_MAP[value] ?? value
    } else if (key === 'q6_conditions') {
      result.conditionsList = mapCommaListArray(value, Q6_CONDITION_MAP)
      result.conditions = result.conditionsList.join('、') || '—'
    } else if (key === 'q6_other') {
      result.conditionsOther = value
    } else if (key === 'q7_reservation') {
      result.reservation = Q7_RESERVATION_MAP[value] ?? value
    }
  }

  return result
}

export function surveysToRows(rows: SurveyResponse[]): SheetData {
  const headers = ["回答日時", "献血経験", "印象", "印象その他", "未経験の理由", "未経験理由その他", "学内献血を知っていたか", "参加意向", "参加しやすくなる条件", "条件その他", "事前予約"]
  const body = rows.map((r) => {
    const countLabel = r.donation_count === 'once' ? 'ある（1回）' :
                        r.donation_count === 'few' ? 'ある（2〜4回）' :
                        r.donation_count === 'many' ? 'ある（5回以上）' :
                        r.donation_count === 'none' ? 'ない' : r.donation_count ?? '';
    const parsed = parseStructuredComment(r.comment)
    return [
      new Date(r.created_at).toLocaleString('ja-JP'),
      countLabel,
      parsed.impressions,
      parsed.impressionsOther,
      parsed.reasons,
      parsed.reasonsOther,
      parsed.knewCampus,
      parsed.wantParticipate,
      parsed.conditions,
      parsed.conditionsOther,
      parsed.reservation,
    ]
  })
  return { headers, rows: body }
}

// ── Sự kiện (Events) ──────────────────────────────
export async function fetchActiveEvent(): Promise<EventItem | null> {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle()
  if (error) {
    console.warn("fetchActiveEvent error:", error)
    return null
  }
  return data
}

export async function fetchAllEvents(): Promise<EventItem[]> {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("year", { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function createOrUpdateEvent(event: Partial<EventItem> & { year: number }): Promise<void> {
  const { error } = await supabase
    .from("events")
    .upsert({
      ...event,
      updated_at: new Date().toISOString(),
    }, { onConflict: "year" })
  if (error) throw error
}

export async function setActiveEventYear(year: number): Promise<void> {
  // Bỏ active tất cả các event trước
  const { error: resetErr } = await supabase
    .from("events")
    .update({ is_active: false })
    .neq("year", year)
  if (resetErr) throw resetErr

  // Kích hoạt event theo năm được chọn
  const { error: setErr } = await supabase
    .from("events")
    .update({ is_active: true, updated_at: new Date().toISOString() })
    .eq("year", year)
  if (setErr) throw setErr
}

// Xóa một đợt sự kiện (dùng khi tạo nhầm năm khi test/thao tác sai).
// Không xóa registrations/survey_responses của năm đó — chỉ xóa dòng cấu hình.
export async function deleteEvent(year: number): Promise<void> {
  const { error } = await supabase.from("events").delete().eq("year", year)
  if (error) throw error
}

// ── Kỷ niệm qua các năm (Event Memories / 昨年の記録) ────
export async function fetchPublishedMemories(): Promise<EventMemory[]> {
  const { data, error } = await supabase
    .from("event_memories")
    .select("*")
    .eq("is_published", true)
    .order("event_year", { ascending: false })
  if (error) {
    console.warn("fetchPublishedMemories error:", error)
    return []
  }
  return data ?? []
}

export async function fetchAllMemories(): Promise<EventMemory[]> {
  const { data, error } = await supabase
    .from("event_memories")
    .select("*")
    .order("event_year", { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function saveEventMemory(memory: Partial<EventMemory> & { event_year: number }): Promise<void> {
  const { error } = await supabase
    .from("event_memories")
    .upsert({
      ...memory,
      updated_at: new Date().toISOString(),
    }, { onConflict: "event_year" })
  if (error) throw error
}

// ── Cấu hình tự do cho form đăng ký / khảo sát (ẩn/hiện, đổi nhãn,
// bắt buộc, thứ tự) — không đổi cột DB, không đổi cách export ────
export async function fetchFormFieldSettings(formType: FormType): Promise<FormFieldSetting[]> {
  const { data, error } = await supabase
    .from("form_field_settings")
    .select("*")
    .eq("form_type", formType)
    .order("sort_order", { ascending: true })
  if (error) {
    console.warn("fetchFormFieldSettings error:", error)
    return []
  }
  return data ?? []
}

export async function saveFormFieldSetting(
  setting: Pick<FormFieldSetting, "form_type" | "field_key" | "label_override" | "is_visible" | "is_required" | "sort_order">
): Promise<void> {
  const { error } = await supabase
    .from("form_field_settings")
    .upsert({ ...setting, updated_at: new Date().toISOString() }, { onConflict: "form_type,field_key" })
  if (error) throw error
}

// Xóa bài viết/ảnh kỷ niệm của một năm (dùng khi tạo/lưu nhầm năm).
export async function deleteEventMemory(year: number): Promise<void> {
  const { error } = await supabase.from("event_memories").delete().eq("event_year", year)
  if (error) throw error
}

// ── Upload ảnh lên Supabase Storage (event-photos) ──
export async function uploadEventPhoto(file: File): Promise<string> {
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg"
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`
  const filePath = `uploads/${fileName}`

  const { error: uploadError } = await supabase.storage
    .from("event-photos")
    .upload(filePath, file, { cacheControl: "3600", upsert: true })

  if (uploadError) throw uploadError

  const { data } = supabase.storage
    .from("event-photos")
    .getPublicUrl(filePath)

  return data.publicUrl
}

