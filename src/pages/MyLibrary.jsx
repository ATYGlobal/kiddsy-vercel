/**
 * src/pages/MyLibrary.jsx
 * Authenticated user's personal story library
 * — Shows saved stories, lets them re-read or play puzzle with story images
 */
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen, Puzzle, Trash2, Plus, RefreshCw,
  Trophy, RotateCcw, Star, ChevronLeft
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { fetchMyStories, deleteStory, saveStory } from "../lib/supabase.js";

// ─── Brand palette ─────────────────────────────────────────────────────────
const C = {
  blue:   "#1565C0",
  blueSoft:"#E3F2FD",
  red:    "#E53935",
  redSoft:"#FFEBEE",
  yellow: "#F9A825",
  green:  "#43A047",
  greenSoft:"#E8F5E9",
  magenta:"#D81B60",
  magentaSoft:"#FCE4EC",
};

// ─── Confetti ──────────────────────────────────────────────────────────────
function Confetti({ active }) {
  const pieces = Array.from({ length: 24 }, (_, i) => ({
    id: i, x: Math.random() * 100,
    color: [C.blue,C.red,C.yellow,C.green,C.magenta,"#00ACC1"][i%6],
    delay: Math.random()*0.5, size: Math.random()*10+7,
  }));
  if (!active) return null;
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map((p) => (
        <motion.div key={p.id} className="absolute rounded-sm top-0"
          style={{ left:`${p.x}%`, width:p.size, height:p.size, background:p.color }}
          initial={{ y:-20, opacity:1, rotate:0 }}
          animate={{ y:"110vh", opacity:0, rotate:720 }}
          transition={{ duration:1.6+Math.random(), delay:p.delay, ease:"easeIn" }}
        />
      ))}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// STORY IMAGE PUZZLE — uses the story's cover image/emoji mosaic
// ════════════════════════════════════════════════════════════════════════════
function StoryPuzzle({ story, onClose }) {
  const GRID = 3;
  const TOTAL = GRID * GRID;

  // Build tile data — numbered 0..7, "" for empty at index 8 (solved state)
  const SOLVED = [...Array(TOTAL-1).keys(), null]; // [0,1,2,3,4,5,6,7,null]

  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length-1; i>0; i--) {
      const j = Math.floor(Math.random()*(i+1));
      [a[i],a[j]] = [a[j],a[i]];
    }
    // Ensure empty last for solvability
    const ni = a.indexOf(null);
    [a[ni], a[a.length-1]] = [a[a.length-1], a[ni]];
    return a;
  }

  const [tiles, setTiles] = useState(() => shuffle(SOLVED));
  const [moves, setMoves] = useState(0);
  const [won, setWon]     = useState(false);
  const [confetti, setConfetti] = useState(false);

  // The "image" for each tile — use story emoji mosaic if no real image
  const hasRealImage = !!story.image_url;

  // Grid of emoji from the story pages
  const emojiGrid = Array.from({ length: TOTAL-1 }, (_, i) =>
    story.pages[i % story.pages.length]?.emoji ?? story.emoji
  );

  const checkWin = (t) => {
    const win = t.every((tile, i) => tile === SOLVED[i]);
    if (win) { setWon(true); setConfetti(true); setTimeout(()=>setConfetti(false),2500); }
    return win;
  };

  const handleClick = (idx) => {
    if (won) return;
    const emptyIdx = tiles.indexOf(null);
    const r = Math.floor(idx/GRID), c = idx%GRID;
    const er = Math.floor(emptyIdx/GRID), ec = emptyIdx%GRID;
    const adj = (r===er && Math.abs(c-ec)===1)||(c===ec && Math.abs(r-er)===1);
    if (!adj) return;
    const next = [...tiles];
    [next[idx],next[emptyIdx]] = [next[emptyIdx],next[idx]];
    setTiles(next);
    setMoves(m=>m+1);
    checkWin(next);
  };

  const reset = () => { setTiles(shuffle(SOLVED)); setMoves(0); setWon(false); };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background:"rgba(21,101,192,0.85)", backdropFilter:"blur(8px)" }}
      initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
    >
      <Confetti active={confetti} />

      <motion.div
        initial={{ scale:0.85, opacity:0 }}
        animate={{ scale:1, opacity:1 }}
        exit={{ scale:0.85, opacity:0 }}
        className="bg-white rounded-5xl shadow-2xl p-8 max-w-sm w-full border-4 border-white"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <button onClick={onClose} className="flex items-center gap-1 font-display text-sm" style={{color:C.blue}}>
            <ChevronLeft size={16}/> Back
          </button>
          <div className="text-center">
            <div className="text-2xl">{story.emoji}</div>
            <div className="font-display text-sm" style={{color:C.blue}}>{story.title}</div>
          </div>
          <div className="font-display text-sm text-slate-400">{moves} moves</div>
        </div>

        {/* Win banner */}
        <AnimatePresence>
          {won && (
            <motion.div
              initial={{scale:0.8,opacity:0}} animate={{scale:1,opacity:1}}
              className="text-center mb-4 py-3 rounded-2xl font-display text-white"
              style={{background:`linear-gradient(135deg,${C.green},#2E7D32)`}}
            >
              🏆 Puzzle solved in {moves} moves!
            </motion.div>
          )}
        </AnimatePresence>

        {/* Puzzle grid */}
        <div className="mb-5">
          {hasRealImage ? (
            // Real image puzzle — clip each tile from the image
            <div
              className="grid gap-1.5 rounded-3xl overflow-hidden"
              style={{ gridTemplateColumns:`repeat(${GRID},1fr)`, background:C.blueSoft }}
            >
              {tiles.map((tile, idx) => (
                <motion.button
                  key={idx}
                  onClick={()=>handleClick(idx)}
                  whileTap={tile!==null?{scale:0.93}:{}}
                  className="aspect-square rounded-xl overflow-hidden border-2 transition-all"
                  style={{
                    borderColor: tile===null?"transparent":C.blue,
                    background: tile===null?"transparent":"white",
                  }}
                >
                  {tile !== null && (
                    <div className="w-full h-full relative overflow-hidden">
                      <img
                        src={story.image_url}
                        alt=""
                        className="absolute"
                        style={{
                          width:`${GRID*100}%`,
                          height:`${GRID*100}%`,
                          left:`-${(tile%GRID)*100}%`,
                          top:`-${Math.floor(tile/GRID)*100}%`,
                          objectFit:"cover",
                        }}
                      />
                    </div>
                  )}
                </motion.button>
              ))}
            </div>
          ) : (
            // Emoji mosaic puzzle
            <div
              className="grid gap-2 p-2 rounded-3xl"
              style={{ gridTemplateColumns:`repeat(${GRID},1fr)`, background:C.blueSoft }}
            >
              {tiles.map((tile, idx) => (
                <motion.button
                  key={idx}
                  onClick={()=>handleClick(idx)}
                  whileHover={tile!==null?{scale:1.08}:{}}
                  whileTap={tile!==null?{scale:0.93}:{}}
                  className="aspect-square rounded-2xl flex items-center justify-center text-3xl border-2 transition-all"
                  style={{
                    background: tile===null?"transparent":"white",
                    borderColor: tile===null?`${C.blue}30`:C.blue,
                    boxShadow: tile!==null?"0 3px 10px rgba(0,0,0,0.1)":"none",
                  }}
                >
                  {tile !== null && emojiGrid[tile]}
                </motion.button>
              ))}
            </div>
          )}
        </div>

        {/* Goal preview */}
        <div className="text-center mb-4">
          <p className="font-body text-xs text-slate-400 mb-1.5">Arrange in this order:</p>
          <div className="flex gap-1 justify-center flex-wrap">
            {emojiGrid.slice(0,TOTAL-1).map((e,i)=>(
              <span key={i} className="text-sm">{e}</span>
            ))}
          </div>
        </div>

        <button
          onClick={reset}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-display text-white"
          style={{background:C.red}}
        >
          <RotateCcw size={16}/> Shuffle again
        </button>
      </motion.div>
    </motion.div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// STORY CARD
// ────────────────────────────────────────────────────────────────────────────
function StoryCard({ story, onRead, onPuzzle, onDelete, index }) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    await onDelete(story.id);
  };

  return (
    <motion.div
      initial={{ opacity:0, y:24 }}
      animate={{ opacity:1, y:0 }}
      transition={{ delay:index*0.06, type:"spring", stiffness:200 }}
      className="relative group rounded-4xl overflow-hidden border-4 border-white shadow-lg"
    >
      {/* Story cover gradient */}
      <div className={`bg-gradient-to-br ${story.color || "from-blue-400 to-cyan-300"} p-5 min-h-[160px] flex flex-col`}>
        {/* Spine effect */}
        <div className="absolute left-0 inset-y-0 w-3 bg-black/10" />

        <div className="text-5xl mb-2 drop-shadow">{story.emoji}</div>
        <h3 className="font-display text-white text-lg leading-tight flex-1 drop-shadow-sm">
          {story.title}
        </h3>
        <div className="flex items-center gap-1.5 text-white/70 font-body text-xs mt-2">
          <BookOpen size={11} />
          {story.pages?.length ?? 0} pages
        </div>
      </div>

      {/* Action buttons — appear on hover */}
      <div
        className="absolute inset-0 rounded-4xl flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ background:"rgba(21,101,192,0.92)" }}
      >
        <motion.button
          whileHover={{scale:1.06}} whileTap={{scale:0.94}}
          onClick={()=>onRead(story)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl font-display text-sm bg-white shadow-md"
          style={{color:C.blue}}
        >
          <BookOpen size={15}/> Read Story
        </motion.button>
        <motion.button
          whileHover={{scale:1.06}} whileTap={{scale:0.94}}
          onClick={()=>onPuzzle(story)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl font-display text-sm text-white shadow-md"
          style={{background:C.green}}
        >
          <Puzzle size={15}/> Play Puzzle
        </motion.button>
        <motion.button
          whileHover={{scale:1.06}} whileTap={{scale:0.94}}
          onClick={handleDelete}
          disabled={deleting}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl font-display text-xs text-white/70 hover:text-white transition-colors"
        >
          <Trash2 size={13}/> {deleting?"Deleting…":"Remove"}
        </motion.button>
      </div>
    </motion.div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// MAIN MY LIBRARY COMPONENT
// ────────────────────────────────────────────────────────────────────────────
export default function MyLibrary({ onCreateStory, onReadStory }) {
  const { user, firstName } = useAuth();
  const [stories, setStories]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState("");
  const [puzzleStory, setPuzzleStory] = useState(null);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await fetchMyStories(user.id);
      setStories(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (storyDbId) => {
    await deleteStory(storyDbId);
    setStories((prev) => prev.filter((s) => s.id !== storyDbId));
  };

  return (
    <>
      <AnimatePresence>
        {puzzleStory && (
          <StoryPuzzle key="puzzle" story={puzzleStory} onClose={() => setPuzzleStory(null)} />
        )}
      </AnimatePresence>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div initial={{opacity:0,y:-16}} animate={{opacity:1,y:0}} className="mb-8">
          <h1 className="font-display text-4xl md:text-5xl" style={{color:C.blue}}>
            {firstName}'s Library 📚
          </h1>
          <p className="font-body text-slate-500 mt-1">
            Your personalized story collection. Click a story to read or play!
          </p>
        </motion.div>

        {/* New story CTA */}
        <motion.button
          whileHover={{scale:1.02}} whileTap={{scale:0.97}}
          onClick={onCreateStory}
          initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.1}}
          className="w-full mb-8 py-5 rounded-4xl font-display text-xl text-white flex items-center justify-center gap-3 border-4 border-white shadow-xl"
          style={{background:`linear-gradient(135deg,${C.yellow},#FF8F00)`}}
        >
          <Plus size={24}/> Create a New Story ✨
        </motion.button>

        {/* Loading state */}
        {loading && (
          <div className="flex justify-center py-16">
            <motion.div
              animate={{rotate:360}}
              transition={{duration:1,repeat:Infinity,ease:"linear"}}
              className="text-5xl"
            >
              ✨
            </motion.div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="text-center py-10 text-red-500 font-body">
            <p>⚠️ {error}</p>
            <button onClick={load} className="mt-3 flex items-center gap-2 mx-auto font-display text-sm" style={{color:C.blue}}>
              <RefreshCw size={14}/> Try again
            </button>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && stories.length === 0 && (
          <motion.div
            initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}}
            className="text-center py-16 bg-white/80 rounded-4xl border-4 border-white shadow-md"
          >
            <div className="text-7xl mb-4">📖</div>
            <h2 className="font-display text-3xl mb-2" style={{color:C.blue}}>
              No stories yet!
            </h2>
            <p className="font-body text-slate-500 mb-6 max-w-xs mx-auto">
              Generate your first personalized bilingual story and it will appear here.
            </p>
            <motion.button
              whileHover={{scale:1.04}} whileTap={{scale:0.96}}
              onClick={onCreateStory}
              className="px-8 py-4 rounded-2xl font-display text-lg text-white shadow-lg"
              style={{background:`linear-gradient(135deg,${C.blue},#42A5F5)`}}
            >
              Create First Story 🪄
            </motion.button>
          </motion.div>
        )}

        {/* Story grid */}
        {!loading && stories.length > 0 && (
          <>
            <div className="flex items-center justify-between mb-4">
              <p className="font-display text-slate-500">
                {stories.length} {stories.length === 1 ? "story" : "stories"} saved
              </p>
              <button onClick={load} className="flex items-center gap-1.5 font-body text-sm text-slate-400 hover:text-slate-600 transition-colors">
                <RefreshCw size={13}/> Refresh
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {stories.map((story, i) => (
                <StoryCard
                  key={story.id}
                  story={story}
                  index={i}
                  onRead={onReadStory}
                  onPuzzle={setPuzzleStory}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </>
        )}

        {/* Puzzle tip */}
        {!loading && stories.length > 0 && (
          <motion.div
            initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.4}}
            className="mt-8 rounded-3xl p-4 flex items-center gap-3 border-2 border-white shadow-sm"
            style={{background:C.greenSoft}}
          >
            <Puzzle size={20} style={{color:C.green}}/>
            <p className="font-body text-sm" style={{color:C.green}}>
              <strong>Tip:</strong> Hover over any story and tap <strong>Play Puzzle</strong> to build a sliding puzzle with the story's images!
            </p>
          </motion.div>
        )}
      </div>
    </>
  );
}
