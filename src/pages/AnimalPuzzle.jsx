/**
 * src/pages/AnimalPuzzle.jsx — Kiddsy
 * ─────────────────────────────────────────────────────────────────────────
 * Sticker-puzzle: each tile clips a portion of the large inline SVG / icon.
 * Zero external images — instant load, pixel-perfect on iPad.
 */
import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, ChevronLeft, ChevronRight, Volume2, Puzzle } from "lucide-react";
import { getAnimalConfig, StickerBadge } from "../components/KiddsyIcons.jsx";

const C = {
  blue:"#1565C0", blueSoft:"#E3F2FD", red:"#E53935",
  yellow:"#F9A825", yellowSoft:"#FFFDE7",
  green:"#43A047",  magenta:"#D81B60", cyan:"#00ACC1",
};
const SPRING = { type:"spring", stiffness:380, damping:16 };

const ANIMALS = [
  { name:"Lion",     es:"León",       fr:"Lion",        ar:"أسد",          fact:"Lions can sleep 20 hours a day!" },
  { name:"Elephant", es:"Elefante",   fr:"Éléphant",    ar:"فيل",          fact:"Largest land animal on Earth!" },
  { name:"Penguin",  es:"Pingüino",   fr:"Manchot",     ar:"بطريق",        fact:"Can't fly but amazing swimmers!" },
  { name:"Giraffe",  es:"Jirafa",     fr:"Girafe",      ar:"زرافة",        fact:"Tallest animals — up to 6 metres!" },
  { name:"Tiger",    es:"Tigre",      fr:"Tigre",       ar:"نمر",          fact:"No two tigers have the same stripes!" },
  { name:"Dolphin",  es:"Delfín",     fr:"Dauphin",     ar:"دلفين",        fact:"They call each other by name!" },
  { name:"Panda",    es:"Panda",      fr:"Panda",       ar:"الباندا",      fact:"Eats 40 kg of bamboo a day!" },
  { name:"Parrot",   es:"Loro",       fr:"Perroquet",   ar:"ببغاء",        fact:"Can learn hundreds of words!" },
  { name:"Zebra",    es:"Cebra",      fr:"Zèbre",       ar:"حمار وحشي",   fact:"Every zebra has unique stripes!" },
  { name:"Owl",      es:"Búho",       fr:"Hibou",       ar:"بومة",         fact:"Can rotate head 270 degrees!" },
  { name:"Fox",      es:"Zorro",      fr:"Renard",      ar:"ثعلب",         fact:"Uses Earth's magnetic field to hunt!" },
  { name:"Koala",    es:"Koala",      fr:"Koala",       ar:"كوالا",        fact:"Sleeps 22 hours a day!" },
  { name:"Flamingo", es:"Flamenco",   fr:"Flamant rose",ar:"نحام",         fact:"Pink because of the food they eat!" },
  { name:"Bear",     es:"Oso",        fr:"Ours",        ar:"دب",           fact:"Can smell food from 32 km away!" },
  { name:"Cheetah",  es:"Guepardo",   fr:"Guépard",     ar:"الفهد",        fact:"Fastest land animal — 112 km/h!" },
  { name:"Turtle",   es:"Tortuga",    fr:"Tortue",      ar:"سلحفاة",       fact:"Some live for 100+ years!" },
  { name:"Wolf",     es:"Lobo",       fr:"Loup",        ar:"ذئب",          fact:"Howl to communicate across km!" },
  { name:"Frog",     es:"Rana",       fr:"Grenouille",  ar:"ضفدع",         fact:"A group of frogs is called an army!" },
  { name:"Horse",    es:"Caballo",    fr:"Cheval",      ar:"حصان",         fact:"Can sleep standing up!" },
  { name:"Peacock",  es:"Pavo real",  fr:"Paon",        ar:"طاووس",        fact:"Only males have those tail feathers!" },
  { name:"Octopus",  es:"Pulpo",      fr:"Pieuvre",     ar:"أخطبوط",       fact:"Three hearts and blue blood!" },
  { name:"Eagle",    es:"Águila",     fr:"Aigle",       ar:"نسر",          fact:"Spots prey from 3 km away!" },
  { name:"Rabbit",   es:"Conejo",     fr:"Lapin",       ar:"أرنب",         fact:"Their teeth never stop growing!" },
  { name:"Shark",    es:"Tiburón",    fr:"Requin",      ar:"قرش",          fact:"On Earth for 450 million years!" },
  { name:"Monkey",   es:"Mono",       fr:"Singe",       ar:"قرد",          fact:"Use 30+ sounds to communicate!" },
];

const LANG_NAMES  = { es:"Español 🇪🇸", fr:"Français 🇫🇷", ar:"العربية 🇸🇦" };
const VOICE_LANG  = { es:"es-ES", fr:"fr-FR", ar:"ar-SA" };
const GALLERY_PER_PAGE = 8;
const GRID_PX  = 296;   // puzzle grid width/height in px

function buildPuzzle(size) {
  const tiles = Array.from({ length: size * size }, (_, i) => i);
  for (let i = tiles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
  }
  return tiles;
}

// ——— PuzzleTile: Ahora usa fotos reales de Unsplash ———
function Confetti({ active }) {
  const ps = Array.from({ length: 26 }, (_, i) => ({
    id:i, x:Math.random()*100, delay:Math.random()*.5, size:Math.random()*10+7,
    color:["#F9A825","#E53935","#43A047","#1565C0","#D81B60","#00ACC1"][i%6],
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

function speak(text, lang="en-US") {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang=lang; u.rate=0.85; u.pitch=1.1;
  window.speechSynthesis.speak(u);
}

// ─── PuzzleTile: clips a portion of the full-size SVG illustration ────────
function PuzzleTile({ tile, gridSize, Render, animalColor, isSelected, isDragOver, onClick, onEnter, onLeave }) {
  const cellPx  = GRID_PX / gridSize;
  const srcCol  = tile % gridSize;
  const srcRow  = Math.floor(tile / gridSize);
  // The rendered SVG size and how much to offset it
  const svgSize = GRID_PX * 0.94;
  const padSide = (GRID_PX - svgSize) / 2;
  const offX    = -(srcCol * cellPx) + padSide;
  const offY    = -(srcRow * cellPx) + padSide;

  const border = isSelected ? `3px solid ${C.yellow}` : isDragOver ? `3px solid ${C.green}` : "2.5px solid rgba(255,255,255,0.85)";
  const shadow = isSelected
    ? `0 0 0 3px ${C.yellow}, 0 8px 24px rgba(0,0,0,0.28)`
    : isDragOver ? `0 0 0 3px ${C.green}` : `0 3px 12px rgba(0,0,0,0.13)`;

  return (
    <motion.div
      onClick={onClick}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      whileTap={{ scale: 0.93 }}
      style={{
        width:        cellPx,
        height:       cellPx,
        overflow:     "hidden",
        position:     "relative",
        borderRadius: Math.round(cellPx * 0.14),
        border,
        boxShadow:    shadow,
        cursor:       "pointer",
        background:   animalColor + "18",
        zIndex:       isSelected ? 8 : 1,
        flexShrink:   0,
      }}
    >
      {/* The big illustration, shifted to show only this slice */}
      <div style={{
        position:   "absolute",
        left:       offX,
        top:        offY,
        width:      svgSize,
        height:     svgSize,
        pointerEvents: "none",
      }}>
        <Render size={svgSize} color={animalColor} />
      </div>
      {/* Subtle tile-number hint */}
      <div style={{
        position:  "absolute", bottom:3, right:3,
        width:15, height:15, borderRadius:"50%",
        background:"rgba(0,0,0,0.28)", display:"flex",
        alignItems:"center", justifyContent:"center",
        fontSize:8, color:"white", fontFamily:"system-ui",
        pointerEvents:"none",
      }}>{tile+1}</div>
    </motion.div>
  );
}


// ─── Gallery thumbnail ─────────────────────────────────────────────────────
function AnimalThumb({ animal, isActive, onClick }) {
  const { Render, color, bg } = getAnimalConfig(animal.name);
  return (
    <motion.button
      onClick={onClick}
      title={animal.name}
      whileHover={{ scale: 1.12, y: -3 }}
      whileTap={{ scale: 0.90 }}
      transition={SPRING}
      style={{
        aspectRatio:    "1",
        borderRadius:   "50%",
        overflow:       "hidden",
        background:     isActive ? bg : color + "12",
        border:         isActive ? `3.5px solid ${color}` : "2.5px solid white",
        boxShadow:      isActive ? `0 0 0 2.5px ${color}55, 0 6px 18px ${color}40` : "0 2px 8px rgba(0,0,0,0.10)",
        display:        "flex",
        alignItems:     "center",
        justifyContent: "center",
        padding:        5,
        cursor:         "pointer",
      }}
    >
      <Render size={34} color={color} />
    </motion.button>
  );
}

// ─── Main ──────────────────────────────────────────────────────────────────
export default function AnimalPuzzle() {
  const [animalIdx,  setAnimalIdx]  = useState(0);
  const [gridSize,   setGridSize]   = useState(3);
  const [tiles,      setTiles]      = useState(() => buildPuzzle(3));
  const [selected,   setSelected]   = useState(null);
  const [dragOver,   setDragOver]   = useState(null);
  const [won,        setWon]        = useState(false);
  const [confetti,   setConfetti]   = useState(false);
  const [lang,       setLang]       = useState("es");
  const [moves,      setMoves]      = useState(0);
  const [galPage,    setGalPage]    = useState(0);

  const animal   = ANIMALS[animalIdx];
  const { Render, color, bg } = getAnimalConfig(animal.name);
  const cellPx   = GRID_PX / gridSize;
  const totalPages = Math.ceil(ANIMALS.length / GALLERY_PER_PAGE);
  const galSlice   = ANIMALS.slice(galPage * GALLERY_PER_PAGE, (galPage + 1) * GALLERY_PER_PAGE);

  const reset = useCallback(() => {
    setTiles(buildPuzzle(gridSize));
    setSelected(null); setDragOver(null); setWon(false); setMoves(0);
  }, [gridSize]);

  useEffect(() => { reset(); }, [animalIdx, gridSize]);

  const handleClick = (idx) => {
    if (won) return;
    if (selected === null) { setSelected(idx); return; }
    const next = [...tiles];
    [next[selected], next[idx]] = [next[idx], next[selected]];
    setTiles(next); setMoves(m => m+1); setSelected(null); setDragOver(null);
    if (next.every((t,i) => t === i))
      setTimeout(() => { setWon(true); setConfetti(true); setTimeout(() => setConfetti(false), 2600); }, 200);
  };

  return (
    <div className="min-h-screen" style={{ background:"linear-gradient(155deg,#E8F5E9 0%,#FFFDE7 55%,#E3F2FD 100%)" }}>
      <Confetti active={confetti}/>

      {/* ── Header ── */}
      <div className="text-center py-10 px-4">
        <motion.div
          initial={{ scale:0.7, opacity:0 }} animate={{ scale:1, opacity:1 }} transition={{ type:"spring", stiffness:220 }}
          className="inline-block mb-4"
        >
          <StickerBadge icon={Puzzle} color={C.green} size={68} noHover/>
        </motion.div>
        <motion.h1 initial={{ opacity:0,y:-14 }} animate={{ opacity:1,y:0 }}
          className="font-display text-4xl md:text-5xl mb-2" style={{ color:C.green }}
        >Animal Puzzle</motion.h1>
        <p className="font-body text-slate-500 text-lg">Tap two pieces to swap — build the animal! 🎨</p>
        <p className="font-body text-slate-400 text-sm mt-1">{ANIMALS.length} animals to discover</p>
      </div>

      {/* ── Controls ── */}
      <div className="flex flex-wrap justify-center gap-3 px-4 mb-6">
        {/* Grid size */}
        <div className="flex bg-white/80 backdrop-blur rounded-full p-1 shadow-sm gap-1 border border-white">
          {[3,4].map(s => (
            <button key={s} onClick={() => setGridSize(s)}
              className="px-5 py-2 rounded-full font-display text-sm transition-all"
              style={{ background:gridSize===s?C.green:"transparent", color:gridSize===s?"white":"#6B7280" }}
            >{s}×{s}</button>
          ))}
        </div>
        {/* Lang */}
        <div className="flex bg-white/80 backdrop-blur rounded-full p-1 shadow-sm gap-1 border border-white">
          {Object.entries(LANG_NAMES).map(([code, label]) => (
            <button key={code} onClick={() => setLang(code)}
              className="px-3 py-2 rounded-full font-display text-xs transition-all"
              style={{ background:lang===code?C.blue:"transparent", color:lang===code?"white":"#6B7280" }}
            >{label}</button>
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pb-24">
        <div className="grid md:grid-cols-2 gap-8 items-start">

          {/* ── LEFT: Puzzle ── */}
          <div className="flex flex-col items-center">
            {/* Animal navigator */}
            <div className="flex items-center gap-4 mb-5 bg-white/80 backdrop-blur rounded-full px-5 py-3 shadow-md border border-white">
              <motion.button whileHover={{ scale:1.14 }} whileTap={{ scale:0.88 }} onClick={() => { setAnimalIdx(i => (i-1+ANIMALS.length)%ANIMALS.length); setGalPage(0); }}
                className="w-9 h-9 rounded-full flex items-center justify-center shadow-sm"
                style={{ background:C.green, color:"white" }}
              ><ChevronLeft size={20}/></motion.button>

              <div className="text-center min-w-[130px]">
                {/* Mini sticker icon in navigator */}
                <motion.div
                  key={animalIdx}
                  initial={{ scale:0.7, opacity:0 }} animate={{ scale:1, opacity:1 }} transition={SPRING}
                  className="flex justify-center mb-1"
                >
                  <div style={{
                    width:36, height:36, borderRadius:"50%",
                    background: bg, border:"2.5px solid white",
                    boxShadow:`0 4px 14px ${color}40`,
                    display:"flex", alignItems:"center", justifyContent:"center",
                  }}>
                    <Render size={24} color={color}/>
                  </div>
                </motion.div>
                <div className="font-display text-base" style={{ color:C.green }}>{animal.name}</div>
                <div className="font-body text-sm text-slate-400" dir={lang==="ar"?"rtl":"ltr"}>{animal[lang]}</div>
                <div className="font-body text-xs text-slate-300">{animalIdx+1} / {ANIMALS.length}</div>
              </div>

              <motion.button whileHover={{ scale:1.14 }} whileTap={{ scale:0.88 }} onClick={() => { setAnimalIdx(i => (i+1)%ANIMALS.length); setGalPage(0); }}
                className="w-9 h-9 rounded-full flex items-center justify-center shadow-sm"
                style={{ background:C.green, color:"white" }}
              ><ChevronRight size={20}/></motion.button>
            </div>

            {/* Stats */}
            <div className="flex gap-3 mb-4">
              <div className="px-4 py-2 bg-white/90 backdrop-blur rounded-full font-display text-sm shadow-sm border border-white" style={{ color:C.green }}>
                🎯 {moves} swaps
              </div>
              {won && (
                <motion.div initial={{ scale:0 }} animate={{ scale:1 }} transition={SPRING}
                  className="px-4 py-2 rounded-full font-display text-sm text-white shadow-lg" style={{ background:C.green }}
                >🏆 Solved!</motion.div>
              )}
            </div>

            <AnimatePresence>
              {won && (
                <motion.div initial={{ opacity:0, y:-12 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
                  className="w-full text-center py-4 rounded-3xl font-display text-xl text-white mb-4 shadow-xl"
                  style={{ background:`linear-gradient(135deg,${C.green},#1B5E20)` }}
                >🎉 You built the {animal.name}! Amazing!</motion.div>
              )}
            </AnimatePresence>

            {/* ── THE PUZZLE GRID ── */}
            <div style={{
              display:             "grid",
              gridTemplateColumns: `repeat(${gridSize},${cellPx}px)`,
              gap:                 3,
              padding:             3,
              background:          "#CBD5E1",
              borderRadius:        24,
              border:              "4px solid white",
              boxShadow:           `0 20px 60px ${color}30, 0 6px 20px rgba(0,0,0,0.14)`,
            }}>
              {tiles.map((tile, idx) => (
                <PuzzleTile
                  key={idx}
                  tile={tile}
                  gridSize={gridSize}
                  animalName={animal.name}
                  Render={Render}
                  animalColor={color}
                  isSelected={selected===idx}
                  isDragOver={dragOver===idx}
                  onClick={() => handleClick(idx)}
                  onEnter={() => { if (selected!==null && selected!==idx) setDragOver(idx); }}
                  onLeave={() => setDragOver(null)}
                />
              ))}
            </div>

            {/* Reference */}
            <div className="mt-5 flex items-center gap-3">
              <motion.div
                whileHover={{ scale:1.1, rotate:[-3,3,0] }}
                transition={SPRING}
                style={{
                  width:72, height:72, borderRadius:18,
                  background: bg,
                  border:"4px solid white",
                  boxShadow:`0 8px 24px ${color}35`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  cursor:"pointer",
                }}
              >
                <Render size={52} color={color}/>
              </motion.div>
              <p className="font-body text-xs text-slate-400 max-w-[100px]">Target — assemble to match this!</p>
            </div>

            <motion.button whileHover={{ scale:1.05 }} whileTap={{ scale:0.95 }} onClick={reset}
              className="mt-5 flex items-center gap-2 px-7 py-3 rounded-2xl font-display text-white shadow-xl"
              style={{ background:C.red, boxShadow:`0 8px 22px ${C.red}45` }}
            ><RotateCcw size={16}/> Shuffle</motion.button>
          </div>

          {/* ── RIGHT: Info ── */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <motion.div
                key={animalIdx}
                initial={{ scale:0.7, rotate:-15, opacity:0 }}
                animate={{ scale:1, rotate:0, opacity:1 }}
                transition={SPRING}
                style={{
                  width:60, height:60, borderRadius:"50%",
                  background: bg, border:"3.5px solid white",
                  boxShadow:`0 8px 24px ${color}45`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                }}
              >
                <Render size={42} color={color}/>
              </motion.div>
              <h3 className="font-display text-2xl" style={{ color:C.green }}>{animal.name}</h3>
            </div>

            {/* Translations */}
            <div className="bg-white/90 backdrop-blur rounded-3xl p-6 shadow-md border-2 border-white">
              <h4 className="font-display text-base mb-3 text-slate-500">How to say it</h4>
              {Object.entries({ es:"Español 🇪🇸", fr:"Français 🇫🇷", ar:"العربية 🇸🇦" }).map(([code, label]) => (
                <div key={code} className="flex items-center justify-between py-2.5 border-b border-slate-100 last:border-0">
                  <span className="font-body text-sm text-slate-400">{label}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-display text-lg" style={{ color:C.blue }} dir={code==="ar"?"rtl":"ltr"}>{animal[code]}</span>
                    <motion.button whileHover={{ scale:1.16 }} whileTap={{ scale:0.9 }}
                      onClick={() => speak(animal[code], VOICE_LANG[code])}
                      className="w-8 h-8 rounded-full flex items-center justify-center shadow-sm"
                      style={{ background:C.blueSoft, color:C.blue }}
                    ><Volume2 size={14}/></motion.button>
                  </div>
                </div>
              ))}
              <div className="flex items-center justify-between pt-2.5">
                <span className="font-body text-sm text-slate-400">English 🇬🇧</span>
                <div className="flex items-center gap-2">
                  <span className="font-display text-lg" style={{ color:C.blue }}>{animal.name}</span>
                  <motion.button whileHover={{ scale:1.16 }} whileTap={{ scale:0.9 }}
                    onClick={() => speak(animal.name, "en-US")}
                    className="w-8 h-8 rounded-full flex items-center justify-center shadow-sm"
                    style={{ background:C.blueSoft, color:C.blue }}
                  ><Volume2 size={14}/></motion.button>
                </div>
              </div>
            </div>

            {/* Fun fact */}
            <div className="rounded-3xl p-5 border-2 border-white shadow-sm" style={{ background:C.yellowSoft }}>
              <div className="flex items-center gap-2 mb-2">
                <StickerBadge icon={require("lucide-react").Sparkles || (() => null)} color={C.yellow} size={28} noHover/>
                <span className="font-display text-sm" style={{ color:C.yellow }}>Fun fact!</span>
              </div>
              <p className="font-body text-slate-600 text-sm leading-relaxed">{animal.fact}</p>
            </div>

            {/* Gallery */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-display text-sm" style={{ color:C.green }}>All {ANIMALS.length} animals</h4>
                <span className="font-body text-xs text-slate-400">{galPage+1}/{totalPages}</span>
              </div>
              <div className="grid grid-cols-4 gap-2.5">
                {galSlice.map((a, i) => {
                  const realIdx = galPage * GALLERY_PER_PAGE + i;
                  return (
                    <AnimalThumb
                      key={realIdx}
                      animal={a}
                      isActive={animalIdx===realIdx}
                      onClick={() => setAnimalIdx(realIdx)}
                    />
                  );
                })}
              </div>
              <div className="flex items-center gap-2 justify-center mt-3">
                <button onClick={() => setGalPage(p => Math.max(0, p-1))} disabled={galPage===0}
                  className="px-3 py-1.5 rounded-full font-display text-xs bg-white/90 shadow-sm border border-white disabled:opacity-30" style={{ color:C.green }}
                >← Prev</button>
                {Array.from({ length:totalPages }, (_, i) => (
                  <button key={i} onClick={() => setGalPage(i)}
                    className="w-6 h-6 rounded-full font-display text-xs transition-all"
                    style={{ background:i===galPage?C.green:"#E2E8F0", color:i===galPage?"white":"#6B7280" }}
                  >{i+1}</button>
                ))}
                <button onClick={() => setGalPage(p => Math.min(totalPages-1, p+1))} disabled={galPage===totalPages-1}
                  className="px-3 py-1.5 rounded-full font-display text-xs bg-white/90 shadow-sm border border-white disabled:opacity-30" style={{ color:C.green }}
                >Next →</button>
              </div>
            </div>

            {/* How to play */}
            <div className="rounded-3xl p-4 border-2 border-white shadow-sm" style={{ background:C.blueSoft }}>
              <p className="font-display text-sm mb-1" style={{ color:C.blue }}>How to play</p>
              <p className="font-body text-xs text-slate-600">
                Tap a tile to select it (golden glow), then tap another to swap them. Reassemble the picture to win! 🏆
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
