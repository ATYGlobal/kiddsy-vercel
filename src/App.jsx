/**
 * src/App.jsx — Kiddsy
 * Solo routing + estado global. Toda la lógica extraída a sus módulos.
 */
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wand2, Sparkles } from "lucide-react";
import { DemoBookShelf } from "./pages/StoryReader.jsx";

// ── Páginas (Asegúrate de que TODOS estén en src/pages/) ──────────────────
import HeroScreen     from "./pages/HeroScreen";
import MyLibrary      from "./pages/MyLibrary";
import StoryGenerator from "./pages/StoryGenerator";
import StoryReader, { StoryCoverCard } from "./pages/StoryReader";
import { AvisoLegal, Privacidad } from "./pages/LegalPages";
import Subscription from "./pages/Subscription";
import Games          from "./pages/Games";
import Education      from "./pages/Education";
import WordSearch     from "./pages/WordSearch";
import PuzzleMaster   from "./pages/PuzzleMaster";

// ── Componentes (Asegúrate de que TODOS estén en src/components/) ──────────
import Navbar, { LanguagePicker } from "./components/Navbar.jsx";
import { detectLang, getLang, LANGUAGES } from "./utils/langConfig.js";
import Footer         from "./components/Footer";
import SwUpdateToast  from "./components/SwUpdateToast";
import KiddsyTitle    from "./components/KiddsyTitle";
import { StoryCoverIcon } from "./components/KiddsyIcons";
import { C } from "./utils/designConfig.js";

// ── Utils (Asegúrate de que esté en src/utils/) ────────────────────────────
import {
  LS_LANG, LS_STORIES,
  lsGet, lsSet,
  getGuestId, fetchUserStories, saveStory,
} from "./utils/storage";

// ── Auth stub (reemplaza con AuthContext cuando actives login) ─────────────
function useAuth() {
  return { user: null, isAuthenticated: false, loading: false, logout: () => {} };
}



// ── Fondo animado ──────────────────────────────────────────────────────────
function KiddsyBgStyles() {
  return (
    <style>{`
      @keyframes bgDrift {
        0%   { background-position: 0% 50%; }
        50%  { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      .kiddsy-bg-drift { background-size: 300% 300%; animation: bgDrift 18s ease infinite; }
      @keyframes bgPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.82; } }
      .kiddsy-bg-pulse { animation: bgPulse 8s ease-in-out infinite; }
    `}</style>
  );
}

function StarField() {
  const stars = Array.from({ length: 12 }, (_, i) => ({
    id: i, x: Math.random() * 100, y: Math.random() * 100,
    size: Math.random() * 12 + 6, delay: Math.random() * 4,
    duration: Math.random() * 3 + 3, opacity: Math.random() * 0.18 + 0.05,
  }));
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {stars.map(s => (
        <motion.div key={s.id} className="absolute select-none"
          style={{ left: `${s.x}%`, top: `${s.y}%`, fontSize: s.size, opacity: s.opacity, color: C.yellow }}
          animate={{ y: [0, -14, 0], rotate: [0, 180, 360], opacity: [s.opacity, s.opacity * 2, s.opacity] }}
          transition={{ duration: s.duration, delay: s.delay, repeat: Infinity, ease: "easeInOut" }}
        >★</motion.div>
      ))}
    </div>
  );
}

// ── LibraryView ────────────────────────────────────────────────────────────
function LibraryView({ stories, onSelectStory, onGenerate, isGuest, lang = "en" }) {
  console.log('🔍 LibraryView recibió lang:', lang);
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="text-center mb-10">
        <h2 className="font-display text-4xl mb-3" style={{ color: C.blue }}>Story Library</h2>
        <p className="font-body text-slate-500 text-lg">Pick a story or create your own! ✨</p>
      </div>
      
      {isGuest && (
        <motion.div
          initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "9px 16px", marginBottom: 18, borderRadius: 12,
            background: "rgba(255,255,255,0.75)", backdropFilter: "blur(10px)",
            border: "1.5px solid rgba(249,168,37,0.25)",
            boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
          }}
        >
          <span style={{
            fontSize: 10, fontWeight: 700, letterSpacing: "0.08em",
            textTransform: "uppercase", color: "#B45309",
            fontFamily: "var(--font-display,'Nunito',sans-serif)",
            opacity: 0.8, flexShrink: 0,
          }}>Guest</span>
          <div style={{ width: 1, height: 14, background: "#F9A82550", flexShrink: 0 }}/>
          <p style={{
            fontFamily: "var(--font-body,'Nunito',sans-serif)",
            fontSize: 12, color: "#78350F", margin: 0,
            lineHeight: 1.4, opacity: 0.80,
          }}>
            Stories saved on this device.{" "}
            <span style={{ fontWeight: 700, color: C.orange }}>Sign in</span>{" "}
            to sync across devices 🌍
          </p>
        </motion.div>
      )}
      
      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={onGenerate}
        className="w-full mb-8 py-5 rounded-4xl text-white font-display text-xl shadow-xl border-4 border-white flex items-center justify-center gap-3"
        style={{ background: `linear-gradient(135deg,${C.yellow},#FF8F00)`, boxShadow: "0 12px 36px rgba(249,168,37,0.35)" }}
      ><Wand2 size={24}/> Create a Personalized Story ✨ <Sparkles size={20}/></motion.button>
      
      {/* ── ESTANTE DE CUENTOS DE DEMO ── */}
      <div className="mb-8">
        <h3 className="font-display text-2xl mb-4 text-center" style={{ color: C.blue }}>
          ✨ Try these magical stories ✨
        </h3>
        <DemoBookShelf lang={lang} onRead={story => onSelectStory(story)} />
      </div>
      
      {stories.length === 0 ? (
        <div className="text-center py-16 text-slate-400 font-body">
          <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 2, repeat: Infinity }} className="text-5xl mb-3">📡</motion.div>
          <p>No stories yet. Create your first one! ✨</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {stories.map((story, i) => (
            <StoryCoverCard key={story.id} story={story} index={i} onClick={() => onSelectStory(story)}/>
          ))}
        </div>
      )}
    </motion.div>
  );
}

// ── Collaborate ────────────────────────────────────────────────────────────
function Collaborate() {
  const [form, setForm] = useState({ name: "", role: "educator", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const ROLES = [
    { value: "educator", label: "👩‍🏫 Teacher" }, { value: "writer", label: "✍️ Writer" },
    { value: "volunteer", label: "🙋 Volunteer" }, { value: "developer", label: "💻 Developer" },
    { value: "other", label: "🌟 Other" },
  ];
  const handleSubmit = () => {
    const sub  = encodeURIComponent(`Kiddsy Collaboration — ${form.role}`);
    const body = encodeURIComponent(`Name: ${form.name}\nRole: ${form.role}\nEmail: ${form.email}\n\n${form.message}`);
    window.open(`mailto:kiddsy@atyglobal.com?subject=${sub}&body=${body}`);
    setSent(true);
  };
  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(150deg,#FCE4EC 0%,#E3F2FD 100%)" }}>
      <div className="max-w-xl mx-auto px-4 py-14">
        <div className="text-center mb-8">
          <div className="text-6xl mb-3">🤝</div>
          <h1 className="font-display text-4xl" style={{ color: C.magenta }}>Work With Us</h1>
          <p className="font-body text-slate-500 mt-2">Teachers, writers, volunteers — we'd love to hear from you!</p>
        </div>
        {sent ? (
          <div className="text-center bg-white rounded-4xl p-12 shadow-xl">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="font-display text-2xl" style={{ color: C.green }}>Message sent!</h2>
            <button onClick={() => setSent(false)} className="mt-5 font-display text-sm" style={{ color: C.magenta }}>Send another</button>
          </div>
        ) : (
          <div className="bg-white/90 rounded-4xl p-8 shadow-xl border-4 border-white space-y-4">
            {[{ k: "name", ph: "Your full name", lbl: "👤 Your name" }, { k: "email", ph: "your@email.com", lbl: "📧 Email" }].map(f => (
              <div key={f.k}>
                <label className="block font-display text-slate-600 text-sm mb-1">{f.lbl}</label>
                <input type={f.k === "email" ? "email" : "text"} value={form[f.k]}
                  onChange={e => setForm({ ...form, [f.k]: e.target.value })} placeholder={f.ph}
                  className="w-full px-5 py-3 rounded-2xl border-2 border-slate-200 font-body focus:outline-none focus:border-pink-400 bg-pink-50 placeholder-slate-300"/>
              </div>
            ))}
            <div>
              <label className="block font-display text-slate-600 text-sm mb-1">🎭 I am a…</label>
              <div className="grid grid-cols-2 gap-2">
                {ROLES.map(r => (
                  <button key={r.value} onClick={() => setForm({ ...form, role: r.value })}
                    className="px-3 py-2 rounded-xl font-body text-sm text-left transition-all"
                    style={{ background: form.role === r.value ? C.magenta : "#FDF2F8", color: form.role === r.value ? "white" : "#4B5563", border: `2px solid ${form.role === r.value ? C.magenta : "#FCE7F3"}` }}
                  >{r.label}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="block font-display text-slate-600 text-sm mb-1">💬 Message</label>
              <textarea rows={3} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                placeholder="Tell us your idea…"
                className="w-full px-5 py-3 rounded-2xl border-2 border-slate-200 font-body focus:outline-none focus:border-pink-400 bg-pink-50 resize-none placeholder-slate-300"/>
            </div>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={handleSubmit}
              className="w-full py-4 rounded-2xl font-display text-xl text-white shadow-lg"
              style={{ background: `linear-gradient(135deg,${C.magenta},#E91E8C)` }}
            >Send Message 🚀</motion.button>
          </div>
        )}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// APP PRINCIPAL
// ════════════════════════════════════════════════════════════════════════════
export default function App() {
  const { user } = useAuth();
  const [view,        setView]        = useState("hero");
  const [lang,        setLang]        = useState(() => lsGet(LS_LANG, "en"));
  const [stories,     setStories]     = useState([]);
  const [activeStory, setActiveStory] = useState(null);

  const isGuest = !user;

  useEffect(() => { lsSet(LS_LANG, lang); }, [lang]);
  console.log('🔍 Lang inicial:', lang, 'Tipo:', typeof lang);

  // Cargar cuentos estáticos del API
  useEffect(() => {
    const API_URL = window.location.hostname === "localhost"
      ? "http://localhost:10000"
      : "https://kiddsy-vercel.onrender.com";
    fetch(`${API_URL}/api/stories`)
      .then(r => r.json())
      .then(data => setStories(data))
      .catch(err => console.error("Story fetch error:", err));
  }, []);

  // Cargar cuentos generados del usuario
  useEffect(() => {
    const userId = user?.id || getGuestId();
    fetchUserStories(userId).then(userStories => {
      if (userStories.length > 0) {
        setStories(prev => {
          const ids = new Set(userStories.map(s => s.id));
          return [...userStories, ...prev.filter(s => !ids.has(s.id))];
        });
      }
    });
  }, [user]);

  const handleSelectStory = story => {
    setActiveStory(story); setView("reader");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleGenerated = (story, chosenLang) => {
    setLang(chosenLang);
    setStories(prev => [story, ...prev]);
    setActiveStory(story); setView("reader");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNav = id => {
    setView(id); setActiveStory(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (view === "hero") {
    return <HeroScreen onPlay={() => { setView("library"); window.scrollTo({ top: 0 }); }}lang={lang}/>;
  }

  const FULL_PAGES = {
    games:           <Games         lang={lang} onLangChange={setLang}/>,
    wordsearch:      <WordSearch    lang={lang} onLangChange={setLang}/>,
    animals:         <PuzzleMaster  lang={lang} onLangChange={setLang}/>,
    puzzles:         <PuzzleMaster  lang={lang} onLangChange={setLang}/>,  
    education:       <Education     lang={lang} onLangChange={setLang} stories={stories} onSelectStory={handleSelectStory}/>,
    "legal":         <AvisoLegal                onNav={handleNav} lang={lang}/>,
    "aviso-legal":   <AvisoLegal                onNav={handleNav} lang={lang}/>,
    "privacidad":    <Privacidad                onNav={handleNav} lang={lang}/>,
    subscription:    <Subscription  lang={lang} onLangChange={setLang}/>,
    collaborate:     <Collaborate   lang={lang} onLangChange={setLang}/>,
    mylibrary:       <MyLibrary                 onCreateStory={() => handleNav("generate")} onReadStory={handleSelectStory} lang={lang} onLangChange={setLang}/>,
  };

  return (
    <div className="min-h-screen relative kiddsy-bg-drift" style={{
      background: "linear-gradient(135deg, #FFFDE7 0%, #FFF8E1 25%, #FFF3E0 50%, #FFFDE7 75%, #F3E5F5 100%)",
    }}>
      <KiddsyBgStyles/>
      <SwUpdateToast/>
      <StarField/>

      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl" style={{ background: `${C.blue}07` }}/>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl" style={{ background: `${C.yellow}0F` }}/>
      </div>

      <div className="relative z-10">
        
        {/* ── NAVBAR (Se oculta en el modo lectura) ── */}
        {view !== "reader" && (
          <Navbar view={view} onNav={handleNav} lang={lang} onLangChange={setLang} />
        )}

        <main className="max-w-4xl mx-auto px-4 py-8 pb-20">
          <AnimatePresence mode="wait">
            {FULL_PAGES[view] ? (
              <motion.div key={view} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="-mx-4">
                {FULL_PAGES[view]}
              </motion.div>
            ) : view === "generator" ? (
              <motion.div key="generator" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <StoryGenerator lang={lang} onLangChange={setLang} onGenerated={handleGenerated} />
              </motion.div>
            ) : view === "library" ? (
              <motion.div key="library" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <LibraryView stories={stories} onSelectStory={handleSelectStory} onGenerate={() => setView("generator")} isGuest={isGuest} lang={lang}/>
              </motion.div>
            ) : view === "reader" && activeStory ? (
              <motion.div key="reader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <StoryReader story={activeStory} lang={lang} onBack={() => setView("library")}/>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </main>
        
        {/* ── FOOTER (Se oculta en el modo lectura) ── */}
        {view !== "reader" && <Footer onNav={handleNav} lang={lang}/>}
      </div>
    </div>
  );
}