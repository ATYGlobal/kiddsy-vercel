/**
 * src/pages/WordSearch.jsx — Kiddsy
 * ────────────────────────────────────────────────────────────────────────
 * ✅ 20 palabras por partida (grid 14×14)
 * ✅ Cards compactas en cuadrícula 2 col móvil / 3 col desktop
 * ✅ 16 idiomas con dropdown elegante
 * ✅ Acepta props lang / onLangChange desde App.jsx
 * ────────────────────────────────────────────────────────────────────────
 */
import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, CheckCircle, ChevronDown, Globe } from "lucide-react";

const C = {
  blue:       "#1565C0",
  blueSoft:   "#E3F2FD",
  red:        "#E53935",
  yellow:     "#F9A825",
  yellowSoft: "#FFFDE7",
  green:      "#43A047",
  magenta:    "#D81B60",
  cyan:       "#00ACC1",
};

// ── 16 idiomas ────────────────────────────────────────────────────────────
const LANGUAGES = [
  { code:"es", label:"Español",    flag:"🇪🇸", dir:"ltr" },
  { code:"fr", label:"Français",   flag:"🇫🇷", dir:"ltr" },
  { code:"ar", label:"العربية",    flag:"🇸🇦", dir:"rtl" },
  { code:"de", label:"Deutsch",    flag:"🇩🇪", dir:"ltr" },
  { code:"it", label:"Italiano",   flag:"🇮🇹", dir:"ltr" },
  { code:"pt", label:"Português",  flag:"🇧🇷", dir:"ltr" },
  { code:"ru", label:"Русский",    flag:"🇷🇺", dir:"ltr" },
  { code:"zh", label:"中文",        flag:"🇨🇳", dir:"ltr" },
  { code:"ja", label:"日本語",      flag:"🇯🇵", dir:"ltr" },
  { code:"ko", label:"한국어",      flag:"🇰🇷", dir:"ltr" },
  { code:"bn", label:"বাংলা",     flag:"🇧🇩", dir:"ltr" },
  { code:"hi", label:"हिंदी",     flag:"🇮🇳", dir:"ltr" },
  { code:"nl", label:"Nederlands", flag:"🇳🇱", dir:"ltr" },
  { code:"pl", label:"Polski",     flag:"🇵🇱", dir:"ltr" },
  { code:"no", label:"Norsk",      flag:"🇳🇴", dir:"ltr" },
  { code:"sv", label:"Svenska",    flag:"🇸🇪", dir:"ltr" },
];

// ── 20 colores cíclicos para palabras ─────────────────────────────────────
const WORD_COLORS = [
  { bg:"#FFF9C4", border:"#F9A825", text:"#E65100" },
  { bg:"#C8E6C9", border:"#43A047", text:"#1B5E20" },
  { bg:"#BBDEFB", border:"#1565C0", text:"#0D47A1" },
  { bg:"#F8BBD0", border:"#D81B60", text:"#880E4F" },
  { bg:"#B2EBF2", border:"#00ACC1", text:"#006064" },
  { bg:"#E1BEE7", border:"#8E24AA", text:"#4A148C" },
  { bg:"#FFE0B2", border:"#EF6C00", text:"#BF360C" },
  { bg:"#DCEDC8", border:"#7CB342", text:"#33691E" },
  { bg:"#B3E5FC", border:"#0288D1", text:"#01579B" },
  { bg:"#FCE4EC", border:"#EC407A", text:"#880E4F" },
  { bg:"#E8F5E9", border:"#66BB6A", text:"#1B5E20" },
  { bg:"#FFF3E0", border:"#FFA726", text:"#E65100" },
  { bg:"#E3F2FD", border:"#42A5F5", text:"#0D47A1" },
  { bg:"#F3E5F5", border:"#AB47BC", text:"#4A148C" },
  { bg:"#E0F7FA", border:"#26C6DA", text:"#006064" },
  { bg:"#FBE9E7", border:"#FF7043", text:"#BF360C" },
  { bg:"#F9FBE7", border:"#D4E157", text:"#827717" },
  { bg:"#E8EAF6", border:"#5C6BC0", text:"#1A237E" },
  { bg:"#FFF8E1", border:"#FFCA28", text:"#F57F17" },
  { bg:"#E0F2F1", border:"#26A69A", text:"#004D40" },
];

// ── Packs de 20 palabras, 16 idiomas ──────────────────────────────────────
const PACKS = [
  {
    name:"Animals 🐾", emoji:"🦁",
    words:[
      { en:"CAT",      es:"Gato",      fr:"Chat",      ar:"قطة",    de:"Katze",    it:"Gatto",    pt:"Gato",     ru:"Кошка",   zh:"猫",    ja:"ネコ",     ko:"고양이",   bn:"বিড়াল",  hi:"बिल्ली",  nl:"Kat",      pl:"Kot",      no:"Katt",    sv:"Katt"   },
      { en:"DOG",      es:"Perro",     fr:"Chien",     ar:"كلب",    de:"Hund",     it:"Cane",     pt:"Cão",      ru:"Собака",  zh:"狗",    ja:"イヌ",     ko:"개",       bn:"কুকুর",   hi:"कुत्ता",  nl:"Hond",     pl:"Pies",     no:"Hund",    sv:"Hund"   },
      { en:"FISH",     es:"Pez",       fr:"Poisson",   ar:"سمكة",   de:"Fisch",    it:"Pesce",    pt:"Peixe",    ru:"Рыба",    zh:"鱼",    ja:"サカナ",   ko:"물고기",   bn:"মাছ",     hi:"मछली",    nl:"Vis",      pl:"Ryba",     no:"Fisk",    sv:"Fisk"   },
      { en:"BIRD",     es:"Pájaro",    fr:"Oiseau",    ar:"طائر",   de:"Vogel",    it:"Uccello",  pt:"Pássaro",  ru:"Птица",   zh:"鸟",    ja:"トリ",     ko:"새",       bn:"পাখি",    hi:"पक्षी",   nl:"Vogel",    pl:"Ptak",     no:"Fugl",    sv:"Fågel"  },
      { en:"LION",     es:"León",      fr:"Lion",      ar:"أسد",    de:"Löwe",     it:"Leone",    pt:"Leão",     ru:"Лев",     zh:"狮子",  ja:"ライオン", ko:"사자",     bn:"সিংহ",    hi:"शेर",     nl:"Leeuw",    pl:"Lew",      no:"Løve",    sv:"Lejon"  },
      { en:"BEAR",     es:"Oso",       fr:"Ours",      ar:"دب",     de:"Bär",      it:"Orso",     pt:"Urso",     ru:"Медведь", zh:"熊",    ja:"クマ",     ko:"곰",       bn:"ভালুক",   hi:"भालू",    nl:"Beer",     pl:"Niedźwiedź",no:"Bjørn",  sv:"Björn"  },
      { en:"WOLF",     es:"Lobo",      fr:"Loup",      ar:"ذئب",    de:"Wolf",     it:"Lupo",     pt:"Lobo",     ru:"Волк",    zh:"狼",    ja:"オオカミ", ko:"늑대",     bn:"নেকড়া",  hi:"भेड़िया",  nl:"Wolf",     pl:"Wilk",     no:"Ulv",     sv:"Varg"   },
      { en:"FOX",      es:"Zorro",     fr:"Renard",    ar:"ثعلب",   de:"Fuchs",    it:"Volpe",    pt:"Raposa",   ru:"Лиса",    zh:"狐狸",  ja:"キツネ",   ko:"여우",     bn:"শেয়াল",  hi:"लोमड़ी",  nl:"Vos",      pl:"Lis",      no:"Rev",     sv:"Räv"    },
      { en:"FROG",     es:"Rana",      fr:"Grenouille",ar:"ضفدع",   de:"Frosch",   it:"Rana",     pt:"Sapo",     ru:"Лягушка", zh:"青蛙",  ja:"カエル",   ko:"개구리",   bn:"ব্যাঙ",   hi:"मेंढक",   nl:"Kikker",   pl:"Żaba",     no:"Frosk",   sv:"Groda"  },
      { en:"DUCK",     es:"Pato",      fr:"Canard",    ar:"بطة",    de:"Ente",     it:"Anatra",   pt:"Pato",     ru:"Утка",    zh:"鸭子",  ja:"アヒル",   ko:"오리",     bn:"হাঁস",    hi:"बतख",     nl:"Eend",     pl:"Kaczka",   no:"And",     sv:"Anka"   },
      { en:"OWL",      es:"Búho",      fr:"Hibou",     ar:"بومة",   de:"Eule",     it:"Gufo",     pt:"Coruja",   ru:"Сова",    zh:"猫头鹰",ja:"フクロウ", ko:"부엉이",   bn:"পেঁচা",   hi:"उल्लू",   nl:"Uil",      pl:"Sowa",     no:"Ugle",    sv:"Uggla"  },
      { en:"DEER",     es:"Ciervo",    fr:"Cerf",      ar:"غزال",   de:"Hirsch",   it:"Cervo",    pt:"Cervo",    ru:"Олень",   zh:"鹿",    ja:"シカ",     ko:"사슴",     bn:"হরিণ",    hi:"हिरण",    nl:"Hert",     pl:"Jeleń",    no:"Hjort",   sv:"Hjort"  },
      { en:"SNAKE",    es:"Serpiente", fr:"Serpent",   ar:"ثعبان",  de:"Schlange", it:"Serpente", pt:"Cobra",    ru:"Змея",    zh:"蛇",    ja:"ヘビ",     ko:"뱀",       bn:"সাপ",     hi:"सांप",    nl:"Slang",    pl:"Wąż",      no:"Slange",  sv:"Orm"    },
      { en:"HORSE",    es:"Caballo",   fr:"Cheval",    ar:"حصان",   de:"Pferd",    it:"Cavallo",  pt:"Cavalo",   ru:"Лошадь",  zh:"马",    ja:"ウマ",     ko:"말",       bn:"ঘোড়া",   hi:"घोड़ा",   nl:"Paard",    pl:"Koń",      no:"Hest",    sv:"Häst"   },
      { en:"COW",      es:"Vaca",      fr:"Vache",     ar:"بقرة",   de:"Kuh",      it:"Mucca",    pt:"Vaca",     ru:"Корова",  zh:"牛",    ja:"ウシ",     ko:"소",       bn:"গরু",     hi:"गाय",     nl:"Koe",      pl:"Krowa",    no:"Ku",      sv:"Ko"     },
      { en:"PIG",      es:"Cerdo",     fr:"Cochon",    ar:"خنزير",  de:"Schwein",  it:"Maiale",   pt:"Porco",    ru:"Свинья",  zh:"猪",    ja:"ブタ",     ko:"돼지",     bn:"শূকর",    hi:"सूअर",    nl:"Varken",   pl:"Świnia",   no:"Gris",    sv:"Gris"   },
      { en:"HEN",      es:"Gallina",   fr:"Poule",     ar:"دجاجة",  de:"Henne",    it:"Gallina",  pt:"Galinha",  ru:"Курица",  zh:"母鸡",  ja:"めんどり", ko:"암탉",     bn:"মুরগি",   hi:"मुर्गी",  nl:"Kip",      pl:"Kura",     no:"Høne",    sv:"Höna"   },
      { en:"BEE",      es:"Abeja",     fr:"Abeille",   ar:"نحلة",   de:"Biene",    it:"Ape",      pt:"Abelha",   ru:"Пчела",   zh:"蜜蜂",  ja:"ハチ",     ko:"꿀벌",     bn:"মৌমাছি",  hi:"मधुमक्खी",nl:"Bij",      pl:"Pszczoła", no:"Bie",     sv:"Bi"     },
      { en:"ANT",      es:"Hormiga",   fr:"Fourmi",    ar:"نملة",   de:"Ameise",   it:"Formica",  pt:"Formiga",  ru:"Муравей", zh:"蚂蚁",  ja:"アリ",     ko:"개미",     bn:"পিঁপড়া",  hi:"चींटी",   nl:"Mier",     pl:"Mrówka",   no:"Maur",    sv:"Myra"   },
      { en:"CRAB",     es:"Cangrejo",  fr:"Crabe",     ar:"سرطان",  de:"Krabbe",   it:"Granchio", pt:"Caranguejo",ru:"Краб",   zh:"螃蟹",  ja:"カニ",     ko:"게",       bn:"কাঁকড়া", hi:"केकड़ा",  nl:"Krab",     pl:"Krab",     no:"Krabbe",  sv:"Krabba" },
    ],
  },
  {
    name:"Nature 🌿", emoji:"🌳",
    words:[
      { en:"TREE",     es:"Árbol",     fr:"Arbre",     ar:"شجرة",   de:"Baum",     it:"Albero",   pt:"Árvore",   ru:"Дерево",  zh:"树",    ja:"き",       ko:"나무",     bn:"গাছ",     hi:"पेड़",    nl:"Boom",     pl:"Drzewo",   no:"Tre",     sv:"Träd"   },
      { en:"FLOWER",   es:"Flor",      fr:"Fleur",     ar:"زهرة",   de:"Blume",    it:"Fiore",    pt:"Flor",     ru:"Цветок",  zh:"花",    ja:"ハナ",     ko:"꽃",       bn:"ফুল",     hi:"फूल",     nl:"Bloem",    pl:"Kwiat",    no:"Blomst",  sv:"Blomma" },
      { en:"SUN",      es:"Sol",       fr:"Soleil",    ar:"شمس",    de:"Sonne",    it:"Sole",     pt:"Sol",      ru:"Солнце",  zh:"太阳",  ja:"たいよう", ko:"태양",     bn:"সূর্য",   hi:"सूरज",    nl:"Zon",      pl:"Słońce",   no:"Sol",     sv:"Sol"    },
      { en:"MOON",     es:"Luna",      fr:"Lune",      ar:"قمر",    de:"Mond",     it:"Luna",     pt:"Lua",      ru:"Луна",    zh:"月亮",  ja:"ツキ",     ko:"달",       bn:"চাঁদ",    hi:"चाँद",    nl:"Maan",     pl:"Księżyc",  no:"Måne",    sv:"Måne"   },
      { en:"STAR",     es:"Estrella",  fr:"Étoile",    ar:"نجمة",   de:"Stern",    it:"Stella",   pt:"Estrela",  ru:"Звезда",  zh:"星星",  ja:"ホシ",     ko:"별",       bn:"তারা",    hi:"तारा",    nl:"Ster",     pl:"Gwiazda",  no:"Stjerne", sv:"Stjärna"},
      { en:"RAIN",     es:"Lluvia",    fr:"Pluie",     ar:"مطر",    de:"Regen",    it:"Pioggia",  pt:"Chuva",    ru:"Дождь",   zh:"雨",    ja:"アメ",     ko:"비",       bn:"বৃষ্টি",  hi:"बारिश",   nl:"Regen",    pl:"Deszcz",   no:"Regn",    sv:"Regn"   },
      { en:"SNOW",     es:"Nieve",     fr:"Neige",     ar:"ثلج",    de:"Schnee",   it:"Neve",     pt:"Neve",     ru:"Снег",    zh:"雪",    ja:"ゆき",     ko:"눈",       bn:"তুষার",   hi:"बर्फ",    nl:"Sneeuw",   pl:"Śnieg",    no:"Snø",     sv:"Snö"    },
      { en:"CLOUD",    es:"Nube",      fr:"Nuage",     ar:"سحابة",  de:"Wolke",    it:"Nuvola",   pt:"Nuvem",    ru:"Облако",  zh:"云",    ja:"くも",     ko:"구름",     bn:"মেঘ",     hi:"बादल",    nl:"Wolk",     pl:"Chmura",   no:"Sky",     sv:"Moln"   },
      { en:"WIND",     es:"Viento",    fr:"Vent",      ar:"ريح",    de:"Wind",     it:"Vento",    pt:"Vento",    ru:"Ветер",   zh:"风",    ja:"カゼ",     ko:"바람",     bn:"বাতাস",   hi:"हवा",     nl:"Wind",     pl:"Wiatr",    no:"Vind",    sv:"Vind"   },
      { en:"RIVER",    es:"Río",       fr:"Rivière",   ar:"نهر",    de:"Fluss",    it:"Fiume",    pt:"Rio",      ru:"Река",    zh:"河流",  ja:"カワ",     ko:"강",       bn:"নদী",     hi:"नदी",     nl:"Rivier",   pl:"Rzeka",    no:"Elv",     sv:"Flod"   },
      { en:"OCEAN",    es:"Océano",    fr:"Océan",     ar:"محيط",   de:"Ozean",    it:"Oceano",   pt:"Oceano",   ru:"Океан",   zh:"海洋",  ja:"タイヨウ", ko:"바다",     bn:"সমুদ্র",  hi:"समुद्र",  nl:"Oceaan",   pl:"Ocean",    no:"Hav",     sv:"Hav"    },
      { en:"MOUNTAIN", es:"Montaña",   fr:"Montagne",  ar:"جبل",    de:"Berg",     it:"Montagna", pt:"Montanha", ru:"Гора",    zh:"山",    ja:"ヤマ",     ko:"산",       bn:"পাহাড়",  hi:"पहाड़",   nl:"Berg",     pl:"Góra",     no:"Fjell",   sv:"Berg"   },
      { en:"FOREST",   es:"Bosque",    fr:"Forêt",     ar:"غابة",   de:"Wald",     it:"Foresta",  pt:"Floresta", ru:"Лес",     zh:"森林",  ja:"もり",     ko:"숲",       bn:"বন",      hi:"जंगल",    nl:"Bos",      pl:"Las",      no:"Skog",    sv:"Skog"   },
      { en:"GRASS",    es:"Hierba",    fr:"Herbe",     ar:"عشب",    de:"Gras",     it:"Erba",     pt:"Grama",    ru:"Трава",   zh:"草",    ja:"くさ",     ko:"풀",       bn:"ঘাস",     hi:"घास",     nl:"Gras",     pl:"Trawa",    no:"Gress",   sv:"Gräs"   },
      { en:"SAND",     es:"Arena",     fr:"Sable",     ar:"رمل",    de:"Sand",     it:"Sabbia",   pt:"Areia",    ru:"Песок",   zh:"沙子",  ja:"スナ",     ko:"모래",     bn:"বালু",    hi:"रेत",     nl:"Zand",     pl:"Piasek",   no:"Sand",    sv:"Sand"   },
      { en:"ROCK",     es:"Roca",      fr:"Roche",     ar:"صخرة",   de:"Fels",     it:"Roccia",   pt:"Rocha",    ru:"Скала",   zh:"岩石",  ja:"いわ",     ko:"바위",     bn:"পাথর",    hi:"पत्थर",   nl:"Rots",     pl:"Skała",    no:"Stein",   sv:"Sten"   },
      { en:"LEAF",     es:"Hoja",      fr:"Feuille",   ar:"ورقة",   de:"Blatt",    it:"Foglia",   pt:"Folha",    ru:"Лист",    zh:"叶子",  ja:"は",       ko:"잎",       bn:"পাতা",    hi:"पत्ती",   nl:"Blad",     pl:"Liść",     no:"Blad",    sv:"Löv"    },
      { en:"SEED",     es:"Semilla",   fr:"Graine",    ar:"بذرة",   de:"Samen",    it:"Seme",     pt:"Semente",  ru:"Семя",    zh:"种子",  ja:"タネ",     ko:"씨앗",     bn:"বীজ",     hi:"बीज",     nl:"Zaad",     pl:"Nasiono",  no:"Frø",     sv:"Frö"    },
      { en:"CAVE",     es:"Cueva",     fr:"Grotte",    ar:"كهف",    de:"Höhle",    it:"Grotta",   pt:"Caverna",  ru:"Пещера",  zh:"山洞",  ja:"ほら穴",   ko:"동굴",     bn:"গুহা",    hi:"गुफा",    nl:"Grot",     pl:"Jaskinia", no:"Hule",    sv:"Grotta" },
      { en:"LAKE",     es:"Lago",      fr:"Lac",       ar:"بحيرة",  de:"See",      it:"Lago",     pt:"Lago",     ru:"Озеро",   zh:"湖泊",  ja:"みずうみ", ko:"호수",     bn:"হ্রদ",    hi:"झील",     nl:"Meer",     pl:"Jezioro",  no:"Innsjø",  sv:"Sjö"    },
    ],
  },
  {
    name:"Food 🍎", emoji:"🥦",
    words:[
      { en:"APPLE",    es:"Manzana",   fr:"Pomme",     ar:"تفاحة",  de:"Apfel",    it:"Mela",     pt:"Maçã",     ru:"Яблоко",  zh:"苹果",  ja:"リンゴ",   ko:"사과",     bn:"আপেল",    hi:"सेब",     nl:"Appel",    pl:"Jabłko",   no:"Eple",    sv:"Äpple"  },
      { en:"BREAD",    es:"Pan",       fr:"Pain",      ar:"خبز",    de:"Brot",     it:"Pane",     pt:"Pão",      ru:"Хлеб",    zh:"面包",  ja:"パン",     ko:"빵",       bn:"রুটি",    hi:"रोटी",    nl:"Brood",    pl:"Chleb",    no:"Brød",    sv:"Bröd"   },
      { en:"MILK",     es:"Leche",     fr:"Lait",      ar:"حليب",   de:"Milch",    it:"Latte",    pt:"Leite",    ru:"Молоко",  zh:"牛奶",  ja:"ミルク",   ko:"우유",     bn:"দুধ",     hi:"दूध",     nl:"Melk",     pl:"Mleko",    no:"Melk",    sv:"Mjölk"  },
      { en:"RICE",     es:"Arroz",     fr:"Riz",       ar:"أرز",    de:"Reis",     it:"Riso",     pt:"Arroz",    ru:"Рис",     zh:"米饭",  ja:"コメ",     ko:"쌀",       bn:"চাল",     hi:"चावल",    nl:"Rijst",    pl:"Ryż",      no:"Ris",     sv:"Ris"    },
      { en:"EGG",      es:"Huevo",     fr:"Œuf",       ar:"بيضة",   de:"Ei",       it:"Uovo",     pt:"Ovo",      ru:"Яйцо",    zh:"鸡蛋",  ja:"タマゴ",   ko:"달걀",     bn:"ডিম",     hi:"अंडा",    nl:"Ei",       pl:"Jajko",    no:"Egg",     sv:"Ägg"    },
      { en:"SOUP",     es:"Sopa",      fr:"Soupe",     ar:"شوربة",  de:"Suppe",    it:"Zuppa",    pt:"Sopa",     ru:"Суп",     zh:"汤",    ja:"スープ",   ko:"수프",     bn:"স্যুপ",  hi:"सूप",     nl:"Soep",     pl:"Zupa",     no:"Suppe",   sv:"Soppa"  },
      { en:"CAKE",     es:"Pastel",    fr:"Gâteau",    ar:"كعكة",   de:"Kuchen",   it:"Torta",    pt:"Bolo",     ru:"Торт",    zh:"蛋糕",  ja:"ケーキ",   ko:"케이크",   bn:"কেক",     hi:"केक",     nl:"Taart",    pl:"Ciasto",   no:"Kake",    sv:"Tårta"  },
      { en:"PASTA",    es:"Pasta",     fr:"Pâtes",     ar:"معكرونة",de:"Nudeln",   it:"Pasta",    pt:"Macarrão", ru:"Паста",   zh:"面条",  ja:"パスタ",   ko:"파스타",   bn:"পাস্তা",  hi:"पास्ता",  nl:"Pasta",    pl:"Makaron",  no:"Pasta",   sv:"Pasta"  },
      { en:"PIZZA",    es:"Pizza",     fr:"Pizza",     ar:"بيتزا",  de:"Pizza",    it:"Pizza",    pt:"Pizza",    ru:"Пицца",   zh:"披萨",  ja:"ピザ",     ko:"피자",     bn:"পিৎজা",   hi:"पिज़्ज़ा",nl:"Pizza",    pl:"Pizza",    no:"Pizza",   sv:"Pizza"  },
      { en:"JUICE",    es:"Jugo",      fr:"Jus",       ar:"عصير",   de:"Saft",     it:"Succo",    pt:"Suco",     ru:"Сок",     zh:"果汁",  ja:"ジュース",  ko:"주스",     bn:"জুস",     hi:"जूस",     nl:"Sap",      pl:"Sok",      no:"Juice",   sv:"Juice"  },
      { en:"SUGAR",    es:"Azúcar",    fr:"Sucre",     ar:"سكر",    de:"Zucker",   it:"Zucchero", pt:"Açúcar",   ru:"Сахар",   zh:"糖",    ja:"さとう",   ko:"설탕",     bn:"চিনি",    hi:"चीनी",    nl:"Suiker",   pl:"Cukier",   no:"Sukker",  sv:"Socker" },
      { en:"SALT",     es:"Sal",       fr:"Sel",       ar:"ملح",    de:"Salz",     it:"Sale",     pt:"Sal",      ru:"Соль",    zh:"盐",    ja:"しお",     ko:"소금",     bn:"লবণ",     hi:"नमक",     nl:"Zout",     pl:"Sól",      no:"Salt",    sv:"Salt"   },
      { en:"CORN",     es:"Maíz",      fr:"Maïs",      ar:"ذرة",    de:"Mais",     it:"Mais",     pt:"Milho",    ru:"Кукуруза",zh:"玉米",  ja:"トウモロコシ",ko:"옥수수", bn:"ভুট্টা",  hi:"मकई",     nl:"Maïs",     pl:"Kukurydza",no:"Mais",    sv:"Majs"   },
      { en:"MEAT",     es:"Carne",     fr:"Viande",    ar:"لحم",    de:"Fleisch",  it:"Carne",    pt:"Carne",    ru:"Мясо",    zh:"肉",    ja:"にく",     ko:"고기",     bn:"মাংস",    hi:"मांस",    nl:"Vlees",    pl:"Mięso",    no:"Kjøtt",   sv:"Kött"   },
      { en:"FISH",     es:"Pescado",   fr:"Poisson",   ar:"سمك",    de:"Fisch",    it:"Pesce",    pt:"Peixe",    ru:"Рыба",    zh:"鱼",    ja:"さかな",   ko:"생선",     bn:"মাছ",     hi:"मछली",    nl:"Vis",      pl:"Ryba",     no:"Fisk",    sv:"Fisk"   },
      { en:"BEAN",     es:"Frijol",    fr:"Haricot",   ar:"فاصولياء",de:"Bohne",   it:"Fagiolo",  pt:"Feijão",   ru:"Боб",     zh:"豆子",  ja:"まめ",     ko:"콩",       bn:"মটরশুটি", hi:"बीन",     nl:"Boon",     pl:"Fasola",   no:"Bønne",   sv:"Böna"   },
      { en:"LEMON",    es:"Limón",     fr:"Citron",    ar:"ليمون",  de:"Zitrone",  it:"Limone",   pt:"Limão",    ru:"Лимон",   zh:"柠檬",  ja:"レモン",   ko:"레몬",     bn:"লেবু",    hi:"नींबू",   nl:"Citroen",  pl:"Cytryna",  no:"Sitron",  sv:"Citron" },
      { en:"GRAPE",    es:"Uva",       fr:"Raisin",    ar:"عنب",    de:"Traube",   it:"Uva",      pt:"Uva",      ru:"Виноград",zh:"葡萄",  ja:"ブドウ",   ko:"포도",     bn:"আঙুর",    hi:"अंगूर",   nl:"Druif",    pl:"Winogrono",no:"Drue",    sv:"Druva"  },
      { en:"MANGO",    es:"Mango",     fr:"Mangue",    ar:"مانجو",  de:"Mango",    it:"Mango",    pt:"Manga",    ru:"Манго",   zh:"芒果",  ja:"マンゴー",  ko:"망고",     bn:"আম",      hi:"आम",      nl:"Mango",    pl:"Mango",    no:"Mango",   sv:"Mango"  },
      { en:"HONEY",    es:"Miel",      fr:"Miel",      ar:"عسل",    de:"Honig",    it:"Miele",    pt:"Mel",      ru:"Мёд",     zh:"蜂蜜",  ja:"ハチミツ",  ko:"꿀",       bn:"মধু",     hi:"शहद",     nl:"Honing",   pl:"Miód",     no:"Honning", sv:"Honung" },
    ],
  },
  {
    name:"Colors 🎨", emoji:"🌈",
    words:[
      { en:"RED",      es:"Rojo",      fr:"Rouge",     ar:"أحمر",   de:"Rot",      it:"Rosso",    pt:"Vermelho", ru:"Красный", zh:"红",    ja:"あか",     ko:"빨강",     bn:"লাল",     hi:"लाल",     nl:"Rood",     pl:"Czerwony", no:"Rød",     sv:"Röd"    },
      { en:"BLUE",     es:"Azul",      fr:"Bleu",      ar:"أزرق",   de:"Blau",     it:"Blu",      pt:"Azul",     ru:"Синий",   zh:"蓝",    ja:"あお",     ko:"파랑",     bn:"নীল",     hi:"नीला",    nl:"Blauw",    pl:"Niebieski",no:"Blå",     sv:"Blå"    },
      { en:"GREEN",    es:"Verde",     fr:"Vert",      ar:"أخضر",   de:"Grün",     it:"Verde",    pt:"Verde",    ru:"Зелёный", zh:"绿",    ja:"みどり",   ko:"초록",     bn:"সবুজ",    hi:"हरा",     nl:"Groen",    pl:"Zielony",  no:"Grønn",   sv:"Grön"   },
      { en:"YELLOW",   es:"Amarillo",  fr:"Jaune",     ar:"أصفر",   de:"Gelb",     it:"Giallo",   pt:"Amarelo",  ru:"Жёлтый",  zh:"黄",    ja:"きいろ",   ko:"노랑",     bn:"হলুদ",    hi:"पीला",    nl:"Geel",     pl:"Żółty",    no:"Gul",     sv:"Gul"    },
      { en:"PINK",     es:"Rosa",      fr:"Rose",      ar:"وردي",   de:"Rosa",     it:"Rosa",     pt:"Rosa",     ru:"Розовый", zh:"粉红",  ja:"ピンク",   ko:"분홍",     bn:"গোলাপী",  hi:"गुलाबी",  nl:"Roze",     pl:"Różowy",   no:"Rosa",    sv:"Rosa"   },
      { en:"ORANGE",   es:"Naranja",   fr:"Orange",    ar:"برتقالي",de:"Orange",   it:"Arancione",pt:"Laranja",  ru:"Оранжевый",zh:"橙",   ja:"オレンジ", ko:"주황",     bn:"কমলা",    hi:"नारंगी",  nl:"Oranje",   pl:"Pomarańczowy",no:"Oransje",sv:"Orange" },
      { en:"PURPLE",   es:"Morado",    fr:"Violet",    ar:"بنفسجي", de:"Lila",     it:"Viola",    pt:"Roxo",     ru:"Фиолетовый",zh:"紫",  ja:"むらさき", ko:"보라",     bn:"বেগুনি",  hi:"बैंगनी",  nl:"Paars",    pl:"Fioletowy",no:"Lilla",   sv:"Lila"   },
      { en:"WHITE",    es:"Blanco",    fr:"Blanc",     ar:"أبيض",   de:"Weiß",     it:"Bianco",   pt:"Branco",   ru:"Белый",   zh:"白",    ja:"しろ",     ko:"흰색",     bn:"সাদা",    hi:"सफ़ेद",   nl:"Wit",      pl:"Biały",    no:"Hvit",    sv:"Vit"    },
      { en:"BLACK",    es:"Negro",     fr:"Noir",      ar:"أسود",   de:"Schwarz",  it:"Nero",     pt:"Preto",    ru:"Чёрный",  zh:"黑",    ja:"くろ",     ko:"검정",     bn:"কালো",    hi:"काला",    nl:"Zwart",    pl:"Czarny",   no:"Svart",   sv:"Svart"  },
      { en:"BROWN",    es:"Marrón",    fr:"Brun",      ar:"بني",    de:"Braun",    it:"Marrone",  pt:"Marrom",   ru:"Коричневый",zh:"棕",  ja:"ちゃいろ", ko:"갈색",     bn:"বাদামী",  hi:"भूरा",    nl:"Bruin",    pl:"Brązowy",  no:"Brun",    sv:"Brun"   },
      { en:"GOLD",     es:"Dorado",    fr:"Or",        ar:"ذهبي",   de:"Gold",     it:"Oro",      pt:"Ouro",     ru:"Золотой", zh:"金",    ja:"きんいろ", ko:"금색",     bn:"সোনালি",  hi:"सुनहरा",  nl:"Goud",     pl:"Złoty",    no:"Gull",    sv:"Guld"   },
      { en:"SILVER",   es:"Plateado",  fr:"Argent",    ar:"فضي",    de:"Silber",   it:"Argento",  pt:"Prata",    ru:"Серебряный",zh:"银",  ja:"ぎんいろ", ko:"은색",     bn:"রুপালি",  hi:"चांदी",   nl:"Zilver",   pl:"Srebrny",  no:"Sølv",    sv:"Silver" },
      { en:"GRAY",     es:"Gris",      fr:"Gris",      ar:"رمادي",  de:"Grau",     it:"Grigio",   pt:"Cinza",    ru:"Серый",   zh:"灰",    ja:"はいいろ", ko:"회색",     bn:"ধূসর",    hi:"ग्रे",    nl:"Grijs",    pl:"Szary",    no:"Grå",     sv:"Grå"    },
      { en:"CYAN",     es:"Cian",      fr:"Cyan",      ar:"سماوي",  de:"Cyan",     it:"Ciano",    pt:"Ciano",    ru:"Голубой", zh:"青",    ja:"シアン",   ko:"청록",     bn:"সায়ান",   hi:"सियान",   nl:"Cyaan",    pl:"Cyjan",    no:"Cyan",    sv:"Cyan"   },
      { en:"CREAM",    es:"Crema",     fr:"Crème",     ar:"كريمي",  de:"Creme",    it:"Crema",    pt:"Creme",    ru:"Кремовый",zh:"奶油",  ja:"クリーム",  ko:"크림",     bn:"ক্রিম",   hi:"क्रीम",   nl:"Crème",    pl:"Kremowy",  no:"Krem",    sv:"Kräm"   },
      { en:"JADE",     es:"Jade",      fr:"Jade",      ar:"جاد",    de:"Jade",     it:"Giada",    pt:"Jade",     ru:"Нефрит",  zh:"翡翠",  ja:"ひすい",   ko:"옥색",     bn:"জেড",     hi:"जेड",     nl:"Jade",     pl:"Jadeit",   no:"Jade",    sv:"Jade"   },
      { en:"MAROON",   es:"Granate",   fr:"Bordeaux",  ar:"كستنائي",de:"Kastanie", it:"Bordò",    pt:"Bordeaux", ru:"Бордовый",zh:"褐红",  ja:"えんじ",   ko:"밤색",     bn:"মেরুন",   hi:"मैरून",   nl:"Kastanje", pl:"Kasztan",  no:"Mørkerød",sv:"Mörk röd"},
      { en:"INDIGO",   es:"Índigo",    fr:"Indigo",    ar:"نيلي",   de:"Indigo",   it:"Indaco",   pt:"Índigo",   ru:"Индиго",  zh:"靛蓝",  ja:"あいいろ", ko:"남색",     bn:"ইন্ডিগো", hi:"इंडिगो",  nl:"Indigo",   pl:"Indygo",   no:"Indigo",  sv:"Indigo" },
      { en:"TEAL",     es:"Verde azul",fr:"Sarcelle",  ar:"أزرق مخضر",de:"Petrol", it:"Verde acqua",pt:"Verde azul",ru:"Бирюзовый",zh:"蓝绿", ja:"ティール",ko:"틸",      bn:"টিল",     hi:"टील",     nl:"Teal",     pl:"Szmaragdowy",no:"Teal",  sv:"Teal"   },
      { en:"LIME",     es:"Lima",      fr:"Citron vert",ar:"ليموني", de:"Limette",  it:"Lime",     pt:"Lima",     ru:"Лаймовый",zh:"莱姆",  ja:"ライム",   ko:"라임",     bn:"লাইম",    hi:"लाइम",    nl:"Limoen",   pl:"Limonkowy",no:"Lime",    sv:"Lime"   },
    ],
  },
  {
    name:"School 📚", emoji:"🏫",
    words:[
      { en:"BOOK",     es:"Libro",     fr:"Livre",     ar:"كتاب",   de:"Buch",     it:"Libro",    pt:"Livro",    ru:"Книга",   zh:"书",    ja:"ほん",     ko:"책",       bn:"বই",      hi:"किताब",   nl:"Boek",     pl:"Książka",  no:"Bok",     sv:"Bok"    },
      { en:"PEN",      es:"Pluma",     fr:"Stylo",     ar:"قلم",    de:"Stift",    it:"Penna",    pt:"Caneta",   ru:"Ручка",   zh:"笔",    ja:"ペン",     ko:"펜",       bn:"কলম",     hi:"कलम",     nl:"Pen",      pl:"Długopis", no:"Penn",    sv:"Penna"  },
      { en:"DESK",     es:"Escritorio",fr:"Bureau",    ar:"مكتب",   de:"Schreibtisch",it:"Scrivania",pt:"Mesa",  ru:"Стол",    zh:"桌子",  ja:"つくえ",   ko:"책상",     bn:"ডেস্ক",   hi:"मेज",     nl:"Bureau",   pl:"Biurko",   no:"Pult",    sv:"Skrivbord"},
      { en:"READ",     es:"Leer",      fr:"Lire",      ar:"قراءة",  de:"Lesen",    it:"Leggere",  pt:"Ler",      ru:"Читать",  zh:"读",    ja:"よむ",     ko:"읽다",     bn:"পড়া",     hi:"पढ़ना",   nl:"Lezen",    pl:"Czytać",   no:"Lese",    sv:"Läsa"   },
      { en:"WRITE",    es:"Escribir",  fr:"Écrire",    ar:"كتابة",  de:"Schreiben",it:"Scrivere", pt:"Escrever", ru:"Писать",  zh:"写",    ja:"かく",     ko:"쓰다",     bn:"লেখা",    hi:"लिखना",   nl:"Schrijven",pl:"Pisać",    no:"Skrive",  sv:"Skriva" },
      { en:"LEARN",    es:"Aprender",  fr:"Apprendre", ar:"تعلم",   de:"Lernen",   it:"Imparare", pt:"Aprender", ru:"Учить",   zh:"学",    ja:"まなぶ",   ko:"배우다",   bn:"শেখা",    hi:"सीखना",   nl:"Leren",    pl:"Uczyć",    no:"Lære",    sv:"Lära"   },
      { en:"CLASS",    es:"Clase",     fr:"Classe",    ar:"فصل",    de:"Klasse",   it:"Classe",   pt:"Turma",    ru:"Класс",   zh:"班级",  ja:"クラス",   ko:"반",       bn:"ক্লাস",   hi:"कक्षा",   nl:"Klas",     pl:"Klasa",    no:"Klasse",  sv:"Klass"  },
      { en:"TEST",     es:"Prueba",    fr:"Test",      ar:"اختبار", de:"Test",     it:"Test",     pt:"Teste",    ru:"Тест",    zh:"测试",  ja:"テスト",   ko:"시험",     bn:"পরীক্ষা", hi:"परीक्षा",  nl:"Toets",    pl:"Test",     no:"Prøve",   sv:"Prov"   },
      { en:"MATH",     es:"Matemáticas",fr:"Maths",    ar:"رياضيات",de:"Mathe",    it:"Matematica",pt:"Matemática",ru:"Математика",zh:"数学",ja:"すうがく", ko:"수학",     bn:"গণিত",    hi:"गणित",    nl:"Wiskunde",  pl:"Matematyka",no:"Matte",  sv:"Matte"  },
      { en:"DRAW",     es:"Dibujar",   fr:"Dessiner",  ar:"رسم",    de:"Zeichnen", it:"Disegnare",pt:"Desenhar", ru:"Рисовать",zh:"画画",  ja:"えをかく", ko:"그리다",   bn:"আঁকা",    hi:"बनाना",   nl:"Tekenen",  pl:"Rysować",  no:"Tegne",   sv:"Rita"   },
      { en:"RULER",    es:"Regla",     fr:"Règle",     ar:"مسطرة",  de:"Lineal",   it:"Righello", pt:"Régua",    ru:"Линейка", zh:"尺子",  ja:"ものさし", ko:"자",       bn:"রুলার",   hi:"रूलर",    nl:"Liniaal",  pl:"Linijka",  no:"Linjal",  sv:"Linjal" },
      { en:"GLUE",     es:"Pegamento", fr:"Colle",     ar:"غراء",   de:"Kleber",   it:"Colla",    pt:"Cola",     ru:"Клей",    zh:"胶水",  ja:"のり",     ko:"풀",       bn:"আঠা",     hi:"गोंद",    nl:"Lijm",     pl:"Klej",     no:"Lim",     sv:"Lim"    },
      { en:"PAINT",    es:"Pintura",   fr:"Peinture",  ar:"طلاء",   de:"Farbe",    it:"Pittura",  pt:"Tinta",    ru:"Краска",  zh:"颜料",  ja:"えのぐ",   ko:"물감",     bn:"রং",      hi:"पेंट",    nl:"Verf",     pl:"Farba",    no:"Maling",  sv:"Färg"   },
      { en:"CHAIR",    es:"Silla",     fr:"Chaise",    ar:"كرسي",   de:"Stuhl",    it:"Sedia",    pt:"Cadeira",  ru:"Стул",    zh:"椅子",  ja:"いす",     ko:"의자",     bn:"চেয়ার",  hi:"कुर्सी",  nl:"Stoel",    pl:"Krzesło",  no:"Stol",    sv:"Stol"   },
      { en:"STUDY",    es:"Estudiar",  fr:"Étudier",   ar:"يدرس",   de:"Lernen",   it:"Studiare", pt:"Estudar",  ru:"Учиться", zh:"学习",  ja:"べんきょう",ko:"공부",     bn:"পড়াশুনা",hi:"पढ़ाई",   nl:"Studeren", pl:"Studiować",no:"Studere", sv:"Studera"},
      { en:"EXAM",     es:"Examen",    fr:"Examen",    ar:"امتحان", de:"Prüfung",  it:"Esame",    pt:"Exame",    ru:"Экзамен", zh:"考试",  ja:"しけん",   ko:"시험",     bn:"পরীক্ষা", hi:"परीक्षा",  nl:"Examen",   pl:"Egzamin",  no:"Eksamen", sv:"Examen" },
      { en:"GRADE",    es:"Nota",      fr:"Note",      ar:"درجة",   de:"Note",     it:"Voto",     pt:"Nota",     ru:"Оценка",  zh:"成绩",  ja:"せいせき",  ko:"성적",     bn:"গ্রেড",   hi:"ग्रेड",   nl:"Cijfer",   pl:"Ocena",    no:"Karakter",sv:"Betyg"  },
      { en:"LIBRARY",  es:"Biblioteca",fr:"Bibliothèque",ar:"مكتبة",de:"Bibliothek",it:"Biblioteca",pt:"Biblioteca",ru:"Библиотека",zh:"图书馆",ja:"としょかん",ko:"도서관",bn:"পাঠাগার", hi:"पुस्तकालय",nl:"Bibliotheek",pl:"Biblioteka",no:"Bibliotek",sv:"Bibliotek"},
      { en:"SCIENCE",  es:"Ciencia",   fr:"Science",   ar:"علوم",   de:"Wissenschaft",it:"Scienza",pt:"Ciência",  ru:"Наука",   zh:"科学",  ja:"かがく",   ko:"과학",     bn:"বিজ্ঞান",  hi:"विज्ञान",  nl:"Wetenschap",pl:"Nauka",   no:"Vitenskap",sv:"Vetenskap"},
      { en:"HISTORY",  es:"Historia",  fr:"Histoire",  ar:"تاريخ",  de:"Geschichte",it:"Storia",  pt:"História", ru:"История", zh:"历史",  ja:"れきし",   ko:"역사",     bn:"ইতিহাস",  hi:"इतिहास",  nl:"Geschiedenis",pl:"Historia",no:"Historie",sv:"Historia"},
    ],
  },
];

// ── Grid 14×14 ────────────────────────────────────────────────────────────
const GRID_SIZE = 14;
const WORDS_PER_GAME = 20;

function buildGrid(allWords) {
  // Pick up to WORDS_PER_GAME words (shuffle first for variety)
  const shuffled = [...allWords].sort(() => Math.random() - 0.5);
  const words    = shuffled.slice(0, WORDS_PER_GAME);

  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const grid    = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(""));
  const placed  = [];
  const DIRS    = [[0,1],[1,0],[1,1],[0,-1],[-1,0],[-1,-1],[1,-1],[-1,1]];

  for (const wordObj of words) {
    const word = wordObj.en;
    let ok = false, tries = 0;
    while (!ok && tries++ < 400) {
      const [dr,dc] = DIRS[Math.floor(Math.random() * DIRS.length)];
      const r = Math.floor(Math.random() * GRID_SIZE);
      const c = Math.floor(Math.random() * GRID_SIZE);
      const cells = []; let valid = true;
      for (let i = 0; i < word.length; i++) {
        const nr = r + dr*i, nc = c + dc*i;
        if (nr < 0 || nr >= GRID_SIZE || nc < 0 || nc >= GRID_SIZE) { valid=false; break; }
        if (grid[nr][nc] !== "" && grid[nr][nc] !== word[i]) { valid=false; break; }
        cells.push({ r:nr, c:nc });
      }
      if (valid) {
        cells.forEach(({ r,c }, i) => { grid[r][c] = word[i]; });
        placed.push({ word: wordObj, cells });
        ok = true;
      }
    }
  }

  // Fill remaining
  for (let r = 0; r < GRID_SIZE; r++)
    for (let c = 0; c < GRID_SIZE; c++)
      if (!grid[r][c]) grid[r][c] = letters[Math.floor(Math.random() * letters.length)];

  return { grid, placed };
}

// ── Confetti ──────────────────────────────────────────────────────────────
function Confetti({ active }) {
  const ps = Array.from({ length: 24 }, (_,i) => ({
    id: i, x: Math.random()*100,
    color: [C.blue,C.red,C.yellow,C.green,C.magenta,C.cyan][i%6],
    delay: Math.random()*0.4, size: Math.random()*10+7,
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

// ── Generic Dropdown ──────────────────────────────────────────────────────
function Dropdown({ trigger, minWidth = 160, children }) {
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
        onClick={() => setOpen(o => !o)}
        style={{
          display:"flex", alignItems:"center", gap:8,
          padding:"9px 14px", borderRadius:999,
          border:"2.5px solid white",
          background:"rgba(255,255,255,0.92)",
          backdropFilter:"blur(8px)",
          boxShadow:"0 4px 14px rgba(21,101,192,0.13)",
          cursor:"pointer",
          fontFamily:"var(--font-display,'Nunito',sans-serif)",
          fontWeight:700, fontSize:13, color:C.blue,
          whiteSpace:"nowrap", minWidth, justifyContent:"space-between",
        }}
      >
        {trigger}
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration:0.18 }} style={{ display:"flex" }}>
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
              minWidth: Math.max(minWidth, 200),
              background:"white", borderRadius:16,
              border:"2px solid rgba(21,101,192,0.1)",
              boxShadow:"0 14px 42px rgba(21,101,192,0.16)",
              overflow:"hidden", maxHeight:280, overflowY:"auto", scrollbarWidth:"thin",
            }}
          >
            {children(() => setOpen(false))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DropItem({ active, onClick, children }) {
  return (
    <button onClick={onClick}
      style={{
        display:"flex", alignItems:"center", gap:9, width:"100%",
        padding:"8px 13px", border:"none",
        background: active ? C.blueSoft : "transparent",
        cursor:"pointer",
        fontFamily:"var(--font-body,'Nunito',sans-serif)",
        fontWeight: active ? 700 : 500, fontSize:13,
        color: active ? C.blue : "#374151", textAlign:"left",
        borderLeft: active ? `3px solid ${C.blue}` : "3px solid transparent",
      }}
      onMouseEnter={e => { if (!active) e.currentTarget.style.background = "#F0F9FF"; }}
      onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}
    >
      {children}
      {active && <span style={{ width:5, height:5, borderRadius:"50%", background:C.blue, marginLeft:"auto", flexShrink:0 }}/>}
    </button>
  );
}

// ── Word chip — compact card ──────────────────────────────────────────────
function WordChip({ word, wi, isFound, lang, langMeta }) {
  const col = WORD_COLORS[wi % WORD_COLORS.length];
  return (
    <motion.div
      initial={{ opacity:0, scale:0.9 }}
      animate={{ opacity:1, scale:1 }}
      transition={{ delay: Math.min(wi * 0.02, 0.3) }}
      style={{
        display:"flex", flexDirection:"column",
        padding:"5px 8px",
        borderRadius:10,
        border:`1.5px solid ${isFound ? col.border : "#E2E8F0"}`,
        background: isFound ? col.bg : "white",
        gap:1,
        minWidth:0,
      }}
    >
      {/* English word / hidden dots */}
      <div style={{
        display:"flex", alignItems:"center", gap:4,
        fontFamily:"var(--font-display,'Nunito',sans-serif)",
        fontWeight:700, fontSize:12,
        color: isFound ? col.text : C.blue,
        lineHeight:1.2,
      }}>
        {isFound
          ? <><CheckCircle size={10} style={{ flexShrink:0 }}/>{word.en}</>
          : <span style={{ letterSpacing:2, color:"#94A3B8" }}>{"·".repeat(word.en.length)}</span>
        }
      </div>
      {/* Translation */}
      <div style={{
        fontFamily:"var(--font-body,'Nunito',sans-serif)",
        fontSize:11, lineHeight:1.2,
        color: isFound ? col.text + "CC" : "#94A3B8",
        direction: langMeta.dir,
        overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap",
      }}>
        {word[lang] || word.en}
      </div>
    </motion.div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────
export default function WordSearch({ lang: propLang, onLangChange }) {
  const [packIdx,   setPackIdx]   = useState(0);
  const [localLang, setLocalLang] = useState("es");
  const lang    = propLang || localLang;
  const setLang = v => { setLocalLang(v); onLangChange?.(v); };

  const [gameData,   setGameData]   = useState(null);
  const [selecting,  setSelecting]  = useState(false);
  const [selection,  setSelection]  = useState([]);
  const [found,      setFound]      = useState([]);
  const [confetti,   setConfetti]   = useState(false);
  const [won,        setWon]        = useState(false);

  const langMeta = LANGUAGES.find(l => l.code === lang) || LANGUAGES[0];
  const pack     = PACKS[packIdx];

  const startGame = useCallback((pIdx = packIdx) => {
    setGameData(buildGrid(PACKS[pIdx].words));
    setFound([]); setSelection([]); setSelecting(false); setWon(false);
  }, [packIdx]);

  useEffect(() => { startGame(packIdx); }, [packIdx]);

  const checkSel = sel => {
    if (!gameData || sel.length < 2) return;
    const k  = sel.map(x => `${x.r},${x.c}`).join("|");
    const rk = [...sel].reverse().map(x => `${x.r},${x.c}`).join("|");
    gameData.placed.forEach(({ word, cells }, wi) => {
      if (found.includes(wi)) return;
      const wk = cells.map(x => `${x.r},${x.c}`).join("|");
      if (k === wk || rk === wk) {
        const nf = [...found, wi];
        setFound(nf);
        if (nf.length === gameData.placed.length) {
          setWon(true); setConfetti(true);
          setTimeout(() => setConfetti(false), 2500);
        }
      }
    });
  };

  const cellStyle = (r, c) => {
    if (!gameData) return {};
    for (const wi of found) {
      if (gameData.placed[wi].cells.some(x => x.r === r && x.c === c)) {
        const col = WORD_COLORS[wi % WORD_COLORS.length];
        return { background: col.bg, color: col.text, fontWeight:700 };
      }
    }
    if (selection.some(x => x.r === r && x.c === c))
      return { background: C.yellow + "80", color: C.blue, fontWeight:700 };
    return {};
  };

  const onStart = (r,c) => { setSelecting(true); setSelection([{r,c}]); };
  const onEnter = (r,c) => {
    if (!selecting) return;
    const f = selection[0]; if (!f) return;
    const dr = Math.sign(r - f.r), dc = Math.sign(c - f.c);
    const len = Math.max(Math.abs(r - f.r), Math.abs(c - f.c)) + 1;
    if (dr !== 0 && dc !== 0 && Math.abs(r - f.r) !== Math.abs(c - f.c)) return;
    setSelection(Array.from({ length:len }, (_,i) => ({ r: f.r + dr*i, c: f.c + dc*i })));
  };
  const onEnd = () => {
    if (!selecting) return;
    setSelecting(false); checkSel(selection); setSelection([]);
  };

  const totalWords = gameData?.placed.length ?? 0;

  return (
    <div className="min-h-screen" style={{ background:"linear-gradient(150deg,#E3F2FD 0%,#FFFDE7 50%,#E8F5E9 100%)" }}>
      <Confetti active={confetti}/>

      {/* ── Header ── */}
      <div className="text-center pt-8 pb-4 px-4">
        <motion.div initial={{ scale:0.8,opacity:0 }} animate={{ scale:1,opacity:1 }} transition={{ type:"spring" }}
          className="text-5xl mb-2 inline-block">🔍</motion.div>
        <motion.h1 initial={{ opacity:0,y:-10 }} animate={{ opacity:1,y:0 }}
          className="font-display text-3xl md:text-4xl mb-1" style={{ color:C.blue }}>
          Word Search
        </motion.h1>
        <p className="font-body text-slate-400 text-sm">
          Find the words — see them in {langMeta.flag} {langMeta.label}! 🕵️
        </p>
      </div>

      {/* ── Controls ── */}
      <div style={{ display:"flex", flexWrap:"wrap", justifyContent:"center", gap:8, padding:"0 12px 16px" }}>

        {/* Pack dropdown */}
        <Dropdown
          minWidth={170}
          trigger={<><span style={{ fontSize:17 }}>{pack.emoji}</span><span>{pack.name}</span></>}
        >
          {close => PACKS.map((p,i) => (
            <DropItem key={i} active={packIdx===i} onClick={() => { setPackIdx(i); startGame(i); close(); }}>
              <span style={{ fontSize:20 }}>{p.emoji}</span><span>{p.name}</span>
            </DropItem>
          ))}
        </Dropdown>

        {/* Language dropdown */}
        <Dropdown
          minWidth={155}
          trigger={<><Globe size={13}/><span style={{ fontSize:17 }}>{langMeta.flag}</span><span>{langMeta.label}</span></>}
        >
          {close => [
            <div key="hdr" style={{
              padding:"7px 13px 5px", borderBottom:"1.5px solid #EFF6FF",
              fontFamily:"var(--font-display,'Nunito',sans-serif)",
              fontWeight:700, fontSize:9, color:C.blue,
              letterSpacing:"0.08em", textTransform:"uppercase",
              display:"flex", alignItems:"center", gap:4,
            }}>
              <Globe size={9}/> Translation language
            </div>,
            ...LANGUAGES.map(l => (
              <DropItem key={l.code} active={lang===l.code} onClick={() => { setLang(l.code); close(); }}>
                <span style={{ fontSize:17, lineHeight:1, flexShrink:0 }}>{l.flag}</span>
                <span>{l.label}</span>
              </DropItem>
            )),
          ]}
        </Dropdown>

        {/* New puzzle */}
        <motion.button
          whileHover={{ scale:1.04 }} whileTap={{ scale:0.96 }}
          onClick={() => startGame()}
          style={{
            display:"flex", alignItems:"center", gap:5,
            padding:"9px 16px", borderRadius:999,
            border:"2.5px solid white", background:C.red, color:"white",
            fontFamily:"var(--font-display,'Nunito',sans-serif)",
            fontWeight:700, fontSize:13, cursor:"pointer",
            boxShadow:"0 4px 14px rgba(229,57,53,0.28)",
            whiteSpace:"nowrap",
          }}
        >
          <RotateCcw size={13}/> New puzzle
        </motion.button>
      </div>

      {/* ── Win banner ── */}
      <div className="max-w-5xl mx-auto px-3">
        {won && (
          <motion.div initial={{ scale:0.85,opacity:0 }} animate={{ scale:1,opacity:1 }}
            className="text-center mb-4 py-3 rounded-2xl font-display text-xl text-white shadow-lg"
            style={{ background:`linear-gradient(135deg,${C.green},#2E7D32)` }}>
            🏆 You found all {totalWords} words! Amazing! 🎉
          </motion.div>
        )}
      </div>

      {/* ── Main layout: Grid + Word panel ── */}
      <div className="max-w-5xl mx-auto px-3 pb-20">
        <div className="grid lg:grid-cols-[1fr_280px] xl:grid-cols-[1fr_310px] gap-4 items-start">

          {/* ── GRID ── */}
          <div>
            <div
              className="grid gap-0.5 p-2 rounded-2xl shadow-xl border-4 border-white select-none touch-none"
              style={{
                gridTemplateColumns: `repeat(${GRID_SIZE},1fr)`,
                background: C.blueSoft,
              }}
              onMouseLeave={onEnd}
              onTouchEnd={onEnd}
            >
              {gameData && gameData.grid.map((row, r) =>
                row.map((letter, c) => (
                  <motion.div
                    key={`${r}-${c}`}
                    className="aspect-square flex items-center justify-center rounded-md font-display cursor-pointer"
                    style={{
                      background:"white",
                      color: C.blue,
                      fontSize:"clamp(9px,1.8vw,14px)",
                      userSelect:"none",
                      transition:"background 0.1s, color 0.1s",
                      ...cellStyle(r, c),
                    }}
                    onMouseDown={() => onStart(r, c)}
                    onMouseEnter={() => onEnter(r, c)}
                    onMouseUp={onEnd}
                    onTouchStart={e => { e.preventDefault(); onStart(r, c); }}
                  >
                    {letter}
                  </motion.div>
                ))
              )}
            </div>

            {/* How-to tip — below grid */}
            <div className="mt-3 rounded-2xl p-3 border-2 border-white shadow-sm" style={{ background:C.yellowSoft }}>
              <p className="font-body text-xs text-slate-500">
                💡 Click &amp; drag to select — horizontal, vertical or diagonal!
              </p>
            </div>
          </div>

          {/* ── WORD PANEL ── */}
          <div>
            {/* Progress header */}
            <div className="flex items-center justify-between mb-2">
              <span className="font-display text-sm" style={{ color:C.blue }}>
                Find these words
              </span>
              <span className="font-display text-xs px-2.5 py-1 rounded-full text-white"
                style={{ background: found.length === totalWords && totalWords > 0 ? C.green : C.blue }}>
                {found.length}/{totalWords}
              </span>
            </div>

            {/* Progress bar */}
            <div className="h-1.5 rounded-full mb-3 overflow-hidden" style={{ background:`${C.blue}20` }}>
              <motion.div className="h-full rounded-full" style={{ background:C.blue }}
                initial={{ width:0 }}
                animate={{ width: totalWords > 0 ? `${(found.length/totalWords)*100}%` : "0%" }}
                transition={{ duration:0.4 }}
              />
            </div>

            {/* ── Word chips grid: 2 cols on all screens ── */}
            <div style={{
              display:"grid",
              gridTemplateColumns:"1fr 1fr",
              gap:5,
            }}>
              {gameData && gameData.placed.map(({ word }, wi) => (
                <WordChip
                  key={wi}
                  word={word}
                  wi={wi}
                  isFound={found.includes(wi)}
                  lang={lang}
                  langMeta={langMeta}
                />
              ))}
            </div>

            {/* Legend */}
            <div className="mt-3 text-center">
              <span className="font-body text-xs text-slate-400">
                · · · = not found yet &nbsp;|&nbsp; ✓ = found!
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
