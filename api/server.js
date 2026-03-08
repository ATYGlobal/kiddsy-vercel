/**
 * api/server.js — Kiddsy
 * ─────────────────────────────────────────────────────────────────────────
 * VERSIÓN ACTUAL — TODO INTEGRADO:
 * • Generación de cuentos con Gemini 2.0 Flash (fetch directo)
 * • 16 idiomas: ES, FR, AR, DE, IT, PT, RU, ZH, JA, KO, BN, HI, NL, PL, NO, SV
 * • /api/stories    → devuelve la lista pública de cuentos precargados
 * • /api/generate-story → genera cuento personalizado con Gemini
 * • /api/health     → estado del servidor
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

// ── GET /api/stories — Cuentos públicos precargados ───────────────────────
// El frontend los carga al arrancar para poblar la Story Library.
// Añade aquí cuentos estáticos en formato { id, title, emoji, color, pages[] }
// o conéctalos a tu base de datos en el futuro.
const STATIC_STORIES = [
  {
    id: "static-1",
    title: "The Brave Little Star",
    emoji: "⭐",
    color: "from-yellow-400 to-amber-300",
    language: "es",
    pages: [
      {
        en: "Once upon a time, a little star lived high up in the sky.",
        es: "Érase una vez, una pequeña estrella vivía en lo alto del cielo.",
        image_svg: "<svg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'><rect width='100' height='100' fill='#1a1a4e'/><circle cx='50' cy='45' r='18' fill='#FFD700' opacity='0.9'/><polygon points='50,22 54,38 70,38 58,48 62,64 50,54 38,64 42,48 30,38 46,38' fill='#FFE566'/><circle cx='25' cy='20' r='3' fill='white' opacity='0.6'/><circle cx='75' cy='30' r='2' fill='white' opacity='0.5'/><circle cx='15' cy='55' r='2' fill='white' opacity='0.4'/><circle cx='85' cy='65' r='3' fill='white' opacity='0.6'/></svg>",
      },
      {
        en: "Every night, the star shone its light for all the children below.",
        es: "Cada noche, la estrella brillaba su luz para todos los niños de abajo.",
        image_svg: "<svg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'><rect width='100' height='100' fill='#1a1a4e'/><polygon points='50,15 54,30 70,30 58,39 62,54 50,45 38,54 42,39 30,30 46,30' fill='#FFD700'/><path d='M50 45 L20 80' stroke='#FFD70066' stroke-width='8' stroke-linecap='round'/><circle cx='20' cy='82' r='6' fill='#FF9800'/><circle cx='35' cy='86' r='5' fill='#4CAF50'/><circle cx='50' cy='88' r='5' fill='#E91E63'/></svg>",
      },
      {
        en: "One day, a cloud covered the star and it felt very sad.",
        es: "Un día, una nube cubrió la estrella y se sintió muy triste.",
        image_svg: "<svg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'><rect width='100' height='100' fill='#2c3e50'/><ellipse cx='50' cy='40' rx='35' ry='20' fill='#90A4AE'/><polygon points='50,25 53,35 63,35 55,41 58,51 50,45 42,51 45,41 37,35 47,35' fill='#FFD700' opacity='0.3'/><path d='M35 55 Q38 65 35 68' stroke='#90A4AE' stroke-width='2' fill='none'/><path d='M50 58 Q53 68 50 72' stroke='#90A4AE' stroke-width='2' fill='none'/><path d='M65 55 Q68 65 65 68' stroke='#90A4AE' stroke-width='2' fill='none'/></svg>",
      },
      {
        en: "But the star was brave! It shone even brighter and the cloud disappeared.",
        es: "¡Pero la estrella fue valiente! Brilló aún más y la nube desapareció.",
        image_svg: "<svg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'><rect width='100' height='100' fill='#0d1b4e'/><circle cx='50' cy='50' r='30' fill='#FFD700' opacity='0.25'/><polygon points='50,22 55,38 72,38 59,48 64,64 50,54 36,64 41,48 28,38 45,38' fill='#FFE566'/><line x1='50' y1='5' x2='50' y2='15' stroke='#FFE566' stroke-width='3' stroke-linecap='round'/><line x1='50' y1='85' x2='50' y2='95' stroke='#FFE566' stroke-width='3' stroke-linecap='round'/><line x1='5' y1='50' x2='15' y2='50' stroke='#FFE566' stroke-width='3' stroke-linecap='round'/><line x1='85' y1='50' x2='95' y2='50' stroke='#FFE566' stroke-width='3' stroke-linecap='round'/></svg>",
      },
    ],
  },
  {
    id: "static-2",
    title: "Luna and the Magic Garden",
    emoji: "🌸",
    color: "from-pink-400 to-rose-300",
    language: "es",
    pages: [
      {
        en: "Luna loved her little garden more than anything in the world.",
        es: "Luna amaba su pequeño jardín más que cualquier cosa en el mundo.",
        image_svg: "<svg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'><rect width='100' height='100' fill='#E8F5E9'/><rect x='0' y='70' width='100' height='30' fill='#8BC34A'/><circle cx='30' cy='55' r='18' fill='#4CAF50'/><rect x='27' y='55' width='6' height='20' fill='#795548'/><circle cx='65' cy='50' r='12' fill='#FF7043'/><rect x='62' y='52' width='5' height='18' fill='#795548'/><circle cx='50' cy='30' r='8' fill='#FF80AB'/><rect x='47' y='32' width='5' height='16' fill='#795548'/></svg>",
      },
      {
        en: "One morning, she found a tiny glowing seed in the grass.",
        es: "Una mañana, encontró una pequeña semilla brillante en el pasto.",
        image_svg: "<svg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'><rect width='100' height='100' fill='#F1F8E9'/><rect x='0' y='65' width='100' height='35' fill='#AED581'/><ellipse cx='50' cy='65' rx='12' ry='5' fill='#8BC34A'/><ellipse cx='50' cy='62' rx='8' ry='8' fill='#FFD700'/><circle cx='50' cy='62' r='5' fill='#FFF176'/><path d='M50 62 L50 55' stroke='#FFD700' stroke-width='2'/><circle cx='55' cy='40' r='10' fill='#FFCC02' opacity='0.15'/><circle cx='55' cy='40' r='6' fill='#FFCC02' opacity='0.2'/></svg>",
      },
      {
        en: "Luna planted the seed and watered it every day with love.",
        es: "Luna plantó la semilla y la regó todos los días con amor.",
        image_svg: "<svg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'><rect width='100' height='100' fill='#E3F2FD'/><rect x='0' y='65' width='100' height='35' fill='#A5D6A7'/><rect x='43' y='55' width='14' height='30' fill='#4CAF50' rx='4'/><path d='M25 30 Q30 50 43 58' stroke='#29B6F6' stroke-width='3' fill='none'/><circle cx='22' cy='28' r='5' fill='#64B5F6'/><path d='M20 30 L18 38 M24 30 L24 38 M28 28 L30 36' stroke='#64B5F6' stroke-width='1.5' stroke-linecap='round'/><circle cx='60' cy='48' r='5' fill='#66BB6A'/></svg>",
      },
      {
        en: "A magnificent rainbow flower bloomed and filled the garden with joy!",
        es: "¡Una magnífica flor arcoíris floreció y llenó el jardín de alegría!",
        image_svg: "<svg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'><rect width='100' height='100' fill='#F8BBD0'/><rect x='0' y='72' width='100' height='28' fill='#A5D6A7'/><rect x='46' y='52' width='8' height='22' fill='#4CAF50'/><circle cx='50' cy='46' r='16' fill='#FF80AB'/><circle cx='50' cy='30' r='8' fill='#FF4081'/><circle cx='64' cy='38' r='8' fill='#FF9800'/><circle cx='69' cy='54' r='8' fill='#FFEB3B'/><circle cx='36' cy='38' r='8' fill='#7C4DFF'/><circle cx='31' cy='54' r='8' fill='#00BCD4'/><circle cx='50' cy='46' r='9' fill='#FFE0B2'/></svg>",
      },
    ],
  },
];

app.get("/api/stories", (_req, res) => {
  res.json(STATIC_STORIES);
});


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
