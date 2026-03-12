/**
 * src/components/QuotaUI.jsx — Kiddsy
 * ─────────────────────────────────────────────────────────────────────────
 * QuotaBadge  — pill progress bar shown inside StoryForm header
 * QuotaWall   — full-block shown when monthly limit is reached
 *
 * Usage:
 *   import { QuotaBadge, QuotaWall } from "../components/QuotaUI.jsx";
 *   <QuotaBadge quota={quota} />
 *   <QuotaWall  quota={quota} onUpgrade={() => setShowPricing(true)} />
 *
 * quota shape (from useQuota hook):
 *   { planId, planLabel, limit, used, remaining, canGenerate, resetDate }
 * ─────────────────────────────────────────────────────────────────────────
 */
import { motion } from "framer-motion";
import { PLAN_LABELS } from "../hooks/useQuota.js";

const BLUE = "#1565C0";

// ════════════════════════════════════════════════════════════════════════════
// QuotaBadge
// ════════════════════════════════════════════════════════════════════════════
export function QuotaBadge({ quota }) {
  const pct     = quota.limit > 0 ? quota.used / quota.limit : 1;
  const isLow   = quota.remaining <= 1 && quota.remaining > 0;
  const isEmpty = quota.remaining === 0;

  const bg    = isEmpty ? "#FEE2E2" : isLow ? "#FEF3C7" : "#E3F2FD";
  const color = isEmpty ? "#DC2626" : isLow ? "#D97706" : BLUE;
  const icon  = isEmpty ? "🔒"      : isLow ? "⚠️"      : "📖";

  return (
    <motion.div
      initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }}
      className="flex items-center justify-between rounded-2xl px-4 py-3"
      style={{ background: bg }}
    >
      <div className="flex items-center gap-2">
        <span style={{ fontSize:14 }}>{icon}</span>
        <span className="font-display text-sm font-bold" style={{ color }}>
          {isEmpty
            ? "Monthly limit reached"
            : `${quota.remaining} of ${quota.limit} stories left this month`}
        </span>
      </div>

      <div className="flex items-center gap-2">
        {/* Mini progress bar */}
        <div className="w-20 h-2 rounded-full overflow-hidden" style={{ background:"rgba(0,0,0,0.08)" }}>
          <motion.div
            initial={{ width:0 }}
            animate={{ width:`${Math.min(pct * 100, 100)}%` }}
            transition={{ duration:0.6, ease:"easeOut" }}
            className="h-full rounded-full"
            style={{ background: isEmpty ? "#DC2626" : isLow ? "#D97706" : BLUE }}
          />
        </div>
        {!isEmpty && (
          <span className="font-body text-xs" style={{ color, opacity:0.7 }}>
            {quota.used}/{quota.limit}
          </span>
        )}
      </div>
    </motion.div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// QuotaWall
// ════════════════════════════════════════════════════════════════════════════
export function QuotaWall({ quota, onUpgrade }) {
  return (
    <motion.div
      initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
      className="rounded-3xl p-6 text-center"
      style={{ background:"#FEF2F2", border:"2px solid #FECACA" }}
    >
      <motion.div
        animate={{ rotate:[0,-10,10,-10,0] }}
        transition={{ duration:0.5, repeat:Infinity, repeatDelay:3 }}
        className="text-4xl mb-3"
      >🔒</motion.div>

      <h3 className="font-display text-xl font-bold mb-1" style={{ color:"#DC2626" }}>
        Monthly limit reached
      </h3>
      <p className="font-body text-sm text-slate-500 mb-2 leading-relaxed">
        You've used all <strong>{quota.limit} stories</strong> for this month
        ({PLAN_LABELS[quota.planId] || "Free"} plan).
        Your stories reset on <strong>{quota.resetDate}</strong>.
      </p>
      <p className="font-body text-xs text-slate-400 mb-5">
        Upgrade for more stories and unlimited access.
      </p>

      {onUpgrade && (
        <motion.button
          whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}
          onClick={onUpgrade}
          className="px-6 py-3 rounded-2xl font-display text-sm font-bold text-white shadow-lg"
          style={{ background:`linear-gradient(135deg,${BLUE},#42A5F5)` }}
        >
          ✨ See plans & upgrade
        </motion.button>
      )}
    </motion.div>
  );
}
