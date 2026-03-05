/**
 * Games.jsx — Kiddsy
 * Two mini-games: Sliding Tile Puzzle + Emoji Memory Match
 * Colorful, animated, designed for young children
 */

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Puzzle, Brain, RotateCcw, Trophy, Star, ChevronRight } from "lucide-react";

// ─── Brand palette ─────────────────────────────────────────────────────────
const C = {
  blue:    "#1565C0",
  blueSoft:"#E3F2FD",
  red:     "#E53935",
  redSoft: "#FFEBEE",
  yellow:  "#FDD835",
  yellowSoft: "#FFFDE7",
  green:   "#43A047",
  greenSoft:"#E8F5E9",
  magenta: "#D81B60",
  magentaSoft:"#FCE4EC",
  cyan:    "#00ACC1",
  cyanSoft:"#E0F7FA",
};

// ─── Confetti burst on win ─────────────────────────────────────────────────
function Confetti({ active }) {
  const pieces = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    color: [C.blue, C.red, C.yellow, C.green, C.magenta, C.cyan][i % 6],
    delay: Math.random() * 0.4,
    size: Math.random() * 10 + 8,
  }));

  if (!active) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-sm top-0"
          style={{ left: `${p.x}%`, width: p.size, height: p.size, background: p.color }}
          initial={{ y: -20, opacity: 1, rotate: 0 }}
          animate={{ y: "105vh", opacity: 0, rotate: 720 }}
          transition={{ duration: 1.5 + Math.random(), delay: p.delay, ease: "easeIn" }}
        />
      ))}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// GAME 1: SLIDING TILE PUZZLE (3×3)
// ════════════════════════════════════════════════════════════════════════════

const PUZZLE_SETS = [
  { name: "Animals", tiles: ["🐶","🐱","🐰","🐻","🦊","🐼","🐸","🐧",""] },
  { name: "Food",    tiles: ["🍎","🍌","🍓","🥕","🍕","🌮","🍦","🎂",""] },
  { name: "Space",   tiles: ["🚀","⭐","🌙","🪐","☀️","🌟","🛸","🌍",""] },
];

function shufflePuzzle(tiles) {
  // Fisher-Yates, then ensure solvable by checking empty is last
  const arr = [...tiles];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  // Put empty at last position to guarantee solvability from display perspective
  const emptyIdx = arr.indexOf("");
  [arr[emptyIdx], arr[arr.length - 1]] = [arr[arr.length - 1], arr[emptyIdx]];
  return arr;
}

function SlidingPuzzle() {
  const [setIdx, setSetIdx] = useState(0);
  const [tiles, setTiles] = useState(() => shufflePuzzle(PUZZLE_SETS[0].tiles));
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);
  const [confetti, setConfetti] = useState(false);

  const target = PUZZLE_SETS[setIdx].tiles;

  const checkWin = (t) => {
    const win = t.every((tile, i) => tile === target[i]);
    if (win) {
      setWon(true);
      setConfetti(true);
      setTimeout(() => setConfetti(false), 2000);
    }
    return win;
  };

  const handleTileClick = (idx) => {
    if (won) return;
    const emptyIdx = tiles.indexOf("");
    const row = Math.floor(idx / 3);
    const col = idx % 3;
    const eRow = Math.floor(emptyIdx / 3);
    const eCol = emptyIdx % 3;

    // Only move if adjacent
    const isAdjacent =
      (row === eRow && Math.abs(col - eCol) === 1) ||
      (col === eCol && Math.abs(row - eRow) === 1);

    if (isAdjacent) {
      const newTiles = [...tiles];
      [newTiles[idx], newTiles[emptyIdx]] = [newTiles[emptyIdx], newTiles[idx]];
      setTiles(newTiles);
      const nextMoves = moves + 1;
      setMoves(nextMoves);
      checkWin(newTiles);
    }
  };

  const reset = (sIdx = setIdx) => {
    setTiles(shufflePuzzle(PUZZLE_SETS[sIdx].tiles));
    setMoves(0);
    setWon(false);
  };

  return (
    <div className="flex flex-col items-center">
      <Confetti active={confetti} />

      {/* Set picker */}
      <div className="flex gap-2 mb-6 bg-white/80 rounded-full p-1.5 shadow-sm">
        {PUZZLE_SETS.map((s, i) => (
          <button
            key={i}
            onClick={() => { setSetIdx(i); reset(i); }}
            className="px-4 py-2 rounded-full font-display text-sm transition-all"
            style={{
              background: setIdx === i ? C.blue : "transparent",
              color: setIdx === i ? "white" : "#6B7280",
            }}
          >
            {s.name}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="flex gap-4 mb-5">
        <div className="px-5 py-2 rounded-full font-display bg-white shadow-sm" style={{ color: C.blue }}>
          🏃 {moves} moves
        </div>
        {won && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="px-5 py-2 rounded-full font-display text-white shadow-lg"
            style={{ background: C.green }}
          >
            🏆 Solved!
          </motion.div>
        )}
      </div>

      {/* Puzzle grid */}
      <div
        className="grid gap-2 p-3 rounded-3xl shadow-xl"
        style={{
          gridTemplateColumns: "repeat(3, 1fr)",
          background: C.blueSoft,
          width: 280,
        }}
      >
        {tiles.map((tile, i) => (
          <motion.button
            key={`${tile}-${i}`}
            layout
            onClick={() => handleTileClick(i)}
            disabled={tile === ""}
            whileHover={tile ? { scale: 1.06 } : {}}
            whileTap={tile ? { scale: 0.94 } : {}}
            className="aspect-square rounded-2xl flex items-center justify-center text-3xl transition-all"
            style={{
              background: tile === "" ? "transparent" : "white",
              boxShadow: tile ? "0 4px 12px rgba(0,0,0,0.1)" : "none",
              border: tile === "" ? `2px dashed ${C.blue}40` : "2px solid white",
            }}
          >
            {tile}
          </motion.button>
        ))}
      </div>

      {/* Goal preview */}
      <div className="mt-5 text-center">
        <p className="font-body text-xs text-slate-400 mb-2">Goal order ↓</p>
        <div className="flex gap-1.5 justify-center">
          {target.filter(Boolean).map((t, i) => (
            <span key={i} className="text-xl">{t}</span>
          ))}
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        onClick={() => reset()}
        className="mt-5 flex items-center gap-2 px-6 py-3 rounded-full font-display text-white shadow-md"
        style={{ background: C.red }}
      >
        <RotateCcw size={16} /> Shuffle again
      </motion.button>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// GAME 2: EMOJI MEMORY MATCH
// ════════════════════════════════════════════════════════════════════════════

const MEMORY_EMOJIS_POOL = [
  ["🐶","🐱","🐰","🐻","🦊","🐼","🐸","🐧"],
  ["🍎","🍌","🍓","🥕","🍕","🌮","🍦","🎂"],
  ["🚀","⭐","🌙","🪐","☀️","🌟","🛸","🌍"],
];

function buildMemoryDeck(emojiSet) {
  const pairs = [...emojiSet, ...emojiSet];
  for (let i = pairs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pairs[i], pairs[j]] = [pairs[j], pairs[i]];
  }
  return pairs.map((emoji, id) => ({ id, emoji, matched: false }));
}

function MemoryCard({ card, isFlipped, onClick }) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.93 }}
      className="aspect-square rounded-2xl flex items-center justify-center text-3xl cursor-pointer select-none border-2 transition-all"
      style={{
        background: isFlipped ? "white" : C.blue,
        borderColor: card.matched ? C.green : isFlipped ? C.blueSoft : C.blue,
        boxShadow: card.matched
          ? `0 0 0 3px ${C.green}`
          : isFlipped
          ? "0 4px 12px rgba(0,0,0,0.1)"
          : "0 4px 12px rgba(21,101,192,0.2)",
      }}
    >
      <AnimatePresence mode="wait">
        {isFlipped ? (
          <motion.span
            key="front"
            initial={{ rotateY: 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            {card.emoji}
          </motion.span>
        ) : (
          <motion.span key="back" className="text-white/60 text-xl">
            ✦
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

function MemoryMatch() {
  const [setIdx, setSetIdx] = useState(0);
  const [deck, setDeck] = useState(() => buildMemoryDeck(MEMORY_EMOJIS_POOL[0]));
  const [flipped, setFlipped] = useState([]);
  const [moves, setMoves] = useState(0);
  const [locked, setLocked] = useState(false);
  const [won, setWon] = useState(false);
  const [confetti, setConfetti] = useState(false);

  const reset = (sIdx = setIdx) => {
    setDeck(buildMemoryDeck(MEMORY_EMOJIS_POOL[sIdx]));
    setFlipped([]);
    setMoves(0);
    setLocked(false);
    setWon(false);
  };

  const handleClick = (card) => {
    if (locked || card.matched || flipped.includes(card.id)) return;

    const newFlipped = [...flipped, card.id];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setLocked(true);
      setMoves((m) => m + 1);

      const [a, b] = newFlipped.map((id) => deck.find((c) => c.id === id));
      if (a.emoji === b.emoji) {
        // Match!
        const newDeck = deck.map((c) =>
          newFlipped.includes(c.id) ? { ...c, matched: true } : c
        );
        setDeck(newDeck);
        setFlipped([]);
        setLocked(false);
        if (newDeck.every((c) => c.matched)) {
          setWon(true);
          setConfetti(true);
          setTimeout(() => setConfetti(false), 2500);
        }
      } else {
        // No match — flip back
        setTimeout(() => {
          setFlipped([]);
          setLocked(false);
        }, 900);
      }
    }
  };

  const isFlipped = (card) => card.matched || flipped.includes(card.id);
  const matched = deck.filter((c) => c.matched).length / 2;

  return (
    <div className="flex flex-col items-center">
      <Confetti active={confetti} />

      {/* Set picker */}
      <div className="flex gap-2 mb-6 bg-white/80 rounded-full p-1.5 shadow-sm">
        {["Animals", "Food", "Space"].map((name, i) => (
          <button
            key={i}
            onClick={() => { setSetIdx(i); reset(i); }}
            className="px-4 py-2 rounded-full font-display text-sm transition-all"
            style={{
              background: setIdx === i ? C.magenta : "transparent",
              color: setIdx === i ? "white" : "#6B7280",
            }}
          >
            {name}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="flex gap-4 mb-5 flex-wrap justify-center">
        <div className="px-5 py-2 rounded-full font-display bg-white shadow-sm" style={{ color: C.magenta }}>
          🧠 {moves} pairs tried
        </div>
        <div className="px-5 py-2 rounded-full font-display bg-white shadow-sm" style={{ color: C.green }}>
          ✅ {matched} / 8 found
        </div>
        {won && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="px-5 py-2 rounded-full font-display text-white shadow-lg"
            style={{ background: C.green }}
          >
            🏆 You win!
          </motion.div>
        )}
      </div>

      {/* Card grid */}
      <div
        className="grid gap-2 p-3 rounded-3xl shadow-xl"
        style={{
          gridTemplateColumns: "repeat(4, 1fr)",
          background: C.magentaSoft,
          width: 288,
        }}
      >
        {deck.map((card) => (
          <MemoryCard
            key={card.id}
            card={card}
            isFlipped={isFlipped(card)}
            onClick={() => handleClick(card)}
          />
        ))}
      </div>

      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        onClick={() => reset()}
        className="mt-6 flex items-center gap-2 px-6 py-3 rounded-full font-display text-white shadow-md"
        style={{ background: C.magenta }}
      >
        <RotateCcw size={16} /> New game
      </motion.button>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// MAIN GAMES COMPONENT
// ════════════════════════════════════════════════════════════════════════════

const GAME_TABS = [
  {
    id: "puzzle",
    label: "Tile Puzzle",
    icon: Puzzle,
    emoji: "🧩",
    color: C.blue,
    bg: C.blueSoft,
    desc: "Slide the tiles to arrange them in order!",
  },
  {
    id: "memory",
    label: "Memory Match",
    icon: Brain,
    emoji: "🧠",
    color: C.magenta,
    bg: C.magentaSoft,
    desc: "Find all the matching emoji pairs!",
  },
];

export default function Games() {
  const [activeGame, setActiveGame] = useState("puzzle");
  const active = GAME_TABS.find((g) => g.id === activeGame);

  return (
    <div
      className="min-h-screen"
      style={{ background: "linear-gradient(150deg, #E3F2FD 0%, #FCE4EC 50%, #E8F5E9 100%)" }}
    >
      {/* Header */}
      <div className="text-center py-12 px-4">
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="text-6xl mb-4 inline-block"
        >
          🎮
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-4xl md:text-5xl mb-3"
          style={{ color: C.blue }}
        >
          Play & Learn
        </motion.h1>
        <p className="font-body text-slate-500 text-lg max-w-md mx-auto">
          Fun games that make learning English feel like playtime! 🌟
        </p>
      </div>

      {/* Game selector cards */}
      <div className="flex justify-center gap-4 px-4 mb-10 flex-wrap">
        {GAME_TABS.map((g) => {
          const Icon = g.icon;
          const isActive = activeGame === g.id;
          return (
            <motion.button
              key={g.id}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setActiveGame(g.id)}
              className="flex items-center gap-3 px-6 py-4 rounded-3xl font-display text-lg border-4 transition-all shadow-md"
              style={{
                background: isActive ? g.color : "white",
                borderColor: isActive ? g.color : "white",
                color: isActive ? "white" : "#4B5563",
                boxShadow: isActive ? `0 8px 30px ${g.color}40` : "0 4px 12px rgba(0,0,0,0.06)",
              }}
            >
              <span className="text-2xl">{g.emoji}</span>
              {g.label}
            </motion.button>
          );
        })}
      </div>

      {/* Game area */}
      <div className="max-w-xl mx-auto px-4 pb-20">
        {/* Active game description */}
        <motion.div
          key={activeGame}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mb-8"
        >
          <p className="font-body text-slate-500 text-base">{active.desc}</p>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeGame}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25 }}
          >
            {activeGame === "puzzle" && <SlidingPuzzle />}
            {activeGame === "memory" && <MemoryMatch />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
