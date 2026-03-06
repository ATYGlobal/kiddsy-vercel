/**
 * src/App.jsx — Kiddsy
 * ─────────────────────────────────────────────────────────────────────────
 * CAMBIOS EN ESTA VERSIÓN:
 *  • StoryReader rediseñado: libro mágico con efecto de página real,
 *    sombras dramáticas y gradientes únicos por cuento
 *  • GeneratingLoader: animación animada con personalidad de color del cuento
 *  • Árabe RTL correcto en el lector
 *  • fetch a http://localhost:10000 conservado (sin cambios)
 *  • KiddsyLogo importado desde componente (sin duplicado)
 * ─────────────────────────────────────────────────────────────────────────
 */
import KiddsyLogo from "./components/KiddsyLogo.jsx";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen, Sparkles, ChevronLeft, ChevronRight, ArrowLeft,
  Wand2, Star, Languages, Puzzle, Music, HelpCircle, Heart,
  Users, Menu, X, LogIn, LogOut, Library, Save,
  CheckCircle, ChevronDown, Search, Cat
} from "lucide-react";

import { useAuth }   from "./context/AuthContext.jsx";
import { saveStory } from "./lib/supabase.js";

import Auth         from "./pages/Auth.jsx";
import MyLibrary    from "./pages/MyLibrary.jsx";
import Legal        from "./pages/Legal.jsx";
import Donation     from "./pages/Donation.jsx";
import Games        from "./pages/Games.jsx";
import Education    from "./pages/Education.jsx";
import WordSearch   from "./pages/WordSearch.jsx";
import AnimalPuzzle from "./pages/AnimalPuzzle.jsx";

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

// Extrae colores semánticos del campo `color` del cuento (ej. "from-yellow-400 to-orange-300")
function getStoryAccent(colorClass = "") {
  if (colorClass.includes("yellow") || colorClass.includes("amber") || colorClass.includes("orange"))
    return { primary: "#F59E0B", soft: "#FFFBEB", text: "#92400E" };
  if (colorClass.includes("purple") || colorClass.includes("indigo") || colorClass.includes("violet"))
    return { primary: "#7C3AED", soft: "#EDE9FE", text: "#4C1D95" };
  if (colorClass.includes("red") || colorClass.includes("rose") || colorClass.includes("pink"))
    return { primary: "#E53935", soft: "#FFF1F2", text: "#881337" };
  if (colorClass.includes("green") || colorClass.includes("emerald") || colorClass.includes("teal"))
    return { primary: "#059669", soft: "#ECFDF5", text: "#064E3B" };
  if (colorClass.includes("cyan"))
    return { primary: "#0891B2", soft: "#ECFEFF", text: "#164E63" };
  // default: blue
  return { primary: "#1565C0", soft: "#EFF6FF", text: "#1E3A5F" };
}

// ─── Nav ──────────────────────────────────────────────────────────────────
const NAV_PRIMARY = [
  { id:"library",    label:"Stories",     icon:BookOpen, color:C.blue    },
  { id:"mylibrary",  label:"My Library",  icon:Library,  color:C.green,  authRequired:true },
  { id:"games",      label:"Games",       icon:Puzzle,   color:C.red     },
  { id:"wordsearch", label:"Word Search", icon:Search,   color:C.cyan    },
  { id:"animals",    label:"Animals 🐾",  icon:Cat,      color:C.green   },
  { id:"education",  label:"Learn ABC",   icon:Music,    color:C.orange  },
];
const NAV_SECONDARY = [
  { id:"legal",      label:"Help & FAQ",  icon:HelpCircle, color:C.magenta },
  { id:"donate",     label:"Donate ☕",   icon:Heart,      color:C.yellow  },
  { id:"collaborate",label:"Collaborate", icon:Users,      color:C.magenta },
];
const ALL_NAV = [...NAV_PRIMARY, ...NAV_SECONDARY];

// ─── Estrellas de fondo ────────────────────────────────────────────────────
function StarField() {
  const stars = Array.from({ length:14 }, (_,i) => ({
    id:i, x:Math.random()*100, y:Math.random()*100,
    size:Math.random()*12+6, delay:Math.random()*4,
    duration:Math.random()*3+3, opacity:Math.random()*0.22+0.06,
  }));
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {stars.map(s=>(
        <motion.div key={s.id} className="absolute select-none"
          style={{left:`${s.x}%`,top:`${s.y}%`,fontSize:s.size,opacity:s.opacity,color:C.yellow}}
          animate={{y:[0,-14,0],rotate:[0,180,360],opacity:[s.opacity,s.opacity*2.2,s.opacity]}}
          transition={{duration:s.duration,delay:s.delay,repeat:Infinity,ease:"easeInOut"}}
        >★</motion.div>
      ))}
    </div>
  );
}

// ─── Loader Kiddsy ────────────────────────────────────────────────────────
function KiddsyLoader({ message="Loading magic…" }) {
  const LETTERS = ["K","i","d","d","s","y"];
  const COLORS  = [C.blue,C.blue,C.red,C.yellow,C.green,C.blue];
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-5">
      <div className="flex gap-1">
        {LETTERS.map((l,i)=>(
          <motion.span key={i} className="font-display text-5xl" style={{color:COLORS[i]}}
            animate={{y:[0,-18,0]}}
            transition={{duration:0.7,delay:i*0.1,repeat:Infinity,ease:"easeInOut"}}
          >{l}</motion.span>
        ))}
      </div>
      <motion.p animate={{opacity:[0.5,1,0.5]}} transition={{duration:1.5,repeat:Infinity}}
        className="font-body text-slate-500"
      >{message}</motion.p>
    </div>
  );
}

// ─── Loader animado MIENTRAS LA IA GENERA ─────────────────────────────────
// Usa la personalidad de color del cuento que se está generando
function GeneratingLoader({ childName, theme, storyColor }) {
  const accent = getStoryAccent(storyColor);
  const emojis = ["✨","📖","🌟","🪄","💫","🌈","⭐","🎨"];
  const particles = Array.from({length:12},(_,i)=>({
    id:i,
    x: Math.random()*80+10,
    y: Math.random()*60+20,
    emoji: emojis[i%emojis.length],
    delay: Math.random()*1.5,
    duration: Math.random()*1.5+2,
  }));

  return (
    <motion.div
      initial={{opacity:0}} animate={{opacity:1}}
      className="flex flex-col items-center justify-center min-h-[60vh] relative overflow-hidden rounded-4xl px-8 py-16"
      style={{background:`linear-gradient(145deg, ${accent.soft}, white)`}}
    >
      {/* Partículas flotantes */}
      {particles.map(p=>(
        <motion.span key={p.id} className="absolute text-2xl pointer-events-none select-none"
          style={{left:`${p.x}%`,top:`${p.y}%`}}
          animate={{y:[0,-30,0], opacity:[0,0.7,0], scale:[0.6,1.2,0.6]}}
          transition={{duration:p.duration,delay:p.delay,repeat:Infinity,ease:"easeInOut"}}
        >{p.emoji}</motion.span>
      ))}

      {/* Ícono central con gradiente del cuento */}
      <motion.div
        animate={{scale:[1,1.12,1],rotate:[0,-5,5,0]}}
        transition={{duration:2,repeat:Infinity,ease:"easeInOut"}}
        className={`w-28 h-28 rounded-4xl bg-gradient-to-br ${storyColor||"from-blue-400 to-cyan-300"} flex items-center justify-center shadow-2xl mb-8 border-4 border-white`}
      >
        <span className="text-5xl">🪄</span>
      </motion.div>

      {/* Texto animado */}
      <motion.h2 className="font-display text-3xl md:text-4xl text-center mb-3"
        style={{color:accent.text}}
        animate={{opacity:[0.7,1,0.7]}}
        transition={{duration:1.5,repeat:Infinity}}
      >
        Writing {childName}'s story…
      </motion.h2>
      <p className="font-body text-lg text-center mb-8" style={{color:`${accent.text}80`}}>
        About <strong>{theme}</strong>
      </p>

      {/* Barra de progreso indeterminada con color del cuento */}
      <div className="w-64 h-3 rounded-full overflow-hidden" style={{background:`${accent.primary}20`}}>
        <motion.div
          className="h-full rounded-full"
          style={{background:`linear-gradient(90deg, ${accent.primary}, ${accent.primary}99)`}}
          animate={{x:["-100%","100%"]}}
          transition={{duration:1.4,repeat:Infinity,ease:"easeInOut"}}
        />
      </div>

      <p className="font-body text-xs mt-4" style={{color:`${accent.text}60`}}>
        Gemini AI is creating a bilingual story just for them ✨
      </p>
    </motion.div>
  );
}

// ─── Selector de idioma ────────────────────────────────────────────────────
const LANG_LABELS = { es:"Español", fr:"Français", ar:"العربية" };
const LANG_FLAGS  = { es:"🇪🇸", fr:"🇫🇷", ar:"🇸🇦" };

function LanguagePicker({ value, onChange }) {
  return (
    <div className="flex items-center gap-1 bg-white/80 backdrop-blur-sm rounded-full p-1.5 shadow-sm border border-white">
      {Object.entries(LANG_LABELS).map(([code, label])=>(
        <button key={code} onClick={()=>onChange(code)}
          className="px-3 py-1.5 rounded-full font-display text-sm transition-all"
          style={{background:value===code?C.blue:"transparent",color:value===code?"white":"#6B7280"}}
        >{LANG_FLAGS[code]} {label}</button>
      ))}
    </div>
  );
}

// ─── Menú usuario ──────────────────────────────────────────────────────────
function UserMenu({ onNav }) {
  const { firstName, avatarUrl, logout } = useAuth();
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <motion.button onClick={()=>setOpen(o=>!o)} whileHover={{scale:1.04}}
        className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-white/80 border-2 border-white shadow-sm"
        style={{color:C.blue}}
      >
        {avatarUrl
          ? <img src={avatarUrl} alt={firstName} className="w-8 h-8 rounded-full object-cover border-2" style={{borderColor:C.yellow}}/>
          : <div className="w-8 h-8 rounded-full flex items-center justify-center font-display text-white text-sm" style={{background:C.blue}}>{firstName.charAt(0).toUpperCase()}</div>
        }
        <span className="font-display text-sm hidden sm:inline max-w-[100px] truncate">{firstName}</span>
        <motion.div animate={{rotate:open?180:0}} transition={{duration:0.2}}><ChevronDown size={14}/></motion.div>
      </motion.button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{opacity:0,y:-8,scale:0.95}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:-8,scale:0.95}}
            className="absolute right-0 top-full mt-2 w-48 bg-white rounded-3xl shadow-xl border-2 border-white overflow-hidden z-50"
          >
            <button onClick={()=>{onNav("mylibrary");setOpen(false);}}
              className="w-full flex items-center gap-3 px-4 py-3 font-display text-sm hover:bg-blue-50 transition-colors" style={{color:C.blue}}
            ><Library size={16}/> My Library</button>
            <div className="h-px bg-slate-100 mx-3"/>
            <button onClick={()=>{logout();setOpen(false);}}
              className="w-full flex items-center gap-3 px-4 py-3 font-display text-sm hover:bg-red-50 transition-colors" style={{color:C.red}}
            ><LogOut size={16}/> Sign Out</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Navbar ────────────────────────────────────────────────────────────────
function Navbar({ view, onNav }) {
  const { isAuthenticated, loading:authLoading } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const visibleNav = ALL_NAV.filter(n=>!n.authRequired||isAuthenticated);

  return (
    <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-md border-b-2 border-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-2">
        <button onClick={()=>{onNav("library");setMenuOpen(false);}} className="flex-shrink-0">
          <KiddsyLogo size="md" animate showTagline />
        </button>

        <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center flex-wrap">
          {NAV_PRIMARY.filter(n=>!n.authRequired||isAuthenticated).map(item=>{
            const Icon=item.icon; const isActive=view===item.id;
            return (
              <button key={item.id} onClick={()=>onNav(item.id)}
                className="flex items-center gap-1 px-3 py-2 rounded-2xl font-display text-sm transition-all"
                style={{background:isActive?item.color:"transparent",color:isActive?"white":"#6B7280"}}
              ><Icon size={13}/> {item.label}</button>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 flex-shrink-0">
          {authLoading
            ? <div className="w-8 h-8 rounded-full border-2 border-blue-300 border-t-transparent animate-spin"/>
            : isAuthenticated
              ? <UserMenu onNav={onNav}/>
              : (
                <motion.button whileHover={{scale:1.04}} whileTap={{scale:0.96}}
                  onClick={()=>onNav("auth")}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-2xl font-display text-sm text-white shadow-md"
                  style={{background:`linear-gradient(135deg,${C.blue},#42A5F5)`}}
                ><LogIn size={15}/> Sign In</motion.button>
              )
          }
          <button onClick={()=>setMenuOpen(o=>!o)}
            className="lg:hidden w-10 h-10 rounded-xl flex items-center justify-center bg-white/80 shadow-sm"
            style={{color:C.blue}}
          >{menuOpen?<X size={20}/>:<Menu size={20}/>}</button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{height:0,opacity:0}} animate={{height:"auto",opacity:1}} exit={{height:0,opacity:0}}
            className="lg:hidden border-t border-slate-100 bg-white/95 backdrop-blur-md overflow-hidden"
          >
            <div className="px-4 py-3 grid grid-cols-2 gap-2">
              {visibleNav.map(item=>{
                const Icon=item.icon; const isActive=view===item.id;
                return (
                  <button key={item.id} onClick={()=>{onNav(item.id);setMenuOpen(false);}}
                    className="flex items-center gap-2 px-4 py-3 rounded-2xl font-display text-sm transition-all"
                    style={{background:isActive?item.color:"#F8FAFC",color:isActive?"white":"#4B5563"}}
                  ><Icon size={15}/> {item.label}</button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

// ─── Portada de cuento ────────────────────────────────────────────────────
function StoryCoverCard({ story, onClick, index }) {
  return (
    <motion.button onClick={onClick}
      initial={{opacity:0,y:30}} animate={{opacity:1,y:0}}
      transition={{delay:index*0.07,type:"spring",stiffness:200}}
      whileHover={{scale:1.04,y:-4}} whileTap={{scale:0.97}}
      className="group relative w-full text-left"
    >
      {/* Lomo del libro */}
      <div className="absolute left-0 top-2 bottom-2 w-3 rounded-l-xl bg-black/20 blur-sm"/>
      <div className={`relative bg-gradient-to-br ${story.color||"from-blue-400 to-cyan-300"} rounded-3xl overflow-hidden border-4 border-white min-h-[180px]`}
        style={{boxShadow:"0 12px 40px rgba(0,0,0,0.18), 0 4px 12px rgba(0,0,0,0.1)"}}>
        {/* Patrón de textura sutil */}
        <div className="absolute inset-0 opacity-10"
          style={{backgroundImage:"repeating-linear-gradient(45deg,white 0,white 1px,transparent 0,transparent 50%)",backgroundSize:"8px 8px"}}/>
        <div className="relative p-5 flex flex-col h-full min-h-[180px]">
          <div className="text-5xl mb-2 drop-shadow-lg">{story.emoji}</div>
          <h3 className="font-display text-white text-lg leading-tight flex-1 drop-shadow">{story.title}</h3>
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
// ─── LECTOR DE CUENTOS — Diseño "libro mágico" mejorado ──────────────────
// ═══════════════════════════════════════════════════════════════════════════
function StoryReader({ story, lang, onBack }) {
  const [pageIdx, setPageIdx]   = useState(0);
  const [direction, setDirection] = useState(1);
  const page  = story.pages[pageIdx];
  const total = story.pages.length;
  const accent = getStoryAccent(story.color);

  useEffect(()=>{
    const onKey = e => {
      if (e.key==="ArrowRight" && pageIdx<total-1) { setDirection(1);  setPageIdx(p=>p+1); }
      if (e.key==="ArrowLeft"  && pageIdx>0)       { setDirection(-1); setPageIdx(p=>p-1); }
    };
    window.addEventListener("keydown", onKey);
    return ()=>window.removeEventListener("keydown", onKey);
  }, [pageIdx, total]);

  // Variantes de transición tipo "vuelta de página"
  const pageVariants = {
    enter:  d => ({ x: d>0 ? "60%"  : "-60%", opacity:0, rotateY: d>0 ? 15 : -15, scale:0.92 }),
    center:  { x:"0%", opacity:1, rotateY:0, scale:1 },
    exit:   d => ({ x: d>0 ? "-60%" : "60%",  opacity:0, rotateY: d>0 ? -15 : 15, scale:0.92 }),
  };

  const isArabic = lang === "ar";

  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} className="max-w-3xl mx-auto">

      {/* Cabecera */}
      <div className="flex items-center justify-between mb-6 px-1">
        <motion.button whileHover={{scale:1.05}} whileTap={{scale:0.95}}
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 rounded-2xl font-display text-sm bg-white/80 shadow-sm border border-white"
          style={{color:C.blue}}
        ><ArrowLeft size={18}/> Library</motion.button>

        <div className="flex items-center gap-2 bg-white/80 backdrop-blur rounded-full px-4 py-2 shadow-sm border border-white">
          <span className="text-2xl">{story.emoji}</span>
          <span className="font-display text-sm" style={{color:C.blue}}>{story.title}</span>
        </div>

        <div className="font-display text-sm px-4 py-2 rounded-2xl bg-white/80 shadow-sm border border-white"
          style={{color:accent.text}}
        >{pageIdx+1} / {total}</div>
      </div>

      {/* ── El libro ── */}
      <div className="relative" style={{perspective:"1200px"}}>
        {/* Sombra del libro en la mesa */}
        <div className="absolute -bottom-4 left-4 right-4 h-8 rounded-full blur-2xl opacity-30"
          style={{background:accent.primary}}/>

        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={pageIdx}
            custom={direction}
            variants={pageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{type:"spring", stiffness:240, damping:28}}
            style={{transformStyle:"preserve-3d"}}
          >
            {/* Portada del libro — borde con gradiente del cuento */}
            <div className={`bg-gradient-to-br ${story.color||"from-blue-400 to-cyan-300"} p-[5px] rounded-4xl`}
              style={{boxShadow:`0 24px 60px ${accent.primary}40, 0 8px 20px rgba(0,0,0,0.15), -6px 0 0 ${accent.primary}30`}}
            >
              {/* Interior de la página */}
              <div className="relative bg-gradient-to-b from-amber-50 to-orange-50 rounded-4xl overflow-hidden min-h-[400px] md:min-h-[460px]">

                {/* Margen izquierdo (lomo) */}
                <div className="absolute left-0 inset-y-0 w-6 opacity-10"
                  style={{background:`linear-gradient(90deg, ${accent.primary}60, transparent)`}}/>

                {/* Decoración de esquinas */}
                <div className="absolute top-4 left-8 text-3xl opacity-20 rotate-12">{story.emoji}</div>
                <div className="absolute bottom-4 right-6 text-2xl opacity-15 -rotate-12">{story.emoji}</div>

                <div className="relative px-8 md:px-14 py-10 flex flex-col h-full min-h-[400px]">
                  {/* Indicador de progreso */}
                  <div className="flex gap-1.5 mb-8">
                    {Array.from({length:total}).map((_,i)=>(
                      <motion.div key={i}
                        className="h-2 rounded-full transition-all duration-300"
                        style={{
                          background: i<pageIdx
                            ? `${accent.primary}60`
                            : i===pageIdx
                              ? accent.primary
                              : "#E2E8F0",
                          width: i===pageIdx ? 32 : 8,
                        }}
                        layout
                      />
                    ))}
                    <div className="ml-auto font-body text-xs text-slate-400 self-center">
                      Page {pageIdx+1}
                    </div>
                  </div>

                  {/* ── Texto en inglés ── */}
                  <div className="flex-1 flex items-center justify-center py-6">
                    <motion.p
                      key={`en-${pageIdx}`}
                      initial={{opacity:0, y:12}}
                      animate={{opacity:1, y:0}}
                      transition={{delay:0.1, duration:0.4}}
                      className="font-display text-3xl md:text-4xl text-slate-800 leading-relaxed text-center"
                      style={{
                        textShadow:"0 1px 2px rgba(0,0,0,0.06)",
                        fontVariantLigatures:"common-ligatures",
                      }}
                    >
                      {page.en}
                    </motion.p>
                  </div>

                  {/* ── Separador decorativo ── */}
                  <div className="flex items-center gap-3 my-4">
                    <div className="flex-1 h-px" style={{background:`${accent.primary}25`}}/>
                    <motion.span
                      animate={{rotate:[0,10,-10,0], scale:[1,1.2,1]}}
                      transition={{duration:3, repeat:Infinity, ease:"easeInOut"}}
                      className="text-xl"
                    >{story.emoji}</motion.span>
                    <div className="flex-1 h-px" style={{background:`${accent.primary}25`}}/>
                  </div>

                  {/* ── Traducción ── */}
                  <motion.div
                    key={`tr-${pageIdx}`}
                    initial={{opacity:0, y:8}}
                    animate={{opacity:1, y:0}}
                    transition={{delay:0.2, duration:0.4}}
                    className="text-center pb-4"
                    dir={isArabic ? "rtl" : "ltr"}
                  >
                    <div className="inline-flex items-center gap-2 mb-2.5 px-3 py-1 rounded-full"
                      style={{background:`${accent.primary}15`}}>
                      <Languages size={12} style={{color:accent.primary}}/>
                      <span className="font-body text-xs font-semibold uppercase tracking-widest" style={{color:accent.primary}}>
                        {LANG_FLAGS[lang]} {LANG_LABELS[lang]}
                      </span>
                    </div>
                    <p
                      className="font-body text-2xl md:text-3xl font-semibold leading-relaxed"
                      style={{
                        color: accent.text,
                        fontStyle: isArabic ? "normal" : "italic",
                        letterSpacing: isArabic ? "0.02em" : "normal",
                        lineHeight: isArabic ? "2" : "1.5",
                      }}
                    >
                      {page[lang] || page.es}
                    </p>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Controles de navegación ── */}
      <div className="flex items-center justify-between mt-10 px-1">
        <motion.button whileHover={{scale:1.05}} whileTap={{scale:0.95}}
          onClick={()=>{setDirection(-1);setPageIdx(p=>Math.max(0,p-1));}}
          disabled={pageIdx===0}
          className="flex items-center gap-2 px-6 py-3.5 rounded-2xl font-display text-base bg-white shadow-md border-2 border-white disabled:opacity-30 disabled:cursor-not-allowed"
          style={{color:C.blue}}
        >
          <ChevronLeft size={20}/> Previous
        </motion.button>

        {/* Puntos de página */}
        <div className="flex gap-2">
          {Array.from({length:total}).map((_,i)=>(
            <button key={i} onClick={()=>{setDirection(i>pageIdx?1:-1);setPageIdx(i);}}
              className="w-2.5 h-2.5 rounded-full transition-all duration-200"
              style={{background:i===pageIdx?accent.primary:"#CBD5E1",
                transform:i===pageIdx?"scale(1.4)":"scale(1)"}}
            />
          ))}
        </div>

        {pageIdx===total-1 ? (
          <motion.button whileHover={{scale:1.05}} whileTap={{scale:0.95}} onClick={onBack}
            className="flex items-center gap-2 px-7 py-3.5 rounded-2xl font-display text-base text-white shadow-xl"
            style={{background:`linear-gradient(135deg,${C.yellow},#FF8F00)`,
              boxShadow:"0 8px 24px rgba(249,168,37,0.4)"}}
          ><Star size={18}/> Finished! 🎉</motion.button>
        ) : (
          <motion.button whileHover={{scale:1.05}} whileTap={{scale:0.95}}
            onClick={()=>{setDirection(1);setPageIdx(p=>Math.min(total-1,p+1));}}
            className="flex items-center gap-2 px-7 py-3.5 rounded-2xl font-display text-base text-white shadow-xl"
            style={{background:`linear-gradient(135deg,${accent.primary},${accent.primary}CC)`,
              boxShadow:`0 8px 24px ${accent.primary}40`}}
          >Next <ChevronRight size={20}/></motion.button>
        )}
      </div>
    </motion.div>
  );
}

// ─── Generador de cuentos ─────────────────────────────────────────────────
function StoryGenerator({ onGenerated }) {
  const { user, isAuthenticated } = useAuth();
  const [childName, setChildName] = useState("");
  const [theme, setTheme]         = useState("");
  const [lang, setLang]           = useState("es");
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");
  const [saved, setSaved]         = useState(false);

  // Para pasar al GeneratingLoader
  const [selectedThemeLabel, setSelectedThemeLabel] = useState("");

  const THEMES = [
    { label:"🏫 Going to School",  value:"going to school for the first time" },
    { label:"🌈 Making Friends",   value:"making new friends" },
    { label:"🛒 Supermarket",      value:"shopping at the supermarket" },
    { label:"🚌 Taking the Bus",   value:"taking the bus" },
    { label:"🏥 Doctor Visit",     value:"visiting the doctor" },
    { label:"🎉 Birthday Party",   value:"celebrating a birthday" },
  ];

  const handleGenerate = async () => {
    if (!childName.trim()||!theme) return;
    setLoading(true); setError(""); setSaved(false);
    try {
      const res = await fetch("http://localhost:10000/api/generate-story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ childName: childName.trim(), theme, language: lang }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error||"Generation failed");
      if (isAuthenticated && user) {
        try { await saveStory(user.id, data); setSaved(true); } catch {}
      }
      onGenerated(data, lang);
    } catch(e) {
      setError(e.message||"Something went wrong!");
      setLoading(false);
    }
  };

  // Detectar color del tema elegido para el loader
  const themeColorMap = {
    "going to school": "from-blue-400 to-cyan-300",
    "making new friends": "from-green-400 to-emerald-300",
    "shopping": "from-orange-400 to-amber-300",
    "taking the bus": "from-yellow-400 to-amber-300",
    "doctor": "from-red-400 to-rose-300",
    "birthday": "from-pink-400 to-rose-300",
  };
  const loaderColor = Object.entries(themeColorMap).find(([k])=>theme.includes(k))?.[1]
    || "from-blue-400 to-cyan-300";

  if (loading) {
    return <GeneratingLoader childName={childName} theme={selectedThemeLabel||theme} storyColor={loaderColor}/>;
  }

  return (
    <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="max-w-xl mx-auto">
      <div className="bg-white/90 backdrop-blur-md rounded-4xl shadow-xl border-4 border-white p-8 md:p-10">
        <div className="text-center mb-8">
          <motion.div animate={{rotate:[-8,8,-8]}} transition={{duration:2,repeat:Infinity,ease:"easeInOut"}}
            className="text-5xl mb-3 inline-block"
          >🪄</motion.div>
          <h2 className="font-display text-3xl" style={{color:C.blue}}>Create a Magic Story</h2>
          {isAuthenticated && (
            <div className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full font-body text-xs font-semibold"
              style={{background:C.greenSoft,color:C.green}}
            ><Save size={11}/> Story will be saved to your library</div>
          )}
        </div>

        <div className="space-y-5">
          <div>
            <label className="block font-display text-slate-600 text-sm mb-2">✏️ Child's name</label>
            <input type="text" value={childName} onChange={e=>setChildName(e.target.value)}
              placeholder="e.g. Sofia, Omar, Lucas…" maxLength={20}
              className="w-full px-5 py-3.5 rounded-2xl border-2 border-slate-200 font-body text-lg focus:outline-none focus:border-blue-400 bg-amber-50 transition-colors placeholder-slate-300"
            />
          </div>
          <div>
            <label className="block font-display text-slate-600 text-sm mb-2">🌟 Story theme</label>
            <div className="grid grid-cols-2 gap-2">
              {THEMES.map(t=>(
                <button key={t.value}
                  onClick={()=>{setTheme(t.value);setSelectedThemeLabel(t.label);}}
                  className="px-3 py-2.5 rounded-xl font-body text-sm text-left transition-all"
                  style={{background:theme===t.value?C.blue:"#F8FAFC",color:theme===t.value?"white":"#4B5563",
                    border:`2px solid ${theme===t.value?C.blue:"#E2E8F0"}`}}
                >{t.label}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="block font-display text-slate-600 text-sm mb-2">🌍 Translation language</label>
            <LanguagePicker value={lang} onChange={setLang}/>
          </div>

          {error && (
            <motion.div initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}}
              className="bg-red-50 border border-red-200 text-red-600 rounded-2xl px-4 py-3 font-body text-sm flex items-start gap-2"
            >
              <span>⚠️</span><span>{error}</span>
            </motion.div>
          )}
          {saved && (
            <motion.div initial={{scale:0.9}} animate={{scale:1}}
              className="flex items-center gap-2 rounded-2xl px-4 py-3 font-body text-sm"
              style={{background:C.greenSoft,color:C.green}}
            ><CheckCircle size={16}/> Story saved to your library!</motion.div>
          )}

          <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.98}}
            onClick={handleGenerate}
            disabled={!childName.trim()||!theme}
            className="w-full py-4 rounded-2xl font-display text-xl text-white shadow-lg transition-all"
            style={{
              background:childName.trim()&&theme
                ?`linear-gradient(135deg,${C.blue},#42A5F5)`:"#E5E7EB",
              color:childName.trim()&&theme?"white":"#9CA3AF",
              cursor:childName.trim()&&theme?"pointer":"not-allowed",
              boxShadow:childName.trim()&&theme?"0 8px 24px rgba(21,101,192,0.35)":"none",
            }}
          >🪄 Generate Story</motion.button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Vista biblioteca ─────────────────────────────────────────────────────
function LibraryView({ stories, onSelectStory, onGenerate }) {
  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}}>
      <div className="text-center mb-10">
        <h2 className="font-display text-4xl md:text-5xl mb-3" style={{color:C.blue}}>Story Library 📚</h2>
        <p className="font-body text-slate-500 text-lg">Pick a story or create your own! ✨</p>
      </div>
      <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.98}} onClick={onGenerate}
        className="w-full mb-8 py-5 rounded-4xl text-white font-display text-xl shadow-xl border-4 border-white flex items-center justify-center gap-3"
        style={{background:`linear-gradient(135deg,${C.yellow},#FF8F00)`,
          boxShadow:"0 12px 36px rgba(249,168,37,0.35)"}}
      ><Wand2 size={24}/> Create a Personalized Story ✨ <Sparkles size={20}/></motion.button>

      {stories.length===0 ? (
        <div className="text-center py-16 text-slate-400 font-body">
          <motion.div animate={{y:[0,-8,0]}} transition={{duration:2,repeat:Infinity}} className="text-5xl mb-3">📡</motion.div>
          <p>Connecting to the story server…</p>
          <p className="text-xs mt-1 opacity-60">Make sure <code>node api/server.js</code> is running on port 10000</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {stories.map((story,i)=>(
            <StoryCoverCard key={story.id} story={story} index={i} onClick={()=>onSelectStory(story)}/>
          ))}
        </div>
      )}
    </motion.div>
  );
}

// ─── Colaborar ────────────────────────────────────────────────────────────
function Collaborate() {
  const [form,setForm]=useState({name:"",role:"educator",email:"",message:""});
  const [sent,setSent]=useState(false);
  const ROLES=[
    {value:"educator",label:"👩‍🏫 Teacher"},
    {value:"writer",label:"✍️ Writer"},
    {value:"volunteer",label:"🙋 Volunteer"},
    {value:"developer",label:"💻 Developer"},
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
  const { isAuthenticated, loading:authLoading } = useAuth();
  const [view, setView]           = useState("library");
  const [lang, setLang]           = useState("es");
  const [stories, setStories]     = useState([]);
  const [activeStory, setActiveStory] = useState(null);

  useEffect(()=>{
    // fetch directo a http://localhost:10000 (tu configuración actual)
    fetch("http://localhost:10000/api/stories")
      .then(r=>r.json())
      .then(data=>setStories(data))
      .catch(err=>console.error("Error cargando biblioteca:", err));
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
    if (id==="mylibrary"&&!isAuthenticated) { setView("auth"); return; }
    setView(id); setActiveStory(null);
    window.scrollTo({top:0,behavior:"smooth"});
  };

  useEffect(()=>{
    if (isAuthenticated && view==="auth") setView("mylibrary");
  },[isAuthenticated]);

  if (authLoading) return <KiddsyLoader message="Checking your session…"/>;

  const FULL_PAGES = {
    games:       <Games/>,
    wordsearch:  <WordSearch/>,
    animals:     <AnimalPuzzle/>,
    education:   <Education/>,
    legal:       <Legal/>,
    donate:      <Donation/>,
    collaborate: <Collaborate/>,
    auth:        <Auth/>,
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
        <Navbar view={view} onNav={handleNav}/>

        {["library","reader","generate"].includes(view) && (
          <div className="flex justify-center pt-5 px-4">
            <LanguagePicker value={lang} onChange={setLang}/>
          </div>
        )}

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
                <StoryGenerator onGenerated={handleGenerated}/>
              </motion.div>
            ) : view==="reader" && activeStory ? (
              <motion.div key="reader" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
                <StoryReader story={activeStory} lang={lang} onBack={()=>setView("library")}/>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </main>

        <footer className="relative z-10 text-center py-8 font-body text-slate-400 text-sm border-t border-slate-100">
          <KiddsyLogo size="sm" className="justify-center mb-2"/>
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
