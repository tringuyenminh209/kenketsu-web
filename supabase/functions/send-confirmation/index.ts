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

function buildHtml(name: string, studentId: string, dept: string): string {
  const n = esc(name)
  const sid = esc(studentId)
  const d = esc(dept)
  return `<!DOCTYPE html>
<html lang="ja">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:32px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
        <tr>
          <td style="background:linear-gradient(135deg,#c0392b,#e74c3c);padding:32px 40px;text-align:center;">
            <p style="margin:0;color:rgba(255,255,255,0.8);font-size:13px;">ECC社会貢献センター</p>
            <h1 style="margin:8px 0 0;color:#ffffff;font-size:22px;font-weight:700;">献血ボランティアイベント</h1>
            <p style="margin:8px 0 0;color:rgba(255,255,255,0.9);font-size:15px;">参加申込を受け付けました ✓</p>
          </td>
        </tr>
        <tr>
          <td style="padding:36px 40px;">
            <p style="margin:0 0 20px;font-size:16px;color:#333;">${n} さん</p>
            <p style="margin:0 0 24px;font-size:14px;color:#555;line-height:1.8;">
              献血ボランティアイベントへのご参加申込、ありがとうございます。<br>
              以下の内容で受付が完了しました。
            </p>

            <table width="100%" cellpadding="0" cellspacing="0"
              style="background:#fef2f2;border-left:4px solid #e74c3c;border-radius:0 8px 8px 0;margin:0 0 28px;">
              <tr><td style="padding:20px 24px;">
                <p style="margin:0 0 12px;font-size:12px;color:#aaa;letter-spacing:0.5px;">申込情報</p>
                <table cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding:4px 0;font-size:13px;color:#888;width:100px;">学生番号</td>
                    <td style="padding:4px 0;font-size:13px;color:#333;font-weight:600;">${sid}</td>
                  </tr>
                  <tr>
                    <td style="padding:4px 0;font-size:13px;color:#888;">氏名</td>
                    <td style="padding:4px 0;font-size:13px;color:#333;font-weight:600;">${n}</td>
                  </tr>
                  <tr>
                    <td style="padding:4px 0;font-size:13px;color:#888;">所属</td>
                    <td style="padding:4px 0;font-size:13px;color:#333;font-weight:600;">${d}</td>
                  </tr>
                </table>
              </td></tr>
            </table>

            <p style="margin:0 0 12px;font-size:14px;color:#333;font-weight:600;">📅 イベント詳細</p>
            <table width="100%" cellpadding="0" cellspacing="0"
              style="background:#f8f8f8;border-radius:8px;margin:0 0 24px;">
              <tr><td style="padding:18px 24px;">
                <table cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding:4px 0;font-size:13px;color:#888;width:60px;">日時</td>
                    <td style="padding:4px 0;font-size:13px;color:#333;">
                      2026年9月15日（火）<br>9:30〜11:30 / 12:30〜16:30
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:4px 0;font-size:13px;color:#888;vertical-align:top;">場所</td>
                    <td style="padding:4px 0;font-size:13px;color:#333;">
                      ECCコンピュータ専門学校<br>1号館 1階ラウンジ
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:4px 0;font-size:13px;color:#888;">持参</td>
                    <td style="padding:4px 0;font-size:13px;color:#333;">学生証</td>
                  </tr>
                </table>
              </td></tr>
            </table>

            <p style="margin:0 0 10px;font-size:14px;color:#333;font-weight:600;">⚠️ 当日のご注意</p>
            <ul style="margin:0 0 24px;padding-left:18px;font-size:13px;color:#555;line-height:2.2;">
              <li>前日はしっかり睡眠をとってください</li>
              <li>当日は十分な水分を摂り、食事を済ませてからお越しください</li>
              <li>体調が優れない場合はご参加をご遠慮ください</li>
            </ul>

            <p style="margin:0;font-size:13px;color:#999;line-height:1.7;">
              ご不明な点は担当の先生までお問い合わせください。<br>
              ご参加をお待ちしております。
            </p>
          </td>
        </tr>
        <tr>
          <td style="background:#f5f5f5;padding:16px 40px;text-align:center;border-top:1px solid #eee;">
            <p style="margin:0;font-size:11px;color:#bbb;">
              ECC社会貢献センター 献血ボランティアイベント事務局 · ECCコンピュータ専門学校
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
    .select("email, name, student_id, class, created_at")
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
      html: buildHtml(reg.name, reg.student_id, reg.class ?? ""),
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
