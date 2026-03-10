/**
 * src/components/Footer.jsx — Kiddsy
 * ─────────────────────────────────────────────────────────────────────────
 * Props: { onNav }
 * Secciones:
 *   · Newsletter "Kiddsy Club" con validación y estado de éxito
 *   · Links de navegación principales
 *   · Links legales (Aviso Legal, Privacidad)
 *   · Copyright
 * ─────────────────────────────────────────────────────────────────────────
 */
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Heart, Shield, Sparkles, CheckCircle, Star, BookOpen } from "lucide-react";

// ── Paleta ────────────────────────────────────────────────────────────────
const C = {
  blue:       "#1565C0",
  blueSoft:   "#E3F2FD",
  blueMid:    "#1976D2",
  yellow:     "#F9A825",
  yellowSoft: "#FFFDE7",
  orange:     "#E65100",
  green:      "#43A047",
  greenSoft:  "#E8F5E9",
  magenta:    "#D81B60",
  cyan:       "#00ACC1",
  slate:      "#64748B",
  slateLight: "#94A3B8",
};

const FF = "var(--font-display,'Nunito',ui-rounded,sans-serif)";
const FB = "var(--font-body,'Nunito',sans-serif)";

// ── Decorative star ───────────────────────────────────────────────────────
function FloatingStar({ style }) {
  return (
    <motion.div
      style={{ position: "absolute", pointerEvents: "none", ...style }}
      animate={{ y: [0, -8, 0], rotate: [0, 15, -15, 0], opacity: [0.35, 0.65, 0.35] }}
      transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, ease: "easeInOut", delay: Math.random() * 2 }}
    >
      <Star size={style.size || 14} fill={style.color || C.yellow} color={style.color || C.yellow} strokeWidth={0}/>
    </motion.div>
  );
}

// ── Newsletter block ──────────────────────────────────────────────────────
function NewsletterBlock() {
  const [email,   setEmail]   = useState("");
  const [success, setSuccess] = useState(false);
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);

  const validateEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

  const handleSubmit = async () => {
    if (!email.trim()) { setError("Enter your email first 📧"); return; }
    if (!validateEmail(email)) { setError("That doesn't look like a valid email 🙈"); return; }
    setError("");
    setLoading(true);

    // TODO: conectar a tu endpoint real, p.ej.:
    // await fetch("/api/newsletter", { method:"POST", body: JSON.stringify({ email }) });
    await new Promise(r => setTimeout(r, 900)); // simula llamada API

    setLoading(false);
    setSuccess(true);
  };

  return (
    <div style={{
      position:     "relative",
      background:   "linear-gradient(135deg, #E3F2FD 0%, #FFFDE7 60%, #E8F5E9 100%)",
      borderRadius: 28,
      padding:      "28px 24px 24px",
      border:       "2.5px solid rgba(255,255,255,0.9)",
      boxShadow:    "0 8px 32px rgba(21,101,192,0.10), 0 2px 8px rgba(0,0,0,0.04)",
      overflow:     "hidden",
      marginBottom: 32,
    }}>
      {/* Decorative blobs */}
      <div style={{
        position: "absolute", top: -20, right: -20,
        width: 100, height: 100, borderRadius: "50%",
        background: C.yellow + "22", pointerEvents: "none",
      }}/>
      <div style={{
        position: "absolute", bottom: -16, left: -16,
        width: 72, height: 72, borderRadius: "50%",
        background: C.blue + "18", pointerEvents: "none",
      }}/>

      {/* Floating stars */}
      <FloatingStar style={{ top: 10,  right: 40,  size: 12, color: C.yellow }}/>
      <FloatingStar style={{ top: 30,  right: 80,  size: 8,  color: C.cyan   }}/>
      <FloatingStar style={{ bottom:16, left: 32,  size: 10, color: C.magenta}}/>

      {/* Icon badge */}
      <div style={{
        display:         "inline-flex",
        alignItems:      "center",
        gap:             6,
        padding:         "5px 14px",
        borderRadius:    999,
        background:      C.blue,
        color:           "white",
        fontFamily:      FF,
        fontWeight:      800,
        fontSize:        11,
        letterSpacing:   "0.06em",
        textTransform:   "uppercase",
        marginBottom:    12,
        boxShadow:       `0 3px 10px ${C.blue}40`,
      }}>
        <Sparkles size={11}/> Kiddsy Club
      </div>

      {/* Heading */}
      <h3 style={{
        fontFamily:  FF,
        fontWeight:  900,
        fontSize:    "clamp(18px, 4vw, 24px)",
        color:       C.blue,
        margin:      "0 0 6px",
        lineHeight:  1.2,
      }}>
        ¡Únete al club de las aventuras! 🚀
      </h3>
      <p style={{
        fontFamily:  FB,
        fontSize:    13,
        color:       C.slate,
        margin:      "0 0 18px",
        lineHeight:  1.5,
        maxWidth:    420,
      }}>
        Nuevas historias, actividades y sorpresas directamente a tu correo.
        Solo cosas buenas — nunca spam. ✨
      </p>

      <AnimatePresence mode="wait">
        {success ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.92, y: 8 }}
            animate={{ opacity: 1, scale: 1,    y: 0 }}
            exit={{   opacity: 0, scale: 0.92         }}
            style={{
              display:      "flex",
              alignItems:   "center",
              gap:          10,
              padding:      "14px 18px",
              borderRadius: 16,
              background:   C.greenSoft,
              border:       `2px solid ${C.green}44`,
            }}
          >
            <CheckCircle size={20} strokeWidth={2.5} style={{ color: C.green, flexShrink: 0 }}/>
            <div>
              <div style={{ fontFamily: FF, fontWeight: 800, fontSize: 14, color: C.green }}>
                ¡Ya eres del club! 🎉
              </div>
              <div style={{ fontFamily: FB, fontSize: 12, color: C.slate, marginTop: 2 }}>
                Revisa tu bandeja de entrada — y no olvides la carpeta de spam.
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div key="form" initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* Input + Button row */}
            <div style={{
              display:   "flex",
              gap:       8,
              flexWrap:  "wrap",
            }}>
              {/* Email input */}
              <div style={{ flex: "1 1 220px", position: "relative" }}>
                <Mail
                  size={15}
                  strokeWidth={2}
                  style={{
                    position:  "absolute",
                    left:      13,
                    top:       "50%",
                    transform: "translateY(-50%)",
                    color:     C.slateLight,
                    pointerEvents: "none",
                  }}
                />
                <input
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError(""); }}
                  onKeyDown={e => e.key === "Enter" && handleSubmit()}
                  placeholder="tu@email.com — ¡te esperamos!"
                  style={{
                    width:        "100%",
                    padding:      "12px 14px 12px 36px",
                    borderRadius: 14,
                    border:       `2px solid ${error ? "#E53935" : "rgba(21,101,192,0.15)"}`,
                    background:   "white",
                    fontFamily:   FB,
                    fontSize:     13,
                    color:        "#1E293B",
                    outline:      "none",
                    boxShadow:    "0 2px 8px rgba(21,101,192,0.08)",
                    transition:   "border-color 0.15s",
                    boxSizing:    "border-box",
                  }}
                  onFocus={e  => { e.target.style.borderColor = C.blue; }}
                  onBlur={e   => { e.target.style.borderColor = error ? "#E53935" : "rgba(21,101,192,0.15)"; }}
                />
              </div>

              {/* Submit button */}
              <motion.button
                whileHover={{ scale: 1.04, boxShadow: `0 6px 20px ${C.orange}55` }}
                whileTap={{ scale: 0.96 }}
                onClick={handleSubmit}
                disabled={loading}
                style={{
                  padding:      "12px 22px",
                  borderRadius: 14,
                  border:       "none",
                  background:   loading
                    ? C.slateLight
                    : `linear-gradient(135deg, ${C.yellow}, ${C.orange})`,
                  color:        loading ? "white" : "#7C2D00",
                  fontFamily:   FF,
                  fontWeight:   800,
                  fontSize:     13,
                  cursor:       loading ? "not-allowed" : "pointer",
                  whiteSpace:   "nowrap",
                  boxShadow:    `0 4px 14px ${C.yellow}55`,
                  display:      "flex",
                  alignItems:   "center",
                  gap:          6,
                  transition:   "background 0.2s",
                  flexShrink:   0,
                }}
              >
                {loading ? (
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                    style={{ display: "flex" }}
                  >
                    <Sparkles size={14}/>
                  </motion.span>
                ) : (
                  <Sparkles size={14}/>
                )}
                {loading ? "Enviando…" : "¡Apuntarme!"}
              </motion.button>
            </div>

            {/* Error message */}
            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  style={{
                    fontFamily: FB,
                    fontSize:   12,
                    color:      "#E53935",
                    marginTop:  7,
                    marginBottom: 0,
                  }}
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            {/* Fine print */}
            <p style={{
              fontFamily: FB,
              fontSize:   11,
              color:      C.slateLight,
              marginTop:  9,
              marginBottom: 0,
            }}>
              Newsletter Kiddsy Club · Puedes darte de baja en cada email con un clic ·{" "}
              <a href="mailto:hello@kiddsy.org"
                style={{ color: C.blue, textDecoration: "none", fontWeight: 600 }}>
                hello@kiddsy.org
              </a>
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── NavLink helper ────────────────────────────────────────────────────────
function NavLink({ onClick, color, icon: Icon, children }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.06, y: -1 }}
      whileTap={{ scale: 0.95 }}
      style={{
        display:      "inline-flex",
        alignItems:   "center",
        gap:          5,
        padding:      "5px 12px",
        borderRadius: 999,
        border:       `1.5px solid ${color}30`,
        background:   color + "10",
        color:        color,
        fontFamily:   FF,
        fontWeight:   700,
        fontSize:     12,
        cursor:       "pointer",
        transition:   "background 0.14s",
        whiteSpace:   "nowrap",
      }}
      onMouseEnter={e => { e.currentTarget.style.background = color + "20"; }}
      onMouseLeave={e => { e.currentTarget.style.background = color + "10"; }}
    >
      {Icon && <Icon size={12} strokeWidth={2.5}/>}
      {children}
    </motion.button>
  );
}

// ── Divider ───────────────────────────────────────────────────────────────
function Divider() {
  return (
    <div style={{
      height:     1,
      background: "linear-gradient(90deg, transparent, rgba(21,101,192,0.12) 30%, rgba(21,101,192,0.12) 70%, transparent)",
      margin:     "20px 0",
    }}/>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// FOOTER
// ═══════════════════════════════════════════════════════════════════════════
export default function Footer({ onNav }) {
  return (
    <footer style={{
      position:   "relative",
      zIndex:     10,
      borderTop:  "2px solid rgba(21,101,192,0.07)",
      background: "linear-gradient(180deg, rgba(255,253,231,0) 0%, rgba(227,242,253,0.45) 100%)",
      padding:    "40px 0 24px",
    }}>
      <div style={{
        maxWidth:  680,
        margin:    "0 auto",
        padding:   "0 20px",
      }}>

        {/* ── Newsletter ─────────────────────────────────────────────── */}
        <NewsletterBlock/>

        {/* ── Logo + tagline ─────────────────────────────────────────── */}
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <motion.button
            onClick={() => onNav("hero")}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            style={{
              display:      "inline-flex",
              alignItems:   "center",
              gap:          10,
              background:   "none",
              border:       "none",
              cursor:       "pointer",
              marginBottom: 8,
            }}
          >
            <img src="/kiddsy-logo.png" alt="Kiddsy"
              style={{ width: 36, height: 36, objectFit: "contain" }}
            />
            <span style={{
              fontFamily: FF,
              fontWeight: 900,
              fontSize:   22,
              color:      C.blue,
            }}>Kiddsy</span>
          </motion.button>
          <p style={{
            fontFamily: FB,
            fontSize:   13,
            color:      C.slate,
            margin:     0,
            lineHeight: 1.5,
          }}>
            Bilingual stories for families learning English together 🌍
          </p>
        </div>

        <Divider/>

        {/* ── Main nav links ──────────────────────────────────────────── */}
        <div style={{
          display:        "flex",
          flexWrap:       "wrap",
          justifyContent: "center",
          gap:            8,
          marginBottom:   16,
        }}>
          <NavLink onClick={() => onNav("library")}   color={C.blue}    icon={BookOpen}>Stories</NavLink>
          <NavLink onClick={() => onNav("games")}     color="#E53935"   icon={null}>🎮 Games</NavLink>
          <NavLink onClick={() => onNav("education")} color={C.orange}  icon={null}>📖 Learn ABC</NavLink>
          <NavLink onClick={() => onNav("donate")}    color={C.yellow}  icon={Heart}>Support us</NavLink>
          <NavLink onClick={() => onNav("collaborate")} color={C.magenta} icon={null}>🤝 Collaborate</NavLink>
        </div>

        <Divider/>

        {/* ── Legal links ────────────────────────────────────────────── */}
        <div style={{
          display:        "flex",
          flexWrap:       "wrap",
          justifyContent: "center",
          alignItems:     "center",
          gap:            10,
          marginBottom:   20,
        }}>
          <motion.button
            onClick={() => onNav("aviso-legal")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              display:    "inline-flex",
              alignItems: "center",
              gap:        4,
              background: "none",
              border:     "none",
              cursor:     "pointer",
              fontFamily: FB,
              fontSize:   11,
              color:      C.slateLight,
              padding:    "4px 2px",
            }}
          >
            <Shield size={11} strokeWidth={2}/> Aviso Legal
          </motion.button>

          <span style={{ color: "#CBD5E1", fontSize: 11 }}>·</span>

          <motion.button
            onClick={() => onNav("privacidad")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              display:    "inline-flex",
              alignItems: "center",
              gap:        4,
              background: "none",
              border:     "none",
              cursor:     "pointer",
              fontFamily: FB,
              fontSize:   11,
              color:      C.slateLight,
              padding:    "4px 2px",
            }}
          >
            <Shield size={11} strokeWidth={2}/> Privacidad
          </motion.button>

          <span style={{ color: "#CBD5E1", fontSize: 11 }}>·</span>

          <motion.button
            onClick={() => onNav("legal")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              background: "none",
              border:     "none",
              cursor:     "pointer",
              fontFamily: FB,
              fontSize:   11,
              color:      C.slateLight,
              padding:    "4px 2px",
            }}
          >
            Help & FAQ
          </motion.button>

          <span style={{ color: "#CBD5E1", fontSize: 11 }}>·</span>

          <a
            href="mailto:hello@kiddsy.org"
            style={{
              display:        "inline-flex",
              alignItems:     "center",
              gap:            4,
              fontFamily:     FB,
              fontSize:       11,
              color:          C.blue,
              textDecoration: "none",
              padding:        "4px 2px",
            }}
          >
            <Mail size={11} strokeWidth={2}/> hello@kiddsy.org
          </a>
        </div>

        {/* ── Copyright ──────────────────────────────────────────────── */}
        <div style={{ textAlign: "center" }}>
          <p style={{
            fontFamily: FB,
            fontSize:   11,
            color:      C.slateLight,
            margin:     0,
            display:    "flex",
            alignItems: "center",
            justifyContent: "center",
            gap:        5,
            flexWrap:   "wrap",
          }}>
            <span>© {new Date().getFullYear()} Kiddsy</span>
            <Heart size={10} fill={C.magenta} color={C.magenta} strokeWidth={0}/>
            <span>Free for every family · Made in France 🇫🇷</span>
          </p>
        </div>

      </div>
    </footer>
  );
}
