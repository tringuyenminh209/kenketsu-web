import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const ALLOWED_ORIGIN = Deno.env.get("ALLOWED_ORIGIN") ?? "https://kenketsu-web.vercel.app"

const corsHeaders = {
  "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

// Escape HTML special characters before interpolating into the email template
const esc = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")

function buildHtml(
  name: string,
  studentId: string,
  dept: string,
  furigana: string,
  school: string,
  timeSlot: string,
): string {
  const n = esc(name)
  const sid = esc(studentId)
  const d = esc(dept)
  const fg = esc(furigana)
  const sc = esc(school)
  const ts = esc(timeSlot)
  return `<!DOCTYPE html>
<html lang="ja">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#eef0f2;font-family:'Hiragino Kaku Gothic ProN','Hiragino Sans',Meiryo,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#eef0f2;padding:40px 0;">
    <tr><td align="center">
      <table width="580" cellpadding="0" cellspacing="0" style="background:#ffffff;border:1px solid #dcdfe3;">
        <tr>
          <td style="border-top:3px solid #b3261e;padding:28px 40px 20px;">
            <p style="margin:0;font-size:12px;color:#888;letter-spacing:0.5px;">ECC社会貢献センター</p>
            <h1 style="margin:6px 0 0;font-size:19px;font-weight:700;color:#1a1a1a;">学内献血　参加申込受付のご案内</h1>
          </td>
        </tr>
        <tr>
          <td style="padding:8px 40px 32px;">
            <p style="margin:0 0 18px;font-size:14px;color:#333;">${n} 様</p>
            <p style="margin:0 0 28px;font-size:14px;color:#444;line-height:1.9;">
              この度は学内献血へお申込みいただき、誠にありがとうございます。<br>
              下記の内容にて受付いたしましたので、ご確認ください。
            </p>

            <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:0 0 28px;">
              <tr>
                <td colspan="2" style="padding:0 0 10px;font-size:12px;color:#888;border-bottom:1px solid #e2e4e7;">お申込み内容</td>
              </tr>
              <tr>
                <td style="padding:10px 0;font-size:13px;color:#888;width:110px;border-bottom:1px solid #eee;">学生番号</td>
                <td style="padding:10px 0;font-size:13px;color:#1a1a1a;border-bottom:1px solid #eee;">${sid}</td>
              </tr>
              <tr>
                <td style="padding:10px 0;font-size:13px;color:#888;border-bottom:1px solid #eee;">氏名</td>
                <td style="padding:10px 0;font-size:13px;color:#1a1a1a;border-bottom:1px solid #eee;">${n}</td>
              </tr>
              <tr>
                <td style="padding:10px 0;font-size:13px;color:#888;border-bottom:1px solid #eee;">フリガナ</td>
                <td style="padding:10px 0;font-size:13px;color:#1a1a1a;border-bottom:1px solid #eee;">${fg}</td>
              </tr>
              <tr>
                <td style="padding:10px 0;font-size:13px;color:#888;border-bottom:1px solid #eee;">学校名</td>
                <td style="padding:10px 0;font-size:13px;color:#1a1a1a;border-bottom:1px solid #eee;">${sc}</td>
              </tr>
              <tr>
                <td style="padding:10px 0;font-size:13px;color:#888;">所属</td>
                <td style="padding:10px 0;font-size:13px;color:#1a1a1a;">${d}</td>
              </tr>
            </table>

            <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:0 0 28px;">
              <tr>
                <td colspan="2" style="padding:0 0 10px;font-size:12px;color:#888;border-bottom:1px solid #e2e4e7;">イベント詳細</td>
              </tr>
              <tr>
                <td style="padding:10px 0;font-size:13px;color:#888;width:70px;vertical-align:top;border-bottom:1px solid #eee;">日時</td>
                <td style="padding:10px 0;font-size:13px;color:#1a1a1a;line-height:1.7;border-bottom:1px solid #eee;">
                  2026年9月15日（火）<br>9:30〜11:30 / 12:30〜16:30
                </td>
              </tr>
              <tr>
                <td style="padding:10px 0;font-size:13px;color:#888;vertical-align:top;border-bottom:1px solid #eee;">場所</td>
                <td style="padding:10px 0;font-size:13px;color:#1a1a1a;line-height:1.7;border-bottom:1px solid #eee;">
                  ECCコンピュータ専門学校<br>1号館 1階ラウンジ
                </td>
              </tr>
              <tr>
                <td style="padding:10px 0;font-size:13px;color:#888;">受付希望時間</td>
                <td style="padding:10px 0;font-size:13px;color:#1a1a1a;">${ts}</td>
              </tr>
            </table>

            <p style="margin:0 0 8px;font-size:13px;color:#1a1a1a;font-weight:700;">当日のご注意</p>
            <p style="margin:0 0 28px;font-size:13px;color:#444;line-height:2;">
              ・前日はしっかり睡眠をとってください<br>
              ・当日は十分な水分を摂り、食事を済ませてからお越しください<br>
              ・体調が優れない場合はご参加をご遠慮ください
            </p>

            <p style="margin:0;font-size:13px;color:#666;line-height:1.8;">
              ご不明な点がございましたら、担当の先生までお問い合わせください。<br>
              当日のご参加をお待ちしております。
            </p>
          </td>
        </tr>
        <tr>
          <td style="padding:16px 40px;border-top:1px solid #e2e4e7;">
            <p style="margin:0;font-size:11px;color:#aaa;">
              ECC社会貢献センター　献血ボランティアイベント事務局／ECCコンピュータ専門学校
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")
  const FROM_EMAIL = Deno.env.get("FROM_EMAIL") ?? "onboarding@resend.dev"

  if (!RESEND_API_KEY) {
    return new Response(JSON.stringify({ error: "RESEND_API_KEY not set" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  }

  let registration_id: string
  try {
    ;({ registration_id } = await req.json())
    if (typeof registration_id !== "string" || !UUID_RE.test(registration_id)) {
      throw new Error("invalid id format")
    }
  } catch {
    return new Response(JSON.stringify({ error: "Invalid request body" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  }

  // Lookup registration server-side — email/name come from DB, not client input
  const db = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  )
  const windowStart = new Date(Date.now() - 5 * 60 * 1000).toISOString()
  const { data: reg, error } = await db
    .from("registrations")
    .select("email, name, student_id, class, furigana, school, time_slot, created_at")
    .eq("id", registration_id)
    .gte("created_at", windowStart)
    .maybeSingle()

  if (error || !reg?.email) {
    return new Response(JSON.stringify({ error: "Registration not found or window expired" }), {
      status: 404,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: `ECC献血ボランティア <${FROM_EMAIL}>`,
      to: [reg.email],
      subject: "【献血ボランティア】参加申込を受け付けました",
      html: buildHtml(
        reg.name,
        reg.student_id,
        reg.class ?? "",
        reg.furigana ?? "",
        reg.school ?? "",
        (reg.time_slot ?? "").replace("-", "～"),
      ),
    }),
  })

  const data = await res.json()
  if (!res.ok) {
    console.error("[send-confirmation] Resend error", res.status, JSON.stringify(data))
  }
  return new Response(JSON.stringify(data), {
    status: res.ok ? 200 : 500,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  })
})
