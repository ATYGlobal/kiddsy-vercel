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
function buildSystemPrompt(langCode, childName = "the child") {
  const langName = LANG_MAP[langCode] || "Spanish";
  const isRTL    = RTL_LANGS.has(langCode);
  const rtlNote  = isRTL ? " Note: this language reads right-to-left — keep translation natural." : "";

  // Combine all theme words for variety
  const vocabPool = Object.values(THEME_VOCAB).flat();
  const vocabSample = vocabPool.sort(() => Math.random() - 0.5).slice(0, 6).join(", ");

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

IMAGE PROMPT RULE:
- "dalle_prompt": Whimsical, soft watercolor children's book illustration, magical lighting, no text, featuring ${childName}.

OUTPUT FORMAT:
- Respond ONLY with a valid JSON object. No markdown, no backticks, no preamble.

JSON SCHEMA:
{
  "title": "Story title",
  "emoji": "🌟",
  "color": "from-blue-400 to-cyan-300",
  "dalle_prompt": "Prompt for DALL-E",
  "pages": [
    {
      "en": "English text (approx 30-35 words).",
      "${langCode}": "${langName} text.",
      "image_svg": "<svg>...</svg>"
    }
  ]
}

COLOR OPTIONS: "from-blue-400 to-cyan-300" | "from-green-400 to-emerald-300" | "from-pink-400 to-rose-300" | "from-orange-400 to-amber-300" | "from-purple-400 to-violet-300" | "from-yellow-400 to-amber-300"`;
}

// ─── Helper: limpia el JSON de la respuesta de la IA ──────────────────────
/**
 * Extrae y limpia el JSON de la respuesta de la IA.
 * Busca el bloque entre las primeras y últimas llaves para evitar errores de parseo.
 */
function cleanJson(raw = "") {
  if (!raw) return "";
  
  try {
    // 1. Buscamos la posición del primer '{' y el último '}'
    const firstBracket = raw.indexOf("{");
    const lastBracket = raw.lastIndexOf("}");

    if (firstBracket === -1 || lastBracket === -1) {
      // Si no hay llaves, intentamos limpiar markdown básico por si acaso
      return raw.replace(/```json|```/gi, "").trim();
    }

    // 2. Extraemos solo la parte del objeto
    const jsonString = raw.substring(firstBracket, lastBracket + 1);

    return jsonString.trim();
  } catch (e) {
    console.error("Error crítico limpiando JSON:", e);
    return "";
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// ENDPOINT PRINCIPAL — Generación de Cuentos Premium
// ═══════════════════════════════════════════════════════════════════════════
app.post("/api/generate-story", async (req, res) => {
  const { childName, theme, language = "es" } = req.body;

  // 1. Validación (Mantenemos tu lógica inicial)
  if (!childName?.trim() || !theme?.trim()) {
    return res.status(400).json({ error: "childName and theme are required." });
  }

  const groqKey = process.env.GROQ_API_KEY;
  if (!groqKey) {
    return res.status(500).json({ error: "GROQ_API_KEY is not set in .env" });
  }

  try {
    // 2. Construimos el nuevo System Prompt de 8 páginas
    // Nota: Asegúrate de que buildSystemPrompt esté definida en este mismo archivo
    const systemPrompt = buildSystemPrompt(language, childName);
    const userPrompt = `Write a magical, 8-page story about ${theme} where ${childName} is the main hero.`;

    // 3. Llamada a Groq (Usando JSON Mode para evitar errores de formato)
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${groqKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "mixtral-8x7b-32768", // El modelo más rápido y capaz para esto
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.7,
        response_format: { type: "json_object" } // Forzamos a Groq a responder con JSON puro
      }),
    });

    const data = await response.json();
    
    if (data.error) throw new Error(data.error.message);

    const rawContent = data.choices[0]?.message?.content;

    // 4. Limpieza y Validación del JSON generado
    const sanitizedJson = cleanJson(rawContent);
    const finalStory = JSON.parse(sanitizedJson);

    // 5. Respuesta final al Frontend
    console.log(`✅ Cuento generado con éxito para ${childName}`);
    res.json(finalStory);

  } catch (error) {
    console.error("❌ Error en la generación:", error);
    res.status(500).json({ 
      error: "No pudimos crear la magia en este momento.",
      details: error.message 
    });
  }
});
  

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
// ─── OpenAI TTS ────────────────────────────────────────────────────────────
// Requiere: OPENAI_API_KEY en .env
// Devuelve: audio/mpeg stream directo al cliente
app.post("/api/tts", async (req, res) => {
  const { text } = req.body;
  if (!text || typeof text !== "string" || text.trim().length < 5) {
    return res.status(400).json({ error: "text is required." });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/audio/speech", {
      method:  "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type":  "application/json",
      },
      body: JSON.stringify({
        model: "tts-1",
        voice: "nova",
        input: text.slice(0, 4096), // límite seguro OpenAI
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return res.status(response.status).json({ error: err?.error?.message || "TTS failed" });
    }

    // Pipe the audio stream directly to the client
    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Cache-Control", "no-store");
    const reader = response.body.getReader();
    const pump = async () => {
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
// ── Start ─────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`✅  Kiddsy API → http://localhost:${PORT}`);
  console.log(`🤖  AI: Groq LLaMA 3.3 70B (streaming SSE)`);
  console.log(`🌍  Languages: ${Object.values(LANG_MAP).join(", ")}`);
  console.log(`🔑  GROQ_API_KEY: ${process.env.GROQ_API_KEY ? "✓ set" : "✗ MISSING — add to .env"}`);
});

export default app;
