/**
 * api/server.js — Kiddsy
 * ─────────────────────────────────────────────────────────────────────────
 * • Servidor simplificado: Solo maneja la generación de IA.
 * • Llama a Gemini 2.0 Flash vía fetch directo (v1beta) — sin SDK
 * • Puerto 10000 
 * ─────────────────────────────────────────────────────────────────────────
 */

import express from 'express';
import cors    from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

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

  const langMap  = { es: "Spanish", fr: "French", ar: "Arabic" };
  const langName = langMap[language] || "Spanish";
  const langCode = language || "es";

  const prompt = `
You are a bilingual children's story writer and SVG illustrator.
Create a short, joyful story for a child named "${childName}" about: "${theme}".

Rules:
- Exactly 4 pages.
- Each page must have: 
  1. One simple English sentence.
  2. One ${langName} translation.
  3. One "image_svg": A simple, colorful SVG illustration (viewBox="0 0 100 100"). 
     Use basic shapes (rect, circle, path) and bright colors. Avoid complex details.
- Use the child's name (${childName}) naturally.
- Response must be ONLY a valid JSON object.

JSON Format:
{
  "title": "Story Title",
  "emoji": "🌟",
  "color": "from-blue-400 to-cyan-300",
  "pages": [
    { 
      "en": "...", 
      "${langCode}": "...", 
      "image_svg": "<svg ...>...</svg>" 
    }
  ]
}
`;

  const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  try {
    console.log(`✨ Generando cuento para ${childName} sobre "${theme}"…`);

    const geminiRes = await fetch(GEMINI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.8,
          maxOutputTokens: 800,
        },
      }),
    });

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error("Gemini HTTP error:", geminiRes.status, errText);

      if (geminiRes.status === 429) {
        return res.status(429).json({ error: "Cuota de Gemini agotada. Inténtalo en un minuto." });
      }
      if (geminiRes.status === 400) {
        return res.status(400).json({ error: "Clave de API inválida. Revisa GOOGLE_GENAI_API_KEY." });
      }
      return res.status(500).json({ error: `Error de Gemini: ${geminiRes.status}` });
    }

    const geminiData = await geminiRes.json();
    const rawText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    const cleaned = rawText
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    let story;
    try {
      story = JSON.parse(cleaned);
    } catch {
      console.error("Error parseando JSON de Gemini:", rawText);
      return res.status(500).json({ error: "La IA devolvió un formato inesperado. Inténtalo de nuevo." });
    }

    story.id = `generated-${Date.now()}`;

    if (!story.title || !Array.isArray(story.pages) || story.pages.length === 0) {
      return res.status(500).json({ error: "Cuento incompleto generado. Inténtalo de nuevo." });
    }

    console.log(`✅ Cuento generado: "${story.title}"`);
    res.json(story);

  } catch (err) {
    console.error("Error de red al llamar a Gemini:", err.message);
    res.status(500).json({ error: "No se pudo conectar con la IA. Revisa tu conexión." });
  }
});

// ── Health check ──────────────────────────────────────────────────────────
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    app: "Kiddsy",
    ai: "Gemini 2.0 Flash (fetch directo)",
    keyConfigured: !!process.env.GOOGLE_GENAI_API_KEY,
  });
});

// ── Arrancar ──────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`✅ Kiddsy API en http://localhost:${PORT}`);
  console.log(`🤖 IA: Gemini 2.0 Flash lista para crear cuentos`);
});

export default app;