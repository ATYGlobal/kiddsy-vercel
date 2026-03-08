/**
 * api/server.js — Kiddsy
 * ─────────────────────────────────────────────────────────────────────────
 * • Servidor de generación de IA con Gemini 2.0 Flash (fetch directo)
 * • 16 idiomas: ES, FR, AR, DE, IT, PT, RU, ZH, JA, KO, BN, HI, NL, PL, NO, SV
 * • Puerto 10000
 * ─────────────────────────────────────────────────────────────────────────
 */

import express from 'express';
import cors    from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// ─── Mapa completo de idiomas soportados ──────────────────────────────────
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
// RUTAS API
// ═══════════════════════════════════════════════════════════════════════════

// ── POST /api/generate-story — Gemini 2.0 Flash ───────────────────────────
app.post("/api/generate-story", async (req, res) => {
  const { childName, theme, language } = req.body;

  if (!childName || !theme) {
    return res.status(400).json({ error: "childName y theme son obligatorios." });
  }

  const apiKey = process.env.GOOGLE_GENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "GOOGLE_GENAI_API_KEY no configurada en .env" });
  }

  const langCode = language || "es";
  const langName = LANG_MAP[langCode] || "Spanish";

  // RTL languages need a note for proper text direction
  const isRTL = ["ar"].includes(langCode);
  const rtlNote = isRTL ? "(This language reads right-to-left — keep the translation natural)" : "";

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

  const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  try {
    console.log(`✨ Generating story for ${childName} about "${theme}" in ${langName}…`);

    const geminiRes = await fetch(GEMINI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.8,
          maxOutputTokens: 1200,
        },
      }),
    });

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error("Gemini HTTP error:", geminiRes.status, errText);
      if (geminiRes.status === 429)
        return res.status(429).json({ error: "Gemini quota reached. Try again in a minute." });
      if (geminiRes.status === 400)
        return res.status(400).json({ error: "Invalid API key. Check GOOGLE_GENAI_API_KEY." });
      return res.status(500).json({ error: `Gemini error: ${geminiRes.status}` });
    }

    const geminiData = await geminiRes.json();
    const rawText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    // Strip markdown fences if Gemini wraps in ```json ... ```
    const cleaned = rawText
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    let story;
    try {
      story = JSON.parse(cleaned);
    } catch {
      console.error("JSON parse error from Gemini:", rawText.slice(0, 400));
      return res.status(500).json({ error: "AI returned unexpected format. Please try again." });
    }

    story.id       = `generated-${Date.now()}`;
    story.language = langCode; // store which language was used

    if (!story.title || !Array.isArray(story.pages) || story.pages.length === 0) {
      return res.status(500).json({ error: "Incomplete story generated. Please try again." });
    }

    console.log(`✅ Story generated: "${story.title}" (${langName})`);
    res.json(story);

  } catch (err) {
    console.error("Network error calling Gemini:", err.message);
    res.status(500).json({ error: "Could not reach AI. Check your connection." });
  }
});

// ── Health check ──────────────────────────────────────────────────────────
app.get("/api/health", (_req, res) => {
  res.json({
    status:        "ok",
    app:           "Kiddsy",
    ai:            "Gemini 2.0 Flash",
    languages:     Object.keys(LANG_MAP).length,
    keyConfigured: !!process.env.GOOGLE_GENAI_API_KEY,
  });
});

// ── Start ─────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`✅ Kiddsy API → http://localhost:${PORT}`);
  console.log(`🌍 Languages: ${Object.values(LANG_MAP).join(", ")}`);
  console.log(`🤖 AI: Gemini 2.0 Flash`);
});

export default app;
