/**
 * api/usageQuota.js — Kiddsy
 * ─────────────────────────────────────────────────────────────────────────
 * Middleware de cuotas mensuales para /api/generate-story
 *
 * PLANS & LIMITS (based on cost analysis):
 *   free          → 3  stories/month  (cost ~$1.98  at $0.66/story)
 *   plus          → 15 stories/month  (cost ~$9.90  at $0.66/story)
 *   annual        → 15 stories/month  (cost ~$9.90/mo)
 *   family        → 25 stories/month  (cost ~$16.50 at $0.66/story)
 *   lifetime      → 20 stories/month  (cost ~$13.20 at $0.66/story)
 *   puzzles_only  → 0  stories/month  (no AI — 100% margin)
 *
 * STORAGE:
 *   • Dev/MVP:  in-memory Map (resets on server restart — acceptable for MVP)
 *   • Prod:     drop-in Redis upgrade (see REDIS section below)
 *
 * HOW IT WORKS:
 *   Client sends { guestId, planId } in the request body.
 *   Middleware checks a counter keyed by `guestId:YYYY-MM`.
 *   If under limit → attach quota info to req → next().
 *   If over limit  → 429 JSON with { error, plan, used, limit, resetDate }.
 * ─────────────────────────────────────────────────────────────────────────
 */

// ── Plan limits ────────────────────────────────────────────────────────────
export const PLAN_LIMITS = {
  free:         3,
  plus:         15,
  annual:       15,
  family:       25,
  lifetime:     20,
  puzzles_only: 0,    // no stories included
};

// Friendly plan labels for error messages
const PLAN_LABELS = {
  free:         "Free",
  plus:         "Kiddsy Plus",
  annual:       "Kiddsy Annual",
  family:       "Kiddsy Family",
  lifetime:     "Kiddsy Lifetime",
  puzzles_only: "Puzzles Only",
};

// ── In-memory store (Map<"guestId:YYYY-MM", count>) ───────────────────────
// For production, replace with Redis (see below).
const usageStore = new Map();

// ── Redis-ready upgrade (uncomment when you add redis client) ─────────────
// import { createClient } from "redis";
// const redis = createClient({ url: process.env.REDIS_URL });
// await redis.connect();
//
// async function getCount(key) {
//   const v = await redis.get(key);
//   return v ? parseInt(v, 10) : 0;
// }
// async function incCount(key) {
//   const count = await redis.incr(key);
//   if (count === 1) {
//     // expire at start of next month
//     const now = new Date();
//     const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
//     const ttl = Math.floor((nextMonth - now) / 1000);
//     await redis.expire(key, ttl);
//   }
//   return count;
// }

// ── In-memory helpers ──────────────────────────────────────────────────────
function monthKey(guestId) {
  const now = new Date();
  const ym  = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  return `${guestId}:${ym}`;
}

function getCount(key) {
  return usageStore.get(key) ?? 0;
}

function incCount(key) {
  const next = (usageStore.get(key) ?? 0) + 1;
  usageStore.set(key, next);
  return next;
}

// First day of next month (UTC) for "reset date" in error messages
function nextResetDate() {
  const now  = new Date();
  const next = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1));
  return next.toISOString().slice(0, 10); // "YYYY-MM-DD"
}

// ── GET /api/quota — let client check remaining without generating ─────────
export function quotaStatusHandler(req, res) {
  const { guestId, planId = "free" } = req.query;
  if (!guestId) return res.status(400).json({ error: "guestId required" });

  const limit = PLAN_LIMITS[planId] ?? PLAN_LIMITS.free;
  const key   = monthKey(guestId);
  const used  = getCount(key);

  res.json({
    planId,
    limit,
    used,
    remaining:  Math.max(0, limit - used),
    resetDate:  nextResetDate(),
    canGenerate: used < limit,
  });
}

// ── Middleware: checkQuota ─────────────────────────────────────────────────
export function checkQuota(req, res, next) {
  const { guestId, planId = "free" } = req.body;

  // If no guestId, let it through (server will still need it for counting)
  // In production you'd always require a guestId.
  if (!guestId) {
    console.warn("[Quota] No guestId provided — applying free tier limit.");
    req.quota = { planId: "free", limit: PLAN_LIMITS.free, used: 0, key: "anonymous" };
    return next();
  }

  const planKey = Object.keys(PLAN_LIMITS).includes(planId) ? planId : "free";
  const limit   = PLAN_LIMITS[planKey];

  // puzzles_only: stories are completely blocked
  if (planKey === "puzzles_only") {
    return res.status(403).json({
      error:     "Stories are not included in the Puzzles Only plan.",
      plan:      PLAN_LABELS[planKey],
      upgradeUrl:"/pricing",
    });
  }

  const key  = monthKey(guestId);
  const used = getCount(key);

  if (used >= limit) {
    console.log(`[Quota] BLOCKED  ${guestId} · plan=${planKey} · used=${used}/${limit}`);
    return res.status(429).json({
      error:     `You've reached your ${limit} story limit for this month.`,
      plan:      PLAN_LABELS[planKey],
      used,
      limit,
      remaining: 0,
      resetDate: nextResetDate(),
      upgradeUrl:"/pricing",
    });
  }

  // Attach quota info so the route can log / return it
  req.quota = { planId: planKey, limit, used, key };
  next();
}

// ── Post-generation: increment counter ────────────────────────────────────
// Call this AFTER the story is successfully generated (in the route handler).
export function incrementQuota(req) {
  if (!req.quota?.key || req.quota.key === "anonymous") return;
  const newCount = incCount(req.quota.key);
  console.log(`[Quota] COUNTED  ${req.quota.key.split(":")[0]} · plan=${req.quota.planId} · used=${newCount}/${req.quota.limit}`);
  req.quota.used = newCount;
}

// ── Admin: reset a user's monthly count (for support / refunds) ───────────
export function resetUserQuota(guestId) {
  const key = monthKey(guestId);
  usageStore.delete(key);
  console.log(`[Quota] RESET    ${guestId}`);
}

// ── GET /api/admin/quota-stats — basic usage overview ─────────────────────
export function quotaStatsHandler(_req, res) {
  const stats = {};
  for (const [key, count] of usageStore.entries()) {
    stats[key] = count;
  }
  res.json({ totalKeys: usageStore.size, entries: stats });
}
