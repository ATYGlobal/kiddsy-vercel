/**
 * public/sw.js — Kiddsy Service Worker
 * ─────────────────────────────────────────────────────────────────────────
 * • self.skipWaiting()  → activa el SW nuevo sin esperar a que se cierren tabs
 * • clients.claim()     → toma el control de clientes ya abiertos
 * • Envía "SW_UPDATED" → App.jsx recarga automáticamente
 * ─────────────────────────────────────────────────────────────────────────
 */

const CACHE_NAME    = "kiddsy-v3";
const STATIC_ASSETS = ["/", "/index.html", "/manifest.json"];

// ── Install: pre-cache + skipWaiting ──────────────────────────────────────
self.addEventListener("install", (event) => {
  console.log("[SW] Installing…");
  self.skipWaiting(); // ⭐ activa inmediatamente sin esperar cierre de tabs
  event.waitUntil(
    caches.open(CACHE_NAME).then((c) => c.addAll(STATIC_ASSETS))
  );
});

// ── Activate: limpia caches viejas + claim + notifica ────────────────────
self.addEventListener("activate", (event) => {
  console.log("[SW] Activating…");
  event.waitUntil(
    Promise.all([
      // 1. Eliminar caches de versiones anteriores
      caches.keys().then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
      ),
      // 2. Tomar el control de todas las tabs abiertas
      self.clients.claim().then(() => {
        console.log("[SW] Claimed all clients — broadcasting SW_UPDATED");
        // 3. Notificar a cada tab que la app fue actualizada
        //    App.jsx escucha este mensaje y llama window.location.reload()
        return self.clients.matchAll({ type: "window" }).then((clients) => {
          clients.forEach((client) => client.postMessage({ type: "SW_UPDATED" }));
        });
      }),
    ])
  );
});

// ── Fetch: Network-first para API, Cache-first para assets ───────────────
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);
  if (request.method !== "GET") return;
  if (!url.protocol.startsWith("http")) return;

  // API → siempre a la red, sin cachear
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(
      fetch(request).catch(() =>
        new Response(JSON.stringify({ error: "Offline" }), {
          status: 503,
          headers: { "Content-Type": "application/json" },
        })
      )
    );
    return;
  }

  // Assets externos (Unsplash, CDN) → Network-first + cache
  if (url.hostname !== self.location.hostname) {
    event.respondWith(
      fetch(request)
        .then((res) => {
          caches.open(CACHE_NAME).then((c) => c.put(request, res.clone()));
          return res;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Assets propios → Cache-first + fallback a red
  event.respondWith(
    caches.match(request).then(
      (cached) =>
        cached ||
        fetch(request).then((res) => {
          caches.open(CACHE_NAME).then((c) => c.put(request, res.clone()));
          return res;
        })
    )
  );
});

// ── Mensaje manual SKIP_WAITING (por si el toast lo necesita) ────────────
self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") self.skipWaiting();
});
