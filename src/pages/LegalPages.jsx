/**
 * src/pages/LegalPages.jsx — Kiddsy
 * ─────────────────────────────────────────────────────────────────────────
 * Exports: { AvisoLegal, Privacidad }
 * Props:   { onNav }
 *
 * Auto-detecta el idioma del dispositivo (navigator.language) y muestra
 * el contenido en el idioma del usuario. Fallback: inglés.
 * Todos los textos en src/data/legalTranslations.js
 * ─────────────────────────────────────────────────────────────────────────
 */
import React, { useMemo } from "react";
import { motion } from "framer-motion";
import {
  FileText, Shield, ArrowLeft, Baby, Lock,
  Eye, Globe, Mail, AlertCircle,
} from "lucide-react";
import { LEGAL_T, detectLang } from "../data/legalTranslations.js";

// ── Paleta ────────────────────────────────────────────────────────────────
const C = {
  blue:        "#1565C0", blueSoft:    "#E3F2FD",
  red:         "#E53935", redSoft:     "#FFEBEE",
  yellow:      "#F9A825", yellowSoft:  "#FFFDE7",
  green:       "#43A047", greenSoft:   "#E8F5E9",
  magenta:     "#D81B60", magentaSoft: "#FCE4EC",
  cyan:        "#00ACC1", cyanSoft:    "#E0F7FA",
};

// Mapa icono-string → componente Lucide
const ICON_MAP = { Lock, AlertCircle, Globe, Eye, Baby, Mail, Shield, FileText };

// Mapa color-string → tokens de paleta
const COLOR_MAP = {
  blue:    { color: C.blue,    bg: C.blueSoft    },
  red:     { color: C.red,     bg: C.redSoft     },
  green:   { color: C.green,   bg: C.greenSoft   },
  magenta: { color: C.magenta, bg: C.magentaSoft },
  cyan:    { color: C.cyan,    bg: C.cyanSoft    },
  yellow:  { color: C.yellow,  bg: C.yellowSoft  },
};

const FF = "var(--font-display,'Nunito',sans-serif)";
const FB = "var(--font-body,'Nunito',sans-serif)";

// ── Hook: idioma activo ───────────────────────────────────────────────────
function useLegalT() {
  return useMemo(() => {
    const code = detectLang();
    return LEGAL_T[code] ?? LEGAL_T.en;
  }, []);
}

// ── Shared UI components ──────────────────────────────────────────────────
function PageHeader({ icon: Icon, iconColor, iconBg, title, subtitle }) {
  return (
    <div style={{ textAlign: "center", padding: "48px 16px 32px" }}>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1,   opacity: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
        style={{
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          width: 64, height: 64, borderRadius: 20,
          background: iconBg, marginBottom: 16,
          boxShadow: "0 4px 16px rgba(0,0,0,0.07)",
        }}
      >
        <Icon size={28} style={{ color: iconColor }} strokeWidth={2}/>
      </motion.div>
      <motion.h1
        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        style={{ fontFamily: FF, fontWeight: 800, fontSize: 36, color: iconColor, margin: "0 0 10px" }}
      >
        {title}
      </motion.h1>
      <p style={{ fontFamily: FB, fontSize: 15, color: "#64748B", maxWidth: 480, margin: "0 auto", lineHeight: 1.6 }}>
        {subtitle}
      </p>
    </div>
  );
}

function BackButton({ onNav, label, dest = "legal" }) {
  return (
    <motion.button
      whileHover={{ scale: 1.03, x: -2 }} whileTap={{ scale: 0.96 }}
      onClick={() => onNav(dest)}
      style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        padding: "9px 18px", borderRadius: 999, border: "none",
        background: C.blueSoft, color: C.blue,
        fontFamily: FF, fontWeight: 700, fontSize: 13,
        cursor: "pointer", marginBottom: 24,
      }}
    >
      <ArrowLeft size={15} strokeWidth={2}/> {label}
    </motion.button>
  );
}

function Section({ title, accent = C.blue, children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      style={{
        background: "white", borderRadius: 20, padding: "20px 24px",
        marginBottom: 12, border: "2px solid #F1F5F9",
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
      }}
    >
      <h3 style={{ fontFamily: FF, fontWeight: 700, fontSize: 16, color: accent, margin: "0 0 10px" }}>
        {title}
      </h3>
      <div style={{ fontFamily: FB, fontSize: 14, color: "#475569", lineHeight: 1.7 }}>
        {children}
      </div>
    </motion.div>
  );
}

function InfoBanner({ icon: Icon, color, bg, children }) {
  return (
    <div style={{
      display: "flex", gap: 12, alignItems: "flex-start",
      padding: "14px 18px", borderRadius: 16, background: bg,
      border: `2px solid ${color}22`, marginBottom: 20,
    }}>
      <Icon size={18} strokeWidth={2} style={{ color, flexShrink: 0, marginTop: 2 }}/>
      <p style={{ fontFamily: FB, fontSize: 13, color: "#475569", margin: 0, lineHeight: 1.6 }}>
        {children}
      </p>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// AVISO LEGAL — i18n
// ════════════════════════════════════════════════════════════════════════════
export function AvisoLegal({ onNav }) {
  const t = useLegalT();

  return (
    <div
      className="min-h-screen"
      style={{ background: "linear-gradient(160deg,#EFF6FF 0%,#FFFDE7 50%,#F0FFF4 100%)" }}
      dir={t.dir}
    >
      <PageHeader
        icon={FileText}
        iconColor={C.blue}
        iconBg={C.blueSoft}
        title={t.legal_title}
        subtitle={t.legal_subtitle}
      />

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 16px 60px" }}>
        <BackButton onNav={onNav} label={t.back}/>

        <InfoBanner icon={AlertCircle} color={C.blue} bg={C.blueSoft}>
          <strong>{t.last_updated}.</strong> {t.legal_banner}
        </InfoBanner>

        {(t.legal_sections ?? []).map((sec, i) => {
          const accentColor = sec.accent === "green" ? C.green : C.blue;
          return (
            <Section key={i} title={sec.title} accent={accentColor} delay={i * 0.04}>
              {sec.content.includes("legal@kiddsy.org") ? (
                <p>
                  {sec.content.replace("legal@kiddsy.org", "")}{" "}
                  <a href="mailto:legal@kiddsy.org"
                    style={{ color: accentColor, fontWeight: 700 }}>
                    legal@kiddsy.org
                  </a>
                </p>
              ) : (
                <p>{sec.content}</p>
              )}
            </Section>
          );
        })}

        {/* Contact footer */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{
            textAlign: "center", padding: "20px 24px", borderRadius: 20,
            background: "white", border: "2px solid #F1F5F9",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          }}
        >
          <a href="mailto:legal@kiddsy.org"
            style={{ display: "inline-flex", alignItems: "center", gap: 6,
              fontFamily: FF, fontWeight: 700, fontSize: 14, color: C.blue }}>
            <Mail size={15} strokeWidth={2}/> legal@kiddsy.org
          </a>
        </motion.div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// PRIVACIDAD — i18n
// ════════════════════════════════════════════════════════════════════════════
export function Privacidad({ onNav }) {
  const t = useLegalT();

  return (
    <div
      className="min-h-screen"
      style={{ background: "linear-gradient(160deg,#F0FFF4 0%,#FFFDE7 50%,#EFF6FF 100%)" }}
      dir={t.dir}
    >
      <PageHeader
        icon={Shield}
        iconColor={C.green}
        iconBg={C.greenSoft}
        title={t.privacy_title}
        subtitle={t.privacy_subtitle}
      />

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 16px 60px" }}>
        <BackButton onNav={onNav} label={t.back}/>

        <InfoBanner icon={Shield} color={C.green} bg={C.greenSoft}>
          {t.privacy_banner}
        </InfoBanner>

        {(t.privacy_cards ?? []).map((card, i) => {
          const Icon  = ICON_MAP[card.icon] ?? Lock;
          const token = COLOR_MAP[card.color] ?? COLOR_MAP.blue;

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              style={{
                borderRadius: 20, overflow: "hidden", marginBottom: 12,
                border: "2px solid white",
                boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                background: token.bg,
              }}
            >
              {/* Card header */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "16px 20px 10px" }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 12,
                  background: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <Icon size={18} strokeWidth={2} style={{ color: token.color }}/>
                </div>
                <h3 style={{ fontFamily: FF, fontWeight: 700, fontSize: 16, color: token.color, margin: 0 }}>
                  {card.title}
                </h3>
              </div>

              {/* Bullet points */}
              <div style={{ padding: "0 20px 16px" }}>
                {(card.points ?? []).map((p, j) => (
                  <div key={j} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 6 }}>
                    <div style={{
                      width: 6, height: 6, borderRadius: "50%",
                      background: token.color, flexShrink: 0, marginTop: 6,
                    }}/>
                    <p style={{ fontFamily: FB, fontSize: 13, color: "#475569", margin: 0, lineHeight: 1.6 }}>
                      {p}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}

        {/* Contact footer */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          style={{
            textAlign: "center", padding: "20px 24px", borderRadius: 20,
            background: "white", border: "2px solid #F1F5F9",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          }}
        >
          <p style={{ fontFamily: FB, fontSize: 14, color: "#64748B", margin: "0 0 6px" }}>
            {t.contact_q}
          </p>
          <a href="mailto:legal@kiddsy.org"
            style={{ display: "inline-flex", alignItems: "center", gap: 6,
              fontFamily: FF, fontWeight: 700, fontSize: 14, color: C.blue }}>
            <Mail size={15} strokeWidth={2}/> legal@kiddsy.org
          </a>
        </motion.div>
      </div>
    </div>
  );
}
