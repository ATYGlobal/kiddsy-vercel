/**
 * src/pages/StoryReader.jsx — Kiddsy
 * ─────────────────────────────────────────────────────────────────────────
 * BookCard       — tarjeta de libro 3D estilo cartoon (estante de cuentos)
 * DemoBookShelf  — estante con los cuentos de demostración
 * StoryCoverCard — tarjeta legacy (para LibraryView con cuentos generados)
 * StoryReader    — lector página a página con flip 3D + TTS + images
 * ─────────────────────────────────────────────────────────────────────────
 */
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ChevronLeft, ChevronRight, BookOpen, Play, Sparkles } from "lucide-react";
import { getLang } from "../components/Navbar.jsx";
import { StoryCoverIcon } from "../components/KiddsyIcons.jsx";
import { DEMO_STORIES } from "../data/demoStories.js";

const C = {
  blue:    "#1565C0", blueSoft: "#E3F2FD",
  yellow:  "#F9A825", green:    "#43A047",
  magenta: "#D81B60", orange:   "#E65100",
  purple:  "#7B1FA2", teal:     "#00838F",
};

// ── Story accent colours ──────────────────────────────────────────────────
function getStoryAccent(colorClass = "") {
  if (colorClass.includes("blue"))   return { primary: C.blue,    soft: "#E3F2FD", text: C.blue    };
  if (colorClass.includes("green"))  return { primary: C.green,   soft: "#E8F5E9", text: "#2E7D32" };
  if (colorClass.includes("orange")) return { primary: C.orange,  soft: "#FFF3E0", text: C.orange  };
  if (colorClass.includes("amber"))  return { primary: C.yellow,  soft: "#FFFDE7", text: "#F57F17" };
  if (colorClass.includes("yellow")) return { primary: C.yellow,  soft: "#FFFDE7", text: "#F57F17" };
  if (colorClass.includes("pink"))   return { primary: C.magenta, soft: "#FCE4EC", text: C.magenta };
  if (colorClass.includes("purple")) return { primary: C.purple,  soft: "#F3E5F5", text: C.purple  };
  if (colorClass.includes("teal"))   return { primary: C.teal,    soft: "#E0F7FA", text: C.teal    };
  return { primary: C.blue, soft: "#E3F2FD", text: C.blue };
}

// ════════════════════════════════════════════════════════════════════════════
// BookCard — tarjeta de libro 3D estilo cartoon
// ════════════════════════════════════════════════════════════════════════════
export function BookCard({ story, onClick, index = 0 }) {
  const accent = getStoryAccent(story.color);
  const [hovered, setHovered] = useState(false);

  // Spine gradient: slightly darker than accent
  const spineColor = accent.primary + "DD";

  return (
    <motion.button
      onClick={onClick}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, type: "spring", stiffness: 180 }}
      whileHover={{ y: -10, rotateY: -6 }}
      whileTap={{ scale: 0.96 }}
      className="relative text-left focus:outline-none"
      style={{ perspective: "600px", transformStyle: "preserve-3d" }}
    >
      {/* ── Shadow under book ─────────────────────────────────────── */}
      <motion.div
        className="absolute -bottom-3 left-4 right-4 h-6 rounded-full blur-xl"
        style={{ background: accent.primary + "55" }}
        animate={{ opacity: hovered ? 0.9 : 0.5, scaleX: hovered ? 1.1 : 1 }}
        transition={{ duration: 0.25 }}
      />

      <div className="relative flex" style={{ width: 180, height: 240 }}>

        {/* ── Spine ─────────────────────────────────────────────────── */}
        <div
          className="flex-shrink-0 rounded-l-lg flex items-end pb-3 justify-center"
          style={{
            width: 22,
            background: `linear-gradient(180deg, ${spineColor} 0%, ${accent.primary} 100%)`,
            boxShadow: `inset -3px 0 6px rgba(0,0,0,0.25)`,
          }}
        >
          <span style={{ writingMode: "vertical-rl", transform: "rotate(180deg)", fontSize: 9,
            fontFamily: "var(--font-display,'Nunito',sans-serif)", fontWeight: 800,
            color: "rgba(255,255,255,0.8)", letterSpacing: "0.05em", whiteSpace: "nowrap",
            maxHeight: 140, overflow: "hidden", textOverflow: "ellipsis" }}>
            Kiddsy
          </span>
        </div>

        {/* ── Front cover ───────────────────────────────────────────── */}
        <div
          className="relative flex-1 rounded-r-2xl overflow-hidden flex flex-col"
          style={{
            background: `linear-gradient(145deg, ${accent.soft}, white)`,
            border: `3px solid ${accent.primary}44`,
            boxShadow: `4px 0 16px rgba(0,0,0,0.18), inset -1px 0 4px rgba(0,0,0,0.06)`,
          }}
        >
          {/* Cover illustration */}
          <div className="relative flex-1 overflow-hidden">
            {story.coverImage ? (
              <img
                src={story.coverImage}
                alt={story.title}
                className="w-full h-full object-cover"
                style={{ transition: "transform 0.4s ease" }}
                onError={e => { e.target.style.display = "none"; }}
              />
            ) : (
              <div className={`w-full h-full bg-gradient-to-br ${story.color || "from-blue-400 to-cyan-300"} flex items-center justify-center`}>
                <StoryCoverIcon emoji={story.emoji} size={64}/>
              </div>
            )}

            {/* Demo badge */}
            <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-white font-display"
              style={{ fontSize: 9, fontWeight: 800, background: accent.primary + "CC", backdropFilter: "blur(4px)" }}>
              FREE
            </div>

            {/* Hover overlay — read button */}
            <AnimatePresence>
              {hovered && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="absolute inset-0 flex flex-col items-center justify-center gap-2"
                  style={{ background: "rgba(0,0,0,0.42)", backdropFilter: "blur(2px)" }}
                >
                  <motion.div initial={{ scale: 0.7 }} animate={{ scale: 1 }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-full font-display text-xs font-bold text-white shadow-xl"
                    style={{ background: accent.primary }}>
                    <Play size={12} fill="white"/> Read now
                  </motion.div>
                  <span className="font-body text-white text-xs opacity-80">
                    {story.pages?.length ?? 0} pages
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Title strip at bottom */}
          <div className="px-2 py-2 flex-shrink-0"
            style={{ background: accent.primary, minHeight: 48 }}>
            <p className="font-display text-white leading-tight"
              style={{ fontSize: 11, fontWeight: 800, display: "-webkit-box",
                WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
              {story.title}
            </p>
          </div>
        </div>

        {/* ── Pages edge (right side) ───────────────────────────────── */}
        <div className="absolute right-0 top-2 bottom-2 flex flex-col justify-around"
          style={{ width: 6, transform: "translateX(100%)" }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-r-sm"
              style={{ height: "10%", background: i % 2 === 0 ? "#F5F0E8" : "#EDE8DC",
                boxShadow: "1px 0 2px rgba(0,0,0,0.08)" }}/>
          ))}
        </div>
      </div>
    </motion.button>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// DemoBookShelf — estante de cuentos de muestra
// ════════════════════════════════════════════════════════════════════════════
export function DemoBookShelf({ lang = "es", onRead }) {
  return (
    <div className="w-full">
      {/* Section header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl"
          style={{ background: "#FFF3E0", border: "2px solid #FFE0B2" }}>
          <Sparkles size={16} style={{ color: C.orange }}/>
          <span className="font-display text-sm font-bold" style={{ color: C.orange }}>
            Demo Stories — Free
          </span>
        </div>
        <div className="h-px flex-1 rounded-full" style={{ background: "#E2E8F0" }}/>
      </div>

      {/* Bookshelf plank */}
      <div className="relative pb-4">
        {/* Shelf wood */}
        <div className="flex flex-wrap gap-8 items-end px-4 pb-8 pt-4 rounded-3xl relative"
          style={{ background: "linear-gradient(180deg,#FFF8F0 0%,#FEF3E2 100%)",
            border: "2px solid #F5E6D0", boxShadow: "inset 0 -4px 12px rgba(0,0,0,0.06)" }}>

          {/* Shelf edge */}
          <div className="absolute bottom-0 left-0 right-0 h-4 rounded-b-3xl"
            style={{ background: "linear-gradient(180deg,#D4A574,#C49060)",
              boxShadow: "0 4px 12px rgba(196,144,96,0.4)" }}/>

          {/* Book cards */}
          {DEMO_STORIES.map((story, i) => (
            <BookCard
              key={story.id}
              story={story}
              index={i}
              onClick={() => onRead(story)}
            />
          ))}

          {/* "More coming soon" placeholder books */}
          {DEMO_STORIES.length < 3 && Array.from({ length: 3 - DEMO_STORIES.length }).map((_, i) => (
            <ComingSoonBook key={`soon-${i}`} index={DEMO_STORIES.length + i}/>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Coming Soon placeholder book ──────────────────────────────────────────
function ComingSoonBook({ index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }} animate={{ opacity: 0.5, y: 0 }}
      transition={{ delay: index * 0.1 + 0.2 }}
      className="relative flex"
      style={{ width: 180, height: 240 }}
    >
      <div className="flex-shrink-0 rounded-l-lg"
        style={{ width: 22, background: "linear-gradient(180deg,#CBD5E1,#94A3B8)" }}/>
      <div className="flex-1 rounded-r-2xl flex flex-col items-center justify-center gap-2"
        style={{ background: "#F8FAFC", border: "3px dashed #CBD5E1" }}>
        <BookOpen size={28} style={{ color: "#CBD5E1" }}/>
        <span className="font-display text-xs font-bold text-slate-400">Coming soon</span>
      </div>
    </motion.div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// StoryCoverCard — card legacy para cuentos AI generados (LibraryView)
// ════════════════════════════════════════════════════════════════════════════
export function StoryCoverCard({ story, onClick, index }) {
  return (
    <motion.button onClick={onClick}
      initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, type: "spring", stiffness: 200 }}
      whileHover={{ scale: 1.04, y: -4 }} whileTap={{ scale: 0.97 }}
      className="group relative w-full text-left"
    >
      <div className="absolute left-0 top-2 bottom-2 w-3 rounded-l-xl bg-black/20 blur-sm"/>
      <div className={`relative bg-gradient-to-br ${story.color || "from-blue-400 to-cyan-300"} rounded-3xl overflow-hidden border-4 border-white min-h-[180px]`}
        style={{ boxShadow: "0 12px 40px rgba(0,0,0,0.18), 0 4px 12px rgba(0,0,0,0.1)" }}
      >
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "repeating-linear-gradient(45deg,white 0,white 1px,transparent 0,transparent 50%)", backgroundSize: "8px 8px" }}/>
        <div className="relative p-5 flex flex-col h-full min-h-[180px]">
          <StoryCoverIcon emoji={story.emoji} size={56}/>
          <h3 className="font-display text-white text-lg leading-tight flex-1 drop-shadow mt-3">{story.title}</h3>
          <div className="flex items-center gap-1.5 text-white/75 font-body text-xs mt-2">
            <BookOpen size={12}/> {story.pages?.length ?? 0} pages
          </div>
        </div>
        <div className="absolute inset-0 rounded-3xl bg-white/0 group-hover:bg-white/15 transition-all flex items-center justify-center">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} whileHover={{ scale: 1, opacity: 1 }}
            className="font-display text-sm px-4 py-2 bg-white rounded-full shadow-lg"
            style={{ color: C.blue }}
          >Read ✨</motion.div>
        </div>
      </div>
    </motion.button>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// StoryReader — lector página a página con flip 3D, imágenes y TTS
// ════════════════════════════════════════════════════════════════════════════
export default function StoryReader({ story, lang = "en", onBack }) {
  const [pageIdx,      setPageIdx]      = useState(0);
  const [direction,    setDirection]    = useState(1);
  const [audioBlobUrl, setAudioBlobUrl] = useState(null);
  const [audioLoading, setAudioLoading] = useState(false);

  const page       = story.pages[pageIdx];
  const total      = story.pages.length;
  const accent     = getStoryAccent(story.color);
  const langMeta   = getLang(lang);
  const ttsVoice   = story.voice   || "nova";
  const isFreeStory = story.isFreeStory === true;

  useEffect(() => {
    const onKey = e => {
      if (e.key === "ArrowRight" && pageIdx < total - 1) { setDirection(1);  setPageIdx(p => p + 1); }
      if (e.key === "ArrowLeft"  && pageIdx > 0)         { setDirection(-1); setPageIdx(p => p - 1); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pageIdx, total]);

  // Reset audio on page change
  useEffect(() => { setAudioBlobUrl(null); }, [pageIdx]);

  // ── Browser TTS (free stories) ─────────────────────────────────────
  const speakWithBrowser = text => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang  = lang === "es" ? "es-ES" : lang === "fr" ? "fr-FR"
              : lang === "de" ? "de-DE" : lang === "pt" ? "pt-PT"
              : lang === "it" ? "it-IT" : lang === "ar" ? "ar-SA" : "en-US";
    utt.rate  = 0.92;
    utt.pitch = 1.05;
    window.speechSynthesis.speak(utt);
  };

  const handlePlayAudio = async () => {
    const text = [page?.en || "", page?.[lang] || ""].filter(Boolean).join("  ").slice(0, 4000);
    if (isFreeStory) { speakWithBrowser(text); return; }
    if (audioBlobUrl) { new Audio(audioBlobUrl).play(); return; }
    setAudioLoading(true);
    try {
      const API = window.location.hostname === "localhost"
        ? "http://localhost:10000" : "https://kiddsy-vercel.onrender.com";
      const res  = await fetch(`${API}/api/tts`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, voice: ttsVoice }),
      });
      if (!res.ok) throw new Error("TTS failed");
      const url = URL.createObjectURL(await res.blob());
      setAudioBlobUrl(url);
      new Audio(url).play();
    } catch { speakWithBrowser(text); }
    finally  { setAudioLoading(false); }
  };

  const pageVariants = {
    enter:  d => ({ x: d > 0 ? "60%" : "-60%", opacity: 0, rotateY: d > 0 ? 15 : -15, scale: 0.92 }),
    center:      { x: "0%",  opacity: 1, rotateY: 0, scale: 1 },
    exit:   d => ({ x: d > 0 ? "-60%" : "60%", opacity: 0, rotateY: d > 0 ? -15 : 15, scale: 0.92 }),
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto">

      {/* Top bar */}
      <div className="flex items-center justify-between mb-6 px-1">
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 rounded-2xl font-display text-sm bg-white/80 shadow-sm border border-white"
          style={{ color: C.blue }}
        ><ArrowLeft size={18}/> Library</motion.button>

        <div className="flex items-center gap-2 bg-white/80 backdrop-blur rounded-full px-4 py-2 shadow-sm border border-white overflow-hidden max-w-[200px]">
          <StoryCoverIcon emoji={story.emoji} size={28}/>
          <span className="font-display text-sm truncate" style={{ color: C.blue }}>{story.title}</span>
        </div>

        <div className="font-display text-sm px-4 py-2 rounded-2xl bg-white/80 shadow-sm border border-white" style={{ color: accent.text }}>
          {pageIdx + 1} / {total}
        </div>
      </div>

      {/* Book page */}
      <div className="relative" style={{ perspective: "1200px" }}>
        <div className="absolute -bottom-4 left-4 right-4 h-8 rounded-full blur-2xl opacity-30" style={{ background: accent.primary }}/>
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div key={pageIdx} custom={direction} variants={pageVariants}
            initial="enter" animate="center" exit="exit"
            transition={{ type: "spring", stiffness: 240, damping: 28 }}
            style={{ transformStyle: "preserve-3d" }}
          >
            <div className={`bg-gradient-to-br ${story.color || "from-blue-400 to-cyan-300"} p-[5px] rounded-4xl`}
              style={{ boxShadow: `0 24px 60px ${accent.primary}40, 0 8px 20px rgba(0,0,0,0.15)` }}
            >
              <div className="relative bg-gradient-to-b from-amber-50 to-orange-50 rounded-4xl overflow-hidden">
                {/* Spine shadow */}
                <div className="absolute left-0 inset-y-0 w-6 opacity-10"
                  style={{ background: `linear-gradient(90deg, ${accent.primary}60, transparent)` }}/>

                <div className="p-6 md:p-8 flex flex-col">
                  {/* Page header */}
                  <div className="flex justify-between items-start mb-5">
                    <div className="font-display text-xs px-3 py-1 rounded-full" style={{ background: accent.soft, color: accent.text }}>
                      Page {pageIdx + 1}
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-display"
                      style={{ background: accent.soft, color: accent.text }}>
                      <span>{langMeta.flag}</span> {langMeta.name}
                    </div>
                  </div>

                  {page && (
                    <>
                      {/* ── Illustration: dalle_url (photo/AI) ─────── */}
                      {page.dalle_url && (
                        <div className="w-full mb-6 rounded-3xl overflow-hidden shadow-lg"
                          style={{ maxHeight: 320, aspectRatio: "1/1" }}>
                          <img
                            src={page.dalle_url}
                            alt={`Page ${pageIdx + 1} illustration`}
                            className="w-full h-full object-cover"
                            onError={e => { e.target.parentElement.style.display = "none"; }}
                          />
                        </div>
                      )}

                      {/* ── Illustration: SVG fallback ──────────────── */}
                      {!page.dalle_url && page.image_svg && (
                        <div className="w-full aspect-square max-h-48 mb-6 flex items-center justify-center bg-white/50 rounded-3xl p-4 shadow-inner"
                          dangerouslySetInnerHTML={{ __html: page.image_svg }}
                        />
                      )}

                      {/* ── English text ───────────────────────────── */}
                      <p className="text-xl md:text-2xl text-gray-800 leading-relaxed mb-5"
                        style={{ fontFamily: '"Comic Neue","Nunito",cursive' }}>
                        {page.en}
                      </p>

                      {/* ── Translation ────────────────────────────── */}
                      <div className="border-t-2 pt-4" style={{ borderColor: `${accent.primary}25` }}>
                        <div dir={langMeta.dir} className="flex items-start gap-3 p-4 rounded-2xl" style={{ background: accent.soft }}>
                          <span className="text-xl flex-shrink-0">{langMeta.flag}</span>
                          <p className="font-body text-base leading-relaxed" style={{ color: accent.text }}>
                            {page[lang] || "Translation not available"}
                          </p>
                        </div>
                      </div>

                      {/* ── Listen button ───────────────────────────── */}
                      <motion.button
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                        onClick={handlePlayAudio}
                        disabled={audioLoading}
                        className="mt-4 flex items-center justify-center gap-2 w-full py-3 rounded-2xl font-display text-sm transition-all"
                        style={{
                          background: audioLoading ? "#F1F5F9" : accent.soft,
                          color: audioLoading ? "#94A3B8" : accent.text,
                          border: `2px solid ${accent.primary}33`,
                          cursor: audioLoading ? "not-allowed" : "pointer",
                        }}
                      >
                        {audioLoading
                          ? <><span className="animate-spin inline-block">⏳</span> Loading…</>
                          : isFreeStory
                            ? <><span>🔊</span> Listen <span style={{ fontSize: 10, opacity: 0.7, marginLeft: 4 }}>Browser TTS</span></>
                            : audioBlobUrl
                              ? <><span>🔊</span> Play again</>
                              : <><span>🔊</span> Listen</>
                        }
                      </motion.button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-8 px-2">
        {pageIdx > 0 ? (
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
            onClick={() => { setDirection(-1); setPageIdx(p => p - 1); }}
            className="flex items-center gap-2 px-7 py-3.5 rounded-2xl font-display text-base text-white shadow-xl"
            style={{ background: `linear-gradient(135deg,${accent.primary},${accent.primary}CC)`, boxShadow: `0 8px 24px ${accent.primary}40` }}
          ><ChevronLeft size={20}/> Previous</motion.button>
        ) : <div/>}

        {pageIdx < total - 1 ? (
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
            onClick={() => { setDirection(1); setPageIdx(p => p + 1); }}
            className="flex items-center gap-2 px-7 py-3.5 rounded-2xl font-display text-base text-white shadow-xl"
            style={{ background: `linear-gradient(135deg,${accent.primary},${accent.primary}CC)`, boxShadow: `0 8px 24px ${accent.primary}40` }}
          >Next <ChevronRight size={20}/></motion.button>
        ) : (
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
            onClick={onBack}
            className="flex items-center gap-2 px-7 py-3.5 rounded-2xl font-display text-base text-white shadow-xl"
            style={{ background: `linear-gradient(135deg,${C.green},#66BB6A)`, boxShadow: `0 8px 24px ${C.green}40` }}
          >The End ✨</motion.button>
        )}
      </div>

      {/* Page dots */}
      <div className="flex justify-center gap-1.5 mt-5">
        {story.pages.map((_, i) => (
          <motion.button key={i}
            onClick={() => { setDirection(i > pageIdx ? 1 : -1); setPageIdx(i); }}
            animate={{ scale: i === pageIdx ? 1.3 : 1, opacity: i === pageIdx ? 1 : 0.35 }}
            className="w-2 h-2 rounded-full"
            style={{ background: accent.primary }}
          />
        ))}
      </div>
    </motion.div>
  );
}
