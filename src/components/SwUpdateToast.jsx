/**
 * src/components/SwUpdateToast.jsx — Kiddsy
 * Toast que aparece cuando el Service Worker detecta una nueva versión.
 * Escucha el evento custom "kiddsy-sw-update" emitido desde sw.js.
 */
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, RefreshCw, X } from "lucide-react";

const C_BLUE = "#1565C0";

export default function SwUpdateToast() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handler = () => setShow(true);
    window.addEventListener("kiddsy-sw-update", handler);
    return () => window.removeEventListener("kiddsy-sw-update", handler);
  }, []);

  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0,  opacity: 1 }}
        exit={{    y: 80, opacity: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        style={{
          position:     "fixed",
          bottom:       24,
          left:         "50%",
          transform:    "translateX(-50%)",
          zIndex:       9999,
          background:   "white",
          borderRadius: 20,
          boxShadow:    "0 8px 32px rgba(21,101,192,0.22), 0 2px 8px rgba(0,0,0,0.08)",
          border:       `2.5px solid ${C_BLUE}`,
          padding:      "14px 20px",
          display:      "flex",
          alignItems:   "center",
          gap:          12,
          maxWidth:     "calc(100vw - 32px)",
          width:        360,
        }}
      >
        <Sparkles size={22} strokeWidth={2} style={{ color: C_BLUE, flexShrink: 0 }}/>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontFamily: "var(--font-display,'Nunito',sans-serif)", fontWeight: 700, fontSize: 14, color: C_BLUE, margin: 0 }}>
            New magic available!
          </p>
          <p style={{ fontFamily: "var(--font-body,'Nunito',sans-serif)", fontSize: 12, color: "#64748B", margin: "2px 0 0" }}>
            A fresh version of Kiddsy is ready.
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          onClick={() => window.location.reload()}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "8px 14px", borderRadius: 999, border: "none",
            background: `linear-gradient(135deg, ${C_BLUE}, #42A5F5)`,
            color: "white",
            fontFamily: "var(--font-display,'Nunito',sans-serif)",
            fontWeight: 700, fontSize: 13, cursor: "pointer",
            whiteSpace: "nowrap", flexShrink: 0,
          }}
        >
          <RefreshCw size={13}/> Update
        </motion.button>
        <button
          onClick={() => setShow(false)}
          style={{ background: "none", border: "none", cursor: "pointer", color: "#94A3B8", padding: 4, flexShrink: 0, display: "flex", alignItems: "center" }}
        >
          <X size={16}/>
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
