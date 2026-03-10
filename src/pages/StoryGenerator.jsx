/**
 * src/pages/StoryGenerator.jsx — Kiddsy
 * ─────────────────────────────────────────────────────────────────────────
 * Página completa de generación de cuentos:
 *   • Formulario de generación (nombre, tema, idioma)
 *   • Streaming SSE desde /api/generate-story (Groq)
 *   • Loader animado con preview en tiempo real
 *   • Lector de cuento página a página con SVG inline
 *   • TTS vía /api/tts (OpenAI nova)
 *   • Guardado automático en localStorage (y Supabase si está activo)
 *
 * PROPS:
 *   lang         {string}   — código ISO del idioma activo (desde Navbar)
 *   onLangChange {fn}       — callback al cambiar idioma dentro del form
 *   onGenerated  {fn}       — callback(story, lang) al finalizar generación
 *   onBack       {fn}       — callback para volver a la Library / Hero
 *
 * USO en App.jsx:
 *   import StoryGenerator from "./pages/StoryGenerator";
 *   <StoryGenerator lang={lang} onLangChange={setLang}
 *                   onGenerated={handleGenerated} onBack={()=>setView("home")}/>
 * ─────────────────────────────────────────────────────────────────────────
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence }     from "framer-motion";
import {
  BookOpen, Wand2, Sparkles, Volume2,
  RefreshCw, ArrowLeft, ChevronLeft, ChevronRight,
} from "lucide-react";

import { getLang, LanguagePicker }   from "../components/Navbar.jsx";
import { StoryCoverIcon }             from "../components/KiddsyIcons.jsx";
import { StoryBg }                    from "../components/PageBg.jsx";
import { BubbleTitle }                from "../components/KiddsyFont.jsx";
import KiddsyTitle                    from "../components/KiddsyTitle";

// ── Brand colours ────────────────────────────────────────────────────────
const C = {
  blue:    "#1565C0",
  red:     "#E53935",
  yellow:  "#F9A825",
  green:   "#43A047",
  magenta: "#D81B60",
  cyan:    "#00ACC1",
  orange:  "#E65100",
};

// ── LocalStorage helpers ─────────────────────────────────────────────────
const LS_NAME    = "kiddsy_childName";
const LS_STORIES = "kiddsy_guestStories";

function lsGet(key, fallback = null) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
  catch { return fallback; }
}
function lsSet(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

// ── Guest ID ─────────────────────────────────────────────────────────────
const getGuestId = () => {
  let gid = localStorage.getItem("kiddsy_guest_id");
  if (!gid) { gid = crypto.randomUUID(); localStorage.setItem("kiddsy_guest_id", gid); }
  return gid;
};

// ── Supabase stub (activa cuando configures las vars de entorno) ──────────
let _supabase = null;
function getSupabase() {
  if (_supabase) return _supabase;
  try {
    const url = import.meta.env.VITE_SUPABASE_URL;
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
    if (!url || !key) return null;
    // Descomenta cuando tengas @supabase/supabase-js instalado:
    // const { createClient } = await import("@supabase/supabase-js");
    // _supabase = createClient(url, key);
    return null;
  } catch { return null; }
}

async function saveStory(storyData, userId) {
  const sb = getSupabase();
  if (sb) {
    const { error } = await sb.from("stories").insert([{ ...storyData, user_id: userId }]);
    if (error) console.error("[Kiddsy] Supabase save error:", error.message);
  }
  const existing = lsGet(LS_STORIES, []);
  lsSet(LS_STORIES, [storyData, ...existing].slice(0, 20));
}

// ── API URL dinámico ─────────────────────────────────────────────────────
const API_URL = () =>
  window.location.hostname === "localhost"
    ? "http://localhost:10000"
    : "https://kiddsy-vercel.onrender.com";

// ── Story accent colours (derived from Tailwind gradient class) ───────────
function getStoryAccent(colorClass = "") {
  if (colorClass.includes("blue"))    return { primary: C.blue,    soft: "#E3F2FD", text: C.blue    };
  if (colorClass.includes("green"))   return { primary: C.green,   soft: "#E8F5E9", text: "#2E7D32" };
  if (colorClass.includes("orange"))  return { primary: C.orange,  soft: "#FFF3E0", text: C.orange  };
  if (colorClass.includes("amber"))   return { primary: C.yellow,  soft: "#FFFDE7", text: "#F57F17" };
  if (colorClass.includes("yellow"))  return { primary: C.yellow,  soft: "#FFFDE7", text: "#F57F17" };
  if (colorClass.includes("pink"))    return { primary: C.magenta, soft: "#FCE4EC", text: C.magenta };
  if (colorClass.includes("red"))     return { primary: C.red,     soft: "#FFEBEE", text: "#C62828" };
  if (colorClass.includes("cyan"))    return { primary: C.cyan,    soft: "#E0F7FA", text: "#006064" };
  return { primary: C.blue, soft: "#E3F2FD", text: C.blue };
}

// ════════════════════════════════════════════════════════════════════════════
// GeneratingLoader — pantalla mientras hace streaming
// ════════════════════════════════════════════════════════════════════════════
function GeneratingLoader({ childName, theme, storyColor, streamText }) {
  const accent  = getStoryAccent(storyColor);
  const emojis  = ["✨","📖","🌟","🪄","💫","🌈","⭐","🎨"];
  const particles = Array.from({ length: 12 }, (_, i) => ({
    id:       i,
    x:        Math.random() * 80 + 10,
    y:        Math.random() * 60 + 20,
    emoji:    emojis[i % emojis.length],
    delay:    Math.random() * 1.5,
    duration: Math.random() * 1.5 + 2,
  }));

  // Extract readable preview from partial streaming JSON
  const preview = (() => {
    if (!streamText) return "";
    const m = streamText.match(/"en"\s*:\s*"([^"]{10,})"/);
    if (m) return m[1].slice(0, 120) + "…";
    const t = streamText.match(/"title"\s*:\s*"([^"]{4,})"/);
    if (t) return `Generating "${t[1]}"…`;
    return "";
  })();

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="fixed inset-0 flex flex-col items-center justify-center z-50"
      style={{ background: `linear-gradient(145deg, ${accent.soft}, white)` }}
    >
      {/* Floating emoji particles */}
      {particles.map(p => (
        <motion.span key={p.id} className="absolute text-2xl select-none pointer-events-none"
          style={{ left: `${p.x}%`, top: `${p.y}%` }}
          animate={{ y: [0, -30, 0], opacity: [0.4, 0.9, 0.4], scale: [0.9, 1.2, 0.9] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
        >{p.emoji}</motion.span>
      ))}

      {/* Book icon */}
      <motion.div
        className={`w-28 h-28 rounded-4xl bg-gradient-to-br ${storyColor || "from-blue-400 to-cyan-300"} flex items-center justify-center shadow-2xl mb-8 border-4 border-white`}
        animate={{ scale: [1, 1.06, 1], rotate: [-3, 3, -3] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <BookOpen size={52} strokeWidth={1.5} className="text-white"/>
      </motion.div>

      <motion.h2
        className="font-display text-3xl font-bold mb-3 text-center px-6"
        style={{ color: accent.text }}
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >Writing {childName}'s story…</motion.h2>

      <p className="font-body text-lg text-center mb-5" style={{ color: `${accent.text}80` }}>
        {theme && `About: ${theme}`}
      </p>

      {/* Live streaming preview */}
      <AnimatePresence>
        {preview && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-4 px-5 py-3 rounded-2xl font-body text-sm text-center leading-relaxed"
            style={{
              background: `${accent.primary}14`,
              border: `1.5px solid ${accent.primary}30`,
              color: accent.text,
            }}
          >{preview}</motion.div>
        )}
      </AnimatePresence>

      {/* Progress bar */}
      <div className="w-64 h-3 rounded-full overflow-hidden mt-8" style={{ background: `${accent.primary}20` }}>
        <motion.div className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${accent.primary}, ${accent.primary}99)` }}
          animate={{ width: ["0%", "90%"] }}
          transition={{ duration: 18, ease: "easeOut" }}
        />
      </div>
      <p className="font-body text-xs mt-4 text-center" style={{ color: `${accent.text}60` }}>
        Kiddsy AI is spinning a magical story for you… ✨
      </p>
    </motion.div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// StoryCoverCard — tarjeta de cuento en la mini-biblioteca
// ════════════════════════════════════════════════════════════════════════════
function StoryCoverCard({ story, onClick, index }) {
  return (
    <motion.button onClick={onClick}
      initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, type: "spring", stiffness: 200 }}
      whileHover={{ scale: 1.04, y: -4 }} whileTap={{ scale: 0.97 }}
      className="group relative w-full text-left"
    >
      <div className="absolute left-0 top-2 bottom-2 w-3 rounded-l-xl bg-black/20 blur-sm"/>
      <div
        className={`relative bg-gradient-to-br ${story.color || "from-blue-400 to-cyan-300"} rounded-3xl overflow-hidden border-4 border-white min-h-[180px]`}
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
// StoryReader — lector página a página con TTS
// ════════════════════════════════════════════════════════════════════════════
function StoryReader({ story, lang, onBack }) {
  const [pageIdx,      setPageIdx]      = useState(0);
  const [direction,    setDirection]    = useState(1);
  const [audioBlobUrl, setAudioBlobUrl] = useState(null);
  const [audioLoading, setAudioLoading] = useState(false);

  const page     = story.pages[pageIdx];
  const total    = story.pages.length;
  const accent   = getStoryAccent(story.color);
  const langMeta = getLang(lang);

  // Keyboard navigation
  useEffect(() => {
    const onKey = e => {
      if (e.key === "ArrowRight" && pageIdx < total - 1) { setDirection(1);  setPageIdx(p => p + 1); }
      if (e.key === "ArrowLeft"  && pageIdx > 0)         { setDirection(-1); setPageIdx(p => p - 1); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pageIdx, total]);

  // TTS
  const handlePlayAudio = async () => {
    if (audioBlobUrl) { new Audio(audioBlobUrl).play(); return; }
    setAudioLoading(true);
    const textToRead = [
      story.title ? `${story.title}.` : "",
      story.en || story.content || "",
    ].filter(Boolean).join(" ").slice(0, 4000);
    try {
      const res = await fetch(`${API_URL()}/api/tts`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ text: textToRead }),
      });
      if (!res.ok) throw new Error("TTS failed");
      const blob = await res.blob();
      const url  = URL.createObjectURL(blob);
      setAudioBlobUrl(url);
      new Audio(url).play();
    } catch (e) {
      console.error("[TTS]", e);
    } finally {
      setAudioLoading(false);
    }
  };

  const pageVariants = {
    enter:  d => ({ x: d > 0 ? "60%" : "-60%", opacity: 0, rotateY: d > 0 ? 15 : -15, scale: 0.92 }),
    center: { x: "0%", opacity: 1, rotateY: 0, scale: 1 },
    exit:   d => ({ x: d > 0 ? "-60%" : "60%", opacity: 0, rotateY: d > 0 ? -15 : 15, scale: 0.92 }),
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto">
      {/* Header bar */}
      <div className="flex items-center justify-between mb-6 px-1">
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 rounded-2xl font-display text-sm bg-white/80 shadow-sm border border-white"
          style={{ color: C.blue }}
        ><ArrowLeft size={18}/> Back</motion.button>

        <div className="flex items-center gap-2 bg-white/80 backdrop-blur rounded-full px-4 py-2 shadow-sm border border-white overflow-hidden max-w-[200px]">
          <StoryCoverIcon emoji={story.emoji} size={28}/>
          <span className="font-display text-sm truncate" style={{ color: C.blue }}>{story.title}</span>
        </div>

        <div className="font-display text-sm px-4 py-2 rounded-2xl bg-white/80 shadow-sm border border-white" style={{ color: accent.text }}>
          {pageIdx + 1} / {total}
        </div>
      </div>

      {/* TTS button */}
      <div className="flex justify-center mb-4">
        <motion.button
          whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
          onClick={handlePlayAudio} disabled={audioLoading}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl font-display text-white shadow-lg"
          style={{
            background: audioLoading ? "#94A3B8" : "linear-gradient(135deg,#00ACC1,#0288D1)",
            cursor:     audioLoading ? "not-allowed" : "pointer",
            fontSize:   15,
          }}
        >
          {audioLoading
            ? <><RefreshCw size={16} className="animate-spin"/> Generating audio…</>
            : audioBlobUrl
              ? <><Volume2 size={16}/> Play again</>
              : <><Volume2 size={16}/> Listen to story</>
          }
        </motion.button>
      </div>

      {/* Page card with 3D flip */}
      <div className="relative" style={{ perspective: "1200px" }}>
        <div className="absolute -bottom-4 left-4 right-4 h-8 rounded-full blur-2xl opacity-30" style={{ background: accent.primary }}/>
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div key={pageIdx} custom={direction} variants={pageVariants}
            initial="enter" animate="center" exit="exit"
            transition={{ type: "spring", stiffness: 240, damping: 28 }}
            style={{ transformStyle: "preserve-3d" }}
          >
            <div
              className={`bg-gradient-to-br ${story.color || "from-blue-400 to-cyan-300"} p-[5px] rounded-4xl`}
              style={{ boxShadow: `0 24px 60px ${accent.primary}40, 0 8px 20px rgba(0,0,0,0.15)` }}
            >
              <div className="relative bg-gradient-to-b from-amber-50 to-orange-50 rounded-4xl overflow-hidden min-h-[400px] md:min-h-[460px]">
                {/* Binding line */}
                <div className="absolute left-0 inset-y-0 w-6 opacity-10"
                  style={{ background: `linear-gradient(90deg, ${accent.primary}60, transparent)` }}/>

                <div className="p-8 md:p-10 flex flex-col h-full min-h-[400px]">
                  {/* Page header */}
                  <div className="flex justify-between items-start mb-6">
                    <div className="font-display text-xs px-3 py-1 rounded-full"
                      style={{ background: accent.soft, color: accent.text }}>
                      Page {pageIdx + 1}
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-display"
                      style={{ background: accent.soft, color: accent.text }}>
                      <span>{langMeta.flag}</span> {langMeta.name}
                    </div>
                  </div>

                  {page && (
                    <>
                      {/* SVG illustration (dangerouslySetInnerHTML preservado) */}
                      {page.image_svg && (
                        <div
                          className="w-full aspect-square max-h-48 mb-6 flex items-center justify-center bg-white/50 rounded-3xl p-4 shadow-inner"
                          dangerouslySetInnerHTML={{ __html: page.image_svg }}
                        />
                      )}

                      {/* English text */}
                      <p className="text-2xl text-gray-800 leading-relaxed mb-6"
                        style={{ fontFamily: '"Comic Neue","Nunito",cursive' }}>
                        {page.en}
                      </p>

                      {/* Translation */}
                      <div className="border-t-2 pt-5" style={{ borderColor: `${accent.primary}25` }}>
                        <div
                          dir={langMeta.dir}
                          className="flex items-start gap-3 p-4 rounded-2xl"
                          style={{ background: accent.soft }}
                        >
                          <span className="text-xl flex-shrink-0">{langMeta.flag}</span>
                          <p className="font-body text-base leading-relaxed" style={{ color: accent.text }}>
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

      {/* Navigation buttons */}
      <div className="flex items-center justify-between mt-8 px-2">
        {pageIdx > 0 ? (
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
            onClick={() => { setDirection(-1); setPageIdx(p => p - 1); }}
            className="flex items-center gap-2 px-7 py-3.5 rounded-2xl font-display text-base text-white shadow-xl"
            style={{ background: `linear-gradient(135deg,${accent.primary},${accent.primary}CC)`, boxShadow: `0 8px 24px ${accent.primary}40` }}
          ><ChevronLeft size={20}/> Previous</motion.button>
        ) : <div/>}

        {pageIdx < total - 1 && (
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
            onClick={() => { setDirection(1); setPageIdx(p => p + 1); }}
            className="flex items-center gap-2 px-7 py-3.5 rounded-2xl font-display text-base text-white shadow-xl"
            style={{ background: `linear-gradient(135deg,${accent.primary},${accent.primary}CC)`, boxShadow: `0 8px 24px ${accent.primary}40` }}
          >Next <ChevronRight size={20}/></motion.button>
        )}
      </div>
    </motion.div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// StoryForm — formulario de generación
// ════════════════════════════════════════════════════════════════════════════
function StoryForm({ lang, onLangChange, onGenerated }) {
  const [childName,   setChildName]   = useState(() => lsGet(LS_NAME, ""));
  const [theme,       setTheme]       = useState("");
  const [customTheme, setCustomTheme] = useState("");
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState("");
  const [streamText,  setStreamText]  = useState("");
  const [selectedThemeLabel, setSelectedThemeLabel] = useState("");

  useEffect(() => { lsSet(LS_NAME, childName); }, [childName]);

  const THEMES = [
    { label: "🏫 Going to School",  value: "going to school for the first time" },
    { label: "🌈 Making Friends",   value: "making new friends" },
    { label: "🛒 Supermarket",      value: "shopping at the supermarket" },
    { label: "🚌 Taking the Bus",   value: "taking the bus" },
    { label: "🏥 Doctor Visit",     value: "visiting the doctor" },
    { label: "🎉 Birthday Party",   value: "celebrating a birthday" },
  ];

  const activeTheme = customTheme.trim() || theme;
  const canGenerate = childName.trim() && activeTheme;

  const themeColorMap = {
    "going to school":    "from-blue-400 to-cyan-300",
    "making new friends": "from-green-400 to-emerald-300",
    "shopping":           "from-orange-400 to-amber-300",
    "taking the bus":     "from-yellow-400 to-amber-300",
    "doctor":             "from-red-400 to-rose-300",
    "birthday":           "from-pink-400 to-rose-300",
  };
  const loaderColor = Object.entries(themeColorMap).find(([k]) => activeTheme.includes(k))?.[1] || "from-blue-400 to-cyan-300";

  const handleGenerate = async () => {
    if (!canGenerate) return;
    setLoading(true); setError(""); setStreamText("");
    const userId = getGuestId();
    try {
      const response = await fetch(`${API_URL()}/api/generate-story`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ childName, theme: activeTheme, language: lang }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({ error: "Generation failed" }));
        throw new Error(errData.error || "Generation failed");
      }

      // ── Read Groq SSE stream ────────────────────────────────────────────
      const reader  = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let   buffer  = "";
      let   currentEvent = "";

      const parseData = line => {
        if (!line.startsWith("data:")) return null;
        try { return JSON.parse(line.slice(5).trim()); } catch { return null; }
      };

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop();

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
              await saveStory(payload, userId);
              onGenerated(payload, lang);
              return;
            } else if (currentEvent === "error") {
              throw new Error(payload.error || "Kiddsy AI had a hiccup — please try again! 🪄");
            }
          }
        }
      }
      throw new Error("Story generation ended unexpectedly — please try again.");

    } catch (e) {
      console.error("Generation error:", e);
      const friendly = (e.message?.toLowerCase().includes("fetch") || e.message?.toLowerCase().includes("network"))
        ? "Can't reach Kiddsy AI — check your connection and try again 🌐"
        : e.message || "Something magical went wrong — please try again! 🌟";
      setError(friendly);
      setLoading(false);
      setStreamText("");
    }
  };

  if (loading) return (
    <GeneratingLoader
      childName={childName}
      theme={selectedThemeLabel || activeTheme}
      storyColor={loaderColor}
      streamText={streamText}
    />
  );

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl mx-auto">
      <div className="bg-white/90 backdrop-blur-md rounded-4xl shadow-xl border-4 border-white p-8 md:p-10">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            animate={{ rotate: [-8, 8, -8] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="text-5xl mb-3 inline-block"
          >🪄</motion.div>
          <h2 style={{ lineHeight: 1 }}>
            <BubbleTitle color={C.blue} size={34}>Create a Magic Story</BubbleTitle>
          </h2>
          <div
            className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full font-body text-xs font-semibold"
            style={{ background: "#FFF3E0", color: C.orange }}
          >📱 Saved locally on this device</div>
        </div>

        <div className="space-y-5">
          {/* Child name */}
          <div>
            <label className="block font-display text-slate-600 text-sm mb-2">✏️ Child's name</label>
            <input
              type="text" value={childName} onChange={e => setChildName(e.target.value)}
              placeholder="e.g. Sofia, Omar, Lucas…" maxLength={20}
              className="w-full px-5 py-3.5 rounded-2xl border-2 border-slate-200 font-body text-lg focus:outline-none focus:border-blue-400 bg-amber-50 transition-colors placeholder-slate-300"
            />
          </div>

          {/* Preset themes */}
          <div>
            <label className="block font-display text-slate-600 text-sm mb-2">🌟 Story theme</label>
            <div className="grid grid-cols-2 gap-2">
              {THEMES.map(t => (
                <button key={t.value}
                  onClick={() => { setTheme(t.value); setCustomTheme(""); setSelectedThemeLabel(t.label); }}
                  className="px-3 py-2.5 rounded-xl font-body text-sm text-left transition-all"
                  style={{
                    background: theme === t.value && !customTheme ? C.blue : "#F8FAFC",
                    color:      theme === t.value && !customTheme ? "white" : "#4B5563",
                    border:     `2px solid ${theme === t.value && !customTheme ? C.blue : "#E2E8F0"}`,
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

          {/* Language picker */}
          <div>
            <label className="block font-display text-slate-600 text-sm mb-2">🌍 Translation language</label>
            <LanguagePicker value={lang} onChange={onLangChange} fullWidth/>
          </div>

          {/* Error */}
          {error && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 text-red-600 rounded-2xl px-4 py-3 font-body text-sm flex items-start gap-2"
            ><span>⚠️</span><span>{error}</span></motion.div>
          )}

          {/* Generate button */}
          <motion.button
            whileHover={canGenerate ? { scale: 1.02 } : {}}
            whileTap={canGenerate ? { scale: 0.98 } : {}}
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

// ════════════════════════════════════════════════════════════════════════════
// RecentStories — mini-carrusel de cuentos guardados
// ════════════════════════════════════════════════════════════════════════════
function RecentStories({ onRead }) {
  const stories = lsGet(LS_STORIES, []).slice(0, 6);
  if (stories.length === 0) return null;

  return (
    <div className="max-w-3xl mx-auto mt-10 px-1">
      <h3 className="font-display text-xl mb-4 text-center" style={{ color: C.blue }}>
        📚 Recently generated
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {stories.map((story, i) => (
          <StoryCoverCard key={story.id || i} story={story} index={i} onClick={() => onRead(story)}/>
        ))}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// StoryGenerator — página principal exportada
// ════════════════════════════════════════════════════════════════════════════
export default function StoryGenerator({ lang, onLangChange, onGenerated, onBack }) {
  const [activeStory, setActiveStory] = useState(null); // cuento abierto en lector

  // Callback cuando se genera un cuento nuevo
  const handleGenerated = (story, storyLang) => {
    setActiveStory(story);
    if (onGenerated) onGenerated(story, storyLang);
  };

  return (
    <div style={{ position: "relative", minHeight: "100vh", overflow: "hidden" }}>
      {/* Fondo nocturno de cuentos */}
      <StoryBg/>

      {/* Contenido sobre el fondo */}
      <div style={{ position: "relative", zIndex: 1, paddingTop: 24, paddingBottom: 80 }}>

        {/* Título de sección */}
        {!activeStory && (
          <div className="text-center mb-8 pt-6">
            <BubbleTitle color="white" size={48} wobble>Story Time ✨</BubbleTitle>
            <p className="font-body text-white/80 mt-2 text-lg">
              Create a personalised bilingual story in seconds
            </p>
          </div>
        )}

        <div className="px-4">
          {activeStory ? (
            <StoryReader
              story={activeStory}
              lang={lang}
              onBack={() => setActiveStory(null)}
            />
          ) : (
            <>
              <StoryForm
                lang={lang}
                onLangChange={onLangChange}
                onGenerated={handleGenerated}
              />
              <RecentStories onRead={setActiveStory}/>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
