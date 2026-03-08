/**
 * src/App.jsx — Kiddsy
 * ─────────────────────────────────────────────────────────────────────────
 * CAMBIOS EN ESTA VERSIÓN:
 *  • 16 idiomas: ES, FR, AR, DE, IT, PT, RU, ZH, JA, KO, BN, HI, NL, PL, NO, SV
 *  • LanguagePicker reemplazado por Dropdown elegante con banderas
 *  • Navbar rediseñado: funcional en desktop Y móvil
 *  • SVG dangerouslySetInnerHTML intacto
 *  • KiddsyTitle preservado
 *  • API_URL dinámico preservado
 * ─────────────────────────────────────────────────────────────────────────
 */
import KiddsyTitle from './components/KiddsyTitle';
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen, Sparkles, ChevronLeft, ChevronRight, ArrowLeft,
  Wand2, Puzzle, Music, HelpCircle, Heart,
  Users, Menu, X, Library, ChevronDown,
  Search, Cat, Globe,
} from "lucide-react";

// ── Auth — stub para modo invitado ─────────────────────────────────────────
// Si quieres reactivar login, reemplaza este stub con:
// import { useAuth } from "./context/AuthContext.jsx";
function useAuth() {
  return { user: null, isAuthenticated: false, loading: false, logout: () => {} };
}

// ── Páginas ────────────────────────────────────────────────────────────────
import HeroScreen   from './pages/HeroScreen';
import MyLibrary    from "./pages/MyLibrary.jsx";
import Legal        from "./pages/Legal.jsx";
import Donation     from "./pages/Donation.jsx";
import Games        from "./pages/Games.jsx";
import Education    from "./pages/Education.jsx";
import WordSearch   from "./pages/WordSearch.jsx";
import AnimalPuzzle from "./pages/AnimalPuzzle.jsx";
import { StoryCoverIcon } from "./components/KiddsyIcons.jsx";

// ─── LocalStorage helpers ──────────────────────────────────────────────────
const LS_NAME    = "kiddsy_childName";
const LS_STORIES = "kiddsy_guestStories";
const LS_LANG    = "kiddsy_lang";

function lsGet(key, fallback = null) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
  catch { return fallback; }
}
function lsSet(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

// ─── Colores de marca ──────────────────────────────────────────────────────
const C = {
  blue:      "#1565C0",
  blueSoft:  "#E3F2FD",
  red:       "#E53935",
  yellow:    "#F9A825",
  green:     "#43A047",
  greenSoft: "#E8F5E9",
  magenta:   "#D81B60",
  cyan:      "#00ACC1",
  orange:    "#E65100",
};

// ═══════════════════════════════════════════════════════════════════════════
// ─── 16 IDIOMAS ───────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════
const LANGUAGES = [
  { code:"es", name:"Español",            flag:"🇪🇸", dir:"ltr" },
  { code:"fr", name:"Français",           flag:"🇫🇷", dir:"ltr" },
  { code:"ar", name:"العربية",            flag:"🇸🇦", dir:"rtl" },
  { code:"de", name:"Deutsch",            flag:"🇩🇪", dir:"ltr" },
  { code:"it", name:"Italiano",           flag:"🇮🇹", dir:"ltr" },
  { code:"pt", name:"Português",          flag:"🇧🇷", dir:"ltr" },
  { code:"ru", name:"Русский",            flag:"🇷🇺", dir:"ltr" },
  { code:"zh", name:"中文(简体)",          flag:"🇨🇳", dir:"ltr" },
  { code:"ja", name:"日本語",              flag:"🇯🇵", dir:"ltr" },
  { code:"ko", name:"한국어",              flag:"🇰🇷", dir:"ltr" },
  { code:"bn", name:"বাংলা",             flag:"🇧🇩", dir:"ltr" },
  { code:"hi", name:"हिंदी",             flag:"🇮🇳", dir:"ltr" },
  { code:"nl", name:"Nederlands",         flag:"🇳🇱", dir:"ltr" },
  { code:"pl", name:"Polski",             flag:"🇵🇱", dir:"ltr" },
  { code:"no", name:"Norsk",              flag:"🇳🇴", dir:"ltr" },
  { code:"sv", name:"Svenska",            flag:"🇸🇪", dir:"ltr" },
];

function getLang(code) {
  return LANGUAGES.find(l => l.code === code) || LANGUAGES[0];
}

// ─── Accent colors from story gradient class ───────────────────────────────
function getStoryAccent(colorClass = "") {
  if (colorClass.includes("yellow")||colorClass.includes("amber")||colorClass.includes("orange"))
    return { primary:"#F59E0B", soft:"#FFFBEB", text:"#92400E" };
  if (colorClass.includes("purple")||colorClass.includes("indigo")||colorClass.includes("violet"))
    return { primary:"#7C3AED", soft:"#EDE9FE", text:"#4C1D95" };
  if (colorClass.includes("red")||colorClass.includes("rose")||colorClass.includes("pink"))
    return { primary:"#E53935", soft:"#FFF1F2", text:"#881337" };
  if (colorClass.includes("green")||colorClass.includes("emerald")||colorClass.includes("teal"))
    return { primary:"#059669", soft:"#ECFDF5", text:"#064E3B" };
  if (colorClass.includes("cyan"))
    return { primary:"#0891B2", soft:"#ECFEFF", text:"#164E63" };
  return { primary:"#1565C0", soft:"#EFF6FF", text:"#1E3A5F" };
}

// ═══════════════════════════════════════════════════════════════════════════
// ─── LANGUAGE DROPDOWN ────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════
function LanguagePicker({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const selected = getLang(value);

  // Close on outside click
  useEffect(() => {
    const handler = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} style={{ position:"relative", zIndex:40 }}>
      {/* Trigger button */}
      <motion.button
        whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}
        onClick={() => setOpen(o => !o)}
        style={{
          display:        "flex",
          alignItems:     "center",
          gap:            8,
          padding:        "8px 14px 8px 12px",
          borderRadius:   999,
          border:         "2.5px solid white",
          background:     "rgba(255,255,255,0.85)",
          backdropFilter: "blur(8px)",
          boxShadow:      "0 4px 14px rgba(21,101,192,0.15)",
          cursor:         "pointer",
          fontFamily:     "var(--font-display,'Nunito',sans-serif)",
          fontWeight:     700,
          fontSize:       14,
          color:          C.blue,
          whiteSpace:     "nowrap",
          minWidth:       140,
          justifyContent: "space-between",
        }}
      >
        <span style={{ display:"flex", alignItems:"center", gap:6 }}>
          <Globe size={15} style={{ flexShrink:0 }}/>
          <span style={{ fontSize:18, lineHeight:1 }}>{selected.flag}</span>
          <span>{selected.name}</span>
        </span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration:0.2 }}
          style={{ display:"flex" }}
        >
          <ChevronDown size={14}/>
        </motion.span>
      </motion.button>

      {/* Dropdown panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity:0, y:-8, scale:0.97 }}
            animate={{ opacity:1, y:0,  scale:1    }}
            exit={{    opacity:0, y:-8, scale:0.97 }}
            transition={{ duration:0.18, ease:"easeOut" }}
            style={{
              position:       "absolute",
              top:            "calc(100% + 8px)",
              left:           "50%",
              transform:      "translateX(-50%)",
              width:          220,
              background:     "white",
              borderRadius:   20,
              border:         "2.5px solid rgba(21,101,192,0.12)",
              boxShadow:      "0 16px 48px rgba(21,101,192,0.18), 0 4px 12px rgba(0,0,0,0.08)",
              overflow:       "hidden",
              maxHeight:      360,
              overflowY:      "auto",
              scrollbarWidth: "thin",
            }}
          >
            {/* Header */}
            <div style={{
              padding:        "10px 14px 8px",
              borderBottom:   "1.5px solid #EFF6FF",
              fontFamily:     "var(--font-display,'Nunito',sans-serif)",
              fontWeight:     700,
              fontSize:       11,
              color:          C.blue,
              letterSpacing:  "0.07em",
              textTransform:  "uppercase",
              display:        "flex",
              alignItems:     "center",
              gap:            6,
            }}>
              <Globe size={12}/> Translation language
            </div>
            {/* Options */}
            {LANGUAGES.map(lang => {
              const isActive = lang.code === value;
              return (
                <button
                  key={lang.code}
                  onClick={() => { onChange(lang.code); setOpen(false); }}
                  style={{
                    display:        "flex",
                    alignItems:     "center",
                    gap:            10,
                    width:          "100%",
                    padding:        "9px 14px",
                    border:         "none",
                    background:     isActive ? C.blueSoft : "transparent",
                    cursor:         "pointer",
                    fontFamily:     "var(--font-body,'Nunito',sans-serif)",
                    fontWeight:     isActive ? 700 : 500,
                    fontSize:       14,
                    color:          isActive ? C.blue : "#374151",
                    textAlign:      "left",
                    transition:     "background 0.12s",
                    borderLeft:     isActive ? `3px solid ${C.blue}` : "3px solid transparent",
                  }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "#F0F9FF"; }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
                >
                  <span style={{ fontSize:20, lineHeight:1, flexShrink:0 }}>{lang.flag}</span>
                  <span style={{ flex:1 }}>{lang.name}</span>
                  {isActive && (
                    <span style={{
                      width:7, height:7, borderRadius:"50%", background:C.blue, flexShrink:0,
                    }}/>
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ─── NAVBAR ───────────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════
const NAV_PRIMARY = [
  { id:"library",    label:"Stories",     icon:BookOpen, color:C.blue    },
  { id:"mylibrary",  label:"My Library",  icon:Library,  color:C.green   },
  { id:"games",      label:"Games",       icon:Puzzle,   color:C.red     },
  { id:"wordsearch", label:"Word Search", icon:Search,   color:C.cyan    },
  { id:"animals",    label:"Animals",     icon:Cat,      color:C.green   },
  { id:"education",  label:"Learn ABC",   icon:Music,    color:C.orange  },
];
const NAV_SECONDARY = [
  { id:"legal",       label:"Help & FAQ",  icon:HelpCircle, color:C.magenta },
  { id:"donate",      label:"Donate ☕",   icon:Heart,      color:C.yellow  },
  { id:"collaborate", label:"Collaborate", icon:Users,      color:C.magenta },
];
const ALL_NAV = [...NAV_PRIMARY, ...NAV_SECONDARY];

function Navbar({ view, onNav, lang, onLangChange }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef(null);

  // Close "more" dropdown on outside click
  useEffect(() => {
    const h = e => { if (moreRef.current && !moreRef.current.contains(e.target)) setMoreOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <header style={{
      position:       "sticky",
      top:            0,
      zIndex:         50,
      background:     "rgba(255,255,255,0.75)",
      backdropFilter: "blur(16px)",
      WebkitBackdropFilter: "blur(16px)",
      borderBottom:   "2px solid rgba(255,255,255,0.9)",
      boxShadow:      "0 2px 20px rgba(21,101,192,0.07)",
    }}>
      <div style={{
        maxWidth:       1200,
        margin:         "0 auto",
        padding:        "0 20px",
        height:         64,
        display:        "flex",
        alignItems:     "center",
        gap:            12,
        justifyContent: "space-between",
      }}>

        {/* ── Logo ── */}
        <motion.button
          onClick={() => onNav("hero")}
          whileHover={{ scale:1.04 }} whileTap={{ scale:0.96 }}
          style={{
            display:    "flex",
            alignItems: "center",
            gap:        8,
            background: "none",
            border:     "none",
            cursor:     "pointer",
            flexShrink: 0,
          }}
        >
          <img src="/kiddsy-logo.png" alt="Kiddsy"
            style={{ width:38, height:38, objectFit:"contain" }}
          />
          <span style={{
            fontFamily: "var(--font-display,'Nunito',sans-serif)",
            fontWeight: 900,
            fontSize:   20,
            color:      C.blue,
            display:    "none",
          }}
            className="sm-show"
          >Kiddsy</span>
        </motion.button>

        {/* ── Desktop nav ── */}
        <nav style={{
          display:        "flex",
          alignItems:     "center",
          gap:            4,
          flex:           1,
          justifyContent: "center",
          flexWrap:       "nowrap",
          overflow:       "hidden",
        }}
          className="desktop-nav"
        >
          {NAV_PRIMARY.map(item => {
            const Icon = item.icon;
            const isActive = view === item.id;
            return (
              <motion.button
                key={item.id}
                onClick={() => onNav(item.id)}
                whileHover={{ scale:1.06, y:-2 }}
                whileTap={{ scale:0.95 }}
                style={{
                  display:        "flex",
                  alignItems:     "center",
                  gap:            5,
                  padding:        "7px 13px",
                  borderRadius:   999,
                  border:         "none",
                  background:     isActive ? item.color : "transparent",
                  color:          isActive ? "white" : "#64748B",
                  fontFamily:     "var(--font-display,'Nunito',sans-serif)",
                  fontWeight:     700,
                  fontSize:       13,
                  cursor:         "pointer",
                  transition:     "background 0.18s, color 0.18s",
                  whiteSpace:     "nowrap",
                  flexShrink:     0,
                  boxShadow:      isActive ? `0 4px 14px ${item.color}40` : "none",
                }}
              >
                <Icon size={14} strokeWidth={2.2}/>
                {item.label}
              </motion.button>
            );
          })}

          {/* More dropdown for secondary items */}
          <div ref={moreRef} style={{ position:"relative", flexShrink:0 }}>
            <motion.button
              onClick={() => setMoreOpen(o => !o)}
              whileHover={{ scale:1.06, y:-2 }} whileTap={{ scale:0.95 }}
              style={{
                display:    "flex",
                alignItems: "center",
                gap:        5,
                padding:    "7px 13px",
                borderRadius: 999,
                border:     "none",
                background: NAV_SECONDARY.some(s=>s.id===view) ? C.magenta : "transparent",
                color:      NAV_SECONDARY.some(s=>s.id===view) ? "white" : "#64748B",
                fontFamily: "var(--font-display,'Nunito',sans-serif)",
                fontWeight: 700,
                fontSize:   13,
                cursor:     "pointer",
                whiteSpace: "nowrap",
              }}
            >
              More
              <motion.span
                animate={{ rotate: moreOpen ? 180 : 0 }}
                transition={{ duration:0.18 }}
                style={{ display:"flex" }}
              ><ChevronDown size={13}/></motion.span>
            </motion.button>

            <AnimatePresence>
              {moreOpen && (
                <motion.div
                  initial={{ opacity:0, y:-6, scale:0.97 }}
                  animate={{ opacity:1, y:0,  scale:1    }}
                  exit={{    opacity:0, y:-6, scale:0.97 }}
                  transition={{ duration:0.15 }}
                  style={{
                    position:   "absolute",
                    top:        "calc(100% + 8px)",
                    left:       "50%",
                    transform:  "translateX(-50%)",
                    width:      180,
                    background: "white",
                    borderRadius: 16,
                    border:     "2px solid rgba(21,101,192,0.1)",
                    boxShadow:  "0 16px 40px rgba(0,0,0,0.12)",
                    overflow:   "hidden",
                    zIndex:     60,
                  }}
                >
                  {NAV_SECONDARY.map(item => {
                    const Icon = item.icon;
                    const isActive = view === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => { onNav(item.id); setMoreOpen(false); }}
                        style={{
                          display:    "flex",
                          alignItems: "center",
                          gap:        8,
                          width:      "100%",
                          padding:    "10px 14px",
                          border:     "none",
                          background: isActive ? item.color : "transparent",
                          color:      isActive ? "white" : "#374151",
                          fontFamily: "var(--font-display,'Nunito',sans-serif)",
                          fontWeight: 600,
                          fontSize:   13,
                          cursor:     "pointer",
                          textAlign:  "left",
                        }}
                        onMouseEnter={e => { if (!isActive) e.currentTarget.style.background="#F8FAFC"; }}
                        onMouseLeave={e => { if (!isActive) e.currentTarget.style.background="transparent"; }}
                      >
                        <Icon size={14}/> {item.label}
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>

        {/* ── Right side: Language picker + hamburger ── */}
        <div style={{ display:"flex", alignItems:"center", gap:8, flexShrink:0 }}>
          {/* Language picker — visible always on desktop, hidden on mobile (shown inside mobile menu) */}
          <div className="desktop-lang">
            <LanguagePicker value={lang} onChange={onLangChange}/>
          </div>

          {/* Hamburger — mobile only */}
          <motion.button
            onClick={() => setMenuOpen(o => !o)}
            whileTap={{ scale:0.9 }}
            className="mobile-menu-btn"
            style={{
              width:        42,
              height:       42,
              borderRadius: 12,
              border:       "2px solid rgba(21,101,192,0.12)",
              background:   "white",
              display:      "flex",
              alignItems:   "center",
              justifyContent:"center",
              cursor:       "pointer",
              color:        C.blue,
              flexShrink:   0,
            }}
          >
            {menuOpen ? <X size={20}/> : <Menu size={20}/>}
          </motion.button>
        </div>
      </div>

      {/* ── Mobile menu ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height:0, opacity:0 }}
            animate={{ height:"auto", opacity:1 }}
            exit={{    height:0, opacity:0 }}
            transition={{ duration:0.22, ease:"easeInOut" }}
            style={{
              overflow:   "hidden",
              background: "rgba(255,255,255,0.97)",
              borderTop:  "1.5px solid rgba(21,101,192,0.08)",
            }}
          >
            {/* Language picker inside mobile menu */}
            <div style={{ padding:"14px 16px 4px", display:"flex", justifyContent:"center" }}>
              <LanguagePicker value={lang} onChange={v => { onLangChange(v); }}/>
            </div>

            <div style={{
              padding:             "8px 16px 16px",
              display:             "grid",
              gridTemplateColumns: "1fr 1fr",
              gap:                 8,
            }}>
              {ALL_NAV.map(item => {
                const Icon = item.icon;
                const isActive = view === item.id;
                return (
                  <motion.button
                    key={item.id}
                    onClick={() => { onNav(item.id); setMenuOpen(false); }}
                    whileTap={{ scale:0.95 }}
                    style={{
                      display:      "flex",
                      alignItems:   "center",
                      gap:          8,
                      padding:      "12px 14px",
                      borderRadius: 16,
                      border:       "2px solid transparent",
                      background:   isActive ? item.color : "#F8FAFC",
                      color:        isActive ? "white" : "#374151",
                      fontFamily:   "var(--font-display,'Nunito',sans-serif)",
                      fontWeight:   700,
                      fontSize:     13,
                      cursor:       "pointer",
                      textAlign:    "left",
                    }}
                  >
                    <Icon size={15}/> {item.label}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Responsive CSS injected inline ── */}
      <style>{`
        .desktop-nav   { display: flex !important; }
        .desktop-lang  { display: block !important; }
        .mobile-menu-btn { display: none !important; }
        .sm-show { display: inline !important; }

        @media (max-width: 900px) {
          .desktop-nav  { display: none !important; }
          .desktop-lang { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
        @media (max-width: 480px) {
          .sm-show { display: none !important; }
        }
      `}</style>
    </header>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ─── BACKGROUND STARS ─────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════
function StarField() {
  const stars = Array.from({length:12},(_,i)=>({
    id:i, x:Math.random()*100, y:Math.random()*100,
    size:Math.random()*12+6, delay:Math.random()*4,
    duration:Math.random()*3+3, opacity:Math.random()*0.18+0.05,
  }));
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {stars.map(s=>(
        <motion.div key={s.id} className="absolute select-none"
          style={{left:`${s.x}%`,top:`${s.y}%`,fontSize:s.size,opacity:s.opacity,color:C.yellow}}
          animate={{y:[0,-14,0],rotate:[0,180,360],opacity:[s.opacity,s.opacity*2,s.opacity]}}
          transition={{duration:s.duration,delay:s.delay,repeat:Infinity,ease:"easeInOut"}}
        >★</motion.div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ─── GENERATING LOADER ────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════
function GeneratingLoader({ childName, theme, storyColor }) {
  const accent = getStoryAccent(storyColor);
  const emojis = ["✨","📖","🌟","🪄","💫","🌈","⭐","🎨"];
  const particles = Array.from({length:12},(_,i)=>({
    id:i, x:Math.random()*80+10, y:Math.random()*60+20,
    emoji:emojis[i%emojis.length], delay:Math.random()*1.5, duration:Math.random()*1.5+2,
  }));
  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}}
      className="flex flex-col items-center justify-center min-h-[60vh] relative overflow-hidden rounded-4xl px-8 py-16"
      style={{background:`linear-gradient(145deg, ${accent.soft}, white)`}}
    >
      {particles.map(p=>(
        <motion.span key={p.id} className="absolute text-2xl pointer-events-none select-none"
          style={{left:`${p.x}%`,top:`${p.y}%`}}
          animate={{y:[0,-30,0],opacity:[0,0.7,0],scale:[0.6,1.2,0.6]}}
          transition={{duration:p.duration,delay:p.delay,repeat:Infinity,ease:"easeInOut"}}
        >{p.emoji}</motion.span>
      ))}
      <motion.div
        animate={{scale:[1,1.12,1],rotate:[0,-5,5,0]}}
        transition={{duration:2,repeat:Infinity,ease:"easeInOut"}}
        className={`w-28 h-28 rounded-4xl bg-gradient-to-br ${storyColor||"from-blue-400 to-cyan-300"} flex items-center justify-center shadow-2xl mb-8 border-4 border-white`}
      >
        <span className="text-5xl">🪄</span>
      </motion.div>
      <motion.h2 className="font-display text-3xl md:text-4xl text-center mb-3"
        style={{color:accent.text}} animate={{opacity:[0.7,1,0.7]}} transition={{duration:1.5,repeat:Infinity}}
      >Writing {childName}'s story…</motion.h2>
      <p className="font-body text-lg text-center mb-8" style={{color:`${accent.text}80`}}>
        About <strong>{theme}</strong>
      </p>
      <div className="w-64 h-3 rounded-full overflow-hidden" style={{background:`${accent.primary}20`}}>
        <motion.div className="h-full rounded-full"
          style={{background:`linear-gradient(90deg, ${accent.primary}, ${accent.primary}99)`}}
          animate={{x:["-100%","100%"]}} transition={{duration:1.4,repeat:Infinity,ease:"easeInOut"}}
        />
      </div>
      <p className="font-body text-xs mt-4" style={{color:`${accent.text}60`}}>
        Gemini AI is creating a bilingual story just for them ✨
      </p>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ─── STORY COVER CARD ─────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════
function StoryCoverCard({ story, onClick, index }) {
  return (
    <motion.button onClick={onClick}
      initial={{opacity:0,y:30}} animate={{opacity:1,y:0}}
      transition={{delay:index*0.06,type:"spring",stiffness:200}}
      whileHover={{scale:1.04,y:-4}} whileTap={{scale:0.97}}
      className="group relative w-full text-left"
    >
      <div className="absolute left-0 top-2 bottom-2 w-3 rounded-l-xl bg-black/20 blur-sm"/>
      <div className={`relative bg-gradient-to-br ${story.color||"from-blue-400 to-cyan-300"} rounded-3xl overflow-hidden border-4 border-white min-h-[180px]`}
        style={{boxShadow:"0 12px 40px rgba(0,0,0,0.18), 0 4px 12px rgba(0,0,0,0.1)"}}
      >
        <div className="absolute inset-0 opacity-10"
          style={{backgroundImage:"repeating-linear-gradient(45deg,white 0,white 1px,transparent 0,transparent 50%)",backgroundSize:"8px 8px"}}/>
        <div className="relative p-5 flex flex-col h-full min-h-[180px]">
          <StoryCoverIcon emoji={story.emoji} size={56}/>
          <h3 className="font-display text-white text-lg leading-tight flex-1 drop-shadow mt-3">{story.title}</h3>
          <div className="flex items-center gap-1.5 text-white/75 font-body text-xs mt-2">
            <BookOpen size={12}/> {story.pages?.length??0} pages
          </div>
        </div>
        <div className="absolute inset-0 rounded-3xl bg-white/0 group-hover:bg-white/15 transition-all flex items-center justify-center">
          <motion.div initial={{scale:0.8,opacity:0}} whileHover={{scale:1,opacity:1}}
            className="font-display text-sm px-4 py-2 bg-white rounded-full shadow-lg"
            style={{color:C.blue}}
          >Read ✨</motion.div>
        </div>
      </div>
    </motion.button>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ─── STORY READER ─────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════
function StoryReader({ story, lang, onBack }) {
  const [pageIdx,    setPageIdx]    = useState(0);
  const [direction,  setDirection]  = useState(1);
  const page    = story.pages[pageIdx];
  const total   = story.pages.length;
  const accent  = getStoryAccent(story.color);
  const langMeta = getLang(lang);

  useEffect(()=>{
    const onKey = e => {
      if (e.key==="ArrowRight"&&pageIdx<total-1){ setDirection(1);  setPageIdx(p=>p+1); }
      if (e.key==="ArrowLeft" &&pageIdx>0)      { setDirection(-1); setPageIdx(p=>p-1); }
    };
    window.addEventListener("keydown",onKey);
    return ()=>window.removeEventListener("keydown",onKey);
  },[pageIdx,total]);

  const pageVariants = {
    enter:  d=>({ x:d>0?"60%":"-60%", opacity:0, rotateY:d>0?15:-15, scale:0.92 }),
    center:  { x:"0%", opacity:1, rotateY:0, scale:1 },
    exit:   d=>({ x:d>0?"-60%":"60%", opacity:0, rotateY:d>0?-15:15, scale:0.92 }),
  };

  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6 px-1">
        <motion.button whileHover={{scale:1.05}} whileTap={{scale:0.95}} onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 rounded-2xl font-display text-sm bg-white/80 shadow-sm border border-white"
          style={{color:C.blue}}
        ><ArrowLeft size={18}/> Library</motion.button>
        <div className="flex items-center gap-2 bg-white/80 backdrop-blur rounded-full px-4 py-2 shadow-sm border border-white overflow-hidden max-w-[200px]">
          <StoryCoverIcon emoji={story.emoji} size={28}/>
          <span className="font-display text-sm truncate" style={{color:C.blue}}>{story.title}</span>
        </div>
        <div className="font-display text-sm px-4 py-2 rounded-2xl bg-white/80 shadow-sm border border-white" style={{color:accent.text}}>
          {pageIdx+1} / {total}
        </div>
      </div>

      <div className="relative" style={{perspective:"1200px"}}>
        <div className="absolute -bottom-4 left-4 right-4 h-8 rounded-full blur-2xl opacity-30" style={{background:accent.primary}}/>
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div key={pageIdx} custom={direction} variants={pageVariants}
            initial="enter" animate="center" exit="exit"
            transition={{type:"spring",stiffness:240,damping:28}}
            style={{transformStyle:"preserve-3d"}}
          >
            <div className={`bg-gradient-to-br ${story.color||"from-blue-400 to-cyan-300"} p-[5px] rounded-4xl`}
              style={{boxShadow:`0 24px 60px ${accent.primary}40, 0 8px 20px rgba(0,0,0,0.15)`}}
            >
              <div className="relative bg-gradient-to-b from-amber-50 to-orange-50 rounded-4xl overflow-hidden min-h-[400px] md:min-h-[460px]">
                <div className="absolute left-0 inset-y-0 w-6 opacity-10"
                  style={{background:`linear-gradient(90deg, ${accent.primary}60, transparent)`}}/>
                <div className="p-8 md:p-10 flex flex-col h-full min-h-[400px]">
                  <div className="flex justify-between items-start mb-6">
                    <div className="font-display text-xs px-3 py-1 rounded-full" style={{background:accent.soft,color:accent.text}}>
                      Page {pageIdx+1}
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-display"
                      style={{background:accent.soft,color:accent.text}}
                    >
                      <span>{langMeta.flag}</span> {langMeta.name}
                    </div>
                  </div>
                  {page && (
                    <>
                      {/* ── SVG illustration — dangerouslySetInnerHTML intact ── */}
                      {page.image_svg && (
                        <div
                          className="w-full aspect-square max-h-48 mb-6 flex items-center justify-center bg-white/50 rounded-3xl p-4 shadow-inner"
                          dangerouslySetInnerHTML={{ __html: page.image_svg }}
                        />
                      )}

                      {/* ── English text ── */}
                      <p className="text-2xl text-gray-800 leading-relaxed mb-6"
                        style={{ fontFamily:'"Comic Neue", "Nunito", cursive' }}
                      >
                        {page.en}
                      </p>

                      {/* ── Translation in chosen language ── */}
                      <div className="border-t-2 pt-5" style={{borderColor:`${accent.primary}25`}}>
                        <div
                          dir={langMeta.dir}
                          className="flex items-start gap-3 p-4 rounded-2xl"
                          style={{background:accent.soft}}
                        >
                          <span className="text-xl flex-shrink-0">{langMeta.flag}</span>
                          <p className="font-body text-base leading-relaxed" style={{color:accent.text}}>
                            {page[lang] || "Translation not available"}
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-between mt-8 px-2">
        {pageIdx>0?(
          <motion.button whileHover={{scale:1.04}} whileTap={{scale:0.96}}
            onClick={()=>{setDirection(-1);setPageIdx(p=>p-1);}}
            className="flex items-center gap-2 px-7 py-3.5 rounded-2xl font-display text-base text-white shadow-xl"
            style={{background:`linear-gradient(135deg,${accent.primary},${accent.primary}CC)`,boxShadow:`0 8px 24px ${accent.primary}40`}}
          ><ChevronLeft size={20}/> Previous</motion.button>
        ):<div/>}
        {pageIdx<total-1&&(
          <motion.button whileHover={{scale:1.04}} whileTap={{scale:0.96}}
            onClick={()=>{setDirection(1);setPageIdx(p=>p+1);}}
            className="flex items-center gap-2 px-7 py-3.5 rounded-2xl font-display text-base text-white shadow-xl"
            style={{background:`linear-gradient(135deg,${accent.primary},${accent.primary}CC)`,boxShadow:`0 8px 24px ${accent.primary}40`}}
          >Next <ChevronRight size={20}/></motion.button>
        )}
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ─── STORY GENERATOR ──────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════
function StoryGenerator({ onGenerated, lang, onLangChange }) {
  const [childName, setChildName] = useState(()=>lsGet(LS_NAME,""));
  const [theme,     setTheme]     = useState("");
  const [customTheme, setCustomTheme] = useState("");
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState("");
  const [selectedThemeLabel, setSelectedThemeLabel] = useState("");

  useEffect(()=>{ lsSet(LS_NAME, childName); },[childName]);

  const THEMES = [
    { label:"🏫 Going to School",  value:"going to school for the first time" },
    { label:"🌈 Making Friends",   value:"making new friends" },
    { label:"🛒 Supermarket",      value:"shopping at the supermarket" },
    { label:"🚌 Taking the Bus",   value:"taking the bus" },
    { label:"🏥 Doctor Visit",     value:"visiting the doctor" },
    { label:"🎉 Birthday Party",   value:"celebrating a birthday" },
  ];

  // Use custom theme if filled, otherwise preset
  const activeTheme = customTheme.trim() || theme;

  const handleGenerate = async () => {
    if (!childName.trim() || !activeTheme) return;
    setLoading(true); setError("");
    try {
      const API_URL = window.location.hostname === "localhost"
        ? "http://localhost:10000"
        : "https://kiddsy-vercel.onrender.com";

      const response = await fetch(`${API_URL}/api/generate-story`, {
        method:  "POST",
        headers: { "Content-Type":"application/json" },
        body:    JSON.stringify({ childName, theme: activeTheme, language: lang }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Generation failed");

      const existing = lsGet(LS_STORIES, []);
      lsSet(LS_STORIES, [data, ...existing].slice(0, 20));

      onGenerated(data, lang);
    } catch(e) {
      console.error("Generation error:", e);
      setError(e.message || "Something went wrong!");
      setLoading(false);
    }
  };

  const themeColorMap = {
    "going to school":   "from-blue-400 to-cyan-300",
    "making new friends":"from-green-400 to-emerald-300",
    "shopping":          "from-orange-400 to-amber-300",
    "taking the bus":    "from-yellow-400 to-amber-300",
    "doctor":            "from-red-400 to-rose-300",
    "birthday":          "from-pink-400 to-rose-300",
  };
  const loaderColor = Object.entries(themeColorMap).find(([k])=>activeTheme.includes(k))?.[1] || "from-blue-400 to-cyan-300";

  if (loading) return <GeneratingLoader childName={childName} theme={selectedThemeLabel||activeTheme} storyColor={loaderColor}/>;

  const canGenerate = childName.trim() && activeTheme;

  return (
    <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="max-w-xl mx-auto">
      <div className="bg-white/90 backdrop-blur-md rounded-4xl shadow-xl border-4 border-white p-8 md:p-10">
        <div className="text-center mb-8">
          <motion.div animate={{rotate:[-8,8,-8]}} transition={{duration:2,repeat:Infinity,ease:"easeInOut"}}
            className="text-5xl mb-3 inline-block"
          >🪄</motion.div>
          <h2 className="font-display text-3xl" style={{color:C.blue}}>Create a Magic Story</h2>
          <div className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full font-body text-xs font-semibold"
            style={{background:"#FFF3E0",color:C.orange}}
          >📱 Saved locally on this device</div>
        </div>

        <div className="space-y-5">
          {/* Child name */}
          <div>
            <label className="block font-display text-slate-600 text-sm mb-2">✏️ Child's name</label>
            <input type="text" value={childName} onChange={e=>setChildName(e.target.value)}
              placeholder="e.g. Sofia, Omar, Lucas…" maxLength={20}
              className="w-full px-5 py-3.5 rounded-2xl border-2 border-slate-200 font-body text-lg focus:outline-none focus:border-blue-400 bg-amber-50 transition-colors placeholder-slate-300"
            />
          </div>

          {/* Preset themes */}
          <div>
            <label className="block font-display text-slate-600 text-sm mb-2">🌟 Story theme</label>
            <div className="grid grid-cols-2 gap-2">
              {THEMES.map(t=>(
                <button key={t.value}
                  onClick={()=>{ setTheme(t.value); setCustomTheme(""); setSelectedThemeLabel(t.label); }}
                  className="px-3 py-2.5 rounded-xl font-body text-sm text-left transition-all"
                  style={{
                    background: theme===t.value && !customTheme ? C.blue : "#F8FAFC",
                    color:      theme===t.value && !customTheme ? "white" : "#4B5563",
                    border:     `2px solid ${theme===t.value && !customTheme ? C.blue : "#E2E8F0"}`,
                  }}
                >{t.label}</button>
              ))}
            </div>
          </div>

          {/* Custom theme */}
          <div>
            <label className="block font-display text-slate-600 text-sm mb-2">✍️ Or write your own</label>
            <input
              type="text"
              placeholder="e.g. A trip to the moon, a talking dog…"
              className="w-full px-5 py-3.5 rounded-2xl border-2 border-dashed border-blue-200 focus:border-blue-400 focus:outline-none font-body text-base bg-blue-50/30 placeholder-slate-300"
              value={customTheme}
              onChange={e => { setCustomTheme(e.target.value); setTheme(""); }}
            />
          </div>

          {/* Language picker (full width in form) */}
          <div>
            <label className="block font-display text-slate-600 text-sm mb-2">🌍 Translation language</label>
            <LanguagePicker value={lang} onChange={onLangChange}/>
          </div>

          {error && (
            <motion.div initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}}
              className="bg-red-50 border border-red-200 text-red-600 rounded-2xl px-4 py-3 font-body text-sm flex items-start gap-2"
            ><span>⚠️</span><span>{error}</span></motion.div>
          )}

          {/* Generate button — KiddsyTitle preserved */}
          <motion.button
            whileHover={canGenerate ? { scale:1.02 } : {}}
            whileTap={canGenerate ? { scale:0.98 } : {}}
            onClick={handleGenerate}
            disabled={!canGenerate}
            className="w-full py-5 rounded-3xl font-display shadow-lg transition-all flex items-center justify-center gap-2 mt-2"
            style={{
              background:  canGenerate ? `linear-gradient(135deg,${C.blue},#42A5F5)` : "#E5E7EB",
              color:       canGenerate ? "white" : "#9CA3AF",
              cursor:      canGenerate ? "pointer" : "not-allowed",
              boxShadow:   canGenerate ? "0 8px 24px rgba(21,101,192,0.35)" : "none",
            }}
          >
            <span className="text-2xl">🪄</span>
            <KiddsyTitle className="text-xl text-white">Generate Story</KiddsyTitle>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ─── LIBRARY VIEW ─────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════
function LibraryView({ stories, onSelectStory, onGenerate }) {
  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}}>
      <div className="text-center mb-10">
        <h2 className="font-display text-4xl md:text-5xl mb-3" style={{color:C.blue}}>Story Library 📚</h2>
        <p className="font-body text-slate-500 text-lg">Pick a story or create your own! ✨</p>
      </div>
      <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.98}} onClick={onGenerate}
        className="w-full mb-8 py-5 rounded-4xl text-white font-display text-xl shadow-xl border-4 border-white flex items-center justify-center gap-3"
        style={{background:`linear-gradient(135deg,${C.yellow},#FF8F00)`,boxShadow:"0 12px 36px rgba(249,168,37,0.35)"}}
      ><Wand2 size={24}/> Create a Personalized Story ✨ <Sparkles size={20}/></motion.button>
      {stories.length===0?(
        <div className="text-center py-16 text-slate-400 font-body">
          <motion.div animate={{y:[0,-8,0]}} transition={{duration:2,repeat:Infinity}} className="text-5xl mb-3">📡</motion.div>
          <p>Connecting to the story server…</p>
          <p className="text-xs mt-1 opacity-60">Make sure the API server is running on port 10000</p>
        </div>
      ):(
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {stories.map((story,i)=>(
            <StoryCoverCard key={story.id} story={story} index={i} onClick={()=>onSelectStory(story)}/>
          ))}
        </div>
      )}
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ─── COLLABORATE ──────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════
function Collaborate() {
  const [form,setForm]=useState({name:"",role:"educator",email:"",message:""});
  const [sent,setSent]=useState(false);
  const ROLES=[
    {value:"educator",label:"👩‍🏫 Teacher"},{value:"writer",label:"✍️ Writer"},
    {value:"volunteer",label:"🙋 Volunteer"},{value:"developer",label:"💻 Developer"},
    {value:"other",label:"🌟 Other"},
  ];
  const handleSubmit=()=>{
    const sub=encodeURIComponent(`Kiddsy Collaboration — ${form.role}`);
    const body=encodeURIComponent(`Name: ${form.name}\nRole: ${form.role}\nEmail: ${form.email}\n\n${form.message}`);
    window.open(`mailto:kiddsy@atyglobal.com?subject=${sub}&body=${body}`);
    setSent(true);
  };
  return (
    <div className="min-h-screen" style={{background:"linear-gradient(150deg,#FCE4EC 0%,#E3F2FD 100%)"}}>
      <div className="max-w-xl mx-auto px-4 py-14">
        <div className="text-center mb-8">
          <div className="text-6xl mb-3">🤝</div>
          <h1 className="font-display text-4xl" style={{color:C.magenta}}>Work With Us</h1>
          <p className="font-body text-slate-500 mt-2">Teachers, writers, volunteers — we'd love to hear from you!</p>
        </div>
        {sent?(
          <div className="text-center bg-white rounded-4xl p-12 shadow-xl">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="font-display text-2xl" style={{color:C.green}}>Message sent!</h2>
            <button onClick={()=>setSent(false)} className="mt-5 font-display text-sm" style={{color:C.magenta}}>Send another</button>
          </div>
        ):(
          <div className="bg-white/90 rounded-4xl p-8 shadow-xl border-4 border-white space-y-4">
            {[{k:"name",ph:"Your full name",lbl:"👤 Your name"},{k:"email",ph:"your@email.com",lbl:"📧 Email"}].map(f=>(
              <div key={f.k}>
                <label className="block font-display text-slate-600 text-sm mb-1">{f.lbl}</label>
                <input type={f.k==="email"?"email":"text"} value={form[f.k]}
                  onChange={e=>setForm({...form,[f.k]:e.target.value})} placeholder={f.ph}
                  className="w-full px-5 py-3 rounded-2xl border-2 border-slate-200 font-body focus:outline-none focus:border-pink-400 bg-pink-50 placeholder-slate-300"/>
              </div>
            ))}
            <div>
              <label className="block font-display text-slate-600 text-sm mb-1">🎭 I am a…</label>
              <div className="grid grid-cols-2 gap-2">
                {ROLES.map(r=>(
                  <button key={r.value} onClick={()=>setForm({...form,role:r.value})}
                    className="px-3 py-2 rounded-xl font-body text-sm text-left transition-all"
                    style={{background:form.role===r.value?C.magenta:"#FDF2F8",color:form.role===r.value?"white":"#4B5563",
                      border:`2px solid ${form.role===r.value?C.magenta:"#FCE7F3"}`}}
                  >{r.label}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="block font-display text-slate-600 text-sm mb-1">💬 Message</label>
              <textarea rows={3} value={form.message} onChange={e=>setForm({...form,message:e.target.value})}
                placeholder="Tell us your idea…"
                className="w-full px-5 py-3 rounded-2xl border-2 border-slate-200 font-body focus:outline-none focus:border-pink-400 bg-pink-50 resize-none placeholder-slate-300"/>
            </div>
            <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.97}} onClick={handleSubmit}
              className="w-full py-4 rounded-2xl font-display text-xl text-white shadow-lg"
              style={{background:`linear-gradient(135deg,${C.magenta},#E91E8C)`}}
            >Send Message 🚀</motion.button>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ─── APP PRINCIPAL ────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════
export default function App() {
  const [view,        setView]        = useState("hero");
  const [lang,        setLang]        = useState(()=>lsGet(LS_LANG,"es"));
  const [stories,     setStories]     = useState([]);
  const [activeStory, setActiveStory] = useState(null);

  // Persist language choice
  useEffect(()=>{ lsSet(LS_LANG, lang); },[lang]);

  // Load static stories from API
  useEffect(()=>{
    const API_URL = window.location.hostname === "localhost"
      ? "http://localhost:10000"
      : "https://kiddsy-vercel.onrender.com";
    fetch(`${API_URL}/api/stories`)
      .then(r=>r.json())
      .then(data=>setStories(data))
      .catch(err=>console.error("Story fetch error:", err));
  },[]);

  const handleSelectStory = story => {
    setActiveStory(story); setView("reader");
    window.scrollTo({top:0,behavior:"smooth"});
  };

  const handleGenerated = (story, chosenLang) => {
    setLang(chosenLang);
    setStories(prev=>[story,...prev]);
    setActiveStory(story); setView("reader");
    window.scrollTo({top:0,behavior:"smooth"});
  };

  const handleNav = id => {
    setView(id); setActiveStory(null);
    window.scrollTo({top:0,behavior:"smooth"});
  };

  // Hero is full-screen — no navbar
  if (view === "hero") {
    return <HeroScreen onPlay={() => { setView("library"); window.scrollTo({top:0}); }}/>;
  }

  const FULL_PAGES = {
    games:       <Games/>,
    wordsearch:  <WordSearch/>,
    animals:     <AnimalPuzzle/>,
    education:   <Education/>,
    legal:       <Legal/>,
    donate:      <Donation/>,
    collaborate: <Collaborate/>,
    mylibrary:   <MyLibrary onCreateStory={()=>handleNav("generate")} onReadStory={handleSelectStory}/>,
  };

  return (
    <div className="min-h-screen relative" style={{background:"#FFFDE7"}}>
      <StarField/>
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl" style={{background:`${C.blue}07`}}/>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl" style={{background:`${C.yellow}0F`}}/>
      </div>

      <div className="relative z-10">
        <Navbar view={view} onNav={handleNav} lang={lang} onLangChange={setLang}/>

        <main className="max-w-4xl mx-auto px-4 py-8 pb-20">
          <AnimatePresence mode="wait">
            {FULL_PAGES[view] ? (
              <motion.div key={view} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="-mx-4">
                {FULL_PAGES[view]}
              </motion.div>
            ) : view==="library" ? (
              <motion.div key="library" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
                <LibraryView stories={stories} onSelectStory={handleSelectStory} onGenerate={()=>setView("generate")}/>
              </motion.div>
            ) : view==="generate" ? (
              <motion.div key="generate" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
                <div className="mb-6">
                  <button onClick={()=>setView("library")} className="flex items-center gap-2 font-display" style={{color:C.blue}}>
                    <ArrowLeft size={18}/> Back to Library
                  </button>
                </div>
                <StoryGenerator onGenerated={handleGenerated} lang={lang} onLangChange={setLang}/>
              </motion.div>
            ) : view==="reader" && activeStory ? (
              <motion.div key="reader" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
                <StoryReader story={activeStory} lang={lang} onBack={()=>setView("library")}/>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </main>

        <footer className="relative z-10 text-center py-8 font-body text-slate-400 text-sm border-t border-slate-100">
          <button onClick={()=>setView("hero")} className="inline-flex items-center gap-2 mb-3 hover:opacity-80 transition-opacity">
            <img src="/kiddsy-logo.png" alt="Kiddsy" className="w-8 h-8 object-contain"/>
            <span className="font-display text-base" style={{color:C.blue}}>Kiddsy</span>
          </button>
          <p>Bilingual stories for families learning English together 🌍</p>
          <div className="flex justify-center gap-4 mt-2 flex-wrap">
            <button onClick={()=>handleNav("legal")}       className="hover:underline text-xs" style={{color:C.blue}}>Privacy & Terms</button>
            <button onClick={()=>handleNav("donate")}      className="hover:underline text-xs" style={{color:C.yellow}}>Support us ☕</button>
            <button onClick={()=>handleNav("collaborate")} className="hover:underline text-xs" style={{color:C.magenta}}>Collaborate</button>
          </div>
          <p className="mt-3 text-xs opacity-40">© {new Date().getFullYear()} Kiddsy · Free for every family</p>
        </footer>
      </div>
    </div>
  );
}
