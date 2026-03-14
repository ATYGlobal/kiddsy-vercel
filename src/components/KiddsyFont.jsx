/**
 * src/components/KiddsyFont.jsx — Kiddsy
 * ─────────────────────────────────────────────────────────────────────────
 * Sistema de fuentes SVG para niños 3-10 años.
 *
 * EXPORTS:
 *   BubbleTitle   — título grande con efecto burbuja + bounce al montar
 *   CardTitle     — subtítulo para cards, misma estética, más pequeño
 *   RainbowTitle  — cada letra en un color diferente, ideal para secciones lúdicas
 *   StickerText   — texto estilo pegatina: borde blanco grueso sobre cualquier fondo
 *
 * USO:
 *   import { BubbleTitle, CardTitle, RainbowTitle, StickerText } from "../components/KiddsyFont";
 *
 *   <BubbleTitle color="#1565C0" size={48}>My Library</BubbleTitle>
 *   <CardTitle color="#43A047" size={28}>3 stories found</CardTitle>
 *   <RainbowTitle size={52}>Play & Learn</RainbowTitle>
 *   <StickerText color="#FFF" size={36}>Word Hunt</StickerText>
 * ─────────────────────────────────────────────────────────────────────────
 */
import { motion } from "framer-motion";
import { C } from "../utils/designConfig.js";
// ── Font face injection (loads once) ─────────────────────────────────────
const FONT_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Baloo+2:wght@700;800&display=swap');
  :root {
    --font-kids:    'Fredoka One', 'Baloo 2', 'Nunito', ui-rounded, sans-serif;
    --font-display: 'Baloo 2', 'Nunito', ui-rounded, sans-serif;
  }
`;

let _fontInjected = false;
function injectFont() {
  if (_fontInjected || typeof document === "undefined") return;
  const s = document.createElement("style");
  s.textContent = FONT_CSS;
  document.head.appendChild(s);
  _fontInjected = true;
}

// ── Shared SVG helpers ────────────────────────────────────────────────────
const RAINBOW = ["#E53935","#F9A825","#43A047","#1565C0","#D81B60","#00ACC1"];

function getRainbowColor(i) {
  return RAINBOW[i % RAINBOW.length];
}

// Estimates SVG viewBox width from text + font size
function estimateWidth(text, size) {
  // Fredoka One is wide — ~0.62 em per char avg
  return Math.max(80, text.length * size * 0.62 + size * 0.8);
}

// ══════════════════════════════════════════════════════════════════════════
// BubbleTitle
// Efecto burbuja: trazo exterior blanco grueso + relleno color + brillo interior
// Rebota al montar, tembladera suave en loop
// ══════════════════════════════════════════════════════════════════════════
export function BubbleTitle({
  children,
  color    = "#1565C0",
  size     = 44,
  wobble   = true,
  className = "",
  style    = {},
}) {
  injectFont();
  const text  = String(children);
  const w     = estimateWidth(text, size);
  const h     = size * 1.6;
  const cy    = h * 0.72;

  // Derive a slightly lighter tint for the inner highlight
  const highlight = color + "CC";

  return (
    <motion.span
      className={className}
      style={{ display: "inline-block", lineHeight: 1, ...style }}
      initial={{ scale: 0.7, opacity: 0 }}
      animate={{ scale: 1,   opacity: 1 }}
      transition={{ type: "spring", stiffness: 380, damping: 18, delay: 0.05 }}
    >
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        width={w}
        height={h}
        viewBox={`0 0 ${w} ${h}`}
        style={{ display: "block", maxWidth: "100%", overflow: "visible" }}
        animate={wobble ? { rotate: [-0.8, 0.8, -0.8] } : undefined}
        transition={wobble ? { duration: 4, repeat: Infinity, ease: "easeInOut" } : undefined}
      >
        <defs>
          {/* Drop shadow for depth */}
          <filter id={`bubble-shadow-${size}`} x="-10%" y="-10%" width="120%" height="130%">
            <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor={color} floodOpacity="0.28"/>
          </filter>
          {/* Inner glow / highlight */}
          <filter id={`bubble-glow-${size}`}>
            <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur"/>
            <feFlood floodColor="white" floodOpacity="0.55" result="white"/>
            <feComposite in="white" in2="blur" operator="in" result="glow"/>
            <feMerge>
              <feMergeNode in="SourceGraphic"/>
              <feMergeNode in="glow"/>
            </feMerge>
          </filter>
        </defs>

        {/* ── Layer 1: thick outer white stroke (borde burbuja) ── */}
        <text
          x="50%" y={cy}
          textAnchor="middle" dominantBaseline="middle"
          fontFamily="'Fredoka One','Baloo 2','Nunito',ui-rounded,sans-serif"
          fontWeight="900" fontSize={size}
          fill="none"
          stroke="white"
          strokeWidth={size * 0.22}
          strokeLinejoin="round"
          strokeLinecap="round"
          paintOrder="stroke"
        >{text}</text>

        {/* ── Layer 2: colored fill + drop shadow ── */}
        <text
          x="50%" y={cy}
          textAnchor="middle" dominantBaseline="middle"
          fontFamily="'Fredoka One','Baloo 2','Nunito',ui-rounded,sans-serif"
          fontWeight="900" fontSize={size}
          fill={color}
          stroke="none"
          filter={`url(#bubble-shadow-${size})`}
        >{text}</text>

        {/* ── Layer 3: top-left highlight shimmer ── */}
        <text
          x="50%" y={cy}
          textAnchor="middle" dominantBaseline="middle"
          fontFamily="'Fredoka One','Baloo 2','Nunito',ui-rounded,sans-serif"
          fontWeight="900" fontSize={size}
          fill="none"
          stroke="rgba(255,255,255,0.42)"
          strokeWidth={size * 0.07}
          strokeLinejoin="round"
          strokeDasharray={`${size * 0.6} ${size * 8}`}
          strokeDashoffset={`-${size * 0.1}`}
        >{text}</text>
      </motion.svg>
    </motion.span>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// CardTitle — versión compacta para dentro de cards y secciones
// ══════════════════════════════════════════════════════════════════════════
export function CardTitle({
  children,
  color  = "#1565C0",
  size   = 26,
  className = "",
  style  = {},
}) {
  injectFont();
  const text = String(children);
  const w    = estimateWidth(text, size);
  const h    = size * 1.55;
  const cy   = h * 0.70;

  return (
    <span
      className={className}
      style={{ display: "inline-block", lineHeight: 1, ...style }}
      aria-label={text}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={w} height={h}
        viewBox={`0 0 ${w} ${h}`}
        style={{ display: "block", maxWidth: "100%", overflow: "visible" }}
      >
        <defs>
          <filter id={`card-shadow-${size}`}>
            <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodColor={color} floodOpacity="0.22"/>
          </filter>
        </defs>

        {/* White stroke */}
        <text
          x="50%" y={cy} textAnchor="middle" dominantBaseline="middle"
          fontFamily="'Fredoka One','Baloo 2','Nunito',ui-rounded,sans-serif"
          fontWeight="900" fontSize={size}
          fill="none" stroke="white"
          strokeWidth={size * 0.18} strokeLinejoin="round" paintOrder="stroke"
        >{text}</text>

        {/* Colored fill */}
        <text
          x="50%" y={cy} textAnchor="middle" dominantBaseline="middle"
          fontFamily="'Fredoka One','Baloo 2','Nunito',ui-rounded,sans-serif"
          fontWeight="900" fontSize={size}
          fill={color} stroke="none"
          filter={`url(#card-shadow-${size})`}
        >{text}</text>
      </svg>
    </span>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// RainbowTitle — cada letra en un color diferente del arco iris
// Ideal para títulos de sección muy lúdicos
// ══════════════════════════════════════════════════════════════════════════
export function RainbowTitle({
  children,
  size   = 48,
  wobble = true,
  className = "",
  style  = {},
}) {
  injectFont();
  const text  = String(children);
  const w     = estimateWidth(text, size);
  const h     = size * 1.65;
  const cy    = h * 0.72;

  // Approximate char widths for letter positioning
  const charW = size * 0.59;

  return (
    <motion.span
      className={className}
      style={{ display: "inline-block", lineHeight: 1, ...style }}
      initial={{ scale: 0.75, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 340, damping: 16 }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={w} height={h}
        viewBox={`0 0 ${w} ${h}`}
        style={{ display: "block", maxWidth: "100%", overflow: "visible" }}
      >
        <defs>
          <filter id="rainbow-shadow">
            <feDropShadow dx="0" dy="2.5" stdDeviation="2.5" floodColor="rgba(0,0,0,0.18)"/>
          </filter>
        </defs>

        {/* Render the whole word for correct spacing, then overlay per-letter color patches */}
        {/* Base: white stroke for full word */}
        <text
          x="50%" y={cy} textAnchor="middle" dominantBaseline="middle"
          fontFamily="'Fredoka One','Baloo 2','Nunito',ui-rounded,sans-serif"
          fontWeight="900" fontSize={size}
          fill="none" stroke="white"
          strokeWidth={size * 0.22} strokeLinejoin="round" paintOrder="stroke"
        >{text}</text>

        {/* Colored fill: one tspan per letter */}
        <text
          x="50%" y={cy} textAnchor="middle" dominantBaseline="middle"
          fontFamily="'Fredoka One','Baloo 2','Nunito',ui-rounded,sans-serif"
          fontWeight="900" fontSize={size}
          fill="none" stroke="none"
          filter="url(#rainbow-shadow)"
        >
          {/* We use a full-word render but split into tspans with alternating colors */}
          {/* Since tspan x positioning is tricky in SVG, we use a simpler approach: */}
          {/* render colored text characters using individual tspans with dy=0 */}
          {text.split("").map((ch, i) => (
            <tspan
              key={i}
              fill={getRainbowColor(i)}
              dy="0"
            >{ch}</tspan>
          ))}
        </text>

        {/* Highlight shimmer overlay */}
        <text
          x="50%" y={cy} textAnchor="middle" dominantBaseline="middle"
          fontFamily="'Fredoka One','Baloo 2','Nunito',ui-rounded,sans-serif"
          fontWeight="900" fontSize={size}
          fill="none"
          stroke="rgba(255,255,255,0.35)"
          strokeWidth={size * 0.06}
          strokeLinejoin="round"
        >{text}</text>
      </svg>
    </motion.span>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// StickerText — estilo pegatina: borde blanco muy grueso, sin sombra compleja
// Perfecto sobre fondos de colores intensos o fotos
// ══════════════════════════════════════════════════════════════════════════
export function StickerText({
  children,
  color  = "#FFFFFF",
  size   = 36,
  className = "",
  style  = {},
}) {
  injectFont();
  const text = String(children);
  const w    = estimateWidth(text, size);
  const h    = size * 1.52;
  const cy   = h * 0.70;

  return (
    <span
      className={className}
      style={{ display: "inline-block", lineHeight: 1, ...style }}
      aria-label={text}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={w} height={h}
        viewBox={`0 0 ${w} ${h}`}
        style={{ display: "block", maxWidth: "100%", overflow: "visible" }}
      >
        {/* Outer border — very thick white */}
        <text
          x="50%" y={cy} textAnchor="middle" dominantBaseline="middle"
          fontFamily="'Fredoka One','Baloo 2','Nunito',ui-rounded,sans-serif"
          fontWeight="900" fontSize={size}
          fill="none" stroke="white"
          strokeWidth={size * 0.28} strokeLinejoin="round" strokeLinecap="round"
          paintOrder="stroke"
        >{text}</text>

        {/* Thin dark border inside */}
        <text
          x="50%" y={cy} textAnchor="middle" dominantBaseline="middle"
          fontFamily="'Fredoka One','Baloo 2','Nunito',ui-rounded,sans-serif"
          fontWeight="900" fontSize={size}
          fill="none" stroke="rgba(0,0,0,0.12)"
          strokeWidth={size * 0.10} strokeLinejoin="round"
        >{text}</text>

        {/* Fill */}
        <text
          x="50%" y={cy} textAnchor="middle" dominantBaseline="middle"
          fontFamily="'Fredoka One','Baloo 2','Nunito',ui-rounded,sans-serif"
          fontWeight="900" fontSize={size}
          fill={color}
        >{text}</text>
      </svg>
    </span>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// Default export: objeto con todos los componentes para import conveniente
// ══════════════════════════════════════════════════════════════════════════
const KiddsyFont = { BubbleTitle, CardTitle, RainbowTitle, StickerText };
export default KiddsyFont;
