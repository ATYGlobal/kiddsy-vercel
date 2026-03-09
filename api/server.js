/**
 * api/server.js — Kiddsy
 * ─────────────────────────────────────────────────────────────────────────
 * ✅ Gemini 2.0 Flash  (por defecto)
 * ✅ Groq llama-3.3-70b-versatile  (alternativa)
 *
 * Para cambiar el proveedor basta con una variable de entorno:
 *
 *   AI_PROVIDER=gemini   → usa Gemini 2.0 Flash  (requiere GOOGLE_GENAI_API_KEY)
 *   AI_PROVIDER=groq     → usa Groq Llama-3.3-70b (requiere GROQ_API_KEY)
 *
 * Si AI_PROVIDER no está definida, se usa Gemini por defecto.
 * ─────────────────────────────────────────────────────────────────────────
 */

import express from "express";
import cors    from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// ─── Mapa de idiomas ──────────────────────────────────────────────────────
const LANG_MAP = {
  es: "Spanish",
  fr: "French",
  ar: "Arabic",
  de: "German",
  it: "Italian",
  pt: "Portuguese",
  ru: "Russian",
  zh: "Chinese (Simplified)",
  ja: "Japanese",
  ko: "Korean",
  bn: "Bengali",
  hi: "Hindi",
  nl: "Dutch",
  pl: "Polish",
  no: "Norwegian",
  sv: "Swedish",
};

// ═══════════════════════════════════════════════════════════════════════════
// PROVIDERS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * generateWithGemini
 * Llama a Gemini 2.0 Flash con el prompt y devuelve el JSON parseado.
 */
async function generateWithGemini(prompt) {
  const apiKey = process.env.GOOGLE_GENAI_API_KEY;
  if (!apiKey) throw new Error("GOOGLE_GENAI_API_KEY no configurada en .env");

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  const res = await fetch(url, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.8, maxOutputTokens: 1200 },
    }),
  });

  if (!res.ok) {
    const txt = await res.text();
    if (res.status === 429) throw Object.assign(new Error("Gemini quota reached"), { status: 429 });
    if (res.status === 400) throw Object.assign(new Error("Invalid Gemini API key"), { status: 400 });
    throw new Error(`Gemini HTTP ${res.status}: ${txt.slice(0, 200)}`);
  }

  const data = await res.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
}

/**
 * generateWithGroq
 * Llama a Groq con llama-3.3-70b-versatile y devuelve el texto crudo.
 * Usa la API REST de Groq (compatible con OpenAI Chat Completions).
 */
async function generateWithGroq(prompt) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("GROQ_API_KEY no configurada en .env");

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method:  "POST",
    headers: {
      "Content-Type":  "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model:       "llama-3.3-70b-versatile",
      temperature: 0.8,
      max_tokens:  1200,
      messages: [
        {
          role:    "system",
          content: "You are a bilingual children's story writer. Respond ONLY with valid JSON, no markdown, no backticks.",
        },
        { role: "user", content: prompt },
      ],
    }),
  });

  if (!res.ok) {
    const txt = await res.text();
    if (res.status === 429) throw Object.assign(new Error("Groq rate limit reached"), { status: 429 });
    if (res.status === 401) throw Object.assign(new Error("Invalid Groq API key"), { status: 401 });
    throw new Error(`Groq HTTP ${res.status}: ${txt.slice(0, 200)}`);
  }

  const data = await res.json();
  return data?.choices?.[0]?.message?.content ?? "";
}

/**
 * generateStory — selecciona el proveedor según AI_PROVIDER
 * Devuelve el objeto story ya parseado.
 */
async function generateStory(prompt) {
  const provider = (process.env.AI_PROVIDER || "gemini").toLowerCase();

  let rawText;
  if (provider === "groq") {
    rawText = await generateWithGroq(prompt);
  } else {
    rawText = await generateWithGemini(prompt);
  }

  // Limpiar posibles markdown fences que algunos modelos incluyen
  const cleaned = rawText
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  let story;
  try {
    story = JSON.parse(cleaned);
  } catch {
    console.error("[Kiddsy] JSON parse error — raw output:", rawText.slice(0, 400));
    throw new Error("AI returned unexpected format. Please try again.");
  }

  return story;
}

// ═══════════════════════════════════════════════════════════════════════════
// RUTAS API
// ═══════════════════════════════════════════════════════════════════════════

// ── POST /api/generate-story ──────────────────────────────────────────────
app.post("/api/generate-story", async (req, res) => {
  const { childName, theme, language } = req.body;

  if (!childName || !theme) {
    return res.status(400).json({ error: "childName y theme son obligatorios." });
  }

  const langCode = language || "es";
  const langName = LANG_MAP[langCode] || "Spanish";
  const isRTL    = ["ar"].includes(langCode);
  const rtlNote  = isRTL ? "(This language reads right-to-left — keep the translation natural)" : "";

  const prompt = `
You are a bilingual children's story writer and SVG illustrator.
Create a short, joyful story for a child named "${childName}" about: "${theme}".

Rules:
- Exactly 4 pages.
- Each page must have:
  1. One simple English sentence (key: "en").
  2. One ${langName} translation ${rtlNote} (key: "${langCode}").
  3. One "image_svg": A simple, colorful SVG illustration (viewBox="0 0 100 100").
     Use basic shapes (rect, circle, path) and bright colors. Avoid complex details.
- Use the child's name (${childName}) naturally.
- Response must be ONLY a valid JSON object — no markdown, no backticks.

JSON Format:
{
  "title": "Story Title in English",
  "emoji": "🌟",
  "color": "from-blue-400 to-cyan-300",
  "pages": [
    {
      "en": "...",
      "${langCode}": "...",
      "image_svg": "<svg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'>...</svg>"
    }
  ]
}
`;

  const provider = (process.env.AI_PROVIDER || "gemini").toLowerCase();
  console.log(`✨ [${provider.toUpperCase()}] Generating story for "${childName}" about "${theme}" in ${langName}…`);

  try {
    const story = await generateStory(prompt);

    if (!story.title || !Array.isArray(story.pages) || story.pages.length === 0) {
      return res.status(500).json({ error: "Incomplete story generated. Please try again." });
    }

    story.id       = `generated-${Date.now()}`;
    story.language = langCode;

    console.log(`✅ Story generated: "${story.title}" (${langName}) via ${provider}`);
    res.json(story);

  } catch (err) {
    console.error(`[${provider.toUpperCase()}] Error:`, err.message);
    const status = err.status ?? 500;
    res.status(status).json({ error: err.message || "Could not reach AI. Check your connection." });
  }
});

// ── GET /api/health ────────────────────────────────────────────────────────
app.get("/api/health", (_req, res) => {
  const provider = (process.env.AI_PROVIDER || "gemini").toLowerCase();
  const keyOk =
    provider === "groq"
      ? !!process.env.GROQ_API_KEY
      : !!process.env.GOOGLE_GENAI_API_KEY;

  res.json({
    status:        "ok",
    app:           "Kiddsy",
    ai_provider:   provider,
    ai_model:      provider === "groq" ? "llama-3.3-70b-versatile" : "gemini-2.0-flash",
    languages:     Object.keys(LANG_MAP).length,
    keyConfigured: keyOk,
  });
});

// ── Start ──────────────────────────────────────────────────────────────────
const PORT     = process.env.PORT || 10000;
const PROVIDER = (process.env.AI_PROVIDER || "gemini").toLowerCase();
const MODEL    = PROVIDER === "groq" ? "llama-3.3-70b-versatile" : "gemini-2.0-flash";

app.listen(PORT, () => {
  console.log(`✅ Kiddsy API → http://localhost:${PORT}`);
  console.log(`🤖 AI provider : ${PROVIDER.toUpperCase()}`);
  console.log(`🧠 AI model    : ${MODEL}`);
  console.log(`🌍 Languages   : ${Object.values(LANG_MAP).join(", ")}`);
  console.log(`💡 Switch AI   : AI_PROVIDER=groq | AI_PROVIDER=gemini`);
});

export default app;
