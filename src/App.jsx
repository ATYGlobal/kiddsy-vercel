/**
 * src/App.jsx — Kiddsy Loop (Auth Edition)
 * Full app with Supabase Auth, user avatar in Navbar, personal library
 *
 * WRAP main.jsx with <AuthProvider>:
 *   import { AuthProvider } from "./context/AuthContext.jsx";
 *   <AuthProvider><App /></AuthProvider>
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen, Sparkles, ChevronLeft, ChevronRight, ArrowLeft,
  Wand2, Star, BookMarked, Languages, Puzzle, Music,
  HelpCircle, Heart, Users, Menu, X, LogIn, LogOut,
  Library, Save, CheckCircle, ChevronDown
} from "lucide-react";

import { useAuth }   from "./context/AuthContext.jsx";
import { saveStory } from "./lib/supabase.js";
import Auth          from "./pages/Auth.jsx";
import MyLibrary     from "./pages/MyLibrary.jsx";

// ─── Lazy page imports (your existing components) ──────────────────────────
// Copy these into src/pages/ if not already there
import Legal      from "./pages/Legal.jsx";
import Donation   from "./pages/Donation.jsx";
import Games      from "./pages/Games.jsx";
import Education  from "./pages/Education.jsx";

// ─── Brand palette ─────────────────────────────────────────────────────────
const C = {
  blue:      "#1565C0",
  blueSoft:  "#E3F2FD",
  red:       "#E53935",
  yellow:    "#F9A825",
  green:     "#43A047",
  greenSoft: "#E8F5E9",
  magenta:   "#D81B60",
  cyan:      "#00ACC1",
};

// ─── Nav items ─────────────────────────────────────────────────────────────
const NAV = [
  { id:"library",     label:"Stories",      icon:BookOpen,  color:C.blue    },
  { id:"mylibrary",   label:"My Library",   icon:Library,   color:C.green,  authRequired:true },
  { id:"games",       label:"Games",        icon:Puzzle,    color:C.red     },
  { id:"education",   label:"Learn",        icon:Music,     color:C.cyan    },
  { id:"legal",       label:"Help",         icon:HelpCircle,color:C.magenta },
  { id:"donate",      label:"Donate ☕",    icon:Heart,     color:C.yellow  },
  { id:"collaborate", label:"Collaborate",  icon:Users,     color:C.magenta },
];

// ─── Floating stars ────────────────────────────────────────────────────────
function StarField() {
  const stars = Array.from({ length: 14 }, (_, i) => ({
    id:i, x:Math.random()*100, y:Math.random()*100,
    size:Math.random()*12+6, delay:Math.random()*4,
    duration:Math.random()*3+3, opacity:Math.random()*0.3+0.08,
  }));
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {stars.map((s) => (
        <motion.div key={s.id} className="absolute select-none"
          style={{ left:`${s.x}%`, top:`${s.y}%`, fontSize:s.size, opacity:s.opacity, color:C.yellow }}
          animate={{ y:[0,-14,0], rotate:[0,180,360], opacity:[s.opacity,s.opacity*2,s.opacity] }}
          transition={{ duration:s.duration, delay:s.delay, repeat:Infinity, ease:"easeInOut" }}
        >★</motion.div>
      ))}
    </div>
  );
}

// ─── Animated Kiddsy bouncing loader ──────────────────────────────────────
export function KiddsyLoader({ message="Loading magic…" }) {
  const LETTERS = ["K","i","d","d","s","y"];
  const COLORS  = [C.blue,C.blue,C.red,C.yellow,C.green,C.blue];
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-5">
      <div className="flex gap-1">
        {LETTERS.map((l,i) => (
          <motion.span key={i} className="font-display text-5xl" style={{color:COLORS[i]}}
            animate={{y:[0,-18,0]}}
            transition={{ duration:0.7, delay:i*0.1, repeat:Infinity, ease:"easeInOut" }}
          >{l}</motion.span>
        ))}
      </div>
      <motion.p animate={{opacity:[0.5,1,0.5]}} transition={{duration:1.5,repeat:Infinity}} className="font-body text-slate-500">
        {message}
      </motion.p>
    </div>
  );
}

// ─── Language picker ───────────────────────────────────────────────────────
const LANG_LABELS = { es:"Español", fr:"Français", ar:"العربية" };
const LANG_FLAGS  = { es:"🇪🇸", fr:"🇫🇷", ar:"🇸🇦" };

function LanguagePicker({ value, onChange }) {
  return (
    <div className="flex items-center gap-1 bg-white/80 backdrop-blur-sm rounded-full p-1.5 shadow-sm border border-white">
      {Object.entries(LANG_LABELS).map(([code, label]) => (
        <button key={code} onClick={() => onChange(code)}
          className="px-3 py-1.5 rounded-full font-display text-sm transition-all"
          style={{ background:value===code?C.blue:"transparent", color:value===code?"white":"#6B7280" }}
        >
          {LANG_FLAGS[code]} {label}
        </button>
      ))}
    </div>
  );
}

// ─── User avatar / menu ────────────────────────────────────────────────────
function UserMenu({ onNav }) {
  const { firstName, avatarUrl, logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <motion.button
        onClick={() => setOpen((o) => !o)}
        whileHover={{ scale: 1.04 }}
        className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-white/80 border-2 border-white shadow-sm"
        style={{ color: C.blue }}
      >
        {/* Avatar */}
        {avatarUrl ? (
          <img src={avatarUrl} alt={firstName} className="w-8 h-8 rounded-full object-cover border-2" style={{ borderColor: C.yellow }} />
        ) : (
          <div className="w-8 h-8 rounded-full flex items-center justify-center font-display text-white text-sm" style={{ background: C.blue }}>
            {firstName.charAt(0).toUpperCase()}
          </div>
        )}
        <span className="font-display text-sm hidden sm:inline max-w-[100px] truncate">{firstName}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={14} />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            className="absolute right-0 top-full mt-2 w-48 bg-white rounded-3xl shadow-xl border-2 border-white overflow-hidden z-50"
          >
            <button
              onClick={() => { onNav("mylibrary"); setOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-3 font-display text-sm hover:bg-blue-50 transition-colors"
              style={{ color: C.blue }}
            >
              <Library size={16} /> My Library
            </button>
            <div className="h-px bg-slate-100 mx-3" />
            <button
              onClick={() => { logout(); setOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-3 font-display text-sm hover:bg-red-50 transition-colors"
              style={{ color: C.red }}
            >
              <LogOut size={16} /> Sign Out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Navbar ────────────────────────────────────────────────────────────────
function Navbar({ view, onNav }) {
  const { isAuthenticated, loading } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const visibleNav = NAV.filter((n) => !n.authRequired || isAuthenticated);

  return (
    <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-md border-b-2 border-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        {/* Logo */}
        <button onClick={() => { onNav("library"); setMenuOpen(false); }} className="flex items-center gap-3 flex-shrink-0">
          <motion.div whileHover={{ rotate:[-3,3,0], scale:1.08 }} transition={{ duration:0.4 }}
            className="w-12 h-12 rounded-2xl overflow-hidden shadow-md border-2 flex items-center justify-center"
            style={{ borderColor:C.yellow, background:C.blueSoft }}
          >
            {/*
              Replace with real logo:
              <img src={logoUrl} alt="Kiddsy Loop" className="w-full h-full object-contain" />
            */}
            <span className="font-display text-lg" style={{color:C.blue}}>K</span>
            <span className="font-display text-lg" style={{color:C.red}}>L</span>
          </motion.div>
          <div className="leading-none hidden sm:block">
            <div className="font-display text-2xl">
              <span style={{color:C.blue}}>Kiddsy</span>
              <span style={{color:C.red}}>Loop</span>
            </div>
            <span className="font-body text-xs text-slate-400">Learning together ✨</span>
          </div>
        </button>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center">
          {visibleNav.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const isActive = view === item.id;
            return (
              <button key={item.id} onClick={() => onNav(item.id)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-2xl font-display text-sm transition-all"
                style={{ background:isActive?item.color:"transparent", color:isActive?"white":"#6B7280" }}
              >
                <Icon size={14}/>{item.label}
              </button>
            );
          })}
        </nav>

        {/* Right: Auth section */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {loading ? (
            <div className="w-8 h-8 rounded-full border-2 border-blue-300 border-t-transparent animate-spin" />
          ) : isAuthenticated ? (
            <UserMenu onNav={onNav} />
          ) : (
            <motion.button
              whileHover={{ scale:1.04 }} whileTap={{ scale:0.96 }}
              onClick={() => onNav("auth")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl font-display text-sm text-white shadow-md"
              style={{ background:`linear-gradient(135deg,${C.blue},#42A5F5)` }}
            >
              <LogIn size={15}/> Sign In
            </motion.button>
          )}

          {/* Mobile hamburger */}
          <button onClick={() => setMenuOpen((o) => !o)}
            className="lg:hidden w-10 h-10 rounded-xl flex items-center justify-center bg-white/80 shadow-sm"
            style={{color:C.blue}}
          >
            {menuOpen ? <X size={20}/> : <Menu size={20}/>}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{height:0,opacity:0}} animate={{height:"auto",opacity:1}} exit={{height:0,opacity:0}}
            className="lg:hidden border-t border-slate-100 bg-white/95 backdrop-blur-md overflow-hidden"
          >
            <div className="px-4 py-3 grid grid-cols-2 gap-2">
              {visibleNav.map((item) => {
                const Icon = item.icon;
                const isActive = view === item.id;
                return (
                  <button key={item.id}
                    onClick={() => { onNav(item.id); setMenuOpen(false); }}
                    className="flex items-center gap-2 px-4 py-3 rounded-2xl font-display text-sm transition-all"
                    style={{ background:isActive?item.color:"#F8FAFC", color:isActive?"white":"#4B5563" }}
                  >
                    <Icon size={15}/>{item.label}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

// ─── Story cover card ──────────────────────────────────────────────────────
function StoryCoverCard({ story, onClick, index }) {
  return (
    <motion.button onClick={onClick}
      initial={{opacity:0,y:30}} animate={{opacity:1,y:0}}
      transition={{delay:index*0.07,type:"spring",stiffness:200}}
      whileHover={{scale:1.04}} whileTap={{scale:0.97}}
      className="group relative w-full text-left"
    >
      <div className="absolute left-0 top-2 bottom-2 w-3 rounded-l-lg bg-black/15 blur-[2px]"/>
      <div className={`relative bg-gradient-to-br ${story.color||"from-blue-400 to-cyan-300"} rounded-3xl overflow-hidden border-4 border-white shadow-lg min-h-[170px]`}>
        <div className="relative p-5 flex flex-col h-full min-h-[170px]">
          <div className="text-5xl mb-2 drop-shadow">{story.emoji}</div>
          <h3 className="font-display text-white text-lg leading-tight flex-1 drop-shadow-sm">{story.title}</h3>
          <div className="flex items-center gap-1.5 text-white/75 font-body text-xs mt-2">
            <BookOpen size={12}/>{story.pages?.length??0} pages
          </div>
        </div>
        <div className="absolute inset-0 rounded-3xl bg-white/0 group-hover:bg-white/15 transition-colors flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity font-display text-sm px-4 py-2 bg-white rounded-full shadow-md" style={{color:C.blue}}>
            Read ✨
          </div>
        </div>
      </div>
    </motion.button>
  );
}

// ─── Story Reader ──────────────────────────────────────────────────────────
function StoryReader({ story, lang, onBack }) {
  const [pageIdx, setPageIdx] = useState(0);
  const [direction, setDirection] = useState(1);
  const page = story.pages[pageIdx];
  const total = story.pages.length;

  useEffect(() => {
    const onKey = (e) => {
      if (e.key==="ArrowRight") { if (pageIdx<total-1){setDirection(1);setPageIdx(p=>p+1);} }
      if (e.key==="ArrowLeft")  { if (pageIdx>0){setDirection(-1);setPageIdx(p=>p-1);} }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pageIdx, total]);

  const pv = {
    enter: (d) => ({x:d>0?80:-80, opacity:0}),
    center: {x:0, opacity:1},
    exit: (d) => ({x:d>0?-80:80, opacity:0}),
  };

  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="flex items-center gap-2 font-display" style={{color:C.blue}}>
          <ArrowLeft size={20}/> Library
        </button>
        <div className="flex items-center gap-2 bg-white/80 rounded-full px-4 py-2 shadow-sm">
          <span className="text-2xl">{story.emoji}</span>
          <span className="font-display" style={{color:C.blue}}>{story.title}</span>
        </div>
        <div className="font-display text-slate-400 text-sm">{pageIdx+1}/{total}</div>
      </div>

      <AnimatePresence mode="wait" custom={direction}>
        <motion.div key={pageIdx} custom={direction} variants={pv} initial="enter" animate="center" exit="exit"
          transition={{type:"spring",stiffness:300,damping:30}}
        >
          <div className={`bg-gradient-to-br ${story.color||"from-blue-400 to-cyan-300"} p-1.5 rounded-4xl shadow-xl`}>
            <div className="bg-amber-50 rounded-4xl p-8 md:p-12 min-h-[320px] flex flex-col justify-between">
              <div className="flex justify-between items-center mb-6">
                <div className="flex gap-1">
                  {Array.from({length:total}).map((_,i)=>(
                    <div key={i} className="h-2 rounded-full transition-all"
                      style={{background:i===pageIdx?C.blue:"#E2E8F0", width:i===pageIdx?24:8}}/>
                  ))}
                </div>
                <span className="text-xl opacity-50">{story.emoji}</span>
              </div>
              <div className="flex-1 flex items-center">
                <p className="font-display text-3xl md:text-4xl text-slate-800 leading-relaxed text-center w-full">{page.en}</p>
              </div>
              <div className="mt-6 pt-6 border-t-2 border-dashed border-slate-200 text-center" dir={lang==="ar"?"rtl":"ltr"}>
                <div className="inline-flex items-center gap-2 mb-2 font-body text-xs font-semibold uppercase tracking-widest" style={{color:`${C.blue}80`}}>
                  <Languages size={12}/>{LANG_FLAGS[lang]} {LANG_LABELS[lang]}
                </div>
                <p className="font-body text-xl md:text-2xl font-semibold italic" style={{color:C.blue}}>
                  {page[lang] || page.es}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="flex items-center justify-between mt-8">
        <motion.button whileHover={{scale:1.05}} whileTap={{scale:0.95}}
          onClick={()=>{setDirection(-1);setPageIdx(p=>Math.max(0,p-1));}}
          disabled={pageIdx===0}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl font-display text-lg bg-white shadow-sm border border-slate-100 disabled:opacity-30"
          style={{color:C.blue}}
        ><ChevronLeft size={22}/> Previous</motion.button>

        {pageIdx===total-1?(
          <motion.button whileHover={{scale:1.05}} whileTap={{scale:0.95}} onClick={onBack}
            className="flex items-center gap-2 px-8 py-3 rounded-2xl font-display text-lg text-white shadow-lg"
            style={{background:`linear-gradient(135deg,${C.yellow},#FF8F00)`}}
          ><Star size={18}/> Finished! 🎉</motion.button>
        ):(
          <motion.button whileHover={{scale:1.05}} whileTap={{scale:0.95}}
            onClick={()=>{setDirection(1);setPageIdx(p=>Math.min(total-1,p+1));}}
            className="flex items-center gap-2 px-8 py-3 rounded-2xl font-display text-lg text-white shadow-lg"
            style={{background:C.blue}}
          >Next <ChevronRight size={22}/></motion.button>
        )}
      </div>
    </motion.div>
  );
}

// ─── Story Generator ───────────────────────────────────────────────────────
function StoryGenerator({ onGenerated }) {
  const { user, isAuthenticated } = useAuth();
  const [childName, setChildName] = useState("");
  const [theme, setTheme]         = useState("");
  const [lang, setLang]           = useState("es");
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");
  const [saved, setSaved]         = useState(false);

  const THEMES = [
    {label:"🏫 Going to School", value:"going to school for the first time"},
    {label:"🌈 Making Friends",  value:"making new friends"},
    {label:"🛒 Supermarket",     value:"shopping at the supermarket"},
    {label:"🚌 Taking the Bus",  value:"taking the bus"},
    {label:"🏥 Doctor Visit",    value:"visiting the doctor"},
    {label:"🎉 Birthday Party",  value:"celebrating a birthday"},
  ];

  const handleGenerate = async () => {
    if (!childName.trim() || !theme) return;
    setLoading(true); setError(""); setSaved(false);
    try {
      const res = await fetch("/api/generate-story", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({childName:childName.trim(), theme, language:lang}),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error||"Generation failed");

      // Auto-save if logged in
      if (isAuthenticated && user) {
        try { await saveStory(user.id, data); setSaved(true); } catch {}
      }

      onGenerated(data, lang);
    } catch(e) {
      setError(e.message||"Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="max-w-xl mx-auto">
      <div className="bg-white/90 backdrop-blur-md rounded-4xl shadow-xl border-4 border-white p-8 md:p-10">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3 animate-bounce">🪄</div>
          <h2 className="font-display text-3xl" style={{color:C.blue}}>Create a Magic Story</h2>
          {isAuthenticated && (
            <div className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full font-body text-xs font-semibold" style={{background:C.greenSoft,color:C.green}}>
              <Save size={11}/> Story will be saved to your library
            </div>
          )}
        </div>

        <div className="space-y-5">
          <div>
            <label className="block font-display text-slate-600 text-sm mb-2">✏️ Child's name</label>
            <input type="text" value={childName} onChange={(e)=>setChildName(e.target.value)}
              placeholder="e.g. Sofia, Omar, Lucas…" maxLength={20}
              className="w-full px-5 py-3.5 rounded-2xl border-2 border-slate-200 font-body text-lg focus:outline-none focus:border-blue-400 bg-amber-50 transition-colors placeholder-slate-300"
            />
          </div>
          <div>
            <label className="block font-display text-slate-600 text-sm mb-2">🌟 Story theme</label>
            <div className="grid grid-cols-2 gap-2">
              {THEMES.map((t)=>(
                <button key={t.value} onClick={()=>setTheme(t.value)}
                  className="px-3 py-2.5 rounded-xl font-body text-sm text-left transition-all"
                  style={{background:theme===t.value?C.blue:"#F8FAFC",color:theme===t.value?"white":"#4B5563",border:`2px solid ${theme===t.value?C.blue:"#E2E8F0"}`}}
                >{t.label}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="block font-display text-slate-600 text-sm mb-2">🌍 Translation language</label>
            <LanguagePicker value={lang} onChange={setLang}/>
          </div>
          {error && <div className="bg-red-50 border border-red-200 text-red-600 rounded-2xl px-4 py-3 font-body text-sm">⚠️ {error}</div>}
          {saved && (
            <motion.div initial={{scale:0.9}} animate={{scale:1}}
              className="flex items-center gap-2 rounded-2xl px-4 py-3 font-body text-sm"
              style={{background:C.greenSoft,color:C.green}}
            >
              <CheckCircle size={16}/> Story saved to your library!
            </motion.div>
          )}
          <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.98}}
            onClick={handleGenerate} disabled={!childName.trim()||!theme||loading}
            className="w-full py-4 rounded-2xl font-display text-xl text-white shadow-lg transition-all"
            style={{background:childName.trim()&&theme&&!loading?`linear-gradient(135deg,${C.blue},#42A5F5)`:"#E5E7EB",color:childName.trim()&&theme&&!loading?"white":"#9CA3AF",cursor:childName.trim()&&theme&&!loading?"pointer":"not-allowed"}}
          >
            {loading?"✨ Writing the story…":"🪄 Generate Story"}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Library view ──────────────────────────────────────────────────────────
function Library({ stories, lang, onSelectStory, onGenerate }) {
  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}}>
      <div className="text-center mb-10">
        <h2 className="font-display text-4xl md:text-5xl mb-3" style={{color:C.blue}}>Story Library 📚</h2>
        <p className="font-body text-slate-500 text-lg">Pick a story or create your own! ✨</p>
      </div>
      <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.98}} onClick={onGenerate}
        className="w-full mb-8 py-5 rounded-4xl text-white font-display text-xl shadow-xl border-4 border-white flex items-center justify-center gap-3"
        style={{background:`linear-gradient(135deg,${C.yellow},#FF8F00)`}}
      ><Wand2 size={24}/> Create a Personalized Story ✨ <Sparkles size={20}/></motion.button>

      {stories.length === 0 ? (
        <div className="text-center py-16 text-slate-400 font-body">
          <div className="text-5xl mb-3">📡</div><p>Connecting to the story server…</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {stories.map((story,i) => (
            <StoryCoverCard key={story.id} story={story} index={i} onClick={()=>onSelectStory(story)}/>
          ))}
        </div>
      )}
    </motion.div>
  );
}

// ─── Collaborate page ──────────────────────────────────────────────────────
function Collaborate() {
  const [form, setForm] = useState({name:"",role:"educator",email:"",message:""});
  const [sent, setSent] = useState(false);
  const ROLES = [{value:"educator",label:"👩‍🏫 Teacher"},{value:"writer",label:"✍️ Writer"},{value:"volunteer",label:"🙋 Volunteer"},{value:"developer",label:"💻 Developer"},{value:"other",label:"🌟 Other"}];
  const handleSubmit = () => {
    const sub=encodeURIComponent(`Kiddsy Collaboration — ${form.role}`);
    const body=encodeURIComponent(`Name: ${form.name}\nRole: ${form.role}\nEmail: ${form.email}\n\n${form.message}`);
    window.open(`mailto:hello@kiddsyloop.com?subject=${sub}&body=${body}`);
    setSent(true);
  };
  return (
    <div className="min-h-screen" style={{background:"linear-gradient(150deg,#FCE4EC 0%,#E3F2FD 100%)"}}>
      <div className="max-w-xl mx-auto px-4 py-14">
        <div className="text-center mb-8"><div className="text-6xl mb-3">🤝</div>
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
              <div key={f.k}><label className="block font-display text-slate-600 text-sm mb-1">{f.lbl}</label>
                <input type={f.k==="email"?"email":"text"} value={form[f.k]}
                  onChange={e=>setForm({...form,[f.k]:e.target.value})}
                  placeholder={f.ph}
                  className="w-full px-5 py-3 rounded-2xl border-2 border-slate-200 font-body focus:outline-none focus:border-pink-400 bg-pink-50 placeholder-slate-300"/>
              </div>
            ))}
            <div>
              <label className="block font-display text-slate-600 text-sm mb-1">🎭 I am a…</label>
              <div className="grid grid-cols-2 gap-2">
                {ROLES.map(r=>(
                  <button key={r.value} onClick={()=>setForm({...form,role:r.value})}
                    className="px-3 py-2 rounded-xl font-body text-sm text-left transition-all"
                    style={{background:form.role===r.value?C.magenta:"#FDF2F8",color:form.role===r.value?"white":"#4B5563",border:`2px solid ${form.role===r.value?C.magenta:"#FCE7F3"}`}}
                  >{r.label}</button>
                ))}
              </div>
            </div>
            <div><label className="block font-display text-slate-600 text-sm mb-1">💬 Message</label>
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

// ─── Main App ──────────────────────────────────────────────────────────────
export default function App() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [view, setView]             = useState("library");
  const [lang, setLang]             = useState("es");
  const [stories, setStories]       = useState([]);
  const [activeStory, setActiveStory] = useState(null);

  useEffect(() => {
    fetch("/api/stories").then(r=>r.json()).then(setStories).catch(()=>{});
  }, []);

  const handleSelectStory = (story) => {
    setActiveStory(story); setView("reader");
    window.scrollTo({top:0,behavior:"smooth"});
  };

  const handleGenerated = (story, chosenLang) => {
    setLang(chosenLang);
    setStories(prev=>[story,...prev]);
    setActiveStory(story); setView("reader");
    window.scrollTo({top:0,behavior:"smooth"});
  };

  const handleNav = (id) => {
    // Guard auth-required pages
    if (id==="mylibrary" && !isAuthenticated) { setView("auth"); return; }
    setView(id); setActiveStory(null);
    window.scrollTo({top:0,behavior:"smooth"});
  };

  // After login, redirect away from auth page
  useEffect(() => {
    if (isAuthenticated && view==="auth") setView("mylibrary");
  }, [isAuthenticated]);

  // Initial auth loading spinner
  if (authLoading) return <KiddsyLoader message="Checking your session…"/>;

  const FULL_PAGES = {
    games:       <Games/>,
    education:   <Education/>,
    legal:       <Legal/>,
    donate:      <Donation/>,
    collaborate: <Collaborate/>,
    auth:        <Auth/>,
    mylibrary: (
      <MyLibrary
        onCreateStory={()=>handleNav("generate")}
        onReadStory={(story)=>handleSelectStory(story)}
      />
    ),
  };

  return (
    <div className="min-h-screen relative" style={{background:"#FFFDE7"}}>
      <StarField/>
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-8" style={{background:C.blue}}/>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-8" style={{background:C.yellow}}/>
      </div>

      <div className="relative z-10">
        <Navbar view={view} onNav={handleNav}/>

        {/* Lang picker for story views */}
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
                <Library stories={stories} lang={lang} onSelectStory={handleSelectStory} onGenerate={()=>setView("generate")}/>
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
          <div className="font-display text-xl mb-1">
            <span style={{color:C.blue}}>Kiddsy</span><span style={{color:C.red}}>Loop</span>
          </div>
          <p>Bilingual stories for families learning English together 🌍</p>
          <div className="flex justify-center gap-4 mt-2">
            <button onClick={()=>handleNav("legal")} className="hover:underline text-xs" style={{color:C.blue}}>Privacy & Terms</button>
            <button onClick={()=>handleNav("donate")} className="hover:underline text-xs" style={{color:C.yellow}}>Support us ☕</button>
            <button onClick={()=>handleNav("collaborate")} className="hover:underline text-xs" style={{color:C.magenta}}>Collaborate</button>
          </div>
        </footer>
      </div>
    </div>
  );
}
