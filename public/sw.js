/**
 * sw.js — Kiddsy Service Worker
 * ─────────────────────────────────────────────────────────────────────────
 * Estrategia:
 *   • Shell (HTML/JS/CSS/fonts) → Cache First  (app carga offline)
 *   • API calls (/api/*)        → Network First (datos siempre frescos)
 *   • Imágenes / iconos         → Cache First  (evita recargas)
 *
 * NO interfiere con localStorage (childName, idioma, cuentos guardados).
 * El caché del SW solo afecta assets de red, no al storage del navegador.
 * ─────────────────────────────────────────────────────────────────────────
 */

const CACHE_NAME    = "kiddsy-v1";
const API_CACHE     = "kiddsy-api-v1";

// Assets del shell que queremos pre-cachear en la instalación
const PRECACHE_URLS = [
  "/",
  "/index.html",
  "/kiddsy-logo.png",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
];

// ── INSTALL: pre-cachear el shell ─────────────────────────────────────────
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log("[SW] Pre-caching shell assets");
      // addAll falla si algún recurso no existe — usamos add individual
      return Promise.allSettled(
        PRECACHE_URLS.map(url => cache.add(url).catch(() => {
          console.warn(`[SW] Could not pre-cache: ${url}`);
        }))
      );
    }).then(() => self.skipWaiting())
  );
});

// ── ACTIVATE: limpiar cachés antiguas ─────────────────────────────────────
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k !== CACHE_NAME && k !== API_CACHE)
          .map(k => {
            console.log("[SW] Deleting old cache:", k);
            return caches.delete(k);
          })
      )
    ).then(() => self.clients.claim())
  );
});

// ── FETCH: estrategia mixta ───────────────────────────────────────────────
self.addEventListener("fetch", event => {
  const { request } = event;
  const url = new URL(request.url);

  // 1. Ignorar peticiones que no son GET
  if (request.method !== "GET") return;

  // 2. Ignorar extensiones de Chrome y URLs no-http
  if (!url.protocol.startsWith("http")) return;

  // 3. API calls → Network First (queremos datos frescos de Gemini)
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(networkFirst(request, API_CACHE));
    return;
  }

  // 4. Google Fonts → Cache First (no cambian nunca)
  if (url.hostname.includes("fonts.googleapis.com") ||
      url.hostname.includes("fonts.gstatic.com")) {
    event.respondWith(cacheFirst(request, CACHE_NAME));
    return;
  }

  // 5. Todo lo demás (shell, assets, iconos) → Cache First
  event.respondWith(cacheFirst(request, CACHE_NAME));
});

// ── Helpers ───────────────────────────────────────────────────────────────

/**
 * Cache First: sirve desde caché si existe, si no va a red y cachea.
 * Ideal para assets que no cambian (JS bundle, CSS, imágenes).
 */
async function cacheFirst(request, cacheName) {
  const cache    = await caches.open(cacheName);
  const cached   = await cache.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    // Solo cachear respuestas válidas
    if (response && response.status === 200 && response.type !== "opaque") {
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    // Si falla la red y no hay caché, retornar página offline básica
    const offlinePage = await cache.match("/");
    return offlinePage || new Response("Kiddsy is offline 📴", {
      status: 503,
      headers: { "Content-Type": "text/plain" },
    });
  }
}

/**
 * Network First: intenta la red primero, cae a caché si falla.
 * Ideal para llamadas a la API que queremos siempre frescas.
 */
async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  try {
    const response = await fetch(request);
    if (response && response.status === 200) {
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await cache.match(request);
    return cached || new Response(
      JSON.stringify({ error: "Kiddsy is offline. Check your connection." }),
      { status: 503, headers: { "Content-Type": "application/json" } }
    );
  }
}
