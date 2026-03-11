/**
 * api/server.js — Kiddsy
 * ─────────────────────────────────────────────────────────────────────────
 * ✅ Groq LLaMA 3.3 70B — generación de cuentos con streaming real (SSE)
 * ✅ DALL·E 3 — ilustración por página tras streaming (dalle_prompt → dalle_url)
 * ✅ OpenAI TTS — voz dinámica (nova / onyx / fable / shimmer)
 * ✅ 16 idiomas: ES, FR, AR, DE, IT, PT, RU, ZH, JA, KO, BN, HI, NL, PL, NO, SV
 * ✅ Estilos de ilustración: watercolor | realistic | pencil | cartoon | vintage | fantasy
 * ─────────────────────────────────────────────────────────────────────────
 */

import express from 'express';
import cors    from 'cors';
import Groq    from 'groq-sdk';

const app = express();
app.use(cors());
app.use(express.json());

// ── Mapa de idiomas ────────────────────────────────────────────────────────
const LANG_MAP = {
  es: "Spanish",      fr: "French",               ar: "Arabic",
  de: "German",       it: "Italian",              pt: "Portuguese",
  ru: "Russian",      zh: "Chinese (Simplified)", ja: "Japanese",
  ko: "Korean",       bn: "Bengali",              hi: "Hindi",
  nl: "Dutch",        pl: "Polish",               no: "Norwegian",
  sv: "Swedish",
};

const RTL_LANGS = new Set(["ar"]);

// ── Vocabulario temático ───────────────────────────────────────────────────
const THEME_VOCAB = {
  animals:   ["lion", "elephant", "dolphin", "butterfly", "penguin", "giraffe", "eagle", "turtle"],
  cities:    ["Paris", "Tokyo", "Sydney", "Cairo", "London", "Rio de Janeiro", "Amsterdam"],
  nature:    ["Amazon rainforest", "Northern Lights", "Grand Canyon", "Niagara Falls", "coral reef"],
  monuments: ["Eiffel Tower", "Great Wall", "Pyramids of Giza", "Taj Mahal", "Machu Picchu"],
};

// ── System prompt ──────────────────────────────────────────────────────────
function buildSystemPrompt(langCode, childName = "the child", stylePrompt = "") {
  const langName    = LANG_MAP[langCode] || "Spanish";
  const isRTL       = RTL_LANGS.has(langCode);
  const rtlNote     = isRTL ? " Note: this language reads right-to-left — keep translation natural." : "";
  const vocabPool   = Object.values(THEME_VOCAB).flat();
  const vocabSample = vocabPool.sort(() => Math.random() - 0.5).slice(0, 6).join(", ");
  const styleNote   = stylePrompt
    ? `\nILLUSTRATION STYLE: "${stylePrompt}" — use this exact style description in every dalle_prompt.`
    : "";

  return `You are Kiddsy AI — a warm, playful children's story writer for ages 3–8.

CORE RULES:
1. Always write educational, age-appropriate content with simple, positive language.
2. Every story must have EXACTLY 8 pages for a premium experience.
3. Total word count must be between 200 and 300 words.
4. Naturally include at least 2 words from this vocabulary: ${vocabSample}.
5. Keep sentences short (max 12 words per sentence in English).
6. NARRATIVE STRUCTURE:
   - Pages 1-2: Beginning (Introduce ${childName} and a magical setting).
   - Pages 3-6: Middle/Conflict (A challenge requiring courage or curiosity).
   - Pages 7-8: Ending & Emotional Closure (Problem solved, returning to safety with a heartwarming final sentence).

LANGUAGE RULES:
- The "en" field is clear, simple English.
- The "${langCode}" field is the ${langName} translation.${rtlNote}
- NEVER mix languages within the same field.

SVG RULES:
- Each "image_svg" must be a self-contained <svg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'> element.
- Use ONLY basic SVG shapes: rect, circle, ellipse, polygon, path.
- CRITICAL: Use ONLY single quotes (') for SVG attributes (e.g., fill='red') to avoid breaking the JSON.
- Keep SVG under 600 characters.

DALLE PROMPT RULE:
- "dalle_prompt" per page: describe the scene for that page vividly (who, where, what is happening).
- Keep it under 200 characters. End with: "Children's book illustration, no text."${styleNote}

OUTPUT FORMAT — Respond ONLY with a valid JSON object. No markdown, no backticks, no preamble.

JSON SCHEMA:
{
  "title": "Story title",
  "emoji": "🌟",
  "color": "from-blue-400 to-cyan-300",
  "pages": [
    {
      "en": "English text (approx 30-35 words).",
      "${langCode}": "${langName} text.",
      "image_svg": "<svg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'>...</svg>",
      "dalle_prompt": "Scene description. Children's book illustration, no text."
    }
  ]
}

COLOR OPTIONS: "from-blue-400 to-cyan-300" | "from-green-400 to-emerald-300" | "from-pink-400 to-rose-300" | "from-orange-400 to-amber-300" | "from-purple-400 to-violet-300" | "from-yellow-400 to-amber-300"`;
}

// ── cleanJson ──────────────────────────────────────────────────────────────
function cleanJson(raw = "") {
  if (!raw) return "";
  try {
    const first = raw.indexOf("{");
    const last  = raw.lastIndexOf("}");
    if (first === -1 || last === -1) return raw.replace(/```json|```/gi, "").trim();
    return raw.substring(first, last + 1).trim();
  } catch (e) {
    console.error("cleanJson error:", e);
    return "";
  }
}

// ── DALL·E 3 helper ────────────────────────────────────────────────────────
async function generateDallEImage(dallePrompt, stylePrompt = "") {
  const openaiKey = process.env.OPENAI_API_KEY;
  if (!openaiKey) {
    console.warn("[DALL·E] OPENAI_API_KEY not set — skipping.");
    return null;
  }

  const finalPrompt = stylePrompt
    ? `${dallePrompt} Style: ${stylePrompt}.`
    : dallePrompt;

  try {
    const res = await fetch("https://api.openai.com/v1/images/generations", {
      method:  "POST",
      headers: {
        "Authorization": `Bearer ${openaiKey}`,
        "Content-Type":  "application/json",
      },
      body: JSON.stringify({
        model:           "dall-e-3",
        prompt:          finalPrompt,
        n:               1,
        size:            "1024x1024",
        quality:         "standard",
        response_format: "url",
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.error("[DALL·E] API error:", err?.error?.message);
      return null;
    }

    const data = await res.json();
    return data.data?.[0]?.url ?? null;
  } catch (e) {
    console.error("[DALL·E] fetch error:", e.message);
    return null;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// POST /api/generate-story — Groq SSE streaming + DALL·E 3 images per page
// ═══════════════════════════════════════════════════════════════════════════
app.post("/api/generate-story", async (req, res) => {
  const {
    childName,
    theme,
    language          = "es",
    illustrationStyle = "watercolor",
    stylePrompt       = "watercolor illustration, soft pastel colors, gentle washes, children's book style",
    voice             = "nova",
  } = req.body;

  if (!childName?.trim() || !theme?.trim()) {
    return res.status(400).json({ error: "childName and theme are required." });
  }

  const groqKey = process.env.GROQ_API_KEY;
  if (!groqKey) {
    return res.status(500).json({ error: "GROQ_API_KEY is not set in .env" });
  }

  const langCode = language || "es";
  const langName = LANG_MAP[langCode] || "Spanish";

  // ── SSE headers ─────────────────────────────────────────────────────────
  res.setHeader("Content-Type",      "text/event-stream");
  res.setHeader("Cache-Control",     "no-cache");
  res.setHeader("Connection",        "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");

  const send = (event, data) => {
    res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
    if (typeof res.flush === "function") res.flush();
  };

  console.log(`✨ [Groq] "${childName}" · "${theme}" · ${langCode} · ${illustrationStyle}`);

  const userMessage =
    `Write a story for a child named "${childName}" about: "${theme}".` +
    `\nLanguage for translations: ${langName} (code: "${langCode}").` +
    `\nRemember: ONLY output the JSON object. No text before or after it.`;

  try {
    const groq   = new Groq({ apiKey: groqKey });
    const stream = await groq.chat.completions.create({
      model:       "llama-3.3-70b-versatile",
      temperature: 0.82,
      max_tokens:  2400,
      stream:      true,
      messages: [
        { role: "system", content: buildSystemPrompt(langCode, childName, stylePrompt) },
        { role: "user",   content: userMessage },
      ],
    });

    // ── Stream tokens → frontend ───────────────────────────────────────
    let fullText = "";
    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta?.content ?? "";
      if (delta) {
        fullText += delta;
        send("token", { delta });
      }
    }

    // ── Parse JSON from Groq ───────────────────────────────────────────
    let story;
    try {
      story = JSON.parse(cleanJson(fullText));
    } catch (parseErr) {
      console.error("[Groq] JSON parse failed:", fullText.slice(0, 300));
      send("error", { error: "The story came out a bit scrambled — please try again! 🪄" });
      return res.end();
    }

    if (!story.title || !Array.isArray(story.pages) || story.pages.length === 0) {
      send("error", { error: "Kiddsy AI needs a moment — please try once more! ✨" });
      return res.end();
    }

    // ── Generate DALL·E 3 images (parallel, one per page) ─────────────
    if (process.env.OPENAI_API_KEY) {
      console.log(`🎨 [DALL·E] Generating ${story.pages.length} images (${illustrationStyle})…`);

      // Keep SSE alive while images are generating
      const keepAlive = setInterval(() => send("token", { delta: "" }), 5000);

      const imageUrls = await Promise.all(
        story.pages.map(page =>
          generateDallEImage(
            page.dalle_prompt || `${page.en} No text in image.`,
            stylePrompt
          )
        )
      );
      clearInterval(keepAlive);

      story.pages = story.pages.map((page, i) => ({
        ...page,
        dalle_url: imageUrls[i] || null,
      }));

      const generated = imageUrls.filter(Boolean).length;
      console.log(`✅ [DALL·E] ${generated}/${story.pages.length} images ready.`);
    } else {
      console.warn("[DALL·E] No OPENAI_API_KEY — SVG fallback active.");
    }

    // ── Enrich story metadata ──────────────────────────────────────────
    story.id       = `gen-${Date.now()}`;
    story.language = langCode;
    story.style    = illustrationStyle;
    story.voice    = voice;

    console.log(`✅ [Groq] Story complete: "${story.title}" (${langName})`);
    send("complete", story);
    res.end();

  } catch (err) {
    console.error("[Groq] Error:", err?.message || err);

    let friendlyMsg = "Something magical went wrong — please try again! 🌟";
    if      (err?.status === 429 || err?.message?.includes("rate"))    friendlyMsg = "Kiddsy AI is very busy right now — try again in a few seconds! ⏳";
    else if (err?.status === 401 || err?.message?.includes("auth"))    friendlyMsg = "There's a configuration issue — please contact support.";
    else if (err?.message?.includes("network") || err?.code === "ECONNREFUSED") friendlyMsg = "Can't reach Kiddsy AI — check your connection and try again.";

    if (res.headersSent) { send("error", { error: friendlyMsg }); res.end(); }
    else res.status(500).json({ error: friendlyMsg });
  }
});

// ═══════════════════════════════════════════════════════════════════════════
// POST /api/generate-image — DALL·E 3 standalone (for client-side calls)
// ═══════════════════════════════════════════════════════════════════════════
app.post("/api/generate-image", async (req, res) => {
  const { prompt, style = "" } = req.body;

  if (!prompt) return res.status(400).json({ error: "prompt is required" });

  const url = await generateDallEImage(prompt, style);
  if (!url) return res.status(500).json({ error: "DALL·E generation failed — check OPENAI_API_KEY." });

  res.json({ url });
});

// ═══════════════════════════════════════════════════════════════════════════
// POST /api/tts — OpenAI TTS with dynamic voice (nova / onyx / fable / shimmer)
// Also serves as /api/tts-preview — same endpoint, same logic
// ═══════════════════════════════════════════════════════════════════════════
const VALID_VOICES = new Set(["alloy", "echo", "fable", "onyx", "nova", "shimmer"]);

app.post("/api/tts", async (req, res) => {
  const { text, voice = "nova" } = req.body;

  if (!text || typeof text !== "string" || text.trim().length < 5) {
    return res.status(400).json({ error: "text is required." });
  }

  const safeVoice = VALID_VOICES.has(voice) ? voice : "nova";

  try {
    const response = await fetch("https://api.openai.com/v1/audio/speech", {
      method:  "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type":  "application/json",
      },
      body: JSON.stringify({
        model:  "tts-1",
        voice:  safeVoice,
        input:  text.slice(0, 4096),
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return res.status(response.status).json({ error: err?.error?.message || "TTS failed" });
    }

    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Cache-Control", "no-store");

    const reader = response.body.getReader();
    const pump   = async () => {
      const { done, value } = await reader.read();
      if (done) { res.end(); return; }
      res.write(Buffer.from(value));
      return pump();
    };
    await pump();

  } catch (e) {
    console.error("[TTS] Error:", e.message);
    if (!res.headersSent) res.status(500).json({ error: "TTS generation failed." });
  }
});

// ═══════════════════════════════════════════════════════════════════════════
// GET /api/stories — demo stories (real ones come from Supabase / localStorage)
// ═══════════════════════════════════════════════════════════════════════════
app.get("/api/stories", (_req, res) => {
  res.json([]);
});

// ═══════════════════════════════════════════════════════════════════════════
// GET /api/health
// ═══════════════════════════════════════════════════════════════════════════
app.get("/api/health", (_req, res) => {
  res.json({
    status:    "ok",
    app:       "Kiddsy",
    ai:        "Groq LLaMA 3.3 70B (streaming SSE)",
    images:    "DALL·E 3",
    tts:       "OpenAI TTS-1 (dynamic voice)",
    streaming: true,
    languages: Object.keys(LANG_MAP).length,
    groqKey:   !!process.env.GROQ_API_KEY,
    openaiKey: !!process.env.OPENAI_API_KEY,
  });
});

// ── Start ─────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`\n✅  Kiddsy API → http://localhost:${PORT}`);
  console.log(`🤖  AI: Groq LLaMA 3.3 70B (streaming SSE)`);
  console.log(`🎨  DALL·E 3: ${process.env.OPENAI_API_KEY ? "✓ key set" : "✗ OPENAI_API_KEY missing — images will be skipped"}`);
  console.log(`🔊  TTS: OpenAI TTS-1 (nova / onyx / fable / shimmer)`);
  console.log(`🌍  Languages: ${Object.values(LANG_MAP).join(", ")}`);
  console.log(`🔑  GROQ_API_KEY: ${process.env.GROQ_API_KEY ? "✓ set" : "✗ MISSING — add to .env"}\n`);
});

export default app;
