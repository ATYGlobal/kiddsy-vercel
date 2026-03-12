/**
 * src/hooks/useQuota.js — Kiddsy
 * ─────────────────────────────────────────────────────────────────────────
 * Hook de cuotas del lado cliente.
 *
 * Responsabilidades:
 *   • Guarda el contador mensual en localStorage (offline-first)
 *   • Sincroniza con GET /api/quota al montar (si hay conexión)
 *   • Expone { used, limit, remaining, canGenerate, planId, resetDate }
 *   • Exporta checkBeforeGenerate() — llama antes de hacer el fetch SSE
 *   • Exporta recordGenerated()    — llama cuando SSE event:complete llega
 *
 * PLAN_LIMITS (espejo del servidor — fuente de verdad siempre en servidor):
 *   free          → 3
 *   plus          → 15
 *   annual        → 15
 *   family        → 25
 *   lifetime      → 20
 *   puzzles_only  → 0
 * ─────────────────────────────────────────────────────────────────────────
 */

import { useState, useEffect, useCallback } from "react";
import { getGuestId, lsGet, lsSet } from "../utils/storage.js";

// ── Client-side plan limits (mirror of server) ────────────────────────────
export const PLAN_LIMITS = {
  free:         3,
  plus:         15,
  annual:       15,
  family:       25,
  lifetime:     20,
  puzzles_only: 0,
};

export const PLAN_LABELS = {
  free:         "Free",
  plus:         "Kiddsy Plus",
  annual:       "Kiddsy Annual",
  family:       "Kiddsy Family",
  lifetime:     "Kiddsy Lifetime",
  puzzles_only: "Puzzles Only",
};

// LocalStorage key — includes month so it auto-resets
function quotaKey(guestId) {
  const now = new Date();
  const ym  = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  return `kiddsy_quota_${guestId}_${ym}`;
}

function nextResetDate() {
  const now  = new Date();
  const next = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  return next.toLocaleDateString("en-GB", { day: "numeric", month: "long" });
}

const API_URL = () =>
  window.location.hostname === "localhost"
    ? "http://localhost:10000"
    : "https://kiddsy-vercel.onrender.com";

// ═══════════════════════════════════════════════════════════════════════════
// useQuota hook
// ═══════════════════════════════════════════════════════════════════════════
export default function useQuota(planId = "free") {
  const guestId  = getGuestId();
  const safePlan = Object.keys(PLAN_LIMITS).includes(planId) ? planId : "free";
  const limit    = PLAN_LIMITS[safePlan];

  // Read from localStorage (instant, no network)
  const [used, setUsed] = useState(() => lsGet(quotaKey(guestId), 0));

  // Sync with server on mount
  useEffect(() => {
    fetch(`${API_URL()}/api/quota?guestId=${guestId}&planId=${safePlan}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.used !== undefined) {
          setUsed(data.used);
          lsSet(quotaKey(guestId), data.used);
        }
      })
      .catch(() => {/* offline — use localStorage value */});
  }, [guestId, safePlan]);

  /** Returns true if user can generate. Throws if blocked (for try/catch in StoryForm). */
  const checkBeforeGenerate = useCallback(() => {
    if (safePlan === "puzzles_only") {
      throw new Error("QUOTA_STORIES_NOT_INCLUDED");
    }
    if (used >= limit) {
      throw new Error("QUOTA_EXCEEDED");
    }
    return true;
  }, [used, limit, safePlan]);

  /** Call when SSE event:complete fires — increments local counter. */
  const recordGenerated = useCallback(() => {
    const next = used + 1;
    setUsed(next);
    lsSet(quotaKey(guestId), next);
  }, [used, guestId]);

  const isFree = safePlan === "free";

  return {
    planId:            safePlan,
    planLabel:         PLAN_LABELS[safePlan],
    limit,
    used,
    remaining:         Math.max(0, limit - used),
    canGenerate:       safePlan !== "puzzles_only" && used < limit,
    resetDate:         nextResetDate(),
    // Feature flags — what this plan includes
    hasIllustrations:  !isFree,   // free → text only, no DALL·E
    hasPremiumTTS:     !isFree,   // free → browser SpeechSynthesis
    hasVoicePicker:    !isFree,   // free → no voice selection
    checkBeforeGenerate,
    recordGenerated,
  };
}
