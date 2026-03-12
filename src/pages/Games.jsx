/**
 * src/pages/Games.jsx — Kiddsy
 * ─────────────────────────────────────────────────────────────────────────
 * Sliding Tile Puzzle + Emoji Memory Match
 * All tiles are sticker-style Lucide icons — no emojis, no photos.
 * 4 categories × 25 icon variants; fresh random set each round.
 */
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Puzzle, Brain, RotateCcw } from "lucide-react";
import { CATEGORY_TILES, GameStickerTile, StickerBadge } from "../components/KiddsyIcons.jsx";
import { GamesBg } from "../components/PageBg.jsx";
import CartoonTitle from "../components/CartoonTitle.jsx";
import { BubbleTitle } from "../components/KiddsyFont.jsx";
import EmojiSvg from "../utils/EmojiSvg.jsx";

const C = {
  blue:"#1565C0",   blueSoft:"#E3F2FD",
  red:"#E53935",
  yellow:"#F9A825",
  green:"#43A047",  greenSoft:"#E8F5E9",
  magenta:"#D81B60",magentaSoft:"#FCE4EC",
  orange:"#E65100", orangeSoft:"#FFF3E0",
  cyan:"#00ACC1",
};
const SPRING = { type:"spring", stiffness:380, damping:16 };

// ─── Confetti ───────────────────────────────────────────────────────────────
function Confetti({ active }) {
  const ps = Array.from({ length:22 }, (_,i) => ({
    id:i, x:Math.random()*100, delay:Math.random()*.4, size:Math.random()*10+8,
    color:["#F9A825","#E53935","#43A047","#1565C0","#D81B60","#00ACC1"][i%6],
  }));
  if (!active) return null;
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {ps.map(p=>(
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

// ─────────────────────────────────────────────────────────────────────────────
// DATA helpers
// ─────────────────────────────────────────────────────────────────────────────
/** Pick n random unique tiles from a category pool */
function pickRandom(catId, n) {
  const pool = [...CATEGORY_TILES[catId]];
  const out  = [];
  while (out.length < n && pool.length) {
    const i = Math.floor(Math.random() * pool.length);
    out.push(pool.splice(i, 1)[0]);
  }
  return out;
}

const PUZZLE_CATS = [
  { id:"animals", label:"Animals", icon:Puzzle,  color:C.green,   bg:C.greenSoft   },
  { id:"fruits",  label:"Food",    icon:Brain,   color:C.red,     bg:"#FFEBEE"     },
  { id:"space",   label:"Space",   icon:Puzzle,  color:C.blue,    bg:C.blueSoft    },
  { id:"tools",   label:"Tools",   icon:Wrench,  color:C.orange,  bg:C.orangeSoft  },
];

const MEMORY_CATS = [
  { id:"animals", label:"Animals", color:C.magenta, bg:C.magentaSoft },
  { id:"fruits",  label:"Food",    color:C.green,   bg:C.greenSoft   },
  { id:"space",   label:"Space",   color:C.blue,    bg:C.blueSoft    },
  { id:"tools",   label:"Tools",   color:C.orange,  bg:C.orangeSoft  },
];

// Lucide Wrench for tools cat (import inline — won't duplicate)
import { Wrench } from "lucide-react";

// ══════════════════════════════════════════════════════════════════════════
// GAME 1: SLIDING TILE PUZZLE  (3×3 sticker grid)
// ══════════════════════════════════════════════════════════════════════════
function makePuzzleSet(catId) {
  return [...pickRandom(catId, 8), null]; // 8 tiles + blank
}

function shufflePuzzle(arr) {
  const a = [...arr];
  for (let i = a.length-1; i > 0; i--) {
    const j = Math.floor(Math.random()*(i+1));
    [a[i],a[j]] = [a[j],a[i]];
  }
  const ni = a.indexOf(null);
  [a[ni], a[a.length-1]] = [a[a.length-1], a[ni]];
  return a;
}

function SlidingPuzzle() {
  const [catIdx,   setCatIdx]   = useState(0);
  const [target,   setTarget]   = useState(() => makePuzzleSet("animals"));
  const [tiles,    setTiles]    = useState(() => shufflePuzzle(makePuzzleSet("animals")));
  const [moves,    setMoves]    = useState(0);
  const [won,      setWon]      = useState(false);
  const [confetti, setConfetti] = useState(false);

  const cat = PUZZLE_CATS[catIdx];

  const newGame = (idx = catIdx) => {
    const t = makePuzzleSet(PUZZLE_CATS[idx].id);
    setTarget(t);
    setTiles(shufflePuzzle(t));
    setMoves(0); setWon(false);
  };

  useEffect(() => { newGame(catIdx); }, [catIdx]);

  const handleClick = (idx) => {
    if (won) return;
    const emptyIdx = tiles.indexOf(null);
    const r=Math.floor(idx/3), c=idx%3, er=Math.floor(emptyIdx/3), ec=emptyIdx%3;
    const adj = (r===er&&Math.abs(c-ec)===1)||(c===ec&&Math.abs(r-er)===1);
    if (!adj) return;
    const next = [...tiles];
    [next[idx],next[emptyIdx]] = [next[emptyIdx],next[idx]];
    setTiles(next); setMoves(m=>m+1);
    if (next.every((t,i)=>t===target[i])) {
      setWon(true); setConfetti(true);
      setTimeout(()=>setConfetti(false), 2200);
    }
  };

  const TILE_SZ = 80;

  return (
    <div className="flex flex-col items-center">
      <Confetti active={confetti}/>

      {/* Category pills */}
      <div className="flex flex-wrap gap-2 mb-6 justify-center">
        {PUZZLE_CATS.map((c,i)=>{
          const Icon=c.icon; const active=catIdx===i;
          return (
            <motion.button key={c.id} onClick={()=>setCatIdx(i)}
              whileHover={{ scale:1.06, y:-2 }} whileTap={{ scale:0.93 }} transition={SPRING}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full font-display text-sm"
              style={{
                background: active ? c.color : "white",
                color:      active ? "white" : "#6B7280",
                border:     active ? `2.5px solid ${c.color}` : "2.5px solid #E2E8F0",
                boxShadow:  active ? `0 6px 18px ${c.color}50` : "0 2px 8px rgba(0,0,0,0.06)",
              }}
            >
              <Icon size={16}/> {c.label}
            </motion.button>
          );
        })}
      </div>

      {/* Stats */}
      <div className="flex gap-3 mb-5 flex-wrap justify-center">
        <div className="px-5 py-2 rounded-full font-display bg-white/90 shadow-sm border border-white" style={{ color:cat.color }}>
          <EmojiSvg code="1f3c3" size={14} /> {moves} moves
        </div>
        {won && (
          <motion.div initial={{ scale:0 }} animate={{ scale:1 }} transition={SPRING}
            className="px-5 py-2 rounded-full font-display text-white shadow-lg" style={{ background:C.green }}
          ><EmojiSvg code="1f3c6" size={20} style={{ marginRight:6, verticalAlign:"middle" }}/>Solved!</motion.div>
        )}
      </div>

      {/* Puzzle grid */}
      <div className="grid gap-2 p-3 rounded-3xl shadow-2xl border-4 border-white"
        style={{
          gridTemplateColumns:`repeat(3,${TILE_SZ}px)`,
          background: cat.bg,
          boxShadow: `0 16px 48px ${cat.color}28, 0 4px 16px rgba(0,0,0,0.10)`,
        }}
      >
        {tiles.map((tile,i) => (
          <div key={i} onClick={() => handleClick(i)} style={{ cursor: tile ? "pointer" : "default" }}>
            <GameStickerTile tile={tile} size={TILE_SZ} isBlank={!tile}/>
          </div>
        ))}
      </div>

      {/* Goal preview */}
      <div className="mt-5 text-center">
        <p className="font-body text-xs text-slate-400 mb-2">Target order ↓</p>
        <div className="flex gap-1.5 justify-center flex-wrap max-w-[320px]">
          {target.filter(Boolean).map((t,i)=>{
            const { I:Icon, c:color } = t;
            return (
              <motion.div key={i} whileHover={{ scale:1.14, y:-2 }} transition={SPRING}
                className="w-9 h-9 rounded-xl flex items-center justify-center border-2 border-white shadow-sm"
                style={{ background: color+"20" }}
              >
                <Icon size={20} color={color} strokeWidth={2.2}/>
              </motion.div>
            );
          })}
        </div>
      </div>

      <motion.button whileHover={{ scale:1.05 }} whileTap={{ scale:0.95 }} onClick={() => newGame()}
        className="mt-6 flex items-center gap-2 px-7 py-3 rounded-2xl font-display text-white shadow-xl"
        style={{ background:C.red, boxShadow:`0 8px 22px ${C.red}40` }}
      ><RotateCcw size={16}/> New puzzle</motion.button>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// GAME 2: MEMORY MATCH  (4×4 sticker cards)
// ══════════════════════════════════════════════════════════════════════════
function buildDeck(catId) {
  const icons = pickRandom(catId, 8);
  const pairs = [...icons, ...icons];
  for (let i=pairs.length-1;i>0;i--) {
    const j=Math.floor(Math.random()*(i+1));
    [pairs[i],pairs[j]]=[pairs[j],pairs[i]];
  }
  return pairs.map((tile, id) => ({ id, tile, matched:false }));
}

function MemoryMatch() {
  const [catIdx,   setCatIdx]   = useState(0);
  const [deck,     setDeck]     = useState(()=>buildDeck("animals"));
  const [flipped,  setFlipped]  = useState([]);
  const [moves,    setMoves]    = useState(0);
  const [locked,   setLocked]   = useState(false);
  const [won,      setWon]      = useState(false);
  const [confetti, setConfetti] = useState(false);

  const cat = MEMORY_CATS[catIdx];

  const reset = (idx=catIdx) => {
    setDeck(buildDeck(MEMORY_CATS[idx].id));
    setFlipped([]); setMoves(0); setLocked(false); setWon(false);
  };

  useEffect(()=>{ reset(catIdx); }, [catIdx]);

  const handleClick = (card) => {
    if (locked||card.matched||flipped.includes(card.id)) return;
    const nf = [...flipped, card.id];
    setFlipped(nf);
    if (nf.length===2) {
      setLocked(true); setMoves(m=>m+1);
      const [a,b] = nf.map(id=>deck.find(c=>c.id===id));
      if (a.tile===b.tile || (a.tile.I===b.tile.I && a.tile.c===b.tile.c)) {
        const nd = deck.map(c=>nf.includes(c.id)?{...c,matched:true}:c);
        setDeck(nd); setFlipped([]); setLocked(false);
        if (nd.every(c=>c.matched)) {
          setWon(true); setConfetti(true);
          setTimeout(()=>setConfetti(false), 2500);
        }
      } else {
        setTimeout(()=>{ setFlipped([]); setLocked(false); }, 950);
      }
    }
  };

  const isFlipped = (card) => card.matched || flipped.includes(card.id);
  const matchedCount = deck.filter(c=>c.matched).length/2;
  const CARD_SZ = 64;

  return (
    <div className="flex flex-col items-center">
      <Confetti active={confetti}/>

      <div className="flex flex-wrap gap-2 mb-6 justify-center">
        {MEMORY_CATS.map((c,i)=>{
          const active=catIdx===i;
          return (
            <motion.button key={c.id} onClick={()=>setCatIdx(i)}
              whileHover={{ scale:1.06, y:-2 }} whileTap={{ scale:0.93 }} transition={SPRING}
              className="px-5 py-2.5 rounded-full font-display text-sm"
              style={{
                background: active ? c.color : "white",
                color:      active ? "white" : "#6B7280",
                border:     active ? `2.5px solid ${c.color}` : "2.5px solid #E2E8F0",
                boxShadow:  active ? `0 6px 18px ${c.color}50` : "0 2px 8px rgba(0,0,0,0.06)",
              }}
            >{c.label}</motion.button>
          );
        })}
      </div>

      <div className="flex gap-3 mb-5 flex-wrap justify-center">
        <div className="px-5 py-2 rounded-full font-display bg-white/90 shadow-sm border border-white" style={{ color:cat.color }}>
          <EmojiSvg code="1f9e0" size={14} /> {moves} pairs tried
        </div>
        <div className="px-5 py-2 rounded-full font-display bg-white/90 shadow-sm border border-white" style={{ color:C.green }}>
          <EmojiSvg code="2705" size={14} /> {matchedCount} / 8 found
        </div>
        {won && (
          <motion.div initial={{ scale:0 }} animate={{ scale:1 }} transition={SPRING}
            className="px-5 py-2 rounded-full font-display text-white shadow-lg" style={{ background:C.green }}
          ><EmojiSvg code="1f3c6" size={20} style={{ marginRight:6, verticalAlign:"middle" }}/>You win!</motion.div>
        )}
      </div>

      {/* Card grid */}
      <div className="grid gap-2.5 p-3 rounded-3xl shadow-2xl border-4 border-white"
        style={{
          gridTemplateColumns:`repeat(4,${CARD_SZ}px)`,
          background: cat.bg,
          boxShadow: `0 16px 48px ${cat.color}28, 0 4px 16px rgba(0,0,0,0.10)`,
        }}
      >
        {deck.map(card=>(
          <div key={card.id} onClick={()=>handleClick(card)} style={{ cursor:"pointer" }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={isFlipped(card)?"front":"back"}
                initial={{ rotateY:90, scale:0.85 }}
                animate={{ rotateY:0,  scale:1    }}
                exit={{    rotateY:90, scale:0.85 }}
                transition={{ duration:0.18 }}
              >
                <GameStickerTile
                  tile={card.tile}
                  size={CARD_SZ}
                  isFlipped={isFlipped(card)}
                  isMatched={card.matched}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        ))}
      </div>

      <motion.button whileHover={{ scale:1.05 }} whileTap={{ scale:0.95 }}
        onClick={()=>reset()}
        className="mt-6 flex items-center gap-2 px-7 py-3 rounded-2xl font-display text-white shadow-xl"
        style={{ background:cat.color, boxShadow:`0 8px 22px ${cat.color}45` }}
      ><RotateCcw size={16}/> New game</motion.button>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// MAIN
// ══════════════════════════════════════════════════════════════════════════
const GAME_TABS = [
  { id:"puzzle", label:"Tile Puzzle",  emoji:"🧩", Icon:Puzzle, color:C.blue,    bg:C.blueSoft    },
  { id:"memory", label:"Memory Match", emoji:"🧠", Icon:Brain,  color:C.magenta, bg:C.magentaSoft },
];

export default function Games() {
  const [activeGame, setActiveGame] = useState("puzzle");
  const active = GAME_TABS.find(g=>g.id===activeGame);

  // ── RENDER ────────────────────────────────────────────────────────────
  return (
  <div className="relative min-h-screen overflow-hidden">
    {/* Fondo temático de Juegos (Dados, Joystick, Trofeos) */}
    <GamesBg />

    {/* Contenido (z-10 para flotar sobre las animaciones) */}
    <div className="relative z-10">
      
      {/* Header */}
      <div className="text-center py-12 px-4">
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }} 
          transition={{ type: "spring", stiffness: 220 }}
          className="inline-block mb-4"
        >
          {/* Mantenemos tu StickerBadge porque encaja con la estética */}
          <StickerBadge icon={active.Icon} color={active.color} size={68} noHover/>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: -14 }} 
          animate={{ opacity: 1, y: 0 }}
          className="mb-3" 
          style={{ lineHeight: 1.2 }}
        >
          {/* Título nuevo: Game Zone */}
          <BubbleTitle color="#1E88E5" size={54}>
            Game Zone
          </BubbleTitle>
        </motion.h1>

        <div className="bg-white/40 backdrop-blur-md rounded-3xl p-4 max-w-md mx-auto shadow-sm border border-white/50">
          <p className="font-display text-slate-700 text-lg font-medium">
            Fun games that make learning English feel like playtime! <EmojiSvg code="1f31f" size={16} />
          </p>
          <p className="font-display text-slate-500 text-sm mt-1 font-semibold uppercase tracking-wider">
            4 categories · 25 icon variants
          </p>
        </div>
      </div>

      {/* Game selector */}
      <div className="flex justify-center gap-5 px-4 mb-10 flex-wrap">
        {GAME_TABS.map(g=>{
          const Icon=g.Icon; const isActive=activeGame===g.id;
          return (
            <motion.button key={g.id}
              whileHover={{ scale:1.05, y:-4 }} whileTap={{ scale:0.95 }} transition={SPRING}
              onClick={()=>setActiveGame(g.id)}
              className="flex items-center gap-3 px-7 py-4 rounded-3xl font-display text-lg border-4 shadow-lg"
              style={{
                background:   isActive ? g.color : "white",
                borderColor:  isActive ? g.color : "white",
                color:        isActive ? "white" : "#4B5563",
                boxShadow:    isActive ? `0 10px 34px ${g.color}45` : "0 4px 14px rgba(0,0,0,0.07)",
              }}
            >
              {/* Sticker icon beside label */}
              <div style={{
                width:36, height:36, borderRadius:"50%",
                background: isActive?"rgba(255,255,255,0.22)":g.color+"18",
                border:"2.5px solid white",
                boxShadow:`0 3px 12px ${g.color}40`,
                display:"flex", alignItems:"center", justifyContent:"center",
              }}>
                <Icon size={18} color={isActive?"white":g.color} strokeWidth={2.2}/>
              </div>
              {g.label}
            </motion.button>
          );
        })}
      </div>

      {/* Game area */}
      <div className="max-w-xl mx-auto px-4 pb-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeGame}
            initial={{ opacity:0, scale:0.95, y:12 }}
            animate={{ opacity:1, scale:1, y:0 }}
            exit={{ opacity:0, scale:0.95, y:-12 }}
            transition={{ duration:0.26 }}
          >
            {activeGame==="puzzle" && <SlidingPuzzle/>}
            {activeGame==="memory" && <MemoryMatch/>}
          </motion.div>
        </AnimatePresence>
       </div>
      </div>
     </div>
  );
}