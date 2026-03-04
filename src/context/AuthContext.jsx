/**
 * src/context/AuthContext.jsx
 * Global auth state — wrap your <App /> with <AuthProvider>
 *
 * Usage anywhere in your app:
 *   const { user, profile, loading, logout } = useAuth();
 */
import { createContext, useContext, useEffect, useState } from "react";
import {
  supabase,
  upsertProfile,
  signOut,
  signInWithGoogle,
  signInWithFacebook,
  signInWithMagicLink,
  signInWithEmail,
  signUpWithEmail,
} from "../lib/supabase.js";

// ─── Context ───────────────────────────────────────────────────────────────
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);   // raw Supabase user object
  const [profile, setProfile] = useState(null);   // row from profiles table
  const [loading, setLoading] = useState(true);   // initial session check
  const [authError, setAuthError] = useState("");

  // ── Bootstrap: restore session on page load ──────────────────────────────
  useEffect(() => {
    let mounted = true;

    const bootstrap = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (mounted && session?.user) {
        setUser(session.user);
        const p = await upsertProfile(session.user);
        setProfile(p);
      }
      if (mounted) setLoading(false);
    };

    bootstrap();

    // Listen to auth state changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        if (event === "SIGNED_IN" && session?.user) {
          setUser(session.user);
          const p = await upsertProfile(session.user);
          setProfile(p);
          setAuthError("");
        } else if (event === "SIGNED_OUT") {
          setUser(null);
          setProfile(null);
        } else if (event === "TOKEN_REFRESHED" && session?.user) {
          setUser(session.user);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // ── Auth actions ─────────────────────────────────────────────────────────
  const loginWithGoogle = async () => {
    setAuthError("");
    const { error } = await signInWithGoogle();
    if (error) setAuthError(error.message);
  };

  const loginWithFacebook = async () => {
    setAuthError("");
    const { error } = await signInWithFacebook();
    if (error) setAuthError(error.message);
  };

  const loginWithMagicLink = async (email) => {
    setAuthError("");
    const { error } = await signInWithMagicLink(email);
    if (error) { setAuthError(error.message); return false; }
    return true; // show "check your email" message
  };

  const loginWithEmail = async (email, password) => {
    setAuthError("");
    const { error } = await signInWithEmail(email, password);
    if (error) { setAuthError(error.message); return false; }
    return true;
  };

  const registerWithEmail = async (email, password) => {
    setAuthError("");
    const { error } = await signUpWithEmail(email, password);
    if (error) { setAuthError(error.message); return false; }
    return true;
  };

  const logout = async () => {
    await signOut();
    setUser(null);
    setProfile(null);
  };

  // ── Display helpers ───────────────────────────────────────────────────────
  const displayName =
    profile?.full_name ??
    user?.user_metadata?.full_name ??
    user?.email?.split("@")[0] ??
    "Friend";

  const avatarUrl =
    profile?.avatar_url ??
    user?.user_metadata?.avatar_url ??
    null;

  const firstName = displayName.split(" ")[0];

  // ── Context value ─────────────────────────────────────────────────────────
  const value = {
    user,
    profile,
    loading,
    authError,
    setAuthError,
    isAuthenticated: !!user,
    displayName,
    firstName,
    avatarUrl,
    // Actions
    loginWithGoogle,
    loginWithFacebook,
    loginWithMagicLink,
    loginWithEmail,
    registerWithEmail,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ─── Hook ──────────────────────────────────────────────────────────────────
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
