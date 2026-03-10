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
 *  • Supabase: saveStory / fetchGuestStories con Guest ID
 *  • SW update toast: aviso cuando hay nueva versión disponible
 *  • Trustpilot link en menú "More"
 *  • Guest mode banner en LibraryView
 * ─────────────────────────────────────────────────────────────────────────
 */
import KiddsyTitle from './components/KiddsyTitle';
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen, Sparkles, ChevronLeft, ChevronRight, ArrowLeft,
  Wand2, RefreshCw, X,
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
import Legal        from "./pages/LegalPages.jsx";
import Donation     from "./pages/Donation.jsx";
import Games        from "./pages/Games.jsx";
import Education    from "./pages/Education.jsx";
import WordSearch   from "./pages/WordSearch.jsx";
import PuzzleMaster from "./pages/PuzzleMaster.jsx";
import { StoryCoverIcon } from "./components/KiddsyIcons.jsx";

// ── Componentes extraídos ──────────────────────────────────────────────────
import Navbar, { LANGUAGES, getLang, LanguagePicker } from "./components/Navbar.jsx";
import Footer                                          from "./components/Footer.jsx";
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

const getGuestId = () => {
  let gid = localStorage.getItem('kiddsy_guest_id');
  if (!gid) {
    gid = crypto.randomUUID(); // Genera un ID único para este navegador
    localStorage.setItem('kiddsy_guest_id', gid);
  }
  return gid;
};

// ─── Supabase client (lazy init — no falla si no está configurado) ─────────
// Para activar: npm install @supabase/supabase-js y añade las vars en .env
// VITE_SUPABASE_URL=https://xxxx.supabase.co
// VITE_SUPABASE_ANON_KEY=your-anon-key
let _supabase = null;
function getSupabase() {
  if (_supabase) return _supabase;
  try {
    const url  = import.meta.env.VITE_SUPABASE_URL;
    const key  = import.meta.env.VITE_SUPABASE_ANON_KEY;
    if (!url || !key) return null;
    // Dynamic import evita error si el paquete no está instalado
    // Si usas Supabase, importa createClient en la cabecera y descomenta:
    // const { createClient } = await import("@supabase/supabase-js");
    // _supabase = createClient(url, key);
    return null; // placeholder hasta que actives Supabase
  } catch { return null; }
}

/**
 * Guarda un cuento en Supabase (usuario real o guest).
 * Fallback: solo localStorage si Supabase no está configurado.
 */
async function saveStory(storyData, userId) {
  const sb = getSupabase();
  if (sb) {
    const { error } = await sb.from("stories").insert([{
      ...storyData,
      user_id: userId,
    }]);
    if (error) console.error("[Kiddsy] Supabase save error:", error.message);
  }
  // Siempre guardamos en localStorage como backup local
  const existing = lsGet(LS_STORIES, []);
  lsSet(LS_STORIES, [storyData, ...existing].slice(0, 20));
}

/**
 * Lee los cuentos del usuario (Supabase si disponible, si no localStorage).
 */
async function fetchUserStories(userId) {
  const sb = getSupabase();
  if (sb) {
    const { data, error } = await sb
      .from("stories")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (!error && data) return data;
    console.error("[Kiddsy] Supabase fetch error:", error?.message);
  }
  return lsGet(LS_STORIES, []);
}
// ── AnimatedBg CSS keyframes — inyectado una sola vez ─────────────────────
function KiddsyBgStyles() {
  return (
    <style>{`
      @keyframes bgDrift {
        0%   { background-position: 0% 50%; }
        50%  { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      .kiddsy-bg-drift {
        background-size: 300% 300%;
        animation: bgDrift 18s ease infinite;
      }
      @keyframes bgPulse {
        0%, 100% { opacity: 1; }
        50%       { opacity: 0.82; }
      }
      .kiddsy-bg-pulse {
        animation: bgPulse 8s ease-in-out infinite;
      }
    `}</style>
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
// ─── SW UPDATE TOAST ──────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════
function SwUpdateToast() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handler = () => setShow(true);
    window.addEventListener("kiddsy-sw-update", handler);
    return () => window.removeEventListener("kiddsy-sw-update", handler);
  }, []);

  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0,  opacity: 1 }}
        exit={{    y: 80, opacity: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        style={{
          position:     "fixed",
          bottom:       24,
          left:         "50%",
          transform:    "translateX(-50%)",
          zIndex:       9999,
          background:   "white",
          borderRadius: 20,
          boxShadow:    "0 8px 32px rgba(21,101,192,0.22), 0 2px 8px rgba(0,0,0,0.08)",
          border:       `2.5px solid ${C.blue}`,
          padding:      "14px 20px",
          display:      "flex",
          alignItems:   "center",
          gap:          12,
          maxWidth:     "calc(100vw - 32px)",
          width:        360,
        }}
      >
        <Sparkles size={22} strokeWidth={2} style={{ color:C.blue, flexShrink:0 }}/>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{
            fontFamily: "var(--font-display,'Nunito',sans-serif)",
            fontWeight: 700, fontSize: 14, color: C.blue, margin: 0,
          }}>New magic available!</p>
          <p style={{
            fontFamily: "var(--font-body,'Nunito',sans-serif)",
            fontSize: 12, color: "#64748B", margin: "2px 0 0",
          }}>A fresh version of Kiddsy is ready.</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          onClick={() => window.location.reload()}
          style={{
            display:      "flex",
            alignItems:   "center",
            gap:          6,
            padding:      "8px 14px",
            borderRadius: 999,
            border:       "none",
            background:   `linear-gradient(135deg, ${C.blue}, #42A5F5)`,
            color:        "white",
            fontFamily:   "var(--font-display,'Nunito',sans-serif)",
            fontWeight:   700,
            fontSize:     13,
            cursor:       "pointer",
            whiteSpace:   "nowrap",
            flexShrink:   0,
          }}
        >
          <RefreshCw size={13}/> Update
        </motion.button>
        <button
          onClick={() => setShow(false)}
          style={{
            background: "none", border: "none", cursor: "pointer",
            color: "#94A3B8", padding: 4, flexShrink: 0,
            display: "flex", alignItems: "center",
          }}
        ><X size={16}/></button>
      </motion.div>
    </AnimatePresence>
  );
}


function GeneratingLoader({ childName, theme, storyColor, streamText }) {
  const accent = getStoryAccent(storyColor);
  const emojis = ["✨","📖","🌟","🪄","💫","🌈","⭐","🎨"];
  const particles = Array.from({length:12},(_,i)=>({
    id:i, x:Math.random()*80+10, y:Math.random()*60+20,
    emoji:emojis[i%emojis.length], delay:Math.random()*1.5, duration:Math.random()*1.5+2,
  }));

  // Extract a readable preview from the partial streaming JSON
  const previewSentence = (() => {
    if (!streamText) return "";
    const m = streamText.match(/"en"\s*:\s*"([^"]{10,})"/);
    if (m) return m[1];
    const t = streamText.match(/"title"\s*:\s*"([^"]{4,})"/);
    if (t) return "✨ " + t[1];
    return "";
  })();

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
      <motion.h2 className="font-display text-3xl md:text-4xl text-center mb-2"
        style={{color:accent.text}} animate={{opacity:[0.7,1,0.7]}} transition={{duration:1.5,repeat:Infinity}}
      >Writing {childName}'s story…</motion.h2>
      <p className="font-body text-lg text-center mb-5" style={{color:`${accent.text}80`}}>
        About <strong>{theme}</strong>
      </p>
      <AnimatePresence>
        {previewSentence && (
          <motion.div
            initial={{opacity:0,y:8,scale:0.97}}
            animate={{opacity:1,y:0,scale:1}}
            exit={{opacity:0}}
            className="w-full max-w-sm rounded-2xl px-5 py-3 mb-5 text-center font-body text-sm"
            style={{
              background:`${accent.primary}14`,
              border:`1.5px solid ${accent.primary}30`,
              color:accent.text,
            }}
          >
            <span className="opacity-50 text-xs block mb-1">✍️ Writing…</span>
            {previewSentence}
            <motion.span
              animate={{opacity:[1,0,1]}}
              transition={{duration:0.8,repeat:Infinity}}
              style={{marginLeft:2,display:"inline-block"}}
            >▍</motion.span>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="w-64 h-3 rounded-full overflow-hidden" style={{background:`${accent.primary}20`}}>
        <motion.div className="h-full rounded-full"
          style={{background:`linear-gradient(90deg, ${accent.primary}, ${accent.primary}99)`}}
          animate={{x:["-100%","100%"]}} transition={{duration:1.4,repeat:Infinity,ease:"easeInOut"}}
        />
      </div>
      <p className="font-body text-xs mt-4 text-center" style={{color:`${accent.text}60`}}>
        Kiddsy AI is spinning a magical story for you… ✨
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
  const [streamText, setStreamText] = useState(""); // live SSE preview
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
    setLoading(true); setError(""); setStreamText("");

    const API_URL = window.location.hostname === "localhost"
      ? "http://localhost:10000"
      : "https://kiddsy-vercel.onrender.com";

    try {
      const response = await fetch(`${API_URL}/api/generate-story`, {
        method:  "POST",
        headers: { "Content-Type":"application/json" },
        body:    JSON.stringify({ childName, theme: activeTheme, language: lang }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(()=>({error:"Generation failed"}));
        throw new Error(errData.error || "Generation failed");
      }

      // ── Read Groq SSE stream ─────────────────────────────────────
      const reader  = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let   buffer  = "";

      const parseData = (line) => {
        if (!line.startsWith("data:")) return null;
        try { return JSON.parse(line.slice(5).trim()); } catch { return null; }
      };

      let currentEvent = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop(); // keep incomplete last line

        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith("event:")) {
            currentEvent = trimmed.slice(6).trim();
          } else if (trimmed.startsWith("data:")) {
            const payload = parseData(trimmed);
            if (!payload) continue;

            if (currentEvent === "token" && payload.delta) {
              setStreamText(prev => prev + payload.delta);

            } else if (currentEvent === "complete") {
              const userId = getGuestId();
              await saveStory(payload, userId);
              onGenerated(payload, lang);
              return; // ← done, no need to setLoading(false)

            } else if (currentEvent === "error") {
              throw new Error(payload.error || "Kiddsy AI had a hiccup — please try again! 🪄");
            }
          }
        }
      }
      // Stream ended without "complete" event
      throw new Error("Story generation ended unexpectedly — please try again.");

    } catch(e) {
      console.error("Generation error:", e);
      const friendly = (e.message?.toLowerCase().includes("fetch") || e.message?.toLowerCase().includes("network"))
        ? "Can't reach Kiddsy AI — check your connection and try again 🌐"
        : e.message || "Something magical went wrong — please try again! 🌟";
      setError(friendly);
      setLoading(false);
      setStreamText("");
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

  if (loading) return <GeneratingLoader childName={childName} theme={selectedThemeLabel||activeTheme} storyColor={loaderColor} streamText={streamText}/>;

  const canGenerate = childName.trim() && activeTheme;

  return (
    <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="max-w-xl mx-auto">
      <div className="bg-white/90 backdrop-blur-md rounded-4xl shadow-xl border-4 border-white p-8 md:p-10">
        <div className="text-center mb-8">
          <motion.div animate={{rotate:[-8,8,-8]}} transition={{duration:2,repeat:Infinity,ease:"easeInOut"}}
            className="text-5xl mb-3 inline-block"
          >🪄</motion.div>
           <h2 style={{ lineHeight:1 }}>
            <CartoonTitle fill={C.blue} stroke="#BBDEFB" size={34}>
              Create a Magic Story
            </CartoonTitle>
          </h2>
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
            <div style={{ width:"100%" }}>
              <LanguagePicker value={lang} onChange={onLangChange} fullWidth/>
            </div>
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
function LibraryView({ stories, onSelectStory, onGenerate, isGuest }) {
  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}}>
      <div className="text-center mb-10">
        <h2 className="mb-3" style={{ lineHeight:1 }}>
          <CartoonTitle fill={C.blue} stroke="#BBDEFB" size={44}>
            Story Library
          </CartoonTitle>
        </h2>
        <p className="font-body text-slate-500 text-lg">Pick a story or create your own! ✨</p>
      </div>

      {/* ── Guest mode notice ── */}
      {isGuest && (
        <motion.div
          initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }}
          style={{
            display:      "flex",
            alignItems:   "center",
            gap:          12,
            padding:      "14px 18px",
            marginBottom: 20,
            borderRadius: 16,
            background:   "linear-gradient(135deg, #FFF8E1, #FFF3E0)",
            border:       "2px solid #FFE082",
            boxShadow:    "0 2px 12px rgba(249,168,37,0.12)",
          }}
        >
          <span style={{ fontSize: 24, flexShrink: 0 }}>👤</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{
              fontFamily: "var(--font-display,'Nunito',sans-serif)",
              fontWeight: 700, fontSize: 13, color: C.orange, margin: 0,
            }}>Using Guest Mode</p>
            <p style={{
              fontFamily: "var(--font-body,'Nunito',sans-serif)",
              fontSize: 12, color: "#92400E", margin: "2px 0 0", lineHeight: 1.4,
            }}>
              Stories are saved on this device only. Create an account to sync across devices! 🌍
            </p>
          </div>
        </motion.div>
      )}

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
  const { user } = useAuth();
  const [view,        setView]        = useState("hero");
  const [lang,        setLang]        = useState(()=>lsGet(LS_LANG,"es"));
  const [stories,     setStories]     = useState([]);
  const [activeStory, setActiveStory] = useState(null);

  // Is the current session a guest (no logged-in user)?
  const isGuest = !user;

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

  // Load user's generated stories from Supabase / localStorage
  useEffect(()=>{
    const userId = user?.id || getGuestId();
    fetchUserStories(userId).then(userStories => {
      if (userStories.length > 0) {
        setStories(prev => {
          // Merge: user stories first, then static, dedup by id
          const ids = new Set(userStories.map(s=>s.id));
          return [...userStories, ...prev.filter(s=>!ids.has(s.id))];
        });
      }
    });
  },[user]);

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
    animals:     <PuzzleMaster/>,
    education:   <Education/>,
    legal:       <Legal/>,
    donate:      <Donation/>,
    collaborate: <Collaborate/>,
    mylibrary:   <MyLibrary onCreateStory={()=>handleNav("generate")} onReadStory={handleSelectStory}/>,
  };

  return (
    <div className="min-h-screen relative kiddsy-bg-drift" style={{
      background: "linear-gradient(135deg, #FFFDE7 0%, #FFF8E1 25%, #FFF3E0 50%, #FFFDE7 75%, #F3E5F5 100%)",
    }}>
      <KiddsyBgStyles/>
      <SwUpdateToast/>
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
                <LibraryView stories={stories} onSelectStory={handleSelectStory} onGenerate={()=>setView("generate")} isGuest={isGuest}/>
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

        <Footer onNav={handleNav}/>
      </div>
    </div>
  );
}
