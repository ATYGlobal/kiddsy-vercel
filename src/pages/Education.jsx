/**
 * src/pages/Education.jsx — Kiddsy  (Learn ABC)
 * ────────────────────────────────────────────────────────
 * ✅ 16 idiomas: ES FR AR DE IT PT RU ZH JA KO BN HI NL PL NO SV
 * ✅ Acepta prop  lang / onLangChange  desde App.jsx
 * ✅ 3 modos: Alphabet · Numbers · Common Words
 * ✅ Estilo "Burbuja" Kiddsy, colores de marca
 * ────────────────────────────────────────────────────────
 */
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, Globe, ChevronDown, Star, BookOpen, Hash, MessageCircle } from "lucide-react";

const C = {
  blue:"#1565C0", blueSoft:"#E3F2FD", red:"#E53935", redSoft:"#FFEBEE",
  yellow:"#F9A825", yellowSoft:"#FFFDE7",
  green:"#43A047", greenSoft:"#E8F5E9",
  orange:"#E65100", orangeSoft:"#FFF3E0",
  magenta:"#D81B60", magentaSoft:"#FCE4EC",
  cyan:"#00ACC1", cyanSoft:"#E0F7FA",
};

// ── 16 idiomas ─────────────────────────────────────────────────────────────
const LANGUAGES = [
  { code:"es", label:"Español",    flag:"🇪🇸", dir:"ltr", voice:"es-ES" },
  { code:"fr", label:"Français",   flag:"🇫🇷", dir:"ltr", voice:"fr-FR" },
  { code:"ar", label:"العربية",    flag:"🇸🇦", dir:"rtl", voice:"ar-SA" },
  { code:"de", label:"Deutsch",    flag:"🇩🇪", dir:"ltr", voice:"de-DE" },
  { code:"it", label:"Italiano",   flag:"🇮🇹", dir:"ltr", voice:"it-IT" },
  { code:"pt", label:"Português",  flag:"🇧🇷", dir:"ltr", voice:"pt-BR" },
  { code:"ru", label:"Русский",    flag:"🇷🇺", dir:"ltr", voice:"ru-RU" },
  { code:"zh", label:"中文",        flag:"🇨🇳", dir:"ltr", voice:"zh-CN" },
  { code:"ja", label:"日本語",      flag:"🇯🇵", dir:"ltr", voice:"ja-JP" },
  { code:"ko", label:"한국어",      flag:"🇰🇷", dir:"ltr", voice:"ko-KR" },
  { code:"bn", label:"বাংলা",     flag:"🇧🇩", dir:"ltr", voice:"bn-BD" },
  { code:"hi", label:"हिंदी",     flag:"🇮🇳", dir:"ltr", voice:"hi-IN" },
  { code:"nl", label:"Nederlands", flag:"🇳🇱", dir:"ltr", voice:"nl-NL" },
  { code:"pl", label:"Polski",     flag:"🇵🇱", dir:"ltr", voice:"pl-PL" },
  { code:"no", label:"Norsk",      flag:"🇳🇴", dir:"ltr", voice:"nb-NO" },
  { code:"sv", label:"Svenska",    flag:"🇸🇪", dir:"ltr", voice:"sv-SE" },
];

// ── Alfabeto inglés — con ejemplo y traducción del ejemplo ──────────────────
const ALPHABET = [
  { letter:"A", emoji:"🍎", word:"Apple",  color:C.red,
    es:"Manzana",fr:"Pomme",   ar:"تفاحة",de:"Apfel",  it:"Mela",   pt:"Maçã",   ru:"Яблоко",zh:"苹果",ja:"リンゴ",ko:"사과",bn:"আপেল",hi:"सेब",   nl:"Appel",  pl:"Jabłko",  no:"Eple",  sv:"Äpple" },
  { letter:"B", emoji:"🐝", word:"Bee",    color:C.yellow,
    es:"Abeja",  fr:"Abeille", ar:"نحلة",  de:"Biene",  it:"Ape",    pt:"Abelha", ru:"Пчела", zh:"蜜蜂",ja:"ハチ",  ko:"꿀벌",bn:"মৌমাছি",hi:"मधुमक्खी",nl:"Bij",   pl:"Pszczoła",no:"Bie",   sv:"Bi"    },
  { letter:"C", emoji:"🐱", word:"Cat",    color:C.orange,
    es:"Gato",   fr:"Chat",    ar:"قطة",   de:"Katze",  it:"Gatto",  pt:"Gato",   ru:"Кошка", zh:"猫",  ja:"ネコ",  ko:"고양이",bn:"বিড়াল",hi:"बिल्ली",nl:"Kat",    pl:"Kot",     no:"Katt",  sv:"Katt"  },
  { letter:"D", emoji:"🐶", word:"Dog",    color:C.blue,
    es:"Perro",  fr:"Chien",   ar:"كلب",   de:"Hund",   it:"Cane",   pt:"Cão",    ru:"Собака",zh:"狗",  ja:"イヌ",  ko:"개",    bn:"কুকুর", hi:"कुत्ता",nl:"Hond",   pl:"Pies",    no:"Hund",  sv:"Hund"  },
  { letter:"E", emoji:"🐘", word:"Elephant",color:C.cyan,
    es:"Elefante",fr:"Éléphant",ar:"فيل", de:"Elefant",it:"Elefante",pt:"Elefante",ru:"Слон",zh:"大象",ja:"ゾウ",  ko:"코끼리",bn:"হাতি",  hi:"हाथी",  nl:"Olifant",pl:"Słoń",    no:"Elefant",sv:"Elefant"},
  { letter:"F", emoji:"🐸", word:"Frog",   color:C.green,
    es:"Rana",   fr:"Grenouille",ar:"ضفدع",de:"Frosch", it:"Rana",   pt:"Sapo",   ru:"Лягушка",zh:"青蛙",ja:"カエル",ko:"개구리",bn:"ব্যাঙ",  hi:"मेंढक",  nl:"Kikker", pl:"Żaba",    no:"Frosk", sv:"Groda" },
  { letter:"G", emoji:"🦒", word:"Giraffe",color:"#F4A435",
    es:"Jirafa", fr:"Girafe",  ar:"زرافة", de:"Giraffe",it:"Giraffa",pt:"Girafa", ru:"Жираф", zh:"长颈鹿",ja:"キリン",ko:"기린",  bn:"জিরাফ", hi:"जिराफ",  nl:"Giraf",  pl:"Żyrafa",  no:"Sjiraff",sv:"Giraff"},
  { letter:"H", emoji:"🏠", word:"House",  color:C.red,
    es:"Casa",   fr:"Maison",  ar:"منزل",  de:"Haus",   it:"Casa",   pt:"Casa",   ru:"Дом",   zh:"房子",ja:"イエ",  ko:"집",    bn:"বাড়ি",  hi:"घर",    nl:"Huis",   pl:"Dom",     no:"Hus",   sv:"Hus"   },
  { letter:"I", emoji:"🍦", word:"Ice cream",color:C.magenta,
    es:"Helado", fr:"Glace",   ar:"آيس كريم",de:"Eis",  it:"Gelato", pt:"Sorvete",ru:"Мороженое",zh:"冰淇淋",ja:"アイス",ko:"아이스크림",bn:"আইসক্রিম",hi:"आइसक्रीम",nl:"Ijs",  pl:"Lody",  no:"Is",    sv:"Glass" },
  { letter:"J", emoji:"🤹", word:"Juggle", color:C.orange,
    es:"Malabar",fr:"Jongler", ar:"يجگل",  de:"Jonglieren",it:"Giocoleria",pt:"Malabarismo",ru:"Жонглировать",zh:"杂耍",ja:"ジャグリング",ko:"저글링",bn:"জাগলিং",hi:"जादूगरी",nl:"Jongleren",pl:"Żonglować",no:"Sjonglere",sv:"Jonglera"},
  { letter:"K", emoji:"🦘", word:"Kangaroo",color:C.green,
    es:"Canguro",fr:"Kangourou",ar:"كنغر",de:"Känguru",it:"Canguro",pt:"Canguru",ru:"Кенгуру",zh:"袋鼠",ja:"カンガルー",ko:"캥거루",bn:"ক্যাঙারু",hi:"कंगारू",nl:"Kangoeroe",pl:"Kangur",no:"Kenguru",sv:"Känguru"},
  { letter:"L", emoji:"🦁", word:"Lion",   color:C.yellow,
    es:"León",   fr:"Lion",    ar:"أسد",   de:"Löwe",   it:"Leone",  pt:"Leão",   ru:"Лев",   zh:"狮子",ja:"ライオン",ko:"사자",  bn:"সিংহ",   hi:"शेर",    nl:"Leeuw",  pl:"Lew",     no:"Løve",  sv:"Lejon" },
  { letter:"M", emoji:"🌙", word:"Moon",   color:C.blue,
    es:"Luna",   fr:"Lune",    ar:"قمر",   de:"Mond",   it:"Luna",   pt:"Lua",    ru:"Луна",  zh:"月亮",ja:"ツキ",  ko:"달",    bn:"চাঁদ",   hi:"चाँद",  nl:"Maan",   pl:"Księżyc", no:"Måne",  sv:"Måne"  },
  { letter:"N", emoji:"🌙", word:"Night",  color:"#283593",
    es:"Noche",  fr:"Nuit",    ar:"ليل",   de:"Nacht",  it:"Notte",  pt:"Noite",  ru:"Ночь",  zh:"夜晚",ja:"ヨル",  ko:"밤",    bn:"রাত",    hi:"रात",   nl:"Nacht",  pl:"Noc",     no:"Natt",  sv:"Natt"  },
  { letter:"O", emoji:"🦉", word:"Owl",    color:C.orange,
    es:"Búho",   fr:"Hibou",   ar:"بومة",  de:"Eule",   it:"Gufo",   pt:"Coruja", ru:"Сова",  zh:"猫头鹰",ja:"フクロウ",ko:"부엉이",bn:"পেঁচা",  hi:"उल्लू",  nl:"Uil",    pl:"Sowa",    no:"Ugle",  sv:"Uggla" },
  { letter:"P", emoji:"🐧", word:"Penguin",color:C.cyan,
    es:"Pingüino",fr:"Manchot",ar:"بطريق",de:"Pinguin",it:"Pinguino",pt:"Pinguim",ru:"Пингвин",zh:"企鹅",ja:"ペンギン",ko:"펭귄",bn:"পেঙ্গুইন",hi:"पेंगुइन",nl:"Pinguïn",pl:"Pingwin",no:"Pingvin",sv:"Pingvin"},
  { letter:"Q", emoji:"👸", word:"Queen",  color:C.magenta,
    es:"Reina",  fr:"Reine",   ar:"ملكة",  de:"Königin",it:"Regina", pt:"Rainha", ru:"Королева",zh:"女王",ja:"じょおう",ko:"여왕", bn:"রানী",   hi:"रानी",  nl:"Koningin",pl:"Królowa",no:"Dronning",sv:"Drottning"},
  { letter:"R", emoji:"🌈", word:"Rainbow",color:C.red,
    es:"Arcoíris",fr:"Arc-en-ciel",ar:"قوس قزح",de:"Regenbogen",it:"Arcobaleno",pt:"Arco-íris",ru:"Радуга",zh:"彩虹",ja:"ニジ",  ko:"무지개",bn:"রংধনু",  hi:"इंद्रधनुष",nl:"Regenboog",pl:"Tęcza",no:"Regnbue",sv:"Regnbåge"},
  { letter:"S", emoji:"⭐", word:"Star",   color:C.yellow,
    es:"Estrella",fr:"Étoile", ar:"نجمة",  de:"Stern",  it:"Stella", pt:"Estrela",ru:"Звезда",zh:"星星",ja:"ホシ",  ko:"별",    bn:"তারা",   hi:"तारा",  nl:"Ster",   pl:"Gwiazda", no:"Stjerne",sv:"Stjärna"},
  { letter:"T", emoji:"🌳", word:"Tree",   color:C.green,
    es:"Árbol",  fr:"Arbre",   ar:"شجرة",  de:"Baum",   it:"Albero", pt:"Árvore", ru:"Дерево",zh:"树",  ja:"き",    ko:"나무",  bn:"গাছ",    hi:"पेड़",   nl:"Boom",   pl:"Drzewo",  no:"Tre",   sv:"Träd"  },
  { letter:"U", emoji:"☂️", word:"Umbrella",color:C.blue,
    es:"Paraguas",fr:"Parapluie",ar:"مظلة",de:"Regenschirm",it:"Ombrello",pt:"Guarda-chuva",ru:"Зонт",zh:"雨伞",ja:"カサ",  ko:"우산",  bn:"ছাতা",   hi:"छाता",  nl:"Paraplu", pl:"Parasol",no:"Paraply",sv:"Paraply"},
  { letter:"V", emoji:"🎻", word:"Violin", color:C.orange,
    es:"Violín", fr:"Violon",  ar:"كمان",  de:"Geige",  it:"Violino",pt:"Violino",ru:"Скрипка",zh:"小提琴",ja:"バイオリン",ko:"바이올린",bn:"বেহালা",hi:"वायलिन",nl:"Viool",  pl:"Skrzypce",no:"Fiolin",sv:"Fiol"   },
  { letter:"W", emoji:"🌊", word:"Wave",   color:C.cyan,
    es:"Ola",    fr:"Vague",   ar:"موجة",  de:"Welle",  it:"Onda",   pt:"Onda",   ru:"Волна", zh:"波浪",ja:"なみ",  ko:"파도",  bn:"ঢেউ",    hi:"लहर",   nl:"Golf",   pl:"Fala",    no:"Bølge", sv:"Våg"   },
  { letter:"X", emoji:"🎸", word:"Xylophone",color:C.magenta,
    es:"Xilófono",fr:"Xylophone",ar:"إكسيلوفون",de:"Xylofon",it:"Xilofono",pt:"Xilofone",ru:"Ксилофон",zh:"木琴",ja:"シロフォン",ko:"실로폰",bn:"জাইলোফোন",hi:"जाइलोफोन",nl:"Xylofoon",pl:"Ksylofon",no:"Xylofon",sv:"Xylofon"},
  { letter:"Y", emoji:"🌻", word:"Yellow", color:C.yellow,
    es:"Amarillo",fr:"Jaune",  ar:"أصفر",  de:"Gelb",   it:"Giallo", pt:"Amarelo",ru:"Жёлтый",zh:"黄色",ja:"きいろ",ko:"노랑",  bn:"হলুদ",   hi:"पीला",  nl:"Geel",   pl:"Żółty",   no:"Gul",   sv:"Gul"   },
  { letter:"Z", emoji:"🦓", word:"Zebra",  color:"#424242",
    es:"Cebra",  fr:"Zèbre",   ar:"حمار وحشي",de:"Zebra",it:"Zebra",pt:"Zebra",  ru:"Зебра", zh:"斑马",ja:"シマウマ",ko:"얼룩말",bn:"জেব্রা",hi:"ज़ेब्रा",nl:"Zebra",  pl:"Zebra",   no:"Sebra", sv:"Zebra" },
];

// ── Números 0–9 ─────────────────────────────────────────────────────────────
const NUMBERS = [
  { n:0, emoji:"⭕", es:"Cero",  fr:"Zéro",  ar:"صفر",  de:"Null",  it:"Zero",  pt:"Zero",  ru:"Ноль",  zh:"零",ja:"ゼロ",ko:"영",   bn:"শূন্য",  hi:"शून्य",  nl:"Nul",  pl:"Zero",   no:"Null",  sv:"Noll"  },
  { n:1, emoji:"1️⃣",  es:"Uno",   fr:"Un",    ar:"واحد", de:"Eins",  it:"Uno",   pt:"Um",    ru:"Один",  zh:"一",ja:"イチ",ko:"일",   bn:"এক",     hi:"एक",     nl:"Één",  pl:"Jeden",  no:"En",    sv:"Ett"   },
  { n:2, emoji:"2️⃣",  es:"Dos",   fr:"Deux",  ar:"اثنان",de:"Zwei",  it:"Due",   pt:"Dois",  ru:"Два",   zh:"二",ja:"二",  ko:"이",   bn:"দুই",    hi:"दो",     nl:"Twee", pl:"Dwa",    no:"To",    sv:"Två"   },
  { n:3, emoji:"3️⃣",  es:"Tres",  fr:"Trois", ar:"ثلاثة",de:"Drei",  it:"Tre",   pt:"Três",  ru:"Три",   zh:"三",ja:"サン", ko:"삼",   bn:"তিন",    hi:"तीन",    nl:"Drie", pl:"Trzy",   no:"Tre",   sv:"Tre"   },
  { n:4, emoji:"4️⃣",  es:"Cuatro",fr:"Quatre",ar:"أربعة",de:"Vier",  it:"Quattro",pt:"Quatro",ru:"Четыре",zh:"四",ja:"シ",  ko:"사",   bn:"চার",    hi:"चार",    nl:"Vier", pl:"Cztery", no:"Fire",  sv:"Fyra"  },
  { n:5, emoji:"5️⃣",  es:"Cinco", fr:"Cinq",  ar:"خمسة", de:"Fünf",  it:"Cinque",pt:"Cinco", ru:"Пять",  zh:"五",ja:"ゴ",  ko:"오",   bn:"পাঁচ",   hi:"पाँच",   nl:"Vijf", pl:"Pięć",   no:"Fem",   sv:"Fem"   },
  { n:6, emoji:"6️⃣",  es:"Seis",  fr:"Six",   ar:"ستة",  de:"Sechs", it:"Sei",   pt:"Seis",  ru:"Шесть", zh:"六",ja:"ロク", ko:"육",   bn:"ছয়",    hi:"छह",     nl:"Zes",  pl:"Sześć",  no:"Seks",  sv:"Sex"   },
  { n:7, emoji:"7️⃣",  es:"Siete", fr:"Sept",  ar:"سبعة", de:"Sieben",it:"Sette", pt:"Sete",  ru:"Семь",  zh:"七",ja:"シチ", ko:"칠",   bn:"সাত",    hi:"सात",    nl:"Zeven",pl:"Siedem", no:"Syv",   sv:"Sju"   },
  { n:8, emoji:"8️⃣",  es:"Ocho",  fr:"Huit",  ar:"ثمانية",de:"Acht", it:"Otto",  pt:"Oito",  ru:"Восемь",zh:"八",ja:"ハチ", ko:"팔",   bn:"আট",     hi:"आठ",     nl:"Acht", pl:"Osiem",  no:"Åtte",  sv:"Åtta"  },
  { n:9, emoji:"9️⃣",  es:"Nueve", fr:"Neuf",  ar:"تسعة", de:"Neun",  it:"Nove",  pt:"Nove",  ru:"Девять",zh:"九",ja:"キュウ",ko:"구", bn:"নয়",    hi:"नौ",     nl:"Negen",pl:"Dziewięć",no:"Ni",   sv:"Nio"   },
];

// ── Palabras comunes ─────────────────────────────────────────────────────────
const COMMON_WORDS = [
  { en:"Hello",    emoji:"👋", color:C.yellow,
    es:"Hola",     fr:"Bonjour",  ar:"مرحبا",  de:"Hallo",    it:"Ciao",     pt:"Olá",     ru:"Привет",  zh:"你好",  ja:"こんにちは",ko:"안녕",   bn:"হ্যালো",   hi:"नमस्ते",  nl:"Hallo",   pl:"Cześć",   no:"Hei",    sv:"Hej"    },
  { en:"Thank you",emoji:"🙏", color:C.green,
    es:"Gracias",  fr:"Merci",    ar:"شكراً",  de:"Danke",    it:"Grazie",   pt:"Obrigado",ru:"Спасибо", zh:"谢谢",  ja:"ありがとう",ko:"감사합니다",bn:"ধন্যবাদ",hi:"धन्यवाद",nl:"Dankjewel",pl:"Dziękuję",no:"Takk",  sv:"Tack"   },
  { en:"Yes",      emoji:"✅", color:C.green,
    es:"Sí",       fr:"Oui",      ar:"نعم",    de:"Ja",       it:"Sì",       pt:"Sim",      ru:"Да",      zh:"是",    ja:"はい",   ko:"네",     bn:"হ্যাঁ",    hi:"हाँ",     nl:"Ja",      pl:"Tak",     no:"Ja",     sv:"Ja"     },
  { en:"No",       emoji:"❌", color:C.red,
    es:"No",       fr:"Non",      ar:"لا",     de:"Nein",     it:"No",       pt:"Não",      ru:"Нет",     zh:"不",    ja:"いいえ", ko:"아니오",  bn:"না",      hi:"नहीं",   nl:"Nee",     pl:"Nie",     no:"Nei",    sv:"Nej"    },
  { en:"Please",   emoji:"🌟", color:C.blue,
    es:"Por favor",fr:"S'il vous plaît",ar:"من فضلك",de:"Bitte",it:"Per favore",pt:"Por favor",ru:"Пожалуйста",zh:"请",ja:"おねがい",ko:"제발",  bn:"দয়া করে",hi:"कृपया",  nl:"Alsjeblieft",pl:"Proszę",no:"Vær så snill",sv:"Snälla"},
  { en:"Sorry",    emoji:"😔", color:C.orange,
    es:"Lo siento",fr:"Désolé",   ar:"آسف",    de:"Entschuldigung",it:"Scusa",pt:"Desculpa", ru:"Извини",  zh:"对不起",ja:"ごめんなさい",ko:"미안해요",bn:"দুঃখিত",hi:"माफ करना",nl:"Sorry",  pl:"Przepraszam",no:"Unnskyld",sv:"Förlåt"},
  { en:"Good",     emoji:"👍", color:C.green,
    es:"Bueno",    fr:"Bien",     ar:"جيد",    de:"Gut",      it:"Bene",     pt:"Bom",      ru:"Хорошо",  zh:"好",    ja:"いい",   ko:"좋다",   bn:"ভালো",    hi:"अच्छा",  nl:"Goed",    pl:"Dobrze",  no:"Bra",    sv:"Bra"    },
  { en:"Beautiful",emoji:"💫", color:C.magenta,
    es:"Hermoso",  fr:"Beau",     ar:"جميل",   de:"Schön",    it:"Bello",    pt:"Bonito",   ru:"Красивый",zh:"漂亮", ja:"きれい", ko:"아름다워",bn:"সুন্দর",  hi:"सुंदर",  nl:"Mooi",    pl:"Piękny",  no:"Vakker", sv:"Vacker" },
  { en:"Water",    emoji:"💧", color:C.cyan,
    es:"Agua",     fr:"Eau",      ar:"ماء",    de:"Wasser",   it:"Acqua",    pt:"Água",     ru:"Вода",    zh:"水",    ja:"みず",   ko:"물",     bn:"পানি",    hi:"पानी",   nl:"Water",   pl:"Woda",    no:"Vann",   sv:"Vatten" },
  { en:"Friend",   emoji:"🤝", color:C.blue,
    es:"Amigo",    fr:"Ami",      ar:"صديق",   de:"Freund",   it:"Amico",    pt:"Amigo",    ru:"Друг",    zh:"朋友", ja:"ともだち",ko:"친구",   bn:"বন্ধু",   hi:"दोस्त",  nl:"Vriend",  pl:"Przyjaciel",no:"Venn",  sv:"Vän"    },
  { en:"Happy",    emoji:"😊", color:C.yellow,
    es:"Feliz",    fr:"Heureux",  ar:"سعيد",   de:"Glücklich",it:"Felice",   pt:"Feliz",    ru:"Счастливый",zh:"快乐",ja:"うれしい",ko:"행복해요",bn:"খুশি",  hi:"खुश",    nl:"Gelukkig",pl:"Szczęśliwy",no:"Glad",  sv:"Glad"   },
  { en:"Sun",      emoji:"☀️", color:C.yellow,
    es:"Sol",      fr:"Soleil",   ar:"شمس",    de:"Sonne",    it:"Sole",     pt:"Sol",      ru:"Солнце",  zh:"太阳", ja:"たいよう",ko:"태양",   bn:"সূর্য",   hi:"सूरज",   nl:"Zon",     pl:"Słońce",  no:"Sol",    sv:"Sol"    },
];

// ── Speech ────────────────────────────────────────────────────────────────────
function speak(text,voice="en-US"){
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u=new SpeechSynthesisUtterance(text);
  u.lang=voice; u.rate=0.8; u.pitch=1.1;
  window.speechSynthesis.speak(u);
}

// ── Confetti ───────────────────────────────────────────────────────────────────
function Confetti({active}){
  const ps=Array.from({length:20},(_,i)=>({id:i,x:Math.random()*100,
    color:[C.blue,C.red,C.yellow,C.green,C.magenta,C.cyan][i%6],
    delay:Math.random()*0.4,size:Math.random()*10+7}));
  if (!active) return null;
  return <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
    {ps.map(p=><motion.div key={p.id} className="absolute rounded-sm top-0"
      style={{left:`${p.x}%`,width:p.size,height:p.size,background:p.color}}
      initial={{y:-20,opacity:1,rotate:0}} animate={{y:"110vh",opacity:0,rotate:720}}
      transition={{duration:1.5+Math.random(),delay:p.delay,ease:"easeIn"}}/>)}
  </div>;
}

// ── Lang Dropdown ─────────────────────────────────────────────────────────────
function LangDropdown({value,onChange}){
  const [open,setOpen]=useState(false);
  const ref=useRef(null);
  const sel=LANGUAGES.find(l=>l.code===value)||LANGUAGES[0];
  useEffect(()=>{
    const h=e=>{if(ref.current&&!ref.current.contains(e.target))setOpen(false);};
    document.addEventListener("mousedown",h); return()=>document.removeEventListener("mousedown",h);
  },[]);
  return (
    <div ref={ref} style={{position:"relative",zIndex:40}}>
      <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.97}} onClick={()=>setOpen(o=>!o)}
        style={{display:"flex",alignItems:"center",gap:8,padding:"10px 18px",borderRadius:999,
          border:"2.5px solid white",background:"rgba(255,255,255,0.92)",backdropFilter:"blur(8px)",
          boxShadow:"0 4px 20px rgba(230,81,0,0.18)",cursor:"pointer",
          fontFamily:"var(--font-display,'Nunito',sans-serif)",fontWeight:700,fontSize:14,color:C.orange,
          whiteSpace:"nowrap",minWidth:170,justifyContent:"space-between"}}>
        <span style={{display:"flex",alignItems:"center",gap:7}}>
          <Globe size={14} style={{flexShrink:0}}/>
          <span style={{fontSize:20,lineHeight:1}}>{sel.flag}</span>
          <span>{sel.label}</span>
        </span>
        <motion.span animate={{rotate:open?180:0}} transition={{duration:0.2}} style={{display:"flex"}}>
          <ChevronDown size={13}/>
        </motion.span>
      </motion.button>
      <AnimatePresence>
        {open&&<motion.div initial={{opacity:0,y:-8,scale:0.97}} animate={{opacity:1,y:0,scale:1}}
          exit={{opacity:0,y:-8,scale:0.97}} transition={{duration:0.15}}
          style={{position:"absolute",top:"calc(100% + 8px)",left:"50%",transform:"translateX(-50%)",
            width:215,background:"white",borderRadius:18,
            border:"2px solid rgba(230,81,0,0.12)",boxShadow:"0 16px 48px rgba(230,81,0,0.16)",
            overflow:"hidden",maxHeight:320,overflowY:"auto",scrollbarWidth:"thin"}}>
          <div style={{padding:"8px 14px 6px",borderBottom:"1.5px solid #FFF3E0",
            fontFamily:"var(--font-display,'Nunito',sans-serif)",fontWeight:700,fontSize:10,
            color:C.orange,letterSpacing:"0.08em",textTransform:"uppercase",
            display:"flex",alignItems:"center",gap:5}}>
            <Globe size={10}/> Translation language
          </div>
          {LANGUAGES.map(l=>{
            const isA=l.code===value;
            return <button key={l.code} onClick={()=>{onChange(l.code);setOpen(false);}}
              style={{display:"flex",alignItems:"center",gap:9,width:"100%",padding:"8px 14px",
                border:"none",background:isA?C.orangeSoft:"transparent",cursor:"pointer",
                fontFamily:"var(--font-body,'Nunito',sans-serif)",fontWeight:isA?700:500,fontSize:13,
                color:isA?C.orange:"#374151",textAlign:"left",
                borderLeft:isA?`3px solid ${C.orange}`:"3px solid transparent"}}
              onMouseEnter={e=>{if(!isA)e.currentTarget.style.background="#FFF8F0";}}
              onMouseLeave={e=>{if(!isA)e.currentTarget.style.background="transparent";}}>
              <span style={{fontSize:18,lineHeight:1,flexShrink:0}}>{l.flag}</span>
              <span style={{flex:1}}>{l.label}</span>
              {isA&&<span style={{width:6,height:6,borderRadius:"50%",background:C.orange,flexShrink:0}}/>}
            </button>;
          })}
        </motion.div>}
      </AnimatePresence>
    </div>
  );
}

// ── Letter Card ───────────────────────────────────────────────────────────────
function LetterCard({item,lang,langMeta,active,onClick}){
  return (
    <motion.div whileHover={{scale:1.04,y:-2}} whileTap={{scale:0.97}}
      onClick={onClick} style={{cursor:"pointer"}}>
      <div className="rounded-3xl border-4 p-4 text-center shadow-lg transition-all"
        style={{borderColor:active?item.color:"white",
          background:active?`${item.color}18`:"white",
          boxShadow:active?`0 8px 32px ${item.color}40`:"0 4px 16px rgba(0,0,0,0.08)"}}>
        <div className="text-4xl mb-1">{item.emoji}</div>
        <div className="font-display text-4xl font-black mb-1" style={{color:item.color}}>
          {item.letter}
        </div>
        <div className="font-display text-sm text-slate-600">{item.word}</div>
        <div className="font-body text-xs mt-1" style={{color:item.color,direction:langMeta.dir}}>
          {item[lang]||item.word}
        </div>
        <motion.button whileHover={{scale:1.15}} whileTap={{scale:0.9}}
          onClick={e=>{e.stopPropagation();speak(item.word,"en-US");setTimeout(()=>speak(item[lang]||item.word,langMeta.voice),600);}}
          className="mt-2 w-8 h-8 rounded-full flex items-center justify-center mx-auto"
          style={{background:item.color,color:"white"}}>
          <Volume2 size={13}/>
        </motion.button>
      </div>
    </motion.div>
  );
}

// ── Number Card ───────────────────────────────────────────────────────────────
const NUM_COLORS=[C.red,C.orange,C.yellow,C.green,C.cyan,C.blue,"#6A1B9A",C.magenta,"#795548","#546E7A"];
function NumberCard({item,lang,langMeta,active,onClick}){
  const color=NUM_COLORS[item.n];
  return (
    <motion.div whileHover={{scale:1.04,y:-2}} whileTap={{scale:0.97}}
      onClick={onClick} style={{cursor:"pointer"}}>
      <div className="rounded-3xl border-4 p-4 text-center shadow-lg transition-all"
        style={{borderColor:active?color:"white",
          background:active?`${color}18`:"white",
          boxShadow:active?`0 8px 32px ${color}40`:"0 4px 16px rgba(0,0,0,0.08)"}}>
        <div className="font-display text-5xl font-black mb-1" style={{color}}>{item.n}</div>
        <div className="text-3xl mb-1">{item.emoji}</div>
        <div className="font-display text-base" style={{color}}>
          {Array.from({length:Math.max(item.n,1)},(_,i)=>"⭐").join(" ").slice(0,item.n===0?0:undefined)||"—"}
        </div>
        <div className="font-body text-sm mt-1 text-slate-600">{item[lang]||""}</div>
        <motion.button whileHover={{scale:1.15}} whileTap={{scale:0.9}}
          onClick={e=>{e.stopPropagation();speak(String(item.n),"en-US");setTimeout(()=>speak(item[lang]||"",langMeta.voice),600);}}
          className="mt-2 w-8 h-8 rounded-full flex items-center justify-center mx-auto"
          style={{background:color,color:"white"}}>
          <Volume2 size={13}/>
        </motion.button>
      </div>
    </motion.div>
  );
}

// ── Word Card ─────────────────────────────────────────────────────────────────
function WordCard({item,lang,langMeta,active,onClick}){
  return (
    <motion.div whileHover={{scale:1.03,y:-2}} whileTap={{scale:0.97}}
      onClick={onClick} style={{cursor:"pointer"}}>
      <div className="rounded-3xl border-4 p-5 shadow-lg transition-all"
        style={{borderColor:active?item.color:"white",
          background:active?`${item.color}14`:"white",
          boxShadow:active?`0 8px 32px ${item.color}35`:"0 4px 16px rgba(0,0,0,0.07)"}}>
        <div className="flex items-center gap-3">
          <span style={{fontSize:32}}>{item.emoji}</span>
          <div className="flex-1 min-w-0">
            <div className="font-display text-lg font-bold" style={{color:item.color}}>{item.en}</div>
            <div className="font-body text-base text-slate-700" dir={langMeta.dir}>
              {item[lang]||item.en}
            </div>
          </div>
          <motion.button whileHover={{scale:1.15}} whileTap={{scale:0.9}}
            onClick={e=>{e.stopPropagation();speak(item.en,"en-US");setTimeout(()=>speak(item[lang]||item.en,langMeta.voice),700);}}
            className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
            style={{background:item.color,color:"white"}}>
            <Volume2 size={14}/>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

// ── Detail Panel (shown when a card is active) ────────────────────────────────
function DetailPanel({item,lang,langMeta,type,onClose}){
  if (!item) return null;
  const color = type==="numbers" ? NUM_COLORS[item.n] : item.color;
  const englishText = type==="letters"?item.word : type==="numbers"?String(item.n) : item.en;
  const localText   = item[lang] || englishText;

  return (
    <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} exit={{opacity:0,y:16}}
      className="rounded-3xl border-4 p-6 shadow-2xl" style={{borderColor:color,background:"white"}}>
      {/* Main display */}
      <div className="text-center mb-5">
        <div style={{fontSize:56,marginBottom:4}}>{item.emoji}</div>
        {type==="letters"&&<div className="font-display text-6xl font-black mb-1" style={{color}}>{item.letter}</div>}
        {type==="numbers"&&<div className="font-display text-6xl font-black mb-1" style={{color}}>{item.n}</div>}
        <div className="font-display text-xl" style={{color}}>{englishText}</div>
      </div>

      {/* Translation highlight */}
      <div className="rounded-2xl p-4 mb-4 text-center" style={{background:`${color}18`,border:`2px solid ${color}50`}}>
        <div className="font-body text-xs text-slate-400 mb-1">{langMeta.flag} {langMeta.label}</div>
        <div className="font-display text-2xl font-bold" style={{color,direction:langMeta.dir}}>{localText}</div>
      </div>

      {/* All 16 translations */}
      <div className="grid grid-cols-2 gap-1.5 mb-4">
        {LANGUAGES.map(l=>(
          <div key={l.code} className="flex items-center gap-2 rounded-xl px-3 py-2"
            style={{background:l.code===lang?`${color}18`:"#F8FAFC",border:l.code===lang?`1.5px solid ${color}60`:"1.5px solid transparent"}}>
            <span style={{fontSize:16,lineHeight:1,flexShrink:0}}>{l.flag}</span>
            <span className="font-body text-xs truncate" style={{color:l.code===lang?color:"#64748B",direction:l.dir}}>
              {item[l.code]||"—"}
            </span>
          </div>
        ))}
      </div>

      {/* Speak buttons */}
      <div className="flex gap-3 justify-center">
        <motion.button whileHover={{scale:1.05}} whileTap={{scale:0.95}}
          onClick={()=>speak(englishText,"en-US")}
          className="flex items-center gap-2 px-4 py-2 rounded-full text-white font-display text-sm"
          style={{background:"#37474F"}}>
          <Volume2 size={14}/> 🇬🇧 English
        </motion.button>
        <motion.button whileHover={{scale:1.05}} whileTap={{scale:0.95}}
          onClick={()=>speak(localText,langMeta.voice)}
          className="flex items-center gap-2 px-4 py-2 rounded-full text-white font-display text-sm"
          style={{background:color}}>
          <Volume2 size={14}/> {langMeta.flag} {langMeta.label}
        </motion.button>
      </div>
    </motion.div>
  );
}

// ── TABS config ───────────────────────────────────────────────────────────────
const TABS = [
  { id:"letters", label:"Alphabet", icon:BookOpen,  color:C.orange  },
  { id:"numbers", label:"Numbers",  icon:Hash,      color:C.blue    },
  { id:"words",   label:"Words",    icon:MessageCircle,color:C.green },
];

// ── MAIN ──────────────────────────────────────────────────────────────────────
export default function Education({ lang:propLang, onLangChange }){
  const [tab,setTab]         = useState("letters");
  const [localLang,setLocalLang]=useState("es");
  const [active,setActive]   = useState(null);
  const [confetti,setConfetti]=useState(false);
  const [learned,setLearned] = useState({letters:new Set(),numbers:new Set(),words:new Set()});

  const lang    = propLang||localLang;
  const setLang = v=>{ setLocalLang(v); onLangChange?.(v); };
  const langMeta = LANGUAGES.find(l=>l.code===lang)||LANGUAGES[0];

  const tabColor = TABS.find(t=>t.id===tab)?.color || C.orange;

  const handleCardClick=(item,key)=>{
    const isSame = active && (active.letter===item.letter||active.n===item.n||active.en===item.en);
    setActive(isSame?null:item);
    if (!isSame){
      const newKey = key ?? (tab==="letters"?item.letter:tab==="numbers"?item.n:item.en);
      const prev = learned[tab];
      if (!prev.has(newKey)){
        const next=new Set([...prev,newKey]);
        setLearned(l=>({...l,[tab]:next}));
        if (next.size===({letters:ALPHABET,numbers:NUMBERS,words:COMMON_WORDS}[tab].length)){
          setConfetti(true); setTimeout(()=>setConfetti(false),2500);
        }
      }
    }
  };

  const dataset      = tab==="letters"?ALPHABET:tab==="numbers"?NUMBERS:COMMON_WORDS;
  const totalLearned = learned[tab].size;
  const totalItems   = dataset.length;

  return (
    <div className="min-h-screen" style={{background:"linear-gradient(150deg,#FFF3E0 0%,#FFFDE7 50%,#E8F5E9 100%)"}}>
      <Confetti active={confetti}/>

      {/* Header */}
      <div className="text-center py-10 px-4">
        <motion.div initial={{scale:0.8,opacity:0}} animate={{scale:1,opacity:1}} transition={{type:"spring"}}
          className="text-6xl mb-3 inline-block">📖</motion.div>
        <motion.h1 initial={{opacity:0,y:-12}} animate={{opacity:1,y:0}}
          className="font-display text-4xl md:text-5xl mb-2" style={{color:C.orange}}>Learn ABC</motion.h1>
        <p className="font-body text-slate-500 text-lg">
          Learn English with {langMeta.flag} {langMeta.label} translations! 🌍
        </p>
      </div>

      {/* Top controls */}
      <div style={{display:"flex",flexWrap:"wrap",justifyContent:"center",gap:10,padding:"0 16px 20px"}}>
        {/* Tabs */}
        <div className="flex bg-white/80 rounded-full p-1 shadow-sm gap-1">
          {TABS.map(t=>{
            const Icon=t.icon;
            return <button key={t.id} onClick={()=>{setTab(t.id);setActive(null);}}
              className="flex items-center gap-2 px-4 py-2 rounded-full font-display text-sm transition-all"
              style={{background:tab===t.id?t.color:"transparent",color:tab===t.id?"white":"#6B7280"}}>
              <Icon size={14}/>{t.label}
            </button>;
          })}
        </div>
        {/* Language picker */}
        <LangDropdown value={lang} onChange={setLang}/>
      </div>

      {/* Progress bar */}
      <div className="max-w-4xl mx-auto px-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="font-display text-sm" style={{color:tabColor}}>
            Progress: {totalLearned} / {totalItems}
          </span>
          {totalLearned===totalItems&&totalItems>0&&
            <span className="font-display text-sm text-white px-3 py-1 rounded-full" style={{background:tabColor}}>
              ⭐ All done!
            </span>}
        </div>
        <div className="h-3 rounded-full overflow-hidden" style={{background:`${tabColor}20`}}>
          <motion.div className="h-full rounded-full"
            style={{background:tabColor}}
            initial={{width:0}}
            animate={{width:`${totalItems>0?(totalLearned/totalItems)*100:0}%`}}
            transition={{duration:0.5,ease:"easeOut"}}/>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pb-24">
        <div className="grid lg:grid-cols-3 gap-6">

          {/* Cards grid */}
          <div className={`${active?"lg:col-span-2":"lg:col-span-3"}`}>
            <AnimatePresence mode="wait">
              <motion.div key={tab}
                initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}}
                transition={{duration:0.2}}>
                {tab==="letters"&&(
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                    {ALPHABET.map(item=>(
                      <LetterCard key={item.letter} item={item} lang={lang} langMeta={langMeta}
                        active={active?.letter===item.letter}
                        onClick={()=>handleCardClick(item,item.letter)}/>
                    ))}
                  </div>
                )}
                {tab==="numbers"&&(
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                    {NUMBERS.map(item=>(
                      <NumberCard key={item.n} item={item} lang={lang} langMeta={langMeta}
                        active={active?.n===item.n}
                        onClick={()=>handleCardClick(item,item.n)}/>
                    ))}
                  </div>
                )}
                {tab==="words"&&(
                  <div className="grid sm:grid-cols-2 gap-3">
                    {COMMON_WORDS.map(item=>(
                      <WordCard key={item.en} item={item} lang={lang} langMeta={langMeta}
                        active={active?.en===item.en}
                        onClick={()=>handleCardClick(item,item.en)}/>
                    ))}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Detail panel */}
          <AnimatePresence>
            {active&&(
              <div className="lg:col-span-1">
                <DetailPanel item={active} lang={lang} langMeta={langMeta} type={tab}
                  onClose={()=>setActive(null)}/>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Tip */}
        <div className="mt-8 rounded-3xl p-4 border-2 border-white shadow-sm text-center" style={{background:C.yellowSoft}}>
          <p className="font-body text-sm text-slate-600">
            💡 Tap any card to see all 16 language translations + hear the pronunciation!
          </p>
        </div>
      </div>
    </div>
  );
}
