/**
 * api/server.js — Kiddsy
 * ─────────────────────────────────────────────────────────────────────────
 * • Llama a Gemini 2.0 Flash vía fetch directo (v1beta) — sin SDK
 * • Puerto 10000 (igual que tu configuración actual)
 * • Variable de entorno: GOOGLE_GENAI_API_KEY
 * • Biblioteca estática: 20 cuentos (historias 1-5 + 16-25)
 * ─────────────────────────────────────────────────────────────────────────
 */

import express from 'express';
import cors    from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// ═══════════════════════════════════════════════════════════════════════════
// BIBLIOTECA ESTÁTICA — Historias 1-25
// Árabe corregido: extraído directamente de Unicode (sin caracteres mojibake)
// ═══════════════════════════════════════════════════════════════════════════
const STATIC_STORIES = [

  // ── HISTORIAS ORIGINALES 1-25 ────────────────────────────────────────────
  {
    id: "story-1",
    title: "A Day at School",
    emoji: "🏫",
    color: "from-blue-400 to-cyan-300",
    pages: [
      { en: "Sofia arrives at school with a big smile.",      es: "Sofía llega a la escuela con una gran sonrisa.",      fr: "Sofia arrive à l'école avec un grand sourire.",        ar: "وصلت صوفيا إلى المدرسة بابتسامة كبيرة." },
      { en: "She meets her new teacher, Mr. Green.",          es: "Conoce a su nuevo maestro, el señor Verde.",          fr: "Elle rencontre son nouveau professeur, M. Vert.",       ar: "قابلت معلمها الجديد، السيد أخضر." },
      { en: "Sofia learns the alphabet and sings a song.",    es: "Sofía aprende el abecedario y canta una canción.",    fr: "Sofia apprend l'alphabet et chante une chanson.",      ar: "تعلمت صوفيا الأبجدية وغنت أغنية." },
      { en: "She goes home happy and ready for tomorrow!",    es: "Ella llega a casa feliz y lista para mañana.",        fr: "Elle rentre chez elle heureuse et prête pour demain!", ar: "عادت إلى البيت سعيدة ومستعدة لليوم التالي!" },
    ],
  },
  {
    id: "story-2",
    title: "The Friendly Market",
    emoji: "🛒",
    color: "from-green-400 to-emerald-300",
    pages: [
      { en: "Omar and his mom go to the market.",             es: "Omar y su mamá van al mercado.",                     fr: "Omar et sa maman vont au marché.",                     ar: "ذهب عمر وأمه إلى السوق." },
      { en: "They buy apples, bread, and milk.",              es: "Compran manzanas, pan y leche.",                     fr: "Ils achètent des pommes, du pain et du lait.",        ar: "اشتروا تفاحاً وخبزاً وحليباً." },
      { en: "Omar learns to say 'thank you' in English.",     es: "Omar aprende a decir 'gracias' en inglés.",         fr: "Omar apprend à dire 'merci' en anglais.",             ar: "تعلم عمر كيف يقول 'شكراً' بالإنجليزية." },
      { en: "The shopkeeper smiles and waves goodbye.",       es: "El tendero sonríe y dice adiós con la mano.",       fr: "Le commerçant sourit et fait au revoir de la main.",  ar: "ابتسم صاحب الدكان وودّعهم بيده." },
    ],
  },
  {
    id: "story-3",
    title: "The Yellow Bus",
    emoji: "🚌",
    color: "from-yellow-400 to-amber-300",
    pages: [
      { en: "Every morning Amina takes the yellow school bus.", es: "Cada mañana Amina toma el autobús escolar amarillo.", fr: "Chaque matin Amina prend le bus scolaire jaune.",     ar: "كل صباح تأخذ أمينة الحافلة المدرسية الصفراء." },
      { en: "She sits next to her best friend Leo.",           es: "Se sienta junto a su mejor amigo Leo.",              fr: "Elle s'assoit à côté de son meilleur ami Léo.",       ar: "جلست بجانب صديقها المفضل ليو." },
      { en: "They talk about their favorite animals.",         es: "Hablan de sus animales favoritos.",                  fr: "Ils parlent de leurs animaux préférés.",              ar: "تحدثا عن حيواناتهم المفضلة." },
      { en: "School is fun when you have a friend!",          es: "¡La escuela es divertida cuando tienes un amigo!",  fr: "L'école est amusante quand on a un ami !",           ar: "المدرسة ممتعة حين يكون لديك صديق!" },
    ],
  },
  {
    id: "story-4",
    title: "Doctor's Visit",
    emoji: "🏥",
    color: "from-red-400 to-rose-300",
    pages: [
      { en: "Lucas feels sick and goes to the doctor.",       es: "Lucas se siente enfermo y va al médico.",            fr: "Lucas se sent malade et va chez le médecin.",        ar: "شعر لوكاس بالمرض وذهب إلى الطبيب." },
      { en: "The doctor is kind and listens carefully.",      es: "La doctora es amable y escucha con atención.",      fr: "La médecin est gentille et écoute attentivement.",   ar: "الطبيبة لطيفة وتستمع باهتمام." },
      { en: "Lucas learns new words: head, tummy, arm.",      es: "Lucas aprende palabras nuevas: cabeza, barriga, brazo.", fr: "Lucas apprend des mots : tête, ventre, bras.",   ar: "تعلم لوكاس كلمات جديدة: رأس، بطن، ذراع." },
      { en: "He goes home feeling much better!",              es: "¡Regresa a casa sintiéndose mucho mejor!",          fr: "Il rentre chez lui en se sentant beaucoup mieux !",  ar: "عاد إلى البيت وهو يشعر بتحسن كبير!" },
    ],
  },
  {
    id: "story-5",
    title: "Sweet Dreams",
    emoji: "🌙",
    color: "from-purple-400 to-indigo-300",
    pages: [
      { en: "It is bedtime and the stars are shining.",       es: "Es hora de dormir y las estrellas brillan.",        fr: "C'est l'heure du coucher et les étoiles brillent.",  ar: "حان وقت النوم والنجوم تتألق." },
      { en: "Mom reads a story in two languages.",            es: "Mamá lee un cuento en dos idiomas.",                fr: "Maman lit une histoire en deux langues.",            ar: "تقرأ الأم قصة بلغتين." },
      { en: "The child repeats the words slowly.",            es: "El niño repite las palabras despacio.",             fr: "L'enfant répète les mots lentement.",                ar: "يكرر الطفل الكلمات ببطء." },
      { en: "Goodnight! Learning never stops.",               es: "¡Buenas noches! El aprendizaje nunca se detiene.",  fr: "Bonne nuit ! L'apprentissage ne s'arrête jamais.",  ar: "تصبح على خير! التعلم لا يتوقف أبداً." },
    ],
  },

  // ── HISTORIAS 6-25 (extraídas del RTF) ────────────────────────────────

  {
    id: "story-16",
    title: "Summer Sun",
    emoji: "☀️",
    color: "from-yellow-400 to-orange-300",
    pages: [
      {
        en: "The summer sun is very bright.",
        es: "El sol de verano es muy brillante.",
        fr: "Le soleil d'été est très brillant.",
        ar: "شمس الصيف ساطعة جداً.",
      },
      {
        en: "I wear my sunglasses and a hat.",
        es: "Uso mis gafas de sol y un sombrero.",
        fr: "Je porte mes lunettes de soleil et un chapeau.",
        ar: "أرتدي نظاراتي الشمسية وقبعة.",
      },
      {
        en: "We go to the beach to swim.",
        es: "Vamos a la playa a nadar.",
        fr: "Nous allons à la plage pour nager.",
        ar: "نذهب إلى الشاطئ للسباحة.",
      },
      {
        en: "I like to eat cold watermelon.",
        es: "Me gusta comer sandía fría.",
        fr: "J'aime manger de la pastèque fraîche.",
        ar: "أحب تناول البطيخ البارد.",
      },
      {
        en: "Summer days are long and fun.",
        es: "Los días de verano son largos y divertidos.",
        fr: "Les jours d'été sont longs et amusants.",
        ar: "أيام الصيف طويلة وممتعة.",
      },
    ],
  },

  {
    id: "story-17",
    title: "Crossing the Street",
    emoji: "🚦",
    color: "from-green-500 to-teal-400",
    pages: [
      {
        en: "We stop at the edge of the road.",
        es: "Nos detenemos al borde del camino.",
        fr: "Nous nous arrêtons au bord de la route.",
        ar: "نتوقف عند حافة الطريق.",
      },
      {
        en: "I look left, right, and left again.",
        es: "Miro a la izquierda, derecha y otra vez a la izquierda.",
        fr: "Je regarde à gauche, à droite, puis encore à gauche.",
        ar: "أنظر يساراً، يميناً، ثم يساراً مرة أخرى.",
      },
      {
        en: "I hold my mommy's hand tightly.",
        es: "Sostengo la mano de mi mami con fuerza.",
        fr: "Je tiens fort la main de ma maman.",
        ar: "أمسك يد أمي بإحكام.",
      },
      {
        en: "We wait for the green light to walk.",
        es: "Esperamos la luz verde para caminar.",
        fr: "Nous attendons le feu vert pour marcher.",
        ar: "ننتظر الضوء الأخضر للمشي.",
      },
      {
        en: "Now it is safe to cross the street.",
        es: "Ahora es seguro cruzar la calle.",
        fr: "Maintenant, on peut traverser la rue en toute sécurité.",
        ar: "الآن من الآمن عبور الشارع.",
      },
    ],
  },

  {
    id: "story-18",
    title: "At the Market",
    emoji: "🧺",
    color: "from-orange-400 to-amber-300",
    pages: [
      {
        en: "We need to buy food for the week.",
        es: "Necesitamos comprar comida para la semana.",
        fr: "Nous devons acheter de la nourriture pour la semaine.",
        ar: "نحتاج لشراء طعام للأسبوع.",
      },
      {
        en: "I put yellow bananas in the basket.",
        es: "Pongo plátanos amarillos en la cesta.",
        fr: "Je mets des bananes jaunes dans le panier.",
        ar: "أضع الموز الأصفر في السلة.",
      },
      {
        en: "We find milk, eggs, and fresh bread.",
        es: "Encontramos leche, huevos y pan fresco.",
        fr: "Nous trouvons du lait, des œufs et du pain frais.",
        ar: "نجد الحليب والبيض والخبز الطازج.",
      },
      {
        en: "We wait in line to pay the man.",
        es: "Esperamos en la fila para pagar al señor.",
        fr: "Nous attendons dans la file pour payer le monsieur.",
        ar: "ننتظر في الطابور لندفع للرجل.",
      },
      {
        en: "Helping with the shopping is fun!",
        es: "¡Ayudar con las compras es divertido!",
        fr: "C'est amusant d'aider à faire les courses !",
        ar: "المساعدة في التسوق ممتعة!",
      },
    ],
  },

  {
    id: "story-19",
    title: "The Friendly Dog",
    emoji: "🐶",
    color: "from-amber-400 to-yellow-300",
    pages: [
      {
        en: "I see a brown dog in the park.",
        es: "Veo un perro marrón en el parque.",
        fr: "Je vois un chien marron dans le parc.",
        ar: "أرى كلباً بنياً في الحديقة.",
      },
      {
        en: "I ask: 'Can I pet your dog?'",
        es: "Pregunto: '¿Puedo acariciar a su perro?'",
        fr: "Je demande : « Puis-je caresser votre chien ? »",
        ar: "أسأل: هل يمكنني مداعبة كلبك؟",
      },
      {
        en: "The dog wags its happy tail.",
        es: "El perro menea su cola feliz.",
        fr: "Le chien remue sa queue joyeusement.",
        ar: "الكلب يهز ذيله السعيد.",
      },
      {
        en: "I gently pet the dog on its back.",
        es: "Acaricio suavemente al perro en su espalda.",
        fr: "Je caresse doucement le chien sur son dos.",
        ar: "أداعب الكلب بلطف على ظهره.",
      },
      {
        en: "Dogs are very good friends.",
        es: "Los perros son muy buenos amigos.",
        fr: "Les chiens sont de très bons amis.",
        ar: "الكلاب أصدقاء جيدون جداً.",
      },
    ],
  },

  {
    id: "story-20",
    title: "Sweet Dreams",
    emoji: "🌙",
    color: "from-purple-500 to-indigo-400",
    pages: [
      {
        en: "The moon is high in the sky.",
        es: "La luna está alta en el cielo.",
        fr: "La lune est haute dans le ciel.",
        ar: "القمر عالٍ في السماء.",
      },
      {
        en: "I put on my soft pajamas.",
        es: "Me pongo mi pijama suave.",
        fr: "Je mets mon pyjama tout doux.",
        ar: "أرتدي ملابس نومي الناعمة.",
      },
      {
        en: "My daddy reads me one more book.",
        es: "Mi papi me lee un libro más.",
        fr: "Mon papa me lit une dernière histoire.",
        ar: "والدي يقرأ لي كتاباً آخر.",
      },
      {
        en: "I hop into my warm, cozy bed.",
        es: "Salto a mi cama cálida y acogedora.",
        fr: "Je saute dans mon lit chaud et douillet.",
        ar: "أقفز إلى سريري الدافئ والمريح.",
      },
      {
        en: "Goodnight world, see you tomorrow!",
        es: "¡Buenas noches mundo, nos vemos mañana!",
        fr: "Bonne nuit tout le monde, à demain !",
        ar: "تصبحين على خير يا دنيا، أراك غداً!",
      },
    ],
  },

  {
    id: "story-21",
    title: "How Do I Feel?",
    emoji: "🫀",
    color: "from-pink-400 to-rose-300",
    pages: [
      {
        en: "Sometimes I feel very happy and I smile.",
        es: "A veces me siento muy feliz y sonrío.",
        fr: "Parfois, je me sens très heureux et je souris.",
        ar: "أحياناً أشعر بسعادة غامرة وأبتسم.",
      },
      {
        en: "Sometimes I feel sad and I need a hug.",
        es: "A veces me siento triste y necesito un abrazo.",
        fr: "Parfois, je me sens triste et j'ai besoin d'un câlin.",
        ar: "أحياناً أشعر بالحزن وأحتاج إلى عناق.",
      },
      {
        en: "It is okay to show my feelings.",
        es: "Está bien mostrar mis sentimientos.",
        fr: "C'est bien d'exprimer mes sentiments.",
        ar: "من الجيد إظهار مشاعري.",
      },
      {
        en: "I take a deep breath to feel calm.",
        es: "Respiro profundo para sentirme tranquilo.",
        fr: "Je prends une grande respiration pour me calmer.",
        ar: "أتنفس بعمق لأشعر بالهدوء.",
      },
      {
        en: "I am a very special person!",
        es: "¡Soy una persona muy especial!",
        fr: "Je suis une personne très spéciale !",
        ar: "أنا شخص مميز جداً!",
      },
    ],
  },

  {
    id: "story-22",
    title: "Sharing is Caring",
    emoji: "🧩",
    color: "from-cyan-400 to-blue-300",
    pages: [
      {
        en: "I have a big bag of colorful blocks.",
        es: "Tengo una bolsa grande de bloques de colores.",
        fr: "J'ai un grand sac de cubes colorés.",
        ar: "لدي حقيبة كبيرة من المكعبات الملونة.",
      },
      {
        en: "My friend wants to build a tower too.",
        es: "Mi amigo también quiere construir una torre.",
        fr: "Mon ami veut aussi construire une tour.",
        ar: "صديقي يريد بناء برج أيضاً.",
      },
      {
        en: "I give him three blue blocks.",
        es: "Le doy tres bloques azules.",
        fr: "Je lui donne trois cubes bleus.",
        ar: "أعطيه ثلاث مكعبات زرقاء.",
      },
      {
        en: "Working together is more fun than playing alone.",
        es: "Trabajar juntos es más divertido que jugar solo.",
        fr: "Travailler ensemble est plus amusant que de jouer seul.",
        ar: "العمل معاً أكثر متعة من اللعب بمفردك.",
      },
      {
        en: "It feels good to be kind to others.",
        es: "Se siente bien ser amable con los demás.",
        fr: "Ça fait du bien d'être gentil avec les autres.",
        ar: "من الرائع أن نكون لطيفين مع الآخرين.",
      },
    ],
  },

  {
    id: "story-23",
    title: "Counting Fruit",
    emoji: "🍎",
    color: "from-red-400 to-orange-300",
    pages: [
      {
        en: "Let's count the fruit in the kitchen.",
        es: "Vamos a contar la fruta en la cocina.",
        fr: "Comptons les fruits dans la cuisine.",
        ar: "لنعد الفواكه في المطبخ.",
      },
      {
        en: "One red apple and two yellow pears.",
        es: "Una manzana roja y dos peras amarillas.",
        fr: "Une pomme rouge et deux poires jaunes.",
        ar: "تفاحة حمراء واحدة وإجاصتان صفراوان.",
      },
      {
        en: "Three orange oranges and four purple grapes.",
        es: "Tres naranjas y cuatro uvas moradas.",
        fr: "Trois oranges et quatre raisins violets.",
        ar: "ثلاث برتقالات وأربع عنبات بنفسجية.",
      },
      {
        en: "We have five pieces of fruit for snacks.",
        es: "Tenemos cinco piezas de fruta para merendar.",
        fr: "Nous avons cinq fruits pour le goûter.",
        ar: "لدينا خمس قطع من الفاكهة للوجبات الخفيفة.",
      },
      {
        en: "Counting is easy and fun!",
        es: "¡Contar es fácil y divertido!",
        fr: "Compter, c'est facile et amusant !",
        ar: "العد سهل وممتع!",
      },
    ],
  },

  {
    id: "story-24",
    title: "My Five Senses",
    emoji: "👁️",
    color: "from-violet-400 to-purple-300",
    pages: [
      {
        en: "I see the flowers with my eyes.",
        es: "Veo las flores con mis ojos.",
        fr: "Je vois les fleurs avec mes yeux.",
        ar: "أرى الزهور بعيني.",
      },
      {
        en: "I hear the music with my ears.",
        es: "Escucho la música con mis oídos.",
        fr: "J'entends la musique avec mes oreilles.",
        ar: "أسمع الموسيقى بأذني.",
      },
      {
        en: "I smell the fresh bread with my nose.",
        es: "Huelo el pan fresco con mi nariz.",
        fr: "Je sens le pain frais avec mon nez.",
        ar: "أشم الخبز الطازج بأنفي.",
      },
      {
        en: "I taste the sweet honey with my tongue.",
        es: "Saboreo la miel dulce con mi lengua.",
        fr: "Je goûte le miel sucré avec ma langue.",
        ar: "أتذوق العسل الحلو بلساني.",
      },
      {
        en: "I touch the soft cat with my hands.",
        es: "Toco al gato suave con mis manos.",
        fr: "Je touche le chat tout doux avec mes mains.",
        ar: "ألمس القطة الناعمة بيدي.",
      },
    ],
  },

  {
    id: "story-25",
    title: "I am a Star!",
    emoji: "🌟",
    color: "from-yellow-300 to-pink-300",
    pages: [
      {
        en: "I have finished all my stories!",
        es: "¡He terminado todos mis cuentos!",
        fr: "J'ai fini toutes mes histoires !",
        ar: "لقد أنهيت كل قصصي!",
      },
      {
        en: "I can speak many new words in English.",
        es: "Puedo decir muchas palabras nuevas en inglés.",
        fr: "Je peux dire plein de nouveaux mots en anglais.",
        ar: "يمكنني التحدث بالعديد من الكلمات الجديدة بالإنجليزية.",
      },
      {
        en: "My mom and dad are very proud of me.",
        es: "Mi mamá y mi papá están muy orgullosos de mí.",
        fr: "Mon papa et ma maman sont très fiers de moi.",
        ar: "أمي وأبي فخوران جداً بي.",
      },
      {
        en: "Learning a language is like a big adventure.",
        es: "Aprender un idioma es como una gran aventura.",
        fr: "Apprendre une langue, c'est comme une grande aventure.",
        ar: "تعلم لغة يشبه مغامرة كبيرة.",
      },
      {
        en: "I am brave, I am smart, and I am ready!",
        es: "¡Soy valiente, soy inteligente y estoy listo!",
        fr: "Je suis courageux, je suis intelligent et je suis prêt !",
        ar: "أنا شجاع، أنا ذكي، وأنا مستعد!",
      },
    ],
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// RUTAS API
// ═══════════════════════════════════════════════════════════════════════════

// ── GET /api/stories ──────────────────────────────────────────────────────
app.get("/api/stories", (_req, res) => {
  res.json(STATIC_STORIES);
});

// ── POST /api/generate-story — Gemini 2.0 Flash vía fetch directo ─────────
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
You are a bilingual children's story writer for an app that helps migrant families learn English.

Create a short, joyful story for a child named "${childName}" about: "${theme}".

Rules:
- Exactly 4 pages.
- Each page has one simple English sentence (max 12 words) and one ${langName} translation.
- Use the child's name (${childName}) naturally in the story.
- Warm, encouraging tone for ages 4-9.
- No unsafe or adult content.

Respond ONLY with a valid JSON object — no markdown, no code fences:
{
  "title": "Story Title",
  "emoji": "🌟",
  "color": "from-blue-400 to-cyan-300",
  "pages": [
    { "en": "English sentence.", "${langCode}": "${langName} translation." },
    { "en": "English sentence.", "${langCode}": "${langName} translation." },
    { "en": "English sentence.", "${langCode}": "${langName} translation." },
    { "en": "English sentence.", "${langCode}": "${langName} translation." }
  ]
}

Color options (pick the best match for the theme):
"from-blue-400 to-cyan-300" | "from-green-400 to-emerald-300" | "from-yellow-400 to-amber-300" |
"from-red-400 to-rose-300"  | "from-purple-500 to-indigo-400" | "from-pink-400 to-rose-300"   |
"from-orange-400 to-amber-300" | "from-teal-400 to-cyan-300"  | "from-yellow-400 to-orange-300"
`;

  // ── Fetch directo a la API v1beta (sin SDK) ───────────────────────────
  const GEMINI_URL =
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

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

    // Eliminar posibles code fences que Gemini añade a veces
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
    stories: STATIC_STORIES.length,
    ai: "Gemini 2.0 Flash (fetch directo v1beta)",
    keyConfigured: !!process.env.GOOGLE_GENAI_API_KEY,
  });
});

// ── Arrancar ──────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`✅ Kiddsy API en http://localhost:${PORT}`);
  console.log(`📚 ${STATIC_STORIES.length} cuentos en biblioteca estática`);
  console.log(`🤖 IA: Gemini 2.0 Flash (fetch directo)`);
  console.log(`🔑 API Key: ${process.env.GOOGLE_GENAI_API_KEY ? "✓ configurada" : "✗ FALTA — añade GOOGLE_GENAI_API_KEY al .env"}`);
});

export default app;
