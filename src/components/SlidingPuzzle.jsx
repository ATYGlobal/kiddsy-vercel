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

export default function SlidingPuzzle() {  // ← ASÍ DEBE SER
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
      {/* ... resto del código ... */}
    </div>
  );
}