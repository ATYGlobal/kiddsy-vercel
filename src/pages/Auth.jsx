/**
 * src/pages/Auth.jsx
 * "Welcome to the Kiddsy Family" — full auth screen
 * Supports: Google, Facebook, Magic Link, Email+Password
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, Sparkles, ArrowRight, CheckCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import EmojiSvg from "../utils/EmojiSvg.jsx";
import { C } from "../utils/designConfig.js";

// ─── Animated background bubbles ──────────────────────────────────────────
function MagicBubbles() {
  const bubbles = [
    { size: 80,  top: "8%",  left: "5%",  color: C.blueSoft,   delay: 0    },
    { size: 50,  top: "15%", left: "88%", color: "#FFF9C4",    delay: 0.5  },
    { size: 120, top: "72%", left: "2%",  color: "#FCE4EC",    delay: 1    },
    { size: 60,  top: "60%", left: "92%", color: "#E8F5E9",    delay: 0.3  },
    { size: 40,  top: "40%", left: "95%", color: "#E1F5FE",    delay: 0.8  },
    { size: 90,  top: "85%", left: "80%", color: "#FFF3E0",    delay: 0.2  },
    { size: 35,  top: "30%", left: "3%",  color: "#F3E5F5",    delay: 1.2  },
    { size: 55,  top: "90%", left: "40%", color: C.blueSoft,   delay: 0.6  },
  ];
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {bubbles.map((b, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{ width: b.size, height: b.size, top: b.top, left: b.left, background: b.color }}
          animate={{ y: [0, -20, 0], scale: [1, 1.06, 1] }}
          transition={{ duration: 5 + i * 0.7, delay: b.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
      {/* Floating stars */}
      {["✦","★","✦","★","✦"].map((s, i) => (
        <motion.span
          key={`s${i}`}
          className="absolute font-display text-xl select-none"
          style={{ top: `${20 + i * 15}%`, left: `${10 + i * 20}%`, color: C.yellow, opacity: 0.35 }}
          animate={{ rotate: 360, scale: [1, 1.3, 1] }}
          transition={{ duration: 4 + i, repeat: Infinity, ease: "linear" }}
        >
          {s}
        </motion.span>
      ))}
    </div>
  );
}

// ─── Social button ─────────────────────────────────────────────────────────
function SocialButton({ onClick, loading, bgColor, hoverColor, icon, label, textColor = "white" }) {
  return (
    <motion.button
      onClick={onClick}
      disabled={loading}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.97 }}
      className="w-full flex items-center gap-4 px-6 py-4 rounded-3xl font-display text-lg transition-all border-2 border-white shadow-md disabled:opacity-60"
      style={{ background: bgColor, color: textColor }}
    >
      <span className="flex-shrink-0">{icon}</span>
      <span className="flex-1 text-left">{loading ? "Connecting…" : label}</span>
      <ArrowRight size={18} className="opacity-60" />
    </motion.button>
  );
}

// ─── Google SVG icon ───────────────────────────────────────────────────────
const GoogleIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

// ─── Facebook SVG icon ─────────────────────────────────────────────────────
const FacebookIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

// ─── Main Auth Component ───────────────────────────────────────────────────
const MODES = { social: "social", magic: "magic", email: "email" };

export default function Auth({ onSuccess }) {
  const {
    loginWithGoogle, loginWithFacebook,
    loginWithMagicLink, loginWithEmail, registerWithEmail,
    authError, setAuthError,
  } = useAuth();

  const [mode, setMode]           = useState(MODES.social);
  const [subMode, setSubMode]     = useState("login"); // login | register
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [showPass, setShowPass]   = useState(false);
  const [loading, setLoading]     = useState("");
  const [magicSent, setMagicSent] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const clearError = () => setAuthError("");

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleGoogle = async () => {
    setLoading("google"); clearError();
    await loginWithGoogle(); // redirects away — no need to setLoading(false)
  };

  const handleFacebook = async () => {
    setLoading("facebook"); clearError();
    await loginWithFacebook();
  };

  const handleMagicLink = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading("magic"); clearError();
    const ok = await loginWithMagicLink(email);
    setLoading("");
    if (ok) setMagicSent(true);
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading("email"); clearError();

    const ok = subMode === "login"
      ? await loginWithEmail(email, password)
      : await registerWithEmail(email, password);

    setLoading("");
    if (ok) {
      if (subMode === "register") {
        setSuccessMsg(`Check your email to confirm your account! ${EmojiSvg({code:"1f4e7", size:14})}`);
      }
      // onSuccess will be called by AuthContext's onAuthStateChange listener
    }
  };

  // ── Animations ────────────────────────────────────────────────────────────
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 200 } },
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: "linear-gradient(145deg, #FFFDE7 0%, #E3F2FD 60%, #FCE4EC 100%)" }}
    >
      <MagicBubbles />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 180, damping: 20 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Card */}
        <div className="bg-white/90 backdrop-blur-xl rounded-5xl shadow-2xl border-4 border-white overflow-hidden">

          {/* Top color band */}
          <div
            className="h-2 w-full"
            style={{ background: `linear-gradient(90deg, ${C.blue}, ${C.red}, ${C.yellow}, ${C.green}, ${C.magenta})` }}
          />

          <div className="px-8 py-10">
            {/* Logo + headline */}
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="text-center mb-8">
              <motion.div variants={itemVariants} className="inline-block mb-4">
                {/* 
                  Replace this block with your real logo:
                  <img src={logoUrl} alt="Kiddsy" className="w-24 h-24 mx-auto object-contain" />
                */}
                <motion.div
                  animate={{ rotate: [0, -5, 5, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="w-20 h-20 mx-auto rounded-3xl border-4 flex items-center justify-center shadow-lg"
                  style={{ borderColor: C.yellow, background: C.blueSoft }}
                >
                  <span className="font-display text-3xl" style={{ color: C.blue }}>K</span>
                  <span className="font-display text-3xl" style={{ color: C.red }}>L</span>
                </motion.div>
              </motion.div>

              <motion.h1 variants={itemVariants} className="font-display text-3xl mb-1" style={{ color: C.blue }}>
                Welcome to the
              </motion.h1>
              <motion.div variants={itemVariants} className="font-display text-4xl mb-3">
                <span style={{ color: C.blue }}>Kiddsy </span>
                <span style={{ color: C.red }}>Family</span>
                <span className="ml-1">
                  <EmojiSvg code="2728" size={20} />
                </span>
              </motion.div>
              <motion.p variants={itemVariants} className="font-body text-slate-500 text-base">
                Sign in to save stories and track your child's progress.
              </motion.p>
            </motion.div>

            {/* Error banner */}
            <AnimatePresence>
              {authError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="mb-5 px-4 py-3 rounded-2xl font-body text-sm text-red-600 border border-red-200 bg-red-50 flex items-start gap-2"
                >
                  <span>
                    <EmojiSvg code="26a0" size={16} />
                  </span>
                  <span>{authError}</span>
                </motion.div>
              )}
              {successMsg && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                  className="mb-5 px-4 py-3 rounded-2xl font-body text-sm text-green-700 border border-green-200 bg-green-50 flex items-start gap-2"
                >
                  <CheckCircle size={16} className="mt-0.5 flex-shrink-0" />
                  <span dangerouslySetInnerHTML={{ __html: successMsg }} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── SOCIAL MODE (default) ─────────────────────────────────── */}
            <AnimatePresence mode="wait">
              {mode === MODES.social && (
                <motion.div key="social" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-3">
                  {/*
                  <SocialButton
                    onClick={handleGoogle}
                    loading={loading === "google"}
                    bgColor="white"
                    textColor="#374151"
                    icon={<GoogleIcon />}
                    label="Continue with Google"
                  />
                  <SocialButton
                    onClick={handleFacebook}
                    loading={loading === "facebook"}
                    bgColor={C.fb}
                    icon={<FacebookIcon />}
                    label="Continue with Facebook"
                  />
                  
                  <div className="flex items-center gap-3 my-4">
                    <div className="h-px flex-1 bg-slate-200" />
                    <span className="font-body text-xs text-slate-400 uppercase tracking-wider">or</span>
                    <div className="h-px flex-1 bg-slate-200" />
                  </div>
                    */}
                  {/* DEJAR ESTO: Son las opciones que sí funcionan fácil con Supabase */}
                  <SocialButton
                    onClick={() => { setMode(MODES.magic); clearError(); }}
                    loading={false}
                    bgColor={C.blueSoft}
                    textColor={C.blue}
                    icon={<Sparkles size={22} style={{ color: C.blue }} />}
                    label="Magic Link (no password)"
                  />
                  <SocialButton
                    onClick={() => { setMode(MODES.email); clearError(); }}
                    loading={false}
                    bgColor="#F8FAFC"
                    textColor="#374151"
                    icon={<Mail size={22} style={{ color: C.blue }} />}
                    label="Email & Password"
                  />
                </motion.div>
              )}

              {/* ── MAGIC LINK MODE ──────────────────────────────────────── */}
              {mode === MODES.magic && (
                <motion.div key="magic" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <AnimatePresence mode="wait">
                    {magicSent ? (
                      <motion.div
                        key="sent"
                        initial={{ scale: 0.85, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-center py-6"
                      >
                        <motion.div
                          animate={{ y: [0, -10, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="text-6xl mb-4"
                        >
                          <EmojiSvg code="1f4e9" size={48} />
                        </motion.div>
                        <h3 className="font-display text-2xl mb-2" style={{ color: C.blue }}>Check your inbox!</h3>
                        <p className="font-body text-slate-500 text-sm mb-6">
                          We sent a magic link to <strong>{email}</strong>. Click it to sign in instantly — no password needed!
                        </p>
                        <button onClick={() => { setMagicSent(false); setEmail(""); }} className="font-display text-sm" style={{ color: C.blue }}>
                          ← Try a different email
                        </button>
                      </motion.div>
                    ) : (
                      <motion.form key="form" onSubmit={handleMagicLink} className="space-y-4">
                        <div className="relative">
                          <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: C.blue }} />
                          <input
                            type="email" required value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your@email.com"
                            className="w-full pl-12 pr-5 py-4 rounded-2xl border-2 border-slate-200 font-body text-base focus:outline-none focus:border-blue-400 bg-blue-50 transition-colors placeholder-slate-300"
                          />
                        </div>
                        <motion.button
                          type="submit"
                          disabled={!email || loading === "magic"}
                          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                          className="w-full py-4 rounded-2xl font-display text-xl text-white shadow-lg disabled:opacity-50"
                          style={{ background: `linear-gradient(135deg, ${C.blue}, #42A5F5)` }}
                        >
                          {loading === "magic" ? "Sending…" : <><EmojiSvg code="2728" size={18} /> Send Magic Link</>}
                        </motion.button>
                      </motion.form>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}

              {/* ── EMAIL + PASSWORD MODE ─────────────────────────────── */}
              {mode === MODES.email && (
                <motion.div key="email-pw" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  {/* Login / Register toggle */}
                  <div className="flex bg-slate-100 rounded-2xl p-1 mb-5">
                    {["login", "register"].map((m) => (
                      <button
                        key={m}
                        onClick={() => { setSubMode(m); clearError(); setSuccessMsg(""); }}
                        className="flex-1 py-2.5 rounded-xl font-display text-sm transition-all capitalize"
                        style={{
                          background: subMode === m ? C.blue : "transparent",
                          color: subMode === m ? "white" : "#6B7280",
                        }}
                      >
                        {m === "login" ? "Sign In" : "Register"}
                      </button>
                    ))}
                  </div>

                  <form onSubmit={handleEmailAuth} className="space-y-3">
                    <div className="relative">
                      <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: C.blue }} />
                      <input
                        type="email" required value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="w-full pl-12 pr-5 py-4 rounded-2xl border-2 border-slate-200 font-body text-base focus:outline-none focus:border-blue-400 bg-blue-50 transition-colors placeholder-slate-300"
                      />
                    </div>
                    <div className="relative">
                      <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: C.blue }} />
                      <input
                        type={showPass ? "text" : "password"} required value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder={subMode === "register" ? "Create a password (min. 8 chars)" : "Password"}
                        minLength={subMode === "register" ? 8 : 1}
                        className="w-full pl-12 pr-12 py-4 rounded-2xl border-2 border-slate-200 font-body text-base focus:outline-none focus:border-blue-400 bg-blue-50 transition-colors placeholder-slate-300"
                      />
                      <button
                        type="button" onClick={() => setShowPass((s) => !s)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>

                    <motion.button
                      type="submit"
                      disabled={!email || !password || !!loading}
                      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                      className="w-full py-4 rounded-2xl font-display text-xl text-white shadow-lg disabled:opacity-50"
                      style={{ background: `linear-gradient(135deg, ${C.blue}, #42A5F5)` }}
                    >
                      {loading === "email"
                        ? "Please wait…"
                        : subMode === "login" 
                          ? <><EmojiSvg code="1f680" size={18} /> Sign In</>
                          : <><EmojiSvg code="2728" size={18} /> Create Account</>}
                    </motion.button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Back link */}
            {mode !== MODES.social && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mt-5">
                <button
                  onClick={() => { setMode(MODES.social); clearError(); setMagicSent(false); setEmail(""); setPassword(""); setSuccessMsg(""); }}
                  className="font-display text-sm"
                  style={{ color: C.blue }}
                >
                  ← Other sign-in options
                </button>
              </motion.div>
            )}

            {/* Legal note */}
            <p className="mt-6 font-body text-center text-xs text-slate-400 leading-relaxed">
              By continuing, you agree to our{" "}
              <a href="/legal" className="underline" style={{ color: C.blue }}>Terms of Use</a>
              {" "}and{" "}
              <a href="/legal" className="underline" style={{ color: C.blue }}>Privacy Policy</a>.
              <br />Kiddsy is COPPA-compliant and never tracks children.
            </p>
          </div>
        </div>

        {/* Bottom tagline */}
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          className="text-center mt-5 font-body text-slate-500 text-sm"
        >
          <EmojiSvg code="1f30d" size={14} /> Free for every family. Always.
        </motion.p>
      </motion.div>
    </div>
  );
}