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
    ],
  },
];

// ── GET /api/stories ──────────────────────────────────────────────────────
app.get("/api/stories", (_req, res) => {
  res.json(STATIC_STORIES);
});

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
