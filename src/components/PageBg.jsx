/**
 * src/components/PageBg.jsx — Kiddsy
 * ─────────────────────────────────────────────────────────────────────────
 * Fondos SVG temáticos para cada página.
 * Todos son position:absolute inset:0 — envuelve tu página en position:relative.
 *
 * EXPORTS:
 *   StoryBg     — Create a Story: biblioteca nocturna con libros flotantes y velas
 *   LibraryBg   — My Library: estantería de madera con linternas y escalera
 *   GamesBg     — Games: arcade colorido con dados, estrellas y confeti
 *   WordSearchBg — Word Search: cuenco de ramen con letras flotando en sopa
 *   PuzzleBg    — Puzzle Master: selva/safari con palmeras y siluetas de animales
 *   LearnBg     — Learn ABC: aula mágica con ABCs flotantes, lápices y estrellas
 *
 * USO:
 *   import { StoryBg } from "../components/PageBg";
 *   <div style={{ position:"relative", minHeight:"100vh" }}>
 *     <StoryBg/>
 *     ... tu contenido ...
 *   </div>
 * ─────────────────────────────────────────────────────────────────────────
 */
import { motion } from "framer-motion";

// ── Utility: floating motion wrapper ─────────────────────────────────────
function Float({ children, x=0, y=0, dx=0, dy=12, duration=4, delay=0, rotate=0, style={} }) {
  return (
    <motion.div
      style={{ position:"absolute", left:x, top:y, pointerEvents:"none", ...style }}
      animate={{ y:[0, -dy, 0], x:[0, dx, 0], rotate:[rotate-2, rotate+2, rotate-2] }}
      transition={{ duration, delay, repeat:Infinity, ease:"easeInOut" }}
    >
      {children}
    </motion.div>
  );
}

function Spin({ children, x=0, y=0, duration=20, clockwise=true, style={} }) {
  return (
    <motion.div
      style={{ position:"absolute", left:x, top:y, pointerEvents:"none", ...style }}
      animate={{ rotate: clockwise ? [0,360] : [360,0] }}
      transition={{ duration, repeat:Infinity, ease:"linear" }}
    >
      {children}
    </motion.div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
//  1. STORY BG — Noche de cuentos: cielo índigo, velas, libros abiertos
// ══════════════════════════════════════════════════════════════════════════
export function StoryBg() {
  return (
    <div style={{ position:"absolute", inset:0, zIndex:0, overflow:"hidden",
      background:"linear-gradient(180deg, #0D1B4B 0%, #1A2D6B 35%, #2C3E7A 65%, #3B2C6E 100%)" }}>

      {/* Stars field */}
      {[
        [80,40],[160,20],[250,60],[340,30],[440,15],[520,55],[620,25],[710,45],
        [800,18],[890,50],[970,30],[1050,65],[1130,20],[180,80],[420,85],[720,90],
        [60,110],[300,95],[580,75],[940,88],[1100,45],[350,130],[750,120],[50,160],
      ].map(([sx,sy],i) => (
        <motion.div key={i}
          style={{ position:"absolute", left:sx, top:sy, width:i%3===0?4:3, height:i%3===0?4:3,
            borderRadius:"50%", background:"white", pointerEvents:"none" }}
          animate={{ opacity:[0.3, 1, 0.3], scale:[0.8,1.2,0.8] }}
          transition={{ duration:2+i*0.3, delay:i*0.18, repeat:Infinity, ease:"easeInOut" }}
        />
      ))}

      {/* Moon */}
      <motion.div style={{ position:"absolute", right:80, top:30, pointerEvents:"none" }}
        animate={{ y:[0,-8,0] }} transition={{ duration:6, repeat:Infinity, ease:"easeInOut" }}>
        <svg width={100} height={100} viewBox="0 0 100 100">
          <defs>
            <radialGradient id="moonGlow" cx="50%" cy="40%" r="50%">
              <stop offset="0%" stopColor="#FFF9C4"/>
              <stop offset="100%" stopColor="#FDE68A"/>
            </radialGradient>
          </defs>
          <circle cx="50" cy="50" r="48" fill="#FDE68A" opacity="0.15"/>
          <circle cx="50" cy="50" r="34" fill="url(#moonGlow)"/>
          <circle cx="34" cy="38" r="6"  fill="#FCD34D" opacity="0.3"/>
          <circle cx="58" cy="46" r="4"  fill="#FCD34D" opacity="0.2"/>
          <circle cx="48" cy="30" r="3"  fill="#FCD34D" opacity="0.25"/>
        </svg>
      </motion.div>

      {/* Shooting star */}
      <motion.div style={{ position:"absolute", left:-60, top:80, pointerEvents:"none" }}
        animate={{ x:[0,1400], y:[0,200], opacity:[0,1,1,0] }}
        transition={{ duration:3, delay:4, repeat:Infinity, repeatDelay:12, ease:"easeIn" }}>
        <svg width={60} height={4}>
          <defs>
            <linearGradient id="shootStar">
              <stop offset="0%" stopColor="white" stopOpacity="0"/>
              <stop offset="100%" stopColor="white" stopOpacity="0.9"/>
            </linearGradient>
          </defs>
          <rect width="60" height="3" rx="1.5" fill="url(#shootStar)"/>
        </svg>
      </motion.div>

      {/* Floating open books */}
      {[
        { x:60,  y:180, scale:1.1, delay:0,   rotate:-8  },
        { x:220, y:120, scale:0.8, delay:1.2, rotate:5   },
        { x:900, y:150, scale:1.0, delay:0.6, rotate:-5  },
        { x:1050,y:200, scale:0.85,delay:1.8, rotate:10  },
        { x:500, y:90,  scale:0.7, delay:2.2, rotate:-3  },
      ].map((b,i) => (
        <Float key={i} x={b.x} y={b.y} dy={10} duration={4+i*0.5} delay={b.delay} rotate={b.rotate}>
          <svg width={80*b.scale} height={56*b.scale} viewBox="0 0 80 56" style={{ filter:"drop-shadow(0 4px 12px rgba(0,0,0,0.4))" }}>
            {/* Book spine */}
            <rect x="38" y="4" width="4" height="48" rx="2" fill="#C4B5FD"/>
            {/* Left page */}
            <path d="M40 6 Q20 10 6 8 L6 48 Q22 46 40 50 Z" fill="#EDE9FE" stroke="#C4B5FD" strokeWidth="1"/>
            {/* Right page */}
            <path d="M40 6 Q60 10 74 8 L74 48 Q58 46 40 50 Z" fill="#F5F3FF" stroke="#C4B5FD" strokeWidth="1"/>
            {/* Lines on pages */}
            {[14,20,26,32,38].map(ly=>(<line key={ly} x1="12" y1={ly} x2="36" y2={ly-2} stroke="#DDD6FE" strokeWidth="1.5" opacity="0.7"/>))}
            {[14,20,26,32,38].map(ly=>(<line key={ly+"r"} x1="44" y1={ly} x2="68" y2={ly-2} stroke="#DDD6FE" strokeWidth="1.5" opacity="0.7"/>))}
            {/* Stars on pages */}
            <text x="16" y="44" fontSize="8" fill="#A78BFA" opacity="0.8">✦</text>
            <text x="52" y="44" fontSize="8" fill="#A78BFA" opacity="0.8">✦</text>
          </svg>
        </Float>
      ))}

      {/* Candles */}
      {[[150, 380],[1000, 360],[700, 400]].map(([cx,cy],i) => (
        <div key={i} style={{ position:"absolute", left:cx, top:cy, pointerEvents:"none" }}>
          {/* Flame flicker */}
          <motion.div style={{ position:"absolute", left:7, top:-18 }}
            animate={{ scaleY:[1,1.2,0.9,1.1,1], scaleX:[1,0.85,1.1,0.9,1], opacity:[0.9,1,0.8,1,0.9] }}
            transition={{ duration:0.8+i*0.15, repeat:Infinity, ease:"easeInOut" }}>
            <svg width={16} height={22} viewBox="0 0 16 22">
              <ellipse cx="8" cy="14" rx="7" ry="10" fill="#FCD34D" opacity="0.4"/>
              <path d="M8 20 Q2 12 5 6 Q8 2 11 6 Q14 12 8 20Z" fill="#FDE68A"/>
              <path d="M8 18 Q5 12 7 8 Q8 5 9 8 Q11 12 8 18Z" fill="white" opacity="0.6"/>
            </svg>
          </motion.div>
          {/* Wax */}
          <svg width={22} height={50} viewBox="0 0 22 50">
            <rect x="4" y="0" width="14" height="44" rx="7" fill="#FEF3C7" stroke="#FDE68A" strokeWidth="1.5"/>
            <rect x="4" y="36" width="14" height="10" rx="7" fill="#FCD34D" opacity="0.4"/>
            {/* Wick */}
            <line x1="11" y1="0" x2="11" y2="-8" stroke="#374151" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          {/* Glow */}
          <motion.div style={{
            position:"absolute", left:-20, top:-30, width:60, height:60,
            borderRadius:"50%", background:"radial-gradient(circle, rgba(252,211,77,0.25) 0%, transparent 70%)",
            pointerEvents:"none",
          }} animate={{ opacity:[0.6,1,0.6] }} transition={{ duration:1, repeat:Infinity }}/>
        </div>
      ))}

      {/* Bottom bookshelf silhouette */}
      <svg viewBox="0 0 1200 180" style={{ position:"absolute", bottom:0, left:0, width:"100%", pointerEvents:"none" }}
        preserveAspectRatio="xMidYMax slice">
        <defs>
          <linearGradient id="shelfGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1E1B4B" stopOpacity="0.9"/>
            <stop offset="100%" stopColor="#0F0D2E"/>
          </linearGradient>
        </defs>
        {/* Floor */}
        <rect x="0" y="120" width="1200" height="60" fill="url(#shelfGrad)"/>
        {/* Shelf plank */}
        <rect x="0" y="108" width="1200" height="14" rx="4" fill="#2D2460" stroke="#3730A3" strokeWidth="1.5"/>
        {/* Books on shelf */}
        {[
          [20,"#EF4444",18,64],[44,"#3B82F6",14,58],[62,"#10B981",22,70],[90,"#8B5CF6",16,62],
          [112,"#F59E0B",20,66],[138,"#EC4899",12,56],[156,"#06B6D4",18,64],[180,"#84CC16",24,72],
          [210,"#F97316",16,60],[232,"#6366F1",20,68],[258,"#14B8A6",18,64],[282,"#E879F9",14,58],
          [820,"#EF4444",22,70],[848,"#3B82F6",16,62],[870,"#F59E0B",18,64],[894,"#10B981",20,68],
          [920,"#8B5CF6",14,56],[940,"#EC4899",24,72],[970,"#06B6D4",18,64],[994,"#84CC16",16,60],
          [1016,"#F97316",20,68],[1042,"#6366F1",18,64],[1064,"#14B8A6",14,58],[1084,"#E879F9",22,70],
        ].map(([bx,bc,bw,bh],bi) => (
          <g key={bi}>
            <rect x={bx} y={108-bh} width={bw} height={bh} rx="3" fill={bc} opacity="0.85"/>
            <rect x={bx} y={108-bh} width={bw} height="5" rx="2" fill="rgba(255,255,255,0.25)"/>
          </g>
        ))}
      </svg>

      {/* Floating magical particles */}
      {[...Array(16)].map((_,i) => (
        <motion.div key={`p${i}`}
          style={{
            position:"absolute",
            left:`${6+i*6}%`, top:`${20+Math.sin(i)*30}%`,
            width: i%3===0?6:4, height: i%3===0?6:4,
            borderRadius:"50%",
            background: ["#C4B5FD","#FDE68A","#93C5FD","#A7F3D0"][i%4],
            pointerEvents:"none",
          }}
          animate={{ y:[-20,20,-20], opacity:[0.2,0.8,0.2] }}
          transition={{ duration:3+i*0.4, delay:i*0.22, repeat:Infinity, ease:"easeInOut" }}
        />
      ))}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
//  2. LIBRARY BG — Mi Biblioteca: estantes, escalera, linterna cálida
// ══════════════════════════════════════════════════════════════════════════
export function LibraryBg() {
  const BOOK_COLORS = [
    "#E53935","#D81B60","#8E24AA","#3949AB","#1E88E5",
    "#00ACC1","#00897B","#43A047","#F9A825","#FB8C00","#E64A19","#6D4C41",
  ];
  const bookRow = (startX, y, count, h) => Array.from({length:count},(_, i)=>{
    const w = 16+Math.floor(Math.random()*14);
    const x = startX + i * (w+2);
    const c = BOOK_COLORS[i % BOOK_COLORS.length];
    return { x, y: y-h, w, h, c };
  });

  return (
    <div style={{ position:"absolute", inset:0, zIndex:0, overflow:"hidden",
      background:"linear-gradient(180deg, #78350F 0%, #92400E 20%, #B45309 50%, #D97706 75%, #F59E0B 100%)" }}>

      {/* Warm wood overlay */}
      <div style={{
        position:"absolute", inset:0,
        background:"linear-gradient(180deg, rgba(180,83,9,0.85) 0%, rgba(120,53,15,0.9) 100%)",
        pointerEvents:"none",
      }}/>

      {/* Ceiling */}
      <div style={{ position:"absolute", top:0, left:0, right:0, height:40,
        background:"linear-gradient(180deg, #451A03, transparent)", pointerEvents:"none" }}/>

      {/* LEFT BOOKSHELF */}
      <svg viewBox="0 0 260 600" style={{ position:"absolute", left:0, top:0, height:"100%", pointerEvents:"none" }}
        preserveAspectRatio="xMinYMid meet">
        {/* Back panel */}
        <rect width="260" height="600" fill="#451A03"/>
        {/* Side frame */}
        <rect x="240" y="0" width="20" height="600" fill="#78350F"/>
        {/* Shelves */}
        {[100,200,300,400,500].map((sy,si) => (
          <g key={si}>
            <rect x="0" y={sy} width="240" height="14" rx="3" fill="#92400E"/>
            <rect x="0" y={sy} width="240" height="5" fill="#FDE68A" opacity="0.12"/>
          </g>
        ))}
        {/* Books row 1 */}
        {bookRow(4,100,13,62).map((b,i)=>(
          <g key={`a${i}`}>
            <rect x={b.x} y={b.y} width={b.w} height={b.h} rx="2" fill={b.c} opacity="0.9"/>
            <rect x={b.x} y={b.y} width={b.w} height="4" rx="1" fill="rgba(255,255,255,0.3)"/>
          </g>
        ))}
        {/* Books row 2 */}
        {bookRow(4,200,13,58).map((b,i)=>(
          <g key={`b${i}`}>
            <rect x={b.x} y={b.y} width={b.w} height={b.h} rx="2" fill={b.c} opacity="0.85"/>
            <rect x={b.x} y={b.y} width={b.w} height="4" rx="1" fill="rgba(255,255,255,0.3)"/>
          </g>
        ))}
        {/* Books row 3 */}
        {bookRow(4,300,13,70).map((b,i)=>(
          <g key={`c${i}`}>
            <rect x={b.x} y={b.y} width={b.w} height={b.h} rx="2" fill={b.c} opacity="0.9"/>
            <rect x={b.x} y={b.y} width={b.w} height="4" rx="1" fill="rgba(255,255,255,0.3)"/>
          </g>
        ))}
      </svg>

      {/* RIGHT BOOKSHELF */}
      <svg viewBox="0 0 260 600" style={{ position:"absolute", right:0, top:0, height:"100%", pointerEvents:"none" }}
        preserveAspectRatio="xMaxYMid meet">
        <rect width="260" height="600" fill="#451A03"/>
        <rect x="0" y="0" width="20" height="600" fill="#78350F"/>
        {[100,200,300,400,500].map((sy,si) => (
          <g key={si}>
            <rect x="20" y={sy} width="240" height="14" rx="3" fill="#92400E"/>
            <rect x="20" y={sy} width="240" height="5" fill="#FDE68A" opacity="0.12"/>
          </g>
        ))}
        {bookRow(24,100,13,65).map((b,i)=>(
          <g key={`d${i}`}>
            <rect x={b.x} y={b.y} width={b.w} height={b.h} rx="2" fill={b.c} opacity="0.9"/>
            <rect x={b.x} y={b.y} width={b.w} height="4" rx="1" fill="rgba(255,255,255,0.3)"/>
          </g>
        ))}
        {bookRow(24,200,13,60).map((b,i)=>(
          <g key={`e${i}`}>
            <rect x={b.x} y={b.y} width={b.w} height={b.h} rx="2" fill={b.c} opacity="0.85"/>
            <rect x={b.x} y={b.y} width={b.w} height="4" rx="1" fill="rgba(255,255,255,0.3)"/>
          </g>
        ))}
      </svg>

      {/* Wooden floor */}
      <svg viewBox="0 0 1200 120" style={{ position:"absolute", bottom:0, left:0, width:"100%", pointerEvents:"none" }}
        preserveAspectRatio="xMidYMax slice">
        <defs>
          <linearGradient id="floorWood" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#78350F"/>
            <stop offset="100%" stopColor="#451A03"/>
          </linearGradient>
        </defs>
        <rect width="1200" height="120" fill="url(#floorWood)"/>
        {/* Planks */}
        {[0,30,60,90].map(fy => (
          <g key={fy}>
            <rect x="0" y={fy} width="1200" height="2" fill="rgba(0,0,0,0.2)"/>
          </g>
        ))}
        {[150,350,550,750,950,1100].map(fx => (
          <line key={fx} x1={fx} y1="0" x2={fx} y2="120" stroke="rgba(0,0,0,0.12)" strokeWidth="1"/>
        ))}
        {/* Carpet runner */}
        <rect x="400" y="20" width="400" height="70" rx="8" fill="#B45309" opacity="0.6"/>
        <rect x="410" y="28" width="380" height="54" rx="6" fill="none" stroke="#FDE68A" strokeWidth="2" opacity="0.4"/>
        {[430,470,510,560,640,710,760].map(cx=>(
          <circle key={cx} cx={cx} cy="55" r="6" fill="none" stroke="#FDE68A" strokeWidth="1.5" opacity="0.35"/>
        ))}
      </svg>

      {/* Ladder leaning on right shelf */}
      <svg width={60} height={340}
        style={{ position:"absolute", right:220, top:"15%", pointerEvents:"none", opacity:0.9 }}
        viewBox="0 0 60 340">
        <line x1="8"  y1="10" x2="20" y2="330" stroke="#92400E" strokeWidth="8" strokeLinecap="round"/>
        <line x1="40" y1="10" x2="52" y2="330" stroke="#92400E" strokeWidth="8" strokeLinecap="round"/>
        {[40,90,140,190,240,290].map((ry,ri) => (
          <line key={ri} x1={8+(ri+1)*2} y1={ry} x2={48+(ri+1)*0.5} y2={ry+2}
            stroke="#B45309" strokeWidth="5" strokeLinecap="round"/>
        ))}
      </svg>

      {/* Lantern */}
      <Float x={540} y={20} dy={8} duration={5} delay={0}>
        <svg width={50} height={80} viewBox="0 0 50 80">
          {/* Chain */}
          {[0,8,16,24].map(cy=>(<circle key={cy} cx="25" cy={cy} r="2.5" fill="#78350F"/>))}
          {/* Lantern body */}
          <rect x="10" y="28" width="30" height="38" rx="8" fill="#FDE68A" stroke="#F59E0B" strokeWidth="2"/>
          <rect x="10" y="28" width="30" height="38" rx="8" fill="rgba(253,230,138,0.6)"/>
          {/* Panes */}
          <line x1="25" y1="28" x2="25" y2="66" stroke="#F59E0B" strokeWidth="1.5" opacity="0.7"/>
          <line x1="10" y1="47" x2="40" y2="47" stroke="#F59E0B" strokeWidth="1.5" opacity="0.7"/>
          {/* Cap */}
          <path d="M8 28 L25 18 L42 28Z" fill="#B45309"/>
          {/* Base */}
          <rect x="8" y="64" width="34" height="6" rx="3" fill="#B45309"/>
        </svg>
        {/* Glow */}
        <div style={{
          position:"absolute", left:-30, top:20, width:110, height:80,
          borderRadius:"50%", background:"radial-gradient(circle, rgba(253,230,138,0.35) 0%, transparent 70%)",
        }}/>
      </Float>

      {/* Dust particles floating */}
      {[...Array(20)].map((_,i) => (
        <motion.div key={`dust${i}`}
          style={{
            position:"absolute",
            left:`${15+i*4.2}%`, top:`${10+i*3.8}%`,
            width:3, height:3, borderRadius:"50%",
            background:"rgba(253,230,138,0.6)", pointerEvents:"none",
          }}
          animate={{ y:[-30, 30], opacity:[0, 0.7, 0], x:[-5,5,-5] }}
          transition={{ duration:4+i*0.5, delay:i*0.3, repeat:Infinity, ease:"easeInOut" }}
        />
      ))}

      {/* Center light cone from above */}
      <div style={{
        position:"absolute", top:0, left:"50%", transform:"translateX(-50%)",
        width:600, height:"70%", pointerEvents:"none",
        background:"radial-gradient(ellipse 300px 60% at 50% 0%, rgba(253,230,138,0.18) 0%, transparent 100%)",
      }}/>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
//  3. GAMES BG — Arcade colorido: dados, joystick, estrellas, confeti
// ══════════════════════════════════════════════════════════════════════════
export function GamesBg() {
  const CONFETTI_COLORS = ["#E53935","#F9A825","#43A047","#1565C0","#D81B60","#00ACC1","#8E24AA","#FF7043"];

  return (
    <div style={{ position:"absolute", inset:0, zIndex:0, overflow:"hidden",
      background:"linear-gradient(135deg, #FFF9C4 0%, #FFFDE7 30%, #E8F5E9 60%, #E3F2FD 100%)" }}>

      {/* Polka dot pattern */}
      <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%", pointerEvents:"none", opacity:0.12 }}
        xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="dots" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
            <circle cx="30" cy="30" r="6" fill="#1565C0"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dots)"/>
      </svg>

      {/* Floating dice */}
      {[
        {x:60, y:80, size:56, color:"#E53935", delay:0},
        {x:1080,y:100,size:48, color:"#1565C0", delay:1.2},
        {x:200, y:320,size:40, color:"#F9A825", delay:0.8},
        {x:960, y:280,size:44, color:"#43A047", delay:1.6},
      ].map((d,i) => (
        <Float key={`dice${i}`} x={d.x} y={d.y} dy={14} duration={3+i*0.5} delay={d.delay} rotate={i*15}>
          <svg width={d.size} height={d.size} viewBox="0 0 56 56">
            <rect width="56" height="56" rx="12" fill={d.color}/>
            <rect width="56" height="56" rx="12" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="3"/>
            {/* Dots */}
            {[[14,14],[42,14],[28,28],[14,42],[42,42]].slice(0,i+2).map(([dx,dy],di) => (
              <circle key={di} cx={dx} cy={dy} r="5.5" fill="white"/>
            ))}
          </svg>
        </Float>
      ))}

      {/* Giant star decorations */}
      {[
        {x:30, y:200, size:70, color:"#FDE68A", delay:0.3},
        {x:1110,y:350,size:60, color:"#FCA5A5", delay:1.1},
        {x:550, y:50, size:50, color:"#BAF7D0", delay:0.7},
      ].map((s,i) => (
        <Float key={`star${i}`} x={s.x} y={s.y} dy={12} duration={4+i*0.6} delay={s.delay} rotate={i*20}>
          <svg width={s.size} height={s.size} viewBox="0 0 60 60">
            <path d="M30 4 L35 22 L54 22 L39 34 L44 52 L30 41 L16 52 L21 34 L6 22 L25 22Z"
              fill={s.color} stroke="white" strokeWidth="2.5"/>
          </svg>
        </Float>
      ))}

      {/* Game controller */}
      <Float x={500} y={70} dy={10} duration={5} delay={0.4}>
        <svg width={100} height={70} viewBox="0 0 100 70" style={{ filter:"drop-shadow(0 4px 12px rgba(21,101,192,0.3))" }}>
          <path d="M10 30 Q10 15 25 14 L75 14 Q90 15 90 30 L85 55 Q83 65 72 65 L63 55 Q55 52 50 52 Q45 52 37 55 L28 65 Q17 65 15 55Z"
            fill="#1565C0" stroke="#0D47A1" strokeWidth="2"/>
          {/* D-pad */}
          <rect x="22" y="28" width="10" height="24" rx="3" fill="#3B82F6"/>
          <rect x="16" y="34" width="22" height="12" rx="3" fill="#3B82F6"/>
          {/* Buttons */}
          <circle cx="72" cy="28" r="6" fill="#E53935"/>
          <circle cx="82" cy="36" r="6" fill="#F9A825"/>
          <circle cx="62" cy="36" r="6" fill="#43A047"/>
          <circle cx="72" cy="44" r="6" fill="#1565C0"/>
          {/* Start/Select */}
          <rect x="40" y="32" width="8" height="4" rx="2" fill="#93C5FD"/>
          <rect x="52" y="32" width="8" height="4" rx="2" fill="#93C5FD"/>
        </svg>
      </Float>

      {/* Trophy */}
      <Float x={1000} y={180} dy={10} duration={4.5} delay={1.5}>
        <svg width={70} height={90} viewBox="0 0 70 90" style={{ filter:"drop-shadow(0 3px 8px rgba(249,168,37,0.4))" }}>
          <path d="M20 10 Q20 50 35 58 Q50 50 50 10Z" fill="#FCD34D" stroke="#F9A825" strokeWidth="2"/>
          <path d="M20 20 Q8 20 8 35 Q8 48 20 48" stroke="#FCD34D" strokeWidth="4" fill="none" strokeLinecap="round"/>
          <path d="M50 20 Q62 20 62 35 Q62 48 50 48" stroke="#FCD34D" strokeWidth="4" fill="none" strokeLinecap="round"/>
          <rect x="28" y="58" width="14" height="18" rx="3" fill="#F59E0B"/>
          <rect x="18" y="74" width="34" height="10" rx="5" fill="#FCD34D" stroke="#F9A825" strokeWidth="2"/>
          <text x="35" y="40" textAnchor="middle" fontSize="20" fill="#92400E">★</text>
        </svg>
      </Float>

      {/* Confetti rain */}
      {[...Array(30)].map((_,i) => (
        <motion.div key={`conf${i}`}
          style={{
            position:"absolute",
            left:`${(i*3.3+5)%95}%`,
            top: `-${10+i*2}px`,
            width: i%4===0?12:8, height: i%4===0?6:5,
            borderRadius: i%3===0?"50%":"2px",
            background: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
            opacity: 0.75,
            pointerEvents:"none",
          }}
          animate={{
            y:["0vh","110vh"],
            rotate:[0, 360 * (i%2===0?1:-1)],
            opacity:[0, 0.8, 0.8, 0],
          }}
          transition={{
            duration: 5+i*0.3,
            delay: i*0.4,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}

      {/* Sparkle burst circles */}
      {[
        {x:"10%",y:"60%",c:"#FDE68A",r:120},
        {x:"88%",y:"75%",c:"#BBDEFB",r:100},
        {x:"50%",y:"85%",c:"#F8BBD0",r:90},
      ].map((blob,i) => (
        <motion.div key={`blob${i}`}
          style={{
            position:"absolute", left:blob.x, top:blob.y,
            width:blob.r*2, height:blob.r*2, marginLeft:-blob.r, marginTop:-blob.r,
            borderRadius:"50%", background:blob.c, opacity:0.3, pointerEvents:"none",
          }}
          animate={{ scale:[1,1.15,1] }}
          transition={{ duration:4+i*0.8, repeat:Infinity, ease:"easeInOut" }}
        />
      ))}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
//  4. WORD SEARCH BG — Sopa de letras: cuenco de ramen, letras flotando
// ══════════════════════════════════════════════════════════════════════════
export function WordSearchBg() {
  const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const floatLetters = "WORDGAMEFUNPLAYLEARNKIDDS".split("");

  return (
    <div style={{ position:"absolute", inset:0, zIndex:0, overflow:"hidden",
      background:"linear-gradient(160deg, #FFF8F0 0%, #FFF3E0 40%, #FFFDE7 70%, #F0FFF4 100%)" }}>

      {/* Subtle grid pattern */}
      <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%", pointerEvents:"none", opacity:0.06 }}>
        <defs>
          <pattern id="grid" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#E65100" strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)"/>
      </svg>

      {/* Floating alphabet letters */}
      {floatLetters.map((letter, i) => (
        <motion.div key={`fl${i}`}
          style={{
            position:"absolute",
            left:`${4+i*4}%`,
            top:`${15+Math.sin(i*0.8)*35}%`,
            fontFamily:"'Fredoka One','Nunito',sans-serif",
            fontWeight:900,
            fontSize: i%3===0?42:i%3===1?32:26,
            color:["#1565C0","#E53935","#43A047","#F9A825","#D81B60","#00ACC1"][i%6],
            textShadow:"0 2px 8px rgba(0,0,0,0.12)",
            userSelect:"none",
            pointerEvents:"none",
            opacity: 0.5,
          }}
          animate={{ y:[0,-18,0], rotate:[i%2===0?-8:8, i%2===0?8:-8, i%2===0?-8:8], opacity:[0.35,0.65,0.35] }}
          transition={{ duration:3+i*0.35, delay:i*0.2, repeat:Infinity, ease:"easeInOut" }}
        >
          {letter}
        </motion.div>
      ))}

      {/* Giant ramen bowl center bottom */}
      <div style={{ position:"absolute", bottom:-30, left:"50%", transform:"translateX(-50%)", pointerEvents:"none" }}>
        <svg width={500} height={320} viewBox="0 0 500 320">
          <defs>
            <radialGradient id="bowlGrad" cx="50%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#FFF3E0"/>
              <stop offset="100%" stopColor="#FFE0B2"/>
            </radialGradient>
            <radialGradient id="soupGrad" cx="50%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#FBE9E7"/>
              <stop offset="100%" stopColor="#FFCCBC"/>
            </radialGradient>
          </defs>
          {/* Bowl outer */}
          <path d="M30 120 Q50 310 250 310 Q450 310 470 120Z" fill="#E65100" opacity="0.9"/>
          {/* Bowl inner */}
          <path d="M50 120 Q65 290 250 290 Q435 290 450 120Z" fill="url(#bowlGrad)"/>
          {/* Soup surface */}
          <ellipse cx="250" cy="122" rx="200" ry="36" fill="url(#soupGrad)"/>
          {/* Steam */}
          {[130,200,280,360].map((sx,si) => (
            <motion.path key={si}
              d={`M${sx} 118 Q${sx-12} 95 ${sx} 75 Q${sx+12} 55 ${sx} 35`}
              fill="none" stroke="rgba(255,200,150,0.5)" strokeWidth="5" strokeLinecap="round"
              animate={{ opacity:[0, 0.8, 0], y:[-5,-20,-35], scaleX:[1,1.3,0.7] }}
              transition={{ duration:2+si*0.4, delay:si*0.5, repeat:Infinity, ease:"easeInOut" }}
            />
          ))}
          {/* Noodle swirls in soup */}
          <path d="M80 130 Q120 145 160 128 Q200 112 240 130 Q280 148 320 128 Q360 110 400 132"
            fill="none" stroke="#FFCCBC" strokeWidth="8" strokeLinecap="round" opacity="0.7"/>
          <path d="M100 150 Q140 165 180 148 Q220 132 260 150 Q300 168 340 148 Q375 130 410 152"
            fill="none" stroke="#FFE0B2" strokeWidth="6" strokeLinecap="round" opacity="0.7"/>
          {/* Letter tiles IN the soup */}
          {[["W",140,138,"#E53935"],["O",200,145,"#1565C0"],["R",265,140,"#43A047"],["D",330,138,"#F9A825"]].map(([l,lx,ly,lc])=>(
            <g key={l}>
              <rect x={lx-11} y={ly-11} width="22" height="22" rx="5" fill={lc} opacity="0.85"/>
              <text x={lx} y={ly+5} textAnchor="middle" fontSize="13" fontWeight="900"
                fontFamily="'Fredoka One',sans-serif" fill="white">{l}</text>
            </g>
          ))}
          {/* Chopsticks */}
          <line x1="460" y1="50" x2="380" y2="160" stroke="#A16207" strokeWidth="6" strokeLinecap="round" opacity="0.9"/>
          <line x1="480" y1="60" x2="395" y2="165" stroke="#92400E" strokeWidth="6" strokeLinecap="round" opacity="0.9"/>
          {/* Bowl rim stripe */}
          <path d="M50 120 Q65 135 250 135 Q435 135 450 120" fill="none" stroke="#E65100" strokeWidth="8" opacity="0.5"/>
        </svg>
      </div>

      {/* Letter tiles scattered around */}
      {[
        {l:"A",x:80, y:180,c:"#1565C0"},{l:"Z",x:1050,y:200,c:"#E53935"},
        {l:"K",x:130,y:340,c:"#43A047"},{l:"M",x:980, y:320,c:"#F9A825"},
        {l:"X",x:60, y:420,c:"#D81B60"},{l:"Q",x:1080,y:400,c:"#00ACC1"},
      ].map(({l,x,y,c},i) => (
        <Float key={`tile${i}`} x={x} y={y} dy={10} duration={4+i*0.5} delay={i*0.4} rotate={i*12}>
          <div style={{
            width:52, height:52, borderRadius:10,
            background:c, border:"3px solid white",
            display:"flex", alignItems:"center", justifyContent:"center",
            boxShadow:`0 4px 14px ${c}55`,
          }}>
            <span style={{ fontFamily:"'Fredoka One','Nunito',sans-serif", fontWeight:900, fontSize:28, color:"white" }}>{l}</span>
          </div>
        </Float>
      ))}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
//  5. PUZZLE BG — Selva Safari: palmeras, follaje, siluetas de animales
// ══════════════════════════════════════════════════════════════════════════
export function PuzzleBg() {
  return (
    <div style={{ position:"absolute", inset:0, zIndex:0, overflow:"hidden",
      background:"linear-gradient(180deg, #87CEEB 0%, #B0E0E6 25%, #90EE90 60%, #228B22 100%)" }}>

      {/* Sky gradient top */}
      <div style={{ position:"absolute", top:0, left:0, right:0, height:"45%",
        background:"linear-gradient(180deg, #87CEEB 0%, #B0E6FF 100%)", pointerEvents:"none" }}/>

      {/* Sun */}
      <Spin x={70} y={20} duration={28} style={{ pointerEvents:"none" }}>
        <svg width={100} height={100} viewBox="0 0 100 100">
          {[0,30,60,90,120,150,180,210,240,270,300,330].map((a,i)=>{
            const r = a*Math.PI/180;
            return <line key={i} x1={50+Math.cos(r)*36} y1={50+Math.sin(r)*36}
              x2={50+Math.cos(r)*48} y2={50+Math.sin(r)*48}
              stroke="#FCD34D" strokeWidth="5" strokeLinecap="round"/>;
          })}
          <circle cx="50" cy="50" r="26" fill="#FDE68A"/>
          <circle cx="50" cy="50" r="20" fill="#FCD34D"/>
        </svg>
      </Spin>

      {/* Clouds */}
      {[
        {x:200,y:40,scale:1.1,delay:0},{x:600,y:20,scale:0.8,delay:3},{x:900,y:55,scale:0.9,delay:6}
      ].map((cl,i)=>(
        <motion.div key={`cl${i}`}
          style={{ position:"absolute", left:cl.x, top:cl.y, transform:`scale(${cl.scale})`, pointerEvents:"none" }}
          animate={{ x:[0,50,0] }} transition={{ duration:18+i*4, delay:cl.delay, repeat:Infinity, ease:"easeInOut" }}>
          <svg width={160} height={70} viewBox="0 0 160 70">
            <ellipse cx="80" cy="40" rx="70" ry="34" fill="white" opacity="0.9"/>
            <ellipse cx="44" cy="52" rx="44" ry="26" fill="white"/>
            <ellipse cx="116" cy="50" rx="40" ry="26" fill="white"/>
          </svg>
        </motion.div>
      ))}

      {/* Giraffe neck peeking from right */}
      <div style={{ position:"absolute", right:0, top:"5%", pointerEvents:"none", opacity:0.85 }}>
        <svg width={110} height={400} viewBox="0 0 110 400">
          <defs>
            <linearGradient id="giraffeGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#F4A435"/>
              <stop offset="100%" stopColor="#E8951F"/>
            </linearGradient>
          </defs>
          {/* Neck */}
          <path d="M40 400 L55 0 L90 0 L105 400Z" fill="url(#giraffeGrad)"/>
          {/* Spots */}
          {[[58,80,12],[62,160,10],[55,240,14],[60,320,11]].map(([px,py,pr],pi)=>(
            <ellipse key={pi} cx={px} cy={py} rx={pr} ry={pr*0.8} fill="#C47A1A" opacity="0.7"/>
          ))}
          {/* Ossicones */}
          <rect x="56" y="-18" width="6" height="24" rx="3" fill="#C47A1A"/>
          <circle cx="59" cy="-20" r="5" fill="#E8951F"/>
          <rect x="78" y="-12" width="5" height="18" rx="2.5" fill="#C47A1A"/>
          <circle cx="80" cy="-14" r="4" fill="#E8951F"/>
          {/* Eye */}
          <ellipse cx="70" cy="15" rx="9" ry="10" fill="#FDE68A"/>
          <circle cx="71" cy="15" r="5" fill="#3E2723"/>
          <circle cx="73" cy="13" r="2" fill="white"/>
          {/* Nostril */}
          <ellipse cx="62" cy="35" rx="5" ry="3" fill="#C47A1A" opacity="0.6"/>
          <ellipse cx="77" cy="35" rx="5" ry="3" fill="#C47A1A" opacity="0.6"/>
        </svg>
      </div>

      {/* Elephant ear peeking from left */}
      <div style={{ position:"absolute", left:-20, bottom:"10%", pointerEvents:"none", opacity:0.8 }}>
        <svg width={140} height={220} viewBox="0 0 140 220">
          <ellipse cx="50" cy="150" rx="80" ry="100" fill="#78909C" opacity="0.9"/>
          <ellipse cx="46" cy="148" rx="60" ry="78" fill="#90A4AE" opacity="0.7"/>
          {/* Tusks */}
          <path d="M70 200 Q100 230 120 210" fill="none" stroke="#FFF9C4" strokeWidth="10" strokeLinecap="round" opacity="0.9"/>
          {/* Eye */}
          <circle cx="80" cy="120" r="10" fill="#37474F"/>
          <circle cx="83" cy="117" r="4" fill="white"/>
        </svg>
      </div>

      {/* Jungle floor */}
      <div style={{ position:"absolute", bottom:0, left:0, right:0, height:"42%", pointerEvents:"none" }}>
        <svg viewBox="0 0 1200 260" width="100%" height="100%" preserveAspectRatio="xMidYMax slice">
          <defs>
            <linearGradient id="jungleFloor" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4CAF50"/>
              <stop offset="100%" stopColor="#1B5E20"/>
            </linearGradient>
          </defs>
          <rect width="1200" height="260" fill="url(#jungleFloor)"/>
          {/* Grass blades */}
          {[...Array(40)].map((_,i)=>{
            const gx = i*32; const gh = 40+Math.sin(i)*20;
            return <path key={i} d={`M${gx} 260 Q${gx+8} ${260-gh} ${gx+16} 260`}
              fill="#66BB6A" opacity="0.7"/>;
          })}
        </svg>
      </div>

      {/* Palm trees */}
      {[
        {x:100,  h:260, leafScale:1.2, delay:0  },
        {x:1020, h:220, leafScale:1.0, delay:0.8},
        {x:280,  h:190, leafScale:0.85,delay:1.4},
      ].map((pt,i) => (
        <div key={`palm${i}`} style={{ position:"absolute", bottom:"35%", left:pt.x, pointerEvents:"none" }}>
          {/* Trunk */}
          <svg width={32} height={pt.h} viewBox={`0 0 32 ${pt.h}`} style={{ display:"block" }}>
            <defs>
              <linearGradient id={`trunkGrad${i}`} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#795548"/>
                <stop offset="100%" stopColor="#A1887F"/>
              </linearGradient>
            </defs>
            <path d={`M8 ${pt.h} Q10 ${pt.h/2} 16 0 Q22 ${pt.h/2} 24 ${pt.h}Z`}
              fill={`url(#trunkGrad${i})`}/>
            {[...Array(8)].map((_,ri)=>(
              <line key={ri} x1="8" y1={pt.h*0.1+ri*pt.h*0.11}
                x2="24" y2={pt.h*0.1+ri*pt.h*0.11+6}
                stroke="#6D4C41" strokeWidth="1.5" opacity="0.4"/>
            ))}
          </svg>
          {/* Leaves wobble */}
          <motion.div style={{ position:"absolute", top:-80*pt.leafScale, left:-60*pt.leafScale, transformOrigin:"bottom center" }}
            animate={{ rotate:[-3,3,-3] }}
            transition={{ duration:2.5+i*0.5, delay:pt.delay, repeat:Infinity, ease:"easeInOut" }}>
            <svg width={150*pt.leafScale} height={100*pt.leafScale} viewBox="0 0 150 100">
              {/* Coconuts */}
              {[[70,80],[55,85],[85,85]].map(([cx,cy],ci)=>(
                <circle key={ci} cx={cx} cy={cy} r="9" fill="#6D4C41"/>
              ))}
              {/* Leaf fronds */}
              {[[-40,-20],[-20,-35],[0,-40],[20,-35],[40,-20],
                [-30,-5],[-10,-18],[10,-18],[30,-5],
                [-50,5],[50,5]].map(([lx,ly],li)=>(
                <path key={li}
                  d={`M75 88 Q${75+lx*0.5} ${88+ly*0.5} ${75+lx} ${88+ly}`}
                  fill="none" stroke={li%2===0?"#4CAF50":"#66BB6A"}
                  strokeWidth={li<5?9:6} strokeLinecap="round" opacity="0.9"/>
              ))}
            </svg>
          </motion.div>
        </div>
      ))}

      {/* Butterflies */}
      {[{x:400,y:200},{x:750,y:280},{x:550,y:150}].map((bf,i)=>(
        <motion.div key={`bf${i}`}
          style={{ position:"absolute", left:bf.x, top:bf.y, pointerEvents:"none" }}
          animate={{ x:[0,30+i*15,0], y:[0,-20,0], rotate:[-5,5,-5] }}
          transition={{ duration:4+i*0.8, delay:i*1.2, repeat:Infinity, ease:"easeInOut" }}>
          <svg width={40} height={30} viewBox="0 0 40 30">
            <ellipse cx="12" cy="12" rx="11" ry="8" fill={["#FCA5A5","#BAF7D0","#FBCFE8"][i]} opacity="0.88"
              transform="rotate(-20 12 12)"/>
            <ellipse cx="28" cy="12" rx="11" ry="8" fill={["#FCA5A5","#BAF7D0","#FBCFE8"][i]} opacity="0.88"
              transform="rotate(20 28 12)"/>
            <ellipse cx="14" cy="18" rx="8" ry="6" fill={["#FDE68A","#FDE68A","#FDE68A"][i]} opacity="0.7"
              transform="rotate(-20 14 18)"/>
            <ellipse cx="26" cy="18" rx="8" ry="6" fill={["#FDE68A","#FDE68A","#FDE68A"][i]} opacity="0.7"
              transform="rotate(20 26 18)"/>
            <rect x="19" y="6" width="2.5" height="18" rx="1.5" fill="#4B5563"/>
          </svg>
        </motion.div>
      ))}

      {/* Puzzle piece fragments floating */}
      {[{x:600,y:80},{x:700,y:160},{x:480,y:200}].map((pp,i)=>(
        <Float key={`pp${i}`} x={pp.x} y={pp.y} dy={12} duration={5+i*0.7} delay={i*1.1}>
          <svg width={44} height={44} viewBox="0 0 44 44">
            <path d="M4 4 L18 4 Q20 0 22 4 L40 4 L40 18 Q44 20 40 22 L40 40 L26 40 Q24 44 22 40 L4 40 L4 26 Q0 24 4 22Z"
              fill={["#93C5FD","#FDE68A","#BBF7D0"][i]}
              stroke="white" strokeWidth="2" opacity="0.85"/>
          </svg>
        </Float>
      ))}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
//  6. LEARN BG — ABC Explorer: aula mágica, letras y números volando
// ══════════════════════════════════════════════════════════════════════════
export function LearnBg() {
  const ABC = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const NUMS = ["1","2","3","4","5","6","7","8","9","0"];

  return (
    <div style={{ position:"absolute", inset:0, zIndex:0, overflow:"hidden",
      background:"linear-gradient(145deg, #E8F5E9 0%, #F3E5F5 35%, #FFF9C4 65%, #E3F2FD 100%)" }}>

      {/* Rainbow stripes very subtle */}
      {["#E53935","#F9A825","#43A047","#1565C0","#D81B60"].map((rc,ri)=>(
        <div key={ri} style={{
          position:"absolute", bottom:0, left:`${ri*20}%`, width:"20%", height:"6px",
          background:rc, opacity:0.35, pointerEvents:"none",
        }}/>
      ))}

      {/* Chalkboard effect area top center */}
      <div style={{
        position:"absolute", top:20, left:"50%", transform:"translateX(-50%)",
        width:500, height:160, borderRadius:24,
        background:"#1B5E20", border:"12px solid #6D4C41",
        boxShadow:"0 8px 32px rgba(0,0,0,0.2)",
        pointerEvents:"none", overflow:"hidden", opacity:0.75,
      }}>
        {/* Chalk dust */}
        <div style={{ position:"absolute", inset:0, background:"rgba(255,255,255,0.04)" }}/>
        {/* Chalk text on board */}
        <div style={{
          position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center",
          fontFamily:"'Fredoka One','Nunito',sans-serif", fontWeight:900, fontSize:36,
          color:"rgba(255,255,255,0.85)", letterSpacing:8,
          textShadow:"0 0 8px rgba(255,255,255,0.3)",
        }}>
          A B C ... Z
        </div>
        {/* Chalk ruler lines */}
        <div style={{ position:"absolute", bottom:28, left:20, right:20, height:2, background:"rgba(255,255,255,0.2)", borderRadius:1 }}/>
        <div style={{ position:"absolute", bottom:16, left:20, right:20, height:1, background:"rgba(255,255,255,0.12)", borderRadius:1 }}/>
      </div>
      {/* Chalk tray */}
      <div style={{
        position:"absolute", top:175, left:"50%", transform:"translateX(-50%)",
        width:524, height:14, borderRadius:"0 0 6px 6px",
        background:"#4E342E", pointerEvents:"none",
      }}/>

      {/* Floating ABCs */}
      {ABC.slice(0,16).map((letter,i) => (
        <motion.div key={`abc${i}`}
          style={{
            position:"absolute",
            left:`${3+i*6.1}%`,
            top:`${25+Math.sin(i*0.9)*40}%`,
            fontFamily:"'Fredoka One','Nunito',sans-serif",
            fontWeight:900,
            fontSize: i%4===0?52:i%4===1?38:i%4===2?44:32,
            color:["#E53935","#1565C0","#43A047","#F9A825","#D81B60","#00ACC1","#8E24AA","#FF7043"][i%8],
            textShadow:"0 2px 8px rgba(0,0,0,0.1)",
            userSelect:"none", pointerEvents:"none",
            opacity:0.5,
          }}
          animate={{
            y:[0,-16,0],
            rotate:[i%2===0?-6:6, i%2===0?6:-6, i%2===0?-6:6],
            opacity:[0.35, 0.65, 0.35],
          }}
          transition={{ duration:3+i*0.28, delay:i*0.18, repeat:Infinity, ease:"easeInOut" }}
        >
          {letter}
        </motion.div>
      ))}

      {/* Floating numbers */}
      {NUMS.map((num,i) => (
        <Float key={`num${i}`} x={`${8+i*9}%`} y={`${62+Math.cos(i)*18}%`}
          dy={10} duration={3.5+i*0.4} delay={i*0.3} style={{ pointerEvents:"none" }}>
          <div style={{
            width:42, height:42, borderRadius:"50%",
            background:["#FDE68A","#BBDEFB","#BBFABE","#FCA5A5","#E9D5FF"][i%5],
            display:"flex", alignItems:"center", justifyContent:"center",
            boxShadow:"0 3px 10px rgba(0,0,0,0.12)",
            border:"3px solid white",
          }}>
            <span style={{
              fontFamily:"'Fredoka One','Nunito',sans-serif",
              fontWeight:900, fontSize:20,
              color:["#F9A825","#1565C0","#43A047","#E53935","#8E24AA"][i%5],
            }}>{num}</span>
          </div>
        </Float>
      ))}

      {/* Pencils */}
      {[
        {x:40,  y:300, rotate:-35, color:"#F9A825"},
        {x:1090,y:280, rotate:28,  color:"#E53935"},
        {x:80,  y:480, rotate:15,  color:"#43A047"},
        {x:1050,y:450, rotate:-20, color:"#1565C0"},
      ].map((pen,i) => (
        <motion.div key={`pen${i}`}
          style={{ position:"absolute", left:pen.x, top:pen.y, transform:`rotate(${pen.rotate}deg)`, pointerEvents:"none" }}
          animate={{ rotate:[pen.rotate-3, pen.rotate+3, pen.rotate-3] }}
          transition={{ duration:4+i*0.5, delay:i*0.7, repeat:Infinity, ease:"easeInOut" }}>
          <svg width={18} height={90} viewBox="0 0 18 90">
            {/* Body */}
            <rect x="3" y="14" width="12" height="62" rx="2" fill={pen.color}/>
            {/* Stripe */}
            <rect x="3" y="14" width="12" height="8" rx="1" fill="rgba(255,255,255,0.4)"/>
            {/* Ferrule */}
            <rect x="3" y="76" width="12" height="6" rx="1" fill="#94A3B8"/>
            {/* Eraser */}
            <rect x="3" y="8"  width="12" height="8"  rx="2" fill="#FCA5A5"/>
            {/* Tip */}
            <path d="M3 82 L9 90 L15 82Z" fill="#FDE68A"/>
            <path d="M6 84 L9 90 L12 84Z" fill="#374151" opacity="0.7"/>
          </svg>
        </motion.div>
      ))}

      {/* Stars scattered */}
      {[
        {x:"20%",y:"78%",c:"#FCD34D",s:28},{x:"75%",y:"82%",c:"#93C5FD",s:22},
        {x:"48%",y:"88%",c:"#FCA5A5",s:26},{x:"8%",y:"55%",c:"#A7F3D0",s:20},
        {x:"90%",y:"60%",c:"#FCD34D",s:24},
      ].map((st,i)=>(
        <Float key={`st${i}`} x={st.x} y={st.y} dy={8} duration={3+i*0.6} delay={i*0.5} style={{ pointerEvents:"none" }}>
          <svg width={st.s} height={st.s} viewBox="0 0 30 30">
            <path d="M15 2 L18 11 L28 11 L20 17 L23 26 L15 20 L7 26 L10 17 L2 11 L12 11Z"
              fill={st.c} stroke="white" strokeWidth="1.5"/>
          </svg>
        </Float>
      ))}

      {/* Colorful shapes (geo) */}
      {[
        {x:1020,y:200,shape:"circle",c:"#FBCFE8",s:50},
        {x:50,  y:380,shape:"rect",  c:"#DBEAFE",s:44},
        {x:1080,y:520,shape:"tri",   c:"#D1FAE5",s:50},
      ].map((sh,i)=>(
        <Float key={`sh${i}`} x={sh.x} y={sh.y} dy={10} duration={4.5+i*0.6} delay={i*0.9} rotate={i*30} style={{ pointerEvents:"none" }}>
          <svg width={sh.s} height={sh.s} viewBox="0 0 50 50">
            {sh.shape==="circle"&&<circle cx="25" cy="25" r="22" fill={sh.c} stroke="white" strokeWidth="3"/>}
            {sh.shape==="rect"&&<rect x="4" y="4" width="42" height="42" rx="8" fill={sh.c} stroke="white" strokeWidth="3"/>}
            {sh.shape==="tri"&&<path d="M25 4 L46 44 L4 44Z" fill={sh.c} stroke="white" strokeWidth="3"/>}
          </svg>
        </Float>
      ))}
    </div>
  );
}

// ── Default export: map for convenience ──────────────────────────────────
const PageBg = { StoryBg, LibraryBg, GamesBg, WordSearchBg, PuzzleBg, LearnBg };
export default PageBg;
