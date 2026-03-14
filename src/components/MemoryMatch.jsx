/**
 * src/components/MemoryMatch.jsx — Kiddsy
 * Memory Match 4×4 con stickers
 */
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw } from "lucide-react";
import { CATEGORY_TILES, GameStickerTile } from "./KiddsyIcons.jsx";
import EmojiSvg from "../utils/EmojiSvg.jsx";
import { C } from "../utils/designConfig.js";

const SPRING = { type: "spring", stiffness: 380, damping: 16 };

function pickRandom(catId, n) {
  const pool = [...CATEGORY_TILES[catId]];
  const out = [];
  while (out.length < n && pool.length) {
    const i = Math.floor(Math.random() * pool.length);
    out.push(pool.splice(i, 1)[0]);
  }
  return out;
}

function buildDeck(catId) {
  const icons = pickRandom(catId, 8);
  const pairs = [...icons, ...icons];
  for (let i = pairs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pairs[i], pairs[j]] = [pairs[j], pairs[i]];
  }
  return pairs.map((tile, id) => ({ id, tile, matched: false }));
}

const MEMORY_CATS = [
  { id: "animals", label: "Animals", color: C.magenta, bg: "#FCE4EC" },
  { id: "fruits",  label: "Food",    color: C.green,   bg: "#E8F5E9" },
  { id: "space",   label: "Space",   color: "#1565C0", bg: "#E3F2FD" },
  { id: "tools",   label: "Tools",   color: "#E65100", bg: "#FFF3E0" },
];

export default function MemoryMatch() {
  const [catIdx, setCatIdx] = useState(0);
  const [deck, setDeck] = useState(() => buildDeck("animals"));
  const [flipped, setFlipped] = useState([]);
  const [moves, setMoves] = useState(0);
  const [locked, setLocked] = useState(false);
  const [won, setWon] = useState(false);
  const [confetti, setConfetti] = useState(false);

  const cat = MEMORY_CATS[catIdx];

  const reset = (idx = catIdx) => {
    setDeck(buildDeck(MEMORY_CATS[idx].id));
    setFlipped([]);
    setMoves(0);
    setLocked(false);
    setWon(false);
  };

  useEffect(() => {
    reset(catIdx);
  }, [catIdx]);

  const handleClick = (card) => {
    if (locked || card.matched || flipped.includes(card.id)) return;
    const nf = [...flipped, card.id];
    setFlipped(nf);
    if (nf.length === 2) {
      setLocked(true);
      setMoves((m) => m + 1);
      const [a, b] = nf.map((id) => deck.find((c) => c.id === id));
      if (a.tile === b.tile || (a.tile.I === b.tile.I && a.tile.c === b.tile.c)) {
        const nd = deck.map((c) => (nf.includes(c.id) ? { ...c, matched: true } : c));
        setDeck(nd);
        setFlipped([]);
        setLocked(false);
        if (nd.every((c) => c.matched)) {
          setWon(true);
          setConfetti(true);
          setTimeout(() => setConfetti(false), 2500);
        }
      } else {
        setTimeout(() => {
          setFlipped([]);
          setLocked(false);
        }, 950);
      }
    }
  };

  const isFlipped = (card) => card.matched || flipped.includes(card.id);
  const matchedCount = deck.filter((c) => c.matched).length / 2;
  const CARD_SZ = 64;

  return (
    <div className="flex flex-col items-center">
      {/* Category pills */}
      <div className="flex flex-wrap gap-2 mb-6 justify-center">
        {MEMORY_CATS.map((c, i) => {
          const active = catIdx === i;
          return (
            <motion.button
              key={c.id}
              onClick={() => setCatIdx(i)}
              whileHover={{ scale: 1.06, y: -2 }}
              whileTap={{ scale: 0.93 }}
              transition={SPRING}
              className="px-5 py-2.5 rounded-full font-display text-sm"
              style={{
                background: active ? c.color : "white",
                color: active ? "white" : "#6B7280",
                border: active ? `2.5px solid ${c.color}` : "2.5px solid #E2E8F0",
                boxShadow: active ? `0 6px 18px ${c.color}50` : "0 2px 8px rgba(0,0,0,0.06)",
              }}
            >
              {c.label}
            </motion.button>
          );
        })}
      </div>

      {/* Stats */}
      <div className="flex gap-3 mb-5 flex-wrap justify-center">
        <div
          className="px-5 py-2 rounded-full font-display bg-white/90 shadow-sm border border-white"
          style={{ color: cat.color }}
        >
          <EmojiSvg code="1f9e0" size={14} /> {moves} pairs tried
        </div>
        <div
          className="px-5 py-2 rounded-full font-display bg-white/90 shadow-sm border border-white"
          style={{ color: C.green }}
        >
          <EmojiSvg code="2705" size={14} /> {matchedCount} / 8 found
        </div>
        {won && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={SPRING}
            className="px-5 py-2 rounded-full font-display text-white shadow-lg"
            style={{ background: C.green }}
          >
            <EmojiSvg code="1f3c6" size={20} style={{ marginRight: 6, verticalAlign: "middle" }} />
            You win!
          </motion.div>
        )}
      </div>

      {/* Card grid */}
      <div
        className="grid gap-2.5 p-3 rounded-3xl shadow-2xl border-4 border-white"
        style={{
          gridTemplateColumns: `repeat(4,${CARD_SZ}px)`,
          background: cat.bg,
          boxShadow: `0 16px 48px ${cat.color}28, 0 4px 16px rgba(0,0,0,0.10)`,
        }}
      >
        {deck.map((card) => (
          <div key={card.id} onClick={() => handleClick(card)} style={{ cursor: "pointer" }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={isFlipped(card) ? "front" : "back"}
                initial={{ rotateY: 90, scale: 0.85 }}
                animate={{ rotateY: 0, scale: 1 }}
                exit={{ rotateY: 90, scale: 0.85 }}
                transition={{ duration: 0.18 }}
              >
                <GameStickerTile
                  tile={card.tile}
                  size={CARD_SZ}
                  isFlipped={isFlipped(card)}
                  isMatched={card.matched}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        ))}
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => reset()}
        className="mt-6 flex items-center gap-2 px-7 py-3 rounded-2xl font-display text-white shadow-xl"
        style={{ background: cat.color, boxShadow: `0 8px 22px ${cat.color}45` }}
      >
        <RotateCcw size={16} /> New game
      </motion.button>
    </div>
  );
}