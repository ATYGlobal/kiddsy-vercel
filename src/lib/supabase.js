/**
 * src/lib/supabase.js
 * Supabase client — uses VITE env vars (safe for frontend)
 *
 * Add to your .env file:
 *   VITE_SUPABASE_URL=https://xxxx.supabase.co
 *   VITE_SUPABASE_ANON_KEY=eyJhbGci...
 */
import { createClient } from "@supabase/supabase-js";

const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnon = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnon) {
  console.warn(
    "⚠️  Supabase env vars missing. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file."
  );
}

export const supabase = createClient(supabaseUrl ?? "", supabaseAnon ?? "", {
  auth: {
    // Persist session in localStorage automatically
    persistSession: true,
    // Redirect after OAuth — must match your Supabase project's "Redirect URLs"
    redirectTo: `${window.location.origin}/auth/callback`,
  },
});

// ─── Auth helpers ──────────────────────────────────────────────────────────

/** Sign in with Google OAuth */
export const signInWithGoogle = () =>
  supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
      queryParams: { access_type: "offline", prompt: "consent" },
    },
  });

/** Sign in with Facebook OAuth */
export const signInWithFacebook = () =>
  supabase.auth.signInWithOAuth({
    provider: "facebook",
    options: { redirectTo: `${window.location.origin}/auth/callback` },
  });

/** Send a Magic Link to the user's email */
export const signInWithMagicLink = (email) =>
  supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`,
      shouldCreateUser: true,
    },
  });

/** Sign up with email + password */
export const signUpWithEmail = (email, password) =>
  supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
  });

/** Sign in with email + password */
export const signInWithEmail = (email, password) =>
  supabase.auth.signInWithPassword({ email, password });

/** Sign out */
export const signOut = () => supabase.auth.signOut();

/** Get current session */
export const getSession = () => supabase.auth.getSession();

// ─── Profile helpers ───────────────────────────────────────────────────────

/**
 * Upsert user profile — called once after every login.
 * Creates the profile if first time, updates last_seen otherwise.
 */
export async function upsertProfile(user) {
  if (!user) return null;
  const { data, error } = await supabase
    .from("profiles")
    .upsert(
      {
        id: user.id,
        email: user.email,
        full_name:
          user.user_metadata?.full_name ??
          user.user_metadata?.name ??
          user.email?.split("@")[0] ??
          "Friend",
        avatar_url:
          user.user_metadata?.avatar_url ??
          user.user_metadata?.picture ??
          null,
        last_seen: new Date().toISOString(),
      },
      { onConflict: "id" }
    )
    .select()
    .single();

  if (error) console.error("Profile upsert error:", error.message);
  return data;
}

// ─── Story helpers ─────────────────────────────────────────────────────────

/** Save a generated story to the user's library */
export async function saveStory(userId, story) {
  const { data, error } = await supabase
    .from("saved_stories")
    .insert({
      user_id: userId,
      story_id: story.id,
      title: story.title,
      emoji: story.emoji,
      color: story.color,
      pages: story.pages,
      image_url: story.image_url ?? null,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/** Fetch all stories saved by the logged-in user */
export async function fetchMyStories(userId) {
  const { data, error } = await supabase
    .from("saved_stories")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

/** Delete a saved story */
export async function deleteStory(storyDbId) {
  const { error } = await supabase
    .from("saved_stories")
    .delete()
    .eq("id", storyDbId);
  if (error) throw error;
}
