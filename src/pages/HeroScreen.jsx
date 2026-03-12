/**
 * src/pages/HeroScreen.jsx — Kiddsy
 * ─────────────────────────────────────────────────────────────────────────
 * Pantalla de bienvenida con parque infantil SVG animado.
 * Ilustración y helpers SVG extraídos a HeroIllustration.jsx.
 * El logo Kiddsy.png se sirve desde /public/kiddsy-logo.png
 */
import { motion } from "framer-motion";
import { Rocket, BookOpen, Puzzle, Star } from "lucide-react";
import EmojiSvg from "../utils/EmojiSvg.jsx";
import {
  PlaygroundSVG,
  AnimatedCloud,
  LeafCluster,
  SwingSeat,
  Butterfly,
  AnimatedSun,
} from "../components/HeroIllustration.jsx";
import HeroIllustration from "../components/HeroIllustration";


const SPRING = { type: "spring", stiffness: 280, damping: 22 };

// ──────────────────────────────────────────────────────────────────────────
// Paleta pastel del parque
// ──────────────────────────────────────────────────────────────────────────
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