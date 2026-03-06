/**
 * src/pages/WordSearch.jsx — Kiddsy
 * ─────────────────────────────────────────────────────────────────────────
 * • 25 themed word packs — 10 words played per round (random selection)
 * • MOBILE FIX: touch-action:none + preventDefault on touch events
 *   maps touch coordinates to grid cells via elementFromPoint
 * • Bilingual word list (EN + ES/FR/AR)
 */
import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, CheckCircle, Star } from "lucide-react";

const C = {
  blue:"#1565C0", blueSoft:"#E3F2FD",
  red:"#E53935", yellow:"#F9A825", yellowSoft:"#FFFDE7",
  green:"#43A047", greenSoft:"#E8F5E9",
  magenta:"#D81B60", cyan:"#00ACC1",
};

const WORD_COLORS = [
  { bg:"#FFF9C4", border:"#F9A825", text:"#E65100" },
  { bg:"#C8E6C9", border:"#43A047", text:"#1B5E20" },
  { bg:"#BBDEFB", border:"#1565C0", text:"#0D47A1" },
  { bg:"#F8BBD0", border:"#D81B60", text:"#880E4F" },
  { bg:"#B2EBF2", border:"#00ACC1", text:"#006064" },
  { bg:"#E1BEE7", border:"#8E24AA", text:"#4A148C" },
  { bg:"#FFCCBC", border:"#E64A19", text:"#BF360C" },
  { bg:"#F0F4C3", border:"#9E9D24", text:"#33691E" },
  { bg:"#D7CCC8", border:"#6D4C41", text:"#3E2723" },
  { bg:"#CFD8DC", border:"#607D8B", text:"#263238" },
];

// ─── 25 Word Packs (10 words each, shorter words fit better in grid) ───────
const ALL_PACKS = [
  {
    name:"Animals 🐾", emoji:"🦁",
    words:[
      {en:"CAT",es:"Gato",fr:"Chat",ar:"قطة"},
      {en:"DOG",es:"Perro",fr:"Chien",ar:"كلب"},
      {en:"FISH",es:"Pez",fr:"Poisson",ar:"سمكة"},
      {en:"BIRD",es:"Pájaro",fr:"Oiseau",ar:"طائر"},
      {en:"LION",es:"León",fr:"Lion",ar:"أسد"},
      {en:"BEAR",es:"Oso",fr:"Ours",ar:"دب"},
      {en:"FROG",es:"Rana",fr:"Grenouille",ar:"ضفدع"},
      {en:"WOLF",es:"Lobo",fr:"Loup",ar:"ذئب"},
      {en:"OWL",es:"Búho",fr:"Hibou",ar:"بومة"},
      {en:"FOX",es:"Zorro",fr:"Renard",ar:"ثعلب"},
    ],
  },
  {
    name:"Family 👨‍👩‍👧", emoji:"👪",
    words:[
      {en:"MOM",es:"Mamá",fr:"Maman",ar:"أم"},
      {en:"DAD",es:"Papá",fr:"Papa",ar:"أب"},
      {en:"BABY",es:"Bebé",fr:"Bébé",ar:"رضيع"},
      {en:"LOVE",es:"Amor",fr:"Amour",ar:"حب"},
      {en:"HOME",es:"Hogar",fr:"Maison",ar:"منزل"},
      {en:"PLAY",es:"Jugar",fr:"Jouer",ar:"لعب"},
      {en:"KISS",es:"Beso",fr:"Bisou",ar:"قبلة"},
      {en:"HUG",es:"Abrazo",fr:"Câlin",ar:"عناق"},
      {en:"AUNT",es:"Tía",fr:"Tante",ar:"عمة"},
      {en:"TWIN",es:"Gemelo",fr:"Jumeau",ar:"توأم"},
    ],
  },
  {
    name:"School 🏫", emoji:"📚",
    words:[
      {en:"BOOK",es:"Libro",fr:"Livre",ar:"كتاب"},
      {en:"PEN",es:"Pluma",fr:"Stylo",ar:"قلم"},
      {en:"DESK",es:"Escritorio",fr:"Bureau",ar:"مكتب"},
      {en:"READ",es:"Leer",fr:"Lire",ar:"قراءة"},
      {en:"MATH",es:"Mates",fr:"Maths",ar:"رياضيات"},
      {en:"MAP",es:"Mapa",fr:"Carte",ar:"خريطة"},
      {en:"TEST",es:"Prueba",fr:"Test",ar:"اختبار"},
      {en:"RULE",es:"Regla",fr:"Règle",ar:"مسطرة"},
      {en:"GLUE",es:"Pegamento",fr:"Colle",ar:"غراء"},
      {en:"DRAW",es:"Dibujar",fr:"Dessiner",ar:"رسم"},
    ],
  },
  {
    name:"Food 🍎", emoji:"🥦",
    words:[
      {en:"APPLE",es:"Manzana",fr:"Pomme",ar:"تفاحة"},
      {en:"BREAD",es:"Pan",fr:"Pain",ar:"خبز"},
      {en:"MILK",es:"Leche",fr:"Lait",ar:"حليب"},
      {en:"RICE",es:"Arroz",fr:"Riz",ar:"أرز"},
      {en:"EGG",es:"Huevo",fr:"Œuf",ar:"بيضة"},
      {en:"SOUP",es:"Sopa",fr:"Soupe",ar:"شوربة"},
      {en:"CAKE",es:"Pastel",fr:"Gâteau",ar:"كعكة"},
      {en:"TACO",es:"Taco",fr:"Taco",ar:"تاكو"},
      {en:"FISH",es:"Pescado",fr:"Poisson",ar:"سمك"},
      {en:"CORN",es:"Maíz",fr:"Maïs",ar:"ذرة"},
    ],
  },
  {
    name:"Space 🚀", emoji:"🌟",
    words:[
      {en:"STAR",es:"Estrella",fr:"Étoile",ar:"نجمة"},
      {en:"MOON",es:"Luna",fr:"Lune",ar:"قمر"},
      {en:"SUN",es:"Sol",fr:"Soleil",ar:"شمس"},
      {en:"MARS",es:"Marte",fr:"Mars",ar:"المريخ"},
      {en:"COMET",es:"Cometa",fr:"Comète",ar:"مذنب"},
      {en:"ORBIT",es:"Órbita",fr:"Orbite",ar:"مدار"},
      {en:"ALIEN",es:"Alienígena",fr:"Extraterrestre",ar:"كائن فضائي"},
      {en:"PROBE",es:"Sonda",fr:"Sonde",ar:"مسبار"},
      {en:"NOVA",es:"Nova",fr:"Nova",ar:"نوفا"},
      {en:"RING",es:"Anillo",fr:"Anneau",ar:"حلقة"},
    ],
  },
  {
    name:"Colors 🎨", emoji:"🌈",
    words:[
      {en:"RED",es:"Rojo",fr:"Rouge",ar:"أحمر"},
      {en:"BLUE",es:"Azul",fr:"Bleu",ar:"أزرق"},
      {en:"GREEN",es:"Verde",fr:"Vert",ar:"أخضر"},
      {en:"PINK",es:"Rosa",fr:"Rose",ar:"وردي"},
      {en:"GOLD",es:"Dorado",fr:"Or",ar:"ذهبي"},
      {en:"GREY",es:"Gris",fr:"Gris",ar:"رمادي"},
      {en:"CYAN",es:"Cian",fr:"Cyan",ar:"سماوي"},
      {en:"TAN",es:"Canela",fr:"Beige",ar:"بيج"},
      {en:"LIME",es:"Lima",fr:"Lime",ar:"ليمي"},
      {en:"NAVY",es:"Marino",fr:"Marine",ar:"كحلي"},
    ],
  },
  {
    name:"Body 🫀", emoji:"💪",
    words:[
      {en:"EYE",es:"Ojo",fr:"Œil",ar:"عين"},
      {en:"EAR",es:"Oreja",fr:"Oreille",ar:"أذن"},
      {en:"NOSE",es:"Nariz",fr:"Nez",ar:"أنف"},
      {en:"HAND",es:"Mano",fr:"Main",ar:"يد"},
      {en:"FOOT",es:"Pie",fr:"Pied",ar:"قدم"},
      {en:"KNEE",es:"Rodilla",fr:"Genou",ar:"ركبة"},
      {en:"BACK",es:"Espalda",fr:"Dos",ar:"ظهر"},
      {en:"HEAD",es:"Cabeza",fr:"Tête",ar:"رأس"},
      {en:"CHIN",es:"Barbilla",fr:"Menton",ar:"ذقن"},
      {en:"NECK",es:"Cuello",fr:"Cou",ar:"عنق"},
    ],
  },
  {
    name:"Weather 🌦️", emoji:"☀️",
    words:[
      {en:"RAIN",es:"Lluvia",fr:"Pluie",ar:"مطر"},
      {en:"SNOW",es:"Nieve",fr:"Neige",ar:"ثلج"},
      {en:"WIND",es:"Viento",fr:"Vent",ar:"ريح"},
      {en:"HAIL",es:"Granizo",fr:"Grêle",ar:"برد"},
      {en:"MIST",es:"Niebla",fr:"Brume",ar:"ضباب"},
      {en:"WARM",es:"Cálido",fr:"Chaud",ar:"دافئ"},
      {en:"COLD",es:"Frío",fr:"Froid",ar:"بارد"},
      {en:"STORM",es:"Tormenta",fr:"Tempête",ar:"عاصفة"},
      {en:"CLOUD",es:"Nube",fr:"Nuage",ar:"سحابة"},
      {en:"SUN",es:"Sol",fr:"Soleil",ar:"شمس"},
    ],
  },
  {
    name:"Clothes 👕", emoji:"👗",
    words:[
      {en:"HAT",es:"Sombrero",fr:"Chapeau",ar:"قبعة"},
      {en:"SHOE",es:"Zapato",fr:"Chaussure",ar:"حذاء"},
      {en:"COAT",es:"Abrigo",fr:"Manteau",ar:"معطف"},
      {en:"SOCK",es:"Calcetín",fr:"Chaussette",ar:"جورب"},
      {en:"VEST",es:"Chaleco",fr:"Gilet",ar:"صديري"},
      {en:"BELT",es:"Cinturón",fr:"Ceinture",ar:"حزام"},
      {en:"SKIRT",es:"Falda",fr:"Jupe",ar:"تنورة"},
      {en:"TIE",es:"Corbata",fr:"Cravate",ar:"ربطة عنق"},
      {en:"SCARF",es:"Bufanda",fr:"Écharpe",ar:"وشاح"},
      {en:"CAP",es:"Gorra",fr:"Casquette",ar:"كاب"},
    ],
  },
  {
    name:"Transport 🚌", emoji:"✈️",
    words:[
      {en:"CAR",es:"Coche",fr:"Voiture",ar:"سيارة"},
      {en:"BUS",es:"Autobús",fr:"Bus",ar:"حافلة"},
      {en:"BIKE",es:"Bici",fr:"Vélo",ar:"دراجة"},
      {en:"BOAT",es:"Barco",fr:"Bateau",ar:"قارب"},
      {en:"PLANE",es:"Avión",fr:"Avion",ar:"طائرة"},
      {en:"TRAIN",es:"Tren",fr:"Train",ar:"قطار"},
      {en:"TAXI",es:"Taxi",fr:"Taxi",ar:"تاكسي"},
      {en:"VAN",es:"Furgoneta",fr:"Camionnette",ar:"شاحنة صغيرة"},
      {en:"TRAM",es:"Tranvía",fr:"Tram",ar:"ترام"},
      {en:"SHIP",es:"Nave",fr:"Navire",ar:"سفينة"},
    ],
  },
  {
    name:"Numbers 🔢", emoji:"🧮",
    words:[
      {en:"ONE",es:"Uno",fr:"Un",ar:"واحد"},
      {en:"TWO",es:"Dos",fr:"Deux",ar:"اثنان"},
      {en:"THREE",es:"Tres",fr:"Trois",ar:"ثلاثة"},
      {en:"FOUR",es:"Cuatro",fr:"Quatre",ar:"أربعة"},
      {en:"FIVE",es:"Cinco",fr:"Cinq",ar:"خمسة"},
      {en:"SIX",es:"Seis",fr:"Six",ar:"ستة"},
      {en:"NINE",es:"Nueve",fr:"Neuf",ar:"تسعة"},
      {en:"TEN",es:"Diez",fr:"Dix",ar:"عشرة"},
      {en:"ZERO",es:"Cero",fr:"Zéro",ar:"صفر"},
      {en:"HALF",es:"Mitad",fr:"Moitié",ar:"نصف"},
    ],
  },
  {
    name:"Fruits 🍇", emoji:"🍓",
    words:[
      {en:"MANGO",es:"Mango",fr:"Mangue",ar:"مانجو"},
      {en:"PLUM",es:"Ciruela",fr:"Prune",ar:"برقوق"},
      {en:"FIG",es:"Higo",fr:"Figue",ar:"تين"},
      {en:"LIME",es:"Lima",fr:"Citron vert",ar:"ليمون أخضر"},
      {en:"PEAR",es:"Pera",fr:"Poire",ar:"كمثرى"},
      {en:"KIWI",es:"Kiwi",fr:"Kiwi",ar:"كيوي"},
      {en:"DATE",es:"Dátil",fr:"Datte",ar:"تمر"},
      {en:"MELON",es:"Melón",fr:"Melon",ar:"شمام"},
      {en:"GRAPE",es:"Uva",fr:"Raisin",ar:"عنب"},
      {en:"BERRY",es:"Baya",fr:"Baie",ar:"توت"},
    ],
  },
  {
    name:"Sports ⚽", emoji:"🏆",
    words:[
      {en:"SWIM",es:"Nadar",fr:"Nager",ar:"سباحة"},
      {en:"JUMP",es:"Saltar",fr:"Sauter",ar:"قفز"},
      {en:"RUN",es:"Correr",fr:"Courir",ar:"ركض"},
      {en:"KICK",es:"Patear",fr:"Frapper",ar:"ركلة"},
      {en:"GOAL",es:"Gol",fr:"But",ar:"هدف"},
      {en:"TEAM",es:"Equipo",fr:"Équipe",ar:"فريق"},
      {en:"WIN",es:"Ganar",fr:"Gagner",ar:"فوز"},
      {en:"RACE",es:"Carrera",fr:"Course",ar:"سباق"},
      {en:"GOLF",es:"Golf",fr:"Golf",ar:"جولف"},
      {en:"SURF",es:"Surf",fr:"Surf",ar:"ركوب الأمواج"},
    ],
  },
  {
    name:"Home 🏠", emoji:"🛋️",
    words:[
      {en:"BED",es:"Cama",fr:"Lit",ar:"سرير"},
      {en:"SOFA",es:"Sofá",fr:"Canapé",ar:"أريكة"},
      {en:"DOOR",es:"Puerta",fr:"Porte",ar:"باب"},
      {en:"LAMP",es:"Lámpara",fr:"Lampe",ar:"مصباح"},
      {en:"ROOF",es:"Tejado",fr:"Toit",ar:"سقف"},
      {en:"WALL",es:"Pared",fr:"Mur",ar:"جدار"},
      {en:"SINK",es:"Lavabo",fr:"Évier",ar:"حوض"},
      {en:"STAIR",es:"Escalera",fr:"Escalier",ar:"سلم"},
      {en:"OVEN",es:"Horno",fr:"Four",ar:"فرن"},
      {en:"GATE",es:"Puerta",fr:"Portail",ar:"بوابة"},
    ],
  },
  {
    name:"Nature 🌿", emoji:"🌳",
    words:[
      {en:"TREE",es:"Árbol",fr:"Arbre",ar:"شجرة"},
      {en:"LEAF",es:"Hoja",fr:"Feuille",ar:"ورقة"},
      {en:"ROCK",es:"Roca",fr:"Rocher",ar:"صخرة"},
      {en:"LAKE",es:"Lago",fr:"Lac",ar:"بحيرة"},
      {en:"HILL",es:"Colina",fr:"Colline",ar:"تل"},
      {en:"CAVE",es:"Cueva",fr:"Grotte",ar:"كهف"},
      {en:"FERN",es:"Helecho",fr:"Fougère",ar:"سرخس"},
      {en:"MOSS",es:"Musgo",fr:"Mousse",ar:"طحلب"},
      {en:"SAND",es:"Arena",fr:"Sable",ar:"رمل"},
      {en:"SOIL",es:"Tierra",fr:"Sol",ar:"تربة"},
    ],
  },
  {
    name:"Emotions 😊", emoji:"💛",
    words:[
      {en:"HAPPY",es:"Feliz",fr:"Heureux",ar:"سعيد"},
      {en:"SAD",es:"Triste",fr:"Triste",ar:"حزين"},
      {en:"CALM",es:"Calmado",fr:"Calme",ar:"هادئ"},
      {en:"LOVE",es:"Amor",fr:"Amour",ar:"حب"},
      {en:"FEAR",es:"Miedo",fr:"Peur",ar:"خوف"},
      {en:"JOY",es:"Alegría",fr:"Joie",ar:"فرح"},
      {en:"HOPE",es:"Esperanza",fr:"Espoir",ar:"أمل"},
      {en:"PROUD",es:"Orgulloso",fr:"Fier",ar:"فخور"},
      {en:"KIND",es:"Amable",fr:"Gentil",ar:"لطيف"},
      {en:"BRAVE",es:"Valiente",fr:"Courageux",ar:"شجاع"},
    ],
  },
  {
    name:"Tools 🔧", emoji:"🛠️",
    words:[
      {en:"SAW",es:"Sierra",fr:"Scie",ar:"منشار"},
      {en:"NAIL",es:"Clavo",fr:"Clou",ar:"مسمار"},
      {en:"BOLT",es:"Perno",fr:"Boulon",ar:"برغي"},
      {en:"WIRE",es:"Cable",fr:"Fil",ar:"سلك"},
      {en:"DRILL",es:"Taladro",fr:"Perceuse",ar:"مثقاب"},
      {en:"PUMP",es:"Bomba",fr:"Pompe",ar:"مضخة"},
      {en:"PIPE",es:"Tubería",fr:"Tuyau",ar:"أنبوب"},
      {en:"LOCK",es:"Cerradura",fr:"Serrure",ar:"قفل"},
      {en:"GLUE",es:"Pegamento",fr:"Colle",ar:"غراء"},
      {en:"HOOK",es:"Gancho",fr:"Crochet",ar:"خطاف"},
    ],
  },
  {
    name:"Hygiene 🪥", emoji:"🧼",
    words:[
      {en:"SOAP",es:"Jabón",fr:"Savon",ar:"صابون"},
      {en:"COMB",es:"Peine",fr:"Peigne",ar:"مشط"},
      {en:"BATH",es:"Baño",fr:"Bain",ar:"حمام"},
      {en:"FOAM",es:"Espuma",fr:"Mousse",ar:"رغوة"},
      {en:"WIPE",es:"Toallita",fr:"Lingette",ar:"منديل"},
      {en:"BRUSH",es:"Cepillo",fr:"Brosse",ar:"فرشاة"},
      {en:"RINSE",es:"Aclarar",fr:"Rincer",ar:"شطف"},
      {en:"TOWEL",es:"Toalla",fr:"Serviette",ar:"منشفة"},
      {en:"PASTE",es:"Pasta",fr:"Dentifrice",ar:"معجون"},
      {en:"TRIM",es:"Recortar",fr:"Couper",ar:"تقليم"},
    ],
  },
  {
    name:"Music 🎵", emoji:"🎸",
    words:[
      {en:"SONG",es:"Canción",fr:"Chanson",ar:"أغنية"},
      {en:"DRUM",es:"Tambor",fr:"Tambour",ar:"طبل"},
      {en:"FLUTE",es:"Flauta",fr:"Flûte",ar:"ناي"},
      {en:"HARP",es:"Arpa",fr:"Harpe",ar:"قيثارة"},
      {en:"BEAT",es:"Ritmo",fr:"Rythme",ar:"إيقاع"},
      {en:"NOTE",es:"Nota",fr:"Note",ar:"نوتة"},
      {en:"TUNE",es:"Melodía",fr:"Mélodie",ar:"لحن"},
      {en:"BAND",es:"Banda",fr:"Groupe",ar:"فرقة"},
      {en:"JAZZ",es:"Jazz",fr:"Jazz",ar:"جاز"},
      {en:"CLAP",es:"Aplauso",fr:"Applaudir",ar:"تصفيق"},
    ],
  },
  {
    name:"Ocean 🌊", emoji:"🐠",
    words:[
      {en:"WAVE",es:"Ola",fr:"Vague",ar:"موجة"},
      {en:"REEF",es:"Arrecife",fr:"Récif",ar:"شعاب"},
      {en:"CRAB",es:"Cangrejo",fr:"Crabe",ar:"سرطان البحر"},
      {en:"SEAL",es:"Foca",fr:"Phoque",ar:"فقمة"},
      {en:"KELP",es:"Alga",fr:"Algue",ar:"عشب بحري"},
      {en:"TIDE",es:"Marea",fr:"Marée",ar:"مد وجزر"},
      {en:"SAND",es:"Arena",fr:"Sable",ar:"رمل"},
      {en:"ORCA",es:"Orca",fr:"Orque",ar:"حوت قاتل"},
      {en:"DEEP",es:"Profundo",fr:"Profond",ar:"عميق"},
      {en:"FOAM",es:"Espuma",fr:"Écume",ar:"رغوة"},
    ],
  },
  {
    name:"Garden 🌻", emoji:"🌷",
    words:[
      {en:"ROSE",es:"Rosa",fr:"Rose",ar:"وردة"},
      {en:"SEED",es:"Semilla",fr:"Graine",ar:"بذرة"},
      {en:"SOIL",es:"Tierra",fr:"Sol",ar:"تربة"},
      {en:"WORM",es:"Gusano",fr:"Ver",ar:"دودة"},
      {en:"WASP",es:"Avispa",fr:"Guêpe",ar:"دبور"},
      {en:"BEE",es:"Abeja",fr:"Abeille",ar:"نحلة"},
      {en:"BUD",es:"Brote",fr:"Bouton",ar:"برعم"},
      {en:"HERB",es:"Hierba",fr:"Herbe",ar:"عشبة"},
      {en:"RAKE",es:"Rastrillo",fr:"Râteau",ar:"مجرفة"},
      {en:"POND",es:"Estanque",fr:"Étang",ar:"بركة"},
    ],
  },
  {
    name:"Time ⏰", emoji:"📅",
    words:[
      {en:"DAWN",es:"Amanecer",fr:"Aube",ar:"فجر"},
      {en:"NOON",es:"Mediodía",fr:"Midi",ar:"ظهر"},
      {en:"DUSK",es:"Anochecer",fr:"Crépuscule",ar:"غسق"},
      {en:"WEEK",es:"Semana",fr:"Semaine",ar:"أسبوع"},
      {en:"YEAR",es:"Año",fr:"An",ar:"سنة"},
      {en:"HOUR",es:"Hora",fr:"Heure",ar:"ساعة"},
      {en:"LATE",es:"Tarde",fr:"Tard",ar:"متأخر"},
      {en:"SOON",es:"Pronto",fr:"Bientôt",ar:"قريباً"},
      {en:"PAST",es:"Pasado",fr:"Passé",ar:"ماضٍ"},
      {en:"NEXT",es:"Próximo",fr:"Prochain",ar:"التالي"},
    ],
  },
  {
    name:"Health 🏥", emoji:"💊",
    words:[
      {en:"PILL",es:"Pastilla",fr:"Pilule",ar:"حبة دواء"},
      {en:"COLD",es:"Resfriado",fr:"Rhume",ar:"زكام"},
      {en:"REST",es:"Descanso",fr:"Repos",ar:"راحة"},
      {en:"DIET",es:"Dieta",fr:"Régime",ar:"نظام غذائي"},
      {en:"PAIN",es:"Dolor",fr:"Douleur",ar:"ألم"},
      {en:"CURE",es:"Cura",fr:"Guérison",ar:"علاج"},
      {en:"GERM",es:"Germen",fr:"Germe",ar:"جرثومة"},
      {en:"SCAR",es:"Cicatriz",fr:"Cicatrice",ar:"ندبة"},
      {en:"XRAY",es:"Rayos X",fr:"Radio",ar:"أشعة سينية"},
      {en:"CAST",es:"Escayola",fr:"Plâtre",ar:"جبيرة"},
    ],
  },
  {
    name:"Dinosaurs 🦕", emoji:"🦖",
    words:[
      {en:"REX",es:"Rex",fr:"Rex",ar:"ريكس"},
      {en:"CLAW",es:"Garra",fr:"Griffe",ar:"مخلب"},
      {en:"BONE",es:"Hueso",fr:"Os",ar:"عظمة"},
      {en:"HORN",es:"Cuerno",fr:"Corne",ar:"قرن"},
      {en:"NEST",es:"Nido",fr:"Nid",ar:"عش"},
      {en:"EGG",es:"Huevo",fr:"Œuf",ar:"بيضة"},
      {en:"HUGE",es:"Enorme",fr:"Énorme",ar:"ضخم"},
      {en:"ROAR",es:"Rugido",fr:"Rugissement",ar:"زئير"},
      {en:"TAIL",es:"Cola",fr:"Queue",ar:"ذيل"},
      {en:"WING",es:"Ala",fr:"Aile",ar:"جناح"},
    ],
  },
  {
    name:"Celebrations 🎉", emoji:"🎊",
    words:[
      {en:"GIFT",es:"Regalo",fr:"Cadeau",ar:"هدية"},
      {en:"CAKE",es:"Tarta",fr:"Gâteau",ar:"كعكة"},
      {en:"WISH",es:"Deseo",fr:"Vœu",ar:"أمنية"},
      {en:"CARD",es:"Tarjeta",fr:"Carte",ar:"بطاقة"},
      {en:"SONG",es:"Canción",fr:"Chanson",ar:"أغنية"},
      {en:"CLAP",es:"Aplauso",fr:"Applaudir",ar:"تصفيق"},
      {en:"MASK",es:"Máscara",fr:"Masque",ar:"قناع"},
      {en:"FLAG",es:"Bandera",fr:"Drapeau",ar:"علم"},
      {en:"BELL",es:"Campana",fr:"Cloche",ar:"جرس"},
      {en:"DRUM",es:"Tambor",fr:"Tambour",ar:"طبل"},
    ],
  },
];

const LANG_LABELS = { es:"Español 🇪🇸", fr:"Français 🇫🇷", ar:"العربية 🇸🇦" };
const GRID_SIZE = 12;  // slightly larger grid for 10 words
const WORDS_PER_ROUND = 10;

// ─── Grid builder ──────────────────────────────────────────────────────────
function buildGrid(words) {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const grid = Array.from({length:GRID_SIZE},()=>Array(GRID_SIZE).fill(""));
  const placed = [];
  const DIRS = [[0,1],[1,0],[1,1],[0,-1],[-1,0],[-1,-1],[1,-1],[-1,1]];

  for (const wordObj of words) {
    const word = wordObj.en;
    let success=false, tries=0;
    while (!success && tries<300) {
      tries++;
      const [dr,dc]=DIRS[Math.floor(Math.random()*DIRS.length)];
      const r=Math.floor(Math.random()*GRID_SIZE);
      const c=Math.floor(Math.random()*GRID_SIZE);
      const cells=[]; let valid=true;
      for (let i=0;i<word.length;i++) {
        const nr=r+dr*i, nc=c+dc*i;
        if (nr<0||nr>=GRID_SIZE||nc<0||nc>=GRID_SIZE){valid=false;break;}
        if (grid[nr][nc]!==""&&grid[nr][nc]!==word[i]){valid=false;break;}
        cells.push({r:nr,c:nc});
      }
      if (valid) {
        cells.forEach(({r,c},i)=>{grid[r][c]=word[i];});
        placed.push({word:wordObj,cells});
        success=true;
      }
    }
  }
  for (let r=0;r<GRID_SIZE;r++)
    for (let c=0;c<GRID_SIZE;c++)
      if (!grid[r][c]) grid[r][c]=letters[Math.floor(Math.random()*letters.length)];
  return {grid,placed};
}

function Confetti({ active }) {
  const pieces=Array.from({length:20},(_,i)=>({
    id:i,x:Math.random()*100,
    color:[C.blue,C.red,C.yellow,C.green,C.magenta,C.cyan][i%6],
    delay:Math.random()*0.4,size:Math.random()*10+7,
  }));
  if (!active) return null;
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map(p=>(
        <motion.div key={p.id} className="absolute rounded-sm top-0"
          style={{left:`${p.x}%`,width:p.size,height:p.size,background:p.color}}
          initial={{y:-20,opacity:1,rotate:0}} animate={{y:"110vh",opacity:0,rotate:720}}
          transition={{duration:1.5+Math.random(),delay:p.delay,ease:"easeIn"}}
        />
      ))}
    </div>
  );
}

// ─── Main WordSearch ───────────────────────────────────────────────────────
export default function WordSearch() {
  const [packIdx,    setPackIdx]    = useState(0);
  const [lang,       setLang]       = useState("es");
  const [gameData,   setGameData]   = useState(null);
  const [selecting,  setSelecting]  = useState(false);
  const [selection,  setSelection]  = useState([]);
  const [found,      setFound]      = useState([]);
  const [confetti,   setConfetti]   = useState(false);
  const [won,        setWon]        = useState(false);
  const gridRef = useRef(null);

  const pack = ALL_PACKS[packIdx];

  const startGame = useCallback((pIdx=packIdx)=>{
    // Shuffle and pick WORDS_PER_ROUND words
    const shuffled=[...ALL_PACKS[pIdx].words].sort(()=>Math.random()-0.5);
    const chosen=shuffled.slice(0,WORDS_PER_ROUND);
    const data=buildGrid(chosen);
    setGameData(data); setFound([]); setSelection([]); setSelecting(false); setWon(false);
  },[packIdx]);

  useEffect(()=>{ startGame(packIdx); },[packIdx]);

  // Get grid cell r,c from a DOM element
  const getCellCoords = (el) => {
    if (!el) return null;
    const r = el.dataset.r, c = el.dataset.c;
    if (r===undefined||c===undefined) return null;
    return {r:parseInt(r),c:parseInt(c)};
  };

  // Get cell from touch position
  const getCellFromTouch = (touch) => {
    const el = document.elementFromPoint(touch.clientX, touch.clientY);
    return getCellCoords(el);
  };

  const startSelection = (r,c) => {
    setSelecting(true);
    setSelection([{r,c}]);
  };

  const extendSelection = (r,c) => {
    if (!selecting||!selection.length) return;
    const first=selection[0];
    const dr=Math.sign(r-first.r), dc=Math.sign(c-first.c);
    const len=Math.max(Math.abs(r-first.r),Math.abs(c-first.c))+1;
    if (dr!==0&&dc!==0&&Math.abs(r-first.r)!==Math.abs(c-first.c)) return;
    const newSel=[];
    for (let i=0;i<len;i++) newSel.push({r:first.r+dr*i,c:first.c+dc*i});
    setSelection(newSel);
  };

  const endSelection = () => {
    if (!selecting) return;
    setSelecting(false);
    checkSelection(selection);
    setSelection([]);
  };

  const checkSelection = (sel) => {
    if (!gameData||sel.length<2) return;
    const selKey=sel.map(c=>`${c.r},${c.c}`).join("|");
    const revKey=[...sel].reverse().map(c=>`${c.r},${c.c}`).join("|");
    gameData.placed.forEach(({word,cells},wi)=>{
      if (found.includes(wi)) return;
      const wKey=cells.map(c=>`${c.r},${c.c}`).join("|");
      if (selKey===wKey||revKey===wKey) {
        const nf=[...found,wi];
        setFound(nf);
        if (nf.length===gameData.placed.length) {
          setWon(true); setConfetti(true);
          setTimeout(()=>setConfetti(false),2500);
        }
      }
    });
  };

  const getCellStyle = (r,c) => {
    if (!gameData) return {};
    for (const wi of found) {
      if (gameData.placed[wi].cells.some(cell=>cell.r===r&&cell.c===c)) {
        const col=WORD_COLORS[wi%WORD_COLORS.length];
        return {background:col.bg,color:col.text,fontWeight:700};
      }
    }
    if (selection.some(cell=>cell.r===r&&cell.c===c))
      return {background:C.yellow+"80",color:C.blue,fontWeight:700};
    return {};
  };

  // ── Touch event handlers with preventDefault ──────────────────────────
  const handleTouchStart = (e) => {
    e.preventDefault();
    const touch=e.touches[0];
    const coords=getCellFromTouch(touch);
    if (coords) startSelection(coords.r,coords.c);
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
    const touch=e.touches[0];
    const coords=getCellFromTouch(touch);
    if (coords) extendSelection(coords.r,coords.c);
  };

  const handleTouchEnd = (e) => {
    e.preventDefault();
    endSelection();
  };

  // Attach touch events with {passive:false} via useEffect (required for preventDefault)
  useEffect(()=>{
    const el=gridRef.current;
    if (!el) return;
    el.addEventListener("touchstart",handleTouchStart,{passive:false});
    el.addEventListener("touchmove",handleTouchMove,{passive:false});
    el.addEventListener("touchend",handleTouchEnd,{passive:false});
    return ()=>{
      el.removeEventListener("touchstart",handleTouchStart);
      el.removeEventListener("touchmove",handleTouchMove);
      el.removeEventListener("touchend",handleTouchEnd);
    };
  },[selecting,selection,found,gameData]);

  return (
    <div className="min-h-screen" style={{background:"linear-gradient(150deg,#E3F2FD 0%,#FFFDE7 50%,#E8F5E9 100%)"}}>
      <Confetti active={confetti}/>

      {/* Header */}
      <div className="text-center py-10 px-4">
        <div className="text-6xl mb-3">🔍</div>
        <h1 className="font-display text-4xl md:text-5xl mb-2" style={{color:C.blue}}>Word Search</h1>
        <p className="font-body text-slate-500 text-lg">Find all 10 hidden English words! 🕵️</p>
        <p className="font-body text-slate-400 text-sm mt-1">{ALL_PACKS.length} themes available</p>
      </div>

      {/* Pack selector — scrollable row */}
      <div className="px-4 mb-3">
        <div className="flex gap-2 overflow-x-auto pb-2 justify-start md:justify-center">
          {ALL_PACKS.map((p,i)=>(
            <button key={i} onClick={()=>setPackIdx(i)}
              className="flex-shrink-0 px-4 py-2 rounded-full font-display text-sm border-2 transition-all"
              style={{
                background:packIdx===i?C.blue:"white",
                color:packIdx===i?"white":"#6B7280",
                borderColor:packIdx===i?C.blue:"#E2E8F0",
              }}
            >{p.emoji} {p.name}</button>
          ))}
        </div>
      </div>

      {/* Lang picker */}
      <div className="flex justify-center mb-6">
        <div className="flex gap-1 bg-white/80 rounded-full p-1 shadow-sm">
          {Object.entries(LANG_LABELS).map(([code,label])=>(
            <button key={code} onClick={()=>setLang(code)}
              className="px-3 py-1.5 rounded-full font-display text-xs transition-all"
              style={{background:lang===code?C.green:"transparent",color:lang===code?"white":"#6B7280"}}
            >{label}</button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 pb-20">
        {won && (
          <motion.div initial={{scale:0.8,opacity:0}} animate={{scale:1,opacity:1}}
            className="text-center mb-6 py-4 rounded-3xl font-display text-2xl text-white shadow-xl"
            style={{background:`linear-gradient(135deg,${C.green},#2E7D32)`}}
          >🏆 You found all the words! Amazing! 🎉</motion.div>
        )}

        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Grid */}
          <div>
            {/* MOBILE FIX: touch-action:none prevents scroll during swipe */}
            <div
              ref={gridRef}
              className="grid gap-0.5 p-2 rounded-3xl shadow-xl border-4 border-white select-none"
              style={{
                gridTemplateColumns:`repeat(${GRID_SIZE},1fr)`,
                background:C.blueSoft,
                touchAction:"none",       /* ← prevents page scroll on touch */
                userSelect:"none",
                WebkitUserSelect:"none",
              }}
              onMouseLeave={endSelection}
            >
              {gameData && gameData.grid.map((row,r)=>
                row.map((letter,c)=>(
                  <div
                    key={`${r}-${c}`}
                    data-r={r}
                    data-c={c}
                    className="aspect-square flex items-center justify-center rounded-md font-display cursor-pointer transition-colors"
                    style={{
                      background:"white",
                      color:C.blue,
                      fontSize:"clamp(9px,1.8vw,14px)",
                      ...getCellStyle(r,c),
                    }}
                    onMouseDown={()=>startSelection(r,c)}
                    onMouseEnter={()=>extendSelection(r,c)}
                    onMouseUp={endSelection}
                  >
                    {letter}
                  </div>
                ))
              )}
            </div>

            <div className="mt-4 flex justify-center">
              <motion.button whileHover={{scale:1.04}} whileTap={{scale:0.96}}
                onClick={()=>startGame()}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl font-display text-white shadow-md"
                style={{background:C.red}}
              ><RotateCcw size={16}/> New puzzle</motion.button>
            </div>
          </div>

          {/* Word list */}
          <div>
            <h3 className="font-display text-xl mb-4" style={{color:C.blue}}>
              Find these {WORDS_PER_ROUND} words ({found.length}/{gameData?.placed.length??0})
            </h3>
            <div className="space-y-2">
              {gameData && gameData.placed.map(({word},wi)=>{
                const isFound=found.includes(wi);
                const col=WORD_COLORS[wi%WORD_COLORS.length];
                return (
                  <motion.div key={wi}
                    initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} transition={{delay:wi*0.04}}
                    className="flex items-center gap-4 p-3 rounded-2xl border-2 transition-all"
                    style={{background:isFound?col.bg:"white",borderColor:isFound?col.border:"#E2E8F0"}}
                  >
                    {isFound
                      ? <CheckCircle size={18} style={{color:col.text,flexShrink:0}}/>
                      : <div className="w-4 h-4 rounded-full border-2 border-slate-300 flex-shrink-0"/>
                    }
                    <div className="flex-1 min-w-0">
                      <div className="font-display text-base" style={{color:isFound?col.text:C.blue}}>
                        {isFound ? word.en : "?".repeat(word.en.length)}
                      </div>
                      <div className="font-body text-sm text-slate-500 truncate" dir={lang==="ar"?"rtl":"ltr"}>
                        {word[lang]}
                      </div>
                    </div>
                    {isFound && <Star size={14} style={{color:col.text,flexShrink:0}}/>}
                  </motion.div>
                );
              })}
            </div>

            <div className="mt-6 rounded-3xl p-4 border-2 border-white shadow-sm" style={{background:C.yellowSoft}}>
              <p className="font-display text-sm mb-1" style={{color:C.yellow}}>How to play</p>
              <p className="font-body text-xs text-slate-600">
                Click and drag (or swipe on touch screens) to select letters in a straight line — horizontal, vertical, or diagonal. Works on iPad and phones!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
