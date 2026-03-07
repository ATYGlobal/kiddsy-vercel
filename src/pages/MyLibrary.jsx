/**
 * src/pages/MyLibrary.jsx — Kiddsy
 * ─────────────────────────────────────────────────────────────────────────
 * Personal story library with sticker-style vector covers.
 * Story emoji → Lucide icon rendered on a matching gradient cover.
 * Search, lazy-load (12 per page), sliding puzzle mini-game.
 */
import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen, Puzzle, Trash2, Plus, RefreshCw,
  RotateCcw, Search, X, ChevronLeft, ChevronDown,
} from "lucide-react";
import { useAuth }                from "../context/AuthContext.jsx";
import { fetchMyStories, deleteStory } from "../lib/supabase.js";
import { StoryCoverIcon, getStoryIcon, StickerBadge } from "../components/KiddsyIcons.jsx";

const C = {
  blue:"#1565C0", blueSoft:"#E3F2FD",
  red:"#E53935",
  yellow:"#F9A825",
  green:"#43A047",  greenSoft:"#E8F5E9",
  magenta:"#D81B60",magentaSoft:"#FCE4EC",
};
const SPRING = { type:"spring", stiffness:380, damping:16 };
const PAGE_SIZE = 12;

// ─── Confetti ──────────────────────────────────────────────────────────────
function Confetti({ active }) {
  const ps = Array.from({ length:26 }, (_,i) => ({
    id:i, x:Math.random()*100, delay:Math.random()*.5, size:Math.random()*10+7,
    color:["#F9A825","#E53935","#43A047","#1565C0","#D81B60","#00ACC1"][i%6],
  }));
  if (!active) return null;
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {ps.map(p=>(
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

// ══════════════════════════════════════════════════════════════════════════
// STORY PUZZLE MINI-GAME
// ══════════════════════════════════════════════════════════════════════════
function StoryPuzzle({ story, onClose }) {
  const G=3, TOT=G*G;
  const GOAL=[...Array(TOT-1).keys(),null];

  const shuffle = arr => {
    const a=[...arr];
    for (let i=a.length-1;i>0;i--) {
      const j=Math.floor(Math.random()*(i+1));
      [a[i],a[j]]=[a[j],a[i]];
    }
    const ni=a.indexOf(null);
    [a[ni],a[a.length-1]]=[a[a.length-1],a[ni]];
    return a;
  };

  const [tiles,    setTiles]    = useState(()=>shuffle(GOAL));
  const [moves,    setMoves]    = useState(0);
  const [won,      setWon]      = useState(false);
  const [confetti, setConfetti] = useState(false);
  const [hoveredTile, setHoveredTile] = useState(null);

  const { Icon, color } = getStoryIcon(story.emoji);

  // Build an array of distinct icon configs based on story colors
  const tileIcons = useMemo(()=>{
    const colors=["#F9A825","#1565C0","#43A047","#E53935","#D81B60","#00ACC1","#E64A19","#7B1FA2"];
    return Array.from({length:TOT-1},(_,i)=>({ Icon, c: colors[i%colors.length] }));
  },[story.emoji]);

  const handleClick = idx => {
    if (won) return;
    const ei=tiles.indexOf(null);
    const r=Math.floor(idx/G), c=idx%G, er=Math.floor(ei/G), ec=ei%G;
    const adj=(r===er&&Math.abs(c-ec)===1)||(c===ec&&Math.abs(r-er)===1);
    if (!adj) return;
    const next=[...tiles];
    [next[idx],next[ei]]=[next[ei],next[idx]];
    setTiles(next); setMoves(m=>m+1);
    if (next.every((t,i)=>t===GOAL[i])) {
      setWon(true); setConfetti(true);
      setTimeout(()=>setConfetti(false),2500);
    }
  };

  const TILE_SZ = 82;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background:"rgba(21,101,192,0.88)", backdropFilter:"blur(10px)" }}
      initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
    >
      <Confetti active={confetti}/>
      <motion.div
        initial={{ scale:0.82, opacity:0, y:20 }}
        animate={{ scale:1, opacity:1, y:0 }}
        exit={{ scale:0.82, opacity:0 }}
        transition={SPRING}
        className="bg-white rounded-[2.5rem] shadow-2xl p-8 max-w-sm w-full border-4 border-white"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <motion.button whileHover={{ scale:1.08 }} whileTap={{ scale:0.90 }} onClick={onClose}
            className="flex items-center gap-1.5 font-display text-sm" style={{ color:C.blue }}
          ><ChevronLeft size={16}/> Back</motion.button>
          <div className="flex flex-col items-center gap-1.5">
            <div style={{
              width:52, height:52, borderRadius:"50%",
              background:`linear-gradient(135deg,${color}33,${color}55)`,
              border:"3px solid white", boxShadow:`0 6px 20px ${color}40`,
              display:"flex", alignItems:"center", justifyContent:"center",
            }}>
              <Icon size={26} color={color} strokeWidth={2.2}/>
            </div>
            <span className="font-display text-sm" style={{ color:C.blue }}>{story.title}</span>
          </div>
          <div className="font-display text-sm text-slate-400">{moves}m</div>
        </div>

        <AnimatePresence>
          {won && (
            <motion.div initial={{ scale:0.8,opacity:0 }} animate={{ scale:1,opacity:1 }}
              className="text-center mb-4 py-3 rounded-2xl font-display text-lg text-white"
              style={{ background:`linear-gradient(135deg,${C.green},#2E7D32)` }}
            >🏆 Solved in {moves} moves!</motion.div>
          )}
        </AnimatePresence>

        {/* Puzzle grid */}
        <div className="grid gap-2 p-2.5 rounded-3xl mb-5 border-4 border-white"
          style={{
            gridTemplateColumns:`repeat(${G},${TILE_SZ}px)`,
            background: color+"18",
            boxShadow:`0 8px 24px ${color}28`,
          }}
        >
          {tiles.map((tile,idx)=>{
            const isBlank = tile===null;
            const conf    = isBlank ? null : tileIcons[tile];
            const { I: TIcon, c: tc } = conf || {};
            return (
              <motion.button
                key={idx}
                onClick={()=>handleClick(idx)}
                onHoverStart={()=>setHoveredTile(idx)}
                onHoverEnd={()=>setHoveredTile(null)}
                whileTap={!isBlank?{scale:0.91}:{}}
                transition={SPRING}
                style={{
                  width:  TILE_SZ,
                  height: TILE_SZ,
                  borderRadius: 20,
                  border:     isBlank ? `2px dashed ${color}30` : "3px solid white",
                  background: isBlank ? "transparent" : (hoveredTile===idx ? tc+"28" : tc+"18"),
                  boxShadow:  isBlank ? "none" : (hoveredTile===idx ? `0 6px 18px ${tc}45, inset 0 1px 0 rgba(255,255,255,0.5)` : `0 3px 12px ${tc}30`),
                  display:"flex", alignItems:"center", justifyContent:"center",
                  cursor: isBlank?"default":"pointer",
                }}
              >
                {!isBlank && <TIcon size={38} color={tc} strokeWidth={2.1}/>}
              </motion.button>
            );
          })}
        </div>

        <motion.button whileHover={{ scale:1.04 }} whileTap={{ scale:0.95 }}
          onClick={() => { setTiles(shuffle(GOAL)); setMoves(0); setWon(false); }}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-display text-white shadow-lg"
          style={{ background:C.red, boxShadow:`0 6px 18px ${C.red}40` }}
        ><RotateCcw size={16}/> Shuffle</motion.button>
      </motion.div>
    </motion.div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// STORY COVER CARD  — vector icon on gradient background
// ══════════════════════════════════════════════════════════════════════════
function StoryCard({ story, onRead, onPuzzle, onDelete, index }) {
  const [deleting, setDeleting] = useState(false);
  const [hovered,  setHovered]  = useState(false);
  const { Icon, color: iconColor } = getStoryIcon(story.emoji);

  const handleDelete = async () => { setDeleting(true); await onDelete(story.id); };

  return (
    <motion.div
      initial={{ opacity:0, y:26 }} animate={{ opacity:1, y:0 }}
      transition={{ delay: Math.min(index, PAGE_SIZE) * 0.05, type:"spring", stiffness:200 }}
      className="relative group"
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ y:-5 }}
    >
      {/* Book spine */}
      <div className="absolute left-0 top-2 bottom-2 w-3 rounded-l-xl"
        style={{ background:"rgba(0,0,0,0.15)", filter:"blur(3px)" }}
      />

      {/* Cover */}
      <div className={`relative bg-gradient-to-br ${story.color||"from-blue-400 to-cyan-300"} rounded-3xl overflow-hidden border-4 border-white min-h-[190px]`}
        style={{ boxShadow: hovered
          ? `0 20px 50px ${iconColor}50, 0 6px 18px rgba(0,0,0,0.18)`
          : "0 8px 28px rgba(0,0,0,0.16)"
        }}
      >
        {/* Subtle diagonal texture */}
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage:"repeating-linear-gradient(45deg,white 0,white 1px,transparent 0,transparent 50%)", backgroundSize:"8px 8px" }}
        />

        {/* Content */}
        <div className="relative p-5 flex flex-col h-full min-h-[190px]">
          {/* Vector icon instead of emoji */}
          <StoryCoverIcon emoji={story.emoji} size={58}/>

          <h3 className="font-display text-white text-base leading-snug mt-3 flex-1 drop-shadow">
            {story.title}
          </h3>
          <div className="flex items-center gap-1.5 text-white/70 font-body text-xs mt-2">
            <BookOpen size={11}/> {story.pages?.length ?? 0} pages
          </div>
        </div>

        {/* Hover overlay */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              className="absolute inset-0 rounded-3xl flex flex-col items-center justify-center gap-2.5 p-3"
              style={{ background:"rgba(21,101,192,0.90)", backdropFilter:"blur(4px)" }}
            >
              <motion.button
                whileHover={{ scale:1.07 }} whileTap={{ scale:0.94 }} transition={SPRING}
                onClick={() => onRead(story)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl font-display text-sm bg-white shadow-md w-full justify-center"
                style={{ color:C.blue }}
              ><BookOpen size={15}/> Read Story</motion.button>
              <motion.button
                whileHover={{ scale:1.07 }} whileTap={{ scale:0.94 }} transition={SPRING}
                onClick={() => onPuzzle(story)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl font-display text-sm text-white shadow-md w-full justify-center"
                style={{ background:C.green, boxShadow:`0 4px 14px ${C.green}50` }}
              ><Puzzle size={15}/> Play Puzzle</motion.button>
              <motion.button
                whileHover={{ scale:1.07 }} whileTap={{ scale:0.94 }} transition={SPRING}
                onClick={handleDelete} disabled={deleting}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl font-display text-xs text-white/70 hover:text-white transition-colors"
              ><Trash2 size={13}/> {deleting ? "Deleting…" : "Remove"}</motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// MAIN
// ══════════════════════════════════════════════════════════════════════════
export default function MyLibrary({ onCreateStory, onReadStory }) {
  const { user, firstName }      = useAuth();
  const [stories,     setStories]     = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState("");
  const [puzzleStory, setPuzzleStory] = useState(null);
  const [query,       setQuery]       = useState("");
  const [shown,       setShown]       = useState(PAGE_SIZE);

const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      // 1. CARGAR LOS 20 CUENTOS DE CLAUDE (Desde tu server.js)
      const serverRes = await fetch("https://TU-URL-DE-RENDER.com/api/stories");
      const staticStories = serverRes.ok ? await serverRes.json() : [];

      // 2. CARGAR CUENTOS DE SUPABASE (Solo si el usuario inició sesión)
      let supabaseStories = [];
      if (user) {
        try {
          supabaseStories = await fetchMyStories(user.id);
        } catch (e) {
          console.error("Supabase error:", e);
        }
      }

      // 3. CARGAR CUENTOS DE INVITADO (LocalStorage)
      const guestStories = lsGet("kiddsy_guestStories", []);

      // 4. UNIR TODO EN UNA SOLA LISTA
      // Usamos un Map para evitar cuentos duplicados por ID
      const allStories = [...staticStories, ...supabaseStories, ...guestStories];
      
      // Eliminar duplicados si los hubiera y guardar en el estado
      const uniqueStories = Array.from(new Map(allStories.map(s => [s.id, s])).values());
      setStories(uniqueStories);

    } catch(e) { 
      setError("Error al cargar la biblioteca: " + e.message); 
    } finally { 
      setLoading(false); 
    }
  }, [user]);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async id => {
    // Si el ID empieza por 'story-', es de los 20 de Claude (no se borran del server)
    if (String(id).startsWith('story-')) {
      alert("This is a starter story and cannot be deleted.");
      return;
    }

    // Borrar de Supabase si es necesario
    if (user) {
      await deleteStory(id);
    }
    
    // Borrar del LocalStorage y actualizar pantalla
    const updatedLocal = lsGet("kiddsy_guestStories", []).filter(s => s.id !== id);
    lsSet("kiddsy_guestStories", updatedLocal);
    setStories(prev => prev.filter(s => s.id !== id));
  };

  const filtered = useMemo(() => {
    if (!query.trim()) return stories;
    const q = query.toLowerCase();
    return stories.filter(s => s.title?.toLowerCase().includes(q) || s.emoji?.includes(q));
  }, [stories, query]);

  const visible = filtered.slice(0, shown);
  const hasMore = shown < filtered.length;

  return (
    <>
      <AnimatePresence>
        {puzzleStory && (
          <StoryPuzzle key="puzzle" story={puzzleStory} onClose={() => setPuzzleStory(null)}/>
        )}
      </AnimatePresence>

      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* Header */}
        <motion.div initial={{ opacity:0, y:-16 }} animate={{ opacity:1, y:0 }} className="mb-6">
          <div className="flex items-center gap-4 mb-2">
            <StickerBadge icon={BookOpen} color={C.blue} size={56} noHover/>
            <div>
              <h1 className="font-display text-3xl md:text-4xl" style={{ color:C.blue }}>
                {firstName}'s Library
              </h1>
              <p className="font-body text-slate-500 text-sm mt-0.5">
                Your personalized story collection
              </p>
            </div>
          </div>
        </motion.div>

        {/* Create CTA */}
        <motion.button
          whileHover={{ scale:1.02, y:-3 }} whileTap={{ scale:0.97 }} transition={SPRING}
          onClick={onCreateStory}
          initial={{ opacity:0 }} animate={{ opacity:1 }} transition_={{ delay:0.1 }}
          className="w-full mb-6 py-5 rounded-[2rem] font-display text-xl text-white flex items-center justify-center gap-3 border-4 border-white shadow-2xl"
          style={{ background:`linear-gradient(135deg,${C.yellow},#FF8F00)`, boxShadow:`0 14px 40px rgba(249,168,37,0.38)` }}
        >
          <Plus size={24}/> Create a New Story ✨
        </motion.button>

        {/* Search */}
        {!loading && stories.length > 0 && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} className="relative mb-6">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"/>
            <input
              type="text" value={query}
              onChange={e => { setQuery(e.target.value); setShown(PAGE_SIZE); }}
              placeholder="Search your stories…"
              className="w-full pl-10 pr-10 py-3.5 rounded-2xl border-2 border-slate-100 font-body bg-white/90 backdrop-blur focus:outline-none focus:border-blue-300 placeholder-slate-300 shadow-sm"
            />
            {query && (
              <button onClick={() => setQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              ><X size={16}/></button>
            )}
          </motion.div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-16">
            <motion.div
              animate={{ rotate:360 }} transition={{ duration:1, repeat:Infinity, ease:"linear" }}
              style={{
                width:64, height:64, borderRadius:"50%",
                border:"4px solid #E3F2FD",
                borderTop:`4px solid ${C.blue}`,
              }}
            />
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="text-center py-10 font-body text-red-500">
            <p>⚠️ {error}</p>
            <button onClick={load} className="mt-3 flex items-center gap-2 mx-auto font-display text-sm" style={{ color:C.blue }}>
              <RefreshCw size={14}/> Try again
            </button>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && stories.length === 0 && (
          <motion.div initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }}
            className="text-center py-16 bg-white/80 backdrop-blur rounded-[2rem] border-4 border-white shadow-md"
          >
            <motion.div
              animate={{ y:[0,-10,0] }} transition={{ duration:2.2, repeat:Infinity, ease:"easeInOut" }}
              className="flex justify-center mb-5"
            >
              <StickerBadge icon={BookOpen} color={C.blue} size={80} noHover/>
            </motion.div>
            <h2 className="font-display text-3xl mb-2" style={{ color:C.blue }}>No stories yet!</h2>
            <p className="font-body text-slate-500 mb-7 max-w-xs mx-auto">
              Generate your first personalized bilingual story and it will appear here.
            </p>
            <motion.button whileHover={{ scale:1.04 }} whileTap={{ scale:0.96 }} transition={SPRING}
              onClick={onCreateStory}
              className="px-9 py-4 rounded-2xl font-display text-lg text-white shadow-xl"
              style={{ background:`linear-gradient(135deg,${C.blue},#42A5F5)`, boxShadow:`0 10px 28px ${C.blue}40` }}
            >Create First Story 🪄</motion.button>
          </motion.div>
        )}

        {/* No results */}
        {!loading && stories.length > 0 && filtered.length === 0 && (
          <div className="text-center py-12 font-body text-slate-400">
            <div className="text-4xl mb-3">🔍</div>
            <p>No stories match "<strong>{query}</strong>"</p>
            <button onClick={() => setQuery("")} className="mt-2 font-display text-sm" style={{ color:C.blue }}>Clear search</button>
          </div>
        )}

        {/* Story grid */}
        {!loading && visible.length > 0 && (
          <>
            <div className="flex items-center justify-between mb-5">
              <p className="font-display text-slate-500">
                {filtered.length} {filtered.length===1?"story":"stories"}
                {query ? ` matching "${query}"` : " saved"}
              </p>
              <button onClick={load}
                className="flex items-center gap-1.5 font-body text-sm text-slate-400 hover:text-slate-600 transition-colors"
              ><RefreshCw size={13}/> Refresh</button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
              {visible.map((story, i) => (
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

            {hasMore && (
              <div className="flex justify-center mt-8">
                <motion.button
                  whileHover={{ scale:1.04, y:-2 }} whileTap={{ scale:0.96 }} transition={SPRING}
                  onClick={() => setShown(s => s + PAGE_SIZE)}
                  className="flex items-center gap-2 px-8 py-3.5 rounded-2xl font-display text-white shadow-xl"
                  style={{ background:C.blue, boxShadow:`0 8px 24px ${C.blue}40` }}
                >
                  <ChevronDown size={18}/> Show more ({filtered.length - shown} remaining)
                </motion.button>
              </div>
            )}
          </>
        )}

        {/* Puzzle tip */}
        {!loading && stories.length > 0 && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.5 }}
            className="mt-8 rounded-3xl p-4 flex items-center gap-3 border-2 border-white shadow-sm"
            style={{ background:C.greenSoft }}
          >
            <StickerBadge icon={Puzzle} color={C.green} size={36} noHover/>
            <p className="font-body text-sm" style={{ color:C.green }}>
              <strong>Tip:</strong> Hover over any story and tap <strong>Play Puzzle</strong> to build a sliding icon puzzle!
            </p>
          </motion.div>
        )}
      </div>
    </>
  );
}
