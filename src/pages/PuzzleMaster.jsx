/**
 * src/pages/PuzzleMaster.jsx — Kiddsy
 * ─────────────────────────────────────────────────────────────────────────
 * 4 categorías × 20 ítems  ·  16 idiomas  ·  dificultad 3×3 → 6×6
 * Fotos via source.unsplash.com/featured (siempre válidas)
 * ─────────────────────────────────────────────────────────────────────────
 */
import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RotateCcw, Volume2, ChevronDown,
  Globe, Grid, Cat, Building2, Leaf, Landmark,
  Star, Loader, Trophy, Target, CheckCircle, Lock,
} from "lucide-react";
import Pricing from "../components/Pricing.jsx";
// ── CartoonTitle — título estilo cuento ilustrado ─────────────────────────
// fill: color de relleno  |  stroke: color del trazo  |  size: fontSize SVG
function CartoonTitle({ children, fill = "#1565C0", stroke = "#BBDEFB", size = 42, className = "" }) {
  const text  = String(children);
  // Estimate SVG width: ~0.58em per char at given font size, with padding
  const estW  = Math.max(200, text.length * size * 0.56 + 40);
  const estH  = size * 1.48;

  return (
    <span
      className={className}
      style={{ display: "inline-block", lineHeight: 1 }}
      aria-label={text}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={estW}
        height={estH}
        viewBox={`0 0 ${estW} ${estH}`}
        style={{ display: "block", maxWidth: "100%", overflow: "visible" }}
      >
        {/* Stroke pass — slightly thicker, drawn first so fill sits on top */}
        <text
          x="50%"
          y="75%"
          textAnchor="middle"
          dominantBaseline="middle"
          fontFamily="var(--font-display,'Nunito',ui-rounded,sans-serif)"
          fontWeight="800"
          fontSize={size}
          fill="none"
          stroke={stroke}
          strokeWidth="6"
          strokeLinejoin="round"
          strokeLinecap="round"
          paintOrder="stroke"
        >
          {text}
        </text>
        {/* Fill pass */}
        <text
          x="50%"
          y="75%"
          textAnchor="middle"
          dominantBaseline="middle"
          fontFamily="var(--font-display,'Nunito',ui-rounded,sans-serif)"
          fontWeight="800"
          fontSize={size}
          fill={fill}
          stroke="none"
        >
          {text}
        </text>
      </svg>
    </span>
  );
}

// ── Paleta ────────────────────────────────────────────────────────────────
const C = {
  blue:       "#1565C0", blueSoft:   "#E3F2FD",
  red:        "#E53935",
  yellow:     "#F9A825", yellowSoft: "#FFFDE7",
  green:      "#43A047", greenSoft:  "#E8F5E9",
  magenta:    "#D81B60",
  cyan:       "#00ACC1",
  orange:     "#E65100",
};

// ── 16 idiomas ────────────────────────────────────────────────────────────
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
  { code:"bn", label:"বাংলা",      flag:"🇧🇩", dir:"ltr", voice:"bn-BD" },
  { code:"hi", label:"हिंदी",      flag:"🇮🇳", dir:"ltr", voice:"hi-IN" },
  { code:"nl", label:"Nederlands", flag:"🇳🇱", dir:"ltr", voice:"nl-NL" },
  { code:"pl", label:"Polski",     flag:"🇵🇱", dir:"ltr", voice:"pl-PL" },
  { code:"no", label:"Norsk",      flag:"🇳🇴", dir:"ltr", voice:"nb-NO" },
  { code:"sv", label:"Svenska",    flag:"🇸🇪", dir:"ltr", voice:"sv-SE" },
];

// ── Dificultades ──────────────────────────────────────────────────────────
const DIFFICULTIES = [
  { size:3, label:"3×3", starCount:1, desc:"Easy"   },
  { size:4, label:"4×4", starCount:2, desc:"Medium" },
  { size:5, label:"5×5", starCount:3, desc:"Hard"   },
  { size:6, label:"6×6", starCount:4, desc:"Expert" },
];

// ── URL helper ────────────────────────────────────────────────────────────
const u = kw =>
  `https://source.unsplash.com/featured/800x800/?${encodeURIComponent(kw)}`;

// ════════════════════════════════════════════════════════════════════════════
// DATOS — 4 CATEGORÍAS × 20 ÍTEMS
// ════════════════════════════════════════════════════════════════════════════

// ── 🦁 ANIMALS ────────────────────────────────────────────────────────────
const ANIMALS = [
  { name:"Lion",        emoji:"🦁", color:"#F9A825", img:u("lion wildlife"),
    fact:"Lions can sleep up to 20 hours a day!",
    es:"León",       fr:"Lion",          ar:"أسد",         de:"Löwe",
    it:"Leone",      pt:"Leão",          ru:"Лев",          zh:"狮子",
    ja:"ライオン",   ko:"사자",          bn:"সিংহ",         hi:"शेर",
    nl:"Leeuw",      pl:"Lew",           no:"Løve",         sv:"Lejon" },
  { name:"Elephant",    emoji:"🐘", color:"#78909C", img:u("elephant"),
    fact:"Elephants never forget — they have the best memory of any land animal!",
    es:"Elefante",   fr:"Éléphant",      ar:"فيل",          de:"Elefant",
    it:"Elefante",   pt:"Elefante",      ru:"Слон",         zh:"大象",
    ja:"ゾウ",       ko:"코끼리",        bn:"হাতি",         hi:"हाथी",
    nl:"Olifant",    pl:"Słoń",          no:"Elefant",      sv:"Elefant" },
  { name:"Tiger",       emoji:"🐯", color:"#EF6C00", img:u("tiger"),
    fact:"No two tigers have the same stripe pattern — like fingerprints!",
    es:"Tigre",      fr:"Tigre",         ar:"نمر",          de:"Tiger",
    it:"Tigre",      pt:"Tigre",         ru:"Тигр",         zh:"老虎",
    ja:"トラ",       ko:"호랑이",        bn:"বাঘ",          hi:"बाघ",
    nl:"Tijger",     pl:"Tygrys",        no:"Tiger",        sv:"Tiger" },
  { name:"Giraffe",     emoji:"🦒", color:"#F4A435", img:u("giraffe"),
    fact:"Giraffes are the tallest animals — up to 6 metres tall!",
    es:"Jirafa",     fr:"Girafe",        ar:"زرافة",        de:"Giraffe",
    it:"Giraffa",    pt:"Girafa",        ru:"Жираф",        zh:"长颈鹿",
    ja:"キリン",     ko:"기린",          bn:"জিরাফ",        hi:"जिराफ़",
    nl:"Giraf",      pl:"Żyrafa",        no:"Sjiraff",      sv:"Giraff" },
  { name:"Dolphin",     emoji:"🐬", color:"#0288D1", img:u("dolphin ocean"),
    fact:"Dolphins call each other by unique whistle names!",
    es:"Delfín",     fr:"Dauphin",       ar:"دلفين",        de:"Delfin",
    it:"Delfino",    pt:"Golfinho",      ru:"Дельфин",      zh:"海豚",
    ja:"イルカ",     ko:"돌고래",        bn:"ডলফিন",        hi:"डॉल्फिन",
    nl:"Dolfijn",    pl:"Delfin",        no:"Delfin",       sv:"Delfin" },
  { name:"Panda",       emoji:"🐼", color:"#546E7A", img:u("panda bear"),
    fact:"A giant panda eats up to 40 kg of bamboo in a single day!",
    es:"Panda",      fr:"Panda",         ar:"الباندا",      de:"Panda",
    it:"Panda",      pt:"Panda",         ru:"Панда",        zh:"熊猫",
    ja:"パンダ",     ko:"판다",          bn:"পান্ডা",       hi:"पांडा",
    nl:"Panda",      pl:"Panda",         no:"Panda",        sv:"Panda" },
  { name:"Penguin",     emoji:"🐧", color:"#37474F", img:u("penguin"),
    fact:"Penguins cannot fly — but are incredible swimmers!",
    es:"Pingüino",   fr:"Manchot",       ar:"بطريق",        de:"Pinguin",
    it:"Pinguino",   pt:"Pinguim",       ru:"Пингвин",      zh:"企鹅",
    ja:"ペンギン",   ko:"펭귄",          bn:"পেঙ্গুইন",     hi:"पेंगुइन",
    nl:"Pinguïn",    pl:"Pingwin",       no:"Pingvin",      sv:"Pingvin" },
  { name:"Parrot",      emoji:"🦜", color:"#2E7D32", img:u("parrot colorful"),
    fact:"Parrots can live over 80 years — longer than many humans!",
    es:"Loro",       fr:"Perroquet",     ar:"ببغاء",        de:"Papagei",
    it:"Pappagallo", pt:"Papagaio",      ru:"Попугай",      zh:"鹦鹉",
    ja:"オウム",     ko:"앵무새",        bn:"টিয়া",        hi:"तोता",
    nl:"Papegaai",   pl:"Papuga",        no:"Papegøye",     sv:"Papegoja" },
  { name:"Fox",         emoji:"🦊", color:"#BF360C", img:u("fox wildlife"),
    fact:"Foxes use Earth's magnetic field to hunt under snow!",
    es:"Zorro",      fr:"Renard",        ar:"ثعلب",         de:"Fuchs",
    it:"Volpe",      pt:"Raposa",        ru:"Лиса",         zh:"狐狸",
    ja:"キツネ",     ko:"여우",          bn:"শেয়াল",       hi:"लोमड़ी",
    nl:"Vos",        pl:"Lis",           no:"Rev",          sv:"Räv" },
  { name:"Eagle",       emoji:"🦅", color:"#5D4037", img:u("eagle bird sky"),
    fact:"Eagles can spot a rabbit from 3 km — their vision is 4× sharper than ours!",
    es:"Águila",     fr:"Aigle",         ar:"نسر",          de:"Adler",
    it:"Aquila",     pt:"Águia",         ru:"Орёл",         zh:"老鹰",
    ja:"ワシ",       ko:"독수리",        bn:"ঈগল",          hi:"ईगल",
    nl:"Adelaar",    pl:"Orzeł",         no:"Ørn",          sv:"Örn" },
  { name:"Whale",       emoji:"🐋", color:"#1565C0", img:u("whale ocean"),
    fact:"Blue whale hearts are the size of a small car!",
    es:"Ballena",    fr:"Baleine",       ar:"حوت",          de:"Wal",
    it:"Balena",     pt:"Baleia",        ru:"Кит",          zh:"鲸鱼",
    ja:"クジラ",     ko:"고래",          bn:"তিমি",         hi:"व्हेल",
    nl:"Walvis",     pl:"Wieloryb",      no:"Hval",         sv:"Val" },
  { name:"Cheetah",     emoji:"🐆", color:"#F57F17", img:u("cheetah"),
    fact:"The cheetah goes from 0 to 100 km/h in just 3 seconds!",
    es:"Guepardo",   fr:"Guépard",       ar:"فهد",          de:"Gepard",
    it:"Ghepardo",   pt:"Guepardo",      ru:"Гепард",       zh:"猎豹",
    ja:"チーター",   ko:"치타",          bn:"চিতা",         hi:"चीता",
    nl:"Jachtluipaard",pl:"Gepard",      no:"Gepard",       sv:"Gepard" },
  { name:"Gorilla",     emoji:"🦍", color:"#37474F", img:u("gorilla primate"),
    fact:"Gorillas share 98.3% of their DNA with humans!",
    es:"Gorila",     fr:"Gorille",       ar:"غوريلا",       de:"Gorilla",
    it:"Gorilla",    pt:"Gorila",        ru:"Горилла",      zh:"大猩猩",
    ja:"ゴリラ",     ko:"고릴라",        bn:"গরিলা",        hi:"गोरिल्ला",
    nl:"Gorilla",    pl:"Goryl",         no:"Gorilla",      sv:"Gorilla" },
  { name:"Flamingo",    emoji:"🦩", color:"#E91E8C", img:u("flamingo pink"),
    fact:"Flamingos are born grey — their pink color comes from their food!",
    es:"Flamenco",   fr:"Flamant rose",  ar:"نحام",         de:"Flamingo",
    it:"Fenicottero",pt:"Flamingo",      ru:"Фламинго",     zh:"火烈鸟",
    ja:"フラミンゴ", ko:"홍학",          bn:"ফ্লামিঙ্গো",   hi:"राजहंस",
    nl:"Flamingo",   pl:"Flaming",       no:"Flamingo",     sv:"Flamingo" },
  { name:"Octopus",     emoji:"🐙", color:"#6A1B9A", img:u("octopus underwater"),
    fact:"Octopuses have three hearts and blue blood!",
    es:"Pulpo",      fr:"Pieuvre",       ar:"أخطبوط",       de:"Oktopus",
    it:"Polpo",      pt:"Polvo",         ru:"Осьминог",     zh:"章鱼",
    ja:"タコ",       ko:"문어",          bn:"অক্টোপাস",     hi:"ऑक्टोपस",
    nl:"Octopus",    pl:"Ośmiornica",    no:"Blekksprut",   sv:"Bläckfisk" },
  { name:"Kangaroo",    emoji:"🦘", color:"#D84315", img:u("kangaroo australia"),
    fact:"A baby kangaroo (joey) is only the size of a grape when born!",
    es:"Canguro",    fr:"Kangourou",     ar:"كنغر",         de:"Känguru",
    it:"Canguro",    pt:"Canguru",       ru:"Кенгуру",      zh:"袋鼠",
    ja:"カンガルー", ko:"캥거루",        bn:"ক্যাঙারু",     hi:"कंगारू",
    nl:"Kangoeroe",  pl:"Kangur",        no:"Kenguru",      sv:"Känguru" },
  { name:"Koala",       emoji:"🐨", color:"#8D6E63", img:u("koala eucalyptus"),
    fact:"Koalas sleep up to 22 hours a day!",
    es:"Koala",      fr:"Koala",         ar:"الكوالا",      de:"Koala",
    it:"Koala",      pt:"Coala",         ru:"Коала",        zh:"考拉",
    ja:"コアラ",     ko:"코알라",        bn:"কোয়ালা",      hi:"कोआला",
    nl:"Koala",      pl:"Koala",         no:"Koala",        sv:"Koala" },
  { name:"Zebra",       emoji:"🦓", color:"#424242", img:u("zebra africa"),
    fact:"Every zebra's stripe pattern is completely unique!",
    es:"Cebra",      fr:"Zèbre",         ar:"حمار وحشي",   de:"Zebra",
    it:"Zebra",      pt:"Zebra",         ru:"Зебра",        zh:"斑马",
    ja:"シマウマ",   ko:"얼룩말",        bn:"জেব্রা",       hi:"ज़ेबरा",
    nl:"Zebra",      pl:"Zebra",         no:"Sebra",        sv:"Zebra" },
  { name:"Turtle",      emoji:"🐢", color:"#2E7D32", img:u("sea turtle"),
    fact:"Sea turtles return to the exact beach where they were born!",
    es:"Tortuga",    fr:"Tortue",        ar:"سلحفاة",       de:"Schildkröte",
    it:"Tartaruga",  pt:"Tartaruga",     ru:"Черепаха",     zh:"乌龟",
    ja:"カメ",       ko:"거북이",        bn:"কচ্ছপ",        hi:"कछुआ",
    nl:"Schildpad",  pl:"Żółw",          no:"Skilpadde",    sv:"Sköldpadda" },
  { name:"Butterfly",   emoji:"🦋", color:"#AB47BC", img:u("butterfly flower"),
    fact:"Butterflies taste with their feet — they have sensors on their legs!",
    es:"Mariposa",   fr:"Papillon",      ar:"فراشة",        de:"Schmetterling",
    it:"Farfalla",   pt:"Borboleta",     ru:"Бабочка",      zh:"蝴蝶",
    ja:"チョウ",     ko:"나비",          bn:"প্রজাপতি",     hi:"तितली",
    nl:"Vlinder",    pl:"Motyl",         no:"Sommerfugl",   sv:"Fjäril" },
];

// ── 🏙️ CITIES ────────────────────────────────────────────────────────────
const CITIES = [
  { name:"Paris",       emoji:"🗼", color:"#0D47A1", img:u("paris eiffel tower"),
    fact:"Paris is called 'The City of Light' — it was one of the first cities to have gas street lighting.",
    es:"París",      fr:"Paris",         ar:"باريس",        de:"Paris",
    it:"Parigi",     pt:"Paris",         ru:"Париж",        zh:"巴黎",
    ja:"パリ",       ko:"파리",          bn:"প্যারিস",      hi:"पेरिस",
    nl:"Parijs",     pl:"Paryż",         no:"Paris",        sv:"Paris" },
  { name:"Tokyo",       emoji:"🗾", color:"#B71C1C", img:u("tokyo japan skyline"),
    fact:"Tokyo is the world's most populous metropolitan area — home to over 37 million people!",
    es:"Tokio",      fr:"Tokyo",         ar:"طوكيو",        de:"Tokio",
    it:"Tokyo",      pt:"Tóquio",        ru:"Токио",        zh:"东京",
    ja:"東京",       ko:"도쿄",          bn:"টোকিও",        hi:"टोक्यो",
    nl:"Tokio",      pl:"Tokio",         no:"Tokyo",        sv:"Tokyo" },
  { name:"New York",    emoji:"🗽", color:"#1B5E20", img:u("new york city skyline"),
    fact:"New York City is home to more than 800 languages — more than anywhere else on Earth!",
    es:"Nueva York", fr:"New York",      ar:"نيويورك",      de:"New York",
    it:"New York",   pt:"Nova York",     ru:"Нью-Йорк",     zh:"纽约",
    ja:"ニューヨーク",ko:"뉴욕",         bn:"নিউ ইয়র্ক",   hi:"न्यूयॉर्क",
    nl:"New York",   pl:"Nowy Jork",     no:"New York",     sv:"New York" },
  { name:"Cairo",       emoji:"🏺", color:"#E65100", img:u("cairo egypt pyramids"),
    fact:"Cairo is the largest city in Africa and the Arab world!",
    es:"El Cairo",   fr:"Le Caire",      ar:"القاهرة",      de:"Kairo",
    it:"Il Cairo",   pt:"Cairo",         ru:"Каир",         zh:"开罗",
    ja:"カイロ",     ko:"카이로",        bn:"কায়রো",        hi:"काहिरा",
    nl:"Caïro",      pl:"Kair",          no:"Kairo",        sv:"Kairo" },
  { name:"Rome",        emoji:"🏛️", color:"#8D3A00", img:u("rome colosseum italy"),
    fact:"Rome is built on seven hills and has been continuously inhabited for over 2,800 years!",
    es:"Roma",       fr:"Rome",          ar:"روما",         de:"Rom",
    it:"Roma",       pt:"Roma",          ru:"Рим",          zh:"罗马",
    ja:"ローマ",     ko:"로마",          bn:"রোম",          hi:"रोम",
    nl:"Rome",       pl:"Rzym",          no:"Roma",         sv:"Rom" },
  { name:"London",      emoji:"🎡", color:"#1A237E", img:u("london big ben"),
    fact:"London's Underground (The Tube) is the oldest metro system in the world, opened in 1863!",
    es:"Londres",    fr:"Londres",       ar:"لندن",         de:"London",
    it:"Londra",     pt:"Londres",       ru:"Лондон",       zh:"伦敦",
    ja:"ロンドン",   ko:"런던",          bn:"লন্ডন",        hi:"लंदन",
    nl:"Londen",     pl:"Londyn",        no:"London",       sv:"London" },
  { name:"Madrid",      emoji:"🌹", color:"#C62828", img:u("madrid spain plaza"),
    fact:"Madrid is the highest capital city in the European Union — at 667 metres above sea level!",
    es:"Madrid",     fr:"Madrid",        ar:"مدريد",        de:"Madrid",
    it:"Madrid",     pt:"Madrid",        ru:"Мадрид",       zh:"马德里",
    ja:"マドリード", ko:"마드리드",      bn:"মাদ্রিদ",      hi:"मैड्रिड",
    nl:"Madrid",     pl:"Madryt",        no:"Madrid",       sv:"Madrid" },
  { name:"Sydney",      emoji:"🦘", color:"#006064", img:u("sydney opera house"),
    fact:"The Sydney Opera House has over one million roof tiles arranged on 14 shell structures!",
    es:"Sídney",     fr:"Sydney",        ar:"سيدني",        de:"Sydney",
    it:"Sydney",     pt:"Sydney",        ru:"Сидней",       zh:"悉尼",
    ja:"シドニー",   ko:"시드니",        bn:"সিডনি",        hi:"सिडनी",
    nl:"Sydney",     pl:"Sydney",        no:"Sydney",       sv:"Sydney" },
  { name:"Dubai",       emoji:"🌆", color:"#F57F17", img:u("dubai skyline burj"),
    fact:"Dubai went from a small fishing village in 1970 to having the world's tallest building today!",
    es:"Dubái",      fr:"Dubaï",         ar:"دبي",          de:"Dubai",
    it:"Dubai",      pt:"Dubai",         ru:"Дубай",        zh:"迪拜",
    ja:"ドバイ",     ko:"두바이",        bn:"দুবাই",        hi:"दुबई",
    nl:"Dubai",      pl:"Dubaj",         no:"Dubai",        sv:"Dubai" },
  { name:"Rio de Janeiro",emoji:"🌊",color:"#1B5E20",img:u("rio de janeiro brazil"),
    fact:"The Christ the Redeemer statue in Rio is struck by lightning about 3-6 times a year!",
    es:"Río de Janeiro",fr:"Rio de Janeiro",ar:"ريو دي جانيرو",de:"Rio de Janeiro",
    it:"Rio de Janeiro",pt:"Rio de Janeiro",ru:"Рио-де-Жанейро",zh:"里约热内卢",
    ja:"リオデジャネイロ",ko:"리우데자네이루",bn:"রিও ডি জেনেইরো",hi:"रियो डी जनेरियो",
    nl:"Rio de Janeiro",pl:"Rio de Janeiro",no:"Rio de Janeiro",sv:"Rio de Janeiro" },
  { name:"Istanbul",    emoji:"🕌", color:"#4A148C", img:u("istanbul turkey mosque"),
    fact:"Istanbul is the only city in the world that spans two continents — Europe and Asia!",
    es:"Estambul",   fr:"Istanbul",      ar:"إسطنبول",      de:"Istanbul",
    it:"Istanbul",   pt:"Istambul",      ru:"Стамбул",      zh:"伊斯坦布尔",
    ja:"イスタンブール",ko:"이스탄불",   bn:"ইস্তানবুল",    hi:"इस्तांबुल",
    nl:"Istanbul",   pl:"Stambuł",       no:"Istanbul",     sv:"Istanbul" },
  { name:"Beijing",     emoji:"🏮", color:"#B71C1C", img:u("beijing china forbidden city"),
    fact:"Beijing has been the capital of China for over 800 years and has the largest palace complex in the world!",
    es:"Pekín",      fr:"Pékin",         ar:"بكين",         de:"Peking",
    it:"Pechino",    pt:"Pequim",        ru:"Пекин",        zh:"北京",
    ja:"北京",       ko:"베이징",        bn:"বেইজিং",       hi:"बीजिंग",
    nl:"Peking",     pl:"Pekin",         no:"Beijing",      sv:"Peking" },
  { name:"Mumbai",      emoji:"🎬", color:"#880E4F", img:u("mumbai india gateway"),
    fact:"Mumbai (Bollywood) produces more films per year than Hollywood!",
    es:"Bombay",     fr:"Mumbai",        ar:"مومباي",       de:"Mumbai",
    it:"Mumbai",     pt:"Mumbai",        ru:"Мумбаи",       zh:"孟买",
    ja:"ムンバイ",   ko:"뭄바이",        bn:"মুম্বাই",      hi:"मुंबई",
    nl:"Mumbai",     pl:"Mumbaj",        no:"Mumbai",       sv:"Mumbai" },
  { name:"Cape Town",   emoji:"🦁", color:"#004D40", img:u("cape town south africa table mountain"),
    fact:"Cape Town's Table Mountain is one of the oldest mountains on Earth — about 600 million years old!",
    es:"Ciudad del Cabo",fr:"Le Cap",    ar:"كيب تاون",     de:"Kapstadt",
    it:"Città del Capo",pt:"Cidade do Cabo",ru:"Кейптаун",  zh:"开普敦",
    ja:"ケープタウン",ko:"케이프타운",   bn:"কেপ টাউন",     hi:"केप टाउन",
    nl:"Kaapstad",   pl:"Kapsztad",      no:"Kapstaden",    sv:"Kapstaden" },
  { name:"Amsterdam",   emoji:"🚲", color:"#01579B", img:u("amsterdam canals netherlands"),
    fact:"Amsterdam has more bicycles than inhabitants — about 881,000 bikes for 872,000 people!",
    es:"Ámsterdam",  fr:"Amsterdam",     ar:"أمستردام",     de:"Amsterdam",
    it:"Amsterdam",  pt:"Amsterdão",     ru:"Амстердам",    zh:"阿姆斯特丹",
    ja:"アムステルダム",ko:"암스테르담", bn:"আমস্টারডাম",   hi:"एम्स्टर्डम",
    nl:"Amsterdam",  pl:"Amsterdam",     no:"Amsterdam",    sv:"Amsterdam" },
  { name:"Mexico City", emoji:"🌮", color:"#B71C1C", img:u("mexico city zocalo"),
    fact:"Mexico City is built on a dried lake bed — making it sink about 10 cm per year!",
    es:"Ciudad de México",fr:"Mexico",   ar:"مكسيكو سيتي",  de:"Mexiko-Stadt",
    it:"Città del Messico",pt:"Cidade do México",ru:"Мехико",zh:"墨西哥城",
    ja:"メキシコシティ",ko:"멕시코시티",  bn:"মেক্সিকো সিটি",hi:"मेक्सिको सिटी",
    nl:"Mexico-Stad",pl:"Meksyk",        no:"Mexico by",    sv:"Mexico stad" },
  { name:"Bangkok",     emoji:"🐘", color:"#1B5E20", img:u("bangkok thailand temple"),
    fact:"Bangkok's full ceremonial name is the longest city name in the world — 169 characters!",
    es:"Bangkok",    fr:"Bangkok",       ar:"بانكوك",       de:"Bangkok",
    it:"Bangkok",    pt:"Banguecoque",   ru:"Бангкок",      zh:"曼谷",
    ja:"バンコク",   ko:"방콕",          bn:"ব্যাংকক",      hi:"बैंकॉक",
    nl:"Bangkok",    pl:"Bangkok",       no:"Bangkok",      sv:"Bangkok" },
  { name:"Buenos Aires",emoji:"💃",color:"#880E4F",img:u("buenos aires argentina"),
    fact:"Buenos Aires has more bookshops per capita than any other city in the world!",
    es:"Buenos Aires",fr:"Buenos Aires", ar:"بوينس أيرس",  de:"Buenos Aires",
    it:"Buenos Aires",pt:"Buenos Aires", ru:"Буэнос-Айрес", zh:"布宜诺斯艾利斯",
    ja:"ブエノスアイレス",ko:"부에노스아이레스",bn:"বুয়েনোস আইরেস",hi:"ब्यूनस आयर्स",
    nl:"Buenos Aires",pl:"Buenos Aires", no:"Buenos Aires", sv:"Buenos Aires" },
  { name:"Moscow",      emoji:"🎪", color:"#B71C1C", img:u("moscow russia kremlin"),
    fact:"Moscow's metro is famous as one of the most beautiful in the world — stations look like museums!",
    es:"Moscú",      fr:"Moscou",        ar:"موسكو",        de:"Moskau",
    it:"Mosca",      pt:"Moscovo",       ru:"Москва",       zh:"莫斯科",
    ja:"モスクワ",   ko:"모스크바",      bn:"মস্কো",        hi:"मॉस्को",
    nl:"Moskou",     pl:"Moskwa",        no:"Moskva",       sv:"Moskva" },
  { name:"Singapore",   emoji:"🦁", color:"#006064", img:u("singapore skyline marina"),
    fact:"Singapore is one of only three city-states in the world — it is both a city and a country!",
    es:"Singapur",   fr:"Singapour",     ar:"سنغافورة",     de:"Singapur",
    it:"Singapore",  pt:"Singapura",     ru:"Сингапур",     zh:"新加坡",
    ja:"シンガポール",ko:"싱가포르",     bn:"সিঙ্গাপুর",    hi:"सिंगापुर",
    nl:"Singapore",  pl:"Singapur",      no:"Singapore",    sv:"Singapore" },
];

// ── 🌿 NATURE ─────────────────────────────────────────────────────────────
const NATURE = [
  { name:"Amazon Rainforest",emoji:"🌿",color:"#1B5E20",img:u("amazon rainforest jungle"),
    fact:"The Amazon produces 20% of Earth's oxygen — it's called the 'Lungs of the Planet'!",
    es:"Amazonia",   fr:"Amazonie",      ar:"غابة الأمازون",de:"Amazonas-Regenwald",
    it:"Amazzonia",  pt:"Amazônia",      ru:"Амазонка",     zh:"亚马逊雨林",
    ja:"アマゾン熱帯雨林",ko:"아마존 열대우림",bn:"আমাজন রেইনফরেস্ট",hi:"अमेज़न वर्षावन",
    nl:"Amazoneregenwoud",pl:"Amazonia",  no:"Amazonas",     sv:"Amazonas" },
  { name:"Mount Everest",emoji:"🏔️",color:"#546E7A",img:u("mount everest himalaya"),
    fact:"Mount Everest grows about 4 mm taller every year due to geological uplift!",
    es:"Monte Everest",fr:"Mont Everest",ar:"جبل إيفرست",   de:"Mount Everest",
    it:"Monte Everest",pt:"Monte Everest",ru:"Эверест",      zh:"珠穆朗玛峰",
    ja:"エベレスト",ko:"에베레스트",    bn:"মাউন্ট এভারেস্ট",hi:"माउंट एवरेस्ट",
    nl:"Mount Everest",pl:"Mount Everest",no:"Mount Everest",sv:"Mount Everest" },
  { name:"Great Barrier Reef",emoji:"🐠",color:"#0097A7",img:u("great barrier reef coral"),
    fact:"The Great Barrier Reef is the largest living structure on Earth — visible from space!",
    es:"Gran Barrera de Coral",fr:"Grande Barrière de Corail",ar:"الحاجز المرجاني العظيم",de:"Great Barrier Reef",
    it:"Grande Barriera Corallina",pt:"Grande Barreira de Coral",ru:"Большой Барьерный риф",zh:"大堡礁",
    ja:"グレートバリアリーフ",ko:"그레이트 배리어 리프",bn:"গ্রেট ব্যারিয়ার রিফ",hi:"ग्रेट बैरियर रीफ",
    nl:"Groot Barrièrerif",pl:"Wielka Rafa Koralowa",no:"Great Barrier Reef",sv:"Great Barrier Reef" },
  { name:"Grand Canyon",emoji:"🏜️",color:"#BF360C",img:u("grand canyon arizona"),
    fact:"The Grand Canyon is up to 1,857 metres deep and was carved by the Colorado River over 5–6 million years!",
    es:"Gran Cañón",fr:"Grand Canyon",   ar:"الغراند كانيون",de:"Grand Canyon",
    it:"Grand Canyon",pt:"Grande Cânion",ru:"Гранд-Каньон",  zh:"大峡谷",
    ja:"グランドキャニオン",ko:"그랜드 캐니언",bn:"গ্র্যান্ড ক্যানিয়ন",hi:"ग्रैंड कैनियन",
    nl:"Grand Canyon",pl:"Wielki Kanion",no:"Grand Canyon",  sv:"Grand Canyon" },
  { name:"Sahara Desert",emoji:"🐪",color:"#F57F17",img:u("sahara desert sand dunes"),
    fact:"The Sahara is the largest hot desert in the world — almost as big as the USA!",
    es:"Desierto del Sáhara",fr:"Désert du Sahara",ar:"الصحراء الكبرى",de:"Sahara-Wüste",
    it:"Deserto del Sahara",pt:"Deserto do Saara",ru:"Сахара",zh:"撒哈拉沙漠",
    ja:"サハラ砂漠",ko:"사하라 사막",  bn:"সাহারা মরুভূমি",hi:"सहारा मरुस्थल",
    nl:"Sahara",     pl:"Sahara",         no:"Sahara",       sv:"Sahara" },
  { name:"Northern Lights",emoji:"🌌",color:"#006064",img:u("northern lights aurora borealis"),
    fact:"The Northern Lights are caused by solar particles colliding with Earth's atmosphere at 45,000 km/h!",
    es:"Aurora Boreal",fr:"Aurore Boréale",ar:"أضواء الشمال الشفق القطبي",de:"Nordlichter",
    it:"Aurora Boreale",pt:"Aurora Boreal",ru:"Северное сияние",zh:"北极光",
    ja:"オーロラ",   ko:"오로라",        bn:"উত্তর মেরু আলো",hi:"उत्तरी रोशनी",
    nl:"Noorderlicht",pl:"Zorza Polarna",  no:"Nordlyset",    sv:"Norrsken" },
  { name:"Victoria Falls",emoji:"💧",color:"#1565C0",img:u("victoria falls waterfall africa"),
    fact:"Victoria Falls is the world's largest waterfall by combined width and height!",
    es:"Cataratas Victoria",fr:"Chutes Victoria",ar:"شلالات فيكتوريا",de:"Viktoriafälle",
    it:"Cascate Vittoria",pt:"Cataratas Vitória",ru:"Водопад Виктория",zh:"维多利亚瀑布",
    ja:"ビクトリア滝",ko:"빅토리아 폭포",bn:"ভিক্টোরিয়া জলপ্রপাত",hi:"विक्टोरिया फॉल्स",
    nl:"Victoriawatervallen",pl:"Wodospady Wiktorii",no:"Victoriafallene",sv:"Victoriafallen" },
  { name:"Dead Sea",    emoji:"🌊", color:"#827717", img:u("dead sea israel floating"),
    fact:"The Dead Sea is so salty you can float effortlessly — it is 9.6× saltier than the ocean!",
    es:"Mar Muerto",fr:"Mer Morte",      ar:"البحر الميت",  de:"Totes Meer",
    it:"Mar Morto",  pt:"Mar Morto",      ru:"Мёртвое море", zh:"死海",
    ja:"死海",       ko:"사해",           bn:"মৃত সাগর",     hi:"मृत सागर",
    nl:"Dode Zee",   pl:"Morze Martwe",   no:"Dødehavet",    sv:"Döda havet" },
  { name:"Niagara Falls",emoji:"🌈",color:"#0277BD",img:u("niagara falls waterfall"),
    fact:"Niagara Falls moves about 3 cm upstream per year due to erosion!",
    es:"Cataratas del Niágara",fr:"Chutes du Niagara",ar:"شلالات نياجرا",de:"Niagarafälle",
    it:"Cascate del Niagara",pt:"Cataratas do Niágara",ru:"Ниагарский водопад",zh:"尼亚加拉瀑布",
    ja:"ナイアガラの滝",ko:"나이아가라 폭포",bn:"নায়াগ্রা ফলস",hi:"नियाग्रा जलप्रपात",
    nl:"Niagarawatervallen",pl:"Wodospad Niagara",no:"Niagarafallene",sv:"Niagarafallen" },
  { name:"Amazon River",emoji:"🌊",color:"#1B5E20",img:u("amazon river water aerial"),
    fact:"The Amazon River discharges 20% of all fresh water that flows into the world's oceans!",
    es:"Río Amazonas",fr:"Fleuve Amazone",ar:"نهر الأمازون",de:"Amazonas",
    it:"Rio delle Amazzoni",pt:"Rio Amazonas",ru:"Амазонка",zh:"亚马逊河",
    ja:"アマゾン川",ko:"아마존 강",      bn:"আমাজন নদী",    hi:"अमेज़न नदी",
    nl:"Amazone",    pl:"Amazonka",        no:"Amazonas",     sv:"Amazonfloden" },
  { name:"Kilimanjaro",emoji:"🏔️",color:"#5D4037",img:u("kilimanjaro mountain africa"),
    fact:"Kilimanjaro is the highest free-standing mountain in the world — and you can hike to the top!",
    es:"Kilimanjaro",fr:"Kilimandjaro",   ar:"كيليمنجارو",  de:"Kilimandscharo",
    it:"Kilimangiaro",pt:"Kilimanjaro",   ru:"Килиманджаро", zh:"乞力马扎罗山",
    ja:"キリマンジャロ",ko:"킬리만자로",  bn:"কিলিমাঞ্জারো", hi:"किलिमंजारो",
    nl:"Kilimanjaro",pl:"Kilimandżaro",   no:"Kilimanjaro",  sv:"Kilimanjaro" },
  { name:"Great Wall China",emoji:"🏯",color:"#827717",img:u("great wall china mountains"),
    fact:"The Great Wall of China is NOT visible from space with the naked eye — that's a myth!",
    es:"Gran Muralla China",fr:"Grande Muraille de Chine",ar:"سور الصين العظيم",de:"Chinesische Mauer",
    it:"Grande Muraglia Cinese",pt:"Grande Muralha da China",ru:"Великая Китайская стена",zh:"长城",
    ja:"万里の長城",ko:"만리장성",       bn:"চীনের মহাপ্রাচীর",hi:"चीन की महान दीवार",
    nl:"Chinese Muur",pl:"Wielki Mur Chiński",no:"Den kinesiske mur",sv:"Kinesiska muren" },
  { name:"Galápagos Islands",emoji:"🦎",color:"#00695C",img:u("galapagos islands wildlife"),
    fact:"Darwin's visit to the Galápagos Islands in 1835 inspired his theory of evolution!",
    es:"Islas Galápagos",fr:"Îles Galápagos",ar:"جزر غالاباغوس",de:"Galapagosinseln",
    it:"Isole Galapagos",pt:"Ilhas Galápagos",ru:"Галапагосские острова",zh:"加拉帕戈斯群岛",
    ja:"ガラパゴス諸島",ko:"갈라파고스 제도",bn:"গ্যালাপাগোস দ্বীপপুঞ্জ",hi:"गैलापागोस द्वीप",
    nl:"Galapagoseilanden",pl:"Wyspy Galapagos",no:"Galápagosøyene",sv:"Galápagosöarna" },
  { name:"Patagonia",   emoji:"🌄", color:"#37474F", img:u("patagonia argentina mountains"),
    fact:"Patagonia contains some of the largest ice fields outside of the polar regions!",
    es:"Patagonia",  fr:"Patagonie",      ar:"باتاغونيا",    de:"Patagonien",
    it:"Patagonia",  pt:"Patagônia",      ru:"Патагония",    zh:"巴塔哥尼亚",
    ja:"パタゴニア", ko:"파타고니아",     bn:"প্যাটাগোনিয়া", hi:"पेटागोनिया",
    nl:"Patagonië",  pl:"Patagonia",      no:"Patagonia",    sv:"Patagonien" },
  { name:"Bora Bora",   emoji:"🏝️", color:"#0097A7", img:u("bora bora lagoon island"),
    fact:"Bora Bora's lagoon is so clear you can see the bottom at 20 metres depth!",
    es:"Bora Bora",  fr:"Bora Bora",      ar:"بورا بورا",    de:"Bora Bora",
    it:"Bora Bora",  pt:"Bora Bora",      ru:"Бора-Бора",    zh:"波拉波拉岛",
    ja:"ボラボラ島", ko:"보라보라",       bn:"বোরা বোরা",    hi:"बोरा बोरा",
    nl:"Bora Bora",  pl:"Bora Bora",      no:"Bora Bora",    sv:"Bora Bora" },
  { name:"Serengeti",   emoji:"🦁", color:"#F57F17", img:u("serengeti migration safari"),
    fact:"The Serengeti hosts the largest animal migration on Earth — 1.5 million wildebeest!",
    es:"Serengueti",fr:"Serengeti",       ar:"سيرينغيتي",    de:"Serengeti",
    it:"Serengeti",  pt:"Serengeti",      ru:"Серенгети",    zh:"塞伦盖蒂",
    ja:"セレンゲティ",ko:"세렝게티",      bn:"সেরেঙ্গেটি",   hi:"सेरेंगेटी",
    nl:"Serengeti",  pl:"Serengeti",      no:"Serengeti",    sv:"Serengeti" },
  { name:"Antarctica",  emoji:"🐧", color:"#B0BEC5", img:u("antarctica ice landscape"),
    fact:"Antarctica holds 70% of the world's fresh water locked in ice!",
    es:"Antártida",  fr:"Antarctique",    ar:"القارة القطبية الجنوبية",de:"Antarktis",
    it:"Antartide",  pt:"Antártica",      ru:"Антарктида",   zh:"南极洲",
    ja:"南極",       ko:"남극",           bn:"অ্যান্টার্কটিকা",hi:"अंटार्कटिका",
    nl:"Antarctica", pl:"Antarktyda",     no:"Antarktis",    sv:"Antarktis" },
  { name:"Maldives",    emoji:"🐠", color:"#00838F", img:u("maldives turquoise ocean"),
    fact:"The Maldives is the lowest-lying country in the world — average ground level is just 1.5 m!",
    es:"Maldivas",   fr:"Maldives",       ar:"المالديف",     de:"Malediven",
    it:"Maldive",    pt:"Maldivas",       ru:"Мальдивы",     zh:"马尔代夫",
    ja:"モルディブ", ko:"몰디브",         bn:"মালদ্বীপ",     hi:"मालदीव",
    nl:"Malediven",  pl:"Malediwy",       no:"Maldivene",    sv:"Maldiverna" },
  { name:"Yellowstone", emoji:"🌋", color:"#D84315", img:u("yellowstone geyser national park"),
    fact:"Yellowstone sits on a supervolcano that holds enough lava to fill the Grand Canyon 11 times!",
    es:"Yellowstone",fr:"Yellowstone",    ar:"يلوستون",      de:"Yellowstone",
    it:"Yellowstone",pt:"Yellowstone",    ru:"Йеллоустон",   zh:"黄石公园",
    ja:"イエローストーン",ko:"옐로스톤",  bn:"ইয়েলোস্টোন",  hi:"येलोस्टोन",
    nl:"Yellowstone",pl:"Yellowstone",    no:"Yellowstone",  sv:"Yellowstone" },
  { name:"Fjords of Norway",emoji:"🏔️",color:"#0D47A1",img:u("norway fjord landscape"),
    fact:"Norway's fjords were carved by glaciers over millions of years — some are over 1,300 m deep!",
    es:"Fiordos de Noruega",fr:"Fjords de Norvège",ar:"فيوردات النرويج",de:"Norwegische Fjorde",
    it:"Fiordi della Norvegia",pt:"Fiordes da Noruega",ru:"Норвежские фьорды",zh:"挪威峡湾",
    ja:"ノルウェーのフィヨルド",ko:"노르웨이 피요르드",bn:"নরওয়ের ফিওর্ড",hi:"नॉर्वे के फ़ॉर्ड",
    nl:"Noorwegen fjorden",pl:"Fiordy Norwegii",no:"Norske fjorder",sv:"Norska fjordar" },
];

// ── 🏛️ MONUMENTS ─────────────────────────────────────────────────────────
const MONUMENTS = [
  { name:"Eiffel Tower",       emoji:"🗼", color:"#C0A060", img:u("eiffel tower paris night"),
    fact:"The Eiffel Tower was only meant to stand for 20 years — it was saved because it doubled as a radio antenna!",
    es:"Torre Eiffel",         fr:"Tour Eiffel",          ar:"برج إيفل",              de:"Eiffelturm",
    it:"Torre Eiffel",         pt:"Torre Eiffel",          ru:"Эйфелева башня",        zh:"埃菲尔铁塔",
    ja:"エッフェル塔",          ko:"에펠탑",                bn:"আইফেল টাওয়ার",          hi:"एफिल टॉवर",
    nl:"Eiffeltoren",           pl:"Wieża Eiffla",          no:"Eiffeltårnet",          sv:"Eiffeltornet" },

  { name:"Great Wall of China", emoji:"🏯", color:"#8D6E63", img:u("great wall china sunrise"),
    fact:"The Great Wall took over 1,000 years to build and was completed by millions of workers — including soldiers and peasants!",
    es:"Gran Muralla China",   fr:"Grande Muraille",       ar:"سور الصين العظيم",      de:"Chinesische Mauer",
    it:"Grande Muraglia",      pt:"Grande Muralha",        ru:"Великая стена",         zh:"长城",
    ja:"万里の長城",            ko:"만리장성",              bn:"চীনের মহাপ্রাচীর",      hi:"चीन की महान दीवार",
    nl:"Chinese Muur",          pl:"Wielki Mur",            no:"Kinesiske mur",         sv:"Kinesiska muren" },

  { name:"Pyramids of Giza",   emoji:"🔺", color:"#F9A825", img:u("pyramids of giza egypt"),
    fact:"The Great Pyramid of Giza was the tallest man-made structure in the world for 3,800 years!",
    es:"Pirámides de Guiza",   fr:"Pyramides de Gizeh",   ar:"أهرامات الجيزة",        de:"Pyramiden von Gizeh",
    it:"Piramidi di Giza",     pt:"Pirâmides de Gizé",    ru:"Пирамиды Гизы",         zh:"吉萨金字塔",
    ja:"ギザのピラミッド",      ko:"기자의 피라미드",       bn:"গিজার পিরামিড",          hi:"गीज़ा के पिरामिड",
    nl:"Piramides van Gizeh",   pl:"Piramidy w Gizie",     no:"Pyramidene ved Giza",   sv:"Pyramiderna i Giza" },

  { name:"Colosseum",          emoji:"🏛️", color:"#8D3A00", img:u("colosseum rome italy"),
    fact:"The Colosseum could hold up to 80,000 spectators and had a retractable roof made of canvas!",
    es:"Coliseo",              fr:"Colisée",               ar:"الكولوسيوم",            de:"Kolosseum",
    it:"Colosseo",             pt:"Coliseu",               ru:"Колизей",               zh:"罗马竞技场",
    ja:"コロッセオ",            ko:"콜로세움",              bn:"কলোসিয়াম",              hi:"कोलोसियम",
    nl:"Colosseum",             pl:"Koloseum",              no:"Colosseum",             sv:"Colosseum" },

  { name:"Taj Mahal",          emoji:"🕌", color:"#F3E5AB", img:u("taj mahal india agra"),
    fact:"The Taj Mahal was built by Emperor Shah Jahan as a tribute to his late wife — it took 22 years and 20,000 workers!",
    es:"Taj Mahal",            fr:"Taj Mahal",             ar:"تاج محل",               de:"Taj Mahal",
    it:"Taj Mahal",            pt:"Taj Mahal",             ru:"Тадж-Махал",            zh:"泰姬陵",
    ja:"タージ・マハル",        ko:"타지마할",              bn:"তাজমহল",                hi:"ताजमहल",
    nl:"Taj Mahal",             pl:"Tadż Mahal",            no:"Taj Mahal",             sv:"Taj Mahal" },

  { name:"Machu Picchu",       emoji:"🦙", color:"#33691E", img:u("machu picchu peru inca"),
    fact:"Machu Picchu was built without wheels, iron tools, or mortar — yet no blade of grass fits between the stones!",
    es:"Machu Picchu",         fr:"Machu Picchu",          ar:"ماتشو بيتشو",           de:"Machu Picchu",
    it:"Machu Picchu",         pt:"Machu Picchu",          ru:"Мачу-Пикчу",            zh:"马丘比丘",
    ja:"マチュ・ピチュ",        ko:"마추픽추",              bn:"মাচু পিচু",              hi:"माचू पिच्चू",
    nl:"Machu Picchu",          pl:"Machu Picchu",          no:"Machu Picchu",          sv:"Machu Picchu" },

  { name:"Statue of Liberty",  emoji:"🗽", color:"#00695C", img:u("statue of liberty new york"),
    fact:"The Statue of Liberty was a gift from France to the USA in 1886 — and her torch was originally meant to be a lighthouse!",
    es:"Estatua de la Libertad",fr:"Statue de la Liberté", ar:"تمثال الحرية",          de:"Freiheitsstatue",
    it:"Statua della Libertà", pt:"Estátua da Liberdade",  ru:"Статуя Свободы",        zh:"自由女神像",
    ja:"自由の女神",            ko:"자유의 여신상",          bn:"স্ট্যাচু অব লিবার্টি",  hi:"स्वतंत्रता की मूर्ति",
    nl:"Vrijheidsbeeld",        pl:"Statua Wolności",       no:"Frihetsgudinnen",       sv:"Frihetsgudinnan" },

  { name:"Big Ben",            emoji:"🕐", color:"#1A237E", img:u("big ben london westminster"),
    fact:"'Big Ben' is actually the nickname of the bell inside the tower — the tower itself is called Elizabeth Tower!",
    es:"Big Ben",              fr:"Big Ben",               ar:"بيغ بن",                de:"Big Ben",
    it:"Big Ben",              pt:"Big Ben",               ru:"Биг-Бен",               zh:"大本钟",
    ja:"ビッグベン",            ko:"빅벤",                  bn:"বিগ বেন",               hi:"बिग बेन",
    nl:"Big Ben",               pl:"Big Ben",               no:"Big Ben",               sv:"Big Ben" },

  { name:"Sagrada Família",    emoji:"⛪", color:"#B71C1C", img:u("sagrada familia barcelona gaudi"),
    fact:"The Sagrada Família has been under construction since 1882 and is still not finished — it's the slowest construction project ever!",
    es:"Sagrada Família",      fr:"Sagrada Família",       ar:"الساغرادا فاميليا",     de:"Sagrada Família",
    it:"Sagrada Família",      pt:"Sagrada Família",       ru:"Саграда Фамилия",       zh:"圣家堂",
    ja:"サグラダ・ファミリア",  ko:"사그라다 파밀리아",     bn:"সাগ্রাদা ফামিলিয়া",    hi:"सागरादा फ़ैमिलिया",
    nl:"Sagrada Família",       pl:"Sagrada Família",       no:"Sagrada Família",       sv:"Sagrada Família" },

  { name:"Stonehenge",         emoji:"🗿", color:"#78909C", img:u("stonehenge england uk"),
    fact:"Stonehenge was built over 5,000 years ago — but we still don't fully understand how or exactly why!",
    es:"Stonehenge",           fr:"Stonehenge",            ar:"ستونهنج",               de:"Stonehenge",
    it:"Stonehenge",           pt:"Stonehenge",            ru:"Стоунхендж",            zh:"巨石阵",
    ja:"ストーンヘンジ",        ko:"스톤헨지",              bn:"স্টোনহেঞ্জ",             hi:"स्टोनहेंज",
    nl:"Stonehenge",            pl:"Stonehenge",            no:"Stonehenge",            sv:"Stonehenge" },

  { name:"Acropolis",          emoji:"🏛️", color:"#F9A825", img:u("acropolis athens parthenon"),
    fact:"The Parthenon on the Acropolis has stood for 2,500 years and was built without the use of mortar!",
    es:"Acrópolis",            fr:"Acropole",              ar:"الأكروبول",             de:"Akropolis",
    it:"Acropoli",             pt:"Acrópole",              ru:"Акрополь",              zh:"雅典卫城",
    ja:"アクロポリス",          ko:"아크로폴리스",          bn:"অ্যাক্রোপোলিস",          hi:"एक्रोपोलिस",
    nl:"Acropolis",             pl:"Akropol",               no:"Akropolis",             sv:"Akropolis" },

  { name:"Angkor Wat",         emoji:"🛕", color:"#5D4037", img:u("angkor wat cambodia temple"),
    fact:"Angkor Wat is the largest religious monument in the world — covering 162.6 hectares!",
    es:"Angkor Wat",           fr:"Angkor Vat",            ar:"أنكور وات",             de:"Angkor Wat",
    it:"Angkor Wat",           pt:"Angkor Wat",            ru:"Ангкор-Ват",            zh:"吴哥窟",
    ja:"アンコールワット",      ko:"앙코르 와트",           bn:"আংকোর ওয়াট",           hi:"अंगकोर वाट",
    nl:"Angkor Wat",            pl:"Angkor Wat",            no:"Angkor Wat",            sv:"Angkor Wat" },

  { name:"Chichen Itza",       emoji:"🔺", color:"#827717", img:u("chichen itza mexico mayan"),
    fact:"The pyramid of Chichen Itza casts a shadow of a serpent slithering down the steps during the spring equinox!",
    es:"Chichén Itzá",         fr:"Chichen Itza",          ar:"تشيتشن إيتزا",          de:"Chichen Itza",
    it:"Chichen Itza",         pt:"Chichén Itzá",          ru:"Чичен-Ица",             zh:"奇琴伊察",
    ja:"チチェン・イッツァ",    ko:"치첸이트사",            bn:"চিচেন ইতজা",             hi:"चिचेन इत्ज़ा",
    nl:"Chichen Itza",          pl:"Chichen Itza",          no:"Chichen Itza",          sv:"Chichen Itza" },

  { name:"Alhambra",           emoji:"🌙", color:"#880E4F", img:u("alhambra granada spain palace"),
    fact:"The Alhambra's intricate geometric patterns contain no depictions of living beings — it was forbidden in Islamic art!",
    es:"La Alhambra",          fr:"Alhambra",              ar:"الحمراء",               de:"Alhambra",
    it:"Alhambra",             pt:"Alhambra",              ru:"Альгамбра",             zh:"阿尔罕布拉宫",
    ja:"アルハンブラ宮殿",     ko:"알함브라",              bn:"আলহামব্রা",              hi:"अलहम्ब्रा",
    nl:"Alhambra",              pl:"Alhambra",              no:"Alhambra",              sv:"Alhambra" },

  { name:"Christ the Redeemer",emoji:"✝️", color:"#1B5E20", img:u("christ redeemer rio brazil"),
    fact:"The Christ the Redeemer statue was named one of the New Seven Wonders of the World in 2007!",
    es:"Cristo Redentor",      fr:"Christ Rédempteur",     ar:"تمثال المسيح الفادي",   de:"Christus der Erlöser",
    it:"Cristo Redentore",     pt:"Cristo Redentor",       ru:"Христос Искупитель",    zh:"救世基督像",
    ja:"コルコバードのキリスト像",ko:"예수상",              bn:"ক্রাইস্ট দ্য রিডিমার",  hi:"क्राइस्ट द रिडीमर",
    nl:"Christus de Verlosser", pl:"Chrystus Odkupiciel",  no:"Kristus Forløseren",    sv:"Kristus Återlösaren" },

  { name:"Sydney Opera House",  emoji:"🎭", color:"#0277BD", img:u("sydney opera house australia"),
    fact:"The Sydney Opera House has 1,056,006 roof tiles — each one handmade in Sweden!",
    es:"Ópera de Sídney",      fr:"Opéra de Sydney",       ar:"دار أوبرا سيدني",       de:"Opernhaus Sydney",
    it:"Opera House di Sydney", pt:"Ópera de Sydney",      ru:"Оперный театр Сиднея",  zh:"悉尼歌剧院",
    ja:"シドニーオペラハウス",  ko:"시드니 오페라 하우스",  bn:"সিডনি অপেরা হাউস",      hi:"सिडनी ओपेरा हाउस",
    nl:"Sydney Opera House",    pl:"Opera w Sydney",        no:"Sydney Opera House",    sv:"Sydneys operahus" },

  { name:"Burj Khalifa",       emoji:"🌆", color:"#00838F", img:u("burj khalifa dubai skyscraper"),
    fact:"The Burj Khalifa is so tall you can watch the sunset from the top floor, then take an elevator down and watch it again!",
    es:"Burj Khalifa",         fr:"Burj Khalifa",          ar:"برج خليفة",             de:"Burj Khalifa",
    it:"Burj Khalifa",         pt:"Burj Khalifa",          ru:"Бурдж-Халифа",          zh:"哈利法塔",
    ja:"ブルジュ・ハリファ",    ko:"부르즈 할리파",         bn:"বুর্জ খলিফা",            hi:"बुर्ज खलीफा",
    nl:"Burj Khalifa",          pl:"Burj Chalifa",          no:"Burj Khalifa",          sv:"Burj Khalifa" },

  { name:"Hagia Sophia",       emoji:"🕌", color:"#4A148C", img:u("hagia sophia istanbul mosque"),
    fact:"Hagia Sophia has served as a cathedral, a mosque, and a museum — and is now a mosque again!",
    es:"Santa Sofía",          fr:"Sainte-Sophie",         ar:"آيا صوفيا",             de:"Hagia Sophia",
    it:"Santa Sofia",          pt:"Santa Sofia",           ru:"Айя-София",             zh:"圣索菲亚大教堂",
    ja:"ハギア・ソフィア",      ko:"아야 소피아",           bn:"হাগিয়া সোফিয়া",         hi:"हागिया सोफिया",
    nl:"Hagia Sophia",          pl:"Hagia Sophia",          no:"Hagia Sophia",          sv:"Hagia Sofia" },

  { name:"Petra",              emoji:"🏺", color:"#C62828", img:u("petra jordan treasury carved"),
    fact:"Petra, the 'Rose City,' was carved directly into pink sandstone cliffs — and was lost to the Western world for 500 years!",
    es:"Petra",                fr:"Pétra",                 ar:"البتراء",               de:"Petra",
    it:"Petra",                pt:"Petra",                 ru:"Петра",                 zh:"佩特拉",
    ja:"ペトラ",                ko:"페트라",                bn:"পেট্রা",                 hi:"पेट्रा",
    nl:"Petra",                 pl:"Petra",                 no:"Petra",                 sv:"Petra" },

  { name:"Neuschwanstein",     emoji:"🏰", color:"#1565C0", img:u("neuschwanstein castle germany"),
    fact:"Neuschwanstein Castle inspired the Disney fairy-tale castles — it was built by a 19th-century 'fairy tale king'!",
    es:"Castillo de Neuschwanstein",fr:"Château de Neuschwanstein",ar:"قلعة نويشفانشتاين",de:"Schloss Neuschwanstein",
    it:"Castello di Neuschwanstein",pt:"Castelo de Neuschwanstein",ru:"Нойшванштайн",  zh:"新天鹅城堡",
    ja:"ノイシュヴァンシュタイン城",ko:"노이슈반슈타인 성",  bn:"নিউশোয়ানস্টাইন দুর্গ",  hi:"न्यूशवांस्टीन कैसल",
    nl:"Kasteel Neuschwanstein", pl:"Zamek Neuschwanstein", no:"Neuschwanstein slott",  sv:"Neuschwanstein slott" },
];

// ── Mapa de categorías ────────────────────────────────────────────────────
const PREMIUM_CATS = new Set(["cities", "nature", "monuments"]);

const CATEGORIES = [
  { id:"animals",   label:"Animals",   emoji:"🦁", color:C.green,  icon:Cat,       items:ANIMALS,   premium:false },
  { id:"cities",    label:"Cities",    emoji:"🏙️", color:C.blue,   icon:Building2, items:CITIES,    premium:true  },
  { id:"nature",    label:"Nature",    emoji:"🌿", color:"#2E7D32",icon:Leaf,       items:NATURE,    premium:true  },
  { id:"monuments", label:"Monuments", emoji:"🏛️", color:"#6D4C41",icon:Landmark,   items:MONUMENTS, premium:true  },
];

// ════════════════════════════════════════════════════════════════════════════
// UI COMPONENTS
// ════════════════════════════════════════════════════════════════════════════

// ── Puzzle helpers ────────────────────────────────────────────────────────
function buildPuzzle(size) {
  const n = size * size;
  let t;
  do {
    t = Array.from({ length: n }, (_, i) => i);
    for (let i = n - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [t[i], t[j]] = [t[j], t[i]];
    }
  } while (t.every((v, idx) => v === idx)); // nunca devuelve ya-resuelto
  return t;
}
const isSolved = t => t.every((v, i) => v === i);

// ── TTS ───────────────────────────────────────────────────────────────────
function speak(text, voice = "en-US") {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = voice; u.rate = 0.85; u.pitch = 1.1;
  window.speechSynthesis.speak(u);
}

// ── Confetti ──────────────────────────────────────────────────────────────
function Confetti({ active }) {
  const ps = Array.from({ length: 24 }, (_, i) => ({
    id: i, x: Math.random() * 100,
    color: [C.blue, C.red, C.yellow, C.green, C.magenta, C.cyan][i % 6],
    delay: Math.random() * 0.5, size: Math.random() * 10 + 7,
  }));
  if (!active) return null;
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {ps.map(p => (
        <motion.div key={p.id} className="absolute rounded-sm top-0"
          style={{ left:`${p.x}%`, width:p.size, height:p.size, background:p.color }}
          initial={{ y:-20, opacity:1, rotate:0 }}
          animate={{ y:"110vh", opacity:0, rotate:720 }}
          transition={{ duration:1.5+Math.random(), delay:p.delay, ease:"easeIn" }}
        />
      ))}
    </div>
  );
}

// ── Miniatura ─────────────────────────────────────────────────────────────
function Thumb({ item, size = 28, FallbackIcon = Loader }) {
  const [ok, setOk] = useState(false);
  return (
    <div style={{
      width:size, height:size, borderRadius:"50%", overflow:"hidden", flexShrink:0,
      background:(item.color||"#ccc")+"33",
      border:"1.5px solid rgba(0,0,0,0.1)",
      display:"flex", alignItems:"center", justifyContent:"center",
    }}>
      {!ok && <FallbackIcon size={Math.round(size*0.52)} strokeWidth={2} style={{ color:item.color||"#94A3B8" }}/>}
      <img src={item.img} alt={item.name} onLoad={()=>setOk(true)}
        style={{ width:"100%", height:"100%", objectFit:"cover", display:ok?"block":"none" }}
        loading="lazy"
      />
    </div>
  );
}

// ── Dropdown genérico ─────────────────────────────────────────────────────
function DD({ trigger, minW=160, maxH=300, accent=C.green, children }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <div ref={ref} style={{ position:"relative", zIndex:40 }}>
      <motion.button
        whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}
        onClick={() => setOpen(o=>!o)}
        style={{
          display:"flex", alignItems:"center", gap:7,
          padding:"9px 14px", borderRadius:999,
          border:"2.5px solid white",
          background:"rgba(255,255,255,0.93)",
          backdropFilter:"blur(8px)",
          boxShadow:`0 4px 14px ${accent}26`,
          cursor:"pointer",
          fontFamily:"var(--font-display,'Nunito',sans-serif)",
          fontWeight:700, fontSize:13, color:accent,
          whiteSpace:"nowrap", minWidth:minW,
          justifyContent:"space-between",
        }}
      >
        {trigger}
        <motion.span animate={{ rotate:open?180:0 }} transition={{ duration:0.18 }}
          style={{ display:"flex", marginLeft:2 }}>
          <ChevronDown size={12}/>
        </motion.span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity:0, y:-6, scale:0.97 }}
            animate={{ opacity:1, y:0, scale:1 }}
            exit={{ opacity:0, y:-6, scale:0.97 }}
            transition={{ duration:0.14 }}
            style={{
              position:"absolute", top:"calc(100% + 6px)", left:0,
              minWidth:Math.max(minW, 210),
              background:"white", borderRadius:16,
              border:`2px solid ${accent}1A`,
              boxShadow:`0 14px 42px ${accent}30`,
              overflow:"hidden", maxHeight:maxH, overflowY:"auto",
              scrollbarWidth:"thin",
            }}
          >
            {children(() => setOpen(false))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Fila de dropdown ──────────────────────────────────────────────────────
function DRow({ active, accent=C.green, onClick, children }) {
  return (
    <button onClick={onClick}
      style={{
        display:"flex", alignItems:"center", gap:9,
        width:"100%", padding:"7px 12px", border:"none",
        background:active?accent+"18":"transparent",
        cursor:"pointer",
        fontFamily:"var(--font-body,'Nunito',sans-serif)",
        fontWeight:active?700:500, fontSize:13,
        color:active?accent:"#374151", textAlign:"left",
        borderLeft:active?`3px solid ${accent}`:"3px solid transparent",
        transition:"background 0.12s",
      }}
      onMouseEnter={e=>{ if(!active) e.currentTarget.style.background="#F9FAF9"; }}
      onMouseLeave={e=>{ if(!active) e.currentTarget.style.background="transparent"; }}
    >
      {children}
      {active && <span style={{ width:5, height:5, borderRadius:"50%", background:accent, marginLeft:"auto", flexShrink:0 }}/>}
    </button>
  );
}

function DHeader({ children }) {
  return (
    <div style={{
      padding:"7px 12px 4px",
      borderBottom:"1.5px solid #F0FFF4",
      fontFamily:"var(--font-display,'Nunito',sans-serif)",
      fontWeight:700, fontSize:9, color:"#9CA3AF",
      letterSpacing:"0.08em", textTransform:"uppercase",
    }}>{children}</div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ════════════════════════════════════════════════════════════════════════════
export default function PuzzleMaster({ lang:propLang, onLangChange }) {
  // ── Estados ───────────────────────────────────────────────────────────
  const [catId,          setCatId]          = useState("animals");
  const [showPricing,    setShowPricing]    = useState(false);
  const [lockedCatLabel, setLockedCatLabel] = useState(null);
  const [itemIdx,        setItemIdx]        = useState(0);
  const [gridSize,       setGridSize]       = useState(3);
  const [tiles,          setTiles]          = useState(() => buildPuzzle(3));
  const [selected,       setSelected]       = useState(null);
  const [dragOver,       setDragOver]       = useState(null);
  const [won,            setWon]            = useState(false);
  const [confetti,       setConfetti]       = useState(false);
  const [localLang,      setLocalLang]      = useState("es");
  const [moves,          setMoves]          = useState(0);
  const [imgLoaded,      setImgLoaded]      = useState(false);

  const lang    = propLang || localLang;
  const setLang = v => { setLocalLang(v); onLangChange?.(v); };

  const cat      = CATEGORIES.find(c => c.id === catId) || CATEGORIES[0];
  const item     = cat.items[itemIdx] || cat.items[0];
  const langMeta = LANGUAGES.find(l => l.code === lang) || LANGUAGES[0];
  const diff     = DIFFICULTIES.find(d => d.size === gridSize) || DIFFICULTIES[0];
  const GRID_PX  = gridSize <= 4 ? 300 : 360;
  const teaserLangs = LANGUAGES.filter(l => l.code !== lang && l.code !== "en").slice(0, 3);

  // ── Shuffle / reset ───────────────────────────────────────────────────
  const reset = useCallback((gSize = gridSize) => {
    setTiles(buildPuzzle(gSize));
    setSelected(null); setDragOver(null);
    setWon(false); setMoves(0); setImgLoaded(false);
  }, [gridSize]);

  useEffect(() => { reset(gridSize); }, [itemIdx, catId, gridSize]);

  // ── Tile swap logic ───────────────────────────────────────────────────
  const handleTile = idx => {
    if (won) return;
    if (selected === null) { setSelected(idx); return; }
    const next = [...tiles];
    [next[selected], next[idx]] = [next[idx], next[selected]];
    setTiles(next); setMoves(m => m + 1);
    setSelected(null); setDragOver(null);
    if (isSolved(next)) {
      setTimeout(() => {
        setWon(true); setConfetti(true);
        setTimeout(() => setConfetti(false), 2500);
      }, 200);
    }
  };

  // ── Category / item switching (with premium gate) ─────────────────────
  const switchCat = (id, close) => {
    if (PREMIUM_CATS.has(id)) {
      const found = CATEGORIES.find(c => c.id === id);
      setLockedCatLabel(found?.label ?? id);
      setShowPricing(true);
      close();
      return;
    }
    setCatId(id); setItemIdx(0); setImgLoaded(false); close();
  };
  const switchItem = (idx, close) => {
    setItemIdx(idx); setImgLoaded(false); close();
  };

  const accent = cat.color;

  // ── RENDER ────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen kiddsy-bg-drift" style={{
      background: "linear-gradient(135deg, #E8F5E9 0%, #F1F8E9 25%, #FFFDE7 50%, #E8F5E9 75%, #E0F2F1 100%)",
    }}>
      <Confetti active={confetti}/>

      {/* Pricing modal — se monta cuando el usuario toca una categoría premium */}
      {showPricing && (
        <Pricing
          onClose={() => { setShowPricing(false); setLockedCatLabel(null); }}
          lockedCategory={lockedCatLabel}
        />
      )}

      {/* ── Header ────────────────────────────────────────────────────── */}
      <div className="text-center pt-8 pb-3 px-4">
        <motion.div initial={{ scale:0.8, opacity:0 }} animate={{ scale:1, opacity:1 }}
          transition={{ type:"spring" }}
          className="mb-2 inline-flex items-center justify-center w-16 h-16 rounded-2xl"
          style={{ background:"#E8F5E9" }}
        >
          <Puzzle size={36} strokeWidth={2} style={{ color:accent }}/>
        </motion.div>
        <motion.h1 initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }}
          className="mb-1" style={{ lineHeight:1 }}>
          <CartoonTitle fill={accent} stroke={`${accent}44`} size={40}>
            Puzzle Master
          </CartoonTitle>
        </motion.h1>
        <p className="font-body text-slate-400 text-sm">
          Tap two tiles to swap — complete the picture!
        </p>
      </div>

      {/* ── Controls bar ──────────────────────────────────────────────── */}
      <div style={{ display:"flex", flexWrap:"wrap", justifyContent:"center", gap:8, padding:"0 12px 14px" }}>

        {/* A: Categoría */}
        <DD minW={150} maxH={280} accent={accent}
          trigger={(() => {
            const CatIcon = cat.icon;
            return <><CatIcon size={15} strokeWidth={2}/><span>{cat.label}</span></>;
          })()}
        >
          {close => [
            <DHeader key="hdr">Category</DHeader>,
            ...CATEGORIES.map(c => (
              <DRow key={c.id} active={catId === c.id} accent={c.color}
                onClick={() => switchCat(c.id, close)}>
                {(() => { const CIcon = c.icon; return (
                  <CIcon size={16} strokeWidth={2}
                    style={{ flexShrink:0, color: catId===c.id ? c.color : "#64748B" }}/>
                ); })()}
                <span style={{ fontWeight:700 }}>{c.label}</span>
                {c.premium
                  ? <Lock size={12} strokeWidth={2.5} style={{ marginLeft:"auto", color:"#94A3B8" }}/>
                  : <span style={{ fontSize:10, color:"#94A3B8", marginLeft:"auto" }}>{c.items.length}</span>
                }
              </DRow>
            )),
          ]}
        </DD>

        {/* B: Ítem */}
        <DD minW={190} maxH={360} accent={accent}
          trigger={(() => {
            const CatIcon = cat.icon;
            return (
              <>
                <Thumb item={item} size={24} FallbackIcon={CatIcon}/>
                <span style={{ maxWidth:120, overflow:"hidden", textOverflow:"ellipsis" }}>
                  {item[lang] || item.name}
                </span>
              </>
            );
          })()}
        >
          {close => [
            <DHeader key="hdr">{cat.label} ({cat.items.length})</DHeader>,
            ...cat.items.map((it, i) => (
              <DRow key={i} active={itemIdx === i} accent={accent}
                onClick={() => switchItem(i, close)}>
                <Thumb item={it} size={28} FallbackIcon={cat.icon}/>
                <div style={{ lineHeight:1.3, minWidth:0 }}>
                  <div style={{ fontWeight:700, fontSize:13, whiteSpace:"nowrap" }}>
                    {it[lang] || it.name}
                  </div>
                  {it[lang] && it[lang] !== it.name && (
                    <div style={{ fontSize:10, color:"#94A3B8" }}>{it.name}</div>
                  )}
                </div>
              </DRow>
            )),
          ]}
        </DD>

        {/* C: Dificultad */}
        <DD minW={140} accent={C.red}
          trigger={<><Grid size={13} strokeWidth={2}/><span>{diff.label}</span><StarRow count={diff.starCount} size={10}/></>}
        >
          {close => [
            <DHeader key="hdr">Difficulty</DHeader>,
            ...DIFFICULTIES.map(d => (
              <DRow key={d.size} active={gridSize === d.size} accent={C.red}
                onClick={() => { setGridSize(d.size); close(); }}>
                <span style={{ fontWeight:800, minWidth:36, fontSize:14 }}>{d.label}</span>
                <StarRow count={d.starCount} size={10} color={gridSize === d.size ? "#E53935" : "#F9A825"}/>
                <span style={{ fontSize:11, color:"#94A3B8" }}>{d.desc}</span>
              </DRow>
            )),
          ]}
        </DD>

        {/* D: Idioma */}
        <DD minW={150} accent={C.blue}
          trigger={<><Globe size={13}/><span style={{ fontSize:15 }}>{langMeta.flag}</span><span>{langMeta.label}</span></>}
        >
          {close => [
            <DHeader key="hdr">Language</DHeader>,
            ...LANGUAGES.map(l => (
              <DRow key={l.code} active={lang === l.code} accent={C.blue}
                onClick={() => { setLang(l.code); close(); }}>
                <span style={{ fontSize:16, flexShrink:0 }}>{l.flag}</span>
                <span>{l.label}</span>
              </DRow>
            )),
          ]}
        </DD>

        {/* E: Shuffle */}
        <motion.button whileHover={{ scale:1.04 }} whileTap={{ scale:0.96 }}
          onClick={() => reset()}
          style={{
            display:"flex", alignItems:"center", gap:5,
            padding:"9px 16px", borderRadius:999,
            border:"2.5px solid white", background:C.red, color:"white",
            fontFamily:"var(--font-display,'Nunito',sans-serif)",
            fontWeight:700, fontSize:13, cursor:"pointer",
            boxShadow:"0 4px 14px rgba(229,57,53,0.3)", whiteSpace:"nowrap",
          }}
        >
          <RotateCcw size={13}/> Shuffle
        </motion.button>
      </div>

      {/* ── Body ──────────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-3 pb-20">
        <div className="grid lg:grid-cols-2 gap-5 items-start">

          {/* ── LEFT: Puzzle grid ────────────────────────────────────── */}
          <div className="flex flex-col items-center">

            {/* Stats chips */}
            <div style={{ display:"flex", gap:8, marginBottom:10, flexWrap:"wrap", justifyContent:"center" }}>
              <div style={{
                display:"flex", alignItems:"center", gap:5,
                padding:"5px 13px", borderRadius:999, background:"white",
                boxShadow:"0 2px 8px rgba(0,0,0,0.07)",
                fontFamily:"var(--font-display,'Nunito',sans-serif)",
                fontWeight:700, fontSize:12, color:accent,
              }}>
                <Target size={12} strokeWidth={2}/> {moves} swaps
              </div>
              <div style={{
                display:"flex", alignItems:"center", gap:5,
                padding:"5px 13px", borderRadius:999, background:"white",
                boxShadow:"0 2px 8px rgba(0,0,0,0.07)",
                fontFamily:"var(--font-display,'Nunito',sans-serif)",
                fontWeight:700, fontSize:12, color:"#64748B",
              }}>
                <StarRow count={diff.starCount} size={10}/> {diff.label} · {diff.desc}
              </div>
              {won && (
                <motion.div initial={{ scale:0 }} animate={{ scale:1 }}
                  style={{
                    padding:"5px 13px", borderRadius:999, background:accent, color:"white",
                    fontFamily:"var(--font-display,'Nunito',sans-serif)",
                    fontWeight:700, fontSize:12, boxShadow:`0 4px 14px ${accent}55`,
                    display:"flex", alignItems:"center", gap:5,
                  }}
                >
                  <Trophy size={12} strokeWidth={2}/> Solved!
                </motion.div>
              )}
            </div>

            {/* Win banner */}
            <AnimatePresence>
              {won && (
                <motion.div
                  initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
                  style={{
                    width:"100%", textAlign:"center", padding:"13px 0",
                    borderRadius:18, marginBottom:10,
                    background:`linear-gradient(135deg, ${accent}, ${accent}BB)`,
                    color:"white",
                    fontFamily:"var(--font-display,'Nunito',sans-serif)",
                    fontWeight:700, fontSize:17, boxShadow:`0 6px 24px ${accent}55`,
                    display:"flex", alignItems:"center", justifyContent:"center", gap:8,
                  }}
                >
                  <CheckCircle size={18} strokeWidth={2}/> You completed {item[lang] || item.name}!
                </motion.div>
              )}
            </AnimatePresence>

            {/* Grid container */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white"
              style={{ width:GRID_PX, height:GRID_PX, background:C.greenSoft }}>
              <img src={item.img} alt="" className="hidden" onLoad={() => setImgLoaded(true)}/>

              {/* Loading placeholder */}
              {!imgLoaded && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2"
                  style={{ background:(item.color || "#eee") + "22" }}>
                  {(() => { const CatIcon = cat.icon; return (
                    <motion.div animate={{ scale:[1,1.15,1], opacity:[0.5,1,0.5] }}
                      transition={{ duration:1.4, repeat:Infinity, ease:"easeInOut" }}
                      style={{ color:item.color || accent }}>
                      <CatIcon size={48} strokeWidth={1.5}/>
                    </motion.div>
                  ); })()}
                  <span style={{ fontFamily:"var(--font-body,'Nunito',sans-serif)", fontSize:11, color:"#94A3B8" }}>
                    Loading photo…
                  </span>
                </div>
              )}

              {/* Puzzle tiles */}
              {imgLoaded && (
                <div style={{
                  display:"grid",
                  gridTemplateColumns:`repeat(${gridSize},1fr)`,
                  width:"100%", height:"100%",
                  gap:2, padding:2, background:"#CBD5E1",
                }}>
                  {tiles.map((tile, idx) => {
                    const srcCol = tile % gridSize;
                    const srcRow = Math.floor(tile / gridSize);
                    const isSel  = selected === idx;
                    const isHov  = dragOver === idx;
                    return (
                      <motion.div key={idx}
                        style={{
                          position:"relative", cursor:"pointer",
                          overflow:"hidden", borderRadius:4,
                          border:`2px solid ${isSel ? C.yellow : isHov ? accent : "transparent"}`,
                          boxShadow: isSel ? `0 0 0 2px ${C.yellow},0 4px 16px rgba(0,0,0,0.3)` : "none",
                          zIndex: isSel ? 10 : 1,
                        }}
                        whileHover={{ scale: won ? 1 : 1.04 }}
                        whileTap={{ scale: won ? 1 : 0.95 }}
                        onClick={() => handleTile(idx)}
                        onMouseEnter={() => { if (selected !== null && selected !== idx) setDragOver(idx); }}
                        onMouseLeave={() => setDragOver(null)}
                      >
                        <div style={{
                          width:"100%", height:"100%", aspectRatio:"1",
                          backgroundImage:`url(${item.img})`,
                          backgroundSize:`${gridSize * 100}%`,
                          backgroundPosition:`${srcCol * 100 / Math.max(gridSize - 1, 1)}% ${srcRow * 100 / Math.max(gridSize - 1, 1)}%`,
                          backgroundRepeat:"no-repeat",
                        }}/>
                        {!won && (
                          <div style={{
                            position:"absolute", bottom:2, right:2,
                            width:13, height:13, borderRadius:"50%",
                            display:"flex", alignItems:"center", justifyContent:"center",
                            background:"rgba(0,0,0,0.28)", color:"white",
                            fontFamily:"var(--font-display,'Nunito',sans-serif)", fontSize:7,
                          }}>{tile + 1}</div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Reference thumbnail */}
            <div style={{ display:"flex", alignItems:"center", gap:10, marginTop:10 }}>
              <div style={{
                width:52, height:52, borderRadius:12, overflow:"hidden",
                border:"3px solid white", boxShadow:"0 2px 10px rgba(0,0,0,0.12)",
                background:(item.color || "#eee") + "33",
                display:"flex", alignItems:"center", justifyContent:"center",
              }}>
                {imgLoaded
                  ? <img src={item.img} alt={item.name} style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
                  : (() => { const CatIcon = cat.icon; return <CatIcon size={26} strokeWidth={1.5} style={{ color:item.color||"#94A3B8" }}/>; })()
                }
              </div>
              <p style={{ fontFamily:"var(--font-body,'Nunito',sans-serif)", fontSize:11, color:"#94A3B8" }}>
                Reference image
              </p>
            </div>
          </div>

          {/* ── RIGHT: Info panel ────────────────────────────────────── */}
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>

            {/* Item title */}
            <div>
              <div style={{
                display:"inline-flex", alignItems:"center", gap:6,
                padding:"3px 10px", borderRadius:999, background:accent + "18", marginBottom:6,
                fontFamily:"var(--font-body,'Nunito',sans-serif)", fontSize:11, fontWeight:600, color:accent,
              }}>
                {(() => { const CatIcon = cat.icon; return <CatIcon size={11} strokeWidth={2} style={{ display:"inline", verticalAlign:"middle", marginRight:3 }}/>; })()} {cat.label}
              </div>
              <h3 style={{
                fontFamily:"var(--font-display,'Nunito',sans-serif)",
                fontWeight:800, fontSize:26, color:accent, margin:0, lineHeight:1.2,
              }}>
                {item[lang] || item.name}
              </h3>
              {item[lang] && item[lang] !== item.name && (
                <p style={{ fontFamily:"var(--font-body,'Nunito',sans-serif)", fontSize:12, color:"#94A3B8", margin:"2px 0 0" }}>
                  {item.name} in English
                </p>
              )}
            </div>

            {/* Translations card */}
            <div style={{
              background:"white", borderRadius:18, padding:"14px 16px",
              boxShadow:`0 4px 16px ${accent}18`, border:"2px solid white",
            }}>
              {/* Active language — large */}
              <div style={{
                display:"flex", alignItems:"center", justifyContent:"space-between",
                paddingBottom:10, borderBottom:"1.5px solid #F0FFF4", marginBottom:8,
              }}>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <span style={{ fontSize:22 }}>{langMeta.flag}</span>
                  <div>
                    <div style={{ fontFamily:"var(--font-body,'Nunito',sans-serif)", fontSize:10, color:"#94A3B8", textTransform:"uppercase", letterSpacing:"0.06em" }}>
                      {langMeta.label}
                    </div>
                    <div style={{
                      fontFamily:"var(--font-display,'Nunito',sans-serif)",
                      fontWeight:800, fontSize:22, color:accent, lineHeight:1,
                      direction:langMeta.dir,
                    }}>
                      {item[lang] || item.name}
                    </div>
                  </div>
                </div>
                <motion.button whileHover={{ scale:1.08 }} whileTap={{ scale:0.93 }}
                  onClick={() => speak(item[lang] || item.name, langMeta.voice)}
                  style={{
                    width:34, height:34, borderRadius:"50%", border:"none",
                    background:accent + "18", color:accent, cursor:"pointer",
                    display:"flex", alignItems:"center", justifyContent:"center",
                  }}>
                  <Volume2 size={14}/>
                </motion.button>
              </div>

              {/* English row */}
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"7px 0", borderBottom:"1.5px solid #F1F5F9" }}>
                <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                  <span style={{ fontSize:17 }}>🇬🇧</span>
                  <div>
                    <div style={{ fontFamily:"var(--font-body,'Nunito',sans-serif)", fontSize:10, color:"#94A3B8" }}>English</div>
                    <div style={{ fontFamily:"var(--font-display,'Nunito',sans-serif)", fontWeight:700, fontSize:14, color:C.blue }}>{item.name}</div>
                  </div>
                </div>
                <button onClick={() => speak(item.name, "en-US")}
                  style={{ width:28, height:28, borderRadius:"50%", border:"none", background:C.blueSoft, color:C.blue, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <Volume2 size={12}/>
                </button>
              </div>

              {/* 3 teaser languages */}
              {teaserLangs.map(l => (
                <div key={l.code} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"6px 0", borderBottom:"1px solid #F8FAFC" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                    <span style={{ fontSize:15 }}>{l.flag}</span>
                    <div>
                      <div style={{ fontFamily:"var(--font-body,'Nunito',sans-serif)", fontSize:9, color:"#CBD5E1" }}>{l.label}</div>
                      <div style={{ fontFamily:"var(--font-display,'Nunito',sans-serif)", fontWeight:600, fontSize:13, color:"#64748B", direction:l.dir }}>
                        {item[l.code] || item.name}
                      </div>
                    </div>
                  </div>
                  <button onClick={() => speak(item[l.code] || item.name, l.voice)}
                    style={{ width:24, height:24, borderRadius:"50%", border:"none", background:"#F1F5F9", color:"#94A3B8", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <Volume2 size={10}/>
                  </button>
                </div>
              ))}

              <p style={{ fontFamily:"var(--font-body,'Nunito',sans-serif)", fontSize:10, color:"#CBD5E1", textAlign:"center", marginTop:7 }}>
                Switch language above to hear more translations 🌍
              </p>
            </div>

            {/* Fun fact */}
            <div style={{ borderRadius:18, padding:"13px 15px", background:C.yellowSoft, border:"2px solid white", boxShadow:"0 2px 10px rgba(0,0,0,0.04)" }}>
              <div style={{ fontFamily:"var(--font-display,'Nunito',sans-serif)", fontWeight:700, fontSize:12, color:C.yellow, marginBottom:4 }}>
                🌟 Fun fact!
              </div>
              <p style={{ fontFamily:"var(--font-body,'Nunito',sans-serif)", fontSize:13, color:"#64748B", lineHeight:1.55, margin:0 }}>
                {item.fact}
              </p>
            </div>

            {/* Instructions */}
            <div style={{ borderRadius:18, padding:"11px 15px", background:C.blueSoft, border:"2px solid white" }}>
              <p style={{ fontFamily:"var(--font-display,'Nunito',sans-serif)", fontWeight:700, fontSize:12, color:C.blue, margin:"0 0 3px" }}>
                How to play
              </p>
              <p style={{ fontFamily:"var(--font-body,'Nunito',sans-serif)", fontSize:12, color:"#64748B", margin:0, lineHeight:1.5 }}>
                Tap a tile to select it (glows 🟡), then tap another to swap.
                Numbers show each tile's correct position. Good luck!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}