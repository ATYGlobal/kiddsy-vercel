/**
 * src/components/Navbar.jsx — Kiddsy
 * ─────────────────────────────────────────────────────────────────────────
 * Extraído de App.jsx. Contiene:
 *   · LANGUAGES array + getLang()
 *   · LanguagePicker dropdown
 *   · Navbar (desktop + mobile + "More" dropdown + Trustpilot)
 *
 * Exports:
 *   default        → Navbar          props: { view, onNav, lang, onLangChange }
 *   named          → LanguagePicker  props: { value, onChange, fullWidth? }
 *   named          → getLang(code)
 *   named          → LANGUAGES
 * ─────────────────────────────────────────────────────────────────────────
 */
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen, Puzzle, Music, HelpCircle, Heart,
  Users, Menu, X, Library, ChevronDown,
  Search, Cat, Globe, Star, Gamepad2,
} from "lucide-react";
import EmojiSvg from "../utils/EmojiSvg.jsx";
import Games from "../pages/Games.jsx";
import { GameStickerTile } from "./KiddsyIcons.jsx";
import { NAV_TRANSLATIONS } from "../data/navbarTranslations.js";
import { LANGUAGES, getLang } from "../utils/langConfig.js";

// ── Brand colours ─────────────────────────────────────────────────────────
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

export { LANGUAGES, getLang };

// ═══════════════════════════════════════════════════════════════════════════
// ─── LANGUAGE PICKER ──────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════
export function LanguagePicker({ value = "en", onChange, fullWidth = false }) {
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
          minWidth:       fullWidth ? "100%" : 140,
          width:          fullWidth ? "100%" : "auto",
          justifyContent: "space-between",
        }}
      >
        <span style={{ display:"flex", alignItems:"center", gap:6 }}>
          <Globe size={15} style={{ flexShrink:0 }}/>
          <span style={{ fontSize:18, lineHeight:1 }}>
            <EmojiSvg code={selected.flagCode} size={18} />
          </span>
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
              left:           fullWidth ? 0 : "50%",
              transform:      fullWidth ? "none" : "translateX(-50%)",
              width:          fullWidth ? "100%" : 220,
              background:     "white",
              borderRadius:   20,
              border:         "2.5px solid rgba(21,101,192,0.12)",
              boxShadow:      "0 16px 48px rgba(21,101,192,0.18), 0 4px 12px rgba(0,0,0,0.08)",
              overflow:       "visible",
              maxHeight:      360,
              overflowY:      "auto",
              scrollbarWidth: "thin",
              zIndex:         50,
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
                    display:    "flex",
                    alignItems: "center",
                    gap:        10,
                    width:      "100%",
                    padding:    "9px 14px",
                    border:     "none",
                    background: isActive ? C.blueSoft : "transparent",
                    cursor:     "pointer",
                    fontFamily: "var(--font-body,'Nunito',sans-serif)",
                    fontWeight: isActive ? 700 : 500,
                    fontSize:   14,
                    color:      isActive ? C.blue : "#374151",
                    textAlign:  "left",
                    transition: "background 0.12s",
                    borderLeft: isActive ? `3px solid ${C.blue}` : "3px solid transparent",
                  }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "#F0F9FF"; }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
                >
                  <span style={{ fontSize:20, lineHeight:1, flexShrink:0 }}>
                    <EmojiSvg code={lang.flagCode} size={20} />
                  </span>
                  <span style={{ flex:1 }}>{lang.name}</span>
                  {isActive && (
                    <span style={{ width:7, height:7, borderRadius:"50%", background:C.blue, flexShrink:0 }}/>
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
// ─── NAV CONFIG ───────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════
const NAV_PRIMARY = [
  { id:"library",    labelKey:"library",     icon:BookOpen, color:C.blue    },
  { id:"mylibrary",  labelKey:"mylibrary",   icon:Library,  color:C.green   },
  { id:"games",      labelKey:"games",       icon:Gamepad2, color:C.red     },
  { id:"wordsearch", labelKey:"wordsearch",  icon:Search,   color:C.cyan    },
  { id:"puzzles",    labelKey:"puzzles",     icon:Puzzle,   color:C.green   },
  { id:"education",  labelKey:"education",   icon:Music,    color:C.orange  },
];
const NAV_SECONDARY = [
  { id:"legal",       labelKey:"legal",       icon:HelpCircle, color:C.magenta },
  { id:"subscription",labelKey:"donate",      icon:Heart,      color:C.yellow  },
  { id:"collaborate", labelKey:"collaborate", icon:Users,      color:C.magenta },
];
const ALL_NAV = [...NAV_PRIMARY, ...NAV_SECONDARY];

// ═══════════════════════════════════════════════════════════════════════════
// ─── NAVBAR ───────────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════
export default function Navbar({ view, onNav, lang, onLangChange }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef(null);
  // Diccionario a prueba de fallos (elimina los /tlibrary feos)
  const FALLBACK_LABELS = {
    library: "Stories", mylibrary: "My Library", games: "Games",
    wordsearch: "Word Search", puzzles: "Puzzles", education: "Learn ABC",
    legal: "Help & FAQ", subscription: "Support Us", collaborate: "Collaborate"
  };

  const t = (key) => {
    // 1. Intenta buscar la traducción
    // 2. Si falla, usa nuestro Fallback limpio
    // 3. Si todo falla, usa la llave pero en mayúscula
    return NAV_TRANSLATIONS?.[key]?.[lang] 
        || NAV_TRANSLATIONS?.[key]?.en 
        || FALLBACK_LABELS[key] 
        || key.charAt(0).toUpperCase() + key.slice(1);
  };
  // Close "more" dropdown on outside click
  useEffect(() => {
    const h = e => { if (moreRef.current && !moreRef.current.contains(e.target)) setMoreOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <header style={{
      position:             "sticky",
      top:                  0,
      zIndex:               50,
      background:           "rgba(255,255,255,0.75)",
      backdropFilter:       "blur(16px)",
      WebkitBackdropFilter: "blur(16px)",
      borderBottom:         "2px solid rgba(255,255,255,0.9)",
      boxShadow:            "0 2px 20px rgba(21,101,192,0.07)",
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
          gap:            2,
          flex:           1,
          justifyContent: "center",
          flexWrap:       "nowrap",
          overflow:       "visible",
          minWidth:       0,
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
                    display:    "flex",
                    alignItems: "center",
                    gap:        4,
                    padding:    "7px 10px",
                    borderRadius: 999,
                    border:     "none",
                    background: isActive ? item.color : "transparent",
                    color:      isActive ? "white" : "#64748B",
                    fontFamily: "var(--font-display,'Nunito',sans-serif)",
                    fontWeight: 700,
                    fontSize:   12,
                    cursor:     "pointer",
                    transition: "background 0.18s, color 0.18s",
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                    boxShadow:  isActive ? `0 4px 14px ${item.color}40` : "none",
                  }}
                >
                  <Icon size={14} strokeWidth={2.2}/>
                  {t(item.labelKey)}  {/* ← CORREGIDO */}
                </motion.button>
              );
            })}

          {/* ── More dropdown ── */}
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
                color:      NAV_SECONDARY.some(s=>s.id===view) ? "white"   : "#64748B",
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
                    position:     "absolute",
                    top:          "calc(100% + 8px)",
                    left:         "50%",
                    transform:    "translateX(-50%)",
                    width:        180,
                    background:   "white",
                    borderRadius: 16,
                    border:       "2px solid rgba(21,101,192,0.1)",
                    boxShadow:    "0 16px 40px rgba(0,0,0,0.12)",
                    overflow:     "hidden",
                    zIndex:       60,
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
                            color:      isActive ? "white"   : "#374151",
                            fontFamily: "var(--font-display,'Nunito',sans-serif)",
                            fontWeight: 600,
                            fontSize:   13,
                            cursor:     "pointer",
                            textAlign:  "left",
                          }}
                          onMouseEnter={e => { if (!isActive) e.currentTarget.style.background="#F8FAFC"; }}
                          onMouseLeave={e => { if (!isActive) e.currentTarget.style.background="transparent"; }}
                        >
                          <Icon size={14}/> {t(item.labelKey)} 
                        </button>
                      );
                    })}
                  {/* ── Trustpilot ── */}
                  <a
                    href="https://www.trustpilot.com/evaluate/kiddsy.vercel.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMoreOpen(false)}
                    style={{
                      display:        "flex",
                      alignItems:     "center",
                      gap:            8,
                      width:          "100%",
                      padding:        "10px 14px",
                      borderTop:      "1px solid #F1F5F9",
                      background:     "transparent",
                      color:          "#00B67A",
                      fontFamily:     "var(--font-display,'Nunito',sans-serif)",
                      fontWeight:     700,
                      fontSize:       13,
                      cursor:         "pointer",
                      textDecoration: "none",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background="#F0FDF4"; }}
                    onMouseLeave={e => { e.currentTarget.style.background="transparent"; }}
                  >
                    <Star size={14} fill="#00B67A" color="#00B67A" strokeWidth={2}/> Rate us on Trustpilot
                  </a>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>

        {/* ── Right: Language picker + hamburger ── */}
        <div style={{ display:"flex", alignItems:"center", gap:8, flexShrink:0 }}>
          <div className="desktop-lang">
            <LanguagePicker value={lang} onChange={onLangChange}/>
          </div>
          <motion.button
            onClick={() => setMenuOpen(o => !o)}
            whileTap={{ scale:0.9 }}
            className="mobile-menu-btn"
            style={{
              width:         42,
              height:        42,
              borderRadius:  12,
              border:        "2px solid rgba(21,101,192,0.12)",
              background:    "white",
              display:       "flex",
              alignItems:    "center",
              justifyContent:"center",
              cursor:        "pointer",
              color:         C.blue,
              flexShrink:    0,
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
                        color:        isActive ? "white"    : "#374151",
                        fontFamily:   "var(--font-display,'Nunito',sans-serif)",
                        fontWeight:   700,
                        fontSize:     13,
                        cursor:       "pointer",
                        textAlign:    "left",
                      }}
                    >
                      <Icon size={15}/> {t(item.labelKey)}  {/* ← CAMBIA item.label por t(item.labelKey) */}
                    </motion.button>
                  );
                })}
              {/* ── Trustpilot mobile ── */}
              <a
                href="https://www.trustpilot.com/evaluate/kiddsy.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMenuOpen(false)}
                style={{
                  display:        "flex",
                  alignItems:     "center",
                  gap:            8,
                  padding:        "12px 14px",
                  borderRadius:   16,
                  border:         "2px solid #D1FAE5",
                  background:     "#F0FDF4",
                  color:          "#00B67A",
                  fontFamily:     "var(--font-display,'Nunito',sans-serif)",
                  fontWeight:     700,
                  fontSize:       13,
                  cursor:         "pointer",
                  textDecoration: "none",
                }}
              >
                <Star size={15} fill="#00B67A" color="#00B67A" strokeWidth={2}/> Trustpilot
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Responsive CSS injected inline ── */}
      <style>{`
        .desktop-nav     { display: flex   !important; }
        .desktop-lang    { display: block  !important; }
        .mobile-menu-btn { display: none   !important; }
        .sm-show         { display: inline !important; }
        @media (max-width: 860px) {
          .desktop-nav     { display: none !important; }
          .desktop-lang    { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
        @media (max-width: 480px) {
          .sm-show { display: none !important; }
        }
      `}</style>
    </header>
  );
}