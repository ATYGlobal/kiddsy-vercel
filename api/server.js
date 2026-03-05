// api/index.js — Vercel Serverless Function (también funciona como server.js local)
import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// ─── Static story library ──────────────────────────────────────────────────
const STATIC_STORIES = [
  {
    id: "summer-sun",
    title: "Summer Sun",
    emoji: "☀️",
    color: "from-amber-400 to-orange-300",
    pages: [
      { en: "The summer sun is very bright.", es: "El sol de verano es muy brillante.", fr: "Le soleil d'été est très brillant.", ar: "شمس الصيف ساطعة جداً." },
      { en: "I wear my sunglasses and a hat.", es: "Uso mis gafas de sol y un sombrero.", fr: "Je porte mes lunettes de soleil et un chapeau.", ar: "أرتدي نظاراتي الشمسية وقبعة." },
      { en: "We go to the park to play.", es: "Vamos al parque a jugar.", fr: "Nous allons au parc pour jouer.", ar: "نذهب إلى الحديقة للعب." },
    ],
  },
  {
    id: "crossing-street",
    title: "Crossing the Street",
    emoji: "🚦",
    color: "from-green-400 to-teal-300",
    pages: [
      { en: "We stop at the edge of the road.", es: "Nos detenemos al borde del camino.", fr: "Nous nous arrêtons au bord de la route.", ar: "نتوقف عند حافة الطريق." },
      { en: "We look left, then right.", es: "Miramos a la izquierda, luego a la derecha.", fr: "Nous regardons à gauche, puis à droite.", ar: "ننظر يساراً ثم يميناً." },
      { en: "The green light says: Walk!", es: "La luz verde dice: ¡Camina!", fr: "Le feu vert dit : Marchez !", ar: "الضوء الأخضر يقول: امشِ!" },
    ],
  },
  {
    id: "at-market",
    title: "At the Market",
    emoji: "🛒",
    color: "from-purple-400 to-pink-300",
    pages: [
      { en: "We need to buy food for the week.", es: "Necesitamos comprar comida para la semana.", fr: "Nous devons acheter de la nourriture pour la semaine.", ar: "نحن بحاجة لشراء طعام للأسبوع." },
      { en: "I see apples, bread, and milk.", es: "Veo manzanas, pan y leche.", fr: "Je vois des pommes, du pain et du lait.", ar: "أرى تفاحاً وخبزاً وحليباً." },
      { en: "Thank you! Have a nice day!", es: "¡Gracias! ¡Que tenga un buen día!", fr: "Merci ! Bonne journée !", ar: "شكراً! أتمنى لك يوماً سعيداً!" },
    ],
  },
  {
    id: "friendly-dog",
    title: "The Friendly Dog",
    emoji: "🐕",
    color: "from-blue-400 to-cyan-300",
    pages: [
      { en: "I see a brown dog in the park.", es: "Veo un perro marrón en el parque.", fr: "Je vois un chien marron dans le parc.", ar: "أرى كلباً بنياً في الحديقة." },
      { en: "May I pet your dog? she asks.", es: "¿Puedo acariciar a tu perro? pregunta ella.", fr: "Puis-je caresser votre chien ? demande-t-elle.", ar: "هل يمكنني تربيت كلبك؟ تسأل." },
      { en: "Yes! His name is Biscuit!", es: "¡Sí! ¡Su nombre es Biscuit!", fr: "Oui ! Il s'appelle Biscuit !", ar: "نعم! اسمه بسكويت!" },
    ],
  },
  {
    id: "sweet-dreams",
    title: "Sweet Dreams",
    emoji: "🌙",
    color: "from-indigo-400 to-violet-300",
    pages: [
      { en: "The moon is high in the sky.", es: "La luna está alta en el cielo.", fr: "La lune est haute dans le ciel.", ar: "القمر عالٍ في السماء." },
      { en: "It is time to sleep now.", es: "Es hora de dormir ahora.", fr: "Il est temps de dormir maintenant.", ar: "حان وقت النوم الآن." },
      { en: "Good night! Sweet dreams!", es: "¡Buenas noches! ¡Dulces sueños!", fr: "Bonne nuit ! Beaux rêves !", ar: "تصبح على خير! أحلام سعيدة!" },
    ],
  },
];

// ─── GET /api/stories ──────────────────────────────────────────────────────
app.get("/api/stories", (_req, res) => {
  res.json(STATIC_STORIES);
});

// ─── POST /api/generate-story ──────────────────────────────────────────────
app.post("/api/generate-story", async (req, res) => {
  const { childName = "Alex", theme = "adventure", language = "es" } = req.body;

  const langName = { es: "Spanish", fr: "French", ar: "Arabic" }[language] || "Spanish";

  const prompt = `You are a warm, bilingual children's story author for migrant families learning English.

Create a short 4-page bilingual storybook for a child named "${childName}" about "${theme}".

Respond ONLY with valid JSON in this exact format (no markdown, no extra text):
{
  "title": "Story title",
  "emoji": "A single relevant emoji",
  "pages": [
    { "en": "English sentence.", "${language}": "${langName} translation." },
    { "en": "English sentence.", "${language}": "${langName} translation." },
    { "en": "English sentence.", "${language}": "${langName} translation." },
    { "en": "English sentence.", "${language}": "${langName} translation." }
  ]
}

Rules:
- Each sentence must be short (max 10 words), simple and joyful.
- ${langName} translation must be natural and accurate.
- The story should be encouraging and culturally warm.
- Child's name "${childName}" must appear in the story.`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 500,
      temperature: 0.8,
    });

    const raw = completion.choices[0].message.content.trim();
    const story = JSON.parse(raw);

    // Validate shape
    if (!story.title || !Array.isArray(story.pages) || story.pages.length === 0) {
      throw new Error("Invalid story shape");
    }

    res.json({
      id: `generated-${Date.now()}`,
      color: "from-rose-400 to-pink-300",
      language,
      ...story,
    });
  } catch (err) {
    console.error("Story generation error:", err.message);
    res.status(500).json({
      error: "Could not generate story. Please check your OPENAI_API_KEY.",
      detail: err.message,
    });
  }
});

// ─── Health check ──────────────────────────────────────────────────────────
app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

// ─── Local dev server (not used by Vercel) ────────────────────────────────
if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 API running on http://localhost:${PORT}`));
}

export default app;
