# Kiddsy PWA — Guía de Instalación Completa

## Estructura de archivos a crear

```
tu-proyecto/
├── public/                    ← Carpeta PÚBLICA de Vite (se copia tal cual a dist/)
│   ├── manifest.json          ← ✅ NUEVO — manifiesto PWA
│   ├── sw.js                  ← ✅ NUEVO — service worker
│   ├── kiddsy-logo.png        ← ya existe
│   ├── favicon.png            ← ya existe
│   └── icons/                 ← ✅ NUEVA CARPETA — iconos PWA
│       ├── icon-72x72.png
│       ├── icon-96x96.png
│       ├── icon-128x128.png
│       ├── icon-144x144.png
│       ├── icon-152x152.png
│       ├── icon-192x192.png   ← el más importante (Android + iOS)
│       ├── icon-384x384.png
│       └── icon-512x512.png   ← el más importante (Splash screen)
│
├── src/
│   ├── App.jsx                ← añadir <InstallPrompt/> (ver abajo)
│   ├── components/
│   │   └── InstallPrompt.jsx  ← ✅ NUEVO — banner "Instalar app"
│   └── ...
│
├── index.html                 ← ✅ MODIFICAR — añadir meta tags PWA
└── vite.config.js             ← ✅ MODIFICAR — proxy dev (opcional)
```

---

## Paso 1: Generar los iconos

Tienes el logo `Kiddsy.png` de alta resolución. Necesitas generarlo en 8 tamaños.

### Opción A — Online (más fácil, 2 minutos)
1. Ve a **https://www.pwabuilder.com/imageGenerator**
2. Sube tu `Kiddsy.png`
3. Descarga el ZIP → extrae los PNGs en `public/icons/`

### Opción B — realfavicongenerator.net
1. Ve a **https://realfavicongenerator.net**
2. Sube el logo
3. En la sección PWA/Android descarga los iconos
4. Colócalos en `public/icons/`

### Opción C — Script Node.js local
```bash
npm install -D sharp
```
```js
// scripts/generate-icons.js
import sharp from "sharp";

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
for (const size of sizes) {
  await sharp("public/kiddsy-logo.png")
    .resize(size, size, { fit: "contain", background: { r:255, g:255, b:255, alpha:0 } })
    .png()
    .toFile(`public/icons/icon-${size}x${size}.png`);
  console.log(`✅ icon-${size}x${size}.png`);
}
```
```bash
node scripts/generate-icons.js
```

### Icono "Maskable" (importante para Android)
Los tamaños 192 y 512 deben tener un **safe zone** del 20% de padding alrededor del logo.
Usa **https://maskable.app/editor** para verificarlo — el logo debe verse bien dentro del círculo central.

---

## Paso 2: Copiar los archivos

```bash
# Desde la raíz de tu proyecto:
cp manifest.json   public/manifest.json
cp sw.js           public/sw.js
cp index.html      index.html          # reemplaza el existente
cp vite.config.js  vite.config.js      # reemplaza el existente
cp InstallPrompt.jsx src/components/InstallPrompt.jsx
```

---

## Paso 3: Añadir InstallPrompt a App.jsx

Abre `src/App.jsx` y añade estas 2 líneas:

```jsx
// Al principio del archivo, junto a los otros imports:
import InstallPrompt from "./components/InstallPrompt.jsx";

// En el return del componente App (el que devuelve el shell con Navbar),
// añade <InstallPrompt/> como último hijo del div raíz:
return (
  <div className="min-h-screen relative" style={{background:"#FFFDE7"}}>
    <StarField/>
    {/* ... todo el contenido existente ... */}
    <footer>...</footer>
    
    <InstallPrompt />   {/* ← AÑADIR AQUÍ */}
  </div>
);
```

---

## Paso 4: Verificar que funciona

```bash
npm run build
npm run preview   # Sirve la build de producción en http://localhost:4173
```

Abre Chrome DevTools → pestaña **Application** → sección **Manifest** y **Service Workers**.

Deberías ver:
- ✅ Manifest loaded  
- ✅ Service worker registered and activated
- ✅ Icons showing correctly

---

## Paso 5: Instalar en el dispositivo

### Android (Chrome)
- El banner "Instalar Kiddsy" aparece automáticamente a los 3 segundos
- O: menú de Chrome → "Añadir a pantalla de inicio"

### iOS (Safari) ← IMPORTANTE: solo funciona desde Safari
1. Abre Kiddsy en **Safari** (no Chrome)
2. Pulsa el botón compartir ⬆️ (abajo en el centro)
3. Busca "Añadir a pantalla de inicio"
4. Pulsa "Añadir"

> ⚠️ iOS ignora `beforeinstallprompt`. El banner del componente `InstallPrompt.jsx`
> muestra automáticamente las instrucciones paso a paso cuando detecta un iPhone/iPad en Safari.

---

## Checklist PWA final

- [ ] `public/manifest.json` creado
- [ ] `public/sw.js` creado
- [ ] Iconos en `public/icons/` (mínimo 192 y 512)
- [ ] `index.html` actualizado con meta tags
- [ ] `<InstallPrompt/>` añadido en App.jsx
- [ ] Probado en Chrome DevTools → Application tab
- [ ] Testeado en dispositivo real (Android + iOS Safari)
- [ ] Desplegado en HTTPS (Vercel/Render — **el SW requiere HTTPS**)

---

## Lighthouse PWA Score

Tras el deploy en HTTPS, puedes medir la calidad PWA:
1. Chrome DevTools → Lighthouse
2. Selecciona "Progressive Web App"
3. Genera informe

Kiddsy debería alcanzar **90-100/100** con esta configuración.

---

## Notas sobre localStorage y el Service Worker

El Service Worker **no interfiere** con localStorage:
- `localStorage` es sincrónico y vive en el hilo principal del navegador
- El SW es un worker de red separado — solo intercepta requests HTTP
- Las claves `kiddsy_childName`, `kiddsy_lang`, `kiddsy_guestStories` permanecen intactas

La caché del SW (Cache API) y localStorage son **almacenamientos completamente separados**.
