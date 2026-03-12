/**
 * src/components/SlidingPuzzle.jsx — Kiddsy
 */
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { RotateCcw } from "lucide-react";
import { CATEGORY_TILES, GameStickerTile } from "./KiddsyIcons.jsx";
import EmojiSvg from "../utils/EmojiSvg.jsx";

const C = {
  green: "#43A047",
  red: "#E53935",
};

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

function makePuzzleSet(catId) {
  return [...pickRandom(catId, 8), null];
}

function shufflePuzzle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  const ni = a.indexOf(null);
  [a[ni], a[a.length - 1]] = [a[a.length - 1], a[ni]];
  return a;
}

const PUZZLE_CATS = [
  { id: "animals", label: "Animals", color: C.green, bg: "#E8F5E9" },
  { id: "fruits",  label: "Food",    color: "#E53935", bg: "#FFEBEE" },
  { id: "space",   label: "Space",   color: "#1565C0", bg: "#E3F2FD" },
  { id: "tools",   label: "Tools",   color: "#E65100", bg: "#FFF3E0" },
];

// ✅ UNA SOLA VEZ - al principio
export default function SlidingPuzzle() {
  const [catIdx, setCatIdx] = useState(0);
  const [target, setTarget] = useState(() => makePuzzleSet("animals"));
  const [tiles, setTiles] = useState(() => shufflePuzzle(makePuzzleSet("animals")));
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);
  const [confetti, setConfetti] = useState(false);

  const cat = PUZZLE_CATS[catIdx];

  const newGame = (idx = catIdx) => {
    const t = makePuzzleSet(PUZZLE_CATS[idx].id);
    setTarget(t);
    setTiles(shufflePuzzle(t));
    setMoves(0);
    setWon(false);
  };

  useEffect(() => {
    newGame(catIdx);
  }, [catIdx]);

  const handleClick = (idx) => {
    if (won) return;
    const emptyIdx = tiles.indexOf(null);
    const r = Math.floor(idx / 3),
      c = idx % 3,
      er = Math.floor(emptyIdx / 3),
      ec = emptyIdx % 3;
    const adj =
      (r === er && Math.abs(c - ec) === 1) ||
      (c === ec && Math.abs(r - er) === 1);
    if (!adj) return;
    const next = [...tiles];
    [next[idx], next[emptyIdx]] = [next[emptyIdx], next[idx]];
    setTiles(next);
    setMoves((m) => m + 1);
    if (next.every((t, i) => t === target[i])) {
      setWon(true);
      setConfetti(true);
      setTimeout(() => setConfetti(false), 2200);
    }
  };

  const TILE_SZ = 80;

  return (
    <div className="flex flex-col items-center">
      {/* Category pills */}
      <div className="flex flex-wrap gap-2 mb-6 justify-center">
        {PUZZLE_CATS.map((c, i) => {
          const active = catIdx === i;
          return (
            <motion.button
              key={c.id}
              onClick={() => setCatIdx(i)}
              whileHover={{ scale: 1.06, y: -2 }}
              whileTap={{ scale: 0.93 }}
              transition={SPRING}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full font-display text-sm"
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
          <EmojiSvg code="1f3c3" size={14} /> {moves} moves
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
            Solved!
          </motion.div>
        )}
      </div>

      {/* Puzzle grid */}
      <div
        className="grid gap-2 p-3 rounded-3xl shadow-2xl border-4 border-white"
        style={{
          gridTemplateColumns: `repeat(3,${TILE_SZ}px)`,
          background: cat.bg,
          boxShadow: `0 16px 48px ${cat.color}28, 0 4px 16px rgba(0,0,0,0.10)`,
        }}
      >
        {tiles.map((tile, i) => (
          <div
            key={i}
            onClick={() => handleClick(i)}
            style={{ cursor: tile ? "pointer" : "default" }}
          >
            <GameStickerTile tile={tile} size={TILE_SZ} isBlank={!tile} />
          </div>
        ))}
      </div>

      {/* Goal preview */}
      <div className="mt-5 text-center">
        <p className="font-body text-xs text-slate-400 mb-2">Target order ↓</p>
        <div className="flex gap-1.5 justify-center flex-wrap max-w-[320px]">
          {target.filter(Boolean).map((t, i) => {
            const { I: Icon, c: color } = t;
            return (
              <motion.div
                key={i}
                whileHover={{ scale: 1.14, y: -2 }}
                transition={SPRING}
                className="w-9 h-9 rounded-xl flex items-center justify-center border-2 border-white shadow-sm"
                style={{ background: color + "20" }}
              >
                <Icon size={20} color={color} strokeWidth={2.2} />
              </motion.div>
            );
          })}
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => newGame()}
        className="mt-6 flex items-center gap-2 px-7 py-3 rounded-2xl font-display text-white shadow-xl"
        style={{ background: C.red, boxShadow: `0 8px 22px ${C.red}40` }}
      >
        <RotateCcw size={16} /> New puzzle
      </motion.button>
    </div>
  );
}
// ✅ NO PONGAS OTRO EXPORT DEFAULT AQUÍ