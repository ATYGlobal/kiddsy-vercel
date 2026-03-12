/**
 * src/pages/PuzzleMaster.jsx — Kiddsy
 * Solo UI + estado. Datos → src/data/puzzleMasterData.js
 * Helpers → src/utils/puzzleHelpers.js
 */
import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RotateCcw, Volume2, ChevronDown,
  Globe, Grid, Cat, Building2, Leaf, Landmark,
  Star, Loader, Trophy, Target, CheckCircle, Lock, Puzzle,
} from "lucide-react";
import Pricing         from "../components/Pricing.jsx";
import { PuzzleBg }   from "../components/PageBg.jsx";
import { BubbleTitle } from "../components/KiddsyFont.jsx";
import EmojiSvg        from "../utils/EmojiSvg.jsx";
import CartoonTitle from "../components/CartoonTitle.jsx";

import {
  C, LANGUAGES, DIFFICULTIES,
  ANIMALS, CITIES, NATURE, MONUMENTS, PREMIUM_CATS,
} from "../data/puzzleMasterData.js";

import { buildPuzzle, isSolved, speak } from "../utils/puzzleHelpers.js";

// CATEGORIES aquí porque necesita los iconos de lucide-react
const CATEGORIES = [
  { id:"animals",   label:"Animals",   emoji:"1f981", color:C.green,   icon:Cat,       items:ANIMALS,   premium:false },
  { id:"cities",    label:"Cities",    emoji:"1f3d9", color:C.blue,    icon:Building2, items:CITIES,    premium:true  },
  { id:"nature",    label:"Nature",    emoji:"1f33f", color:"#2E7D32", icon:Leaf,       items:NATURE,    premium:true  },
  { id:"monuments", label:"Monuments", emoji:"1f3db", color:"#6D4C41", icon:Landmark,   items:MONUMENTS, premium:true  },
];

// ── Confetti ──────────────────────────────────────────────────────────────
function Confetti({ active }) {
  const ps = Array.from({ length: 24 }, (_, i) => ({
    id: i, x: Math.random() * 100,
    color: [C.blue, C.red, C.yellow, C.green, C.magenta, C.cyan][i % 6],
    delay: Math.random() * 0.5, size: Math.random() * 10 + 7,
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

// ── Miniatura ─────────────────────────────────────────────────────────────
function Thumb({ item, size = 28, FallbackIcon = Loader }) {
  const [ok, setOk] = useState(false);
  return (
    <div style={{
      width:size, height:size, borderRadius:"50%", overflow:"hidden", flexShrink:0,
      background:(item.color||"#ccc")+"33",
      border:"1.5px solid rgba(0,0,0,0.1)",
      display:"flex", alignItems:"center", justifyContent:"center",
    }}>
      {!ok && <FallbackIcon size={Math.round(size*0.52)} strokeWidth={2} style={{ color:item.color||"#94A3B8" }}/>}
      <img src={item.img} alt={item.name} onLoad={()=>setOk(true)}
        style={{ width:"100%", height:"100%", objectFit:"cover", display:ok?"block":"none" }}
        loading="lazy"
      />
    </div>
  );
}

// ── Dropdown genérico ─────────────────────────────────────────────────────
function DD({ trigger, minW=160, maxH=300, accent=C.green, children }) {
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
        onClick={() => setOpen(o=>!o)}
        style={{
          display:"flex", alignItems:"center", gap:7,
          padding:"9px 14px", borderRadius:999,
          border:"2.5px solid white",
          background:"rgba(255,255,255,0.93)",
          backdropFilter:"blur(8px)",
          boxShadow:`0 4px 14px ${accent}26`,
          cursor:"pointer",
          fontFamily:"var(--font-display,'Nunito',sans-serif)",
          fontWeight:700, fontSize:13, color:accent,
          whiteSpace:"nowrap", minWidth:minW,
          justifyContent:"space-between",
        }}
      >
        {trigger}
        <motion.span animate={{ rotate:open?180:0 }} transition={{ duration:0.18 }}
          style={{ display:"flex", marginLeft:2 }}>
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
              minWidth:Math.max(minW, 210),
              background:"white", borderRadius:16,
              border:`2px solid ${accent}1A`,
              boxShadow:`0 14px 42px ${accent}30`,
              overflow:"hidden", maxHeight:maxH, overflowY:"auto",
              scrollbarWidth:"thin",
            }}
          >
            {children(() => setOpen(false))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Fila de dropdown ──────────────────────────────────────────────────────
function DRow({ active, accent=C.green, onClick, children }) {
  return (
    <button onClick={onClick}
      style={{
        display:"flex", alignItems:"center", gap:9,
        width:"100%", padding:"7px 12px", border:"none",
        background:active?accent+"18":"transparent",
        cursor:"pointer",
        fontFamily:"var(--font-body,'Nunito',sans-serif)",
        fontWeight:active?700:500, fontSize:13,
        color:active?accent:"#374151", textAlign:"left",
        borderLeft:active?`3px solid ${accent}`:"3px solid transparent",
        transition:"background 0.12s",
      }}
      onMouseEnter={e=>{ if(!active) e.currentTarget.style.background="#F9FAF9"; }}
      onMouseLeave={e=>{ if(!active) e.currentTarget.style.background="transparent"; }}
    >
      {children}
      {active && <span style={{ width:5, height:5, borderRadius:"50%", background:accent, marginLeft:"auto", flexShrink:0 }}/>}
    </button>
  );
}

function DHeader({ children }) {
  return (
    <div style={{
      padding:"7px 12px 4px",
      borderBottom:"1.5px solid #F0FFF4",
      fontFamily:"var(--font-display,'Nunito',sans-serif)",
      fontWeight:700, fontSize:9, color:"#9CA3AF",
      letterSpacing:"0.08em", textTransform:"uppercase",
    }}>{children}</div>
  );
}
function StarRow({ count = 1, size = 12, color = "#F9A825" }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 2 }}>
      {[...Array(count)].map((_, i) => (
        <Star key={i} size={size} fill={color} color={color} strokeWidth={0} />
      ))}
    </span>
  );
}
// ════════════════════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ════════════════════════════════════════════════════════════════════════════
export default function PuzzleMaster({ lang:propLang, onLangChange }) {
  // ── Estados ───────────────────────────────────────────────────────────
  const [catId,          setCatId]          = useState("animals");
  const [showPricing,    setShowPricing]    = useState(false);
  const [lockedCatLabel, setLockedCatLabel] = useState(null);
  const [itemIdx,        setItemIdx]        = useState(0);
  const [gridSize,       setGridSize]       = useState(3);
  const [tiles,          setTiles]          = useState(() => buildPuzzle(3));
  const [selected,       setSelected]       = useState(null);
  const [dragOver,       setDragOver]       = useState(null);
  const [won,            setWon]            = useState(false);
  const [confetti,       setConfetti]       = useState(false);
  const [localLang,      setLocalLang]      = useState("es");
  const [moves,          setMoves]          = useState(0);
  const [imgLoaded,      setImgLoaded]      = useState(false);

  const lang    = propLang || localLang;
  const setLang = v => { setLocalLang(v); onLangChange?.(v); };

  const cat      = CATEGORIES.find(c => c.id === catId) || CATEGORIES[0];
  const item     = cat.items[itemIdx] || cat.items[0];
  const langMeta = LANGUAGES.find(l => l.code === lang) || LANGUAGES[0];
  const diff     = DIFFICULTIES.find(d => d.size === gridSize) || DIFFICULTIES[0];
  const GRID_PX  = gridSize <= 4 ? 300 : 360;
  const teaserLangs = LANGUAGES.filter(l => l.code !== lang && l.code !== "en").slice(0, 3);

  // ── Shuffle / reset ───────────────────────────────────────────────────
  const reset = useCallback((gSize = gridSize) => {
    setTiles(buildPuzzle(gSize));
    setSelected(null); setDragOver(null);
    setWon(false); setMoves(0); setImgLoaded(false);
  }, [gridSize]);

  useEffect(() => { reset(gridSize); }, [itemIdx, catId, gridSize]);

  // ── Tile swap logic ───────────────────────────────────────────────────
  const handleTile = idx => {
    if (won) return;
    if (selected === null) { setSelected(idx); return; }
    const next = [...tiles];
    [next[selected], next[idx]] = [next[idx], next[selected]];
    setTiles(next); setMoves(m => m + 1);
    setSelected(null); setDragOver(null);
    if (isSolved(next)) {
      setTimeout(() => {
        setWon(true); setConfetti(true);
        setTimeout(() => setConfetti(false), 2500);
      }, 200);
    }
  };

  // ── Category / item switching (with premium gate) ─────────────────────
  const switchCat = (id, close) => {
    if (PREMIUM_CATS.has(id)) {
      const found = CATEGORIES.find(c => c.id === id);
      setLockedCatLabel(found?.label ?? id);
      setShowPricing(true);
      close();
      return;
    }
    setCatId(id); setItemIdx(0); setImgLoaded(false); close();
  };
  const switchItem = (idx, close) => {
    setItemIdx(idx); setImgLoaded(false); close();
  };

  const accent = cat.color;

  // ── RENDER ────────────────────────────────────────────────────────────
return (
  <div className="relative min-h-screen overflow-hidden">
    {/* Fondo temático Safari (Jirafa, Elefante, Palmeras) */}
    <PuzzleBg />

    <Confetti active={confetti}/>

    {/* Pricing modal */}
    {showPricing && (
      <Pricing
        onClose={() => { setShowPricing(false); setLockedCatLabel(null); }}
        lockedCategory={lockedCatLabel}
      />
    )}

    {/* Contenido (z-10 para flotar sobre el safari) */}
    <div className="relative z-10">
      
      {/* Header opcional si quieres que el título aparezca arriba del todo */}
      <div className="text-center py-8 px-4">
        <h1 style={{ lineHeight: 1.2 }}>
          <BubbleTitle color="#059669" size={54}>
            Picture Puzzle
          </BubbleTitle>
        </h1>
        <p className="font-display text-slate-700 mt-2 font-medium bg-white/30 backdrop-blur-sm inline-block px-4 py-1 rounded-full">
          Solve the mystery of the pieces!
        </p>
      </div>

      {/* ── Header ────────────────────────────────────────────────────── */}
      <div className="text-center pt-8 pb-3 px-4">
        <motion.div initial={{ scale:0.8, opacity:0 }} animate={{ scale:1, opacity:1 }}
          transition={{ type:"spring" }}
          className="mb-2 inline-flex items-center justify-center w-16 h-16 rounded-2xl"
          style={{ background:"#E8F5E9" }}
        >
          <Puzzle size={36} strokeWidth={2} style={{ color:accent }}/>
        </motion.div>
        <motion.h1 initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }}
          className="mb-1" style={{ lineHeight:1 }}>
          <CartoonTitle fill={accent} stroke={`${accent}44`} size={40}>
            Puzzle Master
          </CartoonTitle>
        </motion.h1>
        <p className="font-body text-slate-400 text-sm">
          Tap two tiles to swap — complete the picture!
        </p>
      </div>

      {/* ── Controls bar ──────────────────────────────────────────────── */}
      <div style={{ display:"flex", flexWrap:"wrap", justifyContent:"center", gap:8, padding:"0 12px 14px" }}>

        {/* A: Categoría */}
        <DD minW={150} maxH={280} accent={accent}
          trigger={(() => {
            const CatIcon = cat.icon;
            return <><CatIcon size={15} strokeWidth={2}/><span>{cat.label}</span></>;
          })()}
        >
          {close => [
            <DHeader key="hdr">Category</DHeader>,
            ...CATEGORIES.map(c => (
              <DRow key={c.id} active={catId === c.id} accent={c.color}
                onClick={() => switchCat(c.id, close)}>
                {(() => { const CIcon = c.icon; return (
                  <CIcon size={16} strokeWidth={2}
                    style={{ flexShrink:0, color: catId===c.id ? c.color : "#64748B" }}/>
                ); })()}
                <span style={{ fontWeight:700 }}>{c.label}</span>
                {c.premium
                  ? <Lock size={12} strokeWidth={2.5} style={{ marginLeft:"auto", color:"#94A3B8" }}/>
                  : <span style={{ fontSize:10, color:"#94A3B8", marginLeft:"auto" }}>{c.items.length}</span>
                }
              </DRow>
            )),
          ]}
        </DD>

        {/* B: Ítem */}
        <DD minW={190} maxH={360} accent={accent}
          trigger={(() => {
            const CatIcon = cat.icon;
            return (
              <>
                <Thumb item={item} size={24} FallbackIcon={CatIcon}/>
                <span style={{ maxWidth:120, overflow:"hidden", textOverflow:"ellipsis" }}>
                  {item[lang] || item.name}
                </span>
              </>
            );
          })()}
        >
          {close => [
            <DHeader key="hdr">{cat.label} ({cat.items.length})</DHeader>,
            ...cat.items.map((it, i) => (
              <DRow key={i} active={itemIdx === i} accent={accent}
                onClick={() => switchItem(i, close)}>
                <Thumb item={it} size={28} FallbackIcon={cat.icon}/>
                <div style={{ lineHeight:1.3, minWidth:0 }}>
                  <div style={{ fontWeight:700, fontSize:13, whiteSpace:"nowrap" }}>
                    {it[lang] || it.name}
                  </div>
                  {it[lang] && it[lang] !== it.name && (
                    <div style={{ fontSize:10, color:"#94A3B8" }}>{it.name}</div>
                  )}
                </div>
              </DRow>
            )),
          ]}
        </DD>

        {/* C: Dificultad */}
        <DD minW={140} accent={C.red}
          trigger={<><Grid size={13} strokeWidth={2}/><span>{diff.label}</span><StarRow count={diff.starCount} size={10}/></>}
        >
          {close => [
            <DHeader key="hdr">Difficulty</DHeader>,
            ...DIFFICULTIES.map(d => (
              <DRow key={d.size} active={gridSize === d.size} accent={C.red}
                onClick={() => { setGridSize(d.size); close(); }}>
                <span style={{ fontWeight:800, minWidth:36, fontSize:14 }}>{d.label}</span>
                <StarRow count={d.starCount} size={10} color={gridSize === d.size ? "#E53935" : "#F9A825"}/>
                <span style={{ fontSize:11, color:"#94A3B8" }}>{d.desc}</span>
              </DRow>
            )),
          ]}
        </DD>

        {/* D: Idioma */}
        <DD minW={150} accent={C.blue}
          trigger={<><Globe size={13}/><span style={{ fontSize:15 }}>{langMeta.flag}</span><span>{langMeta.label}</span></>}
        >
          {close => [
            <DHeader key="hdr">Language</DHeader>,
            ...LANGUAGES.map(l => (
              <DRow key={l.code} active={lang === l.code} accent={C.blue}
                onClick={() => { setLang(l.code); close(); }}>
                <span style={{ fontSize:16, flexShrink:0 }}><EmojiSvg code={l.flagCode} size={16} /></span>
                <span>{l.label}</span>
              </DRow>
            )),
          ]}
        </DD>

        {/* E: Shuffle */}
        <motion.button whileHover={{ scale:1.04 }} whileTap={{ scale:0.96 }}
          onClick={() => reset()}
          style={{
            display:"flex", alignItems:"center", gap:5,
            padding:"9px 16px", borderRadius:999,
            border:"2.5px solid white", background:C.red, color:"white",
            fontFamily:"var(--font-display,'Nunito',sans-serif)",
            fontWeight:700, fontSize:13, cursor:"pointer",
            boxShadow:"0 4px 14px rgba(229,57,53,0.3)", whiteSpace:"nowrap",
          }}
        >
          <RotateCcw size={13}/> Shuffle
        </motion.button>
      </div>

      {/* ── Body ──────────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-3 pb-20">
        <div className="grid lg:grid-cols-2 gap-5 items-start">

          {/* ── LEFT: Puzzle grid ────────────────────────────────────── */}
          <div className="flex flex-col items-center">

            {/* Stats chips */}
            <div style={{ display:"flex", gap:8, marginBottom:10, flexWrap:"wrap", justifyContent:"center" }}>
              <div style={{
                display:"flex", alignItems:"center", gap:5,
                padding:"5px 13px", borderRadius:999, background:"white",
                boxShadow:"0 2px 8px rgba(0,0,0,0.07)",
                fontFamily:"var(--font-display,'Nunito',sans-serif)",
                fontWeight:700, fontSize:12, color:accent,
              }}>
                <Target size={12} strokeWidth={2}/> {moves} swaps
              </div>
              <div style={{
                display:"flex", alignItems:"center", gap:5,
                padding:"5px 13px", borderRadius:999, background:"white",
                boxShadow:"0 2px 8px rgba(0,0,0,0.07)",
                fontFamily:"var(--font-display,'Nunito',sans-serif)",
                fontWeight:700, fontSize:12, color:"#64748B",
              }}>
                <StarRow count={diff.starCount} size={10}/> {diff.label} · {diff.desc}
              </div>
              {won && (
                <motion.div initial={{ scale:0 }} animate={{ scale:1 }}
                  style={{
                    padding:"5px 13px", borderRadius:999, background:accent, color:"white",
                    fontFamily:"var(--font-display,'Nunito',sans-serif)",
                    fontWeight:700, fontSize:12, boxShadow:`0 4px 14px ${accent}55`,
                    display:"flex", alignItems:"center", gap:5,
                  }}
                >
                  <Trophy size={12} strokeWidth={2}/> Solved!
                </motion.div>
              )}
            </div>

            {/* Win banner */}
            <AnimatePresence>
              {won && (
                <motion.div
                  initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
                  style={{
                    width:"100%", textAlign:"center", padding:"13px 0",
                    borderRadius:18, marginBottom:10,
                    background:`linear-gradient(135deg, ${accent}, ${accent}BB)`,
                    color:"white",
                    fontFamily:"var(--font-display,'Nunito',sans-serif)",
                    fontWeight:700, fontSize:17, boxShadow:`0 6px 24px ${accent}55`,
                    display:"flex", alignItems:"center", justifyContent:"center", gap:8,
                  }}
                >
                  <CheckCircle size={18} strokeWidth={2}/> You completed {item[lang] || item.name}!
                </motion.div>
              )}
            </AnimatePresence>

            {/* Grid container */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white"
              style={{ width:GRID_PX, height:GRID_PX, background:C.greenSoft }}>
              <img src={item.img} alt="" className="hidden" onLoad={() => setImgLoaded(true)}/>

              {/* Loading placeholder */}
              {!imgLoaded && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2"
                  style={{ background:(item.color || "#eee") + "22" }}>
                  {(() => { const CatIcon = cat.icon; return (
                    <motion.div animate={{ scale:[1,1.15,1], opacity:[0.5,1,0.5] }}
                      transition={{ duration:1.4, repeat:Infinity, ease:"easeInOut" }}
                      style={{ color:item.color || accent }}>
                      <CatIcon size={48} strokeWidth={1.5}/>
                    </motion.div>
                  ); })()}
                  <span style={{ fontFamily:"var(--font-body,'Nunito',sans-serif)", fontSize:11, color:"#94A3B8" }}>
                    Loading photo…
                  </span>
                </div>
              )}

              {/* Puzzle tiles */}
              {imgLoaded && (
                <div style={{
                  display:"grid",
                  gridTemplateColumns:`repeat(${gridSize},1fr)`,
                  width:"100%", height:"100%",
                  gap:2, padding:2, background:"#CBD5E1",
                }}>
                  {tiles.map((tile, idx) => {
                    const srcCol = tile % gridSize;
                    const srcRow = Math.floor(tile / gridSize);
                    const isSel  = selected === idx;
                    const isHov  = dragOver === idx;
                    return (
                      <motion.div key={idx}
                        style={{
                          position:"relative", cursor:"pointer",
                          overflow:"hidden", borderRadius:4,
                          border:`2px solid ${isSel ? C.yellow : isHov ? accent : "transparent"}`,
                          boxShadow: isSel ? `0 0 0 2px ${C.yellow},0 4px 16px rgba(0,0,0,0.3)` : "none",
                          zIndex: isSel ? 10 : 1,
                        }}
                        whileHover={{ scale: won ? 1 : 1.04 }}
                        whileTap={{ scale: won ? 1 : 0.95 }}
                        onClick={() => handleTile(idx)}
                        onMouseEnter={() => { if (selected !== null && selected !== idx) setDragOver(idx); }}
                        onMouseLeave={() => setDragOver(null)}
                      >
                        <div style={{
                          width:"100%", height:"100%", aspectRatio:"1",
                          backgroundImage:`url(${item.img})`,
                          backgroundSize:`${gridSize * 100}%`,
                          backgroundPosition:`${srcCol * 100 / Math.max(gridSize - 1, 1)}% ${srcRow * 100 / Math.max(gridSize - 1, 1)}%`,
                          backgroundRepeat:"no-repeat",
                        }}/>
                        {!won && (
                          <div style={{
                            position:"absolute", bottom:2, right:2,
                            width:13, height:13, borderRadius:"50%",
                            display:"flex", alignItems:"center", justifyContent:"center",
                            background:"rgba(0,0,0,0.28)", color:"white",
                            fontFamily:"var(--font-display,'Nunito',sans-serif)", fontSize:7,
                          }}>{tile + 1}</div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Reference thumbnail */}
            <div style={{ display:"flex", alignItems:"center", gap:10, marginTop:10 }}>
              <div style={{
                width:52, height:52, borderRadius:12, overflow:"hidden",
                border:"3px solid white", boxShadow:"0 2px 10px rgba(0,0,0,0.12)",
                background:(item.color || "#eee") + "33",
                display:"flex", alignItems:"center", justifyContent:"center",
              }}>
                {imgLoaded
                  ? <img src={item.img} alt={item.name} style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
                  : (() => { const CatIcon = cat.icon; return <CatIcon size={26} strokeWidth={1.5} style={{ color:item.color||"#94A3B8" }}/>; })()
                }
              </div>
              <p style={{ fontFamily:"var(--font-body,'Nunito',sans-serif)", fontSize:11, color:"#94A3B8" }}>
                Reference image
              </p>
            </div>
          </div>

          {/* ── RIGHT: Info panel ────────────────────────────────────── */}
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>

            {/* Item title */}
            <div>
              <div style={{
                display:"inline-flex", alignItems:"center", gap:6,
                padding:"3px 10px", borderRadius:999, background:accent + "18", marginBottom:6,
                fontFamily:"var(--font-body,'Nunito',sans-serif)", fontSize:11, fontWeight:600, color:accent,
              }}>
                {(() => { const CatIcon = cat.icon; return <CatIcon size={11} strokeWidth={2} style={{ display:"inline", verticalAlign:"middle", marginRight:3 }}/>; })()} {cat.label}
              </div>
              <h3 style={{
                fontFamily:"var(--font-display,'Nunito',sans-serif)",
                fontWeight:800, fontSize:26, color:accent, margin:0, lineHeight:1.2,
              }}>
                {item[lang] || item.name}
              </h3>
              {item[lang] && item[lang] !== item.name && (
                <p style={{ fontFamily:"var(--font-body,'Nunito',sans-serif)", fontSize:12, color:"#94A3B8", margin:"2px 0 0" }}>
                  {item.name} in English
                </p>
              )}
            </div>

            {/* Translations card */}
            <div style={{
              background:"white", borderRadius:18, padding:"14px 16px",
              boxShadow:`0 4px 16px ${accent}18`, border:"2px solid white",
            }}>
              {/* Active language — large */}
              <div style={{
                display:"flex", alignItems:"center", justifyContent:"space-between",
                paddingBottom:10, borderBottom:"1.5px solid #F0FFF4", marginBottom:8,
              }}>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <span style={{ fontSize:22 }}><EmojiSvg code={langMeta.flagCode} size={22} /></span>
                  <div>
                    <div style={{ fontFamily:"var(--font-body,'Nunito',sans-serif)", fontSize:10, color:"#94A3B8", textTransform:"uppercase", letterSpacing:"0.06em" }}>
                      {langMeta.label}
                    </div>
                    <div style={{
                      fontFamily:"var(--font-display,'Nunito',sans-serif)",
                      fontWeight:800, fontSize:22, color:accent, lineHeight:1,
                      direction:langMeta.dir,
                    }}>
                      {item[lang] || item.name}
                    </div>
                  </div>
                </div>
                <motion.button whileHover={{ scale:1.08 }} whileTap={{ scale:0.93 }}
                  onClick={() => speak(item[lang] || item.name, langMeta.voice)}
                  style={{
                    width:34, height:34, borderRadius:"50%", border:"none",
                    background:accent + "18", color:accent, cursor:"pointer",
                    display:"flex", alignItems:"center", justifyContent:"center",
                  }}>
                  <Volume2 size={14}/>
                </motion.button>
              </div>

              {/* English row */}
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"7px 0", borderBottom:"1.5px solid #F1F5F9" }}>
                <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                  <EmojiSvg code="1f1ec-1f1e7" size={20}/>
                  <div>
                    <div style={{ fontFamily:"var(--font-body,'Nunito',sans-serif)", fontSize:10, color:"#94A3B8" }}>English</div>
                    <div style={{ fontFamily:"var(--font-display,'Nunito',sans-serif)", fontWeight:700, fontSize:14, color:C.blue }}>{item.name}</div>
                  </div>
                </div>
                <button onClick={() => speak(item.name, "en-US")}
                  style={{ width:28, height:28, borderRadius:"50%", border:"none", background:C.blueSoft, color:C.blue, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <Volume2 size={12}/>
                </button>
              </div>

              {/* 3 teaser languages */}
              {teaserLangs.map(l => (
                <div key={l.code} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"6px 0", borderBottom:"1px solid #F8FAFC" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                    <span style={{ fontSize:15 }}><EmojiSvg code={l.flagCode} size={15} /></span>
                    <div>
                      <div style={{ fontFamily:"var(--font-body,'Nunito',sans-serif)", fontSize:9, color:"#CBD5E1" }}>{l.label}</div>
                      <div style={{ fontFamily:"var(--font-display,'Nunito',sans-serif)", fontWeight:600, fontSize:13, color:"#64748B", direction:l.dir }}>
                        {item[l.code] || item.name}
                      </div>
                    </div>
                  </div>
                  <button onClick={() => speak(item[l.code] || item.name, l.voice)}
                    style={{ width:24, height:24, borderRadius:"50%", border:"none", background:"#F1F5F9", color:"#94A3B8", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <Volume2 size={10}/>
                  </button>
                </div>
              ))}

              <p style={{ fontFamily:"var(--font-body,'Nunito',sans-serif)", fontSize:10, color:"#CBD5E1", textAlign:"center", marginTop:7 }}>
                Switch language above to hear more translations <EmojiSvg code="1f30d" size={10} />
              </p>
            </div>

            <div style={{ borderRadius:18, padding:"13px 15px", background:C.yellowSoft, border:"2px solid white", boxShadow:"0 2px 10px rgba(0,0,0,0.04)" }}>
              <div style={{ fontFamily:"var(--font-display,'Nunito',sans-serif)", fontWeight:700, fontSize:12, color:C.yellow, marginBottom:4 }}>
                <EmojiSvg code="1f31f" size={14} style={{ marginRight:4, verticalAlign:"middle" }}/> Fun fact!
              </div>
              <p style={{ fontFamily:"var(--font-body,'Nunito',sans-serif)", fontSize:13, color:"#64748B", lineHeight:1.55, margin:0 }}>
                {item.fact}
              </p>
            </div>

            {/* Instructions */}
            <div style={{ borderRadius:18, padding:"11px 15px", background:C.blueSoft, border:"2px solid white" }}>
              <p style={{ fontFamily:"var(--font-display,'Nunito',sans-serif)", fontWeight:700, fontSize:12, color:C.blue, margin:"0 0 3px" }}>
                How to play
              </p>
              <p style={{ fontFamily:"var(--font-body,'Nunito',sans-serif)", fontSize:12, color:"#64748B", margin:0, lineHeight:1.5 }}>
                Tap a tile to select it (glows <EmojiSvg code="1f7e1" size={12} />), then tap another to swap.
                Numbers show each tile's correct position. Good luck!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  ); 
};