/**
 * src/components/KiddsyLogo.jsx
 * Rebranded logo component — name is now just "Kiddsy"
 *
 * Props:
 *   size   : "sm" | "md" | "lg" | "xl"
 *   variant: "full" (icon + text) | "text" (text only) | "icon" (icon only)
 *   animate: boolean — whether the icon wobbles on hover
 *
 * Usage:
 *   import KiddsyLogo from "./components/KiddsyLogo.jsx";
 *   <KiddsyLogo size="md" />
 *   <KiddsyLogo size="lg" variant="icon" />
 *
 * To use your real logo PNG, uncomment the <img> tag and comment out
 * the letter-based placeholder.
 */

// import logoUrl from "../assets/Kiddsy_Loop_Logo.png";

import { motion } from "framer-motion";
import EmojiSvg from "../utils/EmojiSvg.jsx";

const C = {
  blue:    "#1565C0",
  blueSoft:"#E3F2FD",
  red:     "#E53935",
  yellow:  "#F9A825",
};

const SIZE_MAP = {
  sm: { icon: "w-8 h-8 rounded-xl",  text: "text-xl",  sub: "text-xs"  },
  md: { icon: "w-12 h-12 rounded-2xl", text: "text-2xl", sub: "text-xs"  },
  lg: { icon: "w-16 h-16 rounded-3xl", text: "text-4xl", sub: "text-sm"  },
  xl: { icon: "w-24 h-24 rounded-3xl", text: "text-6xl", sub: "text-base"},
};

export default function KiddsyLogo({
  size = "md",
  variant = "full",
  animate = true,
  showTagline = false,
  className = "",
}) {
  const s = SIZE_MAP[size] ?? SIZE_MAP.md;

  const iconEl = (
    <motion.div
      whileHover={animate ? { rotate: [-4, 4, 0], scale: 1.08 } : {}}
      transition={{ duration: 0.4 }}
      className={`${s.icon} overflow-hidden shadow-md border-2 flex items-center justify-center flex-shrink-0`}
      style={{ borderColor: C.yellow, background: C.blueSoft }}
    >
      {/*
        ── OPTION A: Real logo PNG (recommended for production) ──────────────
        Uncomment the line below and comment out the letter spans.
        Make sure Kiddsy_Loop_Logo.png is in src/assets/

        <img src={logoUrl} alt="Kiddsy" className="w-full h-full object-contain p-0.5" />
      */}

      {/* ── OPTION B: Letter placeholder (default) ── */}
      <span className="font-display text-[55%] leading-none font-bold" style={{ color: C.blue }}>K</span>
    </motion.div>
  );

  const textEl = (
    <div className="leading-none">
      {/* App name — "Kiddsy" only (no "Loop") */}
      <div className={`font-display ${s.text} leading-none`}>
        <span style={{ color: C.blue }}>Kid</span>
        <span style={{ color: C.red }}>dsy</span>
      </div>
      {showTagline && (
        <span className={`font-body ${s.sub} text-slate-400 block mt-0.5`}>
          Learning together <EmojiSvg code="2728" size={12} />
        </span>
      )}
    </div>
  );

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {(variant === "full" || variant === "icon") && iconEl}
      {(variant === "full" || variant === "text") && textEl}
    </div>
  );
}