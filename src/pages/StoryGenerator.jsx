/**
 * src/pages/StoryGenerator.jsx — Kiddsy
 * ─────────────────────────────────────────────────────────────────────────
 * • Groq LLAMA  → streaming SSE story + dalle_prompt per page
 * • DALL·E 3    → illustration per page (server handles it)
 * • OpenAI TTS  → selected voice per story
 * • 6 illustration styles · 4 voice options · 16 translation languages
 *
 * Components extracted to their own files:
 *   StoryReader / StoryCoverCard → src/pages/StoryReader.jsx
 *   QuotaBadge / QuotaWall       → src/components/QuotaUI.jsx
 * ─────────────────────────────────────────────────────────────────────────
 */
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence }     from "framer-motion";
import {
  BookOpen, Wand2, Sparkles, Volume2,
  RefreshCw, ArrowLeft, ChevronLeft, ChevronRight,
  Play, Loader,
} from "lucide-react";

import { LanguagePicker }    from "../components/Navbar.jsx";
import { getLang }           from "../utils/langConfig.js";
import { StoryCoverIcon }               from "../components/KiddsyIcons.jsx";
import { StoryBg }                      from "../components/PageBg.jsx";
import { BubbleTitle }                  from "../components/KiddsyFont.jsx";
import KiddsyTitle                      from "../components/KiddsyTitle";
import useQuota                         from "../hooks/useQuota.js";
import { QuotaBadge, QuotaWall }        from "../components/QuotaUI.jsx";
import StoryReader,  { StoryCoverCard } from "../pages/StoryReader.jsx";
import { C } from "../utils/designConfig.js";

// ── LocalStorage helpers ──────────────────────────────────────────────────
const LS_NAME    = "kiddsy_childName";
const LS_STORIES = "kiddsy_guestStories";
function lsGet(key, fallback = null) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
  catch { return fallback; }
}
function lsSet(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

// ── Guest ID ──────────────────────────────────────────────────────────────
const getGuestId = () => {
  let gid = localStorage.getItem("kiddsy_guest_id");
  if (!gid) { gid = crypto.randomUUID(); localStorage.setItem("kiddsy_guest_id", gid); }
  return gid;
};

// ── Supabase stub ─────────────────────────────────────────────────────────
let _supabase = null;
function getSupabase() {
  if (_supabase) return _supabase;
  try {
    const url = import.meta.env.VITE_SUPABASE_URL;
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
    if (!url || !key) return null;
    return null; // placeholder
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

// ── API URL ───────────────────────────────────────────────────────────────
const API_URL = () =>
  window.location.hostname === "localhost"
    ? "http://localhost:10000"
    : "https://kiddsy-vercel.onrender.com";

// ── Story accent colours ──────────────────────────────────────────────────
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

// ── Illustration styles ───────────────────────────────────────────────────
const STYLES = [
  { id:"watercolor", label:"Watercolour", icon:"💧",
    prompt:"watercolor illustration, soft pastel colors, gentle washes, children's book style" },
  { id:"realistic",  label:"Realistic",   icon:"🖼️",
    prompt:"realistic digital art, detailed, lifelike, children's book illustration" },
  { id:"pencil",     label:"Pencil",      icon:"✏️",
    prompt:"pencil sketch style, hand-drawn, textured, children's book" },
  { id:"cartoon",    label:"Cartoon",     icon:"😊",
    prompt:"cartoon style, bright colors, rounded shapes, friendly characters, Pixar-like" },
  { id:"vintage",    label:"Vintage",     icon:"🎨",
    prompt:"vintage storybook illustration, 1950s style, warm colors, classic" },
  { id:"fantasy",    label:"Fantasy",     icon:"🌟",
    prompt:"fantasy art, magical, glowing, fairy tale style, ethereal" },
];

// ── Voice options ─────────────────────────────────────────────────────────
const VOICES = [
  { id:"nova",    label:"Woman",  icon:"👩", desc:"Warm, expressive" },
  { id:"onyx",    label:"Man",    icon:"👨", desc:"Deep, calm"       },
  { id:"fable",   label:"Child",  icon:"🧒", desc:"Playful, friendly"},
  { id:"shimmer", label:"Auto",   icon:"🤖", desc:"Smart selection"  },
];

// ════════════════════════════════════════════════════════════════════════════
// GeneratingLoader
// ════════════════════════════════════════════════════════════════════════════
function GeneratingLoader({ childName, theme, storyColor, streamText, style, isFree = false }) {
  const accent  = getStoryAccent(storyColor);
  const styleObj = STYLES.find(s => s.id === style) || STYLES[0];
  const emojis  = ["✨","📖","🌟","🪄","💫","🌈","⭐","🎨"];
  const particles = Array.from({ length: 12 }, (_, i) => ({
    id: i, x: Math.random()*80+10, y: Math.random()*60+20,
    emoji: emojis[i % emojis.length], delay: Math.random()*1.5,
    duration: Math.random()*1.5+2,
  }));

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
      {particles.map(p => (
        <motion.span key={p.id} className="absolute text-2xl select-none pointer-events-none"
          style={{ left: `${p.x}%`, top: `${p.y}%` }}
          animate={{ y:[0,-30,0], opacity:[0.4,0.9,0.4], scale:[0.9,1.2,0.9] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
        >{p.emoji}</motion.span>
      ))}

      <motion.div
        className={`w-28 h-28 rounded-4xl bg-gradient-to-br ${storyColor || "from-blue-400 to-cyan-300"} flex items-center justify-center shadow-2xl mb-6 border-4 border-white`}
        animate={{ scale:[1,1.06,1], rotate:[-3,3,-3] }}
        transition={{ duration:2, repeat:Infinity, ease:"easeInOut" }}
      >
        <BookOpen size={52} strokeWidth={1.5} className="text-white"/>
      </motion.div>

      <motion.h2
        className="font-display text-3xl font-bold mb-2 text-center px-6"
        style={{ color: accent.text }}
        animate={{ opacity:[0.7,1,0.7] }} transition={{ duration:1.5, repeat:Infinity }}
      >Writing {childName}'s story…</motion.h2>

      <p className="font-body text-base text-center mb-1" style={{ color:`${accent.text}80` }}>
        {theme && `About: ${theme}`}
      </p>

      {/* Style / mode badge */}
      <div className="flex items-center gap-2 px-4 py-1.5 rounded-full mb-5 text-sm font-display"
        style={{ background:`${accent.primary}18`, color:accent.text }}>
        {isFree ? (
          <><span>📝</span> Text story · no illustrations</>
        ) : (
          <><span>{styleObj.icon}</span> {styleObj.label} <span className="text-xs opacity-60">+ DALL·E 3</span></>
        )}
      </div>

      <AnimatePresence>
        {preview && (
          <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
            className="max-w-md mx-4 px-5 py-3 rounded-2xl font-body text-sm text-center leading-relaxed"
            style={{ background:`${accent.primary}14`, border:`1.5px solid ${accent.primary}30`, color:accent.text }}
          >{preview}</motion.div>
        )}
      </AnimatePresence>

      <div className="w-64 h-3 rounded-full overflow-hidden mt-8" style={{ background:`${accent.primary}20` }}>
        <motion.div className="h-full rounded-full"
          style={{ background:`linear-gradient(90deg,${accent.primary},${accent.primary}99)` }}
          animate={{ width:["0%","90%"] }} transition={{ duration:20, ease:"easeOut" }}
        />
      </div>
      <p className="font-body text-xs mt-4 text-center" style={{ color:`${accent.text}60` }}>
        {isFree ? "Groq LLAMA writing your story…" : "Groq LLAMA + DALL·E 3 creating your story… ✨"}
      </p>
    </motion.div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// StoryForm — full form with style + voice picker
// ════════════════════════════════════════════════════════════════════════════
function StoryForm({ lang, onLangChange, onGenerated, onBack, planId = "free", onUpgrade }) {
  const [childName,          setChildName]          = useState(() => lsGet(LS_NAME, ""));
  const [theme,              setTheme]              = useState("");
  const [customTheme,        setCustomTheme]        = useState("");
  const [style,              setStyle]              = useState("watercolor");
  const [voice,              setVoice]              = useState("nova");
  const [loading,            setLoading]            = useState(false);
  const [error,              setError]              = useState("");
  const [streamText,         setStreamText]         = useState("");
  const [selectedThemeLabel, setSelectedThemeLabel] = useState("");
  const [voicePreviewLoading,setVoicePreviewLoading]= useState(false);
  const quota = useQuota(planId);

  useEffect(() => { lsSet(LS_NAME, childName); }, [childName]);

  const THEMES = [
    { label:"🏫 Going to School",  value:"going to school for the first time" },
    { label:"🌈 Making Friends",   value:"making new friends"                  },
    { label:"🛒 Supermarket",      value:"shopping at the supermarket"         },
    { label:"🚌 Taking the Bus",   value:"taking the bus"                      },
    { label:"🏥 Doctor Visit",     value:"visiting the doctor"                 },
    { label:"🎉 Birthday Party",   value:"celebrating a birthday"              },
  ];

  const activeTheme  = customTheme.trim() || theme;
  const canGenerate  = childName.trim() && activeTheme && quota.canGenerate;
  const styleObj     = STYLES.find(s => s.id === style) || STYLES[0];
  const voiceObj     = VOICES.find(v => v.id === voice) || VOICES[0];

  const themeColorMap = {
    "going to school":    "from-blue-400 to-cyan-300",
    "making new friends": "from-green-400 to-emerald-300",
    "shopping":           "from-orange-400 to-amber-300",
    "taking the bus":     "from-yellow-400 to-amber-300",
    "doctor":             "from-red-400 to-rose-300",
    "birthday":           "from-pink-400 to-rose-300",
  };
  const loaderColor = Object.entries(themeColorMap)
    .find(([k]) => activeTheme.toLowerCase().includes(k))?.[1] || "from-blue-400 to-cyan-300";

  // Voice preview — plays a sample sentence
  const handleVoicePreview = async () => {
    setVoicePreviewLoading(true);
    try {
      const res = await fetch(`${API_URL()}/api/tts`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          text: `Hi ${childName || "friend"}! I'm your storyteller. Ready for a magical adventure? ✨`,
          voice,
        }),
      });
      if (!res.ok) throw new Error("preview failed");
      const blob = await res.blob();
      new Audio(URL.createObjectURL(blob)).play();
    } catch (e) {
      console.error("[TTS preview]", e);
    } finally {
      setVoicePreviewLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!canGenerate) return;
    setLoading(true); setError(""); setStreamText("");
    const userId = getGuestId();
    try {
      const response = await fetch(`${API_URL()}/api/generate-story`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          childName,
          theme:             activeTheme,
          language:          lang,
          illustrationStyle: style,
          stylePrompt:       styleObj.prompt,
          voice,
          guestId:           getGuestId(),
          planId,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({ error:"Generation failed" }));
        // 429 = quota exceeded (server-side check)
        if (response.status === 429) {
          const resetStr = errData.resetDate ? ` Resets on ${errData.resetDate}.` : "";
          throw new Error(`QUOTA_EXCEEDED:${errData.limit ?? ""}:${resetStr}`);
        }
        throw new Error(errData.error || "Generation failed");
      }

      const reader  = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let buffer    = "";
      let currentEvent = "";

      const parseData = line => {
        if (!line.startsWith("data:")) return null;
        try { return JSON.parse(line.slice(5).trim()); } catch { return null; }
      };

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream:true });
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
              const storyWithMeta = { ...payload, style, voice };
              quota.recordGenerated();           // ← increment local counter
              await saveStory(storyWithMeta, userId);
              onGenerated(storyWithMeta, lang);
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
      let friendly;
      if (e.message?.startsWith("QUOTA_EXCEEDED:")) {
        const parts = e.message.split(":");
        const lim   = parts[1];
        const reset = parts.slice(2).join(":").trim();
        friendly = `You've used all ${lim ? lim + " stories" : "your stories"} for this month.${reset ? " " + reset : ""} Upgrade your plan for more! ✨`;
      } else if (e.message?.toLowerCase().includes("fetch") || e.message?.toLowerCase().includes("network")) {
        friendly = "Can't reach Kiddsy AI — check your connection and try again 🌐";
      } else {
        friendly = e.message || "Something magical went wrong — please try again! 🌟";
      }
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
      style={style}
      isFree={!quota.hasIllustrations}
    />
  );

  // ── Shared card style ────────────────────────────────────────────────────
  const card = {
    background: "white",
    borderRadius: 24,
    padding: "20px 20px",
    border: "2px solid #F1F5F9",
    boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
  };
  const sectionLabel = {
    fontFamily: "var(--font-display,'Nunito',sans-serif)",
    fontWeight: 700, fontSize: 13, color: "#64748B",
    marginBottom: 10, display: "block",
  };

  return (
    <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
      className="max-w-xl mx-auto space-y-4">

      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="text-center pb-2">
        <motion.div animate={{ rotate:[-8,8,-8] }} transition={{ duration:2, repeat:Infinity, ease:"easeInOut" }}
          className="text-5xl mb-3 inline-block">🪄</motion.div>
        <h2 style={{ lineHeight:1 }}>
          <BubbleTitle color={C.blue} size={34}>Create a Magic Story</BubbleTitle>
        </h2>
        <div className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full font-body text-xs font-semibold"
          style={{ background:"#FFF3E0", color:C.orange }}>
          ✨ Groq LLAMA + DALL·E 3 + OpenAI TTS
        </div>
      </div>

      {/* ── Quota badge ─────────────────────────────────────────────── */}
      <QuotaBadge quota={quota} />

      {/* ── Free plan info banner ───────────────────────────────────── */}
      {quota.planId === "free" && (
        <motion.div initial={{ opacity:0, y:-6 }} animate={{ opacity:1, y:0 }}
          className="flex items-start gap-3 rounded-2xl px-4 py-3"
          style={{ background:"#EFF6FF", border:"2px solid #BFDBFE" }}>
          <span style={{ fontSize:18, flexShrink:0 }}>ℹ️</span>
          <div>
            <div className="font-display text-sm font-bold" style={{ color:C.blue }}>
              Free plan · Text stories only
            </div>
            <div className="font-body text-xs text-slate-500 mt-0.5 leading-relaxed">
              Generated stories include <strong>text + translation</strong> but no DALL·E illustrations or AI voice.
              Upgrade for full magic — illustrated pages + premium narration. ✨
            </div>
          </div>
        </motion.div>
      )}

      {/* ── 1. Child's name ─────────────────────────────────────────── */}
      <div style={card}>
        <span style={sectionLabel}>👤 Child's name</span>
        <input type="text" value={childName} onChange={e => setChildName(e.target.value)}
          placeholder="e.g. Sofia, Omar, Lucas…" maxLength={20}
          className="w-full px-5 py-3.5 rounded-2xl border-2 border-slate-200 font-body text-lg focus:outline-none focus:border-blue-400 bg-amber-50 transition-colors placeholder-slate-300"
        />
      </div>

      {/* ── 2. Story theme ──────────────────────────────────────────── */}
      <div style={card}>
        <span style={sectionLabel}>🌟 Story theme</span>
        <div className="grid grid-cols-3 gap-2 mb-3">
          {THEMES.map(t => (
            <button key={t.value}
              onClick={() => { setTheme(t.value); setCustomTheme(""); setSelectedThemeLabel(t.label); }}
              className="px-3 py-2.5 rounded-xl font-body text-sm text-left transition-all"
              style={{
                background: theme===t.value && !customTheme ? C.blue : "#F8FAFC",
                color:      theme===t.value && !customTheme ? "white" : "#4B5563",
                border:     `2px solid ${theme===t.value && !customTheme ? C.blue : "#E2E8F0"}`,
              }}
            >{t.label}</button>
          ))}
        </div>
        <input type="text" value={customTheme}
          placeholder="✍️ Or write your own… e.g. A trip to the moon"
          className="w-full px-5 py-3 rounded-2xl border-2 border-dashed border-blue-200 focus:border-blue-400 focus:outline-none font-body text-sm bg-blue-50/30 placeholder-slate-300"
          onChange={e => { setCustomTheme(e.target.value); setTheme(""); }}
        />
      </div>

      {/* ── 3. Illustration style (Premium only) ───────────────────────── */}
      {quota.hasIllustrations ? (
      <div style={card}>
        <span style={sectionLabel}>🎨 Illustration style
          <span className="ml-2 font-normal text-xs opacity-60">via DALL·E 3</span>
        </span>
        {/* Row 1: 4 styles */}
        <div className="grid grid-cols-4 gap-2 mb-2">
          {STYLES.slice(0,4).map(s => {
            const active = style === s.id;
            return (
              <motion.button key={s.id} whileTap={{ scale:0.96 }}
                onClick={() => setStyle(s.id)}
                style={{
                  display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
                  gap:3, padding:"10px 6px", borderRadius:14, cursor:"pointer",
                  border:`2.5px solid ${active ? C.blue : "#E2E8F0"}`,
                  background: active ? C.blueSoft : "white",
                  boxShadow: active ? `0 4px 16px ${C.blue}28` : "none",
                  transition:"all 0.15s",
                }}
              >
                <span style={{ fontSize:20 }}>{s.icon}</span>
                <span style={{ fontFamily:"var(--font-display,'Nunito',sans-serif)", fontWeight:700, fontSize:10, color:active?C.blue:"#64748B" }}>
                  {s.label}
                </span>
              </motion.button>
            );
          })}
        </div>
        {/* Row 2: 2 styles centred */}
        <div className="grid grid-cols-4 gap-2 mb-3">
          {STYLES.slice(4).map(s => {
            const active = style === s.id;
            return (
              <motion.button key={s.id} whileTap={{ scale:0.96 }}
                onClick={() => setStyle(s.id)}
                style={{
                  display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
                  gap:3, padding:"10px 6px", borderRadius:14, cursor:"pointer",
                  border:`2.5px solid ${active ? C.blue : "#E2E8F0"}`,
                  background: active ? C.blueSoft : "white",
                  boxShadow: active ? `0 4px 16px ${C.blue}28` : "none",
                  transition:"all 0.15s",
                }}
              >
                <span style={{ fontSize:20 }}>{s.icon}</span>
                <span style={{ fontFamily:"var(--font-display,'Nunito',sans-serif)", fontWeight:700, fontSize:10, color:active?C.blue:"#64748B" }}>
                  {s.label}
                </span>
              </motion.button>
            );
          })}
        </div>
        {/* Style description preview */}
        <div className="px-3 py-2.5 rounded-xl text-xs font-body flex items-start gap-2"
          style={{ background:C.blueSoft, color:C.blue }}>
          <span style={{ fontSize:16, flexShrink:0 }}>{styleObj.icon}</span>
          <div>
            <strong>{styleObj.label}:</strong> {styleObj.prompt}
          </div>
        </div>
      </div>
      ) : (
        <div style={{...card, opacity:0.7}}>
          <span style={sectionLabel}>🎨 Illustration style
            <span className="ml-2 font-normal text-xs opacity-60">Premium feature</span>
          </span>
          <div className="flex items-center gap-3 px-3 py-3 rounded-xl"
            style={{ background:"#F8FAFC", border:"2px dashed #E2E8F0" }}>
            <span style={{ fontSize:28 }}>🔒</span>
            <div>
              <div className="font-display text-sm font-bold text-slate-500">
                Text-only stories on Free plan
              </div>
              <div className="font-body text-xs text-slate-400 mt-0.5">
                Upgrade for DALL·E 3 illustrations per page ✨
              </div>
            </div>
          </div>
        </div>
      )}


      {/* ── 4. Voice (Premium: OpenAI TTS · Free: browser) ──────────────── */}
      {quota.hasVoicePicker ? (
      <div style={card}>
        <span style={sectionLabel}>🔊 Narrator voice
          <span className="ml-2 font-normal text-xs opacity-60">via OpenAI TTS</span>
        </span>
        <div className="grid grid-cols-4 gap-2 mb-3">
          {VOICES.map(v => {
            const active = voice === v.id;
            return (
              <motion.button key={v.id} whileTap={{ scale:0.96 }}
                onClick={() => setVoice(v.id)}
                style={{
                  display:"flex", flexDirection:"column", alignItems:"center",
                  gap:3, padding:"10px 6px", borderRadius:14, cursor:"pointer",
                  border:`2.5px solid ${active ? C.green : "#E2E8F0"}`,
                  background: active ? C.greenSoft : "white",
                  boxShadow: active ? `0 4px 14px ${C.green}28` : "none",
                  transition:"all 0.15s",
                }}
              >
                <span style={{ fontSize:20 }}>{v.icon}</span>
                <span style={{ fontFamily:"var(--font-display,'Nunito',sans-serif)", fontWeight:700, fontSize:11, color:active?C.green:"#64748B" }}>
                  {v.label}
                </span>
                <span style={{ fontSize:9, color:"#94A3B8", textAlign:"center", lineHeight:1.2 }}>
                  {v.desc}
                </span>
              </motion.button>
            );
          })}
        </div>
        {/* Preview button */}
        <motion.button whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}
          onClick={handleVoicePreview}
          disabled={voicePreviewLoading}
          style={{
            display:"flex", alignItems:"center", justifyContent:"center", gap:7,
            width:"100%", padding:"10px 0", borderRadius:12, cursor:"pointer",
            border:`2px solid ${C.green}`, background: voicePreviewLoading ? "#F1F5F9" : C.greenSoft,
            fontFamily:"var(--font-display,'Nunito',sans-serif)", fontWeight:700, fontSize:13,
            color: voicePreviewLoading ? "#94A3B8" : C.green,
          }}
        >
          {voicePreviewLoading
            ? <><Loader size={14} className="animate-spin"/> Generating preview…</>
            : <><Play size={13} fill={C.green}/> Preview voice {voiceObj.icon}</>
          }
        </motion.button>
      </div>

      ) : (
        <div style={{...card, opacity:0.75}}>
          <span style={sectionLabel}>🔊 Narrator voice
            <span className="ml-2 font-normal text-xs opacity-60">Browser TTS · Free plan</span>
          </span>
          <div className="flex items-center gap-3 px-3 py-3 rounded-xl"
            style={{ background:"#F0FFF4", border:"2px solid #BBF7D0" }}>
            <span style={{ fontSize:22 }}>🔊</span>
            <div className="flex-1">
              <div className="font-display text-sm font-bold" style={{ color:C.green }}>
                Browser voice — always free
              </div>
              <div className="font-body text-xs text-slate-400 mt-0.5">
                Upgrade for AI voices (OpenAI TTS) with multiple accents ✨
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── 5. Language ─────────────────────────────────────────────── */}
      <div style={card}>
        <span style={sectionLabel}>🌍 Translation language</span>
        <LanguagePicker value={lang} onChange={onLangChange} fullWidth/>
        <p className="mt-2 text-xs font-body text-slate-400 text-center">
          Story will be generated in English + {getLang(lang).name}
        </p>
      </div>

      {/* ── Quota wall (shown when limit reached) ─────────────────── */}
      {!quota.canGenerate && quota.planId !== "puzzles_only" && (
        <QuotaWall quota={quota} onUpgrade={onUpgrade} />
      )}
      {quota.planId === "puzzles_only" && (
        <QuotaWall
          quota={{ ...quota, limit: 0 }}
          onUpgrade={onUpgrade}
        />
      )}

      {/* ── Error ───────────────────────────────────────────────────── */}
      {error && (
        <motion.div initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }}
          className="bg-red-50 border border-red-200 text-red-600 rounded-2xl px-4 py-3 font-body text-sm flex items-start gap-2">
          <span>⚠️</span><span>{error}</span>
        </motion.div>
      )}

      {/* ── Generate button ─────────────────────────────────────────── */}
      <motion.button
        whileHover={canGenerate ? { scale:1.02 } : {}}
        whileTap={canGenerate ? { scale:0.97 } : {}}
        onClick={handleGenerate}
        disabled={!canGenerate}
        className="w-full py-5 rounded-3xl font-display shadow-2xl flex items-center justify-center gap-3"
        style={{
          background:  canGenerate ? `linear-gradient(135deg,${C.blue},#42A5F5)` : "#E5E7EB",
          color:       canGenerate ? "white" : "#9CA3AF",
          cursor:      canGenerate ? "pointer" : "not-allowed",
          boxShadow:   canGenerate ? "0 10px 32px rgba(21,101,192,0.4)" : "none",
          fontSize: 18, fontWeight: 800,
        }}
      >
        <span className="text-2xl">🪄</span>
        <KiddsyTitle className="text-xl text-white">Generate Story</KiddsyTitle>
        <span style={{ fontSize:12, opacity:0.7, fontWeight:400 }}>
          {styleObj.icon} + {voiceObj.icon}
        </span>
      </motion.button>

      <p className="text-center font-body text-xs text-white/60 pb-4">
        {quota.hasIllustrations
          ? "💡 DALL·E 3 illustrations take a few extra seconds — the magic is worth it!"
          : "💡 Generating text story · upgrade for illustrated pages ✨"}
      </p>
    </motion.div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// RecentStories
// ════════════════════════════════════════════════════════════════════════════
function RecentStories({ onRead }) {
  const stories = lsGet(LS_STORIES, []).slice(0, 6);
  if (stories.length === 0) return null;
  return (
    <div className="max-w-3xl mx-auto mt-10 px-1">
      <h3 className="font-display text-xl mb-4 text-center" style={{ color:"white" }}>
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
// StoryGenerator — main export
// ════════════════════════════════════════════════════════════════════════════
export default function StoryGenerator({ lang = "en", onLangChange, onGenerated, onBack, planId = "free", onUpgrade }) {
  const [activeStory, setActiveStory] = useState(null);

  const handleGenerated = (story, storyLang) => {
    setActiveStory(story);
    if (onGenerated) onGenerated(story, storyLang);
  };

  return (
    <div style={{ position:"relative", minHeight:"100vh", overflow:"hidden" }}>
      <StoryBg/>
      <div style={{ position:"relative", zIndex:1, paddingTop:24, paddingBottom:80 }}>

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
              onBack={onBack}
              planId={planId}
              onUpgrade={onUpgrade}
            />
          </>
        )}
        </div>
      </div>
    </div>
  );
}
