/**
 * src/components/Pricing.jsx — Kiddsy
 * ─────────────────────────────────────────────────────────────────────────
 * Uso: <Pricing onClose={() => setShowPricing(false)} />
 * Se monta como overlay modal sobre cualquier página.
 * ─────────────────────────────────────────────────────────────────────────
 */
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Check, Lock, Sparkles, Zap, Heart,
  Puzzle, BookOpen, Star, Crown,
} from "lucide-react";

const C = {
  blue:      "#1565C0",
  blueSoft:  "#E3F2FD",
  yellow:    "#F9A825",
  yellowSoft:"#FFFDE7",
  green:     "#43A047",
  greenSoft: "#E8F5E9",
  magenta:   "#D81B60",
  magentaSoft:"#FCE4EC",
  orange:    "#E65100",
};

const FF = "var(--font-display,'Nunito',sans-serif)";
const FB = "var(--font-body,'Nunito',sans-serif)";

// ── Plan data ──────────────────────────────────────────────────────────────
const PLANS = [
  {
    id:       "free",
    name:     "Free",
    badge:    null,
    price:    "€0",
    period:   "forever",
    color:    C.green,
    soft:     C.greenSoft,
    icon:     Heart,
    highlight: false,
    cta:      "Current plan",
    ctaDisabled: true,
    features: [
      { icon: Puzzle,   text: "3 puzzles per day" },
      { icon: BookOpen, text: "1 story per day" },
      { icon: Star,     text: "Animals category" },
      { icon: Lock,     text: "Cities, Nature, Monuments locked", muted: true },
    ],
  },
  {
    id:       "plus",
    name:     "Kiddsy Plus",
    badge:    "Most popular",
    price:    "€0.99",
    period:   "/ month",
    color:    C.blue,
    soft:     C.blueSoft,
    icon:     Zap,
    highlight: true,
    cta:      "Start free trial",
    ctaDisabled: false,
    features: [
      { icon: Puzzle,   text: "Unlimited puzzles" },
      { icon: BookOpen, text: "Unlimited stories" },
      { icon: Star,     text: "All 4 categories" },
      { icon: Sparkles, text: "16 languages" },
    ],
  },
  {
    id:       "annual",
    name:     "Plus Annual",
    badge:    "Save 50%",
    price:    "€5.99",
    period:   "/ year",
    color:    C.orange,
    soft:     "#FFF3E0",
    icon:     Star,
    highlight: false,
    cta:      "Get annual",
    ctaDisabled: false,
    features: [
      { icon: Puzzle,   text: "Everything in Plus" },
      { icon: Zap,      text: "€0.50/month billed yearly" },
      { icon: Star,     text: "Priority new content" },
      { icon: Heart,    text: "Support Kiddsy mission" },
    ],
  },
  {
    id:       "lifetime",
    name:     "Family Lifetime",
    badge:    "Best value",
    price:    "€19.99",
    period:   "one-time",
    color:    C.magenta,
    soft:     C.magentaSoft,
    icon:     Crown,
    highlight: false,
    cta:      "Buy lifetime",
    ctaDisabled: false,
    features: [
      { icon: Crown,    text: "All features, forever" },
      { icon: Heart,    text: "Up to 5 child profiles" },
      { icon: Sparkles, text: "All future content included" },
      { icon: Star,     text: "Founding family badge" },
    ],
  },
];

// ── PlanCard ───────────────────────────────────────────────────────────────
function PlanCard({ plan, index, onClose }) {
  const Icon = plan.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, type: "spring", stiffness: 260, damping: 24 }}
      style={{
        position:     "relative",
        borderRadius: 24,
        padding:      plan.highlight ? "28px 22px" : "22px 20px",
        background:   plan.highlight
          ? `linear-gradient(145deg, ${plan.color}, #42A5F5)`
          : "white",
        border:       plan.highlight
          ? "none"
          : `2.5px solid ${plan.soft}`,
        boxShadow:    plan.highlight
          ? `0 20px 48px ${plan.color}40, 0 6px 16px rgba(0,0,0,0.12)`
          : "0 4px 16px rgba(0,0,0,0.06)",
        transform:    plan.highlight ? "scale(1.03)" : "scale(1)",
        flex:         "1 1 200px",
        minWidth:     160,
        maxWidth:     240,
        display:      "flex",
        flexDirection:"column",
        gap:          12,
      }}
    >
      {/* Badge */}
      {plan.badge && (
        <div style={{
          position:   "absolute",
          top:        -12,
          left:       "50%",
          transform:  "translateX(-50%)",
          background: plan.highlight ? C.yellow : plan.color,
          color:      plan.highlight ? "#92400E" : "white",
          fontFamily: FF,
          fontWeight: 800,
          fontSize:   11,
          padding:    "4px 14px",
          borderRadius: 999,
          whiteSpace: "nowrap",
          boxShadow:  "0 2px 8px rgba(0,0,0,0.15)",
          letterSpacing: "0.05em",
          textTransform: "uppercase",
        }}>
          {plan.badge}
        </div>
      )}

      {/* Icon + Name */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          width:       40,
          height:      40,
          borderRadius: 14,
          background:   plan.highlight ? "rgba(255,255,255,0.22)" : plan.soft,
          display:      "flex",
          alignItems:   "center",
          justifyContent: "center",
          flexShrink:   0,
        }}>
          <Icon size={20} strokeWidth={2}
            style={{ color: plan.highlight ? "white" : plan.color }}
          />
        </div>
        <div>
          <div style={{
            fontFamily: FF,
            fontWeight: 800,
            fontSize:   15,
            color:      plan.highlight ? "white" : "#1E293B",
            lineHeight: 1.2,
          }}>{plan.name}</div>
        </div>
      </div>

      {/* Price */}
      <div style={{ display: "flex", alignItems: "baseline", gap: 3 }}>
        <span style={{
          fontFamily: FF,
          fontWeight: 900,
          fontSize:   32,
          color:      plan.highlight ? "white" : plan.color,
          lineHeight: 1,
        }}>{plan.price}</span>
        <span style={{
          fontFamily: FB,
          fontSize:   13,
          color:      plan.highlight ? "rgba(255,255,255,0.75)" : "#94A3B8",
        }}>{plan.period}</span>
      </div>

      {/* Divider */}
      <div style={{
        height:     1,
        background: plan.highlight ? "rgba(255,255,255,0.2)" : "#F1F5F9",
        margin:     "2px 0",
      }}/>

      {/* Features */}
      <div style={{ display: "flex", flexDirection: "column", gap: 7, flex: 1 }}>
        {plan.features.map((f, i) => {
          const FIcon = f.icon;
          return (
            <div key={i} style={{
              display:    "flex",
              alignItems: "center",
              gap:        7,
              opacity:    f.muted ? 0.45 : 1,
            }}>
              <div style={{
                width:       20,
                height:      20,
                borderRadius: 6,
                background:   plan.highlight ? "rgba(255,255,255,0.18)" : plan.soft,
                display:      "flex",
                alignItems:   "center",
                justifyContent: "center",
                flexShrink:   0,
              }}>
                <FIcon size={11} strokeWidth={2.5}
                  style={{ color: plan.highlight ? "white" : plan.color }}
                />
              </div>
              <span style={{
                fontFamily: FB,
                fontSize:   12,
                color:      plan.highlight ? "rgba(255,255,255,0.9)" : "#475569",
                lineHeight: 1.3,
                textDecoration: f.muted ? "line-through" : "none",
              }}>{f.text}</span>
            </div>
          );
        })}
      </div>

      {/* CTA */}
      <motion.button
        whileHover={!plan.ctaDisabled ? { scale: 1.04 } : {}}
        whileTap={!plan.ctaDisabled ? { scale: 0.96 } : {}}
        disabled={plan.ctaDisabled}
        onClick={() => {
          if (!plan.ctaDisabled) {
            // TODO: connect to payment provider
            alert(`Redirecting to checkout for ${plan.name}…`);
          }
        }}
        style={{
          width:        "100%",
          padding:      "11px 0",
          borderRadius: 14,
          border:       "none",
          background:   plan.ctaDisabled
            ? "rgba(0,0,0,0.06)"
            : plan.highlight
              ? "white"
              : `linear-gradient(135deg, ${plan.color}, ${plan.color}CC)`,
          color:        plan.ctaDisabled
            ? "#94A3B8"
            : plan.highlight
              ? plan.color
              : "white",
          fontFamily:   FF,
          fontWeight:   800,
          fontSize:     13,
          cursor:       plan.ctaDisabled ? "not-allowed" : "pointer",
          boxShadow:    plan.ctaDisabled
            ? "none"
            : plan.highlight
              ? "0 4px 14px rgba(255,255,255,0.3)"
              : `0 4px 14px ${plan.color}40`,
          marginTop:    "auto",
          transition:   "box-shadow 0.15s",
        }}
      >
        {plan.cta}
      </motion.button>
    </motion.div>
  );
}

// ── Pricing modal ──────────────────────────────────────────────────────────
export default function Pricing({ onClose, lockedCategory = null }) {
  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position:   "fixed",
          inset:       0,
          background: "rgba(15,23,42,0.55)",
          backdropFilter: "blur(6px)",
          zIndex:     200,
        }}
      />

      {/* Sheet */}
      <motion.div
        key="sheet"
        initial={{ opacity: 0, y: 48, scale: 0.97 }}
        animate={{ opacity: 1, y: 0,  scale: 1    }}
        exit={{    opacity: 0, y: 48, scale: 0.97 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        style={{
          position:   "fixed",
          left:       "50%",
          top:        "50%",
          transform:  "translate(-50%, -50%)",
          zIndex:     201,
          width:      "min(96vw, 960px)",
          maxHeight:  "92vh",
          overflowY:  "auto",
          background: "linear-gradient(160deg, #F0F9FF 0%, #FFFDE7 50%, #F0FFF4 100%)",
          borderRadius: 28,
          boxShadow:  "0 32px 80px rgba(0,0,0,0.22), 0 8px 24px rgba(0,0,0,0.1)",
          padding:    "32px 24px 28px",
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position:   "absolute",
            top:        16,
            right:      16,
            width:      36,
            height:     36,
            borderRadius: 10,
            border:     "2px solid #E2E8F0",
            background: "white",
            cursor:     "pointer",
            display:    "flex",
            alignItems: "center",
            justifyContent: "center",
            color:      "#64748B",
          }}
        >
          <X size={18} strokeWidth={2.5}/>
        </button>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          {/* Lock pill — shown when triggered from a locked category */}
          {lockedCategory && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1,   opacity: 1 }}
              style={{
                display:        "inline-flex",
                alignItems:     "center",
                gap:            6,
                padding:        "5px 16px",
                borderRadius:   999,
                background:     C.yellowSoft,
                border:         `2px solid ${C.yellow}55`,
                fontFamily:     FF,
                fontWeight:     700,
                fontSize:       12,
                color:          C.orange,
                marginBottom:   14,
              }}
            >
              <Lock size={13} strokeWidth={2.5}/>
              <span>
                <strong>{lockedCategory}</strong> is a Premium category
              </span>
            </motion.div>
          )}

          <h2 style={{
            fontFamily: FF,
            fontWeight: 900,
            fontSize:   28,
            color:      C.blue,
            margin:     "0 0 8px",
          }}>
            Unlock everything in Kiddsy
          </h2>
          <p style={{
            fontFamily: FB,
            fontSize:   14,
            color:      "#64748B",
            maxWidth:   460,
            margin:     "0 auto",
            lineHeight: 1.5,
          }}>
            Support our mission to make bilingual learning free for every family —
            and get unlimited access to all puzzles, stories, and languages.
          </p>
        </div>

        {/* Cards grid */}
        <div style={{
          display:   "flex",
          flexWrap:  "wrap",
          gap:       16,
          justifyContent: "center",
          alignItems: "stretch",
          padding:   "8px 0 4px",
        }}>
          {PLANS.map((plan, i) => (
            <PlanCard key={plan.id} plan={plan} index={i} onClose={onClose}/>
          ))}
        </div>

        {/* Footer note */}
        <p style={{
          textAlign:  "center",
          fontFamily: FB,
          fontSize:   11,
          color:      "#94A3B8",
          marginTop:  20,
        }}>
          All prices in EUR · Cancel anytime · Secure checkout via Stripe ·{" "}
          <a href="mailto:legal@kiddsy.org"
            style={{ color: C.blue, textDecoration: "none" }}>
            legal@kiddsy.org
          </a>
        </p>
      </motion.div>
    </AnimatePresence>
  );
}
