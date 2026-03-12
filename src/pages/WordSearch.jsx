/**
 * src/pages/WordSearch.jsx — Kiddsy
 * Bilingual word search: find English words hidden in a grid
 * Words come from the story vocabulary + alphabet module
 */
import { LibraryBg } from "../components/PageBg";
import { BubbleTitle } from "../components/KiddsyFont";
import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CartoonTitle from "../components/CartoonTitle.jsx";
import { RotateCcw, Trophy, CheckCircle, Star, Search, Loader, Users, BookOpen, Utensils, Cat, Palette, Apple, Home, Leaf } from "lucide-react";
import EmojiSvg from "../utils/EmojiSvg.jsx";

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
      { en:"MANGO",    es:"Mango",       fr:"Mangue",        ar:"مانجو",    pt:"Manga",     de:"Mango",      it:"Mango",       zh:"芒果",  ja:"マンゴー",  ko:"망고",    ru:"Манго",     hi:"आम",        tr:"Mango",          nl:"Mango",       pl:"Mango",       sv:"Mango"     },
      { en:"GRAPE",    es:"Uva",         fr:"Raisin",        ar:"عنب",      pt:"Uva",       de:"Traube",     it:"Uva",         zh:"葡萄",  ja:"ぶどう",    ko:"포도",    ru:"Виноград",  hi:"अंगूर",     tr:"Üzüm",           nl:"Druif",       pl:"Winogrono",   sv:"Druva"     },
      { en:"PLUM",     es:"Ciruela",     fr:"Prune",         ar:"برقوق",    pt:"Ameixa",    de:"Pflaume",    it:"Susina",      zh:"李子",  ja:"すもも",    ko:"자두",    ru:"Слива",     hi:"आलूबुखारा", tr:"Erik",           nl:"Pruim",       pl:"Śliwka",      sv:"Plommon"   },
      { en:"PEAR",     es:"Pera",        fr:"Poire",         ar:"كمثرى",    pt:"Pera",      de:"Birne",      it:"Pera",        zh:"梨",    ja:"なし",      ko:"배",      ru:"Груша",     hi:"नाशपाती",   tr:"Armut",          nl:"Peer",        pl:"Gruszka",     sv:"Päron"     },
      { en:"KIWI",     es:"Kiwi",        fr:"Kiwi",          ar:"كيوي",     pt:"Kiwi",      de:"Kiwi",       it:"Kiwi",        zh:"奇异果",ja:"キウイ",    ko:"키위",    ru:"Киви",      hi:"कीवी",      tr:"Kivi",           nl:"Kiwi",        pl:"Kiwi",        sv:"Kiwi"      },
      { en:"LIME",     es:"Lima",        fr:"Citron vert",   ar:"ليمون أخضر",pt:"Lima",    de:"Limette",    it:"Lime",        zh:"青柠",  ja:"ライム",    ko:"라임",    ru:"Лайм",      hi:"नींबू",     tr:"Misket limonu",  nl:"Limoen",      pl:"Limonka",     sv:"Lime"      },
      { en:"MELON",    es:"Melón",       fr:"Melon",         ar:"بطيخ",     pt:"Melão",     de:"Melone",     it:"Melone",      zh:"哈密瓜",ja:"メロン",    ko:"멜론",    ru:"Дыня",      hi:"खरबूजा",   tr:"Kavun",          nl:"Meloen",      pl:"Melon",       sv:"Melon"     },
      { en:"LEMON",    es:"Limón",       fr:"Citron",        ar:"ليمون",    pt:"Limão",     de:"Zitrone",    it:"Limone",      zh:"柠檬",  ja:"レモン",    ko:"레몬",    ru:"Лимон",     hi:"नींबू",     tr:"Limon",          nl:"Citroen",     pl:"Cytryna",     sv:"Citron"    },
      { en:"PEACH",    es:"Melocotón",   fr:"Pêche",         ar:"خوخ",      pt:"Pêssego",   de:"Pfirsich",   it:"Pesca",       zh:"桃子",  ja:"もも",      ko:"복숭아",  ru:"Персик",    hi:"आड़ू",      tr:"Şeftali",        nl:"Perzik",      pl:"Brzoskwinia", sv:"Persika"   },
      { en:"CHERRY",   es:"Cereza",      fr:"Cerise",        ar:"كرز",      pt:"Cereja",    de:"Kirsche",    it:"Ciliegia",    zh:"樱桃",  ja:"さくらんぼ",ko:"체리",    ru:"Вишня",     hi:"चेरी",      tr:"Kiraz",          nl:"Kers",        pl:"Wiśnia",      sv:"Körsbär"   },
      { en:"PAPAYA",   es:"Papaya",      fr:"Papaye",        ar:"بابايا",   pt:"Mamão",     de:"Papaya",     it:"Papaia",      zh:"木瓜",  ja:"パパイヤ",  ko:"파파야",  ru:"Папайя",    hi:"पपीता",     tr:"Papaya",         nl:"Papaja",      pl:"Papaja",      sv:"Papaya"    },
      { en:"BANANA",   es:"Plátano",     fr:"Banane",        ar:"موز",      pt:"Banana",    de:"Banane",     it:"Banana",      zh:"香蕉",  ja:"バナナ",    ko:"바나나",  ru:"Банан",     hi:"केला",      tr:"Muz",            nl:"Banaan",      pl:"Banan",       sv:"Banan"     },
      { en:"ORANGE",   es:"Naranja",     fr:"Orange",        ar:"برتقال",   pt:"Laranja",   de:"Orange",     it:"Arancia",     zh:"橙子",  ja:"オレンジ",  ko:"오렌지",  ru:"Апельсин",  hi:"संतरा",     tr:"Portakal",       nl:"Sinaasappel", pl:"Pomarańcza",  sv:"Apelsin"   },
      { en:"GUAVA",    es:"Guayaba",     fr:"Goyave",        ar:"جوافة",    pt:"Goiaba",    de:"Guave",      it:"Guava",       zh:"番石榴",ja:"グアバ",    ko:"구아바",  ru:"Гуава",     hi:"अमरूद",     tr:"Guava",          nl:"Guave",       pl:"Guawa",       sv:"Guava"     },
      { en:"COCONUT",  es:"Coco",        fr:"Noix de coco",  ar:"جوز الهند",pt:"Coco",      de:"Kokosnuss",  it:"Noce di cocco",zh:"椰子", ja:"ヤシの実",  ko:"코코넛",  ru:"Кокос",     hi:"नारियल",    tr:"Hindistan cevizi",nl:"Kokosnoot",  pl:"Kokos",       sv:"Kokosnöt"  },
      { en:"APRICOT",  es:"Albaricoque", fr:"Abricot",       ar:"مشمش",     pt:"Damasco",   de:"Aprikose",   it:"Albicocca",   zh:"杏子",  ja:"あんず",    ko:"살구",    ru:"Абрикос",   hi:"खुबानी",    tr:"Kayısı",         nl:"Abrikoos",    pl:"Morela",      sv:"Aprikos"   },
      { en:"AVOCADO",  es:"Aguacate",    fr:"Avocat",        ar:"أفوكادو",  pt:"Abacate",   de:"Avocado",    it:"Avocado",     zh:"牛油果",ja:"アボカド",  ko:"아보카도", ru:"Авокадо",   hi:"एवोकाडो",   tr:"Avokado",        nl:"Avocado",     pl:"Awokado",     sv:"Avokado"   },
      { en:"BERRY",    es:"Baya",        fr:"Baie",          ar:"توت",      pt:"Baga",      de:"Beere",      it:"Bacca",       zh:"浆果",  ja:"ベリー",    ko:"베리",    ru:"Ягода",     hi:"बेरी",      tr:"Böğürtlen",      nl:"Bes",         pl:"Jagoda",      sv:"Bär"       },
      { en:"FIG",      es:"Higo",        fr:"Figue",         ar:"تين",      pt:"Figo",      de:"Feige",      it:"Fico",        zh:"无花果",ja:"いちじく",  ko:"무화과",  ru:"Инжир",     hi:"अंजीर",     tr:"İncir",          nl:"Vijg",        pl:"Figa",        sv:"Fikon"     },
    ],
  },

  // ────────────────── HOUSE ─────────────────────────────────────────────────
  {
    name: "House", emoji:"1f3e0", icon: Home,
    words: [
      { en:"BED",      es:"Cama",        fr:"Lit",           ar:"سرير",     pt:"Cama",      de:"Bett",       it:"Letto",       zh:"床",    ja:"ベッド",    ko:"침대",    ru:"Кровать",   hi:"बिस्तर",    tr:"Yatak",          nl:"Bed",         pl:"Łóżko",       sv:"Säng"      },
      { en:"SOFA",     es:"Sofá",        fr:"Canapé",        ar:"أريكة",    pt:"Sofá",      de:"Sofa",       it:"Divano",      zh:"沙发",  ja:"ソファ",    ko:"소파",    ru:"Диван",     hi:"सोफा",      tr:"Kanepe",         nl:"Sofa",        pl:"Sofa",        sv:"Soffa"     },
      { en:"DOOR",     es:"Puerta",      fr:"Porte",         ar:"باب",      pt:"Porta",     de:"Tür",        it:"Porta",       zh:"门",    ja:"ドア",      ko:"문",      ru:"Дверь",     hi:"दरवाजा",    tr:"Kapı",           nl:"Deur",        pl:"Drzwi",       sv:"Dörr"      },
      { en:"LAMP",     es:"Lámpara",     fr:"Lampe",         ar:"مصباح",    pt:"Lâmpada",   de:"Lampe",      it:"Lampada",     zh:"台灯",  ja:"ランプ",    ko:"램프",    ru:"Лампа",     hi:"दीपक",      tr:"Lamba",          nl:"Lamp",        pl:"Lampa",       sv:"Lampa"     },
      { en:"BATH",     es:"Baño",        fr:"Bain",          ar:"حمام",     pt:"Banho",     de:"Bad",        it:"Bagno",       zh:"浴室",  ja:"お風呂",    ko:"욕조",    ru:"Ванна",     hi:"स्नान",     tr:"Banyo",          nl:"Bad",         pl:"Łazienka",    sv:"Bad"       },
      { en:"ROOF",     es:"Techo",       fr:"Toit",          ar:"سقف",      pt:"Telhado",   de:"Dach",       it:"Tetto",       zh:"屋顶",  ja:"やね",      ko:"지붕",    ru:"Крыша",     hi:"छत",        tr:"Çatı",           nl:"Dak",         pl:"Dach",        sv:"Tak"       },
      { en:"WALL",     es:"Pared",       fr:"Mur",           ar:"جدار",     pt:"Parede",    de:"Wand",       it:"Muro",        zh:"墙",    ja:"かべ",      ko:"벽",      ru:"Стена",     hi:"दीवार",     tr:"Duvar",          nl:"Muur",        pl:"Ściana",      sv:"Vägg"      },
      { en:"FORK",     es:"Tenedor",     fr:"Fourchette",    ar:"شوكة",     pt:"Garfo",     de:"Gabel",      it:"Forchetta",   zh:"叉子",  ja:"フォーク",  ko:"포크",    ru:"Вилка",     hi:"काँटा",     tr:"Çatal",          nl:"Vork",        pl:"Widelec",     sv:"Gaffel"    },
      { en:"SPOON",    es:"Cuchara",     fr:"Cuillère",      ar:"ملعقة",    pt:"Colher",    de:"Löffel",     it:"Cucchiaio",   zh:"汤匙",  ja:"スプーン",  ko:"숟가락",  ru:"Ложка",     hi:"चम्मच",     tr:"Kaşık",          nl:"Lepel",       pl:"Łyżka",       sv:"Sked"      },
      { en:"CHAIR",    es:"Silla",       fr:"Chaise",        ar:"كرسي",     pt:"Cadeira",   de:"Stuhl",      it:"Sedia",       zh:"椅子",  ja:"いす",      ko:"의자",    ru:"Стул",      hi:"कुर्सी",    tr:"Sandalye",       nl:"Stoel",       pl:"Krzesło",     sv:"Stol"      },
      { en:"TABLE",    es:"Mesa",        fr:"Table",         ar:"طاولة",    pt:"Mesa",      de:"Tisch",      it:"Tavolo",      zh:"桌子",  ja:"テーブル",  ko:"탁자",    ru:"Стол",      hi:"मेज",       tr:"Masa",           nl:"Tafel",       pl:"Stół",        sv:"Bord"      },
      { en:"CLOCK",    es:"Reloj",       fr:"Horloge",       ar:"ساعة",     pt:"Relógio",   de:"Uhr",        it:"Orologio",    zh:"时钟",  ja:"とけい",    ko:"시계",    ru:"Часы",      hi:"घड़ी",      tr:"Saat",           nl:"Klok",        pl:"Zegar",       sv:"Klocka"    },
      { en:"STOVE",    es:"Estufa",      fr:"Cuisinière",    ar:"موقد",     pt:"Fogão",     de:"Herd",       it:"Fornello",    zh:"炉子",  ja:"コンロ",    ko:"스토브",  ru:"Плита",     hi:"चूल्हा",   tr:"Soba",           nl:"Fornuis",     pl:"Kuchenka",    sv:"Spis"      },
      { en:"TOWEL",    es:"Toalla",      fr:"Serviette",     ar:"منشفة",    pt:"Toalha",    de:"Handtuch",   it:"Asciugamano", zh:"毛巾",  ja:"タオル",    ko:"수건",    ru:"Полотенце", hi:"तौलिया",    tr:"Havlu",          nl:"Handdoek",    pl:"Ręcznik",     sv:"Handduk"   },
      { en:"WINDOW",   es:"Ventana",     fr:"Fenêtre",       ar:"نافذة",    pt:"Janela",    de:"Fenster",    it:"Finestra",    zh:"窗户",  ja:"まど",      ko:"창문",    ru:"Окно",      hi:"खिड़की",   tr:"Pencere",        nl:"Raam",        pl:"Okno",        sv:"Fönster"   },
      { en:"MIRROR",   es:"Espejo",      fr:"Miroir",        ar:"مرآة",     pt:"Espelho",   de:"Spiegel",    it:"Specchio",    zh:"镜子",  ja:"かがみ",    ko:"거울",    ru:"Зеркало",   hi:"दर्पण",     tr:"Ayna",           nl:"Spiegel",     pl:"Lustro",      sv:"Spegel"    },
      { en:"PILLOW",   es:"Almohada",    fr:"Oreiller",      ar:"وسادة",    pt:"Travesseiro",de:"Kissen",    it:"Cuscino",     zh:"枕头",  ja:"まくら",    ko:"베개",    ru:"Подушка",   hi:"तकिया",     tr:"Yastık",         nl:"Kussen",      pl:"Poduszka",    sv:"Kudde"     },
      { en:"CARPET",   es:"Alfombra",    fr:"Tapis",         ar:"سجادة",    pt:"Tapete",    de:"Teppich",    it:"Tappeto",     zh:"地毯",  ja:"カーペット",ko:"카펫",    ru:"Ковёр",     hi:"कालीन",     tr:"Halı",           nl:"Tapijt",      pl:"Dywan",       sv:"Matta"     },
      { en:"SHELF",    es:"Estante",     fr:"Étagère",       ar:"رف",       pt:"Prateleira",de:"Regal",      it:"Scaffale",    zh:"架子",  ja:"たな",      ko:"선반",    ru:"Полка",     hi:"अलमारी",   tr:"Raf",            nl:"Plank",       pl:"Półka",       sv:"Hylla"     },
      { en:"STAIRS",   es:"Escalera",    fr:"Escalier",      ar:"درج",      pt:"Escada",    de:"Treppe",     it:"Scale",       zh:"楼梯",  ja:"かいだん",  ko:"계단",    ru:"Лестница",  hi:"सीढ़ी",    tr:"Merdiven",       nl:"Trap",        pl:"Schody",      sv:"Trappa"    },
    ],
  },

  // ────────────────── NATURE ────────────────────────────────────────────────
  {
    name: "Nature", emoji:"1f33f", icon: Leaf,
    words: [
      { en:"SUN",      es:"Sol",         fr:"Soleil",        ar:"شمس",      pt:"Sol",       de:"Sonne",      it:"Sole",        zh:"太阳",  ja:"たいよう",  ko:"태양",    ru:"Солнце",    hi:"सूरज",      tr:"Güneş",          nl:"Zon",         pl:"Słońce",      sv:"Sol"       },
      { en:"MOON",     es:"Luna",        fr:"Lune",          ar:"قمر",      pt:"Lua",       de:"Mond",       it:"Luna",        zh:"月亮",  ja:"つき",      ko:"달",      ru:"Луна",      hi:"चाँद",      tr:"Ay",             nl:"Maan",        pl:"Księżyc",     sv:"Måne"      },
      { en:"RAIN",     es:"Lluvia",      fr:"Pluie",         ar:"مطر",      pt:"Chuva",     de:"Regen",      it:"Pioggia",     zh:"雨",    ja:"あめ",      ko:"비",      ru:"Дождь",     hi:"बारिश",     tr:"Yağmur",         nl:"Regen",       pl:"Deszcz",      sv:"Regn"      },
      { en:"TREE",     es:"Árbol",       fr:"Arbre",         ar:"شجرة",     pt:"Árvore",    de:"Baum",       it:"Albero",      zh:"树",    ja:"き",        ko:"나무",    ru:"Дерево",    hi:"पेड़",      tr:"Ağaç",           nl:"Boom",        pl:"Drzewo",      sv:"Träd"      },
      { en:"LEAF",     es:"Hoja",        fr:"Feuille",       ar:"ورقة",     pt:"Folha",     de:"Blatt",      it:"Foglia",      zh:"叶子",  ja:"は",        ko:"잎",      ru:"Лист",      hi:"पत्ता",     tr:"Yaprak",         nl:"Blad",        pl:"Liść",        sv:"Blad"      },
      { en:"ROCK",     es:"Roca",        fr:"Rocher",        ar:"صخرة",     pt:"Pedra",     de:"Fels",       it:"Roccia",      zh:"岩石",  ja:"いわ",      ko:"바위",    ru:"Скала",     hi:"चट्टान",    tr:"Kaya",           nl:"Rots",        pl:"Skała",       sv:"Klippa"    },
      { en:"WAVE",     es:"Ola",         fr:"Vague",         ar:"موجة",     pt:"Onda",      de:"Welle",      it:"Onda",        zh:"海浪",  ja:"なみ",      ko:"파도",    ru:"Волна",     hi:"लहर",       tr:"Dalga",          nl:"Golf",        pl:"Fala",        sv:"Våg"       },
      { en:"SNOW",     es:"Nieve",       fr:"Neige",         ar:"ثلج",      pt:"Neve",      de:"Schnee",     it:"Neve",        zh:"雪",    ja:"ゆき",      ko:"눈",      ru:"Снег",      hi:"बर्फ",      tr:"Kar",            nl:"Sneeuw",      pl:"Śnieg",       sv:"Snö"       },
      { en:"STAR",     es:"Estrella",    fr:"Étoile",        ar:"نجمة",     pt:"Estrela",   de:"Stern",      it:"Stella",      zh:"星星",  ja:"ほし",      ko:"별",      ru:"Звезда",    hi:"तारा",      tr:"Yıldız",         nl:"Ster",        pl:"Gwiazda",     sv:"Stjärna"   },
      { en:"WIND",     es:"Viento",      fr:"Vent",          ar:"ريح",      pt:"Vento",     de:"Wind",       it:"Vento",       zh:"风",    ja:"かぜ",      ko:"바람",    ru:"Ветер",     hi:"हवा",       tr:"Rüzgar",         nl:"Wind",        pl:"Wiatr",       sv:"Vind"      },
      { en:"LAKE",     es:"Lago",        fr:"Lac",           ar:"بحيرة",    pt:"Lago",      de:"See",        it:"Lago",        zh:"湖",    ja:"みずうみ",  ko:"호수",    ru:"Озеро",     hi:"झील",       tr:"Göl",            nl:"Meer",        pl:"Jezioro",     sv:"Sjö"       },
      { en:"RIVER",    es:"Río",         fr:"Rivière",       ar:"نهر",      pt:"Rio",       de:"Fluss",      it:"Fiume",       zh:"河流",  ja:"かわ",      ko:"강",      ru:"Река",      hi:"नदी",       tr:"Nehir",          nl:"Rivier",      pl:"Rzeka",       sv:"Flod"      },
      { en:"CLOUD",    es:"Nube",        fr:"Nuage",         ar:"سحابة",    pt:"Nuvem",     de:"Wolke",      it:"Nuvola",      zh:"云",    ja:"くも",      ko:"구름",    ru:"Облако",    hi:"बादल",      tr:"Bulut",          nl:"Wolk",        pl:"Chmura",      sv:"Moln"      },
      { en:"FLOWER",   es:"Flor",        fr:"Fleur",         ar:"زهرة",     pt:"Flor",      de:"Blume",      it:"Fiore",       zh:"花",    ja:"はな",      ko:"꽃",      ru:"Цветок",    hi:"फूल",       tr:"Çiçek",          nl:"Bloem",       pl:"Kwiat",       sv:"Blomma"    },
      { en:"FOREST",   es:"Bosque",      fr:"Forêt",         ar:"غابة",     pt:"Floresta",  de:"Wald",       it:"Foresta",     zh:"森林",  ja:"もり",      ko:"숲",      ru:"Лес",       hi:"जंगल",      tr:"Orman",          nl:"Bos",         pl:"Las",         sv:"Skog"      },
      { en:"DESERT",   es:"Desierto",    fr:"Désert",        ar:"صحراء",    pt:"Deserto",   de:"Wüste",      it:"Deserto",     zh:"沙漠",  ja:"さばく",    ko:"사막",    ru:"Пустыня",   hi:"रेगिस्तान", tr:"Çöl",            nl:"Woestijn",    pl:"Pustynia",    sv:"Öken"      },
      { en:"MOUNTAIN", es:"Montaña",     fr:"Montagne",      ar:"جبل",      pt:"Montanha",  de:"Berg",       it:"Montagna",    zh:"山",    ja:"やま",      ko:"산",      ru:"Гора",      hi:"पहाड़",     tr:"Dağ",            nl:"Berg",        pl:"Góra",        sv:"Berg"      },
      { en:"VOLCANO",  es:"Volcán",      fr:"Volcan",        ar:"بركان",    pt:"Vulcão",    de:"Vulkan",     it:"Vulcano",     zh:"火山",  ja:"かざん",    ko:"화산",    ru:"Вулкан",    hi:"ज्वालामुखी",tr:"Yanardağ",       nl:"Vulkaan",     pl:"Wulkan",      sv:"Vulkan"    },
      { en:"RAINBOW",  es:"Arcoíris",    fr:"Arc-en-ciel",   ar:"قوس قزح",  pt:"Arco-íris", de:"Regenbogen", it:"Arcobaleno",  zh:"彩虹",  ja:"にじ",      ko:"무지개",  ru:"Радуга",    hi:"इंद्रधनुष", tr:"Gökkuşağı",      nl:"Regenboog",   pl:"Tęcza",       sv:"Regnbåge"  },
      { en:"BEACH",    es:"Playa",       fr:"Plage",         ar:"شاطئ",     pt:"Praia",     de:"Strand",     it:"Spiaggia",    zh:"海滩",  ja:"ビーチ",    ko:"해변",    ru:"Пляж",      hi:"समुद्र तट", tr:"Plaj",           nl:"Strand",      pl:"Plaża",       sv:"Strand"    },
    ],
  },
];

// ─── Selector de idioma ────────────────────────────────────────────────────
const LANG_LABELS = {
  es: "Español 🇪🇸",
  fr: "Français 🇫🇷",
  ar: "العربية 🇸🇦",
  pt: "Português 🇧🇷",
  de: "Deutsch 🇩🇪",
  it: "Italiano 🇮🇹",
  zh: "中文 🇨🇳",
  ja: "日本語 🇯🇵",
  ko: "한국어 🇰🇷",
  ru: "Русский 🇷🇺",
  hi: "हिंदी 🇮🇳",
  tr: "Türkçe 🇹🇷",
  nl: "Nederlands 🇳🇱",
  pl: "Polski 🇵🇱",
  sv: "Svenska 🇸🇪",
};

// Idiomas con dirección RTL
const RTL_LANGS = new Set(["ar"]);const GRID_SIZE = 10;

// ─── Traducciones de interfaz ──────────────────────────────────────────────
// Uso: getTranslation("newPuzzle", lang)
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

// ─── Grid builder ──────────────────────────────────────────────────────────
function buildGrid(words) {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const grid = Array.from({ length: GRID_SIZE }, () =>
    Array(GRID_SIZE).fill("")
  );
  const placed = []; // { word, cells: [{r,c}] }

  const DIRS = [
    [0, 1], [1, 0], [1, 1], [0, -1], [-1, 0], [-1, -1], [1, -1], [-1, 1],
  ];

  for (const wordObj of words) {
    const word = wordObj.en;
    let success = false;
    let tries = 0;

    while (!success && tries < 200) {
      tries++;
      const [dr, dc] = DIRS[Math.floor(Math.random() * DIRS.length)];
      const r = Math.floor(Math.random() * GRID_SIZE);
      const c = Math.floor(Math.random() * GRID_SIZE);
      const cells = [];
      let valid = true;

      for (let i = 0; i < word.length; i++) {
        const nr = r + dr * i;
        const nc = c + dc * i;
        if (nr < 0 || nr >= GRID_SIZE || nc < 0 || nc >= GRID_SIZE) { valid = false; break; }
        if (grid[nr][nc] !== "" && grid[nr][nc] !== word[i]) { valid = false; break; }
        cells.push({ r: nr, c: nc });
      }

      if (valid) {
        cells.forEach(({ r, c }, i) => { grid[r][c] = word[i]; });
        placed.push({ word: wordObj, cells });
        success = true;
      }
    }
  }

  // Fill remaining with random letters
  for (let r = 0; r < GRID_SIZE; r++)
    for (let c = 0; c < GRID_SIZE; c++)
      if (!grid[r][c]) grid[r][c] = letters[Math.floor(Math.random() * letters.length)];

  return { grid, placed };
}

// ─── Confetti burst ────────────────────────────────────────────────────────
function Confetti({ active }) {
  const pieces = Array.from({ length: 20 }, (_, i) => ({
    id: i, x: Math.random() * 100,
    color: [C.blue,C.red,C.yellow,C.green,C.magenta,C.cyan][i%6],
    delay: Math.random()*0.4, size: Math.random()*10+7,
  }));
  if (!active) return null;
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map((p) => (
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

// ─── Main WordSearch component ─────────────────────────────────────────────
export default function WordSearch() {
  const [packIdx,   setPackIdx]   = useState(0);
  const [lang,      setLang]      = useState("es");
  const [gameData,  setGameData]  = useState(null);
  const [selecting, setSelecting] = useState(false);
  const [selection, setSelection] = useState([]);
  const [found,     setFound]     = useState([]);
  const [confetti,  setConfetti]  = useState(false);
  const [won,       setWon]       = useState(false);

  // ── pack y startGame — declarados UNA sola vez ────────────────────────
  const pack = PACKS[packIdx];

  const startGame = useCallback((pIdx = packIdx) => {
    const data = buildGrid(PACKS[pIdx].words);
    setGameData(data);
    setFound([]);
    setSelection([]);
    setSelecting(false);
    setWon(false);
  }, [packIdx]);

  useEffect(() => { startGame(packIdx); }, [packIdx]);

  const handleReset = () => { startGame(); };

  // ── Lógica de selección ───────────────────────────────────────────────
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

  // ── UI ─────────────────────────────────────────────────────────────────
  return (
    <div className="relative min-h-screen overflow-hidden">
      <WordSearchBg />
      <Confetti active={confetti} />

      <div className="relative z-10">
        {/* Header */}
        <div className="text-center py-10 px-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring" }}
            className="mb-4"
          >
            <h1 style={{ lineHeight: 1.2 }}>
              <BubbleTitle color="#E11D48" size={54}>Word Hunt</BubbleTitle>
            </h1>
          </motion.div>
          <p className="font-display text-slate-700 text-lg font-medium bg-white/40 backdrop-blur-sm inline-block px-4 py-1 rounded-full">
            Find all the hidden English words!
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap justify-center gap-3 px-4 mb-6">
          <div className="flex flex-wrap gap-2 justify-center">
            {PACKS.map((p, i) => {
              const PackIcon = p.icon;
              return (
                <button key={i} onClick={() => setPackIdx(i)}
                  className="px-4 py-2 rounded-full font-display text-sm border-2 transition-all"
                  style={{
                    background: packIdx === i ? C.blue : "white",
                    color:      packIdx === i ? "white" : "#6B7280",
                    borderColor:packIdx === i ? C.blue : "#E2E8F0",
                    display: "flex", alignItems: "center", gap: 6,
                  }}
                >
                  <PackIcon size={13} strokeWidth={2}/> {p.name}
                </button>
              );
            })}
          </div>

          <div className="flex gap-1 bg-white/80 rounded-full p-1 shadow-sm">
            {Object.entries(LANG_LABELS).map(([code, label]) => (
              <button key={code} onClick={() => setLang(code)}
                className="px-3 py-1.5 rounded-full font-display text-xs transition-all"
                style={{
                  background: lang === code ? C.green : "transparent",
                  color:      lang === code ? "white" : "#6B7280",
                }}
              >{label}</button>
            ))}
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 pb-20">
          {won && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center mb-6 py-4 rounded-3xl font-display text-2xl text-white shadow-xl"
              style={{
                background: `linear-gradient(135deg, ${C.green}, #2E7D32)`,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
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
                style={{ gridTemplateColumns: `repeat(${GRID_SIZE},1fr)`, background: C.blueSoft }}
                onMouseLeave={handleCellEnd}
                onTouchEnd={handleCellEnd}
              >
                {gameData && gameData.grid.map((row, r) =>
                  row.map((letter, c) => (
                    <motion.div
                      key={`${r}-${c}`}
                      className="aspect-square flex items-center justify-center rounded-lg font-display text-sm cursor-pointer transition-all"
                      style={{ background: "white", color: C.blue, fontSize: "clamp(11px,2vw,16px)", ...getCellStyle(r, c) }}
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
                  whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                  onClick={handleReset}
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl font-display text-white shadow-md"
                  style={{ background: C.red }}
                >
                  <RotateCcw size={16}/> {getTranslation("newPuzzle", lang)}
                </motion.button>
              </div>
            </div>

            {/* Word list */}
            <div>
              <h3 className="font-display text-xl mb-4" style={{ color: C.blue }}>
                {getTranslation("findWords", lang)} ({found.length}/{pack.words.length})
              </h3>
              <div className="space-y-2">
                {gameData && gameData.placed.map(({ word }, wi) => {
                  const isFound = found.includes(wi);
                  const col = WORD_COLORS[wi % WORD_COLORS.length];
                  return (
                    <motion.div
                      key={wi}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: wi * 0.06 }}
                      className="flex items-center gap-4 p-4 rounded-2xl border-2 transition-all"
                      style={{
                        background:  isFound ? col.bg : "white",
                        borderColor: isFound ? col.border : "#E2E8F0",
                      }}
                    >
                      {isFound
                        ? <CheckCircle size={18} style={{ color: col.text }}/>
                        : <div className="w-4.5 h-4.5 rounded-full border-2 border-slate-300"/>
                      }
                      <div className="flex-1">
                        <div className="font-display text-lg" style={{ color: isFound ? col.text : C.blue }}>
                          {isFound ? word.en : "?".repeat(word.en.length)}
                        </div>
                        <div className="font-body text-sm text-slate-500" dir={lang === "ar" ? "rtl" : "ltr"}>
                          {word[lang]}
                        </div>
                      </div>
                      {isFound && <Star size={16} style={{ color: col.text }}/>}
                    </motion.div>
                  );
                })}
              </div>

              {/* Instructions */}
              <div className="mt-6 rounded-3xl p-4 border-2 border-white shadow-sm" style={{ background: C.yellowSoft }}>
                <p className="font-display text-sm mb-1" style={{ color: C.yellow }}>
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