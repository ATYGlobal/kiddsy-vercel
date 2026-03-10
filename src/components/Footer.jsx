/**
 * src/components/Footer.jsx — Kiddsy
 * ─────────────────────────────────────────────────────────────────────────
 * Extraído de App.jsx.
 * Props: { onNav }
 * ─────────────────────────────────────────────────────────────────────────
 */
import React from "react";

const C = {
  blue:    "#1565C0",
  yellow:  "#F9A825",
  magenta: "#D81B60",
};

export default function Footer({ onNav }) {
  return (
    <footer className="relative z-10 text-center py-8 font-body text-slate-400 text-sm border-t border-slate-100">
      <button
        onClick={() => onNav("hero")}
        className="inline-flex items-center gap-2 mb-3 hover:opacity-80 transition-opacity"
      >
        <img src="/kiddsy-logo.png" alt="Kiddsy" className="w-8 h-8 object-contain"/>
        <span className="font-display text-base" style={{color:C.blue}}>Kiddsy</span>
      </button>
      <p>Bilingual stories for families learning English together 🌍</p>
      <div className="flex justify-center gap-4 mt-2 flex-wrap">
        <button onClick={() => onNav("legal")}
          className="hover:underline text-xs" style={{color:C.blue}}>
          Privacy & Terms
        </button>
        <button onClick={() => onNav("donate")}
          className="hover:underline text-xs" style={{color:C.yellow}}>
          Support us
        </button>
        <button onClick={() => onNav("collaborate")}
          className="hover:underline text-xs" style={{color:C.magenta}}>
          Collaborate
        </button>
      </div>
      <p className="mt-3 text-xs opacity-40">
        © {new Date().getFullYear()} Kiddsy · Free for every family
      </p>
    </footer>
  );
}
