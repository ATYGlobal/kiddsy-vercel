/**
 * src/pages/AnimalPuzzle.jsx — Kiddsy
 * ────────────────────────────────────────────────────────
 * ✅ 16 idiomas: ES FR AR DE IT PT RU ZH JA KO BN HI NL PL NO SV
 * ✅ Acepta prop  lang / onLangChange  desde App.jsx
 * ✅ Dropdown elegante para idioma (reemplaza los 3 flag-buttons)
 * ✅ Lógica de puzzle, fotos Unsplash y estilo "Burbuja" intactos
 * ────────────────────────────────────────────────────────
 */
import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, ChevronLeft, ChevronRight, Volume2, Globe, ChevronDown } from "lucide-react";

const C = {
  blue:"#1565C0", blueSoft:"#E3F2FD", red:"#E53935",
  yellow:"#F9A825", yellowSoft:"#FFFDE7",
  green:"#43A047", greenSoft:"#E8F5E9", magenta:"#D81B60", cyan:"#00ACC1",
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

// ── Animales — nombres en 16 idiomas ────────────────────────────────────────
const ANIMALS = [
 {
    name:"Lion", emoji:"🦁", color:"#F9A825",
    fact:"Lions can sleep up to 20 hours a day!",
    img:"https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=600&h=600&fit=crop&auto=format",
    es:"León",       fr:"Lion",         ar:"أسد",        de:"Löwe",
    it:"Leone",      pt:"Leão",         ru:"Лев",         zh:"狮子",
    ja:"ライオン",   ko:"사자",         bn:"সিংহ",        hi:"शेर",
    nl:"Leeuw",      pl:"Lew",          no:"Løve",        sv:"Lejon",
  },
  {
    name:"Elephant", emoji:"🐘", color:"#78909C",
    fact:"Elephants never forget — they have the best memory of any land animal!",
    img:"https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=600&h=600&fit=crop&auto=format",
    es:"Elefante",   fr:"Éléphant",     ar:"فيل",         de:"Elefant",
    it:"Elefante",   pt:"Elefante",     ru:"Слон",        zh:"大象",
    ja:"ゾウ",       ko:"코끼리",       bn:"হাতি",        hi:"हाथी",
    nl:"Olifant",    pl:"Słoń",         no:"Elefant",     sv:"Elefant",
  },
  {
    name:"Tiger", emoji:"🐯", color:"#EF6C00",
    fact:"No two tigers have exactly the same stripe pattern — like fingerprints!",
    img:"https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=600&h=600&fit=crop&auto=format",
    es:"Tigre",      fr:"Tigre",        ar:"نمر",         de:"Tiger",
    it:"Tigre",      pt:"Tigre",        ru:"Тигр",        zh:"老虎",
    ja:"トラ",       ko:"호랑이",       bn:"বাঘ",         hi:"बाघ",
    nl:"Tijger",     pl:"Tygrys",       no:"Tiger",       sv:"Tiger",
  },
  {
    name:"Giraffe", emoji:"🦒", color:"#F4A435",
    fact:"Giraffes are the tallest animals on Earth — up to 6 metres tall!",
    img:"https://images.unsplash.com/photo-1547721064-da6cfb341d50?w=600&h=600&fit=crop&auto=format",
    es:"Jirafa",     fr:"Girafe",       ar:"زرافة",       de:"Giraffe",
    it:"Giraffa",    pt:"Girafa",       ru:"Жираф",       zh:"长颈鹿",
    ja:"キリン",     ko:"기린",         bn:"জিরাফ",       hi:"जिराफ़",
    nl:"Giraf",      pl:"Żyrafa",       no:"Sjiraff",     sv:"Giraff",
  },
  {
    name:"Dolphin", emoji:"🐬", color:"#0288D1",
    fact:"Dolphins call each other by unique whistle names!",
    img:"https://images.unsplash.com/photo-1607153333879-c174d265f1d2?w=600&h=600&fit=crop&auto=format",
    es:"Delfín",     fr:"Dauphin",      ar:"دلفين",       de:"Delfin",
    it:"Delfino",    pt:"Golfinho",     ru:"Дельфин",     zh:"海豚",
    ja:"イルカ",     ko:"돌고래",       bn:"ডলফিন",       hi:"डॉल्फिन",
    nl:"Dolfijn",    pl:"Delfin",       no:"Delfin",      sv:"Delfin",
  },
  {
    name:"Panda", emoji:"🐼", color:"#546E7A",
    fact:"A giant panda can eat up to 40 kg of bamboo in a single day!",
    img:"https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=600&h=600&fit=crop&auto=format",
    es:"Panda",      fr:"Panda",        ar:"الباندا",     de:"Panda",
    it:"Panda",      pt:"Panda",        ru:"Панда",       zh:"熊猫",
    ja:"パンダ",     ko:"판다",         bn:"পান্ডা",      hi:"पांडा",
    nl:"Panda",      pl:"Panda",        no:"Panda",       sv:"Panda",
  },
  {
    name:"Penguin", emoji:"🐧", color:"#37474F",
    fact:"Penguins cannot fly — but they are incredible swimmers!",
    img:"https://images.unsplash.com/photo-1551986782-d0169b3f8fa7?w=600&h=600&fit=crop&auto=format",
    es:"Pingüino",   fr:"Manchot",      ar:"بطريق",       de:"Pinguin",
    it:"Pinguino",   pt:"Pinguim",      ru:"Пингвин",     zh:"企鹅",
    ja:"ペンギン",   ko:"펭귄",         bn:"পেঙ্গুইন",    hi:"पेंगुइन",
    nl:"Pinguïn",    pl:"Pingwin",      no:"Pingvin",     sv:"Pingvin",
  },
  {
    name:"Parrot", emoji:"🦜", color:"#2E7D32",
    fact:"Parrots can live over 80 years — longer than many humans!",
    img:"https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=600&h=600&fit=crop&auto=format",
    es:"Loro",       fr:"Perroquet",    ar:"ببغاء",       de:"Papagei",
    it:"Pappagallo", pt:"Papagaio",     ru:"Попугай",     zh:"鹦鹉",
    ja:"オウム",     ko:"앵무새",       bn:"টিয়া",       hi:"तोता",
    nl:"Papegaai",   pl:"Papuga",       no:"Papegøye",    sv:"Papegoja",
  },
  {
    name:"Koala", emoji:"🐨", color:"#8D6E63",
    fact:"Koalas sleep up to 22 hours a day to digest their tough eucalyptus diet!",
    img:"https://images.unsplash.com/photo-1459262838948-3e2de6c798c5?w=600&h=600&fit=crop&auto=format",
    es:"Koala",      fr:"Koala",        ar:"الكوالا",     de:"Koala",
    it:"Koala",      pt:"Coala",        ru:"Коала",       zh:"考拉",
    ja:"コアラ",     ko:"코알라",       bn:"কোয়ালা",     hi:"कोआला",
    nl:"Koala",      pl:"Koala",        no:"Koala",       sv:"Koala",
  },
  {
    name:"Fox", emoji:"🦊", color:"#BF360C",
    fact:"Foxes use Earth's magnetic field like a compass to hunt under snow!",
    img:"https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=600&h=600&fit=crop&auto=format",
    es:"Zorro",      fr:"Renard",       ar:"ثعلب",        de:"Fuchs",
    it:"Volpe",      pt:"Raposa",       ru:"Лиса",        zh:"狐狸",
    ja:"キツネ",     ko:"여우",         bn:"শেয়াল",      hi:"लोमड़ी",
    nl:"Vos",        pl:"Lis",          no:"Rev",         sv:"Räv",
  },
  {
    name:"Owl", emoji:"🦉", color:"#5D4037",
    fact:"Owls can rotate their heads 270 degrees in each direction!",
    img:"https://images.unsplash.com/photo-1503918236782-b19038f0c6dd?w=600&h=600&fit=crop&auto=format",
    es:"Búho",       fr:"Hibou",        ar:"بومة",        de:"Eule",
    it:"Gufo",       pt:"Coruja",       ru:"Сова",        zh:"猫头鹰",
    ja:"フクロウ",   ko:"부엉이",       bn:"পেঁচা",       hi:"उल्लू",
    nl:"Uil",        pl:"Sowa",         no:"Ugle",        sv:"Uggla",
  },
  {
    name:"Frog", emoji:"🐸", color:"#33691E",
    fact:"Some poison dart frogs are so toxic that one touch can be fatal!",
    img:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop&auto=format",
    es:"Rana",       fr:"Grenouille",   ar:"ضفدع",        de:"Frosch",
    it:"Rana",       pt:"Sapo",         ru:"Лягушка",     zh:"青蛙",
    ja:"カエル",     ko:"개구리",       bn:"ব্যাঙ",       hi:"मेंढक",
    nl:"Kikker",     pl:"Żaba",         no:"Frosk",       sv:"Groda",
  },
  {
    name:"Zebra", emoji:"🦓", color:"#424242",
    fact:"Every zebra's stripe pattern is completely unique — no two are identical!",
    img:"https://images.unsplash.com/photo-1508459855340-fb63ac591728?w=600&h=600&fit=crop&auto=format",
    es:"Cebra",      fr:"Zèbre",        ar:"حمار وحشي",   de:"Zebra",
    it:"Zebra",      pt:"Zebra",        ru:"Зебра",       zh:"斑马",
    ja:"シマウマ",   ko:"얼룩말",       bn:"জেব্রা",      hi:"ज़ेबरा",
    nl:"Zebra",      pl:"Zebra",        no:"Sebra",       sv:"Zebra",
  },
  {
    name:"Flamingo", emoji:"🦩", color:"#E91E8C",
    fact:"Flamingos are born grey — their pink color comes from the food they eat!",
    img:"https://images.unsplash.com/photo-1497206365174-b9b23bfda79f?w=600&h=600&fit=crop&auto=format",
    es:"Flamenco",   fr:"Flamant rose", ar:"نحام",        de:"Flamingo",
    it:"Fenicottero",pt:"Flamingo",     ru:"Фламинго",    zh:"火烈鸟",
    ja:"フラミンゴ", ko:"홍학",         bn:"ফ্লামিঙ্গো",  hi:"राजहंस",
    nl:"Flamingo",   pl:"Flaming",      no:"Flamingo",    sv:"Flamingo",
  },
  {
    name:"Bear", emoji:"🐻", color:"#4E342E",
    fact:"Bears can run up to 55 km/h — faster than most horses over short distances!",
    img:"https://images.unsplash.com/photo-1530595467537-0ac5bac6ca87?w=600&h=600&fit=crop&auto=format",
    es:"Oso",        fr:"Ours",         ar:"دب",          de:"Bär",
    it:"Orso",       pt:"Urso",         ru:"Медведь",     zh:"熊",
    ja:"クマ",       ko:"곰",           bn:"ভালুক",       hi:"भालू",
    nl:"Beer",       pl:"Niedźwiedź",   no:"Bjørn",       sv:"Björn",
  },
  {
    name:"Wolf", emoji:"🐺", color:"#546E7A",
    fact:"Wolves howl to communicate over distances of up to 16 kilometres!",
    img:"https://images.unsplash.com/photo-1607448885122-640a9a3eb1b2?w=600&h=600&fit=crop&auto=format",
    es:"Lobo",       fr:"Loup",         ar:"ذئب",         de:"Wolf",
    it:"Lupo",       pt:"Lobo",         ru:"Волк",        zh:"狼",
    ja:"オオカミ",   ko:"늑대",         bn:"নেকড়া",      hi:"भेड़िया",
    nl:"Wolf",       pl:"Wilk",         no:"Ulv",         sv:"Varg",
  },
  {
    name:"Monkey", emoji:"🐒", color:"#795548",
    fact:"Chimpanzees have been observed making and using simple tools in the wild!",
    img:"https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?w=600&h=600&fit=crop&auto=format",
    es:"Mono",       fr:"Singe",        ar:"قرد",         de:"Affe",
    it:"Scimmia",    pt:"Macaco",       ru:"Обезьяна",    zh:"猴子",
    ja:"サル",       ko:"원숭이",       bn:"বানর",        hi:"बंदर",
    nl:"Aap",        pl:"Małpa",        no:"Ape",         sv:"Apa",
  },
  {
    name:"Kangaroo", emoji:"🦘", color:"#D84315",
    fact:"A baby kangaroo (joey) is only the size of a grape when born!",
    img:"https://images.unsplash.com/photo-1549480017-d76466a4b7e8?w=600&h=600&fit=crop&auto=format",
    es:"Canguro",    fr:"Kangourou",    ar:"كنغر",        de:"Känguru",
    it:"Canguro",    pt:"Canguru",      ru:"Кенгуру",     zh:"袋鼠",
    ja:"カンガルー", ko:"캥거루",       bn:"ক্যাঙারু",    hi:"कंगारू",
    nl:"Kangoeroe",  pl:"Kangur",       no:"Kenguru",     sv:"Känguru",
  },
  {
    name:"Shark", emoji:"🦈", color:"#1565C0",
    fact:"Sharks can go through 30,000 teeth in a lifetime — new ones grow in rows!",
    img:"https://images.unsplash.com/photo-1560275619-4662e36fa65c?w=600&h=600&fit=crop&auto=format",
    es:"Tiburón",    fr:"Requin",       ar:"قرش",         de:"Hai",
    it:"Squalo",     pt:"Tubarão",      ru:"Акула",       zh:"鲨鱼",
    ja:"サメ",       ko:"상어",         bn:"হাঙর",        hi:"शार्क",
    nl:"Haai",       pl:"Rekin",        no:"Hai",         sv:"Haj",
  },
  {
    name:"Crocodile", emoji:"🐊", color:"#2E7D32",
    fact:"Crocodiles are living dinosaurs — they've barely changed in 200 million years!",
    img:"https://images.unsplash.com/photo-1580204842-ddb12c6e2ef3?w=600&h=600&fit=crop&auto=format",
    es:"Cocodrilo",  fr:"Crocodile",    ar:"تمساح",       de:"Krokodil",
    it:"Coccodrillo",pt:"Crocodilo",    ru:"Крокодил",    zh:"鳄鱼",
    ja:"ワニ",       ko:"악어",         bn:"কুমির",       hi:"मगरमच्छ",
    nl:"Krokodil",   pl:"Krokodyl",     no:"Krokodille",  sv:"Krokodil",
  },

  // ════════════════════════════════════════════════════════════════
  // ── BLOQUE 2: 30 nuevos ─────────────────────────────────────
  // ════════════════════════════════════════════════════════════════

  // ── Granja ────────────────────────────────────────────────────
  {
    name:"Horse", emoji:"🐴", color:"#6D4C41",
    fact:"Horses can sleep both standing up and lying down!",
    img:"https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=600&h=600&fit=crop&auto=format",
    es:"Caballo",    fr:"Cheval",       ar:"حصان",        de:"Pferd",
    it:"Cavallo",    pt:"Cavalo",       ru:"Лошадь",      zh:"马",
    ja:"ウマ",       ko:"말",           bn:"ঘোড়া",       hi:"घोड़ा",
    nl:"Paard",      pl:"Koń",          no:"Hest",        sv:"Häst",
  },
  {
    name:"Cow", emoji:"🐄", color:"#795548",
    fact:"Cows have best friends — they get stressed when separated from them!",
    img:"https://images.unsplash.com/photo-1546445915-dc5f6e5d38f5?w=600&h=600&fit=crop&auto=format",
    es:"Vaca",       fr:"Vache",        ar:"بقرة",        de:"Kuh",
    it:"Mucca",      pt:"Vaca",         ru:"Корова",      zh:"奶牛",
    ja:"ウシ",       ko:"소",           bn:"গরু",         hi:"गाय",
    nl:"Koe",        pl:"Krowa",        no:"Ku",          sv:"Ko",
  },
  {
    name:"Pig", emoji:"🐷", color:"#F48FB1",
    fact:"Pigs are smarter than dogs and can learn their name in just 2 weeks!",
    img:"https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=600&h=600&fit=crop&auto=format",
    es:"Cerdo",      fr:"Cochon",       ar:"خنزير",       de:"Schwein",
    it:"Maiale",     pt:"Porco",        ru:"Свинья",      zh:"猪",
    ja:"ブタ",       ko:"돼지",         bn:"শূকর",        hi:"सूअर",
    nl:"Varken",     pl:"Świnia",       no:"Gris",        sv:"Gris",
  },
  {
    name:"Sheep", emoji:"🐑", color:"#BDBDBD",
    fact:"Sheep have rectangular pupils that give them nearly 360-degree vision!",
    img:"https://images.unsplash.com/photo-1484557985045-edf25e08da73?w=600&h=600&fit=crop&auto=format",
    es:"Oveja",      fr:"Mouton",       ar:"خروف",        de:"Schaf",
    it:"Pecora",     pt:"Ovelha",       ru:"Овца",        zh:"绵羊",
    ja:"ヒツジ",     ko:"양",           bn:"ভেড়া",       hi:"भेड़",
    nl:"Schaap",     pl:"Owca",         no:"Sau",         sv:"Får",
  },
  {
    name:"Rabbit", emoji:"🐰", color:"#E0E0E0",
    fact:"Rabbits cannot vomit — they must groom carefully to avoid ingesting too much hair!",
    img:"https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=600&h=600&fit=crop&auto=format",
    es:"Conejo",     fr:"Lapin",        ar:"أرنب",        de:"Kaninchen",
    it:"Coniglio",   pt:"Coelho",       ru:"Кролик",      zh:"兔子",
    ja:"ウサギ",     ko:"토끼",         bn:"খরগোশ",      hi:"खरगोश",
    nl:"Konijn",     pl:"Królik",       no:"Kanin",       sv:"Kanin",
  },
  {
    name:"Chicken", emoji:"🐔", color:"#FF8F00",
    fact:"Chickens can remember over 100 different faces — of both humans and other chickens!",
    img:"https://images.unsplash.com/photo-1548550966-4adc5ac74aba?w=600&h=600&fit=crop&auto=format",
    es:"Pollo",      fr:"Poulet",       ar:"دجاجة",       de:"Huhn",
    it:"Pollo",      pt:"Frango",       ru:"Курица",      zh:"鸡",
    ja:"ニワトリ",   ko:"닭",           bn:"মুরগি",       hi:"मुर्गी",
    nl:"Kip",        pl:"Kurczak",      no:"Høne",        sv:"Höna",
  },
  {
    name:"Goat", emoji:"🐐", color:"#8D6E63",
    fact:"Goats have rectangular pupils — it helps them spot predators from almost every direction!",
    img:"https://images.unsplash.com/photo-1524024973431-2ad916746881?w=600&h=600&fit=crop&auto=format",
    es:"Cabra",      fr:"Chèvre",       ar:"ماعز",        de:"Ziege",
    it:"Capra",      pt:"Cabra",        ru:"Коза",        zh:"山羊",
    ja:"ヤギ",       ko:"염소",         bn:"ছাগল",        hi:"बकरी",
    nl:"Geit",       pl:"Koza",         no:"Geit",        sv:"Get",
  },
  {
    name:"Donkey", emoji:"🫏", color:"#A1887F",
    fact:"Donkeys have a remarkable memory — they can recognise places they visited 25 years ago!",
    img:"https://images.unsplash.com/photo-1567201080580-bfcc97dae346?w=600&h=600&fit=crop&auto=format",
    es:"Burro",      fr:"Âne",          ar:"حمار",        de:"Esel",
    it:"Asino",      pt:"Burro",        ru:"Осёл",        zh:"驴",
    ja:"ロバ",       ko:"당나귀",       bn:"গাধা",        hi:"गधा",
    nl:"Ezel",       pl:"Osioł",        no:"Esel",        sv:"Åsna",
  },

  // ── Insectos & pequeños ────────────────────────────────────────
  {
    name:"Bee", emoji:"🐝", color:"#F9A825",
    fact:"A honey bee visits up to 5,000 flowers to make just one tablespoon of honey!",
    img:"https://images.unsplash.com/photo-1444927714506-5eDbe97c18b9?w=600&h=600&fit=crop&auto=format",
    es:"Abeja",      fr:"Abeille",      ar:"نحلة",        de:"Biene",
    it:"Ape",        pt:"Abelha",       ru:"Пчела",       zh:"蜜蜂",
    ja:"ハチ",       ko:"꿀벌",         bn:"মৌমাছি",      hi:"मधुमक्खी",
    nl:"Bij",        pl:"Pszczoła",     no:"Bie",         sv:"Bi",
  },
  {
    name:"Butterfly", emoji:"🦋", color:"#AB47BC",
    fact:"Butterflies taste with their feet — they have taste sensors on their legs!",
    img:"https://images.unsplash.com/photo-1550159930-40066082a4fc?w=600&h=600&fit=crop&auto=format",
    es:"Mariposa",   fr:"Papillon",     ar:"فراشة",       de:"Schmetterling",
    it:"Farfalla",   pt:"Borboleta",    ru:"Бабочка",     zh:"蝴蝶",
    ja:"チョウ",     ko:"나비",         bn:"প্রজাপতি",    hi:"तितली",
    nl:"Vlinder",    pl:"Motyl",        no:"Sommerfugl",  sv:"Fjäril",
  },
  {
    name:"Ladybug", emoji:"🐞", color:"#E53935",
    fact:"A ladybug can eat up to 5,000 aphids in its lifetime — nature's pest control!",
    img:"https://images.unsplash.com/photo-1567225477277-c8162eb7e4c8?w=600&h=600&fit=crop&auto=format",
    es:"Mariquita",  fr:"Coccinelle",   ar:"أبو العيد",   de:"Marienkäfer",
    it:"Coccinella", pt:"Joaninha",     ru:"Божья коровка",zh:"瓢虫",
    ja:"テントウムシ",ko:"무당벌레",    bn:"লেডিবার্ড",   hi:"लेडीबग",
    nl:"Lieveheersbeestje",pl:"Biedronka",no:"Marihøne",  sv:"Nyckelpiga",
  },


  // ── Aves exóticas ──────────────────────────────────────────────
  {
    name:"Eagle", emoji:"🦅", color:"#5D4037",
    fact:"Eagles can spot a rabbit from 3 kilometres away — their vision is 4× sharper than ours!",
    img:"https://images.unsplash.com/photo-1611689342806-0863700e8da4?w=600&h=600&fit=crop&auto=format",
    es:"Águila",     fr:"Aigle",        ar:"نسر",         de:"Adler",
    it:"Aquila",     pt:"Águia",        ru:"Орёл",        zh:"老鹰",
    ja:"ワシ",       ko:"독수리",       bn:"ঈগল",         hi:"ईगल",
    nl:"Adelaar",    pl:"Orzeł",        no:"Ørn",         sv:"Örn",
  },
  {
    name:"Peacock", emoji:"🦚", color:"#00838F",
    fact:"Only male peacocks have the dazzling tail feathers — females are plain brown!",
    img:"https://images.unsplash.com/photo-1518467166778-b88f373ffec7?w=600&h=600&fit=crop&auto=format",
    es:"Pavo real",  fr:"Paon",         ar:"طاووس",       de:"Pfau",
    it:"Pavone",     pt:"Pavão",        ru:"Павлин",      zh:"孔雀",
    ja:"クジャク",   ko:"공작",         bn:"ময়ূর",        hi:"मोर",
    nl:"Pauw",       pl:"Paw",          no:"Påfugl",      sv:"Påfågel",
  },
  {
    name:"Swan", emoji:"🦢", color:"#F5F5F5",
    fact:"Swans mate for life — pairs perform a beautiful heart-shaped greeting display!",
    img:"https://images.unsplash.com/photo-1468476396571-4d6f2a427ee7?w=600&h=600&fit=crop&auto=format",
    es:"Cisne",      fr:"Cygne",        ar:"بجعة",        de:"Schwan",
    it:"Cigno",      pt:"Cisne",        ru:"Лебедь",      zh:"天鹅",
    ja:"ハクチョウ", ko:"백조",         bn:"রাজহাঁস",     hi:"हंस",
    nl:"Zwaan",      pl:"Łabędź",       no:"Svane",       sv:"Svan",
  },

  {
    name:"Hummingbird", emoji:"🐦", color:"#00ACC1",
    fact:"Hummingbirds are the only birds that can fly backwards!",
    img:"https://images.unsplash.com/photo-1444464666168-49d633b86797?w=600&h=600&fit=crop&auto=format",
    es:"Colibrí",    fr:"Colibri",      ar:"طائر الطنان", de:"Kolibri",
    it:"Colibrì",    pt:"Beija-flor",   ru:"Колибри",     zh:"蜂鸟",
    ja:"ハチドリ",   ko:"벌새",         bn:"হামিংবার্ড",  hi:"हमिंगबर्ड",
    nl:"Kolibrie",   pl:"Koliber",      no:"Kolibri",     sv:"Kolibri",
  },

  // ── Marino ────────────────────────────────────────────────────
  {
    name:"Octopus", emoji:"🐙", color:"#6A1B9A",
    fact:"Octopuses have three hearts and blue blood — and they're master escape artists!",
    img:"https://images.unsplash.com/photo-1545671913-b89ac1b4ac10?w=600&h=600&fit=crop&auto=format",
    es:"Pulpo",      fr:"Pieuvre",      ar:"أخطبوط",      de:"Oktopus",
    it:"Polpo",      pt:"Polvo",        ru:"Осьминог",    zh:"章鱼",
    ja:"タコ",       ko:"문어",         bn:"অক্টোপাস",    hi:"ऑक्टोपस",
    nl:"Octopus",    pl:"Ośmiornica",   no:"Blekksprut",  sv:"Bläckfisk",
  },
  {
    name:"Turtle", emoji:"🐢", color:"#2E7D32",
    fact:"Sea turtles always return to the exact beach where they were born to lay eggs!",
    img:"https://images.unsplash.com/photo-1591025207163-942350e47db2?w=600&h=600&fit=crop&auto=format",
    es:"Tortuga",    fr:"Tortue",       ar:"سلحفاة",      de:"Schildkröte",
    it:"Tartaruga",  pt:"Tartaruga",    ru:"Черепаха",    zh:"乌龟",
    ja:"カメ",       ko:"거북이",       bn:"কচ্ছপ",       hi:"कछुआ",
    nl:"Schildpad",  pl:"Żółw",         no:"Skilpadde",   sv:"Sköldpadda",
  },
  {
    name:"Whale", emoji:"🐋", color:"#1565C0",
    fact:"Blue whales are the largest animals ever to exist — their heart is the size of a small car!",
    img:"https://images.unsplash.com/photo-1568043561616-0d00b00b6e8a?w=600&h=600&fit=crop&auto=format",
    es:"Ballena",    fr:"Baleine",      ar:"حوت",         de:"Wal",
    it:"Balena",     pt:"Baleia",       ru:"Кит",         zh:"鲸鱼",
    ja:"クジラ",     ko:"고래",         bn:"তিমি",        hi:"व्हेल",
    nl:"Walvis",     pl:"Wieloryb",     no:"Hval",        sv:"Val",
  },
  {
    name:"Jellyfish", emoji:"🪼", color:"#7986CB",
    fact:"Jellyfish have no brain, heart or bones — and have existed for 500 million years!",
    img:"https://images.unsplash.com/photo-1498049794561-7951567dea22?w=600&h=600&fit=crop&auto=format",
    es:"Medusa",     fr:"Méduse",       ar:"قنديل البحر", de:"Qualle",
    it:"Medusa",     pt:"Água-viva",    ru:"Медуза",      zh:"水母",
    ja:"クラゲ",     ko:"해파리",       bn:"জেলিফিশ",     hi:"जेलीफिश",
    nl:"Kwal",       pl:"Meduza",       no:"Manet",       sv:"Manet",
  },
  {
    name:"Seal", emoji:"🦭", color:"#607D8B",
    fact:"Seals can hold their breath for up to 2 hours when diving deep in the ocean!",
    img:"https://images.unsplash.com/photo-1607265698694-5f4e86c97e5c?w=600&h=600&fit=crop&auto=format",
    es:"Foca",       fr:"Phoque",       ar:"فقمة",        de:"Robbe",
    it:"Foca",       pt:"Foca",         ru:"Тюлень",      zh:"海豹",
    ja:"アザラシ",   ko:"물개",         bn:"সিল",         hi:"सील",
    nl:"Zeehond",    pl:"Foka",         no:"Sel",         sv:"Säl",
  },
  {
    name:"Crab", emoji:"🦀", color:"#E53935",
    fact:"Crabs have teeth in their stomachs — they use them to grind up food!",
    img:"https://images.unsplash.com/photo-1559827291-72c7d09aaec1?w=600&h=600&fit=crop&auto=format",
    es:"Cangrejo",   fr:"Crabe",        ar:"سرطان البحر", de:"Krabbe",
    it:"Granchio",   pt:"Caranguejo",   ru:"Краб",        zh:"螃蟹",
    ja:"カニ",       ko:"게",           bn:"কাঁকড়া",     hi:"केकड़ा",
    nl:"Krab",       pl:"Krab",         no:"Krabbe",      sv:"Krabba",
  },

  // ── Sabana & jungla ────────────────────────────────────────────
  {
    name:"Camel", emoji:"🐪", color:"#D4A017",
    fact:"Camels store fat in their humps — not water — which converts to energy when food is scarce!",
    img:"https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=600&h=600&fit=crop&auto=format",
    es:"Camello",    fr:"Chameau",      ar:"جمل",         de:"Kamel",
    it:"Cammello",   pt:"Camelo",       ru:"Верблюд",     zh:"骆驼",
    ja:"ラクダ",     ko:"낙타",         bn:"উট",          hi:"ऊंट",
    nl:"Kameel",     pl:"Wielbłąd",     no:"Kamel",       sv:"Kamel",
  },
  {
    name:"Hippo", emoji:"🦛", color:"#546E7A",
    fact:"Hippos secrete a pink oily liquid that acts as natural sunscreen and antiseptic!",
    img:"https://images.unsplash.com/photo-1501706362039-c06b2d715385?w=600&h=600&fit=crop&auto=format",
    es:"Hipopótamo", fr:"Hippopotame",  ar:"فرس النهر",   de:"Nilpferd",
    it:"Ippopotamo", pt:"Hipopótamo",   ru:"Гиппопотам",  zh:"河马",
    ja:"カバ",       ko:"하마",         bn:"জলহস্তী",     hi:"दरियाई घोड़ा",
    nl:"Nijlpaard",  pl:"Hipopotam",    no:"Flodhest",    sv:"Flodhäst",
  },
  {
    name:"Rhinoceros", emoji:"🦏", color:"#78909C",
    fact:"A rhino's horn is made of keratin — the same material as our fingernails!",
    img:"https://images.unsplash.com/photo-1484608856193-968d1c53a1bf?w=600&h=600&fit=crop&auto=format",
    es:"Rinoceronte",fr:"Rhinocéros",   ar:"وحيد القرن",  de:"Nashorn",
    it:"Rinoceronte",pt:"Rinoceronte",  ru:"Носорог",     zh:"犀牛",
    ja:"サイ",       ko:"코뿔소",       bn:"গণ্ডার",      hi:"गैंडा",
    nl:"Neushoorn",  pl:"Nosorożec",    no:"Neshorn",     sv:"Noshörning",
  },
  {
    name:"Gorilla", emoji:"🦍", color:"#37474F",
    fact:"Gorillas share 98.3% of their DNA with humans — they are our closest relatives after chimps!",
    img:"https://images.unsplash.com/photo-1598439210625-5067c578f3f6?w=600&h=600&fit=crop&auto=format",
    es:"Gorila",     fr:"Gorille",      ar:"غوريلا",      de:"Gorilla",
    it:"Gorilla",    pt:"Gorila",       ru:"Горилла",     zh:"大猩猩",
    ja:"ゴリラ",     ko:"고릴라",       bn:"গরিলা",       hi:"गोरिल्ला",
    nl:"Gorilla",    pl:"Goryl",        no:"Gorilla",     sv:"Gorilla",
  },
  {
    name:"Cheetah", emoji:"🐆", color:"#F57F17",
    fact:"The cheetah is the fastest land animal — it can go from 0 to 100 km/h in just 3 seconds!",
    img:"https://images.unsplash.com/photo-1557050543-4d5f997b7378?w=600&h=600&fit=crop&auto=format",
    es:"Guepardo",   fr:"Guépard",      ar:"فهد",         de:"Gepard",
    it:"Ghepardo",   pt:"Guepardo",     ru:"Гепард",      zh:"猎豹",
    ja:"チーター",   ko:"치타",         bn:"চিতা",        hi:"चीता",
    nl:"Jachtluipaard",pl:"Gepard",     no:"Gepard",      sv:"Gepard",
  },

  // ── Bosque & campo ─────────────────────────────────────────────
  {
    name:"Squirrel", emoji:"🐿️", color:"#8D6E63",
    fact:"Squirrels forget where they buried up to 74% of their nuts — accidentally planting trees!",
    img:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop&auto=format",
    es:"Ardilla",    fr:"Écureuil",     ar:"سنجاب",       de:"Eichhörnchen",
    it:"Scoiattolo", pt:"Esquilo",      ru:"Белка",       zh:"松鼠",
    ja:"リス",       ko:"다람쥐",       bn:"কাঠবিড়ালি",  hi:"गिलहरी",
    nl:"Eekhoorn",   pl:"Wiewiórka",    no:"Ekorn",       sv:"Ekorre",
  },
  {
    name:"Deer", emoji:"🦌", color:"#A1887F",
    fact:"A deer's antlers are the fastest-growing tissue of any mammal — up to 2.5 cm per day!",
    img:"https://images.unsplash.com/photo-1484824823965-ddc2afbfd5f3?w=600&h=600&fit=crop&auto=format",
    es:"Ciervo",     fr:"Cerf",         ar:"غزال",        de:"Hirsch",
    it:"Cervo",      pt:"Cervo",        ru:"Олень",       zh:"鹿",
    ja:"シカ",       ko:"사슴",         bn:"হরিণ",        hi:"हिरण",
    nl:"Hert",       pl:"Jeleń",        no:"Hjort",       sv:"Hjort",
  },
  {
    name:"Hedgehog", emoji:"🦔", color:"#795548",
    fact:"Hedgehogs are immune to many snake venoms — they can survive bites that would kill a dog!",
    img:"https://images.unsplash.com/photo-1444420045146-4dab29e03cbc?w=600&h=600&fit=crop&auto=format",
    es:"Erizo",      fr:"Hérisson",     ar:"قنفذ",        de:"Igel",
    it:"Riccio",     pt:"Ouriço",       ru:"Ёжик",        zh:"刺猬",
    ja:"ハリネズミ", ko:"고슴도치",     bn:"কাঁটাচুচু",   hi:"हेजहोग",
    nl:"Egel",       pl:"Jeż",          no:"Pinnsvin",    sv:"Igelkott",
  },
  {
    name:"Chameleon", emoji:"🦎", color:"#66BB6A",
    fact:"Chameleons change colour to communicate emotions — not just to camouflage themselves!",
    img:"https://images.unsplash.com/photo-1594005698519-ab8c4f3e4756?w=600&h=600&fit=crop&auto=format",
    es:"Camaleón",   fr:"Caméléon",     ar:"حرباء",       de:"Chamäleon",
    it:"Camaleonte", pt:"Camaleão",     ru:"Хамелеон",    zh:"变色龙",
    ja:"カメレオン", ko:"카멜레온",     bn:"গিরগিটি",     hi:"गिरगिट",
    nl:"Kameleon",   pl:"Kameleon",     no:"Kameleon",    sv:"Kameleont",
  },

]; // ── End of ANIMALS (50 total) ─────────────────────────────────────────────

// ── Puzzle helpers ───────────────────────────────────────────────────────────
function buildPuzzle(size) {
  const tiles = Array.from({length:size*size},(_,i)=>i);
  for (let i=tiles.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[tiles[i],tiles[j]]=[tiles[j],tiles[i]];}
  return tiles;
}
function isSolved(tiles){return tiles.every((t,i)=>t===i);}

// ── Speech ───────────────────────────────────────────────────────────────────
function speak(text, voice="en-US"){
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u=new SpeechSynthesisUtterance(text);
  u.lang=voice; u.rate=0.85; u.pitch=1.1;
  window.speechSynthesis.speak(u);
}

// ── Confetti ──────────────────────────────────────────────────────────────────
function Confetti({active}){
  const ps=Array.from({length:24},(_,i)=>({id:i,x:Math.random()*100,
    color:[C.blue,C.red,C.yellow,C.green,C.magenta,C.cyan][i%6],
    delay:Math.random()*0.5,size:Math.random()*10+7}));
  if (!active) return null;
  return <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
    {ps.map(p=><motion.div key={p.id} className="absolute rounded-sm top-0"
      style={{left:`${p.x}%`,width:p.size,height:p.size,background:p.color}}
      initial={{y:-20,opacity:1,rotate:0}} animate={{y:"110vh",opacity:0,rotate:720}}
      transition={{duration:1.5+Math.random(),delay:p.delay,ease:"easeIn"}}/>)}
  </div>;
}

// ── Language Dropdown ─────────────────────────────────────────────────────────
function LangDropdown({value, onChange}){
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
        style={{display:"flex",alignItems:"center",gap:8,padding:"9px 16px",borderRadius:999,
          border:"2.5px solid white",background:"rgba(255,255,255,0.92)",backdropFilter:"blur(8px)",
          boxShadow:"0 4px 16px rgba(67,160,71,0.18)",cursor:"pointer",
          fontFamily:"var(--font-display,'Nunito',sans-serif)",fontWeight:700,fontSize:13,color:C.green,
          whiteSpace:"nowrap",minWidth:165,justifyContent:"space-between"}}>
        <span style={{display:"flex",alignItems:"center",gap:6}}>
          <Globe size={13} style={{flexShrink:0}}/>
          <span style={{fontSize:18,lineHeight:1}}>{sel.flag}</span>
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
            width:210,background:"white",borderRadius:18,border:"2px solid rgba(67,160,71,0.15)",
            boxShadow:"0 16px 48px rgba(67,160,71,0.18)",overflow:"hidden",
            maxHeight:320,overflowY:"auto",scrollbarWidth:"thin"}}>
          <div style={{padding:"8px 14px 6px",borderBottom:"1.5px solid #E8F5E9",
            fontFamily:"var(--font-display,'Nunito',sans-serif)",fontWeight:700,fontSize:10,
            color:C.green,letterSpacing:"0.08em",textTransform:"uppercase",
            display:"flex",alignItems:"center",gap:5}}>
            <Globe size={10}/> Language
          </div>
          {LANGUAGES.map(l=>{
            const isA=l.code===value;
            return <button key={l.code} onClick={()=>{onChange(l.code);setOpen(false);}}
              style={{display:"flex",alignItems:"center",gap:9,width:"100%",padding:"8px 14px",
                border:"none",background:isA?C.greenSoft:"transparent",cursor:"pointer",
                fontFamily:"var(--font-body,'Nunito',sans-serif)",fontWeight:isA?700:500,fontSize:13,
                color:isA?C.green:"#374151",textAlign:"left",
                borderLeft:isA?`3px solid ${C.green}`:"3px solid transparent"}}
              onMouseEnter={e=>{if(!isA)e.currentTarget.style.background="#F1F8E9";}}
              onMouseLeave={e=>{if(!isA)e.currentTarget.style.background="transparent";}}>
              <span style={{fontSize:18,lineHeight:1,flexShrink:0}}>{l.flag}</span>
              <span style={{flex:1}}>{l.label}</span>
              {isA&&<span style={{width:6,height:6,borderRadius:"50%",background:C.green,flexShrink:0}}/>}
            </button>;
          })}
        </motion.div>}
      </AnimatePresence>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function AnimalPuzzle({ lang:propLang, onLangChange }){
  const [animalIdx,setAnimalIdx] = useState(0);
  const [gridSize,setGridSize]   = useState(3);
  const [tiles,setTiles]         = useState(()=>buildPuzzle(3));
  const [selected,setSelected]   = useState(null);
  const [dragOver,setDragOver]   = useState(null);
  const [won,setWon]             = useState(false);
  const [confetti,setConfetti]   = useState(false);
  const [localLang,setLocalLang] = useState("es");
  const [moves,setMoves]         = useState(0);
  const [imgLoaded,setImgLoaded] = useState(false);
  const GRID_PX = 288;

  const lang    = propLang || localLang;
  const setLang = v=>{ setLocalLang(v); onLangChange?.(v); };

  const langMeta = LANGUAGES.find(l=>l.code===lang)||LANGUAGES[0];
  const animal   = ANIMALS[animalIdx];

  const reset=useCallback((aIdx=animalIdx,gSize=gridSize)=>{
    setTiles(buildPuzzle(gSize)); setSelected(null); setDragOver(null);
    setWon(false); setMoves(0); setImgLoaded(false);
  },[animalIdx,gridSize]);

  useEffect(()=>{ reset(animalIdx,gridSize); },[animalIdx,gridSize]);

  const handleTileDown=idx=>{
    if (won) return;
    if (selected===null){setSelected(idx);}
    else {
      const t=[...tiles]; [t[selected],t[idx]]=[t[idx],t[selected]];
      setTiles(t); setMoves(m=>m+1); setSelected(null); setDragOver(null);
      if (isSolved(t)) setTimeout(()=>{setWon(true);setConfetti(true);setTimeout(()=>setConfetti(false),2500);},200);
    }
  };

  const prev=()=>setAnimalIdx(i=>(i-1+ANIMALS.length)%ANIMALS.length);
  const next=()=>setAnimalIdx(i=>(i+1)%ANIMALS.length);

  // ── UI ─────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen" style={{background:"linear-gradient(150deg,#E8F5E9 0%,#FFFDE7 50%,#E3F2FD 100%)"}}>
      <Confetti active={confetti}/>

      {/* Header */}
      <div className="text-center py-10 px-4">
        <motion.div initial={{scale:0.8,opacity:0}} animate={{scale:1,opacity:1}} transition={{type:"spring"}}
          className="text-6xl mb-3 inline-block">🧩</motion.div>
        <motion.h1 initial={{opacity:0,y:-12}} animate={{opacity:1,y:0}}
          className="font-display text-4xl md:text-5xl mb-2" style={{color:C.green}}>Animal Puzzle</motion.h1>
        <p className="font-body text-slate-500 text-lg">Tap two pieces to swap them — build the animal! 🎨</p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap justify-center gap-3 px-4 mb-6">
        {/* Grid size */}
        <div className="flex bg-white/80 rounded-full p-1 shadow-sm gap-1">
          {[3,4].map(s=>(
            <button key={s} onClick={()=>setGridSize(s)}
              className="px-5 py-2 rounded-full font-display text-sm transition-all"
              style={{background:gridSize===s?C.green:"transparent",color:gridSize===s?"white":"#6B7280"}}>
              {s}×{s}
            </button>
          ))}
        </div>
        {/* Lang dropdown */}
        <LangDropdown value={lang} onChange={setLang}/>
      </div>

      <div className="max-w-4xl mx-auto px-4 pb-20">
        <div className="grid md:grid-cols-2 gap-8 items-start">

          {/* Left — Puzzle */}
          <div className="flex flex-col items-center">
            {/* Animal nav */}
            <div className="flex items-center gap-4 mb-5 bg-white/80 rounded-full px-5 py-3 shadow-sm">
              <motion.button whileHover={{scale:1.1}} whileTap={{scale:0.9}} onClick={prev}
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{background:C.green,color:"white"}}><ChevronLeft size={18}/></motion.button>
              <div className="text-center">
                <div className="font-display text-xl" style={{color:C.green}}>{animal.emoji} {animal.name}</div>
                <div className="font-body text-sm text-slate-400" dir={langMeta.dir}>{animal[lang]||animal.name}</div>
              </div>
              <motion.button whileHover={{scale:1.1}} whileTap={{scale:0.9}} onClick={next}
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{background:C.green,color:"white"}}><ChevronRight size={18}/></motion.button>
            </div>

            {/* Stats */}
            <div className="flex gap-3 mb-4">
              <div className="px-4 py-2 bg-white rounded-full font-display text-sm shadow-sm" style={{color:C.green}}>
                🎯 {moves} swaps
              </div>
              {won&&<motion.div initial={{scale:0}} animate={{scale:1}}
                className="px-4 py-2 rounded-full font-display text-sm text-white shadow-lg"
                style={{background:C.green}}>🏆 Solved!</motion.div>}
            </div>

            {/* Win banner */}
            <AnimatePresence>
              {won&&<motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                className="w-full text-center py-4 rounded-3xl font-display text-xl text-white mb-4 shadow-lg"
                style={{background:`linear-gradient(135deg,${C.green},#1B5E20)`}}>
                🎉 You built the {animal.name}! Amazing!
              </motion.div>}
            </AnimatePresence>

            {/* Puzzle grid */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white"
              style={{width:GRID_PX,height:GRID_PX,background:C.blueSoft}}>
              <img src={animal.img} alt="" className="hidden" onLoad={()=>setImgLoaded(true)}/>
              {!imgLoaded&&<div className="absolute inset-0 flex items-center justify-center">
                <motion.div animate={{rotate:360}} transition={{duration:1,repeat:Infinity,ease:"linear"}}
                  className="text-4xl">{animal.emoji}</motion.div>
              </div>}
              {imgLoaded&&<div className="grid gap-0.5 p-0.5"
                style={{gridTemplateColumns:`repeat(${gridSize},1fr)`,width:"100%",height:"100%",background:"#CBD5E1"}}>
                {tiles.map((tile,idx)=>{
                  const srcCol=tile%gridSize, srcRow=Math.floor(tile/gridSize);
                  const isSel=selected===idx, isDO=dragOver===idx;
                  return <motion.div key={idx}
                    className="relative cursor-pointer overflow-hidden rounded-sm border-2 transition-all"
                    style={{borderColor:isSel?C.yellow:isDO?C.green:"transparent",
                      boxShadow:isSel?`0 0 0 2px ${C.yellow},0 4px 16px rgba(0,0,0,0.3)`:"none",zIndex:isSel?10:1}}
                    whileHover={{scale:won?1:1.04}} whileTap={{scale:won?1:0.95}}
                    onClick={()=>handleTileDown(idx)}
                    onMouseEnter={()=>{if(selected!==null&&selected!==idx)setDragOver(idx);}}
                    onMouseLeave={()=>setDragOver(null)}>
                    <div className="w-full h-full" style={{
                      backgroundImage:`url(${animal.img})`,backgroundSize:`${gridSize*100}%`,
                      backgroundPosition:`${srcCol*100/Math.max(gridSize-1,1)}% ${srcRow*100/Math.max(gridSize-1,1)}%`,
                      backgroundRepeat:"no-repeat",aspectRatio:"1"}}/>
                    {!won&&<div className="absolute bottom-0.5 right-0.5 w-4 h-4 rounded-full flex items-center justify-center text-white font-display"
                      style={{background:"rgba(0,0,0,0.25)",fontSize:9}}>{tile+1}</div>}
                  </motion.div>;
                })}
              </div>}
            </div>

            {/* Reference */}
            <div className="mt-4 flex items-center gap-3">
              <div className="rounded-2xl overflow-hidden border-2 border-white shadow-md" style={{width:64,height:64}}>
                <img src={animal.img} alt={animal.name} className="w-full h-full object-cover"/>
              </div>
              <p className="font-body text-xs text-slate-400">Reference image</p>
            </div>

            <motion.button whileHover={{scale:1.04}} whileTap={{scale:0.96}} onClick={()=>reset()}
              className="mt-4 flex items-center gap-2 px-6 py-3 rounded-2xl font-display text-white shadow-md"
              style={{background:C.red}}><RotateCcw size={16}/> Shuffle</motion.button>
          </div>

          {/* Right — Info */}
          <div className="space-y-4">
            <h3 className="font-display text-2xl" style={{color:C.green}}>{animal.emoji} {animal.name}</h3>

            {/* How to say it — muestra idioma activo + inglés */}
            <div className="bg-white/90 rounded-3xl p-6 shadow-md border-2 border-white">
              <h4 className="font-display text-base mb-3 text-slate-500">How to say it</h4>

              {/* Active language highlighted */}
              <div className="flex items-center justify-between py-3 px-4 rounded-2xl mb-2"
                style={{background:C.greenSoft,border:`2px solid ${C.green}`}}>
                <div className="flex items-center gap-2">
                  <span style={{fontSize:20}}>{langMeta.flag}</span>
                  <span className="font-body text-sm text-slate-500">{langMeta.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-display text-xl" style={{color:C.green}} dir={langMeta.dir}>
                    {animal[lang]||animal.name}
                  </span>
                  <button onClick={()=>speak(animal[lang]||animal.name, langMeta.voice)}
                    className="w-7 h-7 rounded-full flex items-center justify-center"
                    style={{background:C.green,color:"white"}}><Volume2 size={13}/></button>
                </div>
              </div>

              {/* English always */}
              <div className="flex items-center justify-between py-2.5">
                <span className="font-body text-sm text-slate-400">English 🇬🇧</span>
                <div className="flex items-center gap-2">
                  <span className="font-display text-lg" style={{color:C.blue}}>{animal.name}</span>
                  <button onClick={()=>speak(animal.name,"en-US")}
                    className="w-7 h-7 rounded-full flex items-center justify-center"
                    style={{background:C.blueSoft,color:C.blue}}><Volume2 size={13}/></button>
                </div>
              </div>

              {/* 3 other langs as teasers */}
              {LANGUAGES.filter(l=>l.code!==lang).slice(0,3).map(l=>(
                <div key={l.code} className="flex items-center justify-between py-2 border-t border-slate-50">
                  <span className="font-body text-sm text-slate-300">{l.flag} {l.label}</span>
                  <span className="font-body text-sm text-slate-400" dir={l.dir}>{animal[l.code]||""}</span>
                </div>
              ))}
            </div>

            {/* Fun fact */}
            <div className="rounded-3xl p-5 border-2 border-white shadow-sm" style={{background:C.yellowSoft}}>
              <div className="font-display text-sm mb-1" style={{color:C.yellow}}>🌟 Fun fact!</div>
              <p className="font-body text-slate-600 text-sm leading-relaxed">{animal.fact}</p>
            </div>

            {/* Gallery */}
            <div>
              <h4 className="font-display text-base mb-3" style={{color:C.green}}>More animals</h4>
              <div className="grid grid-cols-4 gap-2">
                {ANIMALS.map((a,i)=>(
                  <motion.button key={i} whileHover={{scale:1.08}} whileTap={{scale:0.94}}
                    onClick={()=>setAnimalIdx(i)}
                    className="aspect-square rounded-2xl overflow-hidden"
                    style={{border:animalIdx===i?`3px solid ${C.green}`:"3px solid white",
                      boxShadow:animalIdx===i?`0 0 0 2px ${C.green}`:"0 2px 8px rgba(0,0,0,0.08)"}}>
                    <img src={a.img} alt={a.name} className="w-full h-full object-cover"/>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* How to play */}
            <div className="rounded-3xl p-4 border-2 border-white shadow-sm" style={{background:C.blueSoft}}>
              <p className="font-display text-sm mb-1" style={{color:C.blue}}>💡 How to play</p>
              <p className="font-body text-xs text-slate-600">
                Tap a piece to select it (it glows yellow), then tap another to swap. Keep swapping until you build the complete animal!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
