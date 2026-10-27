import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const ALLOWED_ORIGIN = Deno.env.get("ALLOWED_ORIGIN") ?? "https://kenketsu-web.vercel.app"
const MODEL = Deno.env.get("ANTHROPIC_MODEL") ?? "claude-sonnet-5-5"

const corsHeaders = {
  "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

const LANG_NAMES: Record<string, string> = {
  vi: "Vietnamese",
  en: "English",
  my: "Burmese (Myanmar)",
  ne: "Nepali",
  zh: "Simplified Chinese",
  uz: "Uzbek (Latin script)",
  bn: "Bengali",
  id: "Indonesian",
  ko: "Korean",
  th: "Thai",
  si: "Sinhala",
}

const MAX_ITEMS = 60
const MAX_ITEM_LENGTH = 500

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  })

const SYSTEM_PROMPT = `You translate Japanese UI text for a school blood-donation volunteer event website (registration form and survey) used by Japanese and international students in Japan.
Rules:
- Translate the meaning and the situation, not word by word. Write what a native speaker would naturally see on a form like this.
- Keep the polite, neutral tone of a school form. Keep labels short; keep questions as questions.
- Keep numbering such as "Q1." and any option-style punctuation as-is.
- Keep proper nouns (ECC, 献血 = blood donation) natural in the target language.
- Return exactly one translation per input, in the same order, with no explanations.`

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  const apiKey = Deno.env.get("ANTHROPIC_API_KEY")
  if (!apiKey) return json({ error: "ANTHROPIC_API_KEY not set" }, 500)

  const auth = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, {
    global: { headers: { Authorization: req.headers.get("Authorization") ?? "" } },
  })
  const { data: userData, error: userError } = await auth.auth.getUser()
  if (userError || !userData.user) return json({ error: "Unauthorized" }, 401)

  let texts: string[]
  let lang: string
  try {
    const body = await req.json()
    lang = body.lang
    texts = body.texts
    const isValid =
      typeof lang === "string" &&
      lang in LANG_NAMES &&
      Array.isArray(texts) &&
      texts.length > 0 &&
      texts.length <= MAX_ITEMS &&
      texts.every((t) => typeof t === "string" && t.trim().length > 0 && t.length <= MAX_ITEM_LENGTH)
    if (!isValid) throw new Error("invalid body")
  } catch {
    return json({ error: "Invalid request body" }, 400)
  }

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    signal: AbortSignal.timeout(50_000),
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      tools: [
        {
          name: "submit_translations",
          description: "Submit the translations, one per input text, in the same order.",
          input_schema: {
            type: "object",
            properties: { translations: { type: "array", items: { type: "string" } } },
            required: ["translations"],
          },
        },
      ],
      tool_choice: { type: "tool", name: "submit_translations" },
      messages: [
        {
          role: "user",
          content: `Translate each Japanese text into ${LANG_NAMES[lang]}.\n\n${JSON.stringify(texts)}`,
        },
      ],
    }),
  }).catch((e: unknown) => {
    console.error("[translate-admin] fetch failed", e)
    return null
  })

  if (!res) return json({ error: "Translation service unreachable" }, 502)
  const data = await res.json()
  if (!res.ok) {
    console.error("[translate-admin] Anthropic error", res.status, JSON.stringify(data))
    return json({ error: "Translation failed" }, 502)
  }

  const toolUse = (data.content as { type: string; input?: { translations?: unknown } }[]).find(
    (b) => b.type === "tool_use",
  )
  const translations = toolUse?.input?.translations
  if (
    !Array.isArray(translations) ||
    translations.length !== texts.length ||
    !translations.every((t) => typeof t === "string")
  ) {
    console.error("[translate-admin] unexpected response shape", JSON.stringify(data))
    return json({ error: "Translation failed" }, 502)
  }

  return json({ translations: translations.map((t: string) => t.trim()) })
})
