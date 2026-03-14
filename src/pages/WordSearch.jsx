/**
 * src/pages/WordSearch.jsx — Kiddsy
 * Bilingual word search: find English words hidden in a grid
 * Words come from the story vocabulary + alphabet module
 */
import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, Trophy, CheckCircle, Star, Search, Globe, ChevronDown,
         Cat, Palette, Apple, Home, Leaf, Utensils } from "lucide-react";
import { WordSearchBg } from "../components/PageBg.jsx";
import { BubbleTitle } from "../components/KiddsyFont";
import EmojiSvg from "../utils/EmojiSvg.jsx";
import { LANGUAGES as WORD_SEARCH_LANGS, detectLang, getLang } from "../utils/langConfig.js";

const C = {
  blue:       "#1565C0",
  blueSoft:   "#E3F2FD",
  red:        "#E53935",
  redSoft:    "#FFEBEE",
  yellow:     "#F9A825",
  yellowSoft: "#FFFDE7",
  green:      "#43A047",
  greenSoft:  "#E8F5E9",
  magenta:    "#D81B60",
  magentaSoft:"#FCE4EC",
  cyan:       "#00ACC1",
  cyanSoft:   "#E0F7FA",
};

// Highlight colors per word (pastel fills)
const WORD_COLORS = [
  { bg: "#FFF9C4", border: "#F9A825", text: "#E65100" },
  { bg: "#C8E6C9", border: "#43A047", text: "#1B5E20" },
  { bg: "#BBDEFB", border: "#1565C0", text: "#0D47A1" },
  { bg: "#F8BBD0", border: "#D81B60", text: "#880E4F" },
  { bg: "#B2EBF2", border: "#00ACC1", text: "#006064" },
  { bg: "#E1BEE7", border: "#8E24AA", text: "#4A148C" },
];

// ─── WORD_SEARCH_LANGS, detectLang, FlagImg → imported from KiddsyIcons.jsx ──────────

// ─── Word packs ────────────────────────────────────────────────────────────
const PACKS = [
  // ────────────────── ANIMALS ───────────────────────────────────────────────
  {
    name: "Animals", emoji:"1f981", icon: Cat,
    words: [
      { en:"CAT",      es:"Gato",        fr:"Chat",          ar:"قطة",      pt:"Gato",      de:"Katze",      it:"Gatto",       zh:"猫",    ja:"ねこ",      ko:"고양이",  ru:"Кошка",     hi:"बिल्ली",    tr:"Kedi",           nl:"Kat",         pl:"Kot",         sv:"Katt"      },
      { en:"DOG",      es:"Perro",       fr:"Chien",         ar:"كلب",      pt:"Cachorro",  de:"Hund",       it:"Cane",        zh:"狗",    ja:"いぬ",      ko:"개",      ru:"Собака",    hi:"कुत्ता",    tr:"Köpek",          nl:"Hond",        pl:"Pies",        sv:"Hund"      },
      { en:"FISH",     es:"Pez",         fr:"Poisson",       ar:"سمكة",     pt:"Peixe",     de:"Fisch",      it:"Pesce",       zh:"鱼",    ja:"さかな",    ko:"물고기",  ru:"Рыба",      hi:"मछली",      tr:"Balık",          nl:"Vis",         pl:"Ryba",        sv:"Fisk"      },
      { en:"BIRD",     es:"Pájaro",      fr:"Oiseau",        ar:"طائر",     pt:"Pássaro",   de:"Vogel",      it:"Uccello",     zh:"鸟",    ja:"とり",      ko:"새",      ru:"Птица",     hi:"पक्षी",     tr:"Kuş",            nl:"Vogel",       pl:"Ptak",        sv:"Fågel"     },
      { en:"LION",     es:"León",        fr:"Lion",          ar:"أسد",      pt:"Leão",      de:"Löwe",       it:"Leone",       zh:"狮子",  ja:"ライオン",  ko:"사자",    ru:"Лев",       hi:"शेर",       tr:"Aslan",          nl:"Leeuw",       pl:"Lew",         sv:"Lejon"     },
      { en:"BEAR",     es:"Oso",         fr:"Ours",          ar:"دب",       pt:"Urso",      de:"Bär",        it:"Orso",        zh:"熊",    ja:"くま",      ko:"곰",      ru:"Медведь",   hi:"भालू",      tr:"Ayı",            nl:"Beer",        pl:"Niedźwiedź",  sv:"Björn"     },
      { en:"WOLF",     es:"Lobo",        fr:"Loup",          ar:"ذئب",      pt:"Lobo",      de:"Wolf",       it:"Lupo",        zh:"狼",    ja:"おおかみ",  ko:"늑대",    ru:"Волк",      hi:"भेड़िया",   tr:"Kurt",           nl:"Wolf",        pl:"Wilk",        sv:"Varg"      },
      { en:"DUCK",     es:"Pato",        fr:"Canard",        ar:"بطة",      pt:"Pato",      de:"Ente",       it:"Anatra",      zh:"鸭子",  ja:"あひる",    ko:"오리",    ru:"Утка",      hi:"बतख",       tr:"Ördek",          nl:"Eend",        pl:"Kaczka",      sv:"Anka"      },
      { en:"FROG",     es:"Rana",        fr:"Grenouille",    ar:"ضفدع",     pt:"Sapo",      de:"Frosch",     it:"Rana",        zh:"青蛙",  ja:"かえる",    ko:"개구리",  ru:"Лягушка",   hi:"मेंढक",     tr:"Kurbağa",        nl:"Kikker",      pl:"Żaba",        sv:"Groda"     },
      { en:"DEER",     es:"Ciervo",      fr:"Cerf",          ar:"غزال",     pt:"Veado",     de:"Hirsch",     it:"Cervo",       zh:"鹿",    ja:"しか",      ko:"사슴",    ru:"Олень",     hi:"हिरण",      tr:"Geyik",          nl:"Hert",        pl:"Jeleń",       sv:"Hjort"     },
      { en:"HORSE",    es:"Caballo",     fr:"Cheval",        ar:"حصان",     pt:"Cavalo",    de:"Pferd",      it:"Cavallo",     zh:"马",    ja:"うま",      ko:"말",      ru:"Лошадь",    hi:"घोड़ा",    tr:"At",             nl:"Paard",       pl:"Koń",         sv:"Häst"      },
      { en:"TIGER",    es:"Tigre",       fr:"Tigre",         ar:"نمر",      pt:"Tigre",     de:"Tiger",      it:"Tigre",       zh:"老虎",  ja:"とら",      ko:"호랑이",  ru:"Тигр",      hi:"बाघ",       tr:"Kaplan",         nl:"Tijger",      pl:"Tygrys",      sv:"Tiger"     },
      { en:"EAGLE",    es:"Águila",      fr:"Aigle",         ar:"نسر",      pt:"Águia",     de:"Adler",      it:"Aquila",      zh:"老鹰",  ja:"わし",      ko:"독수리",  ru:"Орёл",      hi:"चील",       tr:"Kartal",         nl:"Adelaar",     pl:"Orzeł",       sv:"Örn"       },
      { en:"SHARK",    es:"Tiburón",     fr:"Requin",        ar:"قرش",      pt:"Tubarão",   de:"Hai",        it:"Squalo",      zh:"鲨鱼",  ja:"さめ",      ko:"상어",    ru:"Акула",     hi:"शार्क",     tr:"Köpekbalığı",    nl:"Haai",        pl:"Rekin",       sv:"Haj"       },
      { en:"CAMEL",    es:"Camello",     fr:"Chameau",       ar:"جمل",      pt:"Camelo",    de:"Kamel",      it:"Cammello",    zh:"骆驼",  ja:"らくだ",    ko:"낙타",    ru:"Верблюд",   hi:"ऊँट",       tr:"Deve",           nl:"Kameel",      pl:"Wielbłąd",    sv:"Kamel"     },
      { en:"KOALA",    es:"Koala",       fr:"Koala",         ar:"كوالا",    pt:"Coala",     de:"Koala",      it:"Koala",       zh:"考拉",  ja:"コアラ",    ko:"코알라",  ru:"Коала",     hi:"कोआला",    tr:"Koala",          nl:"Koala",       pl:"Koala",       sv:"Koala"     },
      { en:"WHALE",    es:"Ballena",     fr:"Baleine",       ar:"حوت",      pt:"Baleia",    de:"Wal",        it:"Balena",      zh:"鲸鱼",  ja:"くじら",    ko:"고래",    ru:"Кит",       hi:"व्हेल",     tr:"Balina",         nl:"Walvis",      pl:"Wieloryb",    sv:"Val"       },
      { en:"ZEBRA",    es:"Cebra",       fr:"Zèbre",         ar:"حمار وحشي",pt:"Zebra",     de:"Zebra",      it:"Zebra",       zh:"斑马",  ja:"しまうま",  ko:"얼룩말",  ru:"Зебра",     hi:"जेब्रा",    tr:"Zebra",          nl:"Zebra",       pl:"Zebra",       sv:"Zebra"     },
      { en:"RABBIT",   es:"Conejo",      fr:"Lapin",         ar:"أرنب",     pt:"Coelho",    de:"Kaninchen",  it:"Coniglio",    zh:"兔子",  ja:"うさぎ",    ko:"토끼",    ru:"Кролик",    hi:"खरगोश",    tr:"Tavşan",         nl:"Konijn",      pl:"Królik",      sv:"Kanin"     },
      { en:"MONKEY",   es:"Mono",        fr:"Singe",         ar:"قرد",      pt:"Macaco",    de:"Affe",       it:"Scimmia",     zh:"猴子",  ja:"さる",      ko:"원숭이",  ru:"Обезьяна",  hi:"बंदर",      tr:"Maymun",         nl:"Aap",         pl:"Małpa",       sv:"Apa"       },
    ],
  },

  // ────────────────── COLORS ────────────────────────────────────────────────
  {
    name: "Colors", emoji:"1f3a8", icon: Palette,
    words: [
      { en:"RED",      es:"Rojo",        fr:"Rouge",         ar:"أحمر",     pt:"Vermelho",  de:"Rot",        it:"Rosso",       zh:"红色",  ja:"あか",      ko:"빨간색",  ru:"Красный",   hi:"लाल",       tr:"Kırmızı",        nl:"Rood",        pl:"Czerwony",    sv:"Röd"       },
      { en:"BLUE",     es:"Azul",        fr:"Bleu",          ar:"أزرق",     pt:"Azul",      de:"Blau",       it:"Blu",         zh:"蓝色",  ja:"あお",      ko:"파란색",  ru:"Синий",     hi:"नीला",      tr:"Mavi",           nl:"Blauw",       pl:"Niebieski",   sv:"Blå"       },
      { en:"GREEN",    es:"Verde",       fr:"Vert",          ar:"أخضر",     pt:"Verde",     de:"Grün",       it:"Verde",       zh:"绿色",  ja:"みどり",    ko:"초록색",  ru:"Зелёный",   hi:"हरा",       tr:"Yeşil",          nl:"Groen",       pl:"Zielony",     sv:"Grön"      },
      { en:"PINK",     es:"Rosa",        fr:"Rose",          ar:"وردي",     pt:"Rosa",      de:"Rosa",       it:"Rosa",        zh:"粉色",  ja:"ピンク",    ko:"분홍색",  ru:"Розовый",   hi:"गुलाबी",    tr:"Pembe",          nl:"Roze",        pl:"Różowy",      sv:"Rosa"      },
      { en:"GOLD",     es:"Oro",         fr:"Or",            ar:"ذهبي",     pt:"Dourado",   de:"Gold",       it:"Oro",         zh:"金色",  ja:"きん",      ko:"금색",    ru:"Золотой",   hi:"सोना",      tr:"Altın",          nl:"Goud",        pl:"Złoty",       sv:"Guld"      },
      { en:"GREY",     es:"Gris",        fr:"Gris",          ar:"رمادي",    pt:"Cinza",     de:"Grau",       it:"Grigio",      zh:"灰色",  ja:"はいいろ",  ko:"회색",    ru:"Серый",     hi:"धूसर",      tr:"Gri",            nl:"Grijs",       pl:"Szary",       sv:"Grå"       },
      { en:"CYAN",     es:"Cian",        fr:"Cyan",          ar:"سماوي",    pt:"Ciano",     de:"Cyan",       it:"Ciano",       zh:"青色",  ja:"シアン",    ko:"청록색",  ru:"Циан",      hi:"नीलाभ",     tr:"Camgöbeği",      nl:"Cyaan",       pl:"Cyjan",       sv:"Cyan"      },
      { en:"NAVY",     es:"Marino",      fr:"Marine",        ar:"أزرق داكن",pt:"Marinho",   de:"Marineblau", it:"Blu navy",    zh:"海军蓝",ja:"ネイビー",  ko:"남색",    ru:"Тёмно-синий",hi:"गहरा नीला", tr:"Lacivert",       nl:"Marineblauw", pl:"Granatowy",   sv:"Mörkblå"   },
      { en:"BLACK",    es:"Negro",       fr:"Noir",          ar:"أسود",     pt:"Preto",     de:"Schwarz",    it:"Nero",        zh:"黑色",  ja:"くろ",      ko:"검은색",  ru:"Чёрный",    hi:"काला",      tr:"Siyah",          nl:"Zwart",       pl:"Czarny",      sv:"Svart"     },
      { en:"WHITE",    es:"Blanco",      fr:"Blanc",         ar:"أبيض",     pt:"Branco",    de:"Weiß",       it:"Bianco",      zh:"白色",  ja:"しろ",      ko:"흰색",    ru:"Белый",     hi:"सफेद",      tr:"Beyaz",          nl:"Wit",         pl:"Biały",       sv:"Vit"       },
      { en:"BROWN",    es:"Marrón",      fr:"Marron",        ar:"بني",      pt:"Marrom",    de:"Braun",      it:"Marrone",     zh:"棕色",  ja:"ちゃいろ",  ko:"갈색",    ru:"Коричневый",hi:"भूरा",       tr:"Kahverengi",     nl:"Bruin",       pl:"Brązowy",     sv:"Brun"      },
      { en:"CORAL",    es:"Coral",       fr:"Corail",        ar:"مرجاني",   pt:"Coral",     de:"Koralle",    it:"Corallo",     zh:"珊瑚色",ja:"コーラル",  ko:"산호색",  ru:"Коралловый",hi:"मूँगा",      tr:"Mercan",         nl:"Koraal",      pl:"Koralowy",    sv:"Korall"    },
      { en:"IVORY",    es:"Marfil",      fr:"Ivoire",        ar:"عاجي",     pt:"Marfim",    de:"Elfenbein",  it:"Avorio",      zh:"象牙色",ja:"アイボリー",ko:"아이보리", ru:"Слоновая кость",hi:"हाथीदाँत",tr:"Fildişi",      nl:"Ivoor",       pl:"Kość słoniowa",sv:"Elfenben" },
      { en:"LILAC",    es:"Lila",        fr:"Lilas",         ar:"ليلكي",    pt:"Lilás",     de:"Lila",       it:"Lilla",       zh:"淡紫色",ja:"ライラック",ko:"라일락",  ru:"Сиреневый", hi:"बकाइन",     tr:"Leylak",         nl:"Lila",        pl:"Liliowy",     sv:"Lila"      },
      { en:"OLIVE",    es:"Oliva",       fr:"Olive",         ar:"زيتوني",   pt:"Oliva",     de:"Olivgrün",   it:"Oliva",       zh:"橄榄色",ja:"オリーブ",  ko:"올리브색", ru:"Оливковый", hi:"जैतून",     tr:"Zeytin yeşili",  nl:"Olijf",       pl:"Oliwkowy",    sv:"Oliv"      },
      { en:"AMBER",    es:"Ámbar",       fr:"Ambre",         ar:"كهرماني",  pt:"Âmbar",     de:"Bernstein",  it:"Ambra",       zh:"琥珀色",ja:"アンバー",  ko:"호박색",  ru:"Янтарный",  hi:"अम्बर",     tr:"Kehribar",       nl:"Amber",       pl:"Bursztynowy", sv:"Bärnsten"  },
      { en:"CREAM",    es:"Crema",       fr:"Crème",         ar:"كريمي",    pt:"Creme",     de:"Cremefarben",it:"Crema",       zh:"奶油色",ja:"クリーム",  ko:"크림색",  ru:"Кремовый",  hi:"मलाई",      tr:"Krem",           nl:"Crème",       pl:"Kremowy",     sv:"Grädde"    },
      { en:"TEAL",     es:"Verde azul",  fr:"Sarcelle",      ar:"أزرق مخضر",pt:"Azul-petróleo",de:"Blaugrün",it:"Verde acqua", zh:"水鸭色",ja:"ティール",  ko:"청록",    ru:"Бирюзовый", hi:"हरे-नीले",  tr:"Teal",           nl:"Blauwgroen",  pl:"Morski",      sv:"Blågrön"   },
      { en:"LIME",     es:"Lima",        fr:"Citron vert",   ar:"ليموني",   pt:"Lima",      de:"Limette",    it:"Lime",        zh:"黄绿色",ja:"ライム",    ko:"라임색",  ru:"Лаймовый",  hi:"नींबू हरा", tr:"Limon yeşili",   nl:"Limoen",      pl:"Limonka",     sv:"Lime"      },
      { en:"ROSE",     es:"Rosa oscuro", fr:"Rose vif",      ar:"وردي داكن",pt:"Rosê",      de:"Rosenrot",   it:"Rosa vivo",   zh:"玫瑰色",ja:"ばら色",    ko:"장밋빛",  ru:"Розовый",   hi:"गुलाब",     tr:"Gül rengi",      nl:"Donkerroze",  pl:"Różany",      sv:"Rosröd"    },
    ],
  },

  // ────────────────── FRUITS ────────────────────────────────────────────────
  {
    name: "Fruits", emoji:"1f34e", icon: Apple,
    words: [
      { en:"APPLE",    es:"Manzana",     fr:"Pomme",         ar:"تفاحة",    pt:"Maçã",      de:"Apfel",      it:"Mela",        zh:"苹果",  ja:"りんご",    ko:"사과",    ru:"Яблоко",    hi:"सेब",       tr:"Elma",           nl:"Appel",       pl:"Jabłko",      sv:"Äpple"     },
      { en:"MANGO",    es:"Mango",       fr:"Mangue",        ar:"مانجو",    pt:"Manga",      de:"Mango",      it:"Mango",       zh:"芒果",  ja:"マンゴー",  ko:"망고",    ru:"Манго",     hi:"आम",        tr:"Mango",          nl:"Mango",       pl:"Mango",       sv:"Mango"     },
      { en:"GRAPE",    es:"Uva",         fr:"Raisin",        ar:"عنب",      pt:"Uva",        de:"Traube",     it:"Uva",         zh:"葡萄",  ja:"ぶどう",    ko:"포도",    ru:"Виноград",  hi:"अंगूर",     tr:"Üzüm",           nl:"Druif",       pl:"Winogrono",   sv:"Druva"     },
      { en:"LEMON",    es:"Limón",       fr:"Citron",        ar:"ليمون",    pt:"Limão",      de:"Zitrone",    it:"Limone",      zh:"柠檬",  ja:"レモン",    ko:"레몬",    ru:"Лимон",     hi:"नींबू",     tr:"Limon",          nl:"Citroen",     pl:"Cytryna",     sv:"Citron"    },
      { en:"PEACH",    es:"Melocotón",   fr:"Pêche",         ar:"خوخ",      pt:"Pêssego",    de:"Pfirsich",   it:"Pesca",       zh:"桃子",  ja:"もも",      ko:"복숭아",  ru:"Персик",    hi:"आड़ू",      tr:"Şeftali",        nl:"Perzik",      pl:"Brzoskwinia", sv:"Persika"   },
      { en:"PEAR",     es:"Pera",        fr:"Poire",         ar:"كمثرى",    pt:"Pêra",       de:"Birne",      it:"Pera",        zh:"梨",    ja:"なし",      ko:"배",      ru:"Груша",     hi:"नाशपाती",   tr:"Armut",          nl:"Peer",        pl:"Gruszka",     sv:"Päron"     },
      { en:"PLUM",     es:"Ciruela",     fr:"Prune",         ar:"برقوق",    pt:"Ameixa",     de:"Pflaume",    it:"Prugna",      zh:"李子",  ja:"すもも",    ko:"자두",    ru:"Слива",     hi:"बेर",       tr:"Erik",           nl:"Pruim",       pl:"Śliwka",      sv:"Plommon"   },
      { en:"LIME",     es:"Lima",        fr:"Citron vert",   ar:"ليم",      pt:"Lima",       de:"Limette",    it:"Lime",        zh:"青柠",  ja:"ライム",    ko:"라임",    ru:"Лайм",      hi:"नीम्बू",    tr:"Misket limonu",  nl:"Limoen",      pl:"Limonka",     sv:"Lime"      },
      { en:"KIWI",     es:"Kiwi",        fr:"Kiwi",          ar:"كيوي",     pt:"Kiwi",       de:"Kiwi",       it:"Kiwi",        zh:"猕猴桃",ja:"キウイ",    ko:"키위",    ru:"Киви",      hi:"कीवी",      tr:"Kivi",           nl:"Kiwi",        pl:"Kiwi",        sv:"Kiwi"      },
      { en:"MELON",    es:"Melón",       fr:"Melon",         ar:"بطيخ",     pt:"Melão",      de:"Melone",     it:"Melone",      zh:"甜瓜",  ja:"メロン",    ko:"멜론",    ru:"Дыня",      hi:"खरबूजा",    tr:"Kavun",          nl:"Meloen",      pl:"Melon",       sv:"Melon"     },
      { en:"CHERRY",   es:"Cereza",      fr:"Cerise",        ar:"كرز",      pt:"Cereja",     de:"Kirsche",    it:"Ciliegia",    zh:"樱桃",  ja:"さくらんぼ",ko:"체리",    ru:"Вишня",     hi:"चेरी",      tr:"Kiraz",          nl:"Kers",        pl:"Wiśnia",      sv:"Körsbär"   },
      { en:"PAPAYA",   es:"Papaya",      fr:"Papaye",        ar:"بابايا",   pt:"Mamão",      de:"Papaya",     it:"Papaia",      zh:"木瓜",  ja:"パパイヤ",  ko:"파파야",  ru:"Папайя",    hi:"पपीता",     tr:"Papaya",         nl:"Papaja",      pl:"Papaja",      sv:"Papaya"    },
      { en:"COCONUT",  es:"Coco",        fr:"Noix de coco",  ar:"جوز الهند",pt:"Coco",       de:"Kokosnuss",  it:"Cocco",       zh:"椰子",  ja:"ココナツ",  ko:"코코넛",  ru:"Кокос",     hi:"नारियल",    tr:"Hindistan cevizi",nl:"Kokosnoot",  pl:"Kokos",       sv:"Kokosnöt"  },
      { en:"BANANA",   es:"Plátano",     fr:"Banane",        ar:"موزة",     pt:"Banana",     de:"Banane",     it:"Banana",      zh:"香蕉",  ja:"バナナ",    ko:"바나나",  ru:"Банан",     hi:"केला",      tr:"Muz",            nl:"Banaan",      pl:"Banan",       sv:"Banan"     },
      { en:"ORANGE",   es:"Naranja",     fr:"Orange",        ar:"برتقال",   pt:"Laranja",    de:"Orange",     it:"Arancia",     zh:"橙子",  ja:"オレンジ",  ko:"오렌지",  ru:"Апельсин",  hi:"संतरा",     tr:"Portakal",       nl:"Sinaasappel", pl:"Pomarańcza",  sv:"Apelsin"   },
      { en:"MELON",    es:"Sandía",      fr:"Pastèque",      ar:"بطيخ أحمر",pt:"Melancia",   de:"Wassermelone",it:"Anguria",    zh:"西瓜",  ja:"すいか",    ko:"수박",    ru:"Арбуз",     hi:"तरबूज़",    tr:"Karpuz",         nl:"Watermeloen", pl:"Arbuz",       sv:"Vattenmelon"},
      { en:"APRICOT",  es:"Albaricoque", fr:"Abricot",       ar:"مشمش",     pt:"Damasco",    de:"Aprikose",   it:"Albicocca",   zh:"杏子",  ja:"あんず",    ko:"살구",    ru:"Абрикос",   hi:"खुबानी",    tr:"Kayısı",         nl:"Abrikoos",    pl:"Morela",      sv:"Aprikos"   },
      { en:"FIG",      es:"Higo",        fr:"Figue",         ar:"تين",      pt:"Figo",       de:"Feige",      it:"Fico",        zh:"无花果",ja:"いちじく",  ko:"무화과",  ru:"Инжир",     hi:"अंजीर",     tr:"İncir",          nl:"Vijg",        pl:"Figa",        sv:"Fikon"     },
    ],
  },

  // ────────────────── FOOD ──────────────────────────────────────────────────
  {
    name: "Food", emoji:"1f35c", icon: Utensils,
    words: [
      { en:"SOUP",     es:"Sopa",        fr:"Soupe",         ar:"حساء",     pt:"Sopa",       de:"Suppe",      it:"Zuppa",       zh:"汤",    ja:"スープ",    ko:"수프",    ru:"Суп",       hi:"सूप",       tr:"Çorba",          nl:"Soep",        pl:"Zupa",        sv:"Soppa"     },
      { en:"RICE",     es:"Arroz",       fr:"Riz",           ar:"أرز",      pt:"Arroz",      de:"Reis",       it:"Riso",        zh:"米饭",  ja:"ごはん",    ko:"밥",      ru:"Рис",       hi:"चावल",      tr:"Pirinç",         nl:"Rijst",       pl:"Ryż",         sv:"Ris"       },
      { en:"BREAD",    es:"Pan",         fr:"Pain",          ar:"خبز",      pt:"Pão",        de:"Brot",       it:"Pane",        zh:"面包",  ja:"パン",      ko:"빵",      ru:"Хлеб",      hi:"रोटी",      tr:"Ekmek",          nl:"Brood",       pl:"Chleb",       sv:"Bröd"      },
      { en:"PIZZA",    es:"Pizza",       fr:"Pizza",         ar:"بيتزا",    pt:"Pizza",      de:"Pizza",      it:"Pizza",       zh:"披萨",  ja:"ピザ",      ko:"피자",    ru:"Пицца",     hi:"पिज़्ज़ा",  tr:"Pizza",          nl:"Pizza",       pl:"Pizza",       sv:"Pizza"     },
      { en:"PASTA",    es:"Pasta",       fr:"Pâtes",         ar:"معكرونة",  pt:"Macarrão",   de:"Nudeln",     it:"Pasta",       zh:"意面",  ja:"パスタ",    ko:"파스타",  ru:"Паста",     hi:"पास्ता",    tr:"Makarna",        nl:"Pasta",       pl:"Makaron",     sv:"Pasta"     },
      { en:"CAKE",     es:"Pastel",      fr:"Gâteau",        ar:"كعكة",     pt:"Bolo",       de:"Kuchen",     it:"Torta",       zh:"蛋糕",  ja:"ケーキ",    ko:"케이크",  ru:"Торт",      hi:"केक",       tr:"Pasta",          nl:"Taart",       pl:"Ciasto",      sv:"Tårta"     },
      { en:"MILK",     es:"Leche",       fr:"Lait",          ar:"حليب",     pt:"Leite",      de:"Milch",      it:"Latte",       zh:"牛奶",  ja:"ぎゅうにゅう",ko:"우유",  ru:"Молоко",    hi:"दूध",       tr:"Süt",            nl:"Melk",        pl:"Mleko",       sv:"Mjölk"     },
      { en:"JUICE",    es:"Jugo",        fr:"Jus",           ar:"عصير",     pt:"Suco",       de:"Saft",       it:"Succo",       zh:"果汁",  ja:"ジュース",  ko:"주스",    ru:"Сок",       hi:"जूस",       tr:"Meyve suyu",     nl:"Sap",         pl:"Sok",         sv:"Juice"     },
      { en:"SALAD",    es:"Ensalada",    fr:"Salade",        ar:"سلطة",     pt:"Salada",     de:"Salat",      it:"Insalata",    zh:"沙拉",  ja:"サラダ",    ko:"샐러드",  ru:"Салат",     hi:"सलाद",      tr:"Salata",         nl:"Salade",      pl:"Sałatka",     sv:"Sallad"    },
      { en:"CHEESE",   es:"Queso",       fr:"Fromage",       ar:"جبن",      pt:"Queijo",     de:"Käse",       it:"Formaggio",   zh:"奶酪",  ja:"チーズ",    ko:"치즈",    ru:"Сыр",       hi:"पनीर",      tr:"Peynir",         nl:"Kaas",        pl:"Ser",         sv:"Ost"       },
      { en:"BUTTER",   es:"Mantequilla", fr:"Beurre",        ar:"زبدة",     pt:"Manteiga",   de:"Butter",     it:"Burro",       zh:"黄油",  ja:"バター",    ko:"버터",    ru:"Масло",     hi:"मक्खन",     tr:"Tereyağı",       nl:"Boter",       pl:"Masło",       sv:"Smör"      },
      { en:"SUGAR",    es:"Azúcar",      fr:"Sucre",         ar:"سكر",      pt:"Açúcar",     de:"Zucker",     it:"Zucchero",    zh:"糖",    ja:"さとう",    ko:"설탕",    ru:"Сахар",     hi:"चीनी",      tr:"Şeker",          nl:"Suiker",      pl:"Cukier",      sv:"Socker"    },
      { en:"HONEY",    es:"Miel",        fr:"Miel",          ar:"عسل",      pt:"Mel",        de:"Honig",      it:"Miele",       zh:"蜂蜜",  ja:"はちみつ",  ko:"꿀",      ru:"Мёд",       hi:"शहद",       tr:"Bal",            nl:"Honing",      pl:"Miód",        sv:"Honung"    },
      { en:"EGG",      es:"Huevo",       fr:"Œuf",           ar:"بيضة",     pt:"Ovo",        de:"Ei",         it:"Uovo",        zh:"鸡蛋",  ja:"たまご",    ko:"달걀",    ru:"Яйцо",      hi:"अंडा",      tr:"Yumurta",        nl:"Ei",          pl:"Jajko",       sv:"Ägg"       },
      { en:"STEAK",    es:"Filete",      fr:"Steak",         ar:"شريحة لحم",pt:"Bife",       de:"Steak",      it:"Bistecca",    zh:"牛排",  ja:"ステーキ",  ko:"스테이크", ru:"Стейк",    hi:"स्टेक",     tr:"Biftek",         nl:"Biefstuk",    pl:"Stek",        sv:"Biff"      },
    ],
  },

  // ────────────────── HOME ──────────────────────────────────────────────────
  {
    name: "Home", emoji:"1f3e0", icon: Home,
    words: [
      { en:"DOOR",     es:"Puerta",      fr:"Porte",         ar:"باب",      pt:"Porta",      de:"Tür",        it:"Porta",       zh:"门",    ja:"ドア",      ko:"문",      ru:"Дверь",     hi:"दरवाजा",    tr:"Kapı",           nl:"Deur",        pl:"Drzwi",       sv:"Dörr"      },
      { en:"ROOF",     es:"Techo",       fr:"Toit",          ar:"سقف",      pt:"Telhado",    de:"Dach",       it:"Tetto",       zh:"屋顶",  ja:"やね",      ko:"지붕",    ru:"Крыша",     hi:"छत",        tr:"Çatı",           nl:"Dak",         pl:"Dach",        sv:"Tak"       },
      { en:"WALL",     es:"Pared",       fr:"Mur",           ar:"جدار",     pt:"Parede",     de:"Wand",       it:"Muro",        zh:"墙",    ja:"かべ",      ko:"벽",      ru:"Стена",     hi:"दीवार",     tr:"Duvar",          nl:"Muur",        pl:"Ściana",      sv:"Vägg"      },
      { en:"FLOOR",    es:"Suelo",       fr:"Sol",           ar:"أرضية",    pt:"Chão",       de:"Boden",      it:"Pavimento",   zh:"地板",  ja:"ゆか",      ko:"바닥",    ru:"Пол",       hi:"फर्श",      tr:"Zemin",          nl:"Vloer",       pl:"Podłoga",     sv:"Golv"      },
      { en:"CHAIR",    es:"Silla",       fr:"Chaise",        ar:"كرسي",     pt:"Cadeira",    de:"Stuhl",      it:"Sedia",       zh:"椅子",  ja:"いす",      ko:"의자",    ru:"Стул",      hi:"कुर्सी",    tr:"Sandalye",       nl:"Stoel",       pl:"Krzesło",     sv:"Stol"      },
      { en:"TABLE",    es:"Mesa",        fr:"Table",         ar:"طاولة",    pt:"Mesa",       de:"Tisch",      it:"Tavolo",      zh:"桌子",  ja:"テーブル",  ko:"탁자",    ru:"Стол",      hi:"मेज़",      tr:"Masa",           nl:"Tafel",       pl:"Stół",        sv:"Bord"      },
      { en:"LAMP",     es:"Lámpara",     fr:"Lampe",         ar:"مصباح",    pt:"Lâmpada",    de:"Lampe",      it:"Lampada",     zh:"灯",    ja:"ランプ",    ko:"램프",    ru:"Лампа",     hi:"दीपक",      tr:"Lamba",          nl:"Lamp",        pl:"Lampa",       sv:"Lampa"     },
      { en:"SOFA",     es:"Sofá",        fr:"Canapé",        ar:"أريكة",    pt:"Sofá",       de:"Sofa",       it:"Divano",      zh:"沙发",  ja:"ソファ",    ko:"소파",    ru:"Диван",     hi:"सोफ़ा",     tr:"Kanepe",         nl:"Bank",        pl:"Sofa",        sv:"Soffa"     },
      { en:"BED",      es:"Cama",        fr:"Lit",           ar:"سرير",     pt:"Cama",       de:"Bett",       it:"Letto",       zh:"床",    ja:"ベッド",    ko:"침대",    ru:"Кровать",   hi:"बिस्तर",    tr:"Yatak",          nl:"Bed",         pl:"Łóżko",       sv:"Säng"      },
      { en:"CLOCK",    es:"Reloj",       fr:"Horloge",       ar:"ساعة حائط",pt:"Relógio",    de:"Uhr",        it:"Orologio",    zh:"时钟",  ja:"とけい",    ko:"시계",    ru:"Часы",      hi:"घड़ी",      tr:"Saat",           nl:"Klok",        pl:"Zegar",       sv:"Klocka"    },
      { en:"MIRROR",   es:"Espejo",      fr:"Miroir",        ar:"مرآة",     pt:"Espelho",    de:"Spiegel",    it:"Specchio",    zh:"镜子",  ja:"かがみ",    ko:"거울",    ru:"Зеркало",   hi:"दर्पण",     tr:"Ayna",           nl:"Spiegel",     pl:"Lustro",      sv:"Spegel"    },
      { en:"WINDOW",   es:"Ventana",     fr:"Fenêtre",       ar:"نافذة",    pt:"Janela",     de:"Fenster",    it:"Finestra",    zh:"窗户",  ja:"まど",      ko:"창문",    ru:"Окно",      hi:"खिड़की",    tr:"Pencere",        nl:"Raam",        pl:"Okno",        sv:"Fönster"   },
      { en:"BOOK",     es:"Libro",       fr:"Livre",         ar:"كتاب",     pt:"Livro",      de:"Buch",       it:"Libro",       zh:"书",    ja:"ほん",      ko:"책",      ru:"Книга",     hi:"किताब",     tr:"Kitap",          nl:"Boek",        pl:"Książka",     sv:"Bok"       },
      { en:"PILLOW",   es:"Almohada",    fr:"Oreiller",      ar:"وسادة",    pt:"Travesseiro",de:"Kissen",     it:"Cuscino",     zh:"枕头",  ja:"まくら",    ko:"베개",    ru:"Подушка",   hi:"तकिया",     tr:"Yastık",         nl:"Kussen",      pl:"Poduszka",    sv:"Kudde"     },
    ],
  },

  // ────────────────── NATURE ─────────────────────────────────────────────────
  {
    name: "Nature", emoji:"1f33f", icon: Leaf,
    words: [
      { en:"TREE",     es:"Árbol",       fr:"Arbre",         ar:"شجرة",     pt:"Árvore",     de:"Baum",       it:"Albero",      zh:"树",    ja:"き",        ko:"나무",    ru:"Дерево",    hi:"पेड़",      tr:"Ağaç",           nl:"Boom",        pl:"Drzewo",      sv:"Träd"      },
      { en:"LEAF",     es:"Hoja",        fr:"Feuille",       ar:"ورقة",     pt:"Folha",      de:"Blatt",      it:"Foglia",      zh:"叶子",  ja:"は",        ko:"잎",      ru:"Лист",      hi:"पत्ती",     tr:"Yaprak",         nl:"Blad",        pl:"Liść",        sv:"Löv"       },
      { en:"RIVER",    es:"Río",         fr:"Rivière",       ar:"نهر",      pt:"Rio",        de:"Fluss",      it:"Fiume",       zh:"河流",  ja:"かわ",      ko:"강",      ru:"Река",      hi:"नदी",       tr:"Nehir",          nl:"Rivier",      pl:"Rzeka",       sv:"Flod"      },
      { en:"OCEAN",    es:"Océano",      fr:"Océan",         ar:"محيط",     pt:"Oceano",     de:"Ozean",      it:"Oceano",      zh:"海洋",  ja:"うみ",      ko:"바다",    ru:"Океан",     hi:"महासागर",   tr:"Okyanus",        nl:"Oceaan",      pl:"Ocean",       sv:"Hav"       },
      { en:"CLOUD",    es:"Nube",        fr:"Nuage",         ar:"سحابة",    pt:"Nuvem",      de:"Wolke",      it:"Nuvola",      zh:"云",    ja:"くも",      ko:"구름",    ru:"Облако",    hi:"बादल",      tr:"Bulut",          nl:"Wolk",        pl:"Chmura",      sv:"Moln"      },
      { en:"RAIN",     es:"Lluvia",      fr:"Pluie",         ar:"مطر",      pt:"Chuva",      de:"Regen",      it:"Pioggia",     zh:"雨",    ja:"あめ",      ko:"비",      ru:"Дождь",     hi:"बारिश",     tr:"Yağmur",         nl:"Regen",       pl:"Deszcz",      sv:"Regn"      },
      { en:"SNOW",     es:"Nieve",       fr:"Neige",         ar:"ثلج",      pt:"Neve",       de:"Schnee",     it:"Neve",        zh:"雪",    ja:"ゆき",      ko:"눈",      ru:"Снег",      hi:"बर्फ",      tr:"Kar",            nl:"Sneeuw",      pl:"Śnieg",       sv:"Snö"       },
      { en:"WIND",     es:"Viento",      fr:"Vent",          ar:"ريح",      pt:"Vento",      de:"Wind",       it:"Vento",       zh:"风",    ja:"かぜ",      ko:"바람",    ru:"Ветер",     hi:"हवा",       tr:"Rüzgar",         nl:"Wind",        pl:"Wiatr",       sv:"Vind"      },
      { en:"STONE",    es:"Piedra",      fr:"Pierre",        ar:"حجر",      pt:"Pedra",      de:"Stein",      it:"Pietra",      zh:"石头",  ja:"いし",      ko:"돌",      ru:"Камень",    hi:"पत्थर",     tr:"Taş",            nl:"Steen",       pl:"Kamień",      sv:"Sten"      },
      { en:"SAND",     es:"Arena",       fr:"Sable",         ar:"رمل",      pt:"Areia",      de:"Sand",       it:"Sabbia",      zh:"沙子",  ja:"すな",      ko:"모래",    ru:"Песок",     hi:"रेत",       tr:"Kum",            nl:"Zand",        pl:"Piasek",      sv:"Sand"      },
      { en:"MOON",     es:"Luna",        fr:"Lune",          ar:"قمر",      pt:"Lua",        de:"Mond",       it:"Luna",        zh:"月亮",  ja:"つき",      ko:"달",      ru:"Луна",      hi:"चाँद",      tr:"Ay",             nl:"Maan",        pl:"Księżyc",     sv:"Måne"      },
      { en:"STAR",     es:"Estrella",    fr:"Étoile",        ar:"نجمة",     pt:"Estrela",    de:"Stern",      it:"Stella",      zh:"星星",  ja:"ほし",      ko:"별",      ru:"Звезда",    hi:"तारा",      tr:"Yıldız",         nl:"Ster",        pl:"Gwiazda",     sv:"Stjärna"   },
      { en:"SUN",      es:"Sol",         fr:"Soleil",        ar:"شمس",      pt:"Sol",        de:"Sonne",      it:"Sole",        zh:"太阳",  ja:"たいよう",  ko:"태양",    ru:"Солнце",    hi:"सूरज",      tr:"Güneş",          nl:"Zon",         pl:"Słońce",      sv:"Sol"       },
      { en:"FIRE",     es:"Fuego",       fr:"Feu",           ar:"نار",      pt:"Fogo",       de:"Feuer",      it:"Fuoco",       zh:"火",    ja:"ひ",        ko:"불",      ru:"Огонь",     hi:"आग",        tr:"Ateş",           nl:"Vuur",        pl:"Ogień",       sv:"Eld"       },
    ],
  },
];

// Idiomas con dirección RTL
const RTL_LANGS = new Set(["ar"]);
const GRID_SIZE = 10;

// ─── Traducciones de interfaz ──────────────────────────────────────────────
const UI_STRINGS = {
  newPuzzle: {
    es:"Nuevo puzzle",    fr:"Nouveau puzzle",  ar:"لعبة جديدة",
    pt:"Novo puzzle",     de:"Neues Rätsel",    it:"Nuovo puzzle",
    zh:"新游戏",          ja:"新しいパズル",    ko:"새 게임",
    ru:"Новая игра",      hi:"नई पहेली",        tr:"Yeni bulmaca",
    nl:"Nieuw puzzel",    pl:"Nowa układanka",  sv:"Nytt pussel",
  },
  findWords: {
    es:"Encuentra estas palabras",  fr:"Trouve ces mots",       ar:"ابحث عن هذه الكلمات",
    pt:"Encontre estas palavras",   de:"Finde diese Wörter",    it:"Trova queste parole",
    zh:"找找这些单词",              ja:"これらの言葉を探して", ko:"이 단어들을 찾아보세요",
    ru:"Найди эти слова",           hi:"ये शब्द खोजें",         tr:"Bu kelimeleri bul",
    nl:"Vind deze woorden",         pl:"Znajdź te słowa",       sv:"Hitta dessa ord",
  },
  wellDone: {
    es:"¡Muy bien! ¡Encontraste todas las palabras!",
    fr:"Bravo ! Tu as trouvé tous les mots !",
    ar:"!أحسنت! لقد وجدت جميع الكلمات",
    pt:"Muito bem! Encontraste todas as palavras!",
    de:"Super! Du hast alle Wörter gefunden!",
    it:"Bravissimo! Hai trovato tutte le parole!",
    zh:"太棒了！你找到了所有单词！",
    ja:"よくできました！全部の言葉を見つけたよ！",
    ko:"잘했어요! 모든 단어를 찾았어요!",
    ru:"Молодец! Ты нашёл все слова!",
    hi:"शाबाश! तुमने सभी शब्द खोज लिए!",
    tr:"Harika! Tüm kelimeleri buldun!",
    nl:"Goed gedaan! Je hebt alle woorden gevonden!",
    pl:"Świetnie! Znalazłeś wszystkie słowa!",
    sv:"Bra jobbat! Du hittade alla orden!",
  },
  howToPlay: {
    es:"Cómo jugar",    fr:"Comment jouer",   ar:"كيف تلعب",
    pt:"Como jogar",    de:"So spielst du",   it:"Come si gioca",
    zh:"如何游戏",      ja:"遊び方",          ko:"게임 방법",
    ru:"Как играть",    hi:"कैसे खेलें",      tr:"Nasıl oynanır",
    nl:"Hoe te spelen", pl:"Jak grać",        sv:"Hur man spelar",
  },
};
function getTranslation(key, langCode) {
  const translations = UI_STRINGS[key];
  if (!translations) return key;
  return translations[langCode] || translations["es"] || key;
}

// ─── Grid builder ─────────────────────────────────────────────────────────
function buildGrid(words) {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const grid = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(""));
  const placed = [];
  const DIRS = [[0,1],[1,0],[1,1],[0,-1],[-1,0],[-1,-1],[1,-1],[-1,1]];

  for (const wordObj of words) {
    const word = wordObj.en.toUpperCase().replace(/\s+/g,"");
    let success = false;
    for (let attempt = 0; attempt < 80 && !success; attempt++) {
      const [dr, dc] = DIRS[Math.floor(Math.random() * DIRS.length)];
      const r0 = Math.floor(Math.random() * GRID_SIZE);
      const c0 = Math.floor(Math.random() * GRID_SIZE);
      const cells = [];
      let ok = true;
      for (let i = 0; i < word.length; i++) {
        const r = r0 + dr * i, c = c0 + dc * i;
        if (r < 0 || r >= GRID_SIZE || c < 0 || c >= GRID_SIZE) { ok = false; break; }
        if (grid[r][c] !== "" && grid[r][c] !== word[i]) { ok = false; break; }
        cells.push({ r, c });
      }
      if (ok) {
        cells.forEach(({ r, c }, i) => { grid[r][c] = word[i]; });
        placed.push({ word: wordObj, cells });
        success = true;
      }
    }
  }
  for (let r = 0; r < GRID_SIZE; r++)
    for (let c = 0; c < GRID_SIZE; c++)
      if (grid[r][c] === "") grid[r][c] = letters[Math.floor(Math.random() * 26)];
  return { grid, placed };
}

// ─── Confetti ──────────────────────────────────────────────────────────────
function Confetti({ active }) {
  const ps = Array.from({ length: 22 }, (_, i) => ({
    id: i, x: Math.random() * 100, delay: Math.random() * .4, size: Math.random() * 10 + 8,
    color: ["#F9A825","#E53935","#43A047","#1565C0","#D81B60","#00ACC1"][i % 6],
  }));
  if (!active) return null;
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {ps.map(p => (
        <motion.div key={p.id} className="absolute rounded-sm top-0"
          style={{ left:`${p.x}%`, width:p.size, height:p.size, background:p.color }}
          initial={{ y:-20, opacity:1, rotate:0 }}
          animate={{ y:"106vh", opacity:0, rotate:720 }}
          transition={{ duration:1.5+Math.random(), delay:p.delay, ease:"easeIn" }}
        />
      ))}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// CUSTOM DROPDOWN — Category picker
// ══════════════════════════════════════════════════════════════════════════
function PackDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const sel = PACKS[value];

  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const Icon = sel.icon;

  return (
    <div ref={ref} style={{ position:"relative", zIndex:40 }}>
      <motion.button
        whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}
        onClick={() => setOpen(o => !o)}
        style={{
          display:"flex", alignItems:"center", gap:8, padding:"10px 18px",
          borderRadius:999, border:"2.5px solid white",
          background:"rgba(255,255,255,0.92)", backdropFilter:"blur(8px)",
          boxShadow:`0 4px 20px ${C.blue}22`, cursor:"pointer",
          fontFamily:"var(--font-display,'Nunito',sans-serif)", fontWeight:700,
          fontSize:14, color:C.blue, whiteSpace:"nowrap",
          minWidth:170, justifyContent:"space-between",
        }}
      >
        <span style={{ display:"flex", alignItems:"center", gap:7 }}>
          <EmojiSvg code={sel.emoji} size={20}/>
          <span>{sel.name}</span>
        </span>
        <motion.span animate={{ rotate:open?180:0 }} transition={{ duration:0.2 }}
          style={{ display:"flex" }}>
          <ChevronDown size={13}/>
        </motion.span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity:0, y:-8, scale:0.97 }}
            animate={{ opacity:1, y:0, scale:1 }}
            exit={{ opacity:0, y:-8, scale:0.97 }}
            transition={{ duration:0.15 }}
            style={{
              position:"absolute", top:"calc(100% + 8px)", left:"50%",
              transform:"translateX(-50%)", width:210,
              background:"white", borderRadius:18,
              border:`2px solid ${C.blue}18`,
              boxShadow:`0 16px 48px ${C.blue}20`,
              overflow:"hidden", maxHeight:320, overflowY:"auto",
              scrollbarWidth:"thin",
            }}
          >
            <div style={{
              padding:"8px 14px 6px", borderBottom:`1.5px solid ${C.blueSoft}`,
              fontFamily:"var(--font-display,'Nunito',sans-serif)", fontWeight:700,
              fontSize:10, color:C.blue, letterSpacing:"0.08em",
              textTransform:"uppercase", display:"flex", alignItems:"center", gap:5,
            }}>
              <Search size={10}/> Category
            </div>
            {PACKS.map((p, i) => {
              const PIcon = p.icon;
              const isA = value === i;
              return (
                <button key={i} onClick={() => { onChange(i); setOpen(false); }}
                  style={{
                    display:"flex", alignItems:"center", gap:9, width:"100%",
                    padding:"9px 14px", border:"none",
                    background: isA ? C.blueSoft : "transparent",
                    cursor:"pointer",
                    fontFamily:"var(--font-body,'Nunito',sans-serif)",
                    fontWeight: isA ? 700 : 500, fontSize:13,
                    color: isA ? C.blue : "#374151", textAlign:"left",
                    borderLeft: isA ? `3px solid ${C.blue}` : "3px solid transparent",
                  }}
                  onMouseEnter={e => { if (!isA) e.currentTarget.style.background = C.blueSoft + "60"; }}
                  onMouseLeave={e => { if (!isA) e.currentTarget.style.background = "transparent"; }}
                >
                  <EmojiSvg code={p.emoji} size={18}/>
                  <span style={{ flex:1 }}>{p.name}</span>
                  {isA && <span style={{ width:6, height:6, borderRadius:"50%", background:C.blue, flexShrink:0 }}/>}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// CUSTOM DROPDOWN — Language picker
// ══════════════════════════════════════════════════════════════════════════
function LangDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const sel = WORD_SEARCH_LANGS.find(l => l.code === value) || WORD_SEARCH_LANGS[0];

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
          display:"flex", alignItems:"center", gap:8, padding:"10px 18px",
          borderRadius:999, border:"2.5px solid white",
          background:"rgba(255,255,255,0.92)", backdropFilter:"blur(8px)",
          boxShadow:`0 4px 20px ${C.green}22`, cursor:"pointer",
          fontFamily:"var(--font-display,'Nunito',sans-serif)", fontWeight:700,
          fontSize:14, color:C.green, whiteSpace:"nowrap",
          minWidth:170, justifyContent:"space-between",
        }}
      >
        <span style={{ display:"flex", alignItems:"center", gap:7 }}>
          <Globe size={14} style={{ flexShrink:0 }}/>
          <FlagImg code={sel.flagCode} size={20}/>
          <span>{sel.label}</span>
        </span>
        <motion.span animate={{ rotate:open?180:0 }} transition={{ duration:0.2 }}
          style={{ display:"flex" }}>
          <ChevronDown size={13}/>
        </motion.span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity:0, y:-8, scale:0.97 }}
            animate={{ opacity:1, y:0, scale:1 }}
            exit={{ opacity:0, y:-8, scale:0.97 }}
            transition={{ duration:0.15 }}
            style={{
              position:"absolute", top:"calc(100% + 8px)", left:"50%",
              transform:"translateX(-50%)", width:215,
              background:"white", borderRadius:18,
              border:`2px solid ${C.green}18`,
              boxShadow:`0 16px 48px ${C.green}20`,
              overflow:"hidden", maxHeight:320, overflowY:"auto",
              scrollbarWidth:"thin",
            }}
          >
            <div style={{
              padding:"8px 14px 6px", borderBottom:`1.5px solid ${C.greenSoft}`,
              fontFamily:"var(--font-display,'Nunito',sans-serif)", fontWeight:700,
              fontSize:10, color:C.green, letterSpacing:"0.08em",
              textTransform:"uppercase", display:"flex", alignItems:"center", gap:5,
            }}>
              <Globe size={10}/> Translation language
            </div>
            {WORD_SEARCH_LANGS.map(l => {
              const isA = l.code === value;
              return (
                <button key={l.code} onClick={() => { onChange(l.code); setOpen(false); }}
                  style={{
                    display:"flex", alignItems:"center", gap:9, width:"100%",
                    padding:"8px 14px", border:"none",
                    background: isA ? C.greenSoft : "transparent",
                    cursor:"pointer",
                    fontFamily:"var(--font-body,'Nunito',sans-serif)",
                    fontWeight: isA ? 700 : 500, fontSize:13,
                    color: isA ? C.green : "#374151", textAlign:"left",
                    borderLeft: isA ? `3px solid ${C.green}` : "3px solid transparent",
                  }}
                  onMouseEnter={e => { if (!isA) e.currentTarget.style.background = C.greenSoft + "80"; }}
                  onMouseLeave={e => { if (!isA) e.currentTarget.style.background = "transparent"; }}
                >
                  <FlagImg code={l.flagCode} size={20}/>
                  <span style={{ flex:1 }}>{l.label}</span>
                  {isA && <span style={{ width:6, height:6, borderRadius:"50%", background:C.green, flexShrink:0 }}/>}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main WordSearch component ─────────────────────────────────────────────
export default function WordSearch({ lang = "en", onLangChange }) {
  const [packIdx,   setPackIdx]   = useState(0);
  const [gameData,  setGameData]  = useState(null);
  const [selecting, setSelecting] = useState(false);
  const [selection, setSelection] = useState([]);
  const [found,     setFound]     = useState([]);
  const [confetti,  setConfetti]  = useState(false);
  const [won,       setWon]       = useState(false);

  const pack = PACKS[packIdx];

  const startGame = useCallback((pIdx = packIdx) => {
    // Pick 12 random words so all fit reliably in the 10×10 grid
    const pool    = [...PACKS[pIdx].words];
    const picked  = pool.sort(() => Math.random() - 0.5).slice(0, 12);
    const data = buildGrid(picked);
    setGameData(data);
    setFound([]);
    setSelection([]);
    setSelecting(false);
    setWon(false);
  }, [packIdx]);

  useEffect(() => { startGame(packIdx); }, [packIdx]);

  const handleReset = () => { startGame(); };

  const checkSelection = (sel) => {
    if (!gameData || sel.length < 2) return;
    const selKey = sel.map(c => `${c.r},${c.c}`).join("|");
    const revKey = [...sel].reverse().map(c => `${c.r},${c.c}`).join("|");
    gameData.placed.forEach(({ word, cells }, wi) => {
      if (found.includes(wi)) return;
      const wKey = cells.map(c => `${c.r},${c.c}`).join("|");
      if (selKey === wKey || revKey === wKey) {
        const newFound = [...found, wi];
        setFound(newFound);
        if (newFound.length === gameData.placed.length) {
          setWon(true);
          setConfetti(true);
          setTimeout(() => setConfetti(false), 2500);
        }
      }
    });
  };

  const getCellStyle = (r, c) => {
    if (!gameData) return {};
    for (const wi of found) {
      const { cells } = gameData.placed[wi];
      if (cells.some(cell => cell.r === r && cell.c === c)) {
        const col = WORD_COLORS[wi % WORD_COLORS.length];
        return { background: col.bg, color: col.text, fontWeight: 700 };
      }
    }
    if (selection.some(cell => cell.r === r && cell.c === c)) {
      return { background: C.yellow + "80", color: C.blue, fontWeight: 700 };
    }
    return {};
  };

  const handleCellStart = (r, c) => {
    setSelecting(true);
    setSelection([{ r, c }]);
  };

  const handleCellEnter = (r, c) => {
    if (!selecting) return;
    const first = selection[0];
    if (!first) return;
    const dr = Math.sign(r - first.r);
    const dc = Math.sign(c - first.c);
    const len = Math.max(Math.abs(r - first.r), Math.abs(c - first.c)) + 1;
    if (dr !== 0 && dc !== 0 && Math.abs(r - first.r) !== Math.abs(c - first.c)) return;
    const newSel = [];
    for (let i = 0; i < len; i++) {
      newSel.push({ r: first.r + dr * i, c: first.c + dc * i });
    }
    setSelection(newSel);
  };

  const handleCellEnd = () => {
    if (!selecting) return;
    setSelecting(false);
    checkSelection(selection);
    setSelection([]);
  };

  // ── UI ────────────────────────────────────────────────────────────────────
  return (
    <div className="relative min-h-screen overflow-hidden">
      <WordSearchBg/>
      <Confetti active={confetti}/>

      <div className="relative z-10">
        {/* Header */}
        <div className="text-center py-10 px-4">
          <motion.div
            initial={{ scale:0.8, opacity:0 }} animate={{ scale:1, opacity:1 }}
            transition={{ type:"spring" }} className="mb-4"
          >
            <h1 style={{ lineHeight:1.2 }}>
              <BubbleTitle color="#E11D48" size={54}>Word Hunt</BubbleTitle>
            </h1>
          </motion.div>
          <p className="font-display text-slate-700 text-lg font-medium bg-white/40 backdrop-blur-sm inline-block px-4 py-1 rounded-full">
            Find all the hidden English words!
          </p>
        </div>

        {/* ── Controls — custom dropdowns ────────────────────────────── */}
        <div className="flex justify-center gap-3 px-4 mb-6 flex-wrap">
          <PackDropdown value={packIdx} onChange={idx => setPackIdx(idx)}/>
          <LangDropdown value={lang}    onChange={code => onLangChange?.(code)}/>
        </div>

        <div className="max-w-4xl mx-auto px-4 pb-20">
          {won && (
            <motion.div
              initial={{ scale:0.8, opacity:0 }} animate={{ scale:1, opacity:1 }}
              className="text-center mb-6 py-4 rounded-3xl font-display text-2xl text-white shadow-xl"
              style={{
                background:`linear-gradient(135deg, ${C.green}, #2E7D32)`,
                display:"flex", alignItems:"center", justifyContent:"center", gap:8,
              }}
            >
              <Trophy size={22} strokeWidth={2}/> {getTranslation("wellDone", lang)}
            </motion.div>
          )}

          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* Grid */}
            <div>
              <div
                className="grid gap-1 p-3 rounded-3xl shadow-xl border-4 border-white select-none"
                style={{ gridTemplateColumns:`repeat(${GRID_SIZE},1fr)`, background:C.blueSoft }}
                onMouseLeave={handleCellEnd}
                onTouchEnd={handleCellEnd}
              >
                {gameData && gameData.grid.map((row, r) =>
                  row.map((letter, c) => (
                    <motion.div
                      key={`${r}-${c}`}
                      className="aspect-square flex items-center justify-center rounded-lg font-display text-sm cursor-pointer transition-all"
                      style={{ background:"white", color:C.blue, fontSize:"clamp(11px,2vw,16px)", ...getCellStyle(r, c) }}
                      onMouseDown={()  => handleCellStart(r, c)}
                      onMouseEnter={() => handleCellEnter(r, c)}
                      onMouseUp={handleCellEnd}
                      onTouchStart={()  => handleCellStart(r, c)}
                    >
                      {letter}
                    </motion.div>
                  ))
                )}
              </div>

              <div className="mt-4 flex justify-center">
                <motion.button
                  whileHover={{ scale:1.04 }} whileTap={{ scale:0.96 }}
                  onClick={handleReset}
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl font-display text-white shadow-md"
                  style={{ background:C.red }}
                >
                  <RotateCcw size={16}/> {getTranslation("newPuzzle", lang)}
                </motion.button>
              </div>
            </div>

            {/* Word list */}
            <div>
              <h3 className="font-display text-sm font-bold mb-2 flex items-center gap-1.5" style={{ color:C.blue }}>
                <Search size={13}/> {getTranslation("findWords", lang)}
                <span className="text-xs font-normal opacity-70">({found.length}/{gameData?.placed.length ?? 0})</span>
              </h3>
              <div className="grid grid-cols-2 gap-1.5">
                {gameData && gameData.placed.map(({ word }, wi) => {
                  const isFound = found.includes(wi);
                  const col = WORD_COLORS[wi % WORD_COLORS.length];
                  return (
                    <motion.div
                      key={wi}
                      initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }}
                      transition={{ delay:wi * 0.04 }}
                      className="flex items-center gap-2 px-2.5 py-2 rounded-xl border-2 transition-all"
                      style={{ background:isFound ? col.bg : "white", borderColor:isFound ? col.border : "#E2E8F0" }}
                    >
                      {isFound
                        ? <CheckCircle size={13} style={{ color:col.text, flexShrink:0 }}/>
                        : <div className="w-3 h-3 rounded-full border-2 border-slate-300 flex-shrink-0"/>
                      }
                      <div className="flex-1 min-w-0">
                        <div className="font-display text-sm leading-tight truncate"
                          style={{ color:isFound ? col.text : C.blue }}>
                          {isFound ? word.en : "?".repeat(word.en.length)}
                        </div>
                        <div className="font-body text-xs text-slate-400 leading-tight truncate"
                          dir={lang === "ar" ? "rtl" : "ltr"}>
                          {word[lang]}
                        </div>
                      </div>
                      {isFound && <Star size={11} style={{ color:col.text, flexShrink:0 }}/>}
                    </motion.div>
                  );
                })}
              </div>

              {/* Instructions */}
              <div className="mt-6 rounded-3xl p-4 border-2 border-white shadow-sm" style={{ background:C.yellowSoft }}>
                <p className="font-display text-sm mb-1" style={{ color:C.yellow }}>
                  {getTranslation("howToPlay", lang)}
                </p>
                <p className="font-body text-xs text-slate-600">
                  Click and drag across letters to select a word. Words can go in any direction: horizontal, vertical, or diagonal!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
