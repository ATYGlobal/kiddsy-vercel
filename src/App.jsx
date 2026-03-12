/**
 * src/App.jsx — Kiddsy
 * Solo routing + estado global. Toda la lógica extraída a sus módulos.
 */
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wand2, Sparkles } from "lucide-react";

// ── Páginas ────────────────────────────────────────────────────────────────
import HeroScreen from "./pages/HeroScreen";
import MyLibrary from "./pages/MyLibrary.jsx";
import StoryGenerator from "./pages/StoryGenerator";
import StoryReader from "./pages/StoryReader.jsx";
import { AvisoLegal, Privacidad } from "./pages/LegalPages.jsx";
import Subscription from "./pages/Subscription.jsx";
import Games from "./pages/Games.jsx";
import Education from "./pages/Education.jsx";
import WordSearch from "./pages/WordSearch.jsx";
import PuzzleMaster from "./pages/PuzzleMaster.jsx";

// ── Componentes ────────────────────────────────────────────────────────────
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import SwUpdateToast from "./components/SwUpdateToast.jsx";
import { StoryCoverCard } from "./pages/StoryReader.jsx";

// ── Utils ──────────────────────────────────────────────────────────────────
import {
  LS_LANG,
  lsGet, lsSet,
  getGuestId, fetchUserStories,
} from "./utils/storage.js";

// ── Auth stub ─────────────────────────────────────────────────────────────
function useAuth() {
  return { user: null, isAuthenticated: false, loading: false, logout: () => {} };
}

// ── Colores ─────────────────────────────────────────────────────────────────
const C = {
  blue: "#1565C0",
  blueSoft: "#E3F2FD",
  red: "#E53935",
  yellow: "#F9A825",
  green: "#43A047",
  greenSoft: "#E8F5E9",
  magenta: "#D81B60",
  cyan: "#00ACC1",
  orange: "#E65100",
};

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
    `}</style>
  );
}

function StarField() {
  const stars = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 12 + 6,
    delay: Math.random() * 4,
    duration: Math.random() * 3 + 3,
    opacity: Math.random() * 0.18 + 0.05,
  }));
  
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {stars.map(s => (
        <motion.div
          key={s.id}
          className="absolute select-none"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            fontSize: s.size,
            opacity: s.opacity,
            color: C.yellow
          }}
          animate={{
            y: [0, -14, 0],
            rotate: [0, 180, 360],
            opacity: [s.opacity, s.opacity * 2, s.opacity]
          }}
          transition={{
            duration: s.duration,
            delay: s.delay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >★</motion.div>
      ))}
    </div>
  );
}

// ── LibraryView ────────────────────────────────────────────────────────────
function LibraryView({ stories, onSelectStory, onGenerate, isGuest }) {
  const handleGenerateClick = (e) => {
    e.preventDefault();
    if (typeof onGenerate === 'function') {
      onGenerate();
    }
  };

  const handleStoryClick = (story) => (e) => {
    e.preventDefault();
    if (typeof onSelectStory === 'function') {
      onSelectStory(story);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="text-center mb-10">
        <h2 className="font-display text-4xl mb-3" style={{ color: C.blue }}>
          Story Library
        </h2>
        <p className="font-body text-slate-500 text-lg">
          Pick a story or create your own! ✨
        </p>
      </div>
      
      {isGuest && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-2 p-3 mb-4 rounded-xl bg-white/70 backdrop-blur-sm border border-yellow-200"
        >
          <span className="text-xs font-bold uppercase text-amber-700 font-display">
            Guest
          </span>
          <div className="w-px h-3 bg-amber-300"/>
          <p className="text-xs text-amber-800 font-body">
            Stories saved on this device only.{" "}
            <span className="font-bold text-orange-600">
              Sign in
            </span>{" "}
            to sync across devices 🌍
          </p>
        </motion.div>
      )}
      
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleGenerateClick}
        className="w-full mb-8 py-5 rounded-4xl text-white font-display text-xl shadow-xl border-4 border-white flex items-center justify-center gap-3 cursor-pointer"
        style={{
          background: `linear-gradient(135deg,${C.yellow},#FF8F00)`,
          boxShadow: "0 12px 36px rgba(249,168,37,0.35)"
        }}
      >
        <Wand2 size={24}/> Create a Personalized Story ✨ <Sparkles size={20}/>
      </motion.button>
      
      {stories.length === 0 ? (
        <div className="text-center py-16 text-slate-400 font-body">
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-5xl mb-3"
          >
            📡
          </motion.div>
          <p>Connecting to the story server…</p>
          <p className="text-xs mt-1 opacity-60">
            Make sure the API server is running on port 10000
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {stories.map((story, i) => (
            <div 
              key={story.id} 
              onClick={handleStoryClick(story)}
              className="cursor-pointer"
            >
              <StoryCoverCard
                story={story}
                index={i}
              />
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

// ── Collaborate ────────────────────────────────────────────────────────────
function Collaborate() {
  const [form, setForm] = useState({
    name: "",
    role: "educator",
    email: "",
    message: ""
  });
  const [sent, setSent] = useState(false);
  
  const ROLES = [
    { value: "educator", label: "👩‍🏫 Teacher" },
    { value: "writer", label: "✍️ Writer" },
    { value: "volunteer", label: "🙋 Volunteer" },
    { value: "developer", label: "💻 Developer" },
    { value: "other", label: "🌟 Other" },
  ];
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Kiddsy Collaboration — ${form.role}`);
    const body = encodeURIComponent(
      `Name: ${form.name}\nRole: ${form.role}\nEmail: ${form.email}\n\n${form.message}`
    );
    window.open(`mailto:kiddsy@atyglobal.com?subject=${subject}&body=${body}`);
    setSent(true);
  };
  
  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(150deg,#FCE4EC 0%,#E3F2FD 100%)" }}>
      <div className="max-w-xl mx-auto px-4 py-14">
        <div className="text-center mb-8">
          <div className="text-6xl mb-3">🤝</div>
          <h1 className="font-display text-4xl" style={{ color: C.magenta }}>
            Work With Us
          </h1>
          <p className="font-body text-slate-500 mt-2">
            Teachers, writers, volunteers — we'd love to hear from you!
          </p>
        </div>
        
        {sent ? (
          <div className="text-center bg-white rounded-4xl p-12 shadow-xl">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="font-display text-2xl" style={{ color: C.green }}>
              Message sent!
            </h2>
            <button
              onClick={() => setSent(false)}
              className="mt-5 font-display text-sm text-magenta-600 hover:underline cursor-pointer"
              style={{ color: C.magenta }}
            >
              Send another
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white/90 rounded-4xl p-8 shadow-xl border-4 border-white space-y-4">
            <div>
              <label className="block font-display text-slate-600 text-sm mb-1">
                👤 Your name
              </label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="Your full name"
                required
                className="w-full px-5 py-3 rounded-2xl border-2 border-slate-200 font-body focus:outline-none focus:border-pink-400 bg-pink-50 placeholder-slate-300"
              />
            </div>
            
            <div>
              <label className="block font-display text-slate-600 text-sm mb-1">
                📧 Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="your@email.com"
                required
                className="w-full px-5 py-3 rounded-2xl border-2 border-slate-200 font-body focus:outline-none focus:border-pink-400 bg-pink-50 placeholder-slate-300"
              />
            </div>
            
            <div>
              <label className="block font-display text-slate-600 text-sm mb-1">
                🎭 I am a…
              </label>
              <div className="grid grid-cols-2 gap-2">
                {ROLES.map(r => (
                  <button
                    type="button"
                    key={r.value}
                    onClick={() => setForm({ ...form, role: r.value })}
                    className="px-3 py-2 rounded-xl font-body text-sm text-left transition-all cursor-pointer"
                    style={{
                      background: form.role === r.value ? C.magenta : "#FDF2F8",
                      color: form.role === r.value ? "white" : "#4B5563",
                      border: `2px solid ${form.role === r.value ? C.magenta : "#FCE7F3"}`
                    }}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block font-display text-slate-600 text-sm mb-1">
                💬 Message
              </label>
              <textarea
                rows={3}
                value={form.message}
                onChange={e => setForm({ ...form, message: e.target.value })}
                placeholder="Tell us your idea…"
                required
                className="w-full px-5 py-3 rounded-2xl border-2 border-slate-200 font-body focus:outline-none focus:border-pink-400 bg-pink-50 resize-none placeholder-slate-300"
              />
            </div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="w-full py-4 rounded-2xl font-display text-xl text-white shadow-lg cursor-pointer"
              style={{ background: `linear-gradient(135deg,${C.magenta},#E91E8C)` }}
            >
              Send Message 🚀
            </motion.button>
          </form>
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
  // CORREGIDO: Volvemos a "hero" como vista inicial
  const [view, setView] = useState("hero");
  const [lang, setLang] = useState(() => lsGet(LS_LANG, "es"));
  const [stories, setStories] = useState([]);
  const [activeStory, setActiveStory] = useState(null);

  const isGuest = !user;

  useEffect(() => {
    lsSet(LS_LANG, lang);
  }, [lang]);

  // Cargar cuentos estáticos del API
  useEffect(() => {
    const API_URL = window.location.hostname === "localhost"
      ? "http://localhost:10000"
      : "https://kiddsy-vercel.onrender.com";
    
    fetch(`${API_URL}/api/stories`)
      .then(r => r.json())
      .then(data => {
        setStories(data);
      })
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

  const handleSelectStory = (story) => {
    setActiveStory(story);
    setView("reader");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleGeneratedStory = (story, chosenLang) => {
    setLang(chosenLang);
    setStories(prev => [story, ...prev]);
    setActiveStory(story);
    setView("reader");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNavigation = (viewId) => {
    setView(viewId);
    setActiveStory(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleGenerateClick = () => {
    setView("generator");
  };

  const handlePlayClick = () => {
    setView("library");
    window.scrollTo({ top: 0 });
  };

  // Si estamos en hero, mostramos solo HeroScreen sin Navbar ni Footer
  if (view === "hero") {
    return <HeroScreen onPlay={handlePlayClick} />;
  }

  // Mapeo de vistas a componentes
  const renderView = () => {
    switch (view) {
      case "library":
        return (
          <LibraryView
            stories={stories}
            onSelectStory={handleSelectStory}
            onGenerate={handleGenerateClick}
            isGuest={isGuest}
          />
        );
      
      case "generator":
        return (
          <StoryGenerator
            lang={lang}
            onLangChange={setLang}
            onBack={() => setView("library")}
            onStoryGenerated={handleGeneratedStory}
          />
        );
      
      case "reader":
        return activeStory ? (
          <StoryReader
            story={activeStory}
            lang={lang}
            onBack={() => setView("library")}
          />
        ) : null;
      
      case "games":
        return <Games />;
      
      case "wordsearch":
        return <WordSearch />;
      
      case "puzzles":
        return <PuzzleMaster />;
      
      case "education":
        return <Education />;
      
      case "legal":
      case "aviso-legal":
        return <AvisoLegal onNav={handleNavigation} />;
      
      case "privacidad":
        return <Privacidad onNav={handleNavigation} />;
      
      case "subscription":
        return <Subscription />;
      
      case "collaborate":
        return <Collaborate />;
      
      case "mylibrary":
        return (
          <MyLibrary
            onCreateStory={() => handleNavigation("generator")}
            onReadStory={handleSelectStory}
          />
        );
      
      default:
        return (
          <LibraryView
            stories={stories}
            onSelectStory={handleSelectStory}
            onGenerate={handleGenerateClick}
            isGuest={isGuest}
          />
        );
    }
  };

  return (
    <div className="min-h-screen relative kiddsy-bg-drift" style={{
      background: "linear-gradient(135deg, #FFFDE7 0%, #FFF8E1 25%, #FFF3E0 50%, #FFFDE7 75%, #F3E5F5 100%)",
    }}>
      <KiddsyBgStyles />
      <SwUpdateToast />
      <StarField />

      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl"
          style={{ background: `${C.blue}07` }}
        />
        <div
          className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl"
          style={{ background: `${C.yellow}0F` }}
        />
      </div>

      <div className="relative z-10">
        {/* Navbar solo visible cuando no estamos en hero */}
        {view !== "hero" && (
          <Navbar 
            currentView={view}
            onNavigate={handleNavigation}
            lang={lang}
            onLangChange={setLang}
          />
        )}
        
        <main className="max-w-4xl mx-auto px-4 py-8 pb-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {renderView()}
            </motion.div>
          </AnimatePresence>
        </main>
        
        {/* Footer solo visible cuando no estamos en hero */}
        {view !== "hero" && (
          <Footer onNav={handleNavigation} lang={lang} />
        )}
      </div>
    </div>
  );
}