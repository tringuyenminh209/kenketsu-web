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
  motivation: string
  concern: string
  preferredSupport: string
  recommend: string
  resolvedConcern: string
  infoDifficulty: string
  infoDifficultyDetail: string
  hesitationReason: string
  hesitationDetail: string
  freeComment: string
}

export function parseStructuredComment(commentStr: string | null): ParsedComment {
  const result: ParsedComment = {
    motivation: '—',
    concern: '—',
    preferredSupport: '—',
    recommend: '—',
    resolvedConcern: '—',
    infoDifficulty: '—',
    infoDifficultyDetail: '—',
    hesitationReason: '—',
    hesitationDetail: '—',
    freeComment: '—'
  }
  if (!commentStr) return result

  const lines = commentStr.split('\n')
  for (const line of lines) {
    const [key, ...valueParts] = line.split('=')
    const value = valueParts.join('=')
    if (!key) continue

    if (key === 'motivation') {
      const motivationMap: Record<string, string> = {
        save_life: '誰かの命を支えたい',
        school_event: '学校のイベントだから',
        first_step: '初めて挑戦してみたい',
        friend: '友人と一緒に参加したい'
      }
      result.motivation = motivationMap[value] ?? value
    } else if (key === 'concern') {
      const concernMap: Record<string, string> = {
        pain: '痛みや針が少し不安',
        time: '所要時間が気になる',
        health: '体調面が少し不安',
        none: '特に不安はない'
      }
      result.concern = concernMap[value] ?? value
    } else if (key === 'preferred_support') {
      const supportMap: Record<string, string> = {
        staff: 'スタッフの声かけ',
        guide: '流れがわかる案内',
        friend: '友人と一緒に待てること',
        quiet: '落ち着いて休める場所'
      }
      result.preferredSupport = supportMap[value] ?? value
    } else if (key === 'recommend') {
      const recommendMap: Record<string, string> = {
        yes: 'すすめたい',
        maybe: '内容を知ればすすめたい',
        not_yet: 'まだわからない'
      }
      result.recommend = recommendMap[value] ?? value
    } else if (key === 'resolved_concern') {
      const resolvedMap: Record<string, string> = {
        pain: '痛みや針への不安が減った',
        time: '時間がかかりそうという不安が減った',
        health: '体調面の不安が減った',
        none: 'まだ不安が残っている'
      }
      result.resolvedConcern = resolvedMap[value] ?? value
    } else if (key === 'info_difficulty') {
      const infoMap: Record<string, string> = {
        language: '言語面で困った',
        info: '情報が分かりにくかった',
        none: '特になかった'
      }
      result.infoDifficulty = infoMap[value] ?? value
    } else if (key === 'info_difficulty_detail') {
      result.infoDifficultyDetail = value
    } else if (key === 'hesitation_reason') {
      const hesitationMap: Record<string, string> = {
        busy: '忙しい・時間が合わない',
        scared: '痛み・注射が怖い',
        ineligible: '対象条件に当てはまらないと思う',
        lack_info: '情報が足りない・不安が残る',
        none: '特にない・参加予定'
      }
      result.hesitationReason = hesitationMap[value] ?? value
    } else if (key === 'hesitation_detail') {
      result.hesitationDetail = value
    } else if (key === 'free_comment') {
      result.freeComment = value
    }
  }

  const allEmpty = result.motivation === '—' && result.concern === '—' &&
    result.preferredSupport === '—' && result.recommend === '—' &&
    result.resolvedConcern === '—' && result.infoDifficulty === '—' &&
    result.hesitationReason === '—'
  if (allEmpty) {
    result.freeComment = commentStr
  }

  return result
}

export function surveysToCSV(rows: SurveyResponse[]): string {
  const header = "回答日時,献血回数,知ったきっかけ,参加理由,気になること,希望するサポート,周囲へ薦めたいか,解消された不安,言語・情報の困りごと,困りごとの詳細,参加を迷う理由,迷う理由の詳細,自由コメント\n"
  const body = rows
    .map((r) => {
      const countLabel = r.donation_count === 'first' ? '初めて' :
                          r.donation_count === 'few' ? '2〜4回' :
                          r.donation_count === 'many' ? '5回以上' : r.donation_count ?? '';
      const foundLabel = r.how_found === 'poster' ? 'ポスター' :
                         r.how_found === 'teacher' ? '先生の紹介' :
                         r.how_found === 'friend' ? '友人の紹介' :
                         r.how_found === 'sns' ? 'SNS' : r.how_found ?? '';
      const parsed = parseStructuredComment(r.comment)
      return [
        r.created_at,
        countLabel,
        foundLabel,
        `"${parsed.motivation.replace(/"/g, '""')}"`,
        `"${parsed.concern.replace(/"/g, '""')}"`,
        `"${parsed.preferredSupport.replace(/"/g, '""')}"`,
        `"${parsed.recommend.replace(/"/g, '""')}"`,
        `"${parsed.resolvedConcern.replace(/"/g, '""')}"`,
        `"${parsed.infoDifficulty.replace(/"/g, '""')}"`,
        `"${parsed.infoDifficultyDetail.replace(/"/g, '""')}"`,
        `"${parsed.hesitationReason.replace(/"/g, '""')}"`,
        `"${parsed.hesitationDetail.replace(/"/g, '""')}"`,
        `"${parsed.freeComment.replace(/"/g, '""')}"`
      ].join(",")
    })
    .join("\n")
  return header + body
}
