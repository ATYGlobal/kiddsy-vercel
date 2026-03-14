/**
 * src/components/Pricing.jsx — Kiddsy
 * ─────────────────────────────────────────────────────────────────────────
 * Uso: <Pricing onClose={() => setShowPricing(false)} />
 * Portal → overlay flex → modal centrado sin conflicto con Framer Motion
 * ─────────────────────────────────────────────────────────────────────────
 */
import React, { useState } from "react";
import Portal from "./Portal.jsx";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Lock, Sparkles, Zap, Heart,
  Puzzle, BookOpen, Star, Crown, Infinity,
} from "lucide-react";
import { C } from "../utils/designConfig.js";

const FF = "var(--font-display,'Nunito',sans-serif)";
const FB = "var(--font-body,'Nunito',sans-serif)";

// ── Plan data — precios actualizados ──────────────────────────────────────
const PLANS = [
  {
    id:          "free",
    name:        "Free",
    badge:       null,
    price:       "€0",
    period:      "forever",
    color:       C.green,
    soft:        C.greenSoft,
    icon:        Heart,
    highlight:   false,
    cta:         "Current plan",
    ctaDisabled: true,
    features: [
      { icon: Puzzle,   text: "3 puzzles per day" },
      { icon: BookOpen, text: "1 story per day" },
      { icon: Star,     text: "Animals category" },
      { icon: Lock,     text: "All other categories locked", muted: true },
    ],
  },
  {
    id:          "plus",
    name:        "Kiddsy Plus",
    badge:       "Most popular",
    price:       "€5.99",
    period:      "/ month",
    color:       C.blue,
    soft:        C.blueSoft,
    icon:        Zap,
    highlight:   true,
    cta:         "Start free trial",
    ctaDisabled: false,
    features: [
      { icon: Puzzle,   text: "Unlimited puzzles & games" },
      { icon: BookOpen, text: "Unlimited bilingual stories" },
      { icon: Star,     text: "All 4 categories" },
      { icon: Sparkles, text: "16 languages" },
    ],
  },
  {
    id:          "annual",
    name:        "Kiddsy Annual",
    badge:       "Save 33%",
    price:       "€3.33",
    period:      "/ mo · €39.99/yr",
    color:       C.orange,
    soft:        C.orangeSoft,
    icon:        Star,
    highlight:   false,
    cta:         "Get annual",
    ctaDisabled: false,
    features: [
      { icon: Puzzle,   text: "Everything in Plus" },
      { icon: Zap,      text: "2 months free vs monthly" },
      { icon: Star,     text: "Exclusive annual stories" },
      { icon: Heart,    text: "Early feature access" },
    ],
  },
  {
    id:          "family",
    name:        "Family Plan",
    badge:       "Best for siblings",
    price:       "€7.99",
    period:      "/ month",
    color:       C.magenta,
    soft:        C.magentaSoft,
    icon:        Crown,
    highlight:   false,
    cta:         "Get Family",
    ctaDisabled: false,
    features: [
      { icon: Crown,    text: "Up to 4 child profiles" },
      { icon: BookOpen, text: "Individual progress tracking" },
      { icon: Sparkles, text: "All premium content" },
      { icon: Star,     text: "Save 33% vs individual plans" },
    ],
  },
  {
    id:          "lifetime",
    name:        "Lifetime Access",
    badge:       "Best value",
    price:       "€49.99",
    period:      "one-time",
    color:       "#5B21B6",
    soft:        "#EDE9FE",
    icon:        Infinity,
    highlight:   false,
    cta:         "Get Lifetime",
    ctaDisabled: false,
    features: [
      { icon: Crown,    text: "All features, forever" },
      { icon: Heart,    text: "All future content included" },
      { icon: Sparkles, text: "No subscription ever" },
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
      transition={{ delay: index * 0.06, type: "spring", stiffness: 260, damping: 24 }}
      style={{
        position:      "relative",
        borderRadius:  24,
        padding:       plan.highlight ? "28px 20px" : "22px 18px",
        background:    plan.highlight
          ? `linear-gradient(145deg, ${plan.color}, #42A5F5)`
          : "white",
        border:        plan.highlight
          ? "none"
          : `2.5px solid ${plan.soft}`,
        boxShadow:     plan.highlight
          ? `0 20px 48px ${plan.color}40, 0 6px 16px rgba(0,0,0,0.12)`
          : "0 4px 16px rgba(0,0,0,0.06)",
        transform:     plan.highlight ? "scale(1.04)" : "scale(1)",
        flex:          "1 1 160px",
        minWidth:      148,
        maxWidth:      220,
        display:       "flex",
        flexDirection: "column",
        gap:           10,
      }}
    >
      {/* Badge */}
      {plan.badge && (
        <div style={{
          position:      "absolute",
          top:           -12,
          left:          "50%",
          transform:     "translateX(-50%)",
          background:    plan.highlight ? C.yellow : plan.color,
          color:         plan.highlight ? "#92400E" : "white",
          fontFamily:    FF,
          fontWeight:    800,
          fontSize:      10,
          padding:       "3px 12px",
          borderRadius:  999,
          whiteSpace:    "nowrap",
          boxShadow:     "0 2px 8px rgba(0,0,0,0.15)",
          letterSpacing: "0.05em",
          textTransform: "uppercase",
        }}>
          {plan.badge}
        </div>
      )}

      {/* Icon + Name */}
      <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
        <div style={{
          width:           36,
          height:          36,
          borderRadius:    12,
          background:      plan.highlight ? "rgba(255,255,255,0.22)" : plan.soft,
          display:         "flex",
          alignItems:      "center",
          justifyContent:  "center",
          flexShrink:      0,
        }}>
          <Icon size={18} strokeWidth={2}
            style={{ color: plan.highlight ? "white" : plan.color }}
          />
        </div>
        <div style={{
          fontFamily: FF,
          fontWeight: 800,
          fontSize:   14,
          color:      plan.highlight ? "white" : "#1E293B",
          lineHeight: 1.2,
        }}>{plan.name}</div>
      </div>

      {/* Price */}
      <div style={{ display: "flex", alignItems: "baseline", gap: 3 }}>
        <span style={{
          fontFamily: FF,
          fontWeight: 900,
          fontSize:   30,
          color:      plan.highlight ? "white" : plan.color,
          lineHeight: 1,
        }}>{plan.price}</span>
        <span style={{
          fontFamily: FB,
          fontSize:   11,
          color:      plan.highlight ? "rgba(255,255,255,0.75)" : "#94A3B8",
          lineHeight: 1.3,
        }}>{plan.period}</span>
      </div>

      {/* Divider */}
      <div style={{
        height:     1,
        background: plan.highlight ? "rgba(255,255,255,0.2)" : "#F1F5F9",
        margin:     "2px 0",
      }}/>

      {/* Features */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
        {plan.features.map((f, i) => {
          const FIcon = f.icon;
          return (
            <div key={i} style={{
              display:    "flex",
              alignItems: "center",
              gap:        7,
              opacity:    f.muted ? 0.4 : 1,
            }}>
              <div style={{
                width:          19,
                height:         19,
                borderRadius:   6,
                background:     plan.highlight ? "rgba(255,255,255,0.18)" : plan.soft,
                display:        "flex",
                alignItems:     "center",
                justifyContent: "center",
                flexShrink:     0,
              }}>
                <FIcon size={10} strokeWidth={2.5}
                  style={{ color: plan.highlight ? "white" : plan.color }}
                />
              </div>
              <span style={{
                fontFamily:     FB,
                fontSize:       11,
                color:          plan.highlight ? "rgba(255,255,255,0.9)" : "#475569",
                lineHeight:     1.3,
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
            // TODO: conectar con Stripe checkout
            alert(`Checkout: ${plan.name} — ${plan.price}`);
          }
        }}
        style={{
          width:        "100%",
          padding:      "10px 0",
          borderRadius: 13,
          border:       "none",
          background:   plan.ctaDisabled
            ? "rgba(0,0,0,0.06)"
            : plan.highlight
              ? "white"
              : `linear-gradient(135deg,${plan.color},${plan.color}CC)`,
          color:        plan.ctaDisabled
            ? "#94A3B8"
            : plan.highlight
              ? plan.color
              : "white",
          fontFamily:   FF,
          fontWeight:   800,
          fontSize:     12,
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
// FIX DE CENTRADO:
// Framer Motion sobrescribe el transform CSS al animar y/scale,
// eliminando el translate(-50%,-50%).
// Solución: un contenedor fixed+flex que centra, y el modal
// solo anima opacity/y/scale sin necesitar transform de posición.
// ─────────────────────────────────────────────────────────────────────────
export default function Pricing({ onClose, lockedCategory = null }) {
  return (
    <Portal>
      <AnimatePresence>
        {/* ── Backdrop ─────────────────────────────────────────────── */}
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{
            position:       "fixed",
            inset:          0,
            background:     "rgba(15,23,42,0.72)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            zIndex:         200,
          }}
        />

        {/* ── Flex centering wrapper (no anima → no conflicto) ─────── */}
        <div
          style={{
            position:       "fixed",
            inset:          0,
            zIndex:         201,
            display:        "flex",
            alignItems:     "center",
            justifyContent: "center",
            padding:        "16px",
            // pointer-events none so clicks on wrapper hit backdrop
            pointerEvents:  "none",
          }}
        >
          {/* ── Modal (solo anima opacity + y + scale) ──────────────── */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0,  scale: 1    }}
            exit={{    opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            onClick={e => e.stopPropagation()}
            style={{
              pointerEvents: "auto",
              position:      "relative",
              width:         "min(96vw, 1020px)",
              maxHeight:     "90vh",
              overflowY:     "auto",
              background:    "linear-gradient(160deg,#F0F9FF 0%,#FFFDE7 50%,#F0FFF4 100%)",
              borderRadius:  28,
              boxShadow:     "0 32px 80px rgba(0,0,0,0.25),0 8px 24px rgba(0,0,0,0.1)",
              padding:       "36px 24px 28px",
            }}
          >
            {/* Close button */}
            <motion.button
              whileHover={{ scale: 1.1, background: "#F1F5F9" }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              style={{
                position:       "absolute",
                top:            16,
                right:          16,
                width:          36,
                height:         36,
                borderRadius:   10,
                border:         "2px solid #E2E8F0",
                background:     "white",
                cursor:         "pointer",
                display:        "flex",
                alignItems:     "center",
                justifyContent: "center",
                color:          "#64748B",
                flexShrink:     0,
                zIndex:         2,
              }}
            >
              <X size={18} strokeWidth={2.5}/>
            </motion.button>

            {/* Header */}
            <div style={{ textAlign: "center", marginBottom: 28 }}>
              {lockedCategory && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1,   opacity: 1 }}
                  style={{
                    display:      "inline-flex",
                    alignItems:   "center",
                    gap:          6,
                    padding:      "5px 16px",
                    borderRadius: 999,
                    background:   C.yellowSoft,
                    border:       `2px solid ${C.yellow}55`,
                    fontFamily:   FF,
                    fontWeight:   700,
                    fontSize:     12,
                    color:        C.orange,
                    marginBottom: 14,
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
                fontSize:   26,
                color:      C.blue,
                margin:     "0 0 8px",
              }}>
                Choose your Kiddsy plan ✨
              </h2>
              <p style={{
                fontFamily: FB,
                fontSize:   14,
                color:      "#64748B",
                maxWidth:   480,
                margin:     "0 auto",
                lineHeight: 1.5,
              }}>
                Unlimited stories, games & languages.{" "}
                <strong style={{ color: C.blue }}>Always free</strong> at the core —
                unlock everything with a plan.
              </p>
            </div>

            {/* Cards grid */}
            <div style={{
              display:        "flex",
              flexWrap:       "wrap",
              gap:            14,
              justifyContent: "center",
              alignItems:     "stretch",
              padding:        "8px 0 4px",
            }}>
              {PLANS.map((plan, i) => (
                <PlanCard key={plan.id} plan={plan} index={i} onClose={onClose}/>
              ))}
            </div>

            {/* Footer */}
            <p style={{
              textAlign:  "center",
              fontFamily: FB,
              fontSize:   11,
              color:      "#94A3B8",
              marginTop:  20,
              lineHeight: 1.5,
            }}>
              All prices in EUR · Cancel anytime · Secure checkout via Stripe ·{" "}
              <a href="mailto:support@kiddsy.org"
                style={{ color: C.blue, textDecoration: "none" }}>
                support@kiddsy.org
              </a>
            </p>
          </motion.div>
        </div>
      </AnimatePresence>
    </Portal>
  );
}
