/**
 * src/utils/storage.js — Kiddsy
 * LocalStorage helpers, getGuestId, Supabase client, saveStory, fetchUserStories
 */

// ── Claves ────────────────────────────────────────────────────────────────
export const LS_NAME    = "kiddsy_childName";
export const LS_STORIES = "kiddsy_guestStories";
export const LS_LANG    = "kiddsy_lang";

// ── LocalStorage helpers ──────────────────────────────────────────────────
export function lsGet(key, fallback = null) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
  catch { return fallback; }
}

export function lsSet(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

// ── Guest ID persistente ──────────────────────────────────────────────────
export const getGuestId = () => {
  let gid = localStorage.getItem("kiddsy_guest_id");
  if (!gid) {
    gid = crypto.randomUUID();
    localStorage.setItem("kiddsy_guest_id", gid);
  }
  return gid;
};

// ── Supabase client (lazy init — no falla si no está configurado) ─────────
// Para activar: npm install @supabase/supabase-js y añade en .env:
//   VITE_SUPABASE_URL=https://xxxx.supabase.co
//   VITE_SUPABASE_ANON_KEY=your-anon-key
let _supabase = null;
export function getSupabase() {
  if (_supabase) return _supabase;
  try {
    const url = import.meta.env.VITE_SUPABASE_URL;
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
    if (!url || !key) return null;
    // Descomenta cuando instales @supabase/supabase-js:
    // import { createClient } from "@supabase/supabase-js";
    // _supabase = createClient(url, key);
    return null; // placeholder
  } catch { return null; }
}

/**
 * Guarda un cuento en Supabase + localStorage (siempre como backup).
 */
export async function saveStory(storyData, userId) {
  const sb = getSupabase();
  if (sb) {
    const { error } = await sb.from("stories").insert([{ ...storyData, user_id: userId }]);
    if (error) console.error("[Kiddsy] Supabase save error:", error.message);
  }
  const existing = lsGet(LS_STORIES, []);
  lsSet(LS_STORIES, [storyData, ...existing].slice(0, 20));
}

/**
 * Lee los cuentos del usuario (Supabase si disponible, si no localStorage).
 */
export async function fetchUserStories(userId) {
  const sb = getSupabase();
  if (sb) {
    const { data, error } = await sb
      .from("stories").select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (!error && data) return data;
    console.error("[Kiddsy] Supabase fetch error:", error?.message);
  }
  return lsGet(LS_STORIES, []);
}
