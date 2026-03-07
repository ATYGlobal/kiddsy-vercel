/**
 * Donation.jsx — Kiddsy
 * "Buy us a hot chocolate" — PayPal donation integration
 * Warm, cozy aesthetic matching the logo's yellow/red palette
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Coffee, Star, Sparkles, Users, BookOpen, Globe, Zap } from "lucide-react";

// ─── Brand palette ─────────────────────────────────────────────────────────
const C = {
  blue:   "#1565C0",
  red:    "#E53935",
  yellow: "#FDD835",
  green:  "#43A047",
  magenta:"#D81B60",
  cyan:   "#00ACC1",
};

// ─── PayPal donate button ──────────────────────────────────────────────────
const PAYPAL_ME_CUSTOM = (amount) =>
  `https://www.paypal.com/paypalme/kiddsyloop/${amount}`;

// ─── Floating confetti particles ──────────────────────────────────────────
function FloatingEmojis() {
  const items = ["☕","🍫","📚","🌟","❤️","🎈","✨","🌈","🎉","🍬"];
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      {items.map((emoji, i) => (
        <motion.span
          key={i}
          className="absolute text-2xl select-none"
          style={{ left: `${8 + i * 9}%`, top: `${Math.random() * 80 + 5}%` }}
          animate={{ y: [0, -20, 0], rotate: [-5, 5, -5], opacity: [0.4, 0.7, 0.4] }}
          transition={{
            duration: 3 + i * 0.4,
            repeat: Infinity,
            delay: i * 0.3,
            ease: "easeInOut",
          }}
        >
          {emoji}
        </motion.span>
      ))}
    </div>
  );
}

// ─── Donation tier card ────────────────────────────────────────────────────
function DonationTier({ tier, onSelect, isSelected }) {
  return (
    <motion.button
      onClick={() => onSelect(tier)}
      whileHover={{ scale: 1.04, y: -4 }}
      whileTap={{ scale: 0.97 }}
      className="relative w-full rounded-3xl overflow-hidden border-4 transition-all duration-200 text-left"
      style={{
        borderColor: isSelected ? tier.color : "white",
        background: isSelected ? tier.softBg : "white",
        boxShadow: isSelected
          ? `0 12px 40px ${tier.color}30`
          : "0 6px 20px rgba(0,0,0,0.06)",
      }}
    >
      {tier.popular && (
        <div
          className="absolute top-3 right-3 px-3 py-1 rounded-full font-display text-xs text-white"
          style={{ background: tier.color }}
        >
          ⭐ Popular
        </div>
      )}

      <div className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-sm"
            style={{ background: tier.softBg }}
          >
            {tier.emoji}
          </div>
          <div>
            <div className="font-display text-3xl font-bold" style={{ color: tier.color }}>
              ${tier.amount}
            </div>
            <div className="font-display text-base text-slate-500">{tier.label}</div>
          </div>
        </div>

        <p className="font-body text-sm text-slate-600 leading-relaxed">{tier.description}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {tier.perks.map((perk, i) => (
            <span
              key={i}
              className="px-3 py-1 rounded-full font-body text-xs font-semibold"
              style={{ background: tier.softBg, color: tier.color }}
            >
              {perk}
            </span>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {isSelected && (
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            exit={{ scaleX: 0 }}
            className="h-1.5 w-full origin-left"
            style={{ background: tier.color }}
          />
        )}
      </AnimatePresence>
    </motion.button>
  );
}

// ─── Impact counter cards ──────────────────────────────────────────────────
function ImpactCard({ icon: Icon, value, label, color, bg, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, type: "spring" }}
      className="rounded-3xl p-5 text-center border-2 border-white shadow-sm"
      style={{ background: bg }}
    >
      <Icon size={24} style={{ color }} className="mx-auto mb-2" />
      <div className="font-display text-3xl mb-1 font-bold" style={{ color }}>{value}</div>
      <div className="font-body text-xs text-slate-500 leading-tight">{label}</div>
    </motion.div>
  );
}

// ─── Main Donation Component ───────────────────────────────────────────────
const TIERS = [
  { amount: 3, emoji: "☕", label: "A hot chocolate", color: C.yellow, softBg: "#FFFDE7", popular: false, description: "Warms us up during late-night coding sessions! Keeps the server running for one week.", perks: ["☕ 1 week server", "💛 Warm thanks"] },
  { amount: 10, emoji: "📚", label: "A storybook", color: C.blue, softBg: "#E3F2FD", popular: true, description: "Helps us add 5 new bilingual stories to the library for all families to enjoy.", perks: ["📚 5 new stories", "🌟 Name in credits", "💙 Big thanks"] },
  { amount: 25, emoji: "🌍", label: "A new language", color: C.green, softBg: "#E8F5E9", popular: false, description: "Funds the translation and testing of a new language pair, reaching more families.", perks: ["🌍 New language", "🎨 Custom story", "💚 Sponsor badge"] },
  { amount: 50, emoji: "🚀", label: "A full feature", color: C.magenta, softBg: "#FCE4EC", popular: false, description: "Sponsors a full new feature — like audio narration or an interactive word game!", perks: ["🚀 Feature sponsor", "📧 Direct update", "❤️ Hero status"] },
];

const IMPACT_STATS = [
  { icon: Users,    value: "2,400+", label: "Families using Kiddsy",      color: C.blue,    bg: "#E3F2FD", delay: 0 },
  { icon: BookOpen, value: "18K+",   label: "Stories generated",           color: C.red,     bg: "#FFEBEE", delay: 0.1 },
  { icon: Globe,    value: "4",      label: "Languages supported",          color: C.green,   bg: "#E8F5E9", delay: 0.2 },
  { icon: Zap,      value: "Free",   label: "Always, for every family",     color: C.magenta, bg: "#FCE4EC", delay: 0.3 },
];

export default function Donation() {
  const [selectedTier, setSelectedTier] = useState(TIERS[1]);
  const [customAmount, setCustomAmount] = useState("");
  const [donated, setDonated] = useState(false);

  const finalAmount = customAmount || selectedTier.amount;

  const handleDonate = () => {
    const url = customAmount ? PAYPAL_ME_CUSTOM(customAmount) : PAYPAL_ME_CUSTOM(selectedTier.amount);
    window.open(url, "_blank", "noopener,noreferrer");
    setDonated(true);
    setTimeout(() => setDonated(false), 4000);
  };

  return (
    <div
      className="relative w-full"
      style={{ 
        minHeight: "100vh",
        overflowY: "auto", // ¡Esto arregla el scroll!
        overflowX: "hidden",
        paddingBottom: "120px", // Espacio abajo para que no se corte
        background: "linear-gradient(150deg, #FFFDE7 0%, #FFF8E1 40%, #FFF3E0 100%)" 
      }}
    >
      <FloatingEmojis />

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-14">
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: -24 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <motion.div animate={{ rotate: [0, -8, 8, 0] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }} className="text-7xl mb-4 inline-block">
            ☕
          </motion.div>
          <h1 className="font-display text-4xl md:text-5xl mb-3 font-bold" style={{ color: C.blue }}>
            Buy us a hot chocolate!
          </h1>
          <p className="font-body text-slate-600 text-lg max-w-xl mx-auto leading-relaxed">
            Kiddsy is free for every family, forever. But magic needs fuel! 🪄
            Your donation helps us add stories, languages, and games.
          </p>
        </motion.div>

        {/* Impact stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {IMPACT_STATS.map((s, i) => <ImpactCard key={i} {...s} />)}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left: Tier picker */}
          <div>
            <h2 className="font-display text-2xl mb-5 font-bold" style={{ color: C.blue }}>
              Choose your contribution
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {TIERS.map((tier) => (
                <DonationTier key={tier.amount} tier={tier} isSelected={selectedTier?.amount === tier.amount && !customAmount} onSelect={(t) => { setSelectedTier(t); setCustomAmount(""); }} />
              ))}
            </div>
          </div>

          {/* Right: Summary + CTA */}
          <div className="flex flex-col gap-5">
            <div className="bg-white rounded-3xl p-6 shadow-md border-2 border-white">
              <h3 className="font-display text-lg mb-3 font-bold" style={{ color: C.blue }}>Or enter a custom amount</h3>
              <div className="flex items-center gap-2 bg-slate-50 rounded-2xl px-4 py-3 border-2 border-slate-200 focus-within:border-blue-400 transition-colors">
                <span className="font-display text-2xl text-slate-400">$</span>
                <input type="number" min="1" max="999" placeholder="Your amount" value={customAmount} onChange={(e) => { setCustomAmount(e.target.value); setSelectedTier(null); }} className="flex-1 bg-transparent font-display text-2xl outline-none text-slate-700 placeholder-slate-300" />
              </div>
            </div>

            <motion.div key={finalAmount} initial={{ scale: 0.97, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="rounded-3xl p-7 text-white shadow-xl" style={{ background: `linear-gradient(135deg, ${C.blue} 0%, ${C.cyan} 100%)` }}>
              <div className="text-white/70 font-display mb-1">Your contribution</div>
              <div className="font-display text-5xl font-bold mb-1">${finalAmount || "—"}</div>
              {selectedTier && !customAmount && (
                <div className="font-body text-white/80 text-sm mb-4">{selectedTier.label} {selectedTier.emoji}</div>
              )}
              <div className="border-t border-white/20 pt-4 mt-4 space-y-2">
                <div className="flex items-center gap-2 text-white/80 font-body text-sm"><Shield size={16} /> Secure payment via PayPal</div>
                <div className="flex items-center gap-2 text-white/80 font-body text-sm"><Heart size={16} /> 100% goes to Kiddsy development</div>
              </div>
            </motion.div>

            <AnimatePresence mode="wait">
              {donated ? (
                <motion.div key="thanks" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} className="w-full py-5 rounded-3xl font-display text-xl text-center font-bold" style={{ background: C.green, color: "white" }}>
                  🎉 Thank you, superstar!
                </motion.div>
              ) : (
                <motion.button key="donate-btn" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={handleDonate} disabled={!finalAmount || Number(finalAmount) < 1} className="w-full py-5 rounded-3xl font-display text-xl flex items-center justify-center gap-3 shadow-lg transition-all font-bold" style={{ background: (!finalAmount || Number(finalAmount) < 1) ? "#E5E7EB" : `linear-gradient(135deg, ${C.yellow} 0%, #FF8F00 100%)`, color: (!finalAmount || Number(finalAmount) < 1) ? "#9CA3AF" : "white", cursor: (!finalAmount || Number(finalAmount) < 1) ? "not-allowed" : "pointer" }}>
                  <span className="text-2xl">🧡</span> Donate with PayPal
                </motion.button>
              )}
            </AnimatePresence>
            <p className="font-body text-center text-xs text-slate-400 px-4">You'll be redirected to PayPal. Kiddsy never sees your payment details.</p>
          </div>
        </div>

        {/* Thank-you wall */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-16 text-center">
          <h2 className="font-display text-2xl mb-2 font-bold" style={{ color: C.blue }}>Thank you to our supporters 💛</h2>
          <p className="font-body text-slate-500 mb-6 text-sm">These wonderful people keep the magic alive.</p>
          <div className="flex flex-wrap justify-center gap-3">
            {["María G.", "Ahmed K.", "Famille Dumont", "Sofia R.", "Omar A.", "The Chen Family", "Yasmin B.", "Lucas F."].map((name, i) => (
              <motion.span key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.6 + i * 0.07, type: "spring" }} className="px-4 py-2 rounded-full font-body text-sm font-semibold bg-white shadow-sm border-2 border-white text-slate-600">
                ❤️ {name}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function Shield({ size, style, className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style} className={className}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}