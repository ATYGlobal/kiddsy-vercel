/**
 * src/components/KiddsyIcons.jsx — Kiddsy
 * ─────────────────────────────────────────────────────────────────────────
 * Zero-dependency vector icon system. No external images.
 *
 * Exports:
 *  FlagImg              — crisp flag <img> via flagcdn.com
 *  detectLang()         — reads navigator.language → supported lang code (default "es")
 *  WORD_SEARCH_LANGS    — language list for WordSearch dropdown
 *  StickerBadge         — wraps any Lucide icon in sticker style + spring bounce
 *  Svg* (8 components)  — hand-crafted SVG cartoon characters
 *  ANIMAL_CONFIGS       — 25 animals → { Render, color, bg }
 *  CATEGORY_TILES       — 25 icon tiles per category (animals/fruits/space/tools)
 *  STORY_ICON_MAP       — emoji → { Icon, gradient } for story covers
 *  StoryCoverIcon       — ready-to-use story cover badge
 *  GameStickerTile      — tile for sliding puzzle + memory match games
 */

import { motion } from "framer-motion";
import {
  Cat, Fish, Bird, Feather, Bug, Zap, Waves, Heart, Moon, Star,
  Leaf, Sun, Flower2, TreePine, Shield, Footprints, Anchor,
  Globe, Eye, Music, Hammer, Wrench, Rocket, Sparkles,
  GraduationCap, BookOpen, ShoppingBag, Bus, Activity, Wand2, Puzzle,
} from "lucide-react";
import { C } from "../utils/designConfig.js";

// ─── Sticker spring animation ─────────────────────────────────────────────
const SPRING = { type: "spring", stiffness: 420, damping: 14 };

// ══════════════════════════════════════════════════════════════════════════
// 1. StickerBadge — universal wrapper
// ══════════════════════════════════════════════════════════════════════════
export function StickerBadge({
  icon: Icon,
  color,
  size    = 48,
  bg,
  shape   = "circle",   // "circle" | "rounded"
  noHover = false,
  style   = {},
}) {
  const br  = shape === "circle" ? "50%" : `${Math.round(size * 0.28)}px`;
  const bw  = Math.max(2.5, Math.round(size * 0.065));
  const ico = Math.round(size * 0.48);
  const bgFill = bg ?? color + "22";

  const shell = (
    <div style={{
      width:          size,
      height:         size,
      flexShrink:     0,
      background:     bgFill,
      borderRadius:   br,
      border:         `${bw}px solid white`,
      boxShadow:      `0 ${Math.round(size*.10)}px ${Math.round(size*.35)}px ${color}44,
                       inset 0 1px 0 rgba(255,255,255,0.55)`,
      display:        "flex",
      alignItems:     "center",
      justifyContent: "center",
      ...style,
    }}>
      <Icon size={ico} color={color} strokeWidth={2.2} />
    </div>
  );

  if (noHover) return shell;

  return (
    <motion.div
      whileHover={{ scale: 1.14, y: -4, rotate: [-3, 3, 0] }}
      whileTap={{ scale: 0.91 }}
      transition={SPRING}
      style={{ display: "inline-flex", cursor: "pointer" }}
    >
      {shell}
    </motion.div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// 2. HAND-CRAFTED SVG ANIMALS (8 characters)
// ══════════════════════════════════════════════════════════════════════════
// All viewBox="0 0 120 120", accept { size, color }
// White outlines use stroke="white" strokeWidth="3" for the sticker border effect

export function SvgLion({ size = 120, color = "#F9A825" }) {
  const dk = "#E65100"; const W = "white"; const BK = "#2d1400";
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} overflow="visible">
      {/* Mane rays */}
      {[0,45,90,135,180,225,270,315].map((a,i)=>(
        <line key={i} x1="60" y1="60"
          x2={60+Math.cos(a*Math.PI/180)*50} y2={60+Math.sin(a*Math.PI/180)*50}
          stroke={color} strokeWidth="14" strokeLinecap="round" opacity="0.45"
        />
      ))}
      {/* Face */}
      <circle cx="60" cy="60" r="35" fill={color} stroke={W} strokeWidth="3.5"/>
      {/* Ears */}
      <circle cx="26" cy="28" r="13" fill={color} stroke={W} strokeWidth="3"/>
      <circle cx="94" cy="28" r="13" fill={color} stroke={W} strokeWidth="3"/>
      {/* Inner ear */}
      <circle cx="26" cy="28" r="6" fill={dk} opacity=".5"/>
      <circle cx="94" cy="28" r="6" fill={dk} opacity=".5"/>
      {/* Snout */}
      <ellipse cx="60" cy="71" rx="16" ry="11" fill={dk} opacity=".25"/>
      {/* Eyes */}
      <circle cx="46" cy="55" r="9" fill={W}/>
      <circle cx="74" cy="55" r="9" fill={W}/>
      <circle cx="47" cy="56" r="5.5" fill={BK}/>
      <circle cx="75" cy="56" r="5.5" fill={BK}/>
      <circle cx="45" cy="54" r="2" fill={W}/>
      <circle cx="73" cy="54" r="2" fill={W}/>
      {/* Nose */}
      <ellipse cx="60" cy="67" rx="5.5" ry="4" fill={dk}/>
      {/* Smile */}
      <path d="M52 73 Q57 78 60 76 Q63 78 68 73" stroke={dk} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      {/* Whisker dots */}
      <circle cx="40" cy="69" r="2" fill={dk} opacity=".5"/>
      <circle cx="36" cy="65" r="2" fill={dk} opacity=".5"/>
      <circle cx="80" cy="69" r="2" fill={dk} opacity=".5"/>
      <circle cx="84" cy="65" r="2" fill={dk} opacity=".5"/>
    </svg>
  );
}

export function SvgElephant({ size = 120, color = "#90A4AE" }) {
  const dk = "#546E7A"; const W = "white";
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} overflow="visible">
      {/* Body */}
      <ellipse cx="60" cy="85" rx="42" ry="34" fill={color} stroke={W} strokeWidth="3.5"/>
      {/* Big ears */}
      <ellipse cx="16" cy="64" rx="18" ry="28" fill={color} opacity=".65" stroke={W} strokeWidth="2.5"/>
      <ellipse cx="104" cy="64" rx="18" ry="28" fill={color} opacity=".65" stroke={W} strokeWidth="2.5"/>
      {/* Inner ear */}
      <ellipse cx="16" cy="64" rx="10" ry="18" fill={dk} opacity=".25"/>
      <ellipse cx="104" cy="64" rx="10" ry="18" fill={dk} opacity=".25"/>
      {/* Head */}
      <circle cx="60" cy="44" r="30" fill={color} stroke={W} strokeWidth="3.5"/>
      {/* Trunk */}
      <path d="M68 64 Q84 78 78 96 Q74 106 62 102" stroke={color} strokeWidth="13" strokeLinecap="round" fill="none"/>
      <path d="M68 64 Q84 78 78 96 Q74 106 62 102" stroke={W} strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      {/* Tusk */}
      <path d="M46 64 Q32 74 30 88" stroke="#FFFDE7" strokeWidth="5.5" strokeLinecap="round" fill="none"/>
      {/* Eye */}
      <circle cx="46" cy="38" r="7" fill={W}/>
      <circle cx="47" cy="39" r="4" fill="#1a1a1a"/>
      <circle cx="45.5" cy="37.5" r="1.5" fill={W}/>
    </svg>
  );
}

export function SvgPenguin({ size = 120, color = "#263238" }) {
  const W = "white"; const OR = "#FF8F00";
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} overflow="visible">
      {/* Body */}
      <ellipse cx="60" cy="82" rx="33" ry="36" fill={color} stroke={W} strokeWidth="3.5"/>
      {/* Belly */}
      <ellipse cx="60" cy="84" rx="22" ry="28" fill={W}/>
      {/* Wings */}
      <ellipse cx="25" cy="76" rx="11" ry="24" fill={color} opacity=".75"/>
      <ellipse cx="95" cy="76" rx="11" ry="24" fill={color} opacity=".75"/>
      {/* Head */}
      <circle cx="60" cy="36" r="28" fill={color} stroke={W} strokeWidth="3.5"/>
      {/* Eyes */}
      <circle cx="48" cy="29" r="8" fill={W}/>
      <circle cx="72" cy="29" r="8" fill={W}/>
      <circle cx="49" cy="30" r="4.5" fill="#0d0d0d"/>
      <circle cx="73" cy="30" r="4.5" fill="#0d0d0d"/>
      <circle cx="47.5" cy="28.5" r="2" fill={W}/>
      <circle cx="71.5" cy="28.5" r="2" fill={W}/>
      {/* Beak */}
      <polygon points="55,40 65,40 60,50" fill={OR}/>
      {/* Feet */}
      <ellipse cx="47" cy="113" rx="11" ry="7" fill={OR}/>
      <ellipse cx="73" cy="113" rx="11" ry="7" fill={OR}/>
      {/* Blush */}
      <ellipse cx="36" cy="42" rx="8" ry="5.5" fill="#FFCDD2" opacity=".7"/>
      <ellipse cx="84" cy="42" rx="8" ry="5.5" fill="#FFCDD2" opacity=".7"/>
    </svg>
  );
}

export function SvgPanda({ size = 120, color = "#E0E0E0" }) {
  const BK = "#212121"; const W = "white"; const PK = "#F8BBD0";
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} overflow="visible">
      {/* Body */}
      <ellipse cx="60" cy="88" rx="36" ry="30" fill={color} stroke={W} strokeWidth="3"/>
      {/* Tummy */}
      <ellipse cx="60" cy="90" rx="22" ry="20" fill={W} opacity=".5"/>
      {/* Ears */}
      <circle cx="25" cy="18" r="18" fill={BK} stroke={W} strokeWidth="3"/>
      <circle cx="95" cy="18" r="18" fill={BK} stroke={W} strokeWidth="3"/>
      {/* Face */}
      <circle cx="60" cy="52" r="36" fill={color} stroke={W} strokeWidth="3.5"/>
      {/* Eye patches */}
      <ellipse cx="42" cy="47" rx="14" ry="11" fill={BK} transform="rotate(-12 42 47)"/>
      <ellipse cx="78" cy="47" rx="14" ry="11" fill={BK} transform="rotate(12 78 47)"/>
      {/* Eyes */}
      <circle cx="42" cy="47" r="7" fill={W}/>
      <circle cx="78" cy="47" r="7" fill={W}/>
      <circle cx="43" cy="48" r="4" fill="#0d0d0d"/>
      <circle cx="79" cy="48" r="4" fill="#0d0d0d"/>
      <circle cx="41.5" cy="46.5" r="1.8" fill={W}/>
      <circle cx="77.5" cy="46.5" r="1.8" fill={W}/>
      {/* Nose */}
      <ellipse cx="60" cy="62" rx="6" ry="4.5" fill={BK}/>
      {/* Blush */}
      <ellipse cx="34" cy="64" rx="9" ry="5.5" fill={PK} opacity=".7"/>
      <ellipse cx="86" cy="64" rx="9" ry="5.5" fill={PK} opacity=".7"/>
      {/* Smile */}
      <path d="M52 68 Q57 74 60 71 Q63 74 68 68" stroke={BK} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    </svg>
  );
}

export function SvgTiger({ size = 120, color = "#EF6C00" }) {
  const BK = "#1a0900"; const W = "white"; const GN = "#2E7D32";
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} overflow="visible">
      {/* Face */}
      <circle cx="60" cy="60" r="46" fill={color} stroke={W} strokeWidth="3.5"/>
      {/* Ears */}
      <polygon points="18,22 8,4 30,14" fill={color} stroke={W} strokeWidth="2.5"/>
      <polygon points="102,22 112,4 90,14" fill={color} stroke={W} strokeWidth="2.5"/>
      {/* White cheeks */}
      <ellipse cx="33" cy="74" rx="18" ry="13" fill={W} opacity=".9"/>
      <ellipse cx="87" cy="74" rx="18" ry="13" fill={W} opacity=".9"/>
      {/* Stripes */}
      <path d="M22 36 Q32 44 24 56" stroke={BK} fill="none" strokeWidth="5.5" strokeLinecap="round"/>
      <path d="M98 36 Q88 44 96 56" stroke={BK} fill="none" strokeWidth="5.5" strokeLinecap="round"/>
      <path d="M12 58 Q26 56 18 70" stroke={BK} fill="none" strokeWidth="4.5" strokeLinecap="round"/>
      <path d="M108 58 Q94 56 102 70" stroke={BK} fill="none" strokeWidth="4.5" strokeLinecap="round"/>
      <path d="M38 14 Q42 28 32 36" stroke={BK} fill="none" strokeWidth="4.5" strokeLinecap="round"/>
      <path d="M82 14 Q78 28 88 36" stroke={BK} fill="none" strokeWidth="4.5" strokeLinecap="round"/>
      <path d="M52 8 Q54 20 46 28" stroke={BK} fill="none" strokeWidth="4" strokeLinecap="round"/>
      <path d="M68 8 Q66 20 74 28" stroke={BK} fill="none" strokeWidth="4" strokeLinecap="round"/>
      {/* Eyes */}
      <ellipse cx="44" cy="52" rx="10" ry="11" fill={GN}/>
      <ellipse cx="76" cy="52" rx="10" ry="11" fill={GN}/>
      <ellipse cx="44" cy="54" rx="4.5" ry="7" fill={BK}/>
      <ellipse cx="76" cy="54" rx="4.5" ry="7" fill={BK}/>
      <circle cx="42" cy="50" r="2.5" fill={W}/>
      <circle cx="74" cy="50" r="2.5" fill={W}/>
      {/* Nose */}
      <ellipse cx="60" cy="67" rx="6.5" ry="4.5" fill={BK}/>
      {/* Smile */}
      <path d="M52 73 Q57 79 60 76 Q63 79 68 73" stroke={BK} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    </svg>
  );
}

export function SvgGiraffe({ size = 120, color = "#FFB300" }) {
  const SP = "#6D4C41"; const W = "white"; const DK = "#E65100";
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} overflow="visible">
      {/* Neck */}
      <rect x="44" y="44" width="32" height="74" rx="16" fill={color} stroke={W} strokeWidth="3"/>
      {/* Body bottom */}
      <ellipse cx="60" cy="115" rx="24" ry="12" fill={color} stroke={W} strokeWidth="2"/>
      {/* Head */}
      <ellipse cx="60" cy="30" rx="22" ry="18" fill={color} stroke={W} strokeWidth="3.5"/>
      {/* Ears */}
      <ellipse cx="37" cy="28" rx="9" ry="14" fill={color} stroke={W} strokeWidth="2.5"/>
      <ellipse cx="83" cy="28" rx="9" ry="14" fill={color} stroke={W} strokeWidth="2.5"/>
      {/* Ossicones */}
      <rect x="50" y="8" width="7" height="18" rx="3.5" fill={color} stroke={W} strokeWidth="2"/>
      <rect x="63" y="8" width="7" height="18" rx="3.5" fill={color} stroke={W} strokeWidth="2"/>
      <circle cx="53.5" cy="8" r="5.5" fill={SP} stroke={W} strokeWidth="1.5"/>
      <circle cx="66.5" cy="8" r="5.5" fill={SP} stroke={W} strokeWidth="1.5"/>
      {/* Spots on neck */}
      {[[53,52],[67,61],[53,71],[67,81],[53,91]].map(([x,y],i)=>(
        <ellipse key={i} cx={x} cy={y} rx="6" ry="5" fill={SP} opacity=".75"/>
      ))}
      {/* Eye */}
      <circle cx="48" cy="26" r="7" fill={W}/>
      <circle cx="49" cy="27" r="4" fill="#1a1a1a"/>
      <circle cx="47.5" cy="25.5" r="1.6" fill={W}/>
      {/* Nostril */}
      <ellipse cx="70" cy="38" rx="6" ry="4" fill={DK} opacity=".35"/>
    </svg>
  );
}

export function SvgOwl({ size = 120, color = "#6D4C41" }) {
  const W = "white"; const YL = "#FDD835"; const OR = "#E65100"; const LT = "#D7CCC8";
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} overflow="visible">
      {/* Wings */}
      <ellipse cx="18" cy="82" rx="18" ry="30" fill="#3E2723" opacity=".75"/>
      <ellipse cx="102" cy="82" rx="18" ry="30" fill="#3E2723" opacity=".75"/>
      {/* Body */}
      <ellipse cx="60" cy="84" rx="36" ry="34" fill={color} stroke={W} strokeWidth="3.5"/>
      {/* Head */}
      <circle cx="60" cy="40" r="34" fill={color} stroke={W} strokeWidth="3.5"/>
      {/* Ear tufts */}
      <polygon points="30,14 20,2 40,8" fill="#3E2723"/>
      <polygon points="90,14 100,2 80,8" fill="#3E2723"/>
      {/* Face disc */}
      <circle cx="60" cy="45" r="28" fill={LT}/>
      {/* Eyes */}
      <circle cx="44" cy="37" r="14" fill={YL} stroke={W} strokeWidth="2.5"/>
      <circle cx="76" cy="37" r="14" fill={YL} stroke={W} strokeWidth="2.5"/>
      <circle cx="44" cy="38" r="8.5" fill="#0d0d0d"/>
      <circle cx="76" cy="38" r="8.5" fill="#0d0d0d"/>
      <circle cx="41.5" cy="35.5" r="3.2" fill={W}/>
      <circle cx="73.5" cy="35.5" r="3.2" fill={W}/>
      {/* Beak */}
      <polygon points="54,54 66,54 60,65" fill={OR}/>
      {/* Belly */}
      <ellipse cx="60" cy="87" rx="20" ry="24" fill={LT} opacity=".5"/>
    </svg>
  );
}

export function SvgFrog({ size = 120, color = "#43A047" }) {
  const LT = "#A5D6A7"; const DK = "#1B5E20"; const YL = "#FDD835"; const W = "white";
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} overflow="visible">
      {/* Body */}
      <circle cx="60" cy="78" r="40" fill={color} stroke={W} strokeWidth="3.5"/>
      {/* Belly */}
      <ellipse cx="60" cy="81" rx="28" ry="23" fill={LT}/>
      {/* Head */}
      <circle cx="60" cy="46" r="34" fill={color} stroke={W} strokeWidth="3.5"/>
      {/* Eye bulges */}
      <circle cx="34" cy="22" r="18" fill={color} stroke={W} strokeWidth="3"/>
      <circle cx="86" cy="22" r="18" fill={color} stroke={W} strokeWidth="3"/>
      {/* Irises */}
      <circle cx="34" cy="22" r="12" fill={YL}/>
      <circle cx="86" cy="22" r="12" fill={YL}/>
      {/* Pupils */}
      <circle cx="34" cy="23" r="7" fill="#0d0d0d"/>
      <circle cx="86" cy="23" r="7" fill="#0d0d0d"/>
      {/* Eye shine */}
      <circle cx="31.5" cy="20.5" r="3" fill={W}/>
      <circle cx="83.5" cy="20.5" r="3" fill={W}/>
      {/* Smile */}
      <path d="M30 56 Q60 70 90 56" stroke={DK} strokeWidth="4" fill="none" strokeLinecap="round"/>
      {/* Nostril dots */}
      <circle cx="53" cy="47" r="3.2" fill={DK} opacity=".55"/>
      <circle cx="67" cy="47" r="3.2" fill={DK} opacity=".55"/>
      {/* Spots */}
      <circle cx="44" cy="83" r="5" fill={DK} opacity=".3"/>
      <circle cx="74" cy="80" r="5.5" fill={DK} opacity=".3"/>
      <circle cx="59" cy="96" r="4.5" fill={DK} opacity=".3"/>
    </svg>
  );
}

// ── Simple icon wrapper for Lucide-based animals ───────────────────────────
const mkIcon = (Icon, scale = 0.78) => ({
  Render: ({ size, color }) => (
    <Icon size={size * scale} color={color} strokeWidth={1.8} />
  ),
});

// ══════════════════════════════════════════════════════════════════════════
// 3. ANIMAL_CONFIGS — 25 animals
// ══════════════════════════════════════════════════════════════════════════
export const ANIMAL_CONFIGS = {
  Lion:     { Render: ({ size, color }) => <SvgLion     size={size} color={color}/>, color:"#F9A825", bg:"#FFF8E1" },
  Elephant: { Render: ({ size, color }) => <SvgElephant size={size} color={color}/>, color:"#78909C", bg:"#ECEFF1" },
  Penguin:  { Render: ({ size, color }) => <SvgPenguin  size={size} color={color}/>, color:"#263238", bg:"#ECEFF1" },
  Giraffe:  { Render: ({ size, color }) => <SvgGiraffe  size={size} color={color}/>, color:"#FFB300", bg:"#FFF8E1" },
  Tiger:    { Render: ({ size, color }) => <SvgTiger    size={size} color={color}/>, color:"#EF6C00", bg:"#FFF3E0" },
  Dolphin:  { ...mkIcon(Waves),   color:"#0288D1", bg:"#E1F5FE" },
  Panda:    { Render: ({ size, color }) => <SvgPanda    size={size} color={color}/>, color:"#546E7A", bg:"#ECEFF1" },
  Parrot:   { ...mkIcon(Feather), color:"#388E3C", bg:"#E8F5E9" },
  Zebra:    { ...mkIcon(Cat),     color:"#424242", bg:"#F5F5F5" },
  Owl:      { Render: ({ size, color }) => <SvgOwl      size={size} color={color}/>, color:"#6D4C41", bg:"#EFEBE9" },
  Fox:      { ...mkIcon(Cat),     color:"#E64A19", bg:"#FBE9E7" },
  Koala:    { ...mkIcon(TreePine),color:"#90A4AE", bg:"#ECEFF1" },
  Flamingo: { ...mkIcon(Heart),   color:"#E91E63", bg:"#FCE4EC" },
  Bear:     { ...mkIcon(Footprints),color:"#6D4C41", bg:"#EFEBE9" },
  Cheetah:  { ...mkIcon(Zap),     color:"#F57F17", bg:"#FFF8E1" },
  Turtle:   { ...mkIcon(Shield),  color:"#388E3C", bg:"#E8F5E9" },
  Wolf:     { ...mkIcon(Footprints),color:"#607D8B", bg:"#ECEFF1" },
  Frog:     { Render: ({ size, color }) => <SvgFrog     size={size} color={color}/>, color:"#43A047", bg:"#E8F5E9" },
  Horse:    { ...mkIcon(Zap),     color:"#8D6E63", bg:"#EFEBE9" },
  Peacock:  { ...mkIcon(Feather), color:"#00897B", bg:"#E0F2F1" },
  Octopus:  { ...mkIcon(Anchor),  color:"#7B1FA2", bg:"#F3E5F5" },
  Eagle:    { ...mkIcon(Bird),    color:"#5D4037", bg:"#EFEBE9" },
  Rabbit:   { ...mkIcon(Moon),    color:"#CE93D8", bg:"#F3E5F5" },
  Shark:    { ...mkIcon(Waves),   color:"#1565C0", bg:"#E3F2FD" },
  Monkey:   { ...mkIcon(TreePine),color:"#A1887F", bg:"#EFEBE9" },
};

export function getAnimalConfig(name) {
  return ANIMAL_CONFIGS[name] ?? {
    Render: ({ size, color }) => <Footprints size={size * .78} color={color} strokeWidth={1.8}/>,
    color: "#9E9E9E", bg: "#F5F5F5",
  };
}

// ══════════════════════════════════════════════════════════════════════════
// 4. CATEGORY_TILES — 25 icon configs per game category
// ══════════════════════════════════════════════════════════════════════════
export const CATEGORY_TILES = {
  animals: [
    {I:Cat,    c:"#F9A825"}, {I:Fish,    c:"#0288D1"}, {I:Bird,    c:"#388E3C"}, {I:Footprints,c:"#795548"},
    {I:Feather,c:"#9C27B0"}, {I:Bug,     c:"#558B2F"}, {I:Waves,   c:"#0097A7"}, {I:TreePine,c:"#2E7D32"},
    {I:Cat,    c:"#EF6C00"}, {I:Fish,    c:"#00ACC1"}, {I:Bird,    c:"#7B1FA2"}, {I:Footprints,c:"#E91E63"},
    {I:Feather,c:"#00897B"}, {I:Bug,     c:"#F57F17"}, {I:Waves,   c:"#1565C0"}, {I:TreePine,c:"#6D4C41"},
    {I:Cat,    c:"#607D8B"}, {I:Fish,    c:"#E53935"}, {I:Bird,    c:"#5D4037"}, {I:Footprints,c:"#0288D1"},
    {I:Feather,c:"#AD1457"}, {I:Bug,     c:"#43A047"}, {I:Waves,   c:"#7B1FA2"}, {I:Heart,  c:"#E91E63"},
    {I:Shield, c:"#388E3C"},
  ],
  fruits: [
    {I:Leaf,     c:"#43A047"}, {I:Flower2,  c:"#E91E63"}, {I:Sun,      c:"#F9A825"}, {I:Globe,   c:"#FF6F00"},
    {I:Sparkles, c:"#8E24AA"}, {I:Star,     c:"#E53935"}, {I:Heart,    c:"#D81B60"}, {I:Moon,    c:"#5C6BC0"},
    {I:Leaf,     c:"#E53935"}, {I:Flower2,  c:"#FF8F00"}, {I:Sun,      c:"#0097A7"}, {I:Globe,   c:"#43A047"},
    {I:Sparkles, c:"#0288D1"}, {I:Star,     c:"#9C27B0"}, {I:Heart,    c:"#00897B"}, {I:Moon,    c:"#E64A19"},
    {I:Leaf,     c:"#7B1FA2"}, {I:Flower2,  c:"#1565C0"}, {I:Sun,      c:"#558B2F"}, {I:Globe,   c:"#795548"},
    {I:Sparkles, c:"#E91E63"}, {I:Star,     c:"#00ACC1"}, {I:Heart,    c:"#F57F17"}, {I:Moon,    c:"#388E3C"},
    {I:Leaf,     c:"#D81B60"},
  ],
  space: [
    {I:Rocket,   c:"#7B1FA2"}, {I:Star,     c:"#F9A825"}, {I:Moon,     c:"#5C6BC0"}, {I:Globe,   c:"#0288D1"},
    {I:Sun,      c:"#FF8F00"}, {I:Sparkles, c:"#00ACC1"}, {I:Zap,      c:"#7C3AED"}, {I:Eye,     c:"#2E7D32"},
    {I:Rocket,   c:"#E53935"}, {I:Star,     c:"#00ACC1"}, {I:Moon,     c:"#E91E63"}, {I:Globe,   c:"#43A047"},
    {I:Sun,      c:"#7B1FA2"}, {I:Sparkles, c:"#F9A825"}, {I:Zap,      c:"#0288D1"}, {I:Eye,     c:"#9C27B0"},
    {I:Rocket,   c:"#00897B"}, {I:Star,     c:"#E64A19"}, {I:Moon,     c:"#1565C0"}, {I:Globe,   c:"#D81B60"},
    {I:Sun,      c:"#558B2F"}, {I:Sparkles, c:"#795548"}, {I:Zap,      c:"#E91E63"}, {I:Eye,     c:"#FF8F00"},
    {I:Anchor,   c:"#607D8B"},
  ],
  tools: [
    {I:Hammer,   c:"#795548"}, {I:Wrench,   c:"#546E7A"}, {I:Shield,   c:"#1565C0"}, {I:Anchor,  c:"#01579B"},
    {I:Zap,      c:"#E65100"}, {I:Activity, c:"#E53935"}, {I:Star,     c:"#F9A825"}, {I:Music,   c:"#43A047"},
    {I:Hammer,   c:"#0097A7"}, {I:Wrench,   c:"#9C27B0"}, {I:Shield,   c:"#E91E63"}, {I:Anchor,  c:"#388E3C"},
    {I:Zap,      c:"#1565C0"}, {I:Activity, c:"#F57F17"}, {I:Star,     c:"#7B1FA2"}, {I:Music,   c:"#D81B60"},
    {I:Hammer,   c:"#607D8B"}, {I:Wrench,   c:"#E65100"}, {I:Shield,   c:"#558B2F"}, {I:Anchor,  c:"#795548"},
    {I:Zap,      c:"#00897B"}, {I:Activity, c:"#5C6BC0"}, {I:Star,     c:"#E91E63"}, {I:Music,   c:"#FF8F00"},
    {I:Hammer,   c:"#2E7D32"},
  ],
};

// ══════════════════════════════════════════════════════════════════════════
// 5. STORY ICON MAP — emoji → Lucide icon + gradient for story covers
// ══════════════════════════════════════════════════════════════════════════
export const STORY_ICON_MAP = {
  "🏫": { Icon: GraduationCap, color: "#1565C0" },
  "☀️": { Icon: Sun,           color: "#F59E0B" },
  "🌞": { Icon: Sun,           color: "#F59E0B" },
  "🚦": { Icon: Activity,      color: "#43A047" },
  "🧺": { Icon: ShoppingBag,   color: "#E65100" },
  "🐶": { Icon: Footprints,      color: "#F59E0B" },
  "🌙": { Icon: Moon,          color: "#7C3AED" },
  "🫀": { Icon: Heart,         color: "#E53935" },
  "🧩": { Icon: Puzzle,        color: "#00ACC1" },
  "🍎": { Icon: Leaf,          color: "#E53935" },
  "👁️": { Icon: Eye,           color: "#7C3AED" },
  "🌟": { Icon: Star,          color: "#F9A825" },
  "🚀": { Icon: Rocket,        color: "#7C3AED" },
  "🎉": { Icon: Sparkles,      color: "#E91E63" },
  "📚": { Icon: BookOpen,      color: "#1565C0" },
  "🎂": { Icon: Star,          color: "#E91E63" },
  "🛒": { Icon: ShoppingBag,   color: "#FF6F00" },
  "🚌": { Icon: Bus,           color: "#F9A825" },
  "🏥": { Icon: Activity,      color: "#E53935" },
  "🌈": { Icon: Sparkles,      color: "#9C27B0" },
  "🪄": { Icon: Wand2,         color: "#7C3AED" },
  "🎨": { Icon: Sparkles,      color: "#E91E63" },
  "🎵": { Icon: Music,         color: "#0097A7" },
  "🌿": { Icon: Leaf,          color: "#43A047" },
  "_d": { Icon: BookOpen,      color: "#1565C0" },
};

export function getStoryIcon(emoji) {
  return STORY_ICON_MAP[emoji] ?? STORY_ICON_MAP["_d"];
}

// ══════════════════════════════════════════════════════════════════════════
// 6. StoryCoverIcon — renders on book cover (white icon, glass bg)
// ══════════════════════════════════════════════════════════════════════════
export function StoryCoverIcon({ emoji, size = 64 }) {
  const { Icon } = getStoryIcon(emoji);
  const ico = Math.round(size * 0.50);
  const bw  = Math.max(2.5, Math.round(size * 0.055));
  return (
    <motion.div
      whileHover={{ scale: 1.16, y: -5, rotate: [-4, 4, 0] }}
      whileTap={{ scale: 0.90 }}
      transition={SPRING}
      style={{
        width:          size,
        height:         size,
        flexShrink:     0,
        background:     "rgba(255,255,255,0.26)",
        borderRadius:   "50%",
        border:         `${bw}px solid rgba(255,255,255,0.80)`,
        boxShadow:      `0 8px 28px rgba(0,0,0,0.20), inset 0 1px 0 rgba(255,255,255,0.55)`,
        display:        "flex",
        alignItems:     "center",
        justifyContent: "center",
        backdropFilter: "blur(4px)",
        cursor:         "pointer",
      }}
    >
      <Icon size={ico} color="white" strokeWidth={2.3} />
    </motion.div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// 7. GameStickerTile — used in Games.jsx for puzzle/memory tiles
// ══════════════════════════════════════════════════════════════════════════
export function GameStickerTile({ tile, size = 68, isBlank, isSelected, isMatched, isFlipped }) {
  if (isBlank) {
    return (
      <div style={{
        width: size, height: size,
        borderRadius: "28%",
        border: "2px dashed rgba(21,101,192,0.25)",
        background: "transparent",
      }}/>
    );
  }

  const { I: Icon, c: color } = tile;
  const glowC = isMatched ? "#43A047" : isSelected ? "#F9A825" : color;
  const bg    = isMatched ? "#C8E6C9" : isSelected ? "#FFF9C4" : color + "1A";
  const ico   = Math.round(size * 0.50);

  return (
    <motion.div
      whileHover={{ scale: 1.08, y: -3 }}
      whileTap={{ scale: 0.91 }}
      transition={SPRING}
      style={{
        width:          size,
        height:         size,
        background:     isFlipped === false ? "#1565C0" : bg,
        borderRadius:   "28%",
        border:         "3px solid white",
        boxShadow:      isSelected
          ? `0 0 0 3px ${glowC}, 0 6px 22px ${glowC}55`
          : isMatched
          ? `0 0 0 3px ${glowC}, 0 4px 18px ${glowC}50`
          : `0 4px 16px ${color}38, inset 0 1px 0 rgba(255,255,255,0.5)`,
        display:        "flex",
        alignItems:     "center",
        justifyContent: "center",
        cursor:         "pointer",
        overflow:       "hidden",
      }}
    >
      {isFlipped === false ? (
        <span style={{ color: "rgba(255,255,255,0.5)", fontSize: Math.round(size * 0.4) }}>✦</span>
      ) : (
        <Icon size={ico} color={isMatched ? "#2E7D32" : color} strokeWidth={2.2}/>
      )}
    </motion.div>
  );
}
