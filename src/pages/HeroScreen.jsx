/**
 * src/pages/HeroScreen.jsx — Kiddsy
 * ─────────────────────────────────────────────────────────────────────────
 * Pantalla de bienvenida con parque infantil SVG animado.
 * Cero imágenes externas para el background — todo código vectorial.
 * El logo Kiddsy.png se sirve desde /public/kiddsy-logo.png
 */
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Rocket, BookOpen, Puzzle, Star } from "lucide-react";
import EmojiSvg from "../utils/EmojiSvg.jsx";

const SPRING = { type: "spring", stiffness: 280, damping: 22 };

// ──────────────────────────────────────────────────────────────────────────
// Paleta pastel del parque
// ──────────────────────────────────────────────────────────────────────────
const P = {
  sky:        "#DBEAFE",   // azul cielo
  skyDeep:    "#BFDBFE",
  grass:      "#BBF7D0",   // verde pasto
  grassDeep:  "#86EFAC",
  tree:       "#4ADE80",
  treeTrunk:  "#A16207",
  slide:      "#FCA5A5",   // rojo pastel
  slideFrame: "#F87171",
  swing:      "#93C5FD",   // azul pastel
  swingRope:  "#64748B",
  cloud:      "#FFFFFF",
  cloudStroke:"#E0F2FE",
  sun:        "#FDE68A",
  sunGlow:    "#FCD34D",
  bench:      "#D97706",
  ground:     "#A7F3D0",
  shadow:     "rgba(0,0,0,0.06)",
  yellow:     "#FEF08A",
  purple:     "#E9D5FF",
};

// ──────────────────────────────────────────────────────────────────────────
// SVG PLAYGROUND BACKGROUND
// ──────────────────────────────────────────────────────────────────────────
function PlaygroundSVG() {
  return (
    <svg
      viewBox="0 0 1200 600"
      xmlns="http://www.w3.org/2000/svg"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        {/* Sky gradient */}
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={P.sky}/>
          <stop offset="100%" stopColor={P.skyDeep}/>
        </linearGradient>
        {/* Grass gradient */}
        <linearGradient id="grass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={P.grass}/>
          <stop offset="100%" stopColor={P.grassDeep}/>
        </linearGradient>
        {/* Sun glow */}
        <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor={P.sunGlow} stopOpacity="0.9"/>
          <stop offset="70%"  stopColor={P.sun}     stopOpacity="0.6"/>
          <stop offset="100%" stopColor={P.sun}     stopOpacity="0"/>
        </radialGradient>
        {/* Path shadow filter */}
        <filter id="soft">
          <feGaussianBlur stdDeviation="3" result="blur"/>
          <feComposite in="SourceGraphic" in2="blur" operator="over"/>
        </filter>
      </defs>

      {/* ── SKY ── */}
      <rect width="1200" height="600" fill="url(#sky)"/>

      {/* ── SUN ── */}
      <circle cx="980" cy="90" r="72" fill="url(#sunGlow)" opacity="0.7"/>
      <circle cx="980" cy="90" r="46" fill={P.sunGlow}/>
      {/* Sun rays */}
      {[0,30,60,90,120,150,180,210,240,270,300,330].map((a, i) => {
        const rad   = (a * Math.PI) / 180;
        const x1    = 980 + Math.cos(rad) * 52;
        const y1    = 90  + Math.sin(rad) * 52;
        const x2    = 980 + Math.cos(rad) * 68;
        const y2    = 90  + Math.sin(rad) * 68;
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={P.sunGlow} strokeWidth="5" strokeLinecap="round" opacity="0.6"/>;
      })}

      {/* ── GRASS ── */}
      <rect x="0" y="420" width="1200" height="180" fill="url(#grass)"/>
      {/* Grass bumps */}
      <ellipse cx="200" cy="421" rx="180" ry="28" fill={P.grass}/>
      <ellipse cx="600" cy="421" rx="220" ry="24" fill={P.grass}/>
      <ellipse cx="1000" cy="421" rx="190" ry="28" fill={P.grass}/>

      {/* ── PATHWAY (círculos de piedra) ── */}
      {[240,310,380,450,520].map((x,i)=>(
        <ellipse key={i} cx={x} cy="490" rx="22" ry="12" fill="rgba(255,255,255,0.45)" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5"/>
      ))}

      {/* ════ BIG TREE — LEFT ════ */}
      {/* Shadow */}
      <ellipse cx="155" cy="432" rx="48" ry="14" fill={P.shadow}/>
      {/* Trunk */}
      <rect x="140" y="330" width="30" height="104" rx="12" fill={P.treeTrunk}/>
      {/* Branch left */}
      <path d="M152 360 Q118 340 108 310" stroke={P.treeTrunk} strokeWidth="12" strokeLinecap="round" fill="none"/>
      {/* Branch right */}
      <path d="M162 370 Q196 350 208 320" stroke={P.treeTrunk} strokeWidth="10" strokeLinecap="round" fill="none"/>
      {/* Leaves — 3 layered circles for fluffy look */}
      <circle cx="155" cy="295" r="70"  fill={P.tree} opacity="0.9"/>
      <circle cx="110" cy="310" r="50"  fill={P.tree} opacity="0.85"/>
      <circle cx="200" cy="315" r="46"  fill={P.tree} opacity="0.85"/>
      <circle cx="145" cy="260" r="44"  fill="#86EFAC"/>
      <circle cx="178" cy="268" r="38"  fill="#86EFAC" opacity="0.8"/>
      {/* Leaf highlights */}
      <circle cx="130" cy="270" r="18" fill="#A7F3D0" opacity="0.55"/>
      <circle cx="170" cy="258" r="14" fill="#A7F3D0" opacity="0.45"/>

      {/* ════ SMALL TREE — RIGHT ════ */}
      <ellipse cx="1060" cy="432" rx="36" ry="12" fill={P.shadow}/>
      <rect x="1047" y="348" width="24" height="86" rx="10" fill={P.treeTrunk}/>
      <circle cx="1059" cy="318" r="52" fill={P.tree} opacity="0.9"/>
      <circle cx="1032" cy="328" r="36" fill={P.tree} opacity="0.85"/>
      <circle cx="1082" cy="326" r="34" fill={P.tree} opacity="0.85"/>
      <circle cx="1055" cy="294" r="34" fill="#86EFAC"/>
      <circle cx="1042" cy="300" r="14" fill="#A7F3D0" opacity="0.5"/>

      {/* ════ SLIDE ════ */}
      {/* Shadow */}
      <ellipse cx="720" cy="435" rx="72" ry="16" fill={P.shadow}/>
      {/* Platform tower */}
      <rect x="680" y="280" width="56" height="152" rx="10" fill={P.slideFrame}/>
      {/* Tower window */}
      <rect x="695" y="296" width="26" height="22" rx="6" fill="rgba(255,255,255,0.5)"/>
      {/* Slide ramp */}
      <path d="M680 292 L580 422" stroke={P.slide} strokeWidth="28" strokeLinecap="round"/>
      {/* Slide ramp highlight */}
      <path d="M677 296 L579 424" stroke="rgba(255,255,255,0.4)" strokeWidth="8" strokeLinecap="round"/>
      {/* Side rails */}
      <path d="M673 295 L573 418" stroke={P.slideFrame} strokeWidth="6" strokeLinecap="round"/>
      <path d="M687 290 L587 420" stroke={P.slideFrame} strokeWidth="6" strokeLinecap="round"/>
      {/* Steps */}
      {[0,1,2,3,4].map(i=>(
        <rect key={i} x="682" y={310+i*26} width="52" height="9" rx="4" fill="rgba(255,255,255,0.38)"/>
      ))}
      {/* Ladder side rails */}
      <line x1="736" y1="290" x2="736" y2="432" stroke={P.slideFrame} strokeWidth="5" strokeLinecap="round"/>
      <line x1="754" y1="290" x2="754" y2="432" stroke={P.slideFrame} strokeWidth="5" strokeLinecap="round"/>
      {/* Ladder rungs */}
      {[310,336,362,388,414].map((y,i)=>(
        <line key={i} x1="736" y1={y} x2="754" y2={y} stroke={P.slideFrame} strokeWidth="4" strokeLinecap="round"/>
      ))}

      {/* ════ SWINGS ════ */}
      {/* Top bar */}
      <rect x="840" y="240" width="240" height="14" rx="7" fill="#94A3B8"/>
      {/* Support legs */}
      <line x1="848" y1="254" x2="820" y2="432" stroke="#94A3B8" strokeWidth="8" strokeLinecap="round"/>
      <line x1="1072" y1="254" x2="1100" y2="432" stroke="#94A3B8" strokeWidth="8" strokeLinecap="round"/>
      {/* Cross braces */}
      <line x1="834" y1="350" x2="860" y2="290" stroke="#94A3B8" strokeWidth="4" strokeLinecap="round" opacity="0.5"/>
      <line x1="1086" y1="350" x2="1060" y2="290" stroke="#94A3B8" strokeWidth="4" strokeLinecap="round" opacity="0.5"/>

      {/* Swing 1 ropes + seat */}
      <line x1="892" y1="253" x2="886" y2="370" stroke={P.swingRope} strokeWidth="3.5" opacity="0.7"/>
      <line x1="928" y1="253" x2="922" y2="370" stroke={P.swingRope} strokeWidth="3.5" opacity="0.7"/>
      <rect x="880" y="368" width="50" height="16" rx="8" fill={P.swing}/>
      <rect x="880" y="368" width="50" height="16" rx="8" fill="none" stroke="white" strokeWidth="2.5"/>

      {/* Swing 2 ropes + seat */}
      <line x1="1002" y1="253" x2="996" y2="370" stroke={P.swingRope} strokeWidth="3.5" opacity="0.7"/>
      <line x1="1038" y1="253" x2="1032" y2="370" stroke={P.swingRope} strokeWidth="3.5" opacity="0.7"/>
      <rect x="990" y="368" width="50" height="16" rx="8" fill="#C4B5FD"/>
      <rect x="990" y="368" width="50" height="16" rx="8" fill="none" stroke="white" strokeWidth="2.5"/>

      {/* ════ BENCH ════ */}
      <ellipse cx="380" cy="433" rx="44" ry="10" fill={P.shadow}/>
      {/* Seat */}
      <rect x="340" y="398" width="80" height="12" rx="6" fill={P.bench}/>
      <rect x="340" y="398" width="80" height="12" rx="6" fill="none" stroke="white" strokeWidth="2"/>
      {/* Back */}
      <rect x="344" y="380" width="72" height="10" rx="5" fill={P.bench}/>
      {/* Legs */}
      <rect x="346" y="408" width="8"  height="28" rx="4" fill={P.bench}/>
      <rect x="406" y="408" width="8"  height="28" rx="4" fill={P.bench}/>

      {/* ════ FLOWERS ════ */}
      {[
        {x:280,y:426,c:"#FCA5A5",stem:"#4ADE80"},
        {x:310,y:428,c:"#FDE68A",stem:"#4ADE80"},
        {x:462,y:424,c:"#C4B5FD",stem:"#4ADE80"},
        {x:490,y:427,c:"#FCA5A5",stem:"#4ADE80"},
        {x:810,y:425,c:"#FDE68A",stem:"#4ADE80"},
        {x:840,y:428,c:"#C4B5FD",stem:"#4ADE80"},
      ].map(({x,y,c,stem},i)=>(
        <g key={i}>
          <line x1={x} y1={y} x2={x} y2={y+22} stroke={stem} strokeWidth="3" strokeLinecap="round"/>
          <circle cx={x}   cy={y}   r="7"  fill={c}/>
          <circle cx={x-7} cy={y+4} r="5"  fill={c} opacity="0.75"/>
          <circle cx={x+7} cy={y+4} r="5"  fill={c} opacity="0.75"/>
          <circle cx={x}   cy={y+10}r="5"  fill={c} opacity="0.75"/>
          <circle cx={x}   cy={y}   r="3.5"fill="white" opacity="0.7"/>
        </g>
      ))}

      {/* ════ BUTTERFLY ════ */}
      <g transform="translate(540,340)">
        <ellipse cx="-10" cy="0" rx="12" ry="8" fill="#FCA5A5" opacity="0.85" transform="rotate(-20)"/>
        <ellipse cx="10"  cy="0" rx="12" ry="8" fill="#FCA5A5" opacity="0.85" transform="rotate(20)"/>
        <ellipse cx="-8"  cy="5" rx="8"  ry="6" fill="#FDE68A" opacity="0.7"  transform="rotate(-20)"/>
        <ellipse cx="8"   cy="5" rx="8"  ry="6" fill="#FDE68A" opacity="0.7"  transform="rotate(20)"/>
        <rect x="-1.5" y="-10" width="3" height="20" rx="1.5" fill="#6B7280"/>
      </g>

      {/* ════ SMILING CLOUD 1 — animated externally ════ */}
      <g id="cloud1">
        <ellipse cx="260" cy="100" rx="75" ry="46" fill={P.cloud} opacity="0.95"/>
        <ellipse cx="210" cy="118" rx="50" ry="34" fill={P.cloud}/>
        <ellipse cx="316" cy="114" rx="46" ry="34" fill={P.cloud}/>
        <ellipse cx="260" cy="128" rx="68" ry="30" fill={P.cloud}/>
        {/* Smile */}
        <path d="M242 104 Q260 116 278 104" stroke="#BAE6FD" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
        {/* Eyes */}
        <circle cx="248" cy="96" r="4.5" fill="#BAE6FD"/>
        <circle cx="272" cy="96" r="4.5" fill="#BAE6FD"/>
      </g>

      {/* ════ SMALL CLOUD 2 — animated externally ════ */}
      <g id="cloud2">
        <ellipse cx="680" cy="70" rx="55" ry="34" fill={P.cloud} opacity="0.88"/>
        <ellipse cx="640" cy="82" rx="38" ry="26" fill={P.cloud} opacity="0.9"/>
        <ellipse cx="722" cy="80" rx="36" ry="26" fill={P.cloud} opacity="0.9"/>
        <ellipse cx="680" cy="92" rx="50" ry="22" fill={P.cloud} opacity="0.9"/>
      </g>

      {/* ════ TINY CLOUD 3 ════ */}
      <g id="cloud3">
        <ellipse cx="110" cy="60" rx="38" ry="24" fill={P.cloud} opacity="0.75"/>
        <ellipse cx="82"  cy="70" rx="26" ry="18" fill={P.cloud} opacity="0.78"/>
        <ellipse cx="138" cy="68" rx="24" ry="18" fill={P.cloud} opacity="0.78"/>
        <ellipse cx="110" cy="76" rx="34" ry="16" fill={P.cloud} opacity="0.78"/>
      </g>
    </svg>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// Animated cloud wrapper (moves horizontally with framer-motion)
// ──────────────────────────────────────────────────────────────────────────
function AnimatedCloud({ x, y, dx = 60, duration = 14, delay = 0, children }) {
  return (
    <motion.div
      style={{ position: "absolute", left: x, top: y, pointerEvents: "none" }}
      animate={{ x: [0, dx, 0] }}
      transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// Tree leaves wobble (framer-motion overlay, sits above SVG)
// ──────────────────────────────────────────────────────────────────────────
function LeafCluster({ x, y, r, color, delay = 0 }) {
  return (
    <motion.div
      style={{
        position:   "absolute",
        left:       x - r,
        top:        y - r,
        width:      r * 2,
        height:     r * 2,
        borderRadius: "50%",
        background: color,
        pointerEvents: "none",
        transformOrigin: "bottom center",
      }}
      animate={{ rotate: [-2.5, 2.5, -2.5], scaleX: [1, 1.03, 1] }}
      transition={{ duration: 3.5, delay, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

// ──────────────────────────────────────────────────────────────────────────
// Animated swing (framer-motion pendulum)
// ──────────────────────────────────────────────────────────────────────────
function SwingSeat({ style, color, delay = 0 }) {
  return (
    <motion.div
      style={{
        position: "absolute",
        ...style,
        transformOrigin: "top center",
        pointerEvents: "none",
      }}
      animate={{ rotate: [-14, 14, -14] }}
      transition={{ duration: 2.6, delay, repeat: Infinity, ease: "easeInOut" }}
    >
      {/* Ropes */}
      <div style={{
        display: "flex", justifyContent: "space-between", width: 50,
        height: 118, paddingBottom: 0,
      }}>
        <div style={{ width: 3, background: "#94A3B8", borderRadius: 2 }}/>
        <div style={{ width: 3, background: "#94A3B8", borderRadius: 2 }}/>
      </div>
      {/* Seat */}
      <div style={{
        width: 50, height: 14,
        background: color,
        borderRadius: 8,
        border: "2.5px solid white",
        boxShadow: "0 3px 10px rgba(0,0,0,0.12)",
        marginTop: -2,
      }}/>
    </motion.div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// Butterfly flutter
// ──────────────────────────────────────────────────────────────────────────
function Butterfly({ x, y }) {
  return (
    <motion.div
      style={{ position: "absolute", left: x, top: y, pointerEvents: "none" }}
      animate={{ y: [-8, 8, -8], x: [0, 18, 0], rotate: [-5, 5, -5] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    >
      <svg viewBox="0 0 40 30" width={40} height={30}>
        <ellipse cx="12" cy="12" rx="11" ry="8"  fill="#FCA5A5" opacity="0.88" transform="rotate(-20 12 12)"/>
        <ellipse cx="28" cy="12" rx="11" ry="8"  fill="#FCA5A5" opacity="0.88" transform="rotate(20 28 12)"/>
        <ellipse cx="14" cy="18" rx="8"  ry="6"  fill="#FDE68A" opacity="0.75" transform="rotate(-20 14 18)"/>
        <ellipse cx="26" cy="18" rx="8"  ry="6"  fill="#FDE68A" opacity="0.75" transform="rotate(20 26 18)"/>
        <rect x="19" y="6" width="2.5" height="18" rx="1.5" fill="#6B7280"/>
      </svg>
    </motion.div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// Sun spin
// ──────────────────────────────────────────────────────────────────────────
function AnimatedSun({ x, y }) {
  return (
    <motion.div
      style={{ position: "absolute", left: x, top: y, pointerEvents: "none" }}
      animate={{ rotate: [0, 360] }}
      transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
    >
      <svg viewBox="0 0 140 140" width={140} height={140}>
        {[0,30,60,90,120,150,180,210,240,270,300,330].map((a,i)=>{
          const rad = a * Math.PI / 180;
          return (
            <line key={i}
              x1={70 + Math.cos(rad)*52} y1={70 + Math.sin(rad)*52}
              x2={70 + Math.cos(rad)*68} y2={70 + Math.sin(rad)*68}
              stroke="#FCD34D" strokeWidth="5" strokeLinecap="round" opacity="0.65"
            />
          );
        })}
        <circle cx="70" cy="70" r="30" fill="#FDE68A" opacity="0.85"/>
        <circle cx="70" cy="70" r="22" fill="#FCD34D"/>
      </svg>
    </motion.div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// Feature badges (below hero CTA)
// ──────────────────────────────────────────────────────────────────────────
const BADGES = [
  { icon: BookOpen, label: "Unlimited Stories",   color: "#1565C0", bg: "#DBEAFE" },
  { icon: Puzzle,   label: "Fun Games",    color: "#D81B60", bg: "#FCE7F3" },
  { icon: Star,     label: "16 Languages",  color: "#F9A825", bg: "#FFFDE7" },
];

// ──────────────────────────────────────────────────────────────────────────
// MAIN HERO SCREEN
// ──────────────────────────────────────────────────────────────────────────
export default function HeroScreen({ onPlay }) {
  return (
    <div style={{
      position:   "relative",
      minHeight:  "100vh",
      overflow:   "hidden",
      display:    "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#FFF9C4",
      zIndex: 1,
    }}>

      {/* ── PLAYGROUND BACKGROUND (pure SVG, fills whole screen) ── */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <PlaygroundSVG/>

        {/* Animated overlays using framer-motion — same positions as SVG elements */}

        {/* Spinning sun (covers the static SVG sun) */}
        <AnimatedSun x={910} y={20}/>

        {/* Clouds drifting */}
        <AnimatedCloud x={140} y={50}  dx={55}  duration={18} delay={0}>
          <svg viewBox="0 0 260 120" width={260} height={120}>
            <ellipse cx="130" cy="52" rx="80" ry="50" fill="white" opacity="0.95"/>
            <ellipse cx="80"  cy="68" rx="55" ry="38" fill="white"/>
            <ellipse cx="184" cy="66" rx="50" ry="38" fill="white"/>
            <ellipse cx="130" cy="78" rx="72" ry="32" fill="white"/>
            <path d="M112 46 Q130 60 148 46" stroke="#BAE6FD" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
            <circle cx="116" cy="38" r="5"   fill="#BAE6FD"/>
            <circle cx="144" cy="38" r="5"   fill="#BAE6FD"/>
          </svg>
        </AnimatedCloud>

        <AnimatedCloud x={540} y={32}  dx={40}  duration={22} delay={4}>
          <svg viewBox="0 0 200 90" width={200} height={90}>
            <ellipse cx="100" cy="44" rx="62" ry="38" fill="white" opacity="0.9"/>
            <ellipse cx="58"  cy="56" rx="44" ry="30" fill="white" opacity="0.92"/>
            <ellipse cx="144" cy="54" rx="40" ry="28" fill="white" opacity="0.92"/>
            <ellipse cx="100" cy="62" rx="56" ry="24" fill="white" opacity="0.92"/>
          </svg>
        </AnimatedCloud>

        <AnimatedCloud x={820} y={20}  dx={30}  duration={26} delay={8}>
          <svg viewBox="0 0 160 72" width={160} height={72}>
            <ellipse cx="80"  cy="36" rx="50" ry="30" fill="white" opacity="0.85"/>
            <ellipse cx="46"  cy="46" rx="36" ry="24" fill="white" opacity="0.87"/>
            <ellipse cx="114" cy="44" rx="32" ry="22" fill="white" opacity="0.87"/>
            <ellipse cx="80"  cy="52" rx="44" ry="18" fill="white" opacity="0.87"/>
          </svg>
        </AnimatedCloud>

        {/* Wobbling tree leaves — big tree left */}
        <LeafCluster x={155} y={295} r={70}  color="#4ADE80" delay={0}/>
        <LeafCluster x={110} y={310} r={50}  color="#4ADE80" delay={0.6}/>
        <LeafCluster x={200} y={315} r={46}  color="#4ADE80" delay={1.1}/>
        <LeafCluster x={145} y={260} r={44}  color="#86EFAC" delay={0.3}/>
        <LeafCluster x={178} y={268} r={38}  color="#86EFAC" delay={0.9}/>

        {/* Wobbling tree leaves — small tree right */}
        <LeafCluster x={1059} y={318} r={52}  color="#4ADE80" delay={0.4}/>
        <LeafCluster x={1032} y={328} r={36}  color="#4ADE80" delay={1.2}/>
        <LeafCluster x={1082} y={326} r={34}  color="#4ADE80" delay={0.8}/>
        <LeafCluster x={1055} y={294} r={34}  color="#86EFAC" delay={0.2}/>

        {/* Animated swings */}
        <SwingSeat
          style={{ left: 842, top: 254, width: 50 }}
          color="#93C5FD"
          delay={0}
        />
        <SwingSeat
          style={{ left: 952, top: 254, width: 50 }}
          color="#C4B5FD"
          delay={0.7}
        />

        {/* Butterfly */}
        <Butterfly x={490} y={305}/>

      </div>

      {/* ── HERO CONTENT (above playground) ── */}
      <div style={{
        position:       "relative",
        zIndex:         10,
        display:        "flex",
        flexDirection:  "column",
        alignItems:     "center",
        justifyContent: "center",
        padding:        "40px 24px 80px",
        maxWidth:       640,
        textAlign:      "center",
      }}>

        {/* ─ Logo ─ */}
        <motion.div
          initial={{ scale: 0.4, opacity: 0, rotate: -12 }}
          animate={{ scale: 1,   opacity: 1, rotate: 0   }}
          transition={{ type: "spring", stiffness: 180, damping: 16, delay: 0.1 }}
          style={{ marginBottom: 8 }}
        >
          {/* Glow ring behind logo */}
          <motion.div
            animate={{ scale: [1, 1.08, 1], opacity: [0.5, 0.85, 0.5] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            style={{
              position:     "absolute",
              inset:        -16,
              borderRadius: "50%",
              background:   "radial-gradient(circle,rgba(99,179,237,0.40) 0%,transparent 72%)",
              pointerEvents:"none",
            }}
          />
          <img
            src="/kiddsy-logo.png"
            alt="Kiddsy"
            style={{
              width:      180,
              height:     180,
              objectFit:  "contain",
              position:   "relative",
              filter:     "drop-shadow(0 12px 32px rgba(21,101,192,0.35))",
            }}
          />
        </motion.div>

        {/* ─ Tagline ─ */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0  }}
          transition={{ delay: 0.45, ...SPRING }}
        >
          <div style={{
            display:        "inline-block",
            background:     "rgba(255,255,255,0.88)",
            backdropFilter: "blur(10px)",
            borderRadius:   999,
            padding:        "6px 20px",
            marginBottom:   18,
            border:         "2px solid rgba(255,255,255,0.95)",
            boxShadow:      "0 4px 16px rgba(21,101,192,0.15)",
          }}>
            <span style={{ fontFamily:"var(--font-display,'Nunito',sans-serif)", fontSize:13, color:"#1565C0", fontWeight:700, letterSpacing:"0.04em" }}>
              <EmojiSvg code="2728" size={12} /> FREE · No Login Required
            </span>
          </div>
          <h1 style={{
            fontFamily:  "var(--font-display,'Nunito',sans-serif)",
            fontSize:    "clamp(28px, 5vw, 44px)",
            fontWeight:  900,
            lineHeight:  1.18,
            color:       "#0F3460",
            marginBottom: 12,
            textShadow:  "0 2px 12px rgba(21,101,192,0.18)",
          }}>
            Welcome to your<br/>
            <span style={{ color:"#1565C0" }}>bilingual adventure!</span>
          </h1>
          <p style={{
            fontFamily:  "var(--font-body,'Nunito',sans-serif)",
            fontSize:    "clamp(15px, 2.5vw, 18px)",
            color:       "#334155",
            marginBottom: 32,
            lineHeight:  1.6,
          }}>
            Magical bilingual stories and games in 16 global languages
          </p>
        </motion.div>

        {/* ─ LET'S PLAY BUTTON ─ */}
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1,   opacity: 1 }}
          transition={{ delay: 0.65, type:"spring", stiffness:240, damping:14 }}
        >
          <motion.button
            onClick={onPlay}
            whileHover={{ scale: 1.07, y: -5 }}
            whileTap={{   scale: 0.94 }}
            transition={{ type:"spring", stiffness:400, damping:14 }}
            style={{
              position:     "relative",
              display:      "inline-flex",
              alignItems:   "center",
              gap:          14,
              padding:      "18px 46px",
              borderRadius: 999,
              border:       "5px solid white",
              background:   "linear-gradient(135deg, #F97316 0%, #F59E0B 40%, #EAB308 80%, #84CC16 100%)",
              color:        "white",
              fontFamily:   "var(--font-display,'Nunito',sans-serif)",
              fontSize:     "clamp(20px, 4vw, 26px)",
              fontWeight:   900,
              cursor:       "pointer",
              boxShadow:    "0 0 0 4px rgba(249,115,22,0.35), 0 16px 48px rgba(249,115,22,0.45), inset 0 1px 0 rgba(255,255,255,0.30)",
              letterSpacing:"0.01em",
              textShadow:   "0 2px 6px rgba(0,0,0,0.18)",
              overflow:     "hidden",
            }}
          >
            {/* Pulse ring animation */}
            <motion.div
              animate={{ scale: [1, 1.6, 1], opacity: [0.4, 0, 0.4] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
              style={{
                position:   "absolute",
                inset:      -4,
                borderRadius: 999,
                border:     "4px solid rgba(249,115,22,0.55)",
                pointerEvents:"none",
              }}
            />
            <Rocket size={28} strokeWidth={2.5} style={{ filter:"drop-shadow(0 2px 4px rgba(0,0,0,0.2))" }}/>
            Let's Play! <EmojiSvg code="1f680" size={28} />
          </motion.button>
        </motion.div>

        {/* ─ Feature badges ─ */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0  }}
          transition={{ delay: 0.85, ...SPRING }}
          style={{ display:"flex", gap:12, marginTop:28, flexWrap:"wrap", justifyContent:"center" }}
        >
          {BADGES.map((b, i) => {
            const Icon = b.icon;
            return (
              <motion.div
                key={i}
                whileHover={{ scale: 1.1, y: -3, rotate: [-2, 2, 0] }}
                transition={{ type:"spring", stiffness:400, damping:14 }}
                style={{
                  display:        "flex",
                  alignItems:     "center",
                  gap:            8,
                  padding:        "8px 16px",
                  borderRadius:   999,
                  background:     b.bg,
                  border:         "3px solid white",
                  boxShadow:      `0 4px 14px ${b.color}28, inset 0 1px 0 rgba(255,255,255,0.6)`,
                  cursor:         "pointer",
                }}
              >
                <Icon size={16} color={b.color} strokeWidth={2.3}/>
                <span style={{
                  fontFamily: "var(--font-display,'Nunito',sans-serif)",
                  fontWeight: 700,
                  fontSize:   13,
                  color:      b.color,
                }}>{b.label}</span>
              </motion.div>
            );
          })}
        </motion.div>

        {/* ─ Auth hint ─ */}
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          style={{
            marginTop:   20,
            fontFamily:  "var(--font-body,'Nunito',sans-serif)",
            fontSize:    12,
            color:       "rgba(51,65,85,0.6)",
          }}
        >
          Create an account to save stories to your library • Optional
        </motion.p>
      </div>
    </div>
  );
}