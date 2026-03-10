/**
 * src/pages/WordSearch.jsx — Kiddsy
 * Bilingual word search: find English words hidden in a grid
 * Words come from the story vocabulary + alphabet module
 */
import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, Trophy, CheckCircle, Star, Search, Loader, Users, BookOpen, Utensils } from "lucide-react";

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
  {
    name: "Animals",
    emoji: "🦁",
    icon: Loader,
    words: [
      { en: "CAT",      es: "Gato",     fr: "Chat",    ar: "قطة"  },
      { en: "DOG",      es: "Perro",    fr: "Chien",   ar: "كلب"  },
      { en: "FISH",     es: "Pez",      fr: "Poisson", ar: "سمكة" },
      { en: "BIRD",     es: "Pájaro",   fr: "Oiseau",  ar: "طائر" },
      { en: "LION",     es: "León",     fr: "Lion",    ar: "أسد"  },
      { en: "BEAR",     es: "Oso",      fr: "Ours",    ar: "دب"   },
    ],
  },
  {
    name: "Family",
    emoji: "👪",
    icon: Users,
    words: [
      { en: "MOM",      es: "Mamá",     fr: "Maman",   ar: "أم"   },
      { en: "DAD",      es: "Papá",     fr: "Papa",    ar: "أب"   },
      { en: "BABY",     es: "Bebé",     fr: "Bébé",    ar: "رضيع" },
      { en: "LOVE",     es: "Amor",     fr: "Amour",   ar: "حب"   },
      { en: "HOME",     es: "Hogar",    fr: "Maison",  ar: "منزل" },
      { en: "PLAY",     es: "Jugar",    fr: "Jouer",   ar: "لعب"  },
    ],
  },
  {
    name: "School",
    emoji: "📚",
    icon: BookOpen,
    words: [
      { en: "BOOK",     es: "Libro",    fr: "Livre",   ar: "كتاب" },
      { en: "PEN",      es: "Pluma",    fr: "Stylo",   ar: "قلم"  },
      { en: "DESK",     es: "Escritorio",fr:"Bureau",  ar: "مكتب" },
      { en: "READ",     es: "Leer",     fr: "Lire",    ar: "قراءة"},
      { en: "WRITE",    es: "Escribir", fr: "Écrire",  ar: "كتابة"},
      { en: "LEARN",    es: "Aprender", fr: "Apprendre",ar:"تعلم" },
    ],
  },
  {
    name: "Food",
    emoji: "🥦",
    icon: Utensils,
    words: [
      { en: "APPLE",    es: "Manzana",  fr: "Pomme",   ar: "تفاحة"},
      { en: "BREAD",    es: "Pan",      fr: "Pain",    ar: "خبز"  },
      { en: "MILK",     es: "Leche",    fr: "Lait",    ar: "حليب" },
      { en: "RICE",     es: "Arroz",    fr: "Riz",     ar: "أرز"  },
      { en: "EGG",      es: "Huevo",    fr: "Œuf",     ar: "بيضة" },
      { en: "SOUP",     es: "Sopa",     fr: "Soupe",   ar: "شوربة"},
    ],
  },
];

const LANG_LABELS = { es: "Español 🇪🇸", fr: "Français 🇫🇷", ar: "العربية 🇸🇦" };
const GRID_SIZE = 10;

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
  const [packIdx, setPackIdx]     = useState(0);
  const [lang, setLang]           = useState("es");
  const [gameData, setGameData]   = useState(null);
  const [selecting, setSelecting] = useState(false);
  const [selection, setSelection] = useState([]); // [{r,c}]
  const [found, setFound]         = useState([]); // word indices found
  const [confetti, setConfetti]   = useState(false);
  const [won, setWon]             = useState(false);

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

  // Check if current selection matches any word
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

  // Determine highlight color for a cell
  const getCellStyle = (r, c) => {
    if (!gameData) return {};
    // Is it in a found word?
    for (const wi of found) {
      const { cells } = gameData.placed[wi];
      if (cells.some(cell => cell.r === r && cell.c === c)) {
        const col = WORD_COLORS[wi % WORD_COLORS.length];
        return { background: col.bg, color: col.text, fontWeight: 700 };
      }
    }
    // Is it in current selection?
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
    // Only extend in a straight line
    const first = selection[0];
    if (!first) return;
    const dr = Math.sign(r - first.r);
    const dc = Math.sign(c - first.c);
    const len = Math.max(Math.abs(r - first.r), Math.abs(c - first.c)) + 1;

    // Validate straight line
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

  return (
    <div className="min-h-screen kiddsy-bg-drift" style={{
      background: "linear-gradient(135deg, #E3F2FD 0%, #E0F7FA 25%, #FFFDE7 50%, #E3F2FD 75%, #EDE7F6 100%)",
     }}>      <Confetti active={confetti} />

      {/* Header */}
      <div className="text-center py-10 px-4">
        <motion.div initial={{ scale:0.8,opacity:0 }} animate={{ scale:1,opacity:1 }} transition={{ type:"spring" }}
          className="mb-3 inline-flex items-center justify-center w-20 h-20 rounded-3xl"
          style={{ background:"#E3F2FD" }}
        ><Search size={44} strokeWidth={2} style={{ color:"#1565C0" }}/></motion.div>
        <motion.h1 initial={{ opacity:0,y:-12 }} animate={{ opacity:1,y:0 }}
          className="mb-2" style={{ lineHeight:1 }}>
          <CartoonTitle fill={C.cyan} stroke={C.cyanSoft} size={44}>
            Word Search
          </CartoonTitle>
        </motion.h1>
        <p className="font-body text-slate-500 text-lg">Find all the hidden English words!</p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap justify-center gap-3 px-4 mb-6">
        {/* Pack selector */}
        <div className="flex flex-wrap gap-2 justify-center">
          {PACKS.map((p, i) => {
            const PackIcon = p.icon;
            return (
              <button key={i} onClick={() => setPackIdx(i)}
                className="px-4 py-2 rounded-full font-display text-sm border-2 transition-all"
                style={{ background:packIdx===i?C.blue:"white", color:packIdx===i?"white":"#6B7280", borderColor:packIdx===i?C.blue:"#E2E8F0",
                  display:"flex", alignItems:"center", gap:6 }}
              >
                <PackIcon size={13} strokeWidth={2}/>
                {p.name}
              </button>
            );
          })}
        </div>

        {/* Lang picker */}
        <div className="flex gap-1 bg-white/80 rounded-full p-1 shadow-sm">
          {Object.entries(LANG_LABELS).map(([code, label]) => (
            <button key={code} onClick={() => setLang(code)}
              className="px-3 py-1.5 rounded-full font-display text-xs transition-all"
              style={{ background:lang===code?C.green:"transparent", color:lang===code?"white":"#6B7280" }}
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
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center", 
          gap: 8 
        }}
      >
        <Trophy size={22} strokeWidth={2}/> You found all the words! Amazing!
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
                    onMouseDown={() => handleCellStart(r, c)}
                    onMouseEnter={() => handleCellEnter(r, c)}
                    onMouseUp={handleCellEnd}
                    onTouchStart={() => handleCellStart(r, c)}
                  >
                    {letter}
                  </motion.div>
                ))
              )}
            </div>

            <div className="mt-4 flex justify-center">
              <motion.button whileHover={{ scale:1.04 }} whileTap={{ scale:0.96 }}
                onClick={() => startGame()}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl font-display text-white shadow-md"
                style={{ background:C.red }}
              ><RotateCcw size={16}/> New puzzle</motion.button>
            </div>
          </div>

          {/* Word list */}
          <div>
            <h3 className="font-display text-xl mb-4" style={{ color:C.blue }}>
              Find these words ({found.length}/{pack.words.length})
            </h3>
            <div className="space-y-2">
              {gameData && gameData.placed.map(({ word }, wi) => {
                const isFound = found.includes(wi);
                const col = WORD_COLORS[wi % WORD_COLORS.length];
                return (
                  <motion.div
                    key={wi}
                    initial={{ opacity:0, x:20 }}
                    animate={{ opacity:1, x:0 }}
                    transition={{ delay:wi*0.06 }}
                    className="flex items-center gap-4 p-4 rounded-2xl border-2 transition-all"
                    style={{
                      background: isFound ? col.bg : "white",
                      borderColor: isFound ? col.border : "#E2E8F0",
                    }}
                  >
                    {isFound
                      ? <CheckCircle size={18} style={{ color:col.text }} />
                      : <div className="w-4.5 h-4.5 rounded-full border-2 border-slate-300" />
                    }
                    <div className="flex-1">
                      <div className="font-display text-lg" style={{ color: isFound ? col.text : C.blue }}>
                        {isFound ? word.en : "?".repeat(word.en.length)}
                      </div>
                      <div className="font-body text-sm text-slate-500" dir={lang==="ar"?"rtl":"ltr"}>
                        {word[lang]}
                      </div>
                    </div>
                    {isFound && <Star size={16} style={{ color:col.text }} />}
                  </motion.div>
                );
              })}
            </div>

            {/* Instructions */}
            <div className="mt-6 rounded-3xl p-4 border-2 border-white shadow-sm" style={{ background:C.yellowSoft }}>
              <p className="font-display text-sm mb-1" style={{ color:C.yellow }}>How to play</p>
              <p className="font-body text-xs text-slate-600">
                Click and drag across letters to select a word. Words can go in any direction: horizontal, vertical, or diagonal!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
