/**
 * src/components/InstallPrompt.jsx — Kiddsy PWA
 * ─────────────────────────────────────────────────────────────────────────
 * Banner opcional "Instalar Kiddsy" que aparece en Android/Chrome cuando
 * el navegador dispara el evento beforeinstallprompt.
 *
 * iOS no soporta este evento — se muestra un mensaje manual de instrucciones.
 *
 * Uso en App.jsx:
 *   import InstallPrompt from "./components/InstallPrompt.jsx";
 *   // En el return del App, añadir <InstallPrompt/> justo antes del </div> final
 * ─────────────────────────────────────────────────────────────────────────
 */
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, Smartphone } from "lucide-react";

const C = {
  blue:   "#1565C0",
  yellow: "#F9A825",
};

// Detectar iOS
function isIOS() {
  return /iphone|ipad|ipod/i.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
}

// Detectar si ya está instalada como PWA
function isStandalone() {
  return window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true;
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showAndroid,    setShowAndroid]    = useState(false);
  const [showIOS,        setShowIOS]        = useState(false);
  const [dismissed,      setDismissed]      = useState(false);

  useEffect(() => {
    // No mostrar si ya está instalada
    if (isStandalone()) return;

    // Recuperar si el usuario ya cerró el banner esta sesión
    const wasDismissed = sessionStorage.getItem("kiddsy_install_dismissed");
    if (wasDismissed) return;

    // Android/Chrome: capturar el evento nativo
    const handler = e => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Mostrar el banner después de 3 segundos en la app
      setTimeout(() => setShowAndroid(true), 3000);
    };
    window.addEventListener("beforeinstallprompt", handler);

    // iOS: mostrar instrucciones manuales si no está instalada
    if (isIOS() && !isStandalone()) {
      setTimeout(() => setShowIOS(true), 4000);
    }

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstallAndroid = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log("[PWA] User choice:", outcome);
    setDeferredPrompt(null);
    handleDismiss();
  };

  const handleDismiss = () => {
    setShowAndroid(false);
    setShowIOS(false);
    setDismissed(true);
    sessionStorage.setItem("kiddsy_install_dismissed", "1");
  };

  if (dismissed) return null;

  return (
    <>
      {/* ── Android / Chrome banner ── */}
      <AnimatePresence>
        {showAndroid && (
          <motion.div
            initial={{ y: 120, opacity: 0 }}
            animate={{ y: 0,   opacity: 1 }}
            exit={{    y: 120, opacity: 0 }}
            transition={{ type:"spring", stiffness:280, damping:24 }}
            style={{
              position:     "fixed",
              bottom:       20,
              left:         "50%",
              transform:    "translateX(-50%)",
              zIndex:       9999,
              width:        "calc(100% - 32px)",
              maxWidth:     420,
              background:   "white",
              borderRadius: 24,
              border:       "3px solid white",
              boxShadow:    "0 20px 60px rgba(21,101,192,0.25), 0 4px 16px rgba(0,0,0,0.1)",
              overflow:     "hidden",
            }}
          >
            {/* Gradient top bar */}
            <div style={{
              height:     5,
              background: "linear-gradient(90deg,#F97316,#F59E0B,#EAB308,#84CC16)",
            }}/>

            <div style={{ padding:"16px 18px 18px", display:"flex", alignItems:"center", gap:14 }}>
              {/* Icon */}
              <img
                src="/kiddsy-logo.png"
                alt="Kiddsy"
                style={{ width:52, height:52, objectFit:"contain", flexShrink:0 }}
              />

              {/* Text */}
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{
                  fontFamily: "var(--font-display,'Nunito',sans-serif)",
                  fontWeight: 900, fontSize:16, color:"#0F3460", marginBottom:2,
                }}>
                  Install Kiddsy! 🚀
                </div>
                <div style={{
                  fontFamily: "var(--font-body,'Nunito',sans-serif)",
                  fontSize:   13, color:"#64748B", lineHeight:1.4,
                }}>
                  Add to your home screen for the full experience — works offline too!
                </div>
              </div>

              {/* Close */}
              <button onClick={handleDismiss} style={{
                border:"none", background:"#F1F5F9", borderRadius:999,
                width:28, height:28, display:"flex", alignItems:"center",
                justifyContent:"center", cursor:"pointer", flexShrink:0,
                color:"#94A3B8",
              }}>
                <X size={14}/>
              </button>
            </div>

            {/* CTA */}
            <div style={{ padding:"0 18px 16px", display:"flex", gap:8 }}>
              <motion.button
                whileHover={{ scale:1.03 }} whileTap={{ scale:0.96 }}
                onClick={handleInstallAndroid}
                style={{
                  flex:         1,
                  padding:      "11px 0",
                  borderRadius: 999,
                  border:       "none",
                  background:   `linear-gradient(135deg,${C.blue},#42A5F5)`,
                  color:        "white",
                  fontFamily:   "var(--font-display,'Nunito',sans-serif)",
                  fontWeight:   800,
                  fontSize:     14,
                  cursor:       "pointer",
                  display:      "flex",
                  alignItems:   "center",
                  justifyContent:"center",
                  gap:          6,
                  boxShadow:    "0 6px 20px rgba(21,101,192,0.3)",
                }}
              >
                <Download size={15}/> Install App
              </motion.button>
              <button onClick={handleDismiss} style={{
                padding:      "11px 16px",
                borderRadius: 999,
                border:       "2px solid #E2E8F0",
                background:   "white",
                color:        "#64748B",
                fontFamily:   "var(--font-display,'Nunito',sans-serif)",
                fontWeight:   700,
                fontSize:     13,
                cursor:       "pointer",
              }}>
                Later
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── iOS instructions banner ── */}
      <AnimatePresence>
        {showIOS && (
          <motion.div
            initial={{ y: 120, opacity: 0 }}
            animate={{ y: 0,   opacity: 1 }}
            exit={{    y: 120, opacity: 0 }}
            transition={{ type:"spring", stiffness:280, damping:24 }}
            style={{
              position:     "fixed",
              bottom:       20,
              left:         "50%",
              transform:    "translateX(-50%)",
              zIndex:       9999,
              width:        "calc(100% - 32px)",
              maxWidth:     420,
              background:   "white",
              borderRadius: 24,
              border:       "3px solid white",
              boxShadow:    "0 20px 60px rgba(21,101,192,0.25)",
              overflow:     "hidden",
            }}
          >
            <div style={{
              height:     5,
              background: "linear-gradient(90deg,#F97316,#F59E0B,#EAB308,#84CC16)",
            }}/>

            <div style={{ padding:"16px 18px 6px", display:"flex", alignItems:"flex-start", gap:12 }}>
              <img src="/kiddsy-logo.png" alt="Kiddsy"
                style={{ width:44, height:44, objectFit:"contain", flexShrink:0, marginTop:2 }}
              />
              <div style={{ flex:1 }}>
                <div style={{
                  fontFamily:"var(--font-display,'Nunito',sans-serif)",
                  fontWeight:900, fontSize:15, color:"#0F3460", marginBottom:6,
                }}>
                  Add Kiddsy to your Home Screen 📱
                </div>
                {/* Step by step */}
                {[
                  { icon:"⬆️", text: "Tap the Share button at the bottom of Safari" },
                  { icon:"➕", text: 'Scroll down and tap "Add to Home Screen"' },
                  { icon:"✅", text: 'Tap "Add" — Kiddsy will appear on your home screen!' },
                ].map((step, i) => (
                  <div key={i} style={{
                    display:"flex", alignItems:"flex-start", gap:8,
                    marginBottom:6, fontSize:12, color:"#475569",
                    fontFamily:"var(--font-body,'Nunito',sans-serif)",
                  }}>
                    <span style={{ flexShrink:0, fontSize:15 }}>{step.icon}</span>
                    <span style={{ lineHeight:1.45 }}>{step.text}</span>
                  </div>
                ))}
              </div>
              <button onClick={handleDismiss} style={{
                border:"none", background:"#F1F5F9", borderRadius:999,
                width:28, height:28, display:"flex", alignItems:"center",
                justifyContent:"center", cursor:"pointer", flexShrink:0,
                color:"#94A3B8",
              }}>
                <X size={14}/>
              </button>
            </div>

            <div style={{ padding:"8px 18px 16px" }}>
              <button onClick={handleDismiss} style={{
                width:"100%", padding:"10px 0", borderRadius:999,
                border:"2px solid #E2E8F0", background:"white",
                color:"#64748B",
                fontFamily:"var(--font-display,'Nunito',sans-serif)",
                fontWeight:700, fontSize:13, cursor:"pointer",
              }}>
                Got it! 👍
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
