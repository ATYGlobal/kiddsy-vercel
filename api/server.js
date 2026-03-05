<<<<<<< HEAD
/**
 * api/server.js — Kiddsy
 * Story generation backend using Google Gemini 1.5 Flash (free tier)
 *
 * Required env var:
 *   GOOGLE_GENAI_API_KEY=AIzaSy...   (from https://aistudio.google.com/app/apikey)
 *
 * Start locally:
 *   node api/server.js
 */

import express from "express";
import cors    from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Gemini client ─────────────────────────────────────────────────────────
const apiKey = process.env.GOOGLE_GENAI_API_KEY;
if (!apiKey) {
  console.warn("⚠️  GOOGLE_GENAI_API_KEY is not set. Story generation will fail.");
}

const genAI = new GoogleGenerativeAI(apiKey ?? "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// ── Static story library ──────────────────────────────────────────────────
const STATIC_STORIES = [
  {
    id: "story-1",
    title: "A Day at School",
    emoji: "🏫",
    color: "from-blue-400 to-cyan-300",
    pages: [
      { en: "Sofia arrives at school with a big smile.",        es: "Sofía llega a la escuela con una gran sonrisa.",        fr: "Sofia arrive à l'école avec un grand sourire.",        ar: "وصلت صوفيا إلى المدرسة بابتسامة كبيرة." },
      { en: "She meets her new teacher, Mr. Green.",            es: "Conoce a su nuevo maestro, el señor Verde.",            fr: "Elle rencontre son nouveau professeur, M. Vert.",       ar: "قابلت معلمها الجديد، السيد أخضر." },
      { en: "Sofia learns the alphabet and sings a song.",      es: "Sofía aprende el abecedario y canta una canción.",      fr: "Sofia apprend l'alphabet et chante une chanson.",      ar: "تعلمت صوفيا الأبجدية وغنت أغنية." },
      { en: "She goes home happy and ready for tomorrow!",      es: "Ella llega a casa feliz y lista para mañana.",          fr: "Elle rentre chez elle heureuse et prête pour demain!", ar: "عادت إلى البيت سعيدة ومستعدة لليوم التالي!" },
    ],
  },
  {
    id: "story-2",
    title: "The Friendly Market",
    emoji: "🛒",
    color: "from-green-400 to-emerald-300",
    pages: [
      { en: "Omar and his mom go to the market.",               es: "Omar y su mamá van al mercado.",                       fr: "Omar et sa maman vont au marché.",                     ar: "ذهب عمر وأمه إلى السوق." },
      { en: "They buy apples, bread, and milk.",                es: "Compran manzanas, pan y leche.",                       fr: "Ils achètent des pommes, du pain et du lait.",        ar: "اشتروا تفاحاً وخبزاً وحليباً." },
      { en: "Omar learns to say 'thank you' in English.",       es: "Omar aprende a decir 'gracias' en inglés.",           fr: "Omar apprend à dire 'merci' en anglais.",             ar: "تعلم عمر كيف يقول 'شكراً' بالإنجليزية." },
      { en: "The shopkeeper smiles and waves goodbye.",         es: "El tendero sonríe y dice adiós con la mano.",         fr: "Le commerçant sourit et fait au revoir de la main.",  ar: "ابتسم صاحب الدكان وودّعهم بيده." },
    ],
  },
  {
    id: "story-3",
    title: "The Yellow Bus",
    emoji: "🚌",
    color: "from-yellow-400 to-amber-300",
    pages: [
      { en: "Every morning Amina takes the yellow school bus.", es: "Cada mañana Amina toma el autobús escolar amarillo.",  fr: "Chaque matin Amina prend le bus scolaire jaune.",     ar: "كل صباح تأخذ أمينة الحافلة المدرسية الصفراء." },
      { en: "She sits next to her best friend Leo.",            es: "Se sienta junto a su mejor amigo Leo.",               fr: "Elle s'assoit à côté de son meilleur ami Léo.",       ar: "جلست بجانب صديقها المفضل ليو." },
      { en: "They talk about their favorite animals.",          es: "Hablan de sus animales favoritos.",                   fr: "Ils parlent de leurs animaux préférés.",              ar: "تحدثا عن حيواناتهم المفضلة." },
      { en: "School is fun when you have a friend!",           es: "¡La escuela es divertida cuando tienes un amigo!",   fr: "L'école est amusante quand on a un ami !",           ar: "المدرسة ممتعة حين يكون لديك صديق!" },
    ],
  },
  {
    id: "story-4",
    title: "Doctor's Visit",
    emoji: "🏥",
    color: "from-red-400 to-rose-300",
    pages: [
      { en: "Lucas feels sick and goes to the doctor.",         es: "Lucas se siente enfermo y va al médico.",             fr: "Lucas se sent malade et va chez le médecin.",        ar: "شعر لوكاس بالمرض وذهب إلى الطبيب." },
      { en: "The doctor is kind and listens carefully.",        es: "La doctora es amable y escucha con atención.",        fr: "La médecin est gentille et écoute attentivement.",   ar: "الطبيبة لطيفة وتستمع باهتمام." },
      { en: "Lucas learns new words: head, tummy, arm.",        es: "Lucas aprende palabras nuevas: cabeza, barriga, brazo.", fr: "Lucas apprend des mots : tête, ventre, bras.",    ar: "تعلم لوكاس كلمات جديدة: رأس، بطن، ذراع." },
      { en: "He goes home feeling much better!",                es: "¡Regresa a casa sintiéndose mucho mejor!",           fr: "Il rentre chez lui en se sentant beaucoup mieux !",  ar: "عاد إلى البيت وهو يشعر بتحسن كبير!" },
    ],
  },
  {
    id: "story-5",
    title: "Sweet Dreams",
    emoji: "🌙",
    color: "from-purple-400 to-indigo-300",
    pages: [
      { en: "It is bedtime and the stars are shining.",         es: "Es hora de dormir y las estrellas brillan.",          fr: "C'est l'heure du coucher et les étoiles brillent.",  ar: "حان وقت النوم والنجوم تتألق." },
      { en: "Mom reads a story in two languages.",              es: "Mamá lee un cuento en dos idiomas.",                  fr: "Maman lit une histoire en deux langues.",            ar: "تقرأ الأم قصة بلغتين." },
      { en: "The child repeats the words slowly.",              es: "El niño repite las palabras despacio.",               fr: "L'enfant répète les mots lentement.",                ar: "يكرر الطفل الكلمات ببطء." },
      { en: "Goodnight! Learning never stops.",                 es: "¡Buenas noches! El aprendizaje nunca se detiene.",    fr: "Bonne nuit ! L'apprentissage ne s'arrête jamais.",  ar: "تصبح على خير! التعلم لا يتوقف أبداً." },
=======
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
>>>>>>> origin/main
    ],
  },
];

<<<<<<< HEAD
// ── GET /api/stories ──────────────────────────────────────────────────────
=======
// ─── GET /api/stories ──────────────────────────────────────────────────────
>>>>>>> origin/main
app.get("/api/stories", (_req, res) => {
  res.json(STATIC_STORIES);
});

<<<<<<< HEAD
// ── POST /api/generate-story ──────────────────────────────────────────────
app.post("/api/generate-story", async (req, res) => {
  const { childName, theme, language } = req.body;

  if (!childName || !theme) {
    return res.status(400).json({ error: "childName and theme are required." });
  }

  const languageMap = {
    es: "Spanish",
    fr: "French",
    ar: "Arabic",
  };
  const targetLanguage = languageMap[language] || "Spanish";
  const langCode = language || "es";

  // ── Gemini prompt ────────────────────────────────────────────────────────
  const prompt = `
You are a bilingual children's story writer for an app that helps migrant families learn English.

Create a short, joyful, age-appropriate story for a child named "${childName}" about the theme: "${theme}".

Rules:
- Exactly 4 pages.
- Each page has ONE sentence in English and ONE sentence in ${targetLanguage}.
- English sentences must be simple (max 12 words), positive, and use basic vocabulary.
- ${targetLanguage} sentences must be natural translations (not literal word-for-word).
- The child's name (${childName}) must appear in the story naturally.
- The story must have a warm, encouraging tone suitable for ages 4–9.
- Do NOT include any unsafe, scary, or adult content.

Respond ONLY with a valid JSON object in this exact format (no markdown, no code fences):
{
  "title": "Story Title Here",
  "emoji": "🌟",
  "color": "from-blue-400 to-cyan-300",
  "pages": [
    { "en": "English sentence 1.", "${langCode}": "${targetLanguage} sentence 1." },
    { "en": "English sentence 2.", "${langCode}": "${targetLanguage} sentence 2." },
    { "en": "English sentence 3.", "${langCode}": "${targetLanguage} sentence 3." },
    { "en": "English sentence 4.", "${langCode}": "${targetLanguage} sentence 4." }
  ]
}

Choose the "color" from one of these Tailwind gradient strings:
"from-blue-400 to-cyan-300" | "from-green-400 to-emerald-300" | "from-yellow-400 to-amber-300" |
"from-red-400 to-rose-300" | "from-purple-400 to-indigo-300" | "from-pink-400 to-rose-300" |
"from-orange-400 to-amber-300" | "from-teal-400 to-cyan-300"

Choose an appropriate single emoji for "emoji" that relates to the theme.
`;

  try {
    const result = await model.generateContent(prompt);
    const rawText = result.response.text().trim();

    // Strip any accidental markdown code fences Gemini might add
    const cleaned = rawText
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    let story;
    try {
      story = JSON.parse(cleaned);
    } catch (parseErr) {
      console.error("Gemini JSON parse error. Raw text:", rawText);
      return res.status(500).json({
        error: "The AI returned an unexpected format. Please try again.",
      });
    }

    // Attach a unique ID so the frontend can key on it
    story.id = `generated-${Date.now()}`;

    // Validate minimum structure
    if (!story.title || !Array.isArray(story.pages) || story.pages.length === 0) {
      return res.status(500).json({ error: "Incomplete story generated. Please try again." });
    }

    res.json(story);
  } catch (err) {
    console.error("Gemini API error:", err.message);

    // Friendly error messages for common issues
    if (err.message?.includes("API_KEY_INVALID") || err.message?.includes("API key")) {
      return res.status(500).json({ error: "Invalid Google API key. Check GOOGLE_GENAI_API_KEY in your .env file." });
    }
    if (err.message?.includes("quota") || err.message?.includes("RESOURCE_EXHAUSTED")) {
      return res.status(429).json({ error: "Free tier quota reached. Please try again in a minute." });
    }

    res.status(500).json({ error: "Story generation failed. Please try again." });
  }
});

// ── Health check ──────────────────────────────────────────────────────────
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    app: "Kiddsy",
    ai: "Google Gemini 1.5 Flash",
    keyConfigured: !!apiKey,
  });
});

app.listen(PORT, () => {
  console.log(`✅ Kiddsy API running on http://localhost:${PORT}`);
  console.log(`   AI provider : Google Gemini 1.5 Flash`);
  console.log(`   API key set : ${apiKey ? "YES ✓" : "NO ✗ — set GOOGLE_GENAI_API_KEY"}`);
});
=======
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
>>>>>>> origin/main
