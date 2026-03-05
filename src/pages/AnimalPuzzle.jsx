/**
 * src/pages/AnimalPuzzle.jsx — Kiddsy
 * Real drag-and-drop jigsaw puzzle with animal photos (Unsplash CDN)
 * 3×3 or 4×4 grid, bilingual animal names
 */
import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, Trophy, ChevronLeft, ChevronRight, Volume2 } from "lucide-react";

const C = {
  blue:       "#1565C0",
  blueSoft:   "#E3F2FD",
  red:        "#E53935",
  yellow:     "#F9A825",
  yellowSoft: "#FFFDE7",
  green:      "#43A047",
  greenSoft:  "#E8F5E9",
  magenta:    "#D81B60",
  cyan:       "#00ACC1",
};

// ─── Animal data with Unsplash photos ─────────────────────────────────────
// Using stable Unsplash source URLs (no API key needed)
const ANIMALS = [
  {
    name: "Lion",
    emoji: "🦁",
    es: "León", fr: "Lion", ar: "أسد",
    fact: "Lions can sleep up to 20 hours a day!",
    // Unsplash source: reliable, free, no attribution needed for demo
    img: "https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=600&h=600&fit=crop&auto=format",
    color: "#F9A825",
  },
  {
    name: "Elephant",
    emoji: "🐘",
    es: "Elefante", fr: "Éléphant", ar: "فيل",
    fact: "Elephants are the largest land animals on Earth!",
    img: "https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=600&h=600&fit=crop&auto=format",
    color: "#78909C",
  },
  {
    name: "Penguin",
    emoji: "🐧",
    es: "Pingüino", fr: "Manchot", ar: "بطريق",
    fact: "Penguins cannot fly but are amazing swimmers!",
    img: "https://images.unsplash.com/photo-1551986782-d0169b3f8fa7?w=600&h=600&fit=crop&auto=format",
    color: "#37474F",
  },
  {
    name: "Giraffe",
    emoji: "🦒",
    es: "Jirafa", fr: "Girafe", ar: "زرافة",
    fact: "Giraffes are the tallest animals — up to 6 meters!",
    img: "https://images.unsplash.com/photo-1547721064-da6cfb341d50?w=600&h=600&fit=crop&auto=format",
    color: "#F4A435",
  },
  {
    name: "Tiger",
    emoji: "🐯",
    es: "Tigre", fr: "Tigre", ar: "نمر",
    fact: "No two tigers have the same stripe pattern!",
    img: "https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=600&h=600&fit=crop&auto=format",
    color: "#EF6C00",
  },
  {
    name: "Dolphin",
    emoji: "🐬",
    es: "Delfín", fr: "Dauphin", ar: "دلفين",
    fact: "Dolphins call each other by name using unique whistles!",
    img: "https://images.unsplash.com/photo-1607153333879-c174d265f1d2?w=600&h=600&fit=crop&auto=format",
    color: "#0288D1",
  },
  {
    name: "Panda",
    emoji: "🐼",
    es: "Panda", fr: "Panda", ar: "الباندا",
    fact: "A panda eats up to 40 kg of bamboo per day!",
    img: "https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=600&h=600&fit=crop&auto=format",
    color: "#546E7A",
  },
  {
    name: "Parrot",
    emoji: "🦜",
    es: "Loro", fr: "Perroquet", ar: "ببغاء",
    fact: "Parrots can learn and repeat human words!",
    img: "https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=600&h=600&fit=crop&auto=format",
    color: "#2E7D32",
  },
];

const LANG_LABELS = { es: "🇪🇸", fr: "🇫🇷", ar: "🇸🇦" };
const LANG_NAMES  = { es: "Español", fr: "Français", ar: "العربية" };

// ─── Confetti ──────────────────────────────────────────────────────────────
function Confetti({ active }) {
  const pieces = Array.from({ length: 24 }, (_, i) => ({
    id: i, x: Math.random()*100,
    color: [C.blue,C.red,C.yellow,C.green,C.magenta,C.cyan][i%6],
    delay: Math.random()*0.5, size: Math.random()*10+7,
  }));
  if (!active) return null;
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map(p => (
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

// ─── Speak helper ──────────────────────────────────────────────────────────
function speak(text, lang = "en-US") {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = lang; u.rate = 0.85; u.pitch = 1.1;
  window.speechSynthesis.speak(u);
}

const VOICE_LANG = { es:"es-ES", fr:"fr-FR", ar:"ar-SA" };

// ─── Puzzle logic ──────────────────────────────────────────────────────────
function buildPuzzle(size) {
  const total = size * size;
  const tiles = Array.from({ length: total }, (_, i) => i);
  // Fisher-Yates shuffle
  for (let i = total-1; i > 0; i--) {
    const j = Math.floor(Math.random()*(i+1));
    [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
  }
  return tiles;
}

function isSolved(tiles) {
  return tiles.every((t, i) => t === i);
}

// ─── Single tile ───────────────────────────────────────────────────────────
function PuzzleTile({ tile, size, imgUrl, isSelected, isDragOver, onPointerDown, onPointerEnter, onPointerUp, gridPx }) {
  const tileSize = gridPx / size;
  const col = tile % size;
  const row = Math.floor(tile / size);

  return (
    <motion.div
      className="absolute cursor-grab active:cursor-grabbing rounded-lg overflow-hidden border-2 transition-shadow"
      style={{
        width: tileSize - 4,
        height: tileSize - 4,
        borderColor: isSelected ? C.yellow : isDragOver ? C.green : "white",
        boxShadow: isSelected
          ? `0 0 0 3px ${C.yellow}, 0 8px 24px rgba(0,0,0,0.25)`
          : isDragOver
          ? `0 0 0 3px ${C.green}`
          : "0 2px 8px rgba(0,0,0,0.12)",
        zIndex: isSelected ? 10 : 1,
      }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onPointerDown={onPointerDown}
      onPointerEnter={onPointerEnter}
      onPointerUp={onPointerUp}
    >
      <div
        className="w-full h-full"
        style={{
          backgroundImage: `url(${imgUrl})`,
          backgroundSize: `${size * 100}%`,
          backgroundPosition: `${col * 100 / (size-1)}% ${row * 100 / (size-1)}%`,
          backgroundRepeat: "no-repeat",
        }}
      />
    </motion.div>
  );
}

// ─── Main AnimalPuzzle component ───────────────────────────────────────────
export default function AnimalPuzzle() {
  const [animalIdx, setAnimalIdx]   = useState(0);
  const [gridSize, setGridSize]     = useState(3);
  const [tiles, setTiles]           = useState(() => buildPuzzle(3));
  const [selected, setSelected]     = useState(null);
  const [dragOver, setDragOver]     = useState(null);
  const [won, setWon]               = useState(false);
  const [confetti, setConfetti]     = useState(false);
  const [lang, setLang]             = useState("es");
  const [moves, setMoves]           = useState(0);
  const [imgLoaded, setImgLoaded]   = useState(false);
  const GRID_PX = 288; // pixels for the grid container

  const animal = ANIMALS[animalIdx];

  const reset = useCallback((aIdx = animalIdx, gSize = gridSize) => {
    setTiles(buildPuzzle(gSize));
    setSelected(null);
    setDragOver(null);
    setWon(false);
    setMoves(0);
    setImgLoaded(false);
  }, [animalIdx, gridSize]);

  useEffect(() => { reset(animalIdx, gridSize); }, [animalIdx, gridSize]);

  const handleTileDown = (idx) => {
    if (won) return;
    if (selected === null) {
      setSelected(idx);
    } else {
      // Swap
      const newTiles = [...tiles];
      [newTiles[selected], newTiles[idx]] = [newTiles[idx], newTiles[selected]];
      setTiles(newTiles);
      setMoves(m => m+1);
      setSelected(null);
      setDragOver(null);
      if (isSolved(newTiles)) {
        setTimeout(() => { setWon(true); setConfetti(true); setTimeout(()=>setConfetti(false),2500); }, 200);
      }
    }
  };

  const prevAnimal = () => setAnimalIdx(i => (i-1+ANIMALS.length)%ANIMALS.length);
  const nextAnimal = () => setAnimalIdx(i => (i+1)%ANIMALS.length);

  const tileSize = GRID_PX / gridSize;

  return (
    <div className="min-h-screen" style={{ background:"linear-gradient(150deg,#E8F5E9 0%,#FFFDE7 50%,#E3F2FD 100%)" }}>
      <Confetti active={confetti} />

      {/* Header */}
      <div className="text-center py-10 px-4">
        <motion.div initial={{ scale:0.8,opacity:0 }} animate={{ scale:1,opacity:1 }} transition={{ type:"spring" }}
          className="text-6xl mb-3 inline-block"
        >🧩</motion.div>
        <motion.h1 initial={{ opacity:0,y:-12 }} animate={{ opacity:1,y:0 }}
          className="font-display text-4xl md:text-5xl mb-2" style={{ color:C.green }}
        >Animal Puzzle</motion.h1>
        <p className="font-body text-slate-500 text-lg">Tap two pieces to swap them — build the animal! 🎨</p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap justify-center gap-3 px-4 mb-6">
        {/* Grid size */}
        <div className="flex bg-white/80 rounded-full p-1 shadow-sm gap-1">
          {[3,4].map(s => (
            <button key={s} onClick={() => setGridSize(s)}
              className="px-5 py-2 rounded-full font-display text-sm transition-all"
              style={{ background:gridSize===s?C.green:"transparent", color:gridSize===s?"white":"#6B7280" }}
            >{s}×{s}</button>
          ))}
        </div>

        {/* Lang picker */}
        <div className="flex bg-white/80 rounded-full p-1 shadow-sm gap-1">
          {Object.entries(LANG_LABELS).map(([code, flag]) => (
            <button key={code} onClick={() => setLang(code)}
              className="px-3 py-2 rounded-full font-display text-sm transition-all"
              style={{ background:lang===code?C.blue:"transparent", color:lang===code?"white":"#6B7280" }}
            >{flag} {LANG_NAMES[code]}</button>
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pb-20">
        <div className="grid md:grid-cols-2 gap-8 items-start">

          {/* Left: Puzzle */}
          <div className="flex flex-col items-center">
            {/* Animal navigator */}
            <div className="flex items-center gap-4 mb-5 bg-white/80 rounded-full px-5 py-3 shadow-sm">
              <motion.button whileHover={{ scale:1.1 }} whileTap={{ scale:0.9 }} onClick={prevAnimal}
                className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background:C.green, color:"white" }}
              ><ChevronLeft size={18}/></motion.button>

              <div className="text-center">
                <div className="font-display text-xl" style={{ color:C.green }}>{animal.emoji} {animal.name}</div>
                <div className="font-body text-sm text-slate-400" dir={lang==="ar"?"rtl":"ltr"}>{animal[lang]}</div>
              </div>

              <motion.button whileHover={{ scale:1.1 }} whileTap={{ scale:0.9 }} onClick={nextAnimal}
                className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background:C.green, color:"white" }}
              ><ChevronRight size={18}/></motion.button>
            </div>

            {/* Stats */}
            <div className="flex gap-3 mb-4">
              <div className="px-4 py-2 bg-white rounded-full font-display text-sm shadow-sm" style={{ color:C.green }}>
                🎯 {moves} swaps
              </div>
              {won && (
                <motion.div initial={{ scale:0 }} animate={{ scale:1 }}
                  className="px-4 py-2 rounded-full font-display text-sm text-white shadow-lg"
                  style={{ background:C.green }}
                >🏆 Solved!</motion.div>
              )}
            </div>

            {/* Win banner */}
            <AnimatePresence>
              {won && (
                <motion.div initial={{ opacity:0,y:-10 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0 }}
                  className="w-full text-center py-4 rounded-3xl font-display text-xl text-white mb-4 shadow-lg"
                  style={{ background:`linear-gradient(135deg,${C.green},#1B5E20)` }}
                >
                  🎉 You built the {animal.name}! Amazing!
                </motion.div>
              )}
            </AnimatePresence>

            {/* Puzzle grid */}
            <div
              className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white"
              style={{ width:GRID_PX, height:GRID_PX, background:C.blueSoft }}
            >
              {/* Hidden preload image */}
              <img src={animal.img} alt="" className="hidden" onLoad={()=>setImgLoaded(true)} />

              {!imgLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div animate={{ rotate:360 }} transition={{ duration:1,repeat:Infinity,ease:"linear" }}
                    className="text-4xl"
                  >{animal.emoji}</motion.div>
                </div>
              )}

              {imgLoaded && (
                <div
                  className="grid gap-0.5 p-0.5"
                  style={{ gridTemplateColumns:`repeat(${gridSize},1fr)`, width:"100%", height:"100%", background:"#CBD5E1" }}
                >
                  {tiles.map((tile, idx) => {
                    const col = idx % gridSize;
                    const row = Math.floor(idx / gridSize);
                    const srcCol = tile % gridSize;
                    const srcRow = Math.floor(tile / gridSize);
                    const isSelected = selected === idx;
                    const isDragOver = dragOver === idx;

                    return (
                      <motion.div
                        key={idx}
                        className="relative cursor-pointer overflow-hidden rounded-sm border-2 transition-all"
                        style={{
                          borderColor: isSelected ? C.yellow : isDragOver ? C.green : "transparent",
                          boxShadow: isSelected
                            ? `0 0 0 2px ${C.yellow}, 0 4px 16px rgba(0,0,0,0.3)`
                            : "none",
                          zIndex: isSelected ? 10 : 1,
                        }}
                        whileHover={{ scale: won ? 1 : 1.04 }}
                        whileTap={{ scale: won ? 1 : 0.95 }}
                        onClick={() => handleTileDown(idx)}
                        onMouseEnter={() => { if (selected !== null && selected !== idx) setDragOver(idx); }}
                        onMouseLeave={() => setDragOver(null)}
                      >
                        <div
                          className="w-full h-full"
                          style={{
                            backgroundImage: `url(${animal.img})`,
                            backgroundSize: `${gridSize * 100}%`,
                            backgroundPosition: `${srcCol * 100 / Math.max(gridSize-1,1)}% ${srcRow * 100 / Math.max(gridSize-1,1)}%`,
                            backgroundRepeat: "no-repeat",
                            aspectRatio: "1",
                          }}
                        />
                        {/* Tile number hint (subtle) */}
                        {!won && (
                          <div className="absolute bottom-0.5 right-0.5 w-4 h-4 rounded-full flex items-center justify-center text-white font-display"
                            style={{ background:"rgba(0,0,0,0.25)", fontSize:9 }}
                          >{tile+1}</div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Reference image (small) */}
            <div className="mt-4 flex items-center gap-3">
              <div className="rounded-2xl overflow-hidden border-2 border-white shadow-md" style={{ width:64,height:64 }}>
                <img src={animal.img} alt={animal.name} className="w-full h-full object-cover"/>
              </div>
              <p className="font-body text-xs text-slate-400">Reference image</p>
            </div>

            {/* Reset */}
            <motion.button whileHover={{ scale:1.04 }} whileTap={{ scale:0.96 }}
              onClick={() => reset()}
              className="mt-4 flex items-center gap-2 px-6 py-3 rounded-2xl font-display text-white shadow-md"
              style={{ background:C.red }}
            ><RotateCcw size={16}/> Shuffle</motion.button>
          </div>

          {/* Right: Info panel */}
          <div className="space-y-4">
            <h3 className="font-display text-2xl" style={{ color:C.green }}>
              {animal.emoji} {animal.name}
            </h3>

            {/* Translations card */}
            <div className="bg-white/90 rounded-3xl p-6 shadow-md border-2 border-white">
              <h4 className="font-display text-base mb-3 text-slate-500">How to say it</h4>
              {Object.entries({ es:"Español 🇪🇸", fr:"Français 🇫🇷", ar:"العربية 🇸🇦" }).map(([code, label]) => (
                <div key={code} className="flex items-center justify-between py-2.5 border-b border-slate-100 last:border-0">
                  <span className="font-body text-sm text-slate-400">{label}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-display text-lg" style={{ color:C.blue }} dir={code==="ar"?"rtl":"ltr"}>
                      {animal[code]}
                    </span>
                    <button onClick={() => speak(animal[code], VOICE_LANG[code])}
                      className="w-7 h-7 rounded-full flex items-center justify-center"
                      style={{ background:C.blueSoft, color:C.blue }}
                    ><Volume2 size={13}/></button>
                  </div>
                </div>
              ))}
              <div className="flex items-center justify-between pt-2.5">
                <span className="font-body text-sm text-slate-400">English 🇬🇧</span>
                <div className="flex items-center gap-2">
                  <span className="font-display text-lg" style={{ color:C.blue }}>{animal.name}</span>
                  <button onClick={() => speak(animal.name, "en-US")}
                    className="w-7 h-7 rounded-full flex items-center justify-center"
                    style={{ background:C.blueSoft, color:C.blue }}
                  ><Volume2 size={13}/></button>
                </div>
              </div>
            </div>

            {/* Fun fact */}
            <div className="rounded-3xl p-5 border-2 border-white shadow-sm" style={{ background:C.yellowSoft }}>
              <div className="font-display text-sm mb-1" style={{ color:C.yellow }}>🌟 Fun fact!</div>
              <p className="font-body text-slate-600 text-sm leading-relaxed">{animal.fact}</p>
            </div>

            {/* Animal gallery thumbnails */}
            <div>
              <h4 className="font-display text-base mb-3" style={{ color:C.green }}>More animals</h4>
              <div className="grid grid-cols-4 gap-2">
                {ANIMALS.map((a, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale:1.08 }}
                    whileTap={{ scale:0.94 }}
                    onClick={() => setAnimalIdx(i)}
                    className="aspect-square rounded-2xl overflow-hidden border-3 transition-all"
                    style={{
                      border: animalIdx===i ? `3px solid ${C.green}` : "3px solid white",
                      boxShadow: animalIdx===i ? `0 0 0 2px ${C.green}` : "0 2px 8px rgba(0,0,0,0.08)",
                    }}
                  >
                    <img src={a.img} alt={a.name} className="w-full h-full object-cover"/>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* How to play */}
            <div className="rounded-3xl p-4 border-2 border-white shadow-sm" style={{ background:C.blueSoft }}>
              <p className="font-display text-sm mb-1" style={{ color:C.blue }}>How to play</p>
              <p className="font-body text-xs text-slate-600">
                Tap a piece to select it (it glows yellow), then tap another piece to swap them. Keep swapping until you build the complete animal photo! Numbers in the corner show you which piece it is.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
