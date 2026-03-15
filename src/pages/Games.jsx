/**
 * src/pages/Games.jsx — Kiddsy
 * ─────────────────────────────────────────────────────────────────────────
 * Shell principal: selector de juego + fondo temático.
 * Los juegos están en sus propios ficheros:
 *   SlidingPuzzle.jsx  — Tile Puzzle 3×3
 *   MemoryMatch.jsx    — Memory Match 4×4
 * ─────────────────────────────────────────────────────────────────────────
 */
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Puzzle, Brain, RotateCcw, Wrench } from "lucide-react";
import { CATEGORY_TILES, GameStickerTile, StickerBadge } from "../components/KiddsyIcons.jsx";
import { GamesBg } from "../components/PageBg.jsx";
import CartoonTitle from "../components/CartoonTitle.jsx";
import SlidingPuzzle from "../components/SlidingPuzzle.jsx";  
import MemoryMatch from "../components/MemoryMatch.jsx";     
import EmojiSvg from "../utils/EmojiSvg.jsx";
import { BubbleTitle } from "../components/KiddsyFont.jsx";
import { C } from "../utils/designConfig.js";
import { t } from "../utils/uiStrings.js";

const SPRING = { type:"spring", stiffness:380, damping:16 };

const GAME_TABS = [
  { id:"puzzle", label:t("games.tab.puzzle", "en"),  Icon:Puzzle, color:C.blue,    bg:C.blueSoft   },
  { id:"memory", label:t("games.tab.memory", "en"),  Icon:Brain,  color:C.magenta, bg:C.magentaSoft },
];

export default function Games({ lang = "en" }) {
  // 1. Estado para controlar qué juego se ve
  const [activeGame, setActiveGame] = useState("puzzle");

  // 2. Configuración de animación
  const a5 = {
    type: "spring",
    stiffness: 380,
    damping: 16
  };

  // 3. Lista de juegos (ahora dentro para que 'lang' funcione)
  const sy = [
    { 
      id: "puzzle", 
      label: Ae("games.tab.puzzle", lang), 
      Icon: Zt, 
      color: k.blue, 
      bg: k.blueSoft 
    },
    { 
      id: "memory", 
      label: Ae("games.tab.memory", lang), 
      Icon: cS, 
      color: k.magenta, 
      bg: k.magentaSoft 
    }
  ];

  return (
    <div className="relative min-h-screen overflow-hidden">
      <GamesBg/>

      <div className="relative z-10">

        {/* Header */}
        <div className="text-center py-12 px-4">
          <motion.div
            initial={{ scale:0.7, opacity:0 }} animate={{ scale:1, opacity:1 }}
            transition={{ type:"spring", stiffness:220 }}
            className="inline-block mb-4"
          >
            <StickerBadge icon={active.Icon} color={active.color} size={68} noHover/>
          </motion.div>

          <motion.h1
            initial={{ opacity:0, y:-14 }} animate={{ opacity:1, y:0 }}
            className="mb-3" style={{ lineHeight:1.2 }}
          >
            <BubbleTitle color="#1E88E5" size={54}>{t("games.title", lang)}</BubbleTitle>
          </motion.h1>

          <div className="bg-white/40 backdrop-blur-md rounded-3xl p-4 max-w-md mx-auto shadow-sm border border-white/50">
            <p className="font-display text-slate-700 text-lg font-medium">
              {t("games.subtitle", lang)} <EmojiSvg code="1f31f" size={16}/>
            </p>
            <p className="font-display text-slate-500 text-sm mt-1 font-semibold uppercase tracking-wider">
              {t("games.meta", lang)}
            </p>
          </div>
        </div>

        {/* Game selector */}
        <div className="flex justify-center gap-5 px-4 mb-10 flex-wrap">
          {GAME_TABS.map(g=>{
            const Icon=g.Icon; const isActive=activeGame===g.id;
            return (
              <motion.button key={g.id}
                whileHover={{ scale:1.05, y:-4 }} whileTap={{ scale:0.95 }} transition={SPRING}
                onClick={()=>setActiveGame(g.id)}
                className="flex items-center gap-3 px-7 py-4 rounded-3xl font-display text-lg border-4 shadow-lg"
                style={{
                  background:  isActive ? g.color : "white",
                  borderColor: isActive ? g.color : "white",
                  color:       isActive ? "white" : "#4B5563",
                  boxShadow:   isActive ? `0 10px 34px ${g.color}45` : "0 4px 14px rgba(0,0,0,0.07)",
                }}
              >
                <div style={{
                  width:36, height:36, borderRadius:"50%",
                  background: isActive?"rgba(255,255,255,0.22)":g.color+"18",
                  border:"2.5px solid white",
                  boxShadow:`0 3px 12px ${g.color}40`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                }}>
                  <Icon size={18} color={isActive?"white":g.color} strokeWidth={2.2}/>
                </div>
                {g.label}
              </motion.button>
            );
          })}
        </div>

        {/* Game area */}
        <div className="max-w-xl mx-auto px-4 pb-24">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeGame}
              initial={{ opacity:0, scale:0.95, y:12 }}
              animate={{ opacity:1, scale:1,    y:0  }}
              exit={{    opacity:0, scale:0.95, y:-12 }}
              transition={{ duration:0.26 }}
            >
              {activeGame==="puzzle" && <SlidingPuzzle lang={lang}/>}
              {activeGame==="memory" && <MemoryMatch lang={lang}/>}
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
