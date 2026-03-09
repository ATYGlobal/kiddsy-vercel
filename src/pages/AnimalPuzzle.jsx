/**
 * src/pages/AnimalPuzzle.jsx — Kiddsy
 * ─────────────────────────────────────────────────────────────────────────
 * ✅ 50 animales con fotos via source.unsplash.com/featured (siempre válidas)
 * ✅ Dropdown animal  — compacto, escaneable, foto miniatura
 * ✅ Dropdown dificultad — 3×3 · 4×4 · 5×5 · 6×6
 * ✅ Dropdown idioma  — 16 lenguas completas
 * ✅ Acepta props lang / onLangChange desde App.jsx
 * ─────────────────────────────────────────────────────────────────────────
 */
import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, Volume2, ChevronDown, Globe, Grid } from "lucide-react";

// ── Paleta ────────────────────────────────────────────────────────────────
const C = {
  blue:      "#1565C0", blueSoft:  "#E3F2FD",
  red:       "#E53935",
  yellow:    "#F9A825", yellowSoft:"#FFFDE7",
  green:     "#43A047", greenSoft: "#E8F5E9",
  magenta:   "#D81B60",
  cyan:      "#00ACC1",
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
  { size:3, label:"3×3", stars:"⭐",       desc:"Easy"   },
  { size:4, label:"4×4", stars:"⭐⭐",     desc:"Medium" },
  { size:5, label:"5×5", stars:"⭐⭐⭐",   desc:"Hard"   },
  { size:6, label:"6×6", stars:"⭐⭐⭐⭐",  desc:"Expert" },
];

// ── Helper: URL de foto siempre válida ────────────────────────────────────
// source.unsplash.com/featured entrega una foto real aunque el ID específico
// haya desaparecido — usa keywords para encontrar la imagen más relevante.
const unsplash = (keyword, extra = "animal") =>
  `https://source.unsplash.com/featured/800x800/?${encodeURIComponent(keyword)},${extra}`;

// ── 50 Animales — 16 idiomas + foto keyword Unsplash ─────────────────────
const ANIMALS = [
  // ── Grandes & sabana (originales) ──────────────────────────────────────
  {
    name:"Lion",        emoji:"🦁", color:"#F9A825",
    fact:"Lions can sleep up to 20 hours a day!",
    img: unsplash("lion"),
    es:"León",       fr:"Lion",          ar:"أسد",        de:"Löwe",
    it:"Leone",      pt:"Leão",          ru:"Лев",         zh:"狮子",
    ja:"ライオン",   ko:"사자",          bn:"সিংহ",        hi:"शेर",
    nl:"Leeuw",      pl:"Lew",           no:"Løve",        sv:"Lejon",
  },
  {
    name:"Elephant",    emoji:"🐘", color:"#78909C",
    fact:"Elephants never forget — they have the best memory of any land animal!",
    img: unsplash("elephant"),
    es:"Elefante",   fr:"Éléphant",      ar:"فيل",         de:"Elefant",
    it:"Elefante",   pt:"Elefante",      ru:"Слон",        zh:"大象",
    ja:"ゾウ",       ko:"코끼리",        bn:"হাতি",        hi:"हाथी",
    nl:"Olifant",    pl:"Słoń",          no:"Elefant",     sv:"Elefant",
  },
  {
    name:"Tiger",       emoji:"🐯", color:"#EF6C00",
    fact:"No two tigers have exactly the same stripe pattern — like fingerprints!",
    img: unsplash("tiger"),
    es:"Tigre",      fr:"Tigre",         ar:"نمر",         de:"Tiger",
    it:"Tigre",      pt:"Tigre",         ru:"Тигр",        zh:"老虎",
    ja:"トラ",       ko:"호랑이",        bn:"বাঘ",         hi:"बाघ",
    nl:"Tijger",     pl:"Tygrys",        no:"Tiger",       sv:"Tiger",
  },
  {
    name:"Giraffe",     emoji:"🦒", color:"#F4A435",
    fact:"Giraffes are the tallest animals on Earth — up to 6 metres tall!",
    img: unsplash("giraffe"),
    es:"Jirafa",     fr:"Girafe",        ar:"زرافة",       de:"Giraffe",
    it:"Giraffa",    pt:"Girafa",        ru:"Жираф",       zh:"长颈鹿",
    ja:"キリン",     ko:"기린",          bn:"জিরাফ",       hi:"जिराफ़",
    nl:"Giraf",      pl:"Żyrafa",        no:"Sjiraff",     sv:"Giraff",
  },
  {
    name:"Dolphin",     emoji:"🐬", color:"#0288D1",
    fact:"Dolphins call each other by unique whistle names!",
    img: unsplash("dolphin"),
    es:"Delfín",     fr:"Dauphin",       ar:"دلفين",       de:"Delfin",
    it:"Delfino",    pt:"Golfinho",      ru:"Дельфин",     zh:"海豚",
    ja:"イルカ",     ko:"돌고래",        bn:"ডলফিন",       hi:"डॉल्फिन",
    nl:"Dolfijn",    pl:"Delfin",        no:"Delfin",      sv:"Delfin",
  },
  {
    name:"Panda",       emoji:"🐼", color:"#546E7A",
    fact:"A giant panda can eat up to 40 kg of bamboo in a single day!",
    img: unsplash("panda"),
    es:"Panda",      fr:"Panda",         ar:"الباندا",     de:"Panda",
    it:"Panda",      pt:"Panda",         ru:"Панда",       zh:"熊猫",
    ja:"パンダ",     ko:"판다",          bn:"পান্ডা",      hi:"पांडा",
    nl:"Panda",      pl:"Panda",         no:"Panda",       sv:"Panda",
  },
  {
    name:"Penguin",     emoji:"🐧", color:"#37474F",
    fact:"Penguins cannot fly — but they are incredible swimmers!",
    img: unsplash("penguin"),
    es:"Pingüino",   fr:"Manchot",       ar:"بطريق",       de:"Pinguin",
    it:"Pinguino",   pt:"Pinguim",       ru:"Пингвин",     zh:"企鹅",
    ja:"ペンギン",   ko:"펭귄",          bn:"পেঙ্গুইন",    hi:"पेंगुइन",
    nl:"Pinguïn",    pl:"Pingwin",       no:"Pingvin",     sv:"Pingvin",
  },
  {
    name:"Parrot",      emoji:"🦜", color:"#2E7D32",
    fact:"Parrots can live over 80 years — longer than many humans!",
    img: unsplash("parrot"),
    es:"Loro",       fr:"Perroquet",     ar:"ببغاء",       de:"Papagei",
    it:"Pappagallo", pt:"Papagaio",      ru:"Попугай",     zh:"鹦鹉",
    ja:"オウム",     ko:"앵무새",        bn:"টিয়া",       hi:"तोता",
    nl:"Papegaai",   pl:"Papuga",        no:"Papegøye",    sv:"Papegoja",
  },
  {
    name:"Koala",       emoji:"🐨", color:"#8D6E63",
    fact:"Koalas sleep up to 22 hours a day to digest their tough eucalyptus diet!",
    img: unsplash("koala"),
    es:"Koala",      fr:"Koala",         ar:"الكوالا",     de:"Koala",
    it:"Koala",      pt:"Coala",         ru:"Коала",       zh:"考拉",
    ja:"コアラ",     ko:"코알라",        bn:"কোয়ালা",     hi:"कोआला",
    nl:"Koala",      pl:"Koala",         no:"Koala",       sv:"Koala",
  },
  {
    name:"Fox",         emoji:"🦊", color:"#BF360C",
    fact:"Foxes use Earth's magnetic field to hunt under snow!",
    img: unsplash("fox wildlife"),
    es:"Zorro",      fr:"Renard",        ar:"ثعلب",        de:"Fuchs",
    it:"Volpe",      pt:"Raposa",        ru:"Лиса",        zh:"狐狸",
    ja:"キツネ",     ko:"여우",          bn:"শেয়াল",      hi:"लोमड़ी",
    nl:"Vos",        pl:"Lis",           no:"Rev",         sv:"Räv",
  },
  {
    name:"Owl",         emoji:"🦉", color:"#5D4037",
    fact:"Owls can rotate their heads 270 degrees!",
    img: unsplash("owl bird"),
    es:"Búho",       fr:"Hibou",         ar:"بومة",        de:"Eule",
    it:"Gufo",       pt:"Coruja",        ru:"Сова",        zh:"猫头鹰",
    ja:"フクロウ",   ko:"부엉이",        bn:"পেঁচা",       hi:"उल्लू",
    nl:"Uil",        pl:"Sowa",          no:"Ugle",        sv:"Uggla",
  },
  {
    name:"Frog",        emoji:"🐸", color:"#33691E",
    fact:"Some poison dart frogs are so toxic that one touch can be fatal!",
    img: unsplash("frog"),
    es:"Rana",       fr:"Grenouille",    ar:"ضفدع",        de:"Frosch",
    it:"Rana",       pt:"Sapo",          ru:"Лягушка",     zh:"青蛙",
    ja:"カエル",     ko:"개구리",        bn:"ব্যাঙ",       hi:"मेंढक",
    nl:"Kikker",     pl:"Żaba",          no:"Frosk",       sv:"Groda",
  },
  {
    name:"Zebra",       emoji:"🦓", color:"#424242",
    fact:"Every zebra's stripe pattern is completely unique — like fingerprints!",
    img: unsplash("zebra"),
    es:"Cebra",      fr:"Zèbre",         ar:"حمار وحشي",  de:"Zebra",
    it:"Zebra",      pt:"Zebra",         ru:"Зебра",       zh:"斑马",
    ja:"シマウマ",   ko:"얼룩말",        bn:"জেব্রা",      hi:"ज़ेबरा",
    nl:"Zebra",      pl:"Zebra",         no:"Sebra",       sv:"Zebra",
  },
  {
    name:"Flamingo",    emoji:"🦩", color:"#E91E8C",
    fact:"Flamingos are born grey — their pink color comes from their food!",
    img: unsplash("flamingo"),
    es:"Flamenco",   fr:"Flamant rose",  ar:"نحام",        de:"Flamingo",
    it:"Fenicottero",pt:"Flamingo",      ru:"Фламинго",    zh:"火烈鸟",
    ja:"フラミンゴ", ko:"홍학",          bn:"ফ্লামিঙ্গো",  hi:"राजहंस",
    nl:"Flamingo",   pl:"Flaming",       no:"Flamingo",    sv:"Flamingo",
  },
  {
    name:"Bear",        emoji:"🐻", color:"#4E342E",
    fact:"Bears can run up to 55 km/h — faster than most horses over short distances!",
    img: unsplash("bear wildlife"),
    es:"Oso",        fr:"Ours",          ar:"دب",          de:"Bär",
    it:"Orso",       pt:"Urso",          ru:"Медведь",     zh:"熊",
    ja:"クマ",       ko:"곰",            bn:"ভালুক",       hi:"भालू",
    nl:"Beer",       pl:"Niedźwiedź",    no:"Bjørn",       sv:"Björn",
  },
  {
    name:"Wolf",        emoji:"🐺", color:"#546E7A",
    fact:"Wolves howl to communicate over distances of up to 16 kilometres!",
    img: unsplash("wolf"),
    es:"Lobo",       fr:"Loup",          ar:"ذئب",         de:"Wolf",
    it:"Lupo",       pt:"Lobo",          ru:"Волк",        zh:"狼",
    ja:"オオカミ",   ko:"늑대",          bn:"নেকড়া",      hi:"भेड़िया",
    nl:"Wolf",       pl:"Wilk",          no:"Ulv",         sv:"Varg",
  },
  {
    name:"Monkey",      emoji:"🐒", color:"#795548",
    fact:"Chimpanzees make and use simple tools in the wild!",
    img: unsplash("monkey primate"),
    es:"Mono",       fr:"Singe",         ar:"قرد",         de:"Affe",
    it:"Scimmia",    pt:"Macaco",        ru:"Обезьяна",    zh:"猴子",
    ja:"サル",       ko:"원숭이",        bn:"বানর",        hi:"बंदर",
    nl:"Aap",        pl:"Małpa",         no:"Ape",         sv:"Apa",
  },
  {
    name:"Kangaroo",    emoji:"🦘", color:"#D84315",
    fact:"A baby kangaroo (joey) is only the size of a grape when born!",
    img: unsplash("kangaroo"),
    es:"Canguro",    fr:"Kangourou",     ar:"كنغر",        de:"Känguru",
    it:"Canguro",    pt:"Canguru",       ru:"Кенгуру",     zh:"袋鼠",
    ja:"カンガルー", ko:"캥거루",        bn:"ক্যাঙারু",    hi:"कंगारू",
    nl:"Kangoeroe",  pl:"Kangur",        no:"Kenguru",     sv:"Känguru",
  },
  {
    name:"Shark",       emoji:"🦈", color:"#1565C0",
    fact:"Sharks can go through 30,000 teeth in a lifetime!",
    img: unsplash("shark ocean"),
    es:"Tiburón",    fr:"Requin",        ar:"قرش",         de:"Hai",
    it:"Squalo",     pt:"Tubarão",       ru:"Акула",       zh:"鲨鱼",
    ja:"サメ",       ko:"상어",          bn:"হাঙর",        hi:"शार्क",
    nl:"Haai",       pl:"Rekin",         no:"Hai",         sv:"Haj",
  },
  {
    name:"Crocodile",   emoji:"🐊", color:"#2E7D32",
    fact:"Crocodiles are living dinosaurs — barely changed in 200 million years!",
    img: unsplash("crocodile"),
    es:"Cocodrilo",  fr:"Crocodile",     ar:"تمساح",       de:"Krokodil",
    it:"Coccodrillo",pt:"Crocodilo",     ru:"Крокодил",    zh:"鳄鱼",
    ja:"ワニ",       ko:"악어",          bn:"কুমির",       hi:"मगरमच्छ",
    nl:"Krokodil",   pl:"Krokodyl",      no:"Krokodille",  sv:"Krokodil",
  },

  // ── Granja ────────────────────────────────────────────────────────────
  {
    name:"Horse",       emoji:"🐴", color:"#6D4C41",
    fact:"Horses can sleep both standing up and lying down!",
    img: unsplash("horse"),
    es:"Caballo",    fr:"Cheval",        ar:"حصان",        de:"Pferd",
    it:"Cavallo",    pt:"Cavalo",        ru:"Лошадь",      zh:"马",
    ja:"ウマ",       ko:"말",            bn:"ঘোড়া",       hi:"घोड़ा",
    nl:"Paard",      pl:"Koń",           no:"Hest",        sv:"Häst",
  },
  {
    name:"Cow",         emoji:"🐄", color:"#795548",
    fact:"Cows have best friends and get stressed when separated from them!",
    img: unsplash("cow farm"),
    es:"Vaca",       fr:"Vache",         ar:"بقرة",        de:"Kuh",
    it:"Mucca",      pt:"Vaca",          ru:"Корова",      zh:"奶牛",
    ja:"ウシ",       ko:"소",            bn:"গরু",         hi:"गाय",
    nl:"Koe",        pl:"Krowa",         no:"Ku",          sv:"Ko",
  },
  {
    name:"Pig",         emoji:"🐷", color:"#F48FB1",
    fact:"Pigs are smarter than dogs and can learn their name in just 2 weeks!",
    img: unsplash("pig farm"),
    es:"Cerdo",      fr:"Cochon",        ar:"خنزير",       de:"Schwein",
    it:"Maiale",     pt:"Porco",         ru:"Свинья",      zh:"猪",
    ja:"ブタ",       ko:"돼지",          bn:"শূকর",        hi:"सूअर",
    nl:"Varken",     pl:"Świnia",        no:"Gris",        sv:"Gris",
  },
  {
    name:"Sheep",       emoji:"🐑", color:"#BDBDBD",
    fact:"Sheep have rectangular pupils giving them nearly 360-degree vision!",
    img: unsplash("sheep"),
    es:"Oveja",      fr:"Mouton",        ar:"خروف",        de:"Schaf",
    it:"Pecora",     pt:"Ovelha",        ru:"Овца",        zh:"绵羊",
    ja:"ヒツジ",     ko:"양",            bn:"ভেড়া",       hi:"भेड़",
    nl:"Schaap",     pl:"Owca",          no:"Sau",         sv:"Får",
  },
  {
    name:"Rabbit",      emoji:"🐰", color:"#E0E0E0",
    fact:"Rabbits can leap up to 3 metres in a single bound!",
    img: unsplash("rabbit"),
    es:"Conejo",     fr:"Lapin",         ar:"أرنب",        de:"Kaninchen",
    it:"Coniglio",   pt:"Coelho",        ru:"Кролик",      zh:"兔子",
    ja:"ウサギ",     ko:"토끼",          bn:"খরগোশ",      hi:"खरगोश",
    nl:"Konijn",     pl:"Królik",        no:"Kanin",       sv:"Kanin",
  },
  {
    name:"Chicken",     emoji:"🐔", color:"#FF8F00",
    fact:"Chickens can remember over 100 different faces — human or chicken!",
    img: unsplash("chicken hen"),
    es:"Pollo",      fr:"Poulet",        ar:"دجاجة",       de:"Huhn",
    it:"Pollo",      pt:"Frango",        ru:"Курица",      zh:"鸡",
    ja:"ニワトリ",   ko:"닭",            bn:"মুরগি",       hi:"मुर्गी",
    nl:"Kip",        pl:"Kurczak",       no:"Høne",        sv:"Höna",
  },
  {
    name:"Goat",        emoji:"🐐", color:"#8D6E63",
    fact:"Goats have rectangular pupils to spot predators from almost every direction!",
    img: unsplash("goat"),
    es:"Cabra",      fr:"Chèvre",        ar:"ماعز",        de:"Ziege",
    it:"Capra",      pt:"Cabra",         ru:"Коза",        zh:"山羊",
    ja:"ヤギ",       ko:"염소",          bn:"ছাগল",        hi:"बकरी",
    nl:"Geit",       pl:"Koza",          no:"Geit",        sv:"Get",
  },
  {
    name:"Donkey",      emoji:"🫏", color:"#A1887F",
    fact:"Donkeys can recognise places they visited 25 years ago!",
    img: unsplash("donkey"),
    es:"Burro",      fr:"Âne",           ar:"حمار",        de:"Esel",
    it:"Asino",      pt:"Burro",         ru:"Осёл",        zh:"驴",
    ja:"ロバ",       ko:"당나귀",        bn:"গাধা",        hi:"गधा",
    nl:"Ezel",       pl:"Osioł",         no:"Esel",        sv:"Åsna",
  },

  // ── Insectos & pequeños ───────────────────────────────────────────────
  {
    name:"Bee",         emoji:"🐝", color:"#F9A825",
    fact:"A honey bee visits up to 5,000 flowers to make one tablespoon of honey!",
    img: unsplash("bee honey"),
    es:"Abeja",      fr:"Abeille",       ar:"نحلة",        de:"Biene",
    it:"Ape",        pt:"Abelha",        ru:"Пчела",       zh:"蜜蜂",
    ja:"ハチ",       ko:"꿀벌",          bn:"মৌমাছি",      hi:"मधुमक्खी",
    nl:"Bij",        pl:"Pszczoła",      no:"Bie",         sv:"Bi",
  },
  {
    name:"Butterfly",   emoji:"🦋", color:"#AB47BC",
    fact:"Butterflies taste with their feet — they have taste sensors on their legs!",
    img: unsplash("butterfly"),
    es:"Mariposa",   fr:"Papillon",      ar:"فراشة",       de:"Schmetterling",
    it:"Farfalla",   pt:"Borboleta",     ru:"Бабочка",     zh:"蝴蝶",
    ja:"チョウ",     ko:"나비",          bn:"প্রজাপতি",    hi:"तितली",
    nl:"Vlinder",    pl:"Motyl",         no:"Sommerfugl",  sv:"Fjäril",
  },
  {
    name:"Ladybug",     emoji:"🐞", color:"#E53935",
    fact:"A ladybug can eat up to 5,000 aphids in its lifetime!",
    img: unsplash("ladybug insect"),
    es:"Mariquita",  fr:"Coccinelle",    ar:"أبو العيد",   de:"Marienkäfer",
    it:"Coccinella", pt:"Joaninha",      ru:"Божья коровка",zh:"瓢虫",
    ja:"テントウムシ",ko:"무당벌레",     bn:"লেডিবার্ড",   hi:"लेडीबग",
    nl:"Lieveheersbeestje",pl:"Biedronka",no:"Marihøne",  sv:"Nyckelpiga",
  },

  // ── Aves exóticas ─────────────────────────────────────────────────────
  {
    name:"Eagle",       emoji:"🦅", color:"#5D4037",
    fact:"Eagles can spot a rabbit from 3 kilometres away — their vision is 4× sharper than ours!",
    img: unsplash("eagle bird"),
    es:"Águila",     fr:"Aigle",         ar:"نسر",         de:"Adler",
    it:"Aquila",     pt:"Águia",         ru:"Орёл",        zh:"老鹰",
    ja:"ワシ",       ko:"독수리",        bn:"ঈগল",         hi:"ईगल",
    nl:"Adelaar",    pl:"Orzeł",         no:"Ørn",         sv:"Örn",
  },
  {
    name:"Peacock",     emoji:"🦚", color:"#00838F",
    fact:"Only male peacocks have the dazzling tail feathers — females are plain brown!",
    img: unsplash("peacock bird"),
    es:"Pavo real",  fr:"Paon",          ar:"طاووس",       de:"Pfau",
    it:"Pavone",     pt:"Pavão",         ru:"Павлин",      zh:"孔雀",
    ja:"クジャク",   ko:"공작",          bn:"ময়ূর",        hi:"मोर",
    nl:"Pauw",       pl:"Paw",           no:"Påfugl",      sv:"Påfågel",
  },
  {
    name:"Swan",        emoji:"🦢", color:"#607D8B",
    fact:"Swans mate for life and form a beautiful heart shape when they greet each other!",
    img: unsplash("swan lake"),
    es:"Cisne",      fr:"Cygne",         ar:"بجعة",        de:"Schwan",
    it:"Cigno",      pt:"Cisne",         ru:"Лебедь",      zh:"天鹅",
    ja:"ハクチョウ", ko:"백조",          bn:"রাজহাঁস",     hi:"हंस",
    nl:"Zwaan",      pl:"Łabędź",        no:"Svane",       sv:"Svan",
  },
  {
    name:"Hummingbird", emoji:"🐦", color:"#00ACC1",
    fact:"Hummingbirds are the only birds that can fly backwards!",
    img: unsplash("hummingbird"),
    es:"Colibrí",    fr:"Colibri",       ar:"طائر الطنان", de:"Kolibri",
    it:"Colibrì",    pt:"Beija-flor",    ru:"Колибри",     zh:"蜂鸟",
    ja:"ハチドリ",   ko:"벌새",          bn:"হামিংবার্ড",  hi:"हमिंगबर्ड",
    nl:"Kolibrie",   pl:"Koliber",       no:"Kolibri",     sv:"Kolibri",
  },

  // ── Marino ────────────────────────────────────────────────────────────
  {
    name:"Octopus",     emoji:"🐙", color:"#6A1B9A",
    fact:"Octopuses have three hearts and blue blood — and are master escape artists!",
    img: unsplash("octopus ocean"),
    es:"Pulpo",      fr:"Pieuvre",       ar:"أخطبوط",      de:"Oktopus",
    it:"Polpo",      pt:"Polvo",         ru:"Осьминог",    zh:"章鱼",
    ja:"タコ",       ko:"문어",          bn:"অক্টোপাস",    hi:"ऑक्टोपस",
    nl:"Octopus",    pl:"Ośmiornica",    no:"Blekksprut",  sv:"Bläckfisk",
  },
  {
    name:"Turtle",      emoji:"🐢", color:"#2E7D32",
    fact:"Sea turtles always return to the exact beach where they were born to lay eggs!",
    img: unsplash("sea turtle"),
    es:"Tortuga",    fr:"Tortue",        ar:"سلحفاة",      de:"Schildkröte",
    it:"Tartaruga",  pt:"Tartaruga",     ru:"Черепаха",    zh:"乌龟",
    ja:"カメ",       ko:"거북이",        bn:"কচ্ছপ",       hi:"कछुआ",
    nl:"Schildpad",  pl:"Żółw",          no:"Skilpadde",   sv:"Sköldpadda",
  },
  {
    name:"Whale",       emoji:"🐋", color:"#1565C0",
    fact:"Blue whales are the largest animals ever to exist — their heart is the size of a car!",
    img: unsplash("whale ocean"),
    es:"Ballena",    fr:"Baleine",       ar:"حوت",         de:"Wal",
    it:"Balena",     pt:"Baleia",        ru:"Кит",         zh:"鲸鱼",
    ja:"クジラ",     ko:"고래",          bn:"তিমি",        hi:"व्हेल",
    nl:"Walvis",     pl:"Wieloryb",      no:"Hval",        sv:"Val",
  },
  {
    name:"Jellyfish",   emoji:"🪼", color:"#7986CB",
    fact:"Jellyfish have no brain, heart, or bones — and have existed for 500 million years!",
    img: unsplash("jellyfish underwater"),
    es:"Medusa",     fr:"Méduse",        ar:"قنديل البحر", de:"Qualle",
    it:"Medusa",     pt:"Água-viva",     ru:"Медуза",      zh:"水母",
    ja:"クラゲ",     ko:"해파리",        bn:"জেলিফিশ",     hi:"जेलीफिश",
    nl:"Kwal",       pl:"Meduza",        no:"Manet",       sv:"Manet",
  },
  {
    name:"Seal",        emoji:"🦭", color:"#607D8B",
    fact:"Seals can hold their breath for up to 2 hours when diving deep!",
    img: unsplash("seal marine"),
    es:"Foca",       fr:"Phoque",        ar:"فقمة",        de:"Robbe",
    it:"Foca",       pt:"Foca",          ru:"Тюлень",      zh:"海豹",
    ja:"アザラシ",   ko:"물개",          bn:"সিল",         hi:"सील",
    nl:"Zeehond",    pl:"Foka",          no:"Sel",         sv:"Säl",
  },
  {
    name:"Crab",        emoji:"🦀", color:"#E53935",
    fact:"Crabs have teeth in their stomachs to grind up food!",
    img: unsplash("crab beach"),
    es:"Cangrejo",   fr:"Crabe",         ar:"سرطان البحر", de:"Krabbe",
    it:"Granchio",   pt:"Caranguejo",    ru:"Краб",        zh:"螃蟹",
    ja:"カニ",       ko:"게",            bn:"কাঁকড়া",     hi:"केकड़ा",
    nl:"Krab",       pl:"Krab",          no:"Krabbe",      sv:"Krabba",
  },

  // ── Sabana & jungla ───────────────────────────────────────────────────
  {
    name:"Camel",       emoji:"🐪", color:"#D4A017",
    fact:"Camels store fat in their humps — not water — which converts to energy!",
    img: unsplash("camel desert"),
    es:"Camello",    fr:"Chameau",       ar:"جمل",         de:"Kamel",
    it:"Cammello",   pt:"Camelo",        ru:"Верблюд",     zh:"骆驼",
    ja:"ラクダ",     ko:"낙타",          bn:"উট",          hi:"ऊंट",
    nl:"Kameel",     pl:"Wielbłąd",      no:"Kamel",       sv:"Kamel",
  },
  {
    name:"Hippo",       emoji:"🦛", color:"#546E7A",
    fact:"Hippos secrete a pink liquid that acts as natural sunscreen and antiseptic!",
    img: unsplash("hippo hippopotamus"),
    es:"Hipopótamo", fr:"Hippopotame",   ar:"فرس النهر",  de:"Nilpferd",
    it:"Ippopotamo", pt:"Hipopótamo",    ru:"Гиппопотам",  zh:"河马",
    ja:"カバ",       ko:"하마",          bn:"জলহস্তী",     hi:"दरियाई घोड़ा",
    nl:"Nijlpaard",  pl:"Hipopotam",     no:"Flodhest",    sv:"Flodhäst",
  },
  {
    name:"Rhinoceros",  emoji:"🦏", color:"#78909C",
    fact:"A rhino's horn is made of keratin — the same material as our fingernails!",
    img: unsplash("rhinoceros rhino"),
    es:"Rinoceronte",fr:"Rhinocéros",    ar:"وحيد القرن",  de:"Nashorn",
    it:"Rinoceronte",pt:"Rinoceronte",   ru:"Носорог",     zh:"犀牛",
    ja:"サイ",       ko:"코뿔소",        bn:"গণ্ডার",      hi:"गैंडा",
    nl:"Neushoorn",  pl:"Nosorożec",     no:"Neshorn",     sv:"Noshörning",
  },
  {
    name:"Gorilla",     emoji:"🦍", color:"#37474F",
    fact:"Gorillas share 98.3% of their DNA with humans!",
    img: unsplash("gorilla primate"),
    es:"Gorila",     fr:"Gorille",       ar:"غوريلا",      de:"Gorilla",
    it:"Gorilla",    pt:"Gorila",        ru:"Горилла",     zh:"大猩猩",
    ja:"ゴリラ",     ko:"고릴라",        bn:"গরিলা",       hi:"गोरिल्ला",
    nl:"Gorilla",    pl:"Goryl",         no:"Gorilla",     sv:"Gorilla",
  },
  {
    name:"Cheetah",     emoji:"🐆", color:"#F57F17",
    fact:"The cheetah accelerates from 0 to 100 km/h in just 3 seconds — the fastest land animal!",
    img: unsplash("cheetah"),
    es:"Guepardo",   fr:"Guépard",       ar:"فهد",         de:"Gepard",
    it:"Ghepardo",   pt:"Guepardo",      ru:"Гепард",      zh:"猎豹",
    ja:"チーター",   ko:"치타",          bn:"চিতা",        hi:"चीता",
    nl:"Jachtluipaard",pl:"Gepard",      no:"Gepard",      sv:"Gepard",
  },

  // ── Bosque & campo ────────────────────────────────────────────────────
  {
    name:"Squirrel",    emoji:"🐿️", color:"#8D6E63",
    fact:"Squirrels forget 74% of where they buried nuts — accidentally planting trees!",
    img: unsplash("squirrel"),
    es:"Ardilla",    fr:"Écureuil",      ar:"سنجاب",       de:"Eichhörnchen",
    it:"Scoiattolo", pt:"Esquilo",       ru:"Белка",       zh:"松鼠",
    ja:"リス",       ko:"다람쥐",        bn:"কাঠবিড়ালি",  hi:"गिलहरी",
    nl:"Eekhoorn",   pl:"Wiewiórka",     no:"Ekorn",       sv:"Ekorre",
  },
  {
    name:"Deer",        emoji:"🦌", color:"#A1887F",
    fact:"A deer's antlers are the fastest-growing tissue of any mammal — up to 2.5 cm per day!",
    img: unsplash("deer forest"),
    es:"Ciervo",     fr:"Cerf",          ar:"غزال",        de:"Hirsch",
    it:"Cervo",      pt:"Cervo",         ru:"Олень",       zh:"鹿",
    ja:"シカ",       ko:"사슴",          bn:"হরিণ",        hi:"हिरण",
    nl:"Hert",       pl:"Jeleń",         no:"Hjort",       sv:"Hjort",
  },
  {
    name:"Hedgehog",    emoji:"🦔", color:"#795548",
    fact:"Hedgehogs are immune to many snake venoms — they can survive bites that would kill a dog!",
    img: unsplash("hedgehog"),
    es:"Erizo",      fr:"Hérisson",      ar:"قنفذ",        de:"Igel",
    it:"Riccio",     pt:"Ouriço",        ru:"Ёжик",        zh:"刺猬",
    ja:"ハリネズミ", ko:"고슴도치",      bn:"কাঁটাচুচু",   hi:"हेजहोग",
    nl:"Egel",       pl:"Jeż",           no:"Pinnsvin",    sv:"Igelkott",
  },
  {
    name:"Chameleon",   emoji:"🦎", color:"#66BB6A",
    fact:"Chameleons change colour to communicate emotions — not just to camouflage!",
    img: unsplash("chameleon lizard"),
    es:"Camaleón",   fr:"Caméléon",      ar:"حرباء",       de:"Chamäleon",
    it:"Camaleonte", pt:"Camaleão",      ru:"Хамелеон",    zh:"变色龙",
    ja:"カメレオン", ko:"카멜레온",      bn:"গিরগিটি",     hi:"गिरगिट",
    nl:"Kameleon",   pl:"Kameleon",      no:"Kameleon",    sv:"Kameleont",
  },
]; // 50 animales ✅

// ── Helpers de puzzle ─────────────────────────────────────────────────────
function buildPuzzle(size) {
  const n = size * size;
  const t = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [t[i], t[j]] = [t[j], t[i]];
  }
  return t;
}
const isSolved = t => t.every((v, i) => v === i);

// ── TTS helper ────────────────────────────────────────────────────────────
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
          style={{ left: `${p.x}%`, width: p.size, height: p.size, background: p.color }}
          initial={{ y: -20, opacity: 1, rotate: 0 }}
          animate={{ y: "110vh", opacity: 0, rotate: 720 }}
          transition={{ duration: 1.5 + Math.random(), delay: p.delay, ease: "easeIn" }}
        />
      ))}
    </div>
  );
}

// ── Dropdown genérico ─────────────────────────────────────────────────────
function Dropdown({ trigger, minW = 160, maxH = 300, children }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative", zIndex: 40 }}>
      <motion.button
        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
        onClick={() => setOpen(o => !o)}
        style={{
          display: "flex", alignItems: "center", gap: 7,
          padding: "9px 14px", borderRadius: 999,
          border: "2.5px solid white",
          background: "rgba(255,255,255,0.93)",
          backdropFilter: "blur(8px)",
          boxShadow: "0 4px 14px rgba(67,160,71,0.15)",
          cursor: "pointer",
          fontFamily: "var(--font-display,'Nunito',sans-serif)",
          fontWeight: 700, fontSize: 13, color: C.green,
          whiteSpace: "nowrap", minWidth: minW, justifyContent: "space-between",
        }}
      >
        {trigger}
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.18 }}
          style={{ display: "flex", marginLeft: 2 }}
        >
          <ChevronDown size={12} />
        </motion.span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.14 }}
            style={{
              position: "absolute", top: "calc(100% + 6px)", left: 0,
              minWidth: Math.max(minW, 200),
              background: "white", borderRadius: 16,
              border: "2px solid rgba(67,160,71,0.12)",
              boxShadow: "0 14px 42px rgba(67,160,71,0.2)",
              overflow: "hidden",
              maxHeight: maxH, overflowY: "auto",
              scrollbarWidth: "thin",
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
function DRow({ active, onClick, children }) {
  return (
    <button onClick={onClick}
      style={{
        display: "flex", alignItems: "center", gap: 9,
        width: "100%", padding: "7px 12px", border: "none",
        background: active ? C.greenSoft : "transparent",
        cursor: "pointer",
        fontFamily: "var(--font-body,'Nunito',sans-serif)",
        fontWeight: active ? 700 : 500, fontSize: 13,
        color: active ? C.green : "#374151", textAlign: "left",
        borderLeft: active ? `3px solid ${C.green}` : "3px solid transparent",
      }}
      onMouseEnter={e => { if (!active) e.currentTarget.style.background = "#F0FFF4"; }}
      onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}
    >
      {children}
      {active && (
        <span style={{ width: 5, height: 5, borderRadius: "50%", background: C.green, marginLeft: "auto", flexShrink: 0 }} />
      )}
    </button>
  );
}

// ── Cabecera de sección dentro de dropdown ────────────────────────────────
function DSectionHeader({ children }) {
  return (
    <div style={{
      padding: "7px 12px 4px",
      borderBottom: "1.5px solid #F0FFF4",
      fontFamily: "var(--font-display,'Nunito',sans-serif)",
      fontWeight: 700, fontSize: 9, color: C.green,
      letterSpacing: "0.08em", textTransform: "uppercase",
    }}>
      {children}
    </div>
  );
}

// ── Miniatura de animal ───────────────────────────────────────────────────
function AnimalThumb({ animal, size = 28 }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      overflow: "hidden", flexShrink: 0,
      background: animal.color + "33",
      border: "1.5px solid rgba(67,160,71,0.2)",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      {!loaded && <span style={{ fontSize: size * 0.6 }}>{animal.emoji}</span>}
      <img
        src={animal.img}
        alt={animal.name}
        onLoad={() => setLoaded(true)}
        style={{
          width: "100%", height: "100%", objectFit: "cover",
          display: loaded ? "block" : "none",
        }}
        loading="lazy"
      />
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ════════════════════════════════════════════════════════════════════════════
export default function AnimalPuzzle({ lang: propLang, onLangChange }) {
  const [animalIdx, setAnimalIdx] = useState(0);
  const [gridSize,  setGridSize]  = useState(3);
  const [tiles,     setTiles]     = useState(() => buildPuzzle(3));
  const [selected,  setSelected]  = useState(null);
  const [dragOver,  setDragOver]  = useState(null);
  const [won,       setWon]       = useState(false);
  const [confetti,  setConfetti]  = useState(false);
  const [localLang, setLocalLang] = useState("es");
  const [moves,     setMoves]     = useState(0);
  const [imgLoaded, setImgLoaded] = useState(false);

  const lang    = propLang || localLang;
  const setLang = v => { setLocalLang(v); onLangChange?.(v); };

  const animal     = ANIMALS[animalIdx];
  const langMeta   = LANGUAGES.find(l => l.code === lang) || LANGUAGES[0];
  const difficulty = DIFFICULTIES.find(d => d.size === gridSize) || DIFFICULTIES[0];
  const GRID_PX    = gridSize <= 4 ? 300 : 360;

  // 3 idiomas de "teaser" distintos al activo y al inglés
  const teaserLangs = LANGUAGES
    .filter(l => l.code !== lang && l.code !== "en")
    .slice(0, 3);

  const reset = useCallback((aIdx = animalIdx, gSize = gridSize) => {
    setTiles(buildPuzzle(gSize));
    setSelected(null); setDragOver(null);
    setWon(false); setMoves(0); setImgLoaded(false);
  }, [animalIdx, gridSize]);

  useEffect(() => { reset(animalIdx, gridSize); }, [animalIdx, gridSize]);

  const handleTile = idx => {
    if (won) return;
    if (selected === null) { setSelected(idx); return; }
    const next = [...tiles];
    [next[selected], next[idx]] = [next[idx], next[selected]];
    setTiles(next);
    setMoves(m => m + 1);
    setSelected(null);
    setDragOver(null);
    if (isSolved(next)) {
      setTimeout(() => {
        setWon(true); setConfetti(true);
        setTimeout(() => setConfetti(false), 2500);
      }, 200);
    }
  };

  // Función para cambiar de animal limpiamente
  const changeAnimal = (idx, close) => {
    setAnimalIdx(idx);
    setImgLoaded(false);
    close();
  };

  // ── RENDER ──────────────────────────────────────────────────────────────
  return (
    <div
      className="min-h-screen"
      style={{ background: "linear-gradient(150deg,#E8F5E9 0%,#FFFDE7 50%,#E3F2FD 100%)" }}
    >
      <Confetti active={confetti} />

      {/* ── Cabecera ─────────────────────────────────────────────────────── */}
      <div className="text-center pt-8 pb-3 px-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring" }}
          className="text-5xl mb-2 inline-block"
        >🧩</motion.div>
        <motion.h1
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="font-display text-3xl md:text-4xl mb-1"
          style={{ color: C.green }}
        >Animal Puzzle</motion.h1>
        <p className="font-body text-slate-400 text-sm">
          Tap two tiles to swap — build the animal! 🎨
        </p>
      </div>

      {/* ── Barra de controles ───────────────────────────────────────────── */}
      <div style={{
        display: "flex", flexWrap: "wrap",
        justifyContent: "center", gap: 8,
        padding: "0 12px 14px",
      }}>

        {/* ① Selector de animal */}
        <Dropdown
          minW={200}
          maxH={360}
          trigger={
            <>
              <AnimalThumb animal={animal} size={24} />
              <span style={{ fontSize: 15 }}>{animal.emoji}</span>
              <span style={{ maxWidth: 100, overflow: "hidden", textOverflow: "ellipsis" }}>
                {animal[lang] || animal.name}
              </span>
            </>
          }
        >
          {close => [
            <DSectionHeader key="hdr">Choose animal ({ANIMALS.length})</DSectionHeader>,
            ...ANIMALS.map((a, i) => (
              <DRow key={i} active={animalIdx === i} onClick={() => changeAnimal(i, close)}>
                <AnimalThumb animal={a} size={28} />
                <div style={{ lineHeight: 1.3, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 13, whiteSpace: "nowrap" }}>
                    {a.emoji} {a[lang] || a.name}
                  </div>
                  {(a[lang] && a[lang] !== a.name) && (
                    <div style={{ fontSize: 10, color: "#94A3B8" }}>{a.name}</div>
                  )}
                </div>
              </DRow>
            )),
          ]}
        </Dropdown>

        {/* ② Selector de dificultad */}
        <Dropdown
          minW={140}
          trigger={
            <>
              <Grid size={13} />
              <span>{difficulty.label}</span>
              <span style={{ fontSize: 11 }}>{difficulty.stars}</span>
            </>
          }
        >
          {close => [
            <DSectionHeader key="hdr">Difficulty</DSectionHeader>,
            ...DIFFICULTIES.map(d => (
              <DRow key={d.size} active={gridSize === d.size}
                onClick={() => { setGridSize(d.size); close(); }}>
                <span style={{ fontWeight: 800, minWidth: 36, fontSize: 14 }}>{d.label}</span>
                <span style={{ fontSize: 13 }}>{d.stars}</span>
                <span style={{ fontSize: 11, color: "#94A3B8" }}>{d.desc}</span>
              </DRow>
            )),
          ]}
        </Dropdown>

        {/* ③ Selector de idioma */}
        <Dropdown
          minW={150}
          trigger={
            <>
              <Globe size={13} />
              <span style={{ fontSize: 15 }}>{langMeta.flag}</span>
              <span>{langMeta.label}</span>
            </>
          }
        >
          {close => [
            <DSectionHeader key="hdr"><Globe size={9} style={{ display: "inline", marginRight: 4 }} />Translation</DSectionHeader>,
            ...LANGUAGES.map(l => (
              <DRow key={l.code} active={lang === l.code}
                onClick={() => { setLang(l.code); close(); }}>
                <span style={{ fontSize: 16, lineHeight: 1, flexShrink: 0 }}>{l.flag}</span>
                <span>{l.label}</span>
              </DRow>
            )),
          ]}
        </Dropdown>

        {/* ④ Shuffle */}
        <motion.button
          whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
          onClick={() => reset()}
          style={{
            display: "flex", alignItems: "center", gap: 5,
            padding: "9px 16px", borderRadius: 999,
            border: "2.5px solid white", background: C.red, color: "white",
            fontFamily: "var(--font-display,'Nunito',sans-serif)",
            fontWeight: 700, fontSize: 13, cursor: "pointer",
            boxShadow: "0 4px 14px rgba(229,57,53,0.3)",
            whiteSpace: "nowrap",
          }}
        >
          <RotateCcw size={13} /> Shuffle
        </motion.button>
      </div>

      {/* ── Cuerpo principal ─────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-3 pb-20">
        <div className="grid lg:grid-cols-2 gap-5 items-start">

          {/* ── Columna izquierda: puzzle ────────────────────────────────── */}
          <div className="flex flex-col items-center">

            {/* Stats row */}
            <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap", justifyContent: "center" }}>
              <div style={{
                padding: "5px 13px", borderRadius: 999, background: "white",
                boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
                fontFamily: "var(--font-display,'Nunito',sans-serif)",
                fontWeight: 700, fontSize: 12, color: C.green,
              }}>🎯 {moves} swaps</div>
              <div style={{
                padding: "5px 13px", borderRadius: 999, background: "white",
                boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
                fontFamily: "var(--font-display,'Nunito',sans-serif)",
                fontWeight: 700, fontSize: 12, color: "#64748B",
              }}>{difficulty.stars} {difficulty.label} · {difficulty.desc}</div>
              {won && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                  style={{
                    padding: "5px 13px", borderRadius: 999,
                    background: C.green, color: "white",
                    fontFamily: "var(--font-display,'Nunito',sans-serif)",
                    fontWeight: 700, fontSize: 12,
                    boxShadow: `0 4px 14px rgba(67,160,71,0.4)`,
                  }}>🏆 Solved!</motion.div>
              )}
            </div>

            {/* Banner de victoria */}
            <AnimatePresence>
              {won && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  style={{
                    width: "100%", textAlign: "center",
                    padding: "13px 0", borderRadius: 18, marginBottom: 10,
                    background: `linear-gradient(135deg,${C.green},#1B5E20)`,
                    color: "white",
                    fontFamily: "var(--font-display,'Nunito',sans-serif)",
                    fontWeight: 700, fontSize: 17,
                    boxShadow: `0 6px 24px rgba(67,160,71,0.4)`,
                  }}
                >
                  🎉 You built the {animal.name}! Amazing!
                </motion.div>
              )}
            </AnimatePresence>

            {/* Contenedor del puzzle */}
            <div
              className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white"
              style={{ width: GRID_PX, height: GRID_PX, background: C.greenSoft }}
            >
              {/* Precarga de imagen */}
              <img src={animal.img} alt="" className="hidden" onLoad={() => setImgLoaded(true)} />

              {/* Spinner de carga */}
              {!imgLoaded && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    style={{ fontSize: 46 }}
                  >{animal.emoji}</motion.div>
                  <span style={{
                    fontFamily: "var(--font-body,'Nunito',sans-serif)",
                    fontSize: 11, color: "#94A3B8",
                  }}>Loading photo…</span>
                </div>
              )}

              {/* Grid de piezas */}
              {imgLoaded && (
                <div style={{
                  display: "grid",
                  gridTemplateColumns: `repeat(${gridSize},1fr)`,
                  width: "100%", height: "100%",
                  gap: 2, padding: 2, background: "#CBD5E1",
                }}>
                  {tiles.map((tile, idx) => {
                    const srcCol = tile % gridSize;
                    const srcRow = Math.floor(tile / gridSize);
                    const isSel  = selected === idx;
                    const isHov  = dragOver === idx;
                    return (
                      <motion.div
                        key={idx}
                        style={{
                          position: "relative", cursor: "pointer",
                          overflow: "hidden", borderRadius: 4,
                          border: `2px solid ${isSel ? C.yellow : isHov ? C.green : "transparent"}`,
                          boxShadow: isSel
                            ? `0 0 0 2px ${C.yellow}, 0 4px 16px rgba(0,0,0,0.3)`
                            : "none",
                          zIndex: isSel ? 10 : 1,
                          transition: "border-color 0.1s",
                        }}
                        whileHover={{ scale: won ? 1 : 1.04 }}
                        whileTap={{ scale: won ? 1 : 0.95 }}
                        onClick={() => handleTile(idx)}
                        onMouseEnter={() => {
                          if (selected !== null && selected !== idx) setDragOver(idx);
                        }}
                        onMouseLeave={() => setDragOver(null)}
                      >
                        <div style={{
                          width: "100%", height: "100%", aspectRatio: "1",
                          backgroundImage: `url(${animal.img})`,
                          backgroundSize: `${gridSize * 100}%`,
                          backgroundPosition: `${srcCol * 100 / Math.max(gridSize - 1, 1)}% ${srcRow * 100 / Math.max(gridSize - 1, 1)}%`,
                          backgroundRepeat: "no-repeat",
                        }} />
                        {!won && (
                          <div style={{
                            position: "absolute", bottom: 2, right: 2,
                            width: 13, height: 13, borderRadius: "50%",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            background: "rgba(0,0,0,0.28)", color: "white",
                            fontFamily: "var(--font-display,'Nunito',sans-serif)", fontSize: 7,
                          }}>{tile + 1}</div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Miniatura de referencia */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 10 }}>
              <div style={{
                width: 52, height: 52, borderRadius: 12,
                overflow: "hidden", border: "3px solid white",
                boxShadow: "0 2px 10px rgba(0,0,0,0.12)",
                background: animal.color + "33",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {imgLoaded
                  ? <img src={animal.img} alt={animal.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  : <span style={{ fontSize: 28 }}>{animal.emoji}</span>
                }
              </div>
              <p style={{ fontFamily: "var(--font-body,'Nunito',sans-serif)", fontSize: 11, color: "#94A3B8" }}>
                Reference image
              </p>
            </div>
          </div>

          {/* ── Columna derecha: info ─────────────────────────────────────── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>

            {/* Nombre del animal */}
            <div>
              <h3 style={{
                fontFamily: "var(--font-display,'Nunito',sans-serif)",
                fontWeight: 800, fontSize: 26, color: C.green,
                margin: 0, lineHeight: 1.2,
              }}>
                {animal.emoji} {animal[lang] || animal.name}
              </h3>
              {animal[lang] && animal[lang] !== animal.name && (
                <p style={{
                  fontFamily: "var(--font-body,'Nunito',sans-serif)",
                  fontSize: 12, color: "#94A3B8", margin: "2px 0 0",
                }}>
                  {animal.name} in English
                </p>
              )}
            </div>

            {/* Tarjeta de traducciones */}
            <div style={{
              background: "white", borderRadius: 18,
              padding: "14px 16px",
              boxShadow: "0 4px 16px rgba(67,160,71,0.10)",
              border: "2px solid white",
            }}>
              {/* Idioma activo — grande */}
              <div style={{
                display: "flex", alignItems: "center",
                justifyContent: "space-between",
                paddingBottom: 10, borderBottom: `1.5px solid ${C.greenSoft}`,
                marginBottom: 8,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 22 }}>{langMeta.flag}</span>
                  <div>
                    <div style={{
                      fontFamily: "var(--font-body,'Nunito',sans-serif)",
                      fontSize: 10, color: "#94A3B8",
                      textTransform: "uppercase", letterSpacing: "0.06em",
                    }}>{langMeta.label}</div>
                    <div style={{
                      fontFamily: "var(--font-display,'Nunito',sans-serif)",
                      fontWeight: 800, fontSize: 22,
                      color: animal.color, lineHeight: 1,
                      direction: langMeta.dir,
                    }}>{animal[lang] || animal.name}</div>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.93 }}
                  onClick={() => speak(animal[lang] || animal.name, langMeta.voice)}
                  style={{
                    width: 34, height: 34, borderRadius: "50%", border: "none",
                    background: C.greenSoft, color: C.green,
                    cursor: "pointer", display: "flex",
                    alignItems: "center", justifyContent: "center",
                  }}
                ><Volume2 size={14} /></motion.button>
              </div>

              {/* English siempre */}
              <div style={{
                display: "flex", alignItems: "center",
                justifyContent: "space-between",
                padding: "7px 0", borderBottom: "1.5px solid #F1F5F9",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <span style={{ fontSize: 17 }}>🇬🇧</span>
                  <div>
                    <div style={{ fontFamily: "var(--font-body,'Nunito',sans-serif)", fontSize: 10, color: "#94A3B8" }}>
                      English
                    </div>
                    <div style={{
                      fontFamily: "var(--font-display,'Nunito',sans-serif)",
                      fontWeight: 700, fontSize: 14, color: C.blue,
                    }}>{animal.name}</div>
                  </div>
                </div>
                <button
                  onClick={() => speak(animal.name, "en-US")}
                  style={{
                    width: 28, height: 28, borderRadius: "50%", border: "none",
                    background: C.blueSoft, color: C.blue,
                    cursor: "pointer", display: "flex",
                    alignItems: "center", justifyContent: "center",
                  }}
                ><Volume2 size={12} /></button>
              </div>

              {/* 3 idiomas teaser */}
              {teaserLangs.map(l => (
                <div key={l.code} style={{
                  display: "flex", alignItems: "center",
                  justifyContent: "space-between",
                  padding: "6px 0",
                  borderBottom: "1px solid #F8FAFC",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    <span style={{ fontSize: 15 }}>{l.flag}</span>
                    <div>
                      <div style={{ fontFamily: "var(--font-body,'Nunito',sans-serif)", fontSize: 9, color: "#CBD5E1" }}>
                        {l.label}
                      </div>
                      <div style={{
                        fontFamily: "var(--font-display,'Nunito',sans-serif)",
                        fontWeight: 600, fontSize: 13, color: "#64748B",
                        direction: l.dir,
                      }}>{animal[l.code] || animal.name}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => speak(animal[l.code] || animal.name, l.voice)}
                    style={{
                      width: 24, height: 24, borderRadius: "50%", border: "none",
                      background: "#F1F5F9", color: "#94A3B8",
                      cursor: "pointer", display: "flex",
                      alignItems: "center", justifyContent: "center",
                    }}
                  ><Volume2 size={10} /></button>
                </div>
              ))}

              <p style={{
                fontFamily: "var(--font-body,'Nunito',sans-serif)",
                fontSize: 10, color: "#CBD5E1",
                textAlign: "center", marginTop: 7,
              }}>
                Switch language above to hear more translations 🌍
              </p>
            </div>

            {/* Fun fact */}
            <div style={{
              borderRadius: 18, padding: "13px 15px",
              background: C.yellowSoft, border: "2px solid white",
              boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
            }}>
              <div style={{
                fontFamily: "var(--font-display,'Nunito',sans-serif)",
                fontWeight: 700, fontSize: 12, color: C.yellow, marginBottom: 4,
              }}>🌟 Fun fact!</div>
              <p style={{
                fontFamily: "var(--font-body,'Nunito',sans-serif)",
                fontSize: 13, color: "#64748B", lineHeight: 1.55, margin: 0,
              }}>{animal.fact}</p>
            </div>

            {/* Instrucciones */}
            <div style={{
              borderRadius: 18, padding: "11px 15px",
              background: C.blueSoft, border: "2px solid white",
            }}>
              <p style={{
                fontFamily: "var(--font-display,'Nunito',sans-serif)",
                fontWeight: 700, fontSize: 12, color: C.blue, margin: "0 0 3px",
              }}>How to play</p>
              <p style={{
                fontFamily: "var(--font-body,'Nunito',sans-serif)",
                fontSize: 12, color: "#64748B", margin: 0, lineHeight: 1.5,
              }}>
                Tap a tile to select it (glows 🟡), then tap another to swap.
                Numbers show correct position. Good luck! 🧩
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
