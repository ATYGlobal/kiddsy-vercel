/**
 * src/data/subscriptionData.js — Kiddsy
 * ─────────────────────────────────────────────────────────────────────────
 * Todos los datos estáticos de la página de suscripción:
 *   SUBSCRIPTIONS       — planes mensuales (Plus, Annual, Family)
 *   INDIVIDUAL_PRODUCTS — compras individuales sin suscripción
 *   LIFETIME            — acceso de por vida
 *   IMPACT_STATS        — métricas del hero (familias, historias, idiomas…)
 *   STRIPE_APPEARANCE   — tema de Stripe alineado con la paleta Kiddsy
 *
 * Para añadir un plan:
 *   1. Añade un objeto al array correspondiente
 *   2. El componente lo renderiza automáticamente
 * ─────────────────────────────────────────────────────────────────────────
 */
import {
  Heart, Star, Sparkles, Users, BookOpen, Globe, Zap,
  Crown, Infinity, Gift, Puzzle,
} from "lucide-react";

import { C } from "../utils/designConfig.js";

// ═══════════════════════════════════════════════════════════════════════════
// Subscription plans
// ═══════════════════════════════════════════════════════════════════════════
export const SUBSCRIPTIONS = [
  {
    id:"monthly", name:"Kiddsy Plus", badge:"Flexible · cancel anytime",
    price:5.99, annualMonthly:3.99, period:"month", popular:false,
    color:C.blue, softBg:"#E3F2FD", icon:Sparkles,
    features:[
      { icon:BookOpen, text:"Unlimited bilingual stories" },
      { icon:Globe,    text:"All 16 languages"            },
      { icon:Puzzle,   text:"All puzzle & game packs"     },
      { icon:Zap,      text:"Priority AI generation"      },
    ],
  },
  {
    id:"annual", name:"Kiddsy Annual", badge:"2 months free vs monthly",
    price:5.99, annualTotal:39.99, annualMonthly:3.33, period:"month", popular:true,
    color:C.green, softBg:"#E8F5E9", icon:Star,
    features:[
      { icon:BookOpen, text:"Everything in Kiddsy Plus" },
      { icon:Star,     text:"Save 33% — 2 months free"  },
      { icon:Gift,     text:"Exclusive annual stories"   },
      { icon:Zap,      text:"Early feature access"       },
    ],
  },
  {
    id:"family", name:"Kiddsy Family", badge:"Best for siblings",
    price:7.99, annualMonthly:5.49, period:"month", popular:false,
    color:C.magenta, softBg:"#FCE4EC", icon:Heart,
    features:[
      { icon:Crown,    text:"Up to 4 child profiles"        },
      { icon:BookOpen, text:"Individual progress tracking"  },
      { icon:Sparkles, text:"All premium content"           },
      { icon:Star,     text:"Save 33% vs individual plans"  },
    ],
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// Individual (one-off) products
// ═══════════════════════════════════════════════════════════════════════════
export const INDIVIDUAL_PRODUCTS = [
  { id:"puzzle-seasonal",   name:"Seasonal Puzzle Pack", note:"New themes monthly",     price:0.99, color:C.orange,  softBg:"#FFF3E0", icon:Puzzle   },
  { id:"book-single",       name:"Single Storybook",     note:"One premium story",      price:2.99, color:C.blue,    softBg:"#E3F2FD", icon:BookOpen  },
  { id:"book-pack-5",       name:"5-Book Bundle",        note:"Best per-book value",    price:9.99, color:C.green,   softBg:"#E8F5E9", icon:Gift      },
  { id:"puzzles-unlimited", name:"Unlimited Puzzles",    note:"All puzzle categories",  price:3.99, color:C.magenta, softBg:"#FCE4EC", icon:Crown     },
];

// ═══════════════════════════════════════════════════════════════════════════
// Lifetime plans
// ═══════════════════════════════════════════════════════════════════════════
export const LIFETIME = [
  { id:"lifetime",       name:"Kiddsy Lifetime",   price:49.99, color:C.blue,   softBg:"#E3F2FD", icon:Infinity                      },
  { id:"lifetime-early", name:"Early Adopter Deal", price:29.99, color:C.orange, softBg:"#FFF3E0", icon:Infinity, limit:"First 100 users" },
];

// ═══════════════════════════════════════════════════════════════════════════
// Impact statistics (hero section)
// ═══════════════════════════════════════════════════════════════════════════
export const IMPACT_STATS = [
  { icon:Users,    value:"2,400+", label:"Families using Kiddsy",  color:C.blue,    bg:"#E3F2FD", delay:0   },
  { icon:BookOpen, value:"18K+",   label:"Stories generated",       color:C.red,     bg:"#FFEBEE", delay:0.1 },
  { icon:Globe,    value:"16",     label:"Languages supported",      color:C.green,   bg:"#E8F5E9", delay:0.2 },
  { icon:Zap,      value:"Free",   label:"Always, for every family", color:C.magenta, bg:"#FCE4EC", delay:0.3 },
];

// ═══════════════════════════════════════════════════════════════════════════
// Stripe appearance (Kiddsy palette)
// ═══════════════════════════════════════════════════════════════════════════
export const STRIPE_APPEARANCE = {
  theme: "stripe",
  variables: {
    colorPrimary:    C.blue,
    colorBackground: "#FFFFFF",
    colorText:       "#1E293B",
    colorDanger:     C.red,
    fontFamily:      "Nunito, system-ui, sans-serif",
    borderRadius:    "16px",
    spacingUnit:     "4px",
  },
  rules: {
    ".Input":         { border:"2px solid #E2E8F0", boxShadow:"none", padding:"14px 16px", fontSize:"15px" },
    ".Input:focus":   { border:`2px solid ${C.blue}`, boxShadow:`0 0 0 3px ${C.blue}18` },
    ".Label":         { fontWeight:"700", fontSize:"12px", color:"#64748B" },
    ".Tab":           { border:"2px solid #E2E8F0", borderRadius:"12px" },
    ".Tab--selected": { border:`2px solid ${C.blue}`, boxShadow:`0 4px 12px ${C.blue}22` },
  },
};
