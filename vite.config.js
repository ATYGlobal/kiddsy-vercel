/**
 * vite.config.js — Kiddsy
 * ─────────────────────────────────────────────────────────────────────────
 * OPCIÓN A (recomendada): usa vite-plugin-pwa para gestión automática del SW.
 * OPCIÓN B (manual):      comenta el plugin y usa sw.js en /public directamente.
 *
 * Para instalar el plugin (Opción A):
 *   npm install -D vite-plugin-pwa
 * ─────────────────────────────────────────────────────────────────────────
 */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// ── OPCIÓN A: Descomenta si instalas vite-plugin-pwa ──────────────────────
// import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),

    // ── OPCIÓN A: Plugin automático ───────────────────────────────────────
    // VitePWA({
    //   registerType: "autoUpdate",
    //   includeAssets: ["favicon.png", "kiddsy-logo.png", "icons/*.png"],
    //   manifest: false,             // usamos nuestro manifest.json manual
    //   workbox: {
    //     globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
    //     runtimeCaching: [
    //       {
    //         urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
    //         handler: "CacheFirst",
    //         options: {
    //           cacheName: "google-fonts-cache",
    //           expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
    //         },
    //       },
    //       {
    //         urlPattern: /\/api\//,
    //         handler: "NetworkFirst",
    //         options: {
    //           cacheName: "kiddsy-api-cache",
    //           expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 },
    //         },
    //       },
    //     ],
    //   },
    // }),
  ],

  server: {
    port: 5173,
    // Proxy para desarrollo local — redirige /api al servidor Express
    proxy: {
      "/api": {
        target: "http://localhost:10000",
        changeOrigin: true,
      },
    },
  },

  build: {
    outDir: "dist",
    // Asegura que los assets en /public (sw.js, manifest.json, icons/) se copian a dist
    assetsDir: "assets",
  },

  // Asegura que los assets públicos (sw.js, manifest.json) estén disponibles en dev
  publicDir: "public",
});
