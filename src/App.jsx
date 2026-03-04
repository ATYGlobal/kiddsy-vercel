/**
 * App.jsx — Kiddsy Loop (Updated with all sections)
 * 
 * Routes:
 *   /            → Library (story gallery)
 *   /generate    → AI Story Generator
 *   /games       → Games (Puzzle + Memory)
 *   /education   → Letters & Numbers
 *   /legal       → FAQ, Terms, Privacy
 *   /donate      → Donation / Support
 *   /collaborate → Collaboration form
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen, Sparkles, ChevronLeft, ChevronRight,
  ArrowLeft, Wand2, Globe, Star, BookMarked, Languages,
  Puzzle, Music, HelpCircle, Heart, Users, Menu, X
} from "lucide-react";

// ─── Lazy-import new pages ─────────────────────────────────────────────────
// Copy Legal.jsx, Donation.jsx, Games.jsx, Education.jsx into src/pages/
import Legal      from "./pages/Legal.jsx";
import Donation   from "./pages/Donation.jsx";
import Games      from "./pages/Games.jsx";
import Education  from "./pages/Education.jsx";

// ─── Brand colors ──────────────────────────────────────────────────────────
const C = {
  blue:    "#1565C0",
  blueSoft:"#E3F2FD",
  red:     "#E53935",
  yellow:  "#F9A825",
  green:   "#43A047",
  magenta: "#D81B60",
  cyan:    "#00ACC1",
};

// ─── NAV items ─────────────────────────────────────────────────────────────
const NAV = [
  { id: "library",     label: "Stories",    icon: BookOpen,   color: C.blue    },
  { id: "games",       label: "Games",      icon: Puzzle,     color: C.red     },
  { id: "education",   label: "Learn",      icon: Music,      color: C.green   },
  { id: "legal",       label: "Help & FAQ", icon: HelpCircle, color: C.cyan    },
  { id: "donate",      label: "Donate ☕",  icon: Heart,      color: C.yellow  },
  { id: "collaborate", label: "Collaborate",icon: Users,      color: C.magenta },
];

// ─── Floating Stars ────────────────────────────────────────────────────────
function StarField() {
  const stars = Array.from({ length: 14 }, (_, i) => ({
    id: i, x: Math.random() * 100, y: Math.random() * 100,
    size: Math.random() * 12 + 6, delay: Math.random() * 4,
    duration: Math.random() * 3 + 3, opacity: Math.random() * 0.3 + 0.1,
  }));
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {stars.map((s) => (
        <motion.div
          key={s.id}
          className="absolute"
          style={{ left: `${s.x}%`, top: `${s.y}%`, fontSize: s.size, opacity: s.opacity, color: C.yellow }}
          animate={{ y: [0,-14,0], rotate:[0,180,360], opacity:[s.opacity, s.opacity*1.8, s.opacity] }}
          transition={{ duration: s.duration, delay: s.delay, repeat: Infinity, ease: "easeInOut" }}
        >★</motion.div>
      ))}
    </div>
  );
}

// ─── Kiddsy Logo SVG component ─────────────────────────────────────────────
// Replace src with your actual logo file: import logoUrl from "./assets/logo.png"
function KiddsyLogo({ size = "md" }) {
  const sizes = { sm: "text-lg", md: "text-2xl", lg: "text-4xl" };
  const C = { blue: "#3B82F6", red: "#EF4444" }; 
  return (
    <div className={`font-display ${sizes[size]} leading-none select-none`}>
      <span style={{ color: C.blue }}>Kiddsy</span>
      <span style={{ color: C.red }}>Loop</span>
    </div>
  );
}

// ─── Animated loading logo for loaders ────────────────────────────────────
export function KiddsyLoader({ message = "Loading magic…" }) {
  const LETTERS = ["K","i","d","d","s","y"];
  const COLORS  = [C.blue, C.blue, C.red, C.yellow, C.green, C.blue];
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-5">
      <div className="flex gap-1">
        {LETTERS.map((l, i) => (
          <motion.span
            key={i}
            className="font-display text-5xl"
            style={{ color: COLORS[i] }}
            animate={{ y: [0, -18, 0] }}
            transition={{
              duration: 0.7,
              delay: i * 0.1,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {l}
          </motion.span>
        ))}
      </div>
      <motion.div
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="font-body text-slate-500"
      >
        {message}
      </motion.div>
    </div>
  );
}

// ─── Language Picker ───────────────────────────────────────────────────────
const LANG_LABELS = { es: "Español", fr: "Français", ar: "العربية" };
const LANG_FLAGS  = { es: "🇪🇸", fr: "🇫🇷", ar: "🇸🇦" };

function LanguagePicker({ value, onChange }) {
  return (
    <div className="flex items-center gap-1.5 bg-white/80 backdrop-blur-sm rounded-full p-1.5 shadow-soft border border-white">
      {Object.entries(LANG_LABELS).map(([code, label]) => (
        <button
          key={code}
          onClick={() => onChange(code)}
          className="px-3 py-1.5 rounded-full font-display text-sm transition-all duration-200"
          style={{
            background: value === code ? C.blue : "transparent",
            color: value === code ? "white" : "#6B7280",
          }}
        >
          {LANG_FLAGS[code]} {label}
        </button>
      ))}
    </div>
  );
}

// ─── Story Cover Card ──────────────────────────────────────────────────────
function StoryCoverCard({ story, onClick, index }) {
  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, type: "spring", stiffness: 200 }}
      whileHover={{ scale: 1.04, rotate: [-0.5, 0.5][index % 2] }}
      whileTap={{ scale: 0.97 }}
      className="group relative w-full text-left"
    >
      <div className="absolute left-0 top-2 bottom-2 w-4 rounded-l-lg bg-black/15 blur-[2px]" />
      <div
        className="relative rounded-3xl overflow-hidden shadow-lg border-4 border-white"
        style={{
          background: `linear-gradient(135deg, var(--tw-gradient-stops))`,
          minHeight: 180,
        }}
      >
        <div
          className={`absolute inset-0 bg-gradient-to-br ${story.color}`}
          style={{ opacity: 1 }}
        />
        <div className="relative p-6 flex flex-col h-full min-h-[180px]">
          <div className="text-6xl mb-3 drop-shadow-lg animate-bounce">{story.emoji}</div>
          <h3 className="font-display text-white text-xl leading-tight drop-shadow-sm flex-1">
            {story.title}
          </h3>
          <div className="mt-4 flex items-center gap-2 text-white/80 text-sm font-body">
            <BookOpen size={14} />
            <span>{story.pages.length} pages</span>
          </div>
        </div>
        <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors rounded-3xl flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-white font-display px-5 py-2 rounded-full shadow-lg text-sm" style={{ color: C.blue }}>
              Read now ✨
            </div>
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
  const isArabic = lang === "ar";
  const page = story.pages[pageIdx];
  const total = story.pages.length;

  const goNext = () => { if (pageIdx < total - 1) { setDirection(1); setPageIdx(p => p + 1); } };
  const goPrev = () => { if (pageIdx > 0) { setDirection(-1); setPageIdx(p => p - 1); } };

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pageIdx]);

  const pageVariants = {
    enter: (dir) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? -80 : 80, opacity: 0 }),
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="flex items-center gap-2 font-display transition-colors" style={{ color: C.blue }}>
          <ArrowLeft size={20} /> Library
        </button>
        <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm">
          <span className="text-2xl">{story.emoji}</span>
          <span className="font-display" style={{ color: C.blue }}>{story.title}</span>
        </div>
        <div className="font-display text-slate-400 text-sm">{pageIdx + 1} / {total}</div>
      </div>

      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={pageIdx}
          custom={direction}
          variants={pageVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className={`bg-gradient-to-br ${story.color} p-1.5 rounded-4xl shadow-xl`}>
            <div className="bg-amber-50 rounded-4xl overflow-hidden">
              <div className="p-8 md:p-12 min-h-[340px] flex flex-col justify-between">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex gap-1">
                    {Array.from({ length: total }).map((_, i) => (
                      <div key={i} className="h-2 rounded-full transition-all duration-300"
                        style={{ background: i === pageIdx ? C.blue : "#E2E8F0", width: i === pageIdx ? 24 : 8 }} />
                    ))}
                  </div>
                  <div className="text-2xl opacity-60">{story.emoji}</div>
                </div>

                <div className="flex-1 flex items-center">
                  <p className="font-display text-3xl md:text-4xl text-slate-800 leading-relaxed text-center w-full">
                    {page.en}
                  </p>
                </div>

                <div className="mt-6 pt-6 border-t-2 border-dashed border-slate-200 text-center" dir={isArabic ? "rtl" : "ltr"}>
                  <div className="inline-flex items-center gap-2 mb-2 font-body text-xs font-semibold uppercase tracking-widest" style={{ color: `${C.blue}80` }}>
                    <Languages size={12} />
                    {LANG_FLAGS[lang]} {LANG_LABELS[lang]}
                  </div>
                  <p className="font-body text-xl md:text-2xl font-semibold italic leading-relaxed" style={{ color: C.blue }}>
                    {page[lang] || page.es}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="flex items-center justify-between mt-8">
        <motion.button
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          onClick={goPrev} disabled={pageIdx === 0}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl font-display text-lg transition-all bg-white shadow-sm border border-slate-100 disabled:opacity-30"
          style={{ color: C.blue }}
        >
          <ChevronLeft size={22} /> Previous
        </motion.button>

        {pageIdx === total - 1 ? (
          <motion.button
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="flex items-center gap-2 px-8 py-3 rounded-2xl font-display text-lg text-white shadow-lg"
            style={{ background: `linear-gradient(135deg, ${C.yellow}, #FF8F00)` }}
          >
            <Star size={18} /> Finished! 🎉
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={goNext}
            className="flex items-center gap-2 px-8 py-3 rounded-2xl font-display text-lg text-white shadow-lg"
            style={{ background: C.blue }}
          >
            Next <ChevronRight size={22} />
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}

// ─── Story Generator ───────────────────────────────────────────────────────
function StoryGenerator({ onGenerated }) {
  const [childName, setChildName] = useState("");
  const [theme, setTheme] = useState("");
  const [lang, setLang] = useState("es");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const THEMES = [
    { label: "🏫 Going to School",  value: "going to school for the first time" },
    { label: "🌈 Making Friends",   value: "making new friends" },
    { label: "🛒 Supermarket",      value: "shopping at the supermarket" },
    { label: "🚌 Taking the Bus",   value: "taking the bus" },
    { label: "🏥 Doctor Visit",     value: "visiting the doctor" },
    { label: "🎉 Birthday Party",   value: "celebrating a birthday" },
  ];

  const handleGenerate = async () => {
    if (!childName.trim() || !theme) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/generate-story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ childName: childName.trim(), theme, language: lang }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");
      onGenerated(data, lang);
    } catch (e) {
      setError(e.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl mx-auto">
      <div className="bg-white/90 backdrop-blur-md rounded-4xl shadow-xl border-4 border-white p-8 md:p-10">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3 animate-bounce">🪄</div>
          <h2 className="font-display text-3xl" style={{ color: C.blue }}>Create a Magic Story</h2>
          <p className="font-body text-slate-500 mt-2">Personalize it for your child!</p>
        </div>
        <div className="space-y-5">
          <div>
            <label className="block font-display text-slate-600 text-sm mb-2">✏️ Child's name</label>
            <input
              type="text" value={childName}
              onChange={(e) => setChildName(e.target.value)}
              placeholder="e.g. Sofia, Omar, Lucas…" maxLength={20}
              className="w-full px-5 py-3.5 rounded-2xl border-2 border-slate-200 font-body text-lg focus:outline-none focus:border-blue-400 transition-colors bg-amber-50 placeholder-slate-300"
            />
          </div>
          <div>
            <label className="block font-display text-slate-600 text-sm mb-2">🌟 Story theme</label>
            <div className="grid grid-cols-2 gap-2">
              {THEMES.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setTheme(t.value)}
                  className="px-3 py-2.5 rounded-xl font-body text-sm text-left transition-all"
                  style={{
                    background: theme === t.value ? C.blue : "#F8FAFC",
                    color: theme === t.value ? "white" : "#4B5563",
                    border: `2px solid ${theme === t.value ? C.blue : "#E2E8F0"}`,
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block font-display text-slate-600 text-sm mb-2">🌍 Translation language</label>
            <LanguagePicker value={lang} onChange={setLang} />
          </div>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-2xl px-4 py-3 font-body text-sm">
              ⚠️ {error}
            </div>
          )}
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={handleGenerate}
            disabled={!childName.trim() || !theme || loading}
            className="w-full py-4 rounded-2xl font-display text-xl transition-all text-white shadow-lg"
            style={{
              background: childName.trim() && theme && !loading
                ? `linear-gradient(135deg, ${C.blue}, #42A5F5)`
                : "#E5E7EB",
              color: childName.trim() && theme && !loading ? "white" : "#9CA3AF",
              cursor: childName.trim() && theme && !loading ? "pointer" : "not-allowed",
            }}
          >
            {loading ? "✨ Writing the story…" : "🪄 Generate Story"}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Library View ──────────────────────────────────────────────────────────
function Library({ stories, lang, onSelectStory, onGenerate }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="text-center mb-10">
        <h2 className="font-display text-4xl md:text-5xl mb-3" style={{ color: C.blue }}>
          Story Library 📚
        </h2>
        <p className="font-body text-slate-500 text-lg">Pick a story or create a new one! ✨</p>
      </div>
      <motion.button
        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
        onClick={onGenerate}
        className="w-full mb-8 py-5 px-8 rounded-4xl text-white font-display text-xl shadow-xl border-4 border-white flex items-center justify-center gap-3"
        style={{ background: `linear-gradient(135deg, ${C.yellow}, #FF8F00)` }}
      >
        <Wand2 size={24} /> Create a Personalized Story ✨ <Sparkles size={20} />
      </motion.button>
      {stories.length === 0 ? (
        <div className="text-center py-16 text-slate-400 font-body">
          <div className="text-5xl mb-3">📡</div>
          <p>Connecting to the story server…</p>
          <p className="text-sm mt-1">Make sure the API is running locally.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {stories.map((story, i) => (
            <StoryCoverCard key={story.id} story={story} index={i} onClick={() => onSelectStory(story)} />
          ))}
        </div>
      )}
    </motion.div>
  );
}

// ─── Collaboration Form ────────────────────────────────────────────────────
function Collaborate() {
  const [form, setForm] = useState({ name: "", role: "educator", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const ROLES = [
    { value: "educator",  label: "👩‍🏫 Teacher / Educator" },
    { value: "writer",    label: "✍️ Writer / Author" },
    { value: "volunteer", label: "🙋 Volunteer" },
    { value: "developer", label: "💻 Developer" },
    { value: "other",     label: "🌟 Other" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    // In production: POST to /api/collaborate
    // For now: mailto link
    const subject = encodeURIComponent(`Kiddsy Loop Collaboration — ${form.role}`);
    const body = encodeURIComponent(`Name: ${form.name}\nRole: ${form.role}\nEmail: ${form.email}\n\n${form.message}`);
    window.open(`mailto:hello@kiddsyloop.com?subject=${subject}&body=${body}`);
    setSent(true);
  };

  return (
    <div
      className="min-h-screen"
      style={{ background: "linear-gradient(150deg, #FCE4EC 0%, #E3F2FD 100%)" }}
    >
      <div className="max-w-2xl mx-auto px-4 py-14">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="text-6xl mb-4 animate-bounce">🤝</div>
          <h1 className="font-display text-4xl md:text-5xl mb-3" style={{ color: C.magenta }}>
            Work With Us
          </h1>
          <p className="font-body text-slate-600 text-lg max-w-md mx-auto">
            Are you a teacher, storyteller, or volunteer? We would love to hear from you!
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {sent ? (
            <motion.div
              key="success"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center bg-white rounded-4xl p-12 shadow-xl border-4 border-white"
            >
              <div className="text-7xl mb-4">🎉</div>
              <h2 className="font-display text-3xl mb-3" style={{ color: C.green }}>Message sent!</h2>
              <p className="font-body text-slate-500">We'll get back to you soon. ¡Gracias! Merci! شكراً!</p>
              <button
                onClick={() => setSent(false)}
                className="mt-6 px-6 py-3 rounded-2xl font-display text-white shadow-md"
                style={{ background: C.magenta }}
              >
                Send another
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/90 backdrop-blur-md rounded-4xl shadow-xl border-4 border-white p-8"
            >
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block font-display text-slate-600 text-sm mb-2">👤 Your name</label>
                  <input
                    required type="text" value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Your full name"
                    className="w-full px-5 py-3.5 rounded-2xl border-2 border-slate-200 font-body text-base focus:outline-none focus:border-pink-400 bg-pink-50 transition-colors placeholder-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-display text-slate-600 text-sm mb-2">🎭 I am a…</label>
                  <div className="grid grid-cols-2 gap-2">
                    {ROLES.map((r) => (
                      <button
                        key={r.value}
                        type="button"
                        onClick={() => setForm({ ...form, role: r.value })}
                        className="px-3 py-2.5 rounded-xl font-body text-sm text-left transition-all"
                        style={{
                          background: form.role === r.value ? C.magenta : "#FDF2F8",
                          color: form.role === r.value ? "white" : "#4B5563",
                          border: `2px solid ${form.role === r.value ? C.magenta : "#FCE7F3"}`,
                        }}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block font-display text-slate-600 text-sm mb-2">📧 Email</label>
                  <input
                    required type="email" value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="your@email.com"
                    className="w-full px-5 py-3.5 rounded-2xl border-2 border-slate-200 font-body text-base focus:outline-none focus:border-pink-400 bg-pink-50 transition-colors placeholder-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-display text-slate-600 text-sm mb-2">💬 Your message</label>
                  <textarea
                    required rows={4} value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell us about your idea or how you'd like to collaborate…"
                    className="w-full px-5 py-3.5 rounded-2xl border-2 border-slate-200 font-body text-base focus:outline-none focus:border-pink-400 bg-pink-50 transition-colors resize-none placeholder-slate-300"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full py-4 rounded-2xl font-display text-xl text-white shadow-lg"
                  style={{ background: `linear-gradient(135deg, ${C.magenta}, #E91E8C)` }}
                >
                  Send Message 🚀
                </motion.button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── Navbar ────────────────────────────────────────────────────────────────
function Navbar({ view, onNav }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-md border-b-2 border-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => { onNav("library"); setMenuOpen(false); }}
          className="flex items-center gap-3 group"
        >
          {/* Logo image — replace src with your actual logo */}
          <motion.div
            whileHover={{ rotate: [-3, 3, 0], scale: 1.08 }}
            transition={{ duration: 0.4 }}
            className="w-12 h-12 rounded-2xl overflow-hidden shadow-md border-2 flex items-center justify-center"
            style={{ borderColor: C.yellow, background: C.blueSoft }}
          >
            {/* 
              REPLACE THIS with your actual logo:
              <img src={logoUrl} alt="Kiddsy Loop" className="w-full h-full object-contain" />
            */}
            <BookMarked size={22} style={{ color: C.blue }} />
          </motion.div>
          <div className="leading-none">
            <KiddsyLogo size="md" />
            <span className="font-body text-xs text-slate-400 block mt-0.5">Learning together ✨</span>
          </div>
        </button>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV.map((item) => {
            const Icon = item.icon;
            const isActive = view === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNav(item.id)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-2xl font-display text-sm transition-all"
                style={{
                  background: isActive ? item.color : "transparent",
                  color: isActive ? "white" : "#6B7280",
                }}
              >
                <Icon size={15} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen((o) => !o)}
          className="md:hidden w-10 h-10 rounded-xl flex items-center justify-center bg-white/80 shadow-sm"
          style={{ color: C.blue }}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-slate-100 bg-white/95 backdrop-blur-md overflow-hidden"
          >
            <div className="px-4 py-3 grid grid-cols-2 gap-2">
              {NAV.map((item) => {
                const Icon = item.icon;
                const isActive = view === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => { onNav(item.id); setMenuOpen(false); }}
                    className="flex items-center gap-2 px-4 py-3 rounded-2xl font-display text-sm transition-all"
                    style={{
                      background: isActive ? item.color : "#F8FAFC",
                      color: isActive ? "white" : "#4B5563",
                    }}
                  >
                    <Icon size={16} />
                    {item.label}
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

// ─── Main App ──────────────────────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState("library");
  const [lang, setLang] = useState("es");
  const [stories, setStories] = useState([]);
  const [activeStory, setActiveStory] = useState(null);

  useEffect(() => {
    fetch("/api/stories")
      .then((r) => r.json())
      .then(setStories)
      .catch(() => {});
  }, []);

  const handleSelectStory = (story) => {
    setActiveStory(story);
    setView("reader");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleGenerated = (story, chosenLang) => {
    setLang(chosenLang);
    setStories((prev) => [story, ...prev]);
    setActiveStory(story);
    setView("reader");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNav = (id) => {
    setView(id);
    setActiveStory(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Pages that replace the Library (full-page components)
  const FULL_PAGES = {
    games:       <Games />,
    education:   <Education />,
    legal:       <Legal />,
    donate:      <Donation />,
    collaborate: <Collaborate />,
  };

  return (
    <div className="min-h-screen relative" style={{ background: "#FFFDE7" }}>
      <StarField />

      {/* Gradient blobs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-10" style={{ background: C.blue }} />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-10" style={{ background: C.yellow }} />
      </div>

      <div className="relative z-10">
        <Navbar view={view} onNav={handleNav} />

        {/* Language picker (only on story views) */}
        {["library", "reader", "generate"].includes(view) && (
          <div className="flex justify-center pt-5 px-4">
            <LanguagePicker value={lang} onChange={setLang} />
          </div>
        )}

        <main className="max-w-4xl mx-auto px-4 py-8 pb-20">
          <AnimatePresence mode="wait">
            {/* Full-page views (Games, Education, Legal, Donate, Collaborate) */}
            {FULL_PAGES[view] ? (
              <motion.div
                key={view}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="-mx-4"
              >
                {FULL_PAGES[view]}
              </motion.div>
            ) : view === "library" ? (
              <motion.div key="library" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Library stories={stories} lang={lang} onSelectStory={handleSelectStory} onGenerate={() => setView("generate")} />
              </motion.div>
            ) : view === "generate" ? (
              <motion.div key="generate" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="mb-6">
                  <button onClick={() => setView("library")} className="flex items-center gap-2 font-display transition-colors" style={{ color: C.blue }}>
                    <ArrowLeft size={18} /> Back to Library
                  </button>
                </div>
                <StoryGenerator onGenerated={handleGenerated} />
              </motion.div>
            ) : view === "reader" && activeStory ? (
              <motion.div key="reader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <StoryReader story={activeStory} lang={lang} onBack={() => setView("library")} />
              </motion.div>
            ) : null}
          </AnimatePresence>
        </main>

        <footer className="relative z-10 text-center py-8 font-body text-slate-400 text-sm border-t border-slate-100">
          <KiddsyLogo size="sm" />
          <p className="mt-1">Bilingual stories for families learning English together 🌍</p>
          <div className="flex justify-center gap-4 mt-3">
            <button onClick={() => handleNav("legal")} className="hover:underline text-xs" style={{ color: C.blue }}>Privacy & Terms</button>
            <button onClick={() => handleNav("donate")} className="hover:underline text-xs" style={{ color: C.yellow }}>Support us ☕</button>
            <button onClick={() => handleNav("collaborate")} className="hover:underline text-xs" style={{ color: C.magenta }}>Collaborate</button>
          </div>
        </footer>
      </div>
    </div>
  );
}
