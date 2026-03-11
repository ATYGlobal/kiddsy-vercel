/**
 * src/pages/StoryReader.jsx — Kiddsy
 * StoryReader  — lector página a página con flip 3D + TTS
 * StoryCoverCard — tarjeta de cuento para LibraryView
 */
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ChevronLeft, ChevronRight, BookOpen } from "lucide-react";
import { getLang } from "../components/Navbar.jsx";
import { StoryCoverIcon } from "../components/KiddsyIcons.jsx";

const C = {
  blue:    "#1565C0", blueSoft: "#E3F2FD",
  yellow:  "#F9A825", green:    "#43A047",
  magenta: "#D81B60", orange:   "#E65100",
};

// ── Story accent colours ──────────────────────────────────────────────────
function getStoryAccent(colorClass = "") {
  if (colorClass.includes("blue"))   return { primary: C.blue,    soft: "#E3F2FD", text: C.blue    };
  if (colorClass.includes("green"))  return { primary: C.green,   soft: "#E8F5E9", text: "#2E7D32" };
  if (colorClass.includes("orange")) return { primary: C.orange,  soft: "#FFF3E0", text: C.orange  };
  if (colorClass.includes("amber"))  return { primary: C.yellow,  soft: "#FFFDE7", text: "#F57F17" };
  if (colorClass.includes("yellow")) return { primary: C.yellow,  soft: "#FFFDE7", text: "#F57F17" };
  if (colorClass.includes("pink"))   return { primary: C.magenta, soft: "#FCE4EC", text: C.magenta };
  return { primary: C.blue, soft: "#E3F2FD", text: C.blue };
}

// ════════════════════════════════════════════════════════════════════════════
// StoryCoverCard
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
// StoryReader
// ════════════════════════════════════════════════════════════════════════════
export default function StoryReader({ story, lang, onBack }) {
  const [pageIdx,   setPageIdx]   = useState(0);
  const [direction, setDirection] = useState(1);

  const page     = story.pages[pageIdx];
  const total    = story.pages.length;
  const accent   = getStoryAccent(story.color);
  const langMeta = getLang(lang);

  useEffect(() => {
    const onKey = e => {
      if (e.key === "ArrowRight" && pageIdx < total - 1) { setDirection(1);  setPageIdx(p => p + 1); }
      if (e.key === "ArrowLeft"  && pageIdx > 0)         { setDirection(-1); setPageIdx(p => p - 1); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pageIdx, total]);

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
              <div className="relative bg-gradient-to-b from-amber-50 to-orange-50 rounded-4xl overflow-hidden min-h-[400px] md:min-h-[460px]">
                <div className="absolute left-0 inset-y-0 w-6 opacity-10"
                  style={{ background: `linear-gradient(90deg, ${accent.primary}60, transparent)` }}/>
                <div className="p-8 md:p-10 flex flex-col h-full min-h-[400px]">
                  <div className="flex justify-between items-start mb-6">
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
                      {page.image_svg && (
                        <div
                          className="w-full aspect-square max-h-48 mb-6 flex items-center justify-center bg-white/50 rounded-3xl p-4 shadow-inner"
                          dangerouslySetInnerHTML={{ __html: page.image_svg }}
                        />
                      )}
                      <p className="text-2xl text-gray-800 leading-relaxed mb-6"
                        style={{ fontFamily: '"Comic Neue", "Nunito", cursive' }}>
                        {page.en}
                      </p>
                      <div className="border-t-2 pt-5" style={{ borderColor: `${accent.primary}25` }}>
                        <div dir={langMeta.dir} className="flex items-start gap-3 p-4 rounded-2xl" style={{ background: accent.soft }}>
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

      {/* Navigation */}
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
