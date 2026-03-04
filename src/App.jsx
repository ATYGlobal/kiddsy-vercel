import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen, Sparkles, ChevronLeft, ChevronRight,
  ArrowLeft, Wand2, Globe, Star, Home, RefreshCw,
  BookMarked, Languages
} from "lucide-react";

// ─── Floating Stars Background ─────────────────────────────────────────────
function StarField() {
  const stars = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 14 + 6,
    delay: Math.random() * 4,
    duration: Math.random() * 3 + 3,
    opacity: Math.random() * 0.4 + 0.1,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {stars.map((s) => (
        <motion.div
          key={s.id}
          className="absolute text-kiddsy-gold"
          style={{ left: `${s.x}%`, top: `${s.y}%`, fontSize: s.size, opacity: s.opacity }}
          animate={{ y: [0, -15, 0], rotate: [0, 180, 360], opacity: [s.opacity, s.opacity * 1.8, s.opacity] }}
          transition={{ duration: s.duration, delay: s.delay, repeat: Infinity, ease: "easeInOut" }}
        >
          ★
        </motion.div>
      ))}
    </div>
  );
}

// ─── Language Badge ────────────────────────────────────────────────────────
const LANG_LABELS = { es: "Español", fr: "Français", ar: "العربية" };
const LANG_FLAGS = { es: "🇪🇸", fr: "🇫🇷", ar: "🇸🇦" };

function LanguagePicker({ value, onChange }) {
  return (
    <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full p-1.5 shadow-soft border border-white">
      {Object.entries(LANG_LABELS).map(([code, label]) => (
        <button
          key={code}
          onClick={() => onChange(code)}
          className={`px-4 py-2 rounded-full font-display text-sm transition-all duration-200 ${
            value === code
              ? "bg-kiddsy-blue text-white shadow-md scale-105"
              : "text-slate-500 hover:bg-slate-100"
          }`}
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
      {/* Book spine effect */}
      <div className="absolute left-0 top-2 bottom-2 w-4 rounded-l-lg bg-black/15 blur-[2px]" />

      {/* Book cover */}
      <div
        className={`relative bg-gradient-to-br ${story.color} rounded-3xl overflow-hidden shadow-magic border-4 border-white`}
        style={{ minHeight: 180 }}
      >
        {/* Decorative lines like a real book cover */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 right-0 h-1 bg-white" />
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30" />
          <div className="absolute inset-y-0 left-6 w-px bg-white" />
        </div>

        <div className="relative p-6 flex flex-col h-full min-h-[180px]">
          {/* Big emoji as illustration */}
          <div className="text-6xl mb-3 drop-shadow-lg animate-bounce-soft">{story.emoji}</div>

          <h3 className="font-display text-white text-xl leading-tight drop-shadow-sm flex-1">
            {story.title}
          </h3>

          <div className="mt-4 flex items-center gap-2 text-white/80 text-sm font-body">
            <BookOpen size={14} />
            <span>{story.pages.length} pages</span>
          </div>
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors rounded-3xl flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-white text-kiddsy-blue font-display px-5 py-2 rounded-full shadow-lg text-sm">
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

  const goNext = () => {
    if (pageIdx < total - 1) { setDirection(1); setPageIdx(p => p + 1); }
  };
  const goPrev = () => {
    if (pageIdx > 0) { setDirection(-1); setPageIdx(p => p - 1); }
  };

  // Keyboard navigation
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-3xl mx-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 font-display text-kiddsy-blue hover:text-kiddsy-blue-dark transition-colors"
        >
          <ArrowLeft size={20} />
          Library
        </button>

        <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-soft">
          <span className="text-2xl">{story.emoji}</span>
          <span className="font-display text-kiddsy-blue text-lg">{story.title}</span>
        </div>

        <div className="font-display text-slate-400 text-sm">
          {pageIdx + 1} / {total}
        </div>
      </div>

      {/* Book container */}
      <div className="perspective-book">
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
            {/* Book page */}
            <div className={`bg-gradient-to-br ${story.color} p-1.5 rounded-4xl shadow-magic`}>
              <div className="bg-kiddsy-cream rounded-4xl overflow-hidden shadow-page">
                {/* Page content */}
                <div className="p-8 md:p-12 min-h-[340px] flex flex-col justify-between">
                  {/* Page number decoration */}
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex gap-1">
                      {Array.from({ length: total }).map((_, i) => (
                        <div
                          key={i}
                          className={`h-2 rounded-full transition-all duration-300 ${
                            i === pageIdx ? "bg-kiddsy-blue w-6" : "bg-slate-200 w-2"
                          }`}
                        />
                      ))}
                    </div>
                    <div className="text-2xl opacity-60">{story.emoji}</div>
                  </div>

                  {/* English text — large, prominent */}
                  <div className="flex-1 flex items-center">
                    <p className="font-display text-3xl md:text-4xl text-slate-800 leading-relaxed text-center w-full">
                      {page.en}
                    </p>
                  </div>

                  {/* Translation */}
                  <div
                    className={`mt-6 pt-6 border-t-2 border-dashed border-slate-200 text-center`}
                    dir={isArabic ? "rtl" : "ltr"}
                  >
                    <div className="inline-flex items-center gap-2 mb-2 text-kiddsy-blue/60 font-body text-xs font-semibold uppercase tracking-widest">
                      <Languages size={12} />
                      {LANG_FLAGS[lang]} {LANG_LABELS[lang]}
                    </div>
                    <p className="font-body text-xl md:text-2xl text-kiddsy-blue font-semibold italic leading-relaxed">
                      {page[lang] || page.es}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-8">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={goPrev}
          disabled={pageIdx === 0}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-display text-lg transition-all ${
            pageIdx === 0
              ? "opacity-30 cursor-not-allowed bg-slate-100"
              : "bg-white text-kiddsy-blue shadow-soft hover:shadow-magic border border-white"
          }`}
        >
          <ChevronLeft size={22} /> Previous
        </motion.button>

        {pageIdx === total - 1 ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="flex items-center gap-2 px-8 py-3 rounded-2xl font-display text-lg bg-gradient-to-r from-kiddsy-gold to-amber-400 text-white shadow-glow"
          >
            <Star size={18} /> Finished! 🎉
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={goNext}
            className="flex items-center gap-2 px-8 py-3 rounded-2xl font-display text-lg bg-kiddsy-blue text-white shadow-magic"
          >
            Next <ChevronRight size={22} />
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}

// ─── Story Generator Form ──────────────────────────────────────────────────
function StoryGenerator({ onGenerated }) {
  const [childName, setChildName] = useState("");
  const [theme, setTheme] = useState("");
  const [lang, setLang] = useState("es");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const THEMES = [
    { label: "🏫 Going to School", value: "going to school for the first time" },
    { label: "🌈 Making Friends", value: "making new friends" },
    { label: "🛒 At the Supermarket", value: "shopping at the supermarket" },
    { label: "🚌 Taking the Bus", value: "taking the bus" },
    { label: "🏥 Doctor Visit", value: "visiting the doctor" },
    { label: "🎉 Birthday Party", value: "celebrating a birthday" },
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
      setError(e.message || "Something went wrong. Try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-xl mx-auto"
    >
      <div className="bg-white/90 backdrop-blur-md rounded-5xl shadow-magic border-4 border-white p-8 md:p-10">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3 animate-bounce-soft">🪄</div>
          <h2 className="font-display text-3xl text-kiddsy-blue">Create a Magic Story</h2>
          <p className="font-body text-slate-500 mt-2">Personalize it for your child!</p>
        </div>

        <div className="space-y-6">
          {/* Child's name */}
          <div>
            <label className="block font-display text-slate-600 text-sm mb-2">
              ✏️ Child's name
            </label>
            <input
              type="text"
              value={childName}
              onChange={(e) => setChildName(e.target.value)}
              placeholder="e.g. Sofia, Omar, Lucas…"
              maxLength={20}
              className="w-full px-5 py-3.5 rounded-2xl border-2 border-slate-200 font-body text-lg focus:outline-none focus:border-kiddsy-blue transition-colors bg-kiddsy-cream placeholder-slate-300"
            />
          </div>

          {/* Theme picker */}
          <div>
            <label className="block font-display text-slate-600 text-sm mb-2">
              🌟 Story theme
            </label>
            <div className="grid grid-cols-2 gap-2">
              {THEMES.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setTheme(t.value)}
                  className={`px-3 py-2.5 rounded-xl font-body text-sm text-left transition-all ${
                    theme === t.value
                      ? "bg-kiddsy-blue text-white shadow-md scale-[1.02]"
                      : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Language */}
          <div>
            <label className="block font-display text-slate-600 text-sm mb-2">
              🌍 Translation language
            </label>
            <LanguagePicker value={lang} onChange={setLang} />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-2xl px-4 py-3 font-body text-sm">
              ⚠️ {error}
            </div>
          )}

          {/* Generate button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGenerate}
            disabled={!childName.trim() || !theme || loading}
            className={`w-full py-4 rounded-2xl font-display text-xl transition-all ${
              childName.trim() && theme && !loading
                ? "bg-gradient-to-r from-kiddsy-blue to-blue-500 text-white shadow-magic hover:shadow-glow"
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-3">
                <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                  ✨
                </motion.span>
                Writing the story…
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Wand2 size={20} /> Generate Story ✨
              </span>
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Loading Screen ────────────────────────────────────────────────────────
function GeneratingScreen({ childName }) {
  const messages = [
    "Mixing story ingredients…",
    "Adding a pinch of magic…",
    "The characters are waking up…",
    "Almost ready!",
  ];
  const [msgIdx, setMsgIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setMsgIdx((i) => (i + 1) % messages.length), 900);
    return () => clearInterval(t);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center min-h-[60vh] text-center"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        className="text-8xl mb-8"
      >
        🪄
      </motion.div>
      <h2 className="font-display text-3xl text-kiddsy-blue mb-3">
        Creating {childName ? `${childName}'s` : "your"} story…
      </h2>
      <AnimatePresence mode="wait">
        <motion.p
          key={msgIdx}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="font-body text-slate-500 text-lg"
        >
          {messages[msgIdx]}
        </motion.p>
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Library (Gallery of stories) ─────────────────────────────────────────
function Library({ stories, lang, onSelectStory, onGenerate }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Hero */}
      <div className="text-center mb-10">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-4xl md:text-5xl text-kiddsy-blue mb-3"
        >
          Story Library 📚
        </motion.h2>
        <p className="font-body text-slate-500 text-lg">
          Pick a story or create a new one with magic! ✨
        </p>
      </div>

      {/* Generate CTA */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onGenerate}
        className="w-full mb-8 py-5 px-8 rounded-4xl bg-gradient-to-r from-kiddsy-gold to-amber-400 text-white font-display text-xl shadow-glow border-4 border-white flex items-center justify-center gap-3"
      >
        <Wand2 size={24} />
        Create a Personalized Story ✨
        <Sparkles size={20} />
      </motion.button>

      {/* Story grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {stories.map((story, i) => (
          <StoryCoverCard
            key={story.id}
            story={story}
            index={i}
            onClick={() => onSelectStory(story)}
          />
        ))}
      </div>
    </motion.div>
  );
}

// ─── Header ───────────────────────────────────────────────────────────────
function Header({ lang, onLangChange, view, onHome }) {
  return (
    <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-md border-b-2 border-white shadow-soft">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={onHome}
          className="flex items-center gap-3 group"
        >
          <motion.div
            whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
            transition={{ duration: 0.4 }}
            className="w-12 h-12 bg-kiddsy-blue rounded-2xl flex items-center justify-center shadow-magic border-2 border-kiddsy-gold"
          >
            <BookMarked size={22} className="text-white" />
          </motion.div>
          <div className="leading-none">
            <span className="font-display text-2xl text-kiddsy-blue block">Kiddsy Loop</span>
            <span className="font-body text-xs text-slate-400">Learning together ✨</span>
          </div>
        </button>

        {/* Lang picker in header */}
        {view === "reader" ? null : (
          <div className="hidden sm:block">
            <LanguagePicker value={lang} onChange={onLangChange} />
          </div>
        )}
      </div>
    </header>
  );
}

// ─── Main App ──────────────────────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState("library");
  const [lang, setLang] = useState("es");
  const [stories, setStories] = useState([]);
  const [activeStory, setActiveStory] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [pendingName, setPendingName] = useState("");

  // Fetch static stories on mount
  useEffect(() => {
    fetch("/api/stories")
      .then((r) => r.json())
      .then(setStories)
      .catch(() => console.warn("Could not load stories from API — is the server running?"));
  }, []);

  const handleSelectStory = (story) => {
    setActiveStory(story);
    setView("reader");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleGenerate = () => setView("generator");

  const handleGenerationResult = (story, chosenLang) => {
    setLang(chosenLang);
    // Prepend generated story to library
    setStories((prev) => [story, ...prev]);
    setActiveStory(story);
    setView("reader");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleHome = () => {
    setView("library");
    setActiveStory(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen relative grain-overlay">
      <StarField />

      {/* Gradient background blobs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-kiddsy-blue/8 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-kiddsy-gold/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-blue-200/20 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <Header lang={lang} onLangChange={setLang} view={view} onHome={handleHome} />

        <main className="max-w-4xl mx-auto px-4 py-8 pb-20">
          <AnimatePresence mode="wait">
            {view === "library" && (
              <motion.div key="library" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Library
                  stories={stories}
                  lang={lang}
                  onSelectStory={handleSelectStory}
                  onGenerate={handleGenerate}
                />
              </motion.div>
            )}

            {view === "generator" && (
              <motion.div key="generator" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="mb-6">
                  <button
                    onClick={handleHome}
                    className="flex items-center gap-2 font-display text-kiddsy-blue hover:opacity-80 transition-opacity"
                  >
                    <ArrowLeft size={18} /> Back to Library
                  </button>
                </div>
                <StoryGenerator onGenerated={handleGenerationResult} />
              </motion.div>
            )}

            {view === "reader" && activeStory && (
              <motion.div key="reader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {/* Lang picker in reader */}
                <div className="flex justify-center mb-6">
                  <LanguagePicker value={lang} onChange={setLang} />
                </div>
                <StoryReader story={activeStory} lang={lang} onBack={handleHome} />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Footer */}
        <footer className="relative z-10 text-center py-8 font-body text-slate-400 text-sm">
          <div className="flex items-center justify-center gap-2 mb-1">
            <BookOpen size={14} className="text-kiddsy-blue" />
            <span className="font-display text-kiddsy-blue">Kiddsy Loop</span>
          </div>
          <p>Bilingual stories for families learning English together 🌍</p>
        </footer>
      </div>
    </div>
  );
}
