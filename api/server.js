/**
 * api/server.js — Kiddsy
 * ─────────────────────────────────────────────────────────────────────────
 * ✅ Groq LLaMA 3.3 70B — generación de cuentos con streaming real (SSE)
 * ✅ 16 idiomas: ES, FR, AR, DE, IT, PT, RU, ZH, JA, KO, BN, HI, NL, PL, NO, SV
 * ✅ System prompt educativo: vocabulario de Animals, Cities, Nature, Monuments
 * ✅ Streaming SSE: event:token + event:complete + event:error
 * ✅ Sin ninguna referencia a Vertex AI, Google Gemini ni cuotas de Gmail
 * ─────────────────────────────────────────────────────────────────────────
 */

import express from 'express';
import cors    from 'cors';
import Groq    from 'groq-sdk';

const app = express();
app.use(cors());
app.use(express.json());

// ─── Mapa de idiomas ───────────────────────────────────────────────────────
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

// RTL languages
const RTL_LANGS = new Set(["ar"]);

// ─── Vocabulario temático para enriquecer los cuentos ─────────────────────
const THEME_VOCAB = {
  animals:   ["lion", "elephant", "dolphin", "butterfly", "penguin", "giraffe", "eagle", "turtle"],
  cities:    ["Paris", "Tokyo", "Sydney", "Cairo", "London", "Rio de Janeiro", "Amsterdam"],
  nature:    ["Amazon rainforest", "Northern Lights", "Grand Canyon", "Niagara Falls", "coral reef"],
  monuments: ["Eiffel Tower", "Great Wall", "Pyramids of Giza", "Taj Mahal", "Machu Picchu"],
};

// ─── System prompt educativo ───────────────────────────────────────────────
function buildSystemPrompt(langCode) {
  const langName = LANG_MAP[langCode] || "Spanish";
  const isRTL    = RTL_LANGS.has(langCode);
  const rtlNote  = isRTL ? " Note: this language reads right-to-left — keep translation natural." : "";

  // Combine all theme words for variety
  const vocabPool = Object.values(THEME_VOCAB).flat();
  const vocabSample = vocabPool.sort(()=>Math.random()-0.5).slice(0,6).join(", ");

  return `You are Kiddsy AI — a warm, playful children's story writer for ages 3–8.

CORE RULES:
1. Always write educational, age-appropriate content with simple, positive language.
2. Every story must have EXACTLY 4 pages.
3. Naturally include at least 2 words from this vocabulary: ${vocabSample}.
4. Keep sentences short (max 12 words per sentence in English).
5. The story must feel magical, fun, and encouraging for children.

LANGUAGE RULES:
- The "en" field is always clear, simple English.
- The "${langCode}" field is the ${langName} translation.${rtlNote}
- NEVER mix languages within the same field.

SVG RULES:
- Each "image_svg" must be a self-contained <svg viewBox="0 0 100 100"> element.
- Use ONLY basic SVG shapes: rect, circle, ellipse, polygon, path, text.
- Use bright, cheerful colors. No external images. No JavaScript.
- Keep SVG compact — under 600 characters per illustration.

OUTPUT FORMAT:
- Respond with ONLY a valid JSON object. Zero markdown. Zero backticks. Zero preamble.
- Any text outside the JSON object will break the app.

JSON SCHEMA:
{
  "title": "Story title in English",
  "emoji": "🌟",
  "color": "from-blue-400 to-cyan-300",
  "pages": [
    {
      "en": "Simple English sentence.",
      "${langCode}": "${langName} translation.",
      "image_svg": "<svg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'>…</svg>"
    }
  ]
}

COLOR OPTIONS for "color" field (pick the most fitting):
"from-blue-400 to-cyan-300" | "from-green-400 to-emerald-300" | "from-pink-400 to-rose-300"
"from-orange-400 to-amber-300" | "from-purple-400 to-violet-300" | "from-yellow-400 to-amber-300"`;
}

// ─── Helper: limpia fences de markdown que el modelo pudiera añadir ────────
function cleanJson(raw = "") {
  return raw
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

// ═══════════════════════════════════════════════════════════════════════════
// ENDPOINT PRINCIPAL — SSE Streaming con Groq
// ═══════════════════════════════════════════════════════════════════════════
app.post("/api/generate-story", async (req, res) => {
  const { childName, theme, language } = req.body;

  // ── Validación ────────────────────────────────────────────────────────
  if (!childName?.trim() || !theme?.trim()) {
    return res.status(400).json({ error: "childName and theme are required." });
  }

  const groqKey = process.env.GROQ_API_KEY;
  if (!groqKey) {
    return res.status(500).json({
      error: "GROQ_API_KEY is not set. Add it to your .env file.",
    });
  }

  const langCode = language || "es";
  const langName = LANG_MAP[langCode] || "Spanish";

  // ── Cabeceras SSE ─────────────────────────────────────────────────────
  res.setHeader("Content-Type",  "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection",    "keep-alive");
  res.setHeader("X-Accel-Buffering", "no"); // desactiva buffer en nginx/proxies

  // Flush helper — asegura que cada evento se envía de inmediato
  const send = (event, data) => {
    res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
    if (typeof res.flush === "function") res.flush();
  };

  console.log(`✨ [Groq Stream] "${childName}" · theme: "${theme}" · lang: ${langCode}`);

  // ── Mensaje de usuario ────────────────────────────────────────────────
  const userMessage = `Write a story for a child named "${childName}" about: "${theme}".
Language for translations: ${langName} (code: "${langCode}").
Remember: ONLY output the JSON object. No text before or after it.`;

  try {
    const groq = new Groq({ apiKey: groqKey });

    // ── Llamada a Groq con stream: true ───────────────────────────────
    const stream = await groq.chat.completions.create({
      model:       "llama-3.3-70b-versatile",
      temperature: 0.82,
      max_tokens:  1600,
      stream:      true,
      messages: [
        { role: "system",  content: buildSystemPrompt(langCode) },
        { role: "user",    content: userMessage },
      ],
    });

    let fullText = "";

    // ── Transmitir tokens al frontend ─────────────────────────────────
    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta?.content ?? "";
      if (delta) {
        fullText += delta;
        send("token", { delta });
      }
    }

    // ── Parsear el JSON completo ───────────────────────────────────────
    let story;
    try {
      story = JSON.parse(cleanJson(fullText));
    } catch (parseErr) {
      console.error("[Groq] JSON parse failed:", fullText.slice(0, 300));
      send("error", {
        error: "The story came out a bit scrambled — please try again! 🪄",
      });
      return res.end();
    }

    // ── Validación mínima ─────────────────────────────────────────────
    if (!story.title || !Array.isArray(story.pages) || story.pages.length === 0) {
      send("error", {
        error: "Kiddsy AI needs a moment — please try once more! ✨",
      });
      return res.end();
    }

    // ── Enriquecer y enviar historia completa ─────────────────────────
    story.id       = `gen-${Date.now()}`;
    story.language = langCode;

    console.log(`✅ [Groq] Story ready: "${story.title}" (${langName})`);
    send("complete", story);
    res.end();

  } catch (err) {
    console.error("[Groq] Error:", err?.message || err);

    // Manejar errores específicos de Groq con mensajes amables
    let friendlyMsg = "Something magical went wrong — please try again! 🌟";

    if (err?.status === 429 || err?.message?.includes("rate")) {
      friendlyMsg = "Kiddsy AI is very busy right now — try again in a few seconds! ⏳";
    } else if (err?.status === 401 || err?.message?.includes("auth")) {
      friendlyMsg = "There's a configuration issue — please contact support.";
    } else if (err?.message?.includes("network") || err?.code === "ECONNREFUSED") {
      friendlyMsg = "Can't reach Kiddsy AI — check your connection and try again.";
    }

    // Si los headers SSE ya fueron enviados, usar SSE error; si no, JSON error
    if (res.headersSent) {
      send("error", { error: friendlyMsg });
      res.end();
    } else {
      res.status(500).json({ error: friendlyMsg });
    }
  }
});

// ── GET /api/stories — historias estáticas de demostración ────────────────
app.get("/api/stories", (_req, res) => {
  res.json([]); // Devuelve array vacío; las historias reales vienen de Supabase/localStorage
});

// ── Health check ──────────────────────────────────────────────────────────
app.get("/api/health", (_req, res) => {
  res.json({
    status:        "ok",
    app:           "Kiddsy",
    ai:            "Groq LLaMA 3.3 70B (streaming)",
    streaming:     true,
    languages:     Object.keys(LANG_MAP).length,
    keyConfigured: !!process.env.GROQ_API_KEY,
  });
});

// ── Start ─────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`✅  Kiddsy API → http://localhost:${PORT}`);
  console.log(`🤖  AI: Groq LLaMA 3.3 70B (streaming SSE)`);
  console.log(`🌍  Languages: ${Object.values(LANG_MAP).join(", ")}`);
  console.log(`🔑  GROQ_API_KEY: ${process.env.GROQ_API_KEY ? "✓ set" : "✗ MISSING — add to .env"}`);
});

export default app;
