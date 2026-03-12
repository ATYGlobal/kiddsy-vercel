/**
 * src/pages/StoryReader.jsx — Kiddsy
 * ─────────────────────────────────────────────────────────────────────────
 * BookCard       — tarjeta de libro 3D con hover elegante y badge pill FREE
 * DemoBookShelf  — estante de cuentos de muestra
 * StoryCoverCard — tarjeta para cuentos AI generados (LibraryView)
 * StoryReader    — lector página a página: fade suave, TTS, imágenes
 * ─────────────────────────────────────────────────────────────────────────
 */
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, ChevronLeft, ChevronRight, BookOpen,
  Play, Sparkles, Volume2, Loader2, X,
} from "lucide-react";
import { getLang } from "../components/Navbar.jsx";
import { StoryCoverIcon } from "../components/KiddsyIcons.jsx";
import { DEMO_STORIES } from "../data/demoStories.js";

const C = {
  blue:    "#1565C0", blueSoft:  "#E3F2FD",
  yellow:  "#F9A825", yellowSoft:"#FFFDE7",
  green:   "#43A047", greenSoft: "#E8F5E9",
  magenta: "#D81B60", magentaSoft:"#FCE4EC",
  orange:  "#E65100", orangeSoft:"#FFF3E0",
  purple:  "#7B1FA2", teal:      "#00838F",
  red:     "#E53935",
};

// ── Story accent colours ───────────────────────────────────────────────────
function getStoryAccent(colorClass = "") {
  if (colorClass.includes("blue"))   return { primary: C.blue,    soft: C.blueSoft,    text: C.blue    };
  if (colorClass.includes("green"))  return { primary: C.green,   soft: C.greenSoft,   text: "#2E7D32" };
  if (colorClass.includes("orange")) return { primary: C.orange,  soft: C.orangeSoft,  text: C.orange  };
  if (colorClass.includes("amber"))  return { primary: C.yellow,  soft: C.yellowSoft,  text: "#F57F17" };
  if (colorClass.includes("yellow")) return { primary: C.yellow,  soft: C.yellowSoft,  text: "#F57F17" };
  if (colorClass.includes("pink"))   return { primary: C.magenta, soft: C.magentaSoft, text: C.magenta };
  if (colorClass.includes("purple")) return { primary: C.purple,  soft: "#F3E5F5",     text: C.purple  };
  if (colorClass.includes("teal"))   return { primary: C.teal,    soft: "#E0F7FA",     text: C.teal    };
  return { primary: C.blue, soft: C.blueSoft, text: C.blue };
}

// ════════════════════════════════════════════════════════════════════════════
// BookCard — tarjeta 3D con hover suave y badge pill elegante
// ════════════════════════════════════════════════════════════════════════════
export function BookCard({ story, onClick, index = 0 }) {
  const accent = getStoryAccent(story.color);
  const [hovered, setHovered] = useState(false);

  return (
    <motion.button
      onClick={onClick}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={()   => setHovered(false)}
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, type: "spring", stiffness: 200, damping: 20 }}
      whileHover={{ y: -12, rotateY: -5, scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      className="relative text-left focus:outline-none"
      style={{ perspective: "700px", transformStyle: "preserve-3d" }}
    >
      {/* ── Ground shadow ──────────────────────────────────────────── */}
      <motion.div
        className="absolute -bottom-3 left-3 right-3 h-5 rounded-full"
        style={{ background: accent.primary, filter: "blur(14px)" }}
        animate={{ opacity: hovered ? 0.55 : 0.28, scaleX: hovered ? 1.08 : 0.95 }}
        transition={{ duration: 0.28 }}
      />

      <div className="relative flex" style={{ width: 176, height: 236 }}>

        {/* ── Spine ─────────────────────────────────────────────────── */}
        <div
          className="flex-shrink-0 rounded-l-xl flex items-end pb-3 justify-center"
          style={{
            width: 20,
            background: `linear-gradient(180deg,${accent.primary}EE 0%,${accent.primary} 100%)`,
            boxShadow: "inset -3px 0 8px rgba(0,0,0,0.22)",
          }}
        >
          <span style={{
            writingMode: "vertical-rl", transform: "rotate(180deg)", fontSize: 8,
            fontFamily: "var(--font-display,'Nunito',sans-serif)", fontWeight: 800,
            color: "rgba(255,255,255,0.75)", letterSpacing: "0.07em",
            whiteSpace: "nowrap", maxHeight: 130, overflow: "hidden",
          }}>Kiddsy</span>
        </div>

        {/* ── Front cover ───────────────────────────────────────────── */}
        <div
          className="relative flex-1 flex flex-col overflow-hidden"
          style={{
            borderRadius: "0 18px 18px 0",
            background: `linear-gradient(150deg,${accent.soft} 0%,#FFFDF9 100%)`,
            border: `2.5px solid ${accent.primary}38`,
            boxShadow: "5px 0 18px rgba(0,0,0,0.16), inset -1px 0 4px rgba(0,0,0,0.05)",
          }}
        >
          {/* Cover illustration */}
          <div className="relative flex-1 overflow-hidden">
            {story.coverImage ? (
              <img
                src={story.coverImage}
                alt={story.title}
                className="w-full h-full object-cover"
                style={{ transition: "transform 0.4s ease",
                  transform: hovered ? "scale(1.06)" : "scale(1)" }}
                onError={e => { e.target.style.display = "none"; }}
              />
            ) : (
              <div className={`w-full h-full bg-gradient-to-br ${story.color || "from-blue-400 to-cyan-300"} flex items-center justify-center`}>
                <StoryCoverIcon emoji={story.emoji} size={60}/>
              </div>
            )}

            {/* ── FREE badge — pill elegante semi-transparente ──────── */}
            <div
              className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2.5 py-1 rounded-full"
              style={{
                background: "rgba(255,255,255,0.22)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.45)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
              }}
            >
              <Sparkles size={8} style={{ color: "#FFF" }}/>
              <span style={{
                fontSize: 9, fontWeight: 800,
                fontFamily: "var(--font-display,'Nunito',sans-serif)",
                color: "#fff", letterSpacing: "0.06em",
              }}>FREE</span>
            </div>

            {/* ── Hover overlay — leer ahora ────────────────────────── */}
            <AnimatePresence>
              {hovered && (
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="absolute inset-0 flex flex-col items-center justify-center gap-2"
                  style={{ background: "rgba(0,0,0,0.38)", backdropFilter: "blur(3px)" }}
                >
                  <motion.div
                    initial={{ scale: 0.75, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 280 }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-full font-display font-bold text-white shadow-xl"
                    style={{ background: accent.primary, fontSize: 12 }}
                  >
                    <Play size={11} fill="white"/> Read now
                  </motion.div>
                  <span className="font-body text-white text-xs" style={{ opacity: 0.82 }}>
                    {story.pages?.length ?? 0} pages
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Title strip */}
          <div className="px-2.5 py-2 flex-shrink-0" style={{ background: accent.primary, minHeight: 46 }}>
            <p className="font-display text-white leading-snug"
              style={{
                fontSize: 11, fontWeight: 800,
                display: "-webkit-box", WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical", overflow: "hidden",
              }}>
              {story.title}
            </p>
          </div>
        </div>

        {/* ── Page edges ─────────────────────────────────────────────── */}
        <div className="absolute right-0 top-2 bottom-2 flex flex-col justify-around"
          style={{ width: 6, transform: "translateX(100%)" }}>
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="rounded-r-sm"
              style={{
                height: "9%",
                background: i % 2 === 0 ? "#F5EFE6" : "#EDE6D9",
                boxShadow: "1px 0 2px rgba(0,0,0,0.07)",
              }}/>
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
          style={{ background: C.orangeSoft, border: `2px solid #FFE0B2` }}>
          <Sparkles size={15} style={{ color: C.orange }}/>
          <span className="font-display text-sm font-bold" style={{ color: C.orange }}>
            Demo Stories — Free
          </span>
        </div>
        <div className="h-px flex-1 rounded-full" style={{ background: "#E2E8F0" }}/>
      </div>

      {/* Bookshelf plank */}
      <div className="relative pb-5">
        <div
          className="flex flex-wrap gap-8 items-end px-6 pb-9 pt-6 rounded-3xl relative"
          style={{
            background: "linear-gradient(180deg,#FFFAF4 0%,#FEF3E2 100%)",
            border: "2px solid #F0E0C8",
            boxShadow: "inset 0 -4px 16px rgba(0,0,0,0.05), 0 4px 24px rgba(0,0,0,0.06)",
          }}
        >
          {/* Shelf wood edge */}
          <div className="absolute bottom-0 left-0 right-0 h-5 rounded-b-3xl"
            style={{
              background: "linear-gradient(180deg,#C8996A,#B07D50)",
              boxShadow: "0 4px 14px rgba(176,125,80,0.38)",
            }}/>

          {DEMO_STORIES.map((story, i) => (
            <BookCard key={story.id} story={story} index={i} onClick={() => onRead(story)}/>
          ))}

          {DEMO_STORIES.length < 3 &&
            Array.from({ length: 3 - DEMO_STORIES.length }).map((_, i) => (
              <ComingSoonBook key={`soon-${i}`} index={DEMO_STORIES.length + i}/>
            ))
          }
        </div>
      </div>
    </div>
  );
}

// ── Coming Soon placeholder ────────────────────────────────────────────────
function ComingSoonBook({ index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }} animate={{ opacity: 0.45, y: 0 }}
      transition={{ delay: index * 0.1 + 0.2 }}
      className="relative flex"
      style={{ width: 176, height: 236 }}
    >
      <div className="flex-shrink-0 rounded-l-xl"
        style={{ width: 20, background: "linear-gradient(180deg,#CBD5E1,#94A3B8)" }}/>
      <div className="flex-1 flex flex-col items-center justify-center gap-2"
        style={{
          borderRadius: "0 18px 18px 0",
          background: "#F8FAFC",
          border: "2.5px dashed #CBD5E1",
        }}>
        <BookOpen size={26} style={{ color: "#CBD5E1" }}/>
        <span className="font-display text-xs font-bold text-slate-400">Coming soon</span>
      </div>
    </motion.div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// StoryCoverCard — card para cuentos AI generados (LibraryView)
// ════════════════════════════════════════════════════════════════════════════
export function StoryCoverCard({ story, onClick, index }) {
  return (
    <motion.button onClick={onClick}
      initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, type: "spring", stiffness: 200 }}
      whileHover={{ scale: 1.04, y: -5 }} whileTap={{ scale: 0.97 }}
      className="group relative w-full text-left"
    >
      {/* Spine shadow */}
      <div className="absolute left-0 top-2 bottom-2 w-3 rounded-l-xl bg-black/15 blur-sm"/>
      <div
        className={`relative bg-gradient-to-br ${story.color || "from-blue-400 to-cyan-300"} rounded-3xl overflow-hidden border-4 border-white`}
        style={{ boxShadow: "0 12px 36px rgba(0,0,0,0.16), 0 4px 12px rgba(0,0,0,0.08)", minHeight: 180 }}
      >
        {/* Texture overlay */}
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "repeating-linear-gradient(45deg,white 0,white 1px,transparent 0,transparent 50%)", backgroundSize: "8px 8px" }}/>
        <div className="relative p-5 flex flex-col h-full min-h-[180px]">
          <StoryCoverIcon emoji={story.emoji} size={52}/>
          <h3 className="font-display text-white text-lg leading-tight flex-1 drop-shadow mt-3">{story.title}</h3>
          <div className="flex items-center gap-1.5 text-white/75 font-body text-xs mt-2">
            <BookOpen size={11}/> {story.pages?.length ?? 0} pages
          </div>
        </div>
        {/* Hover read button */}
        <div className="absolute inset-0 rounded-3xl bg-white/0 group-hover:bg-white/12 transition-all flex items-center justify-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }} whileHover={{ scale: 1, opacity: 1 }}
            className="font-display text-sm px-4 py-2 bg-white rounded-full shadow-lg"
            style={{ color: C.blue }}
          >Read ✨</motion.div>
        </div>
      </div>
    </motion.button>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// StoryReader — lector página a página: fade/slide suave, TTS, imágenes
// ════════════════════════════════════════════════════════════════════════════
export default function StoryReader({ story, lang = "en", onBack }) {
  const [pageIdx,      setPageIdx]      = useState(0);
  const [direction,    setDirection]    = useState(1);
  const [audioBlobUrl, setAudioBlobUrl] = useState(null);
  const [audioLoading, setAudioLoading] = useState(false);

  const page        = story.pages[pageIdx];
  const total       = story.pages.length;
  const accent      = getStoryAccent(story.color);
  const langMeta    = getLang(lang);
  const ttsVoice    = story.voice || "nova";
  const isFreeStory = story.isFreeStory === true;

  // Keyboard navigation
  useEffect(() => {
    const onKey = e => {
      if (e.key === "ArrowRight" && pageIdx < total - 1) { setDirection(1);  setPageIdx(p => p + 1); }
      if (e.key === "ArrowLeft"  && pageIdx > 0)         { setDirection(-1); setPageIdx(p => p - 1); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pageIdx, total]);

  useEffect(() => { setAudioBlobUrl(null); }, [pageIdx]);

  // ── TTS ─────────────────────────────────────────────────────────────
  const speakWithBrowser = text => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utt  = new SpeechSynthesisUtterance(text);
    utt.lang   = lang === "es" ? "es-ES" : lang === "fr" ? "fr-FR"
               : lang === "de" ? "de-DE" : lang === "pt" ? "pt-PT"
               : lang === "it" ? "it-IT" : lang === "ar" ? "ar-SA" : "en-US";
    utt.rate   = 0.90;
    utt.pitch  = 1.05;
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
      const res = await fetch(`${API}/api/tts`, {
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

  // ── Page transition — fade + leve slide ─────────────────────────────
  const pageVariants = {
    enter:  d => ({ x: d > 0 ? 48 : -48, opacity: 0, scale: 0.97 }),
    center:      ({ x: 0,  opacity: 1, scale: 1 }),
    exit:   d => ({ x: d > 0 ? -48 : 48, opacity: 0, scale: 0.97 }),
  };

  const goNext = () => { setDirection(1);  setPageIdx(p => p + 1); };
  const goPrev = () => { setDirection(-1); setPageIdx(p => p - 1); };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="max-w-3xl mx-auto"
    >

      {/* ── Top bar ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-6 px-1">
        <motion.button
          whileHover={{ scale: 1.05, x: -2 }} whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl font-display text-sm shadow-sm border border-white"
          style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(8px)", color: C.blue }}
        >
          <ArrowLeft size={16}/> Library
        </motion.button>

        {/* Story title pill */}
        <div className="flex items-center gap-2 rounded-full px-4 py-2 shadow-sm border border-white overflow-hidden max-w-[200px]"
          style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(8px)" }}>
          <StoryCoverIcon emoji={story.emoji} size={24}/>
          <span className="font-display text-sm font-bold truncate" style={{ color: accent.primary }}>
            {story.title}
          </span>
        </div>

        {/* Page counter */}
        <div className="font-display text-sm font-bold px-4 py-2.5 rounded-2xl shadow-sm border border-white"
          style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(8px)", color: accent.text }}>
          {pageIdx + 1}<span className="opacity-40 font-normal"> / {total}</span>
        </div>
      </div>

      {/* ── Book page ───────────────────────────────────────────────── */}
      <div className="relative">
        {/* Glow under */}
        <div className="absolute -bottom-5 left-8 right-8 h-8 rounded-full opacity-25"
          style={{ background: accent.primary, filter: "blur(20px)" }}/>

        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={pageIdx}
            custom={direction}
            variants={pageVariants}
            initial="enter" animate="center" exit="exit"
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {/* Outer gradient border */}
            <div
              className={`bg-gradient-to-br ${story.color || "from-blue-400 to-cyan-300"} p-[4px] rounded-3xl`}
              style={{ boxShadow: `0 20px 52px ${accent.primary}38, 0 6px 18px rgba(0,0,0,0.12)` }}
            >
              {/* Book interior */}
              <div className="relative rounded-3xl overflow-hidden"
                style={{ background: "linear-gradient(160deg,#FEFCF7 0%,#FEF9F2 60%,#FDF4E7 100%)" }}>

                {/* Spine light */}
                <div className="absolute left-0 inset-y-0 w-8 pointer-events-none"
                  style={{ background: `linear-gradient(90deg,${accent.primary}14,transparent)` }}/>

                {/* Page lines texture — sutil */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.025]"
                  style={{
                    backgroundImage: "repeating-linear-gradient(0deg,#555 0,#555 1px,transparent 1px,transparent 28px)",
                    backgroundPositionY: "48px",
                  }}/>

                <div className="relative p-6 md:p-8">

                  {/* Page header */}
                  <div className="flex justify-between items-center mb-5">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                      style={{ background: accent.soft }}>
                      <BookOpen size={11} style={{ color: accent.text }}/>
                      <span className="font-display text-xs font-bold" style={{ color: accent.text }}>
                        Page {pageIdx + 1}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                      style={{ background: accent.soft }}>
                      <span style={{ fontSize: 14, lineHeight: 1 }}>{langMeta.flag}</span>
                      <span className="font-display text-xs font-bold" style={{ color: accent.text }}>
                        {langMeta.name}
                      </span>
                    </div>
                  </div>

                  {page && (
                    <>
                      {/* ── Illustration — dalle_url ──────────────── */}
                      {page.dalle_url && (
                        <div className="w-full mb-6 rounded-2xl overflow-hidden shadow-md"
                          style={{ maxHeight: 300, aspectRatio: "4/3" }}>
                          <img
                            src={page.dalle_url}
                            alt={`Page ${pageIdx + 1}`}
                            className="w-full h-full object-cover"
                            onError={e => { e.target.parentElement.style.display = "none"; }}
                          />
                        </div>
                      )}

                      {/* ── Illustration — SVG fallback ───────────── */}
                      {!page.dalle_url && page.image_svg && (
                        <div
                          className="w-full aspect-square max-h-48 mb-6 flex items-center justify-center rounded-2xl p-4"
                          style={{ background: accent.soft + "60" }}
                          dangerouslySetInnerHTML={{ __html: page.image_svg }}
                        />
                      )}

                      {/* ── English text — grande, amigable ──────── */}
                      <p style={{
                        fontSize: "clamp(1.15rem,2.5vw,1.45rem)",
                        lineHeight: 1.75,
                        color: "#1E293B",
                        fontFamily: "'Nunito','Quicksand',system-ui,sans-serif",
                        fontWeight: 600,
                        marginBottom: "1.25rem",
                        letterSpacing: "0.01em",
                      }}>
                        {page.en}
                      </p>

                      {/* ── Separador ────────────────────────────── */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className="h-px flex-1 rounded-full" style={{ background: `${accent.primary}22` }}/>
                        <span style={{ fontSize: 14 }}>{langMeta.flag}</span>
                        <div className="h-px flex-1 rounded-full" style={{ background: `${accent.primary}22` }}/>
                      </div>

                      {/* ── Translation ───────────────────────────── */}
                      <div
                        dir={langMeta.dir}
                        className="flex items-start gap-3 p-4 rounded-2xl mb-5"
                        style={{ background: accent.soft }}
                      >
                        <p className="font-body leading-relaxed flex-1"
                          style={{
                            color: accent.text, fontSize: "1rem",
                            lineHeight: 1.65, fontWeight: 500,
                          }}>
                          {page[lang] || "Translation not available"}
                        </p>
                      </div>

                      {/* ── Listen button ────────────────────────── */}
                      <motion.button
                        whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.97 }}
                        onClick={handlePlayAudio}
                        disabled={audioLoading}
                        className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-2xl font-display text-sm font-bold transition-all"
                        style={{
                          background: audioLoading ? "#F1F5F9" : accent.soft,
                          color: audioLoading ? "#94A3B8" : accent.text,
                          border: `2px solid ${accent.primary}28`,
                          cursor: audioLoading ? "not-allowed" : "pointer",
                          boxShadow: audioLoading ? "none" : `0 4px 12px ${accent.primary}16`,
                        }}
                      >
                        {audioLoading ? (
                          <><Loader2 size={15} className="animate-spin"/> Loading…</>
                        ) : (
                          <>
                            <Volume2 size={15}/>
                            {isFreeStory ? "Listen" : audioBlobUrl ? "Play again" : "Listen"}
                            {isFreeStory && (
                              <span className="text-xs opacity-55 font-normal">· browser TTS</span>
                            )}
                          </>
                        )}
                      </motion.button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Navigation buttons ──────────────────────────────────────── */}
      <div className="flex items-center justify-between mt-8 px-1">
        {pageIdx > 0 ? (
          <motion.button
            whileHover={{ scale: 1.05, x: -2 }} whileTap={{ scale: 0.96 }}
            onClick={goPrev}
            className="flex items-center gap-2 px-6 py-3.5 rounded-2xl font-display text-base text-white font-bold shadow-lg"
            style={{
              background: `linear-gradient(135deg,${accent.primary},${accent.primary}CC)`,
              boxShadow: `0 8px 22px ${accent.primary}38`,
            }}
          >
            <ChevronLeft size={20}/> Previous
          </motion.button>
        ) : <div/>}

        {pageIdx < total - 1 ? (
          <motion.button
            whileHover={{ scale: 1.05, x: 2 }} whileTap={{ scale: 0.96 }}
            onClick={goNext}
            className="flex items-center gap-2 px-6 py-3.5 rounded-2xl font-display text-base text-white font-bold shadow-lg"
            style={{
              background: `linear-gradient(135deg,${accent.primary},${accent.primary}CC)`,
              boxShadow: `0 8px 22px ${accent.primary}38`,
            }}
          >
            Next <ChevronRight size={20}/>
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}
            onClick={onBack}
            className="flex items-center gap-2 px-6 py-3.5 rounded-2xl font-display text-base text-white font-bold shadow-lg"
            style={{
              background: `linear-gradient(135deg,${C.green},#66BB6A)`,
              boxShadow: `0 8px 22px ${C.green}40`,
            }}
          >
            The End ✨
          </motion.button>
        )}
      </div>

      {/* ── Progress dots ───────────────────────────────────────────── */}
      <div className="flex justify-center gap-2 mt-6">
        {story.pages.map((_, i) => (
          <motion.button
            key={i}
            onClick={() => { setDirection(i > pageIdx ? 1 : -1); setPageIdx(i); }}
            animate={{
              scale:   i === pageIdx ? 1.4 : 1,
              opacity: i === pageIdx ? 1 : 0.3,
              width:   i === pageIdx ? 20 : 8,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
            style={{
              height: 8, borderRadius: 4,
              background: accent.primary,
              border: "none", cursor: "pointer", padding: 0,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}
