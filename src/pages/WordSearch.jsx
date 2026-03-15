/**
 * src/pages/WordSearch.jsx — Kiddsy
 * Bilingual word search: find English words hidden in a grid
 */
import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, Trophy, CheckCircle, Star, Search, Globe, ChevronDown } from "lucide-react";
import { WordSearchBg } from "../components/PageBg.jsx";
import { BubbleTitle } from "../components/KiddsyFont";
import EmojiSvg from "../utils/EmojiSvg.jsx";
import { LANGUAGES } from "../utils/langConfig.js";
import { C } from "../utils/designConfig.js";
import { PACKS } from "../utils/gameData.js";
import { FlagImg } from "../components/KiddsyIcons.jsx";
import { t } from "../utils/uiStrings.js";

// Highlight colors per word (pastel fills)
const WORD_COLORS = [
  { bg: "#FFF9C4", border: "#F9A825", text: "#E65100" },
  { bg: "#C8E6C9", border: "#43A047", text: "#1B5E20" },
  { bg: "#BBDEFB", border: "#1565C0", text: "#0D47A1" },
  { bg: "#F8BBD0", border: "#D81B60", text: "#880E4F" },
  { bg: "#B2EBF2", border: "#00ACC1", text: "#006064" },
  { bg: "#E1BEE7", border: "#8E24AA", text: "#4A148C" },
];

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
    pt:"Encontre estas palabras",   de:"Finde diese Wörter",    it:"Trova queste parole",
    zh:"找找这些单词",              ja:"これらの言葉を探して", ko:"이 단어들을 찾아보세요",
    ru:"Найди эти слова",           hi:"ये शब्द खोजें",         tr:"Bu kelimeleri bul",
    nl:"Vind deze woorden",         pl:"Znajdź te słowa",       sv:"Hitta dessa ord",
  },
  wellDone: {
    es:"¡Muy bien! ¡Encontraste todas las palabras!",
    fr:"Bravo ! Tu as trouvé tous los mots !",
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

// ─── Confetti Component ───────────────────────────────────────────────────
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

// ─── Pack Dropdown ────────────────────────────────────────────────────────
function PackDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const sel = PACKS[value];

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
                  }}
                >
                  <EmojiSvg code={p.emoji} size={18}/>
                  <span style={{ flex:1 }}>{p.name}</span>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Lang Dropdown ────────────────────────────────────────────────────────
function LangDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const sel = LANGUAGES.find(l => l.code === value) || LANGUAGES[0];

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
          <Globe size={14}/>
          <FlagImg code={sel.flagCode} size={20}/>
          <span>{sel.label}</span>
        </span>
        <motion.span animate={{ rotate:open?180:0 }} transition={{ duration:0.2 }}>
          <ChevronDown size={13}/>
        </motion.span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity:0, y:-8, scale:0.97 }}
            animate={{ opacity:1, y:0, scale:1 }}
            exit={{ opacity:0, y:-8, scale:0.97 }}
            style={{
              position:"absolute", top:"calc(100% + 8px)", left:"50%",
              transform:"translateX(-50%)", width:215,
              background:"white", borderRadius:18,
              border:`2px solid ${C.green}18`,
              boxShadow:`0 16px 48px ${C.green}20`,
              overflow:"hidden", maxHeight:320, overflowY:"auto",
            }}
          >
            {WORD_SEARCH_LANGS.map(l => (
              <button key={l.code} onClick={() => { onChange(l.code); setOpen(false); }}
                style={{
                  display:"flex", alignItems:"center", gap:9, width:"100%",
                  padding:"8px 14px", border:"none", background:"transparent",
                  cursor:"pointer", fontFamily:"var(--font-body,'Nunito',sans-serif)",
                  fontSize:13, color: l.code === value ? C.green : "#374151"
                }}
              >
                <FlagImg code={l.flagCode} size={20}/>
                <span>{l.label}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main WordSearch Component ─────────────────────────────────────────────
export default function WordSearch({ lang = "en", onLangChange }) {
  const [packIdx, setPackIdx] = useState(0);
  const [gameData, setGameData] = useState(null);
  const [selecting, setSelecting] = useState(false);
  const [selection, setSelection] = useState([]);
  const [found, setFound] = useState([]);
  const [confetti, setConfetti] = useState(false);
  const [won, setWon] = useState(false);

  const startGame = useCallback((pIdx = packIdx) => {
    const pool = [...PACKS[pIdx].words];
    const picked = pool.sort(() => Math.random() - 0.5).slice(0, 12);
    const data = buildGrid(picked);
    setGameData(data);
    setFound([]);
    setSelection([]);
    setSelecting(false);
    setWon(false);
  }, [packIdx]);

  useEffect(() => { startGame(packIdx); }, [packIdx, startGame]);

  const handleReset = () => startGame();

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

  return (
    <div className="relative min-h-screen overflow-hidden">
      <WordSearchBg/>
      <Confetti active={confetti}/>
      <div className="relative z-10">
        <div className="text-center py-10 px-4">
          <motion.div initial={{ scale:0.8, opacity:0 }} animate={{ scale:1, opacity:1 }}>
            <h1 style={{ lineHeight:1.2 }}>
              <BubbleTitle color="#E11D48" size={54}>{t("ws.title", lang)}</BubbleTitle>
            </h1>
          </motion.div>
          <p className="font-display text-slate-700 text-lg font-medium bg-white/40 backdrop-blur-sm inline-block px-4 py-1 rounded-full">
            {t("ws.subtitle", lang)}
          </p>
        </div>

        <div className="flex justify-center gap-3 px-4 mb-6 flex-wrap">
          <PackDropdown value={packIdx} onChange={setPackIdx}/>
          <LangDropdown value={lang} onChange={onLangChange}/>
        </div>

        <div className="max-w-4xl mx-auto px-4 pb-20">
          {won && (
            <motion.div initial={{ scale:0.8, opacity:0 }} animate={{ scale:1, opacity:1 }}
              className="text-center mb-6 py-4 rounded-3xl font-display text-2xl text-white shadow-xl"
              style={{ background:`linear-gradient(135deg, ${C.green}, #2E7D32)`, display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
              <Trophy size={22}/> {t("ws.wellDone", lang)}
            </motion.div>
          )}

          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div>
              <div className="grid gap-1 p-3 rounded-3xl shadow-xl border-4 border-white select-none"
                style={{ gridTemplateColumns:`repeat(${GRID_SIZE},1fr)`, background:C.blueSoft }}
                onMouseLeave={handleCellEnd}>
                {gameData && gameData.grid.map((row, r) =>
                  row.map((letter, c) => (
                    <div key={`${r}-${c}`}
                      className="aspect-square flex items-center justify-center rounded-lg font-display text-sm cursor-pointer"
                      style={{ background:"white", color:C.blue, ...getCellStyle(r, c) }}
                      onMouseDown={() => handleCellStart(r, c)}
                      onMouseEnter={() => handleCellEnter(r, c)}
                      onMouseUp={handleCellEnd}
                    >
                      {letter}
                    </div>
                  ))
                )}
              </div>
              <div className="mt-4 flex justify-center">
                <button onClick={handleReset} className="flex items-center gap-2 px-6 py-3 rounded-2xl font-display text-white shadow-md" style={{ background:C.red }}>
                  <RotateCcw size={16}/> {t("ws.newPuzzle", lang)}
                </button>
              </div>
            </div>

            <div>
              <h3 className="font-display text-sm font-bold mb-2 flex items-center gap-1.5" style={{ color:C.blue }}>
                <Search size={13}/> {t("ws.findWords", lang)}
              </h3>
              <div className="grid grid-cols-2 gap-1.5">
                {gameData && gameData.placed.map(({ word }, wi) => {
                  const isFound = found.includes(wi);
                  const col = WORD_COLORS[wi % WORD_COLORS.length];
                  return (
                    <div key={wi} className="flex items-center gap-2 px-2.5 py-2 rounded-xl border-2"
                      style={{ background:isFound ? col.bg : "white", borderColor:isFound ? col.border : "#E2E8F0" }}>
                      {isFound ? <CheckCircle size={13} style={{ color:col.text }}/> : <div className="w-3 h-3 rounded-full border-2 border-slate-300"/>}
                      <div className="flex-1 min-w-0">
                        <div className="font-display text-sm leading-tight truncate" style={{ color:isFound ? col.text : C.blue }}>
                          {isFound ? word.en : "?".repeat(word.en.length)}
                        </div>
                        <div className="font-body text-xs text-slate-400 leading-tight truncate">
                          {word[lang]}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}