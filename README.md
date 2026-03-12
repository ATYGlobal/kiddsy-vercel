# ✨ Kiddsy

> Bilingual storybook & learning app for migrant families. Generate personalized AI stories with illustrations and narration, play language games, and learn together.

---

## Stack

| Layer | Tech |
|---|---|
| Frontend | React 18 + Vite + Tailwind CSS + Framer Motion |
| Backend | Node.js + Express — standalone server (`api/server.js`) |
| Story AI | Groq LLaMA 3.3 70B — real-time streaming SSE |
| Illustrations | OpenAI DALL·E 3 — one image per story page |
| Narration | OpenAI TTS-1 (nova / onyx / fable / shimmer) |
| Auth / DB | Supabase *(optional — guest mode works without it)* |
| Payments | Stripe + Apple Pay + Google Pay *(stubbed, ready to activate)* |
| PWA | Service Worker v3 + Web App Manifest |

> **Migrated from:** GPT-4o-mini (single API) → Groq LLaMA 3.3 70B (streaming) + DALL·E 3 (parallel images) + OpenAI TTS (dynamic voice)

---

## Project Structure

```
kiddsy/
├── api/
│   ├── server.js               ← Express server  (Groq SSE · DALL·E 3 · TTS · quota)
│   └── usageQuota.js           ← Monthly quota middleware (in-memory → Redis-ready)
│
├── public/
│   ├── sw.js                   ← Service Worker (cache kiddsy-v3, auto-update)
│   ├── manifest.json
│   └── icons/                  ← PWA icons (generate at pwabuilder.com/imageGenerator)
│
├── src/
│   ├── main.jsx
│   ├── App.jsx                 ← Routing + SW registration + global state
│   │
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx          ← i18n newsletter + social links
│   │   ├── Pricing.jsx         ← Plan modal (Portal · 3-layer flex centering)
│   │   ├── KiddsyFont.jsx      ← BubbleTitle · RainbowTitle · StickerText
│   │   ├── PageBg.jsx          ← Per-page animated backgrounds
│   │   └── SwUpdateToast.jsx   ← PWA "new version" toast
│   │
│   ├── pages/
│   │   ├── StoryGenerator.jsx  ← AI form · style & voice pickers · quota UI
│   │   ├── StoryReader.jsx     ← Animated reader · DALL·E images · TTS playback
│   │   ├── MyLibrary.jsx       ← Story shelf (localStorage guest + Supabase)
│   │   ├── WordSearch.jsx      ← Bilingual word hunt · 5 packs · 16 languages
│   │   ├── PuzzleMaster.jsx    ← Picture puzzles · animals / cities / monuments
│   │   ├── Education.jsx       ← ABC Explorer · alphabet · numbers · words
│   │   ├── Subscription.jsx    ← Pricing page · plans · lifetime · Apple/Google Pay
│   │   ├── Donation.jsx        ← Support page
│   │   └── LegalPages.jsx      ← Privacy Policy + Terms of Service
│   │
│   ├── hooks/
│   │   └── useQuota.js         ← Monthly quota hook (localStorage + server sync)
│   │
│   ├── utils/
│   │   ├── storage.js          ← lsGet/lsSet · getGuestId · saveStory · Supabase stub
│   │   └── EmojiSvg.jsx        ← Twemoji SVG wrapper (cross-platform emoji)
│   │
│   └── data/
│       ├── educationData.js    ← Alphabet · numbers · words (16 languages)
│       ├── puzzleMasterData.js ← Puzzle categories + image data
│       └── puzzleHelpers.js    ← Puzzle utility functions
│
├── index.html
├── vercel.json                 ← Routes /api/* → api/server.js
├── vite.config.js              ← Dev proxy /api → localhost:10000
├── tailwind.config.js
└── package.json
```

---

## Features

### 📚 Story Generator
- Personalized stories using the child's name and chosen theme
- **Streaming SSE** — text appears word by word in real time
- **6 illustration styles** — Watercolour · Realistic · Pencil · Cartoon · Vintage · Fantasy
- **4 narrator voices** — Woman (Nova) · Man (Onyx) · Child (Fable) · Auto (Shimmer)
- **16 languages** — ES FR AR DE IT PT RU ZH JA KO BN HI NL PL NO SV
- DALL·E 3 images generated in parallel after streaming completes
- **Free plan**: text-only stories + browser `SpeechSynthesis` (zero API cost)
- **Paid plans**: full DALL·E 3 illustrations + OpenAI TTS

### 🎮 Games
- **Word Hunt** — bilingual word search, 5 thematic packs, category + language dropdowns, 16 languages
- **Picture Puzzle** — 50+ animals, cities, monuments, nature — lock/unlock per category

### 📖 ABC Explorer
- Alphabet A–Z · numbers 0–9 · common words — all translated into 16 languages
- Audio pronunciation, animated cards, confetti rewards

---

## Monetisation

| Plan | Price | Stories/month | DALL·E 3 | TTS |
|---|---|---|---|---|
| Free | €0 | 3 | ❌ text only | Browser |
| Kiddsy Plus | €5.99 / mo | 15 | ✅ | OpenAI |
| Kiddsy Annual | €3.33 / mo · €39.99 / yr | 15 | ✅ | OpenAI |
| Kiddsy Family | €7.99 / mo | 25 | ✅ | OpenAI |
| Lifetime | €49.99 one-time | 20 / mo | ✅ | OpenAI |
| Puzzles Only | €3.99 / mo | 0 | — | — |

**Individual purchases:** puzzle seasonal pack €0.99 · single book €2.99 · 5-book bundle €9.99 · unlimited puzzles €3.99

---

## Environment Variables

```bash
# api/.env  (or set in your hosting dashboard)
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxx
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxx

# Optional — Supabase (leave out to run in guest-only / localStorage mode)
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Optional — Stripe (for subscription checkout)
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_xxxx
```

---

## Local Development

```bash
# 1. Install dependencies
npm install

# 2. Set env vars
cp .env.example .env
# → fill in GROQ_API_KEY and OPENAI_API_KEY

# 3. Start API server  (port 10000)
node api/server.js

# 4. Start frontend  (port 5173, proxies /api → 10000)
npm run dev
```

---

## Deploy

### Render / Railway / Fly.io
```bash
npm run build       # outputs dist/
node api/server.js  # serves API on $PORT
```
Serve `dist/` as static files from the same Express server or a CDN.

### Vercel
`vercel.json` routes `/api/*` to `api/server.js` as a serverless function.  
Set `GROQ_API_KEY` and `OPENAI_API_KEY` in **Vercel → Settings → Environment Variables**.

```bash
vercel deploy --prod
```

---

## Activating Optional Services

### Supabase (persistent user data)
1. `npm install @supabase/supabase-js`
2. Add `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` to `.env`
3. In `src/utils/storage.js` — uncomment the `createClient` import + two lines inside `getSupabase()`, delete `return null`

### Stripe Checkout
1. `npm install @stripe/react-stripe-js @stripe/stripe-js`
2. Add `VITE_STRIPE_PUBLISHABLE_KEY` to `.env`
3. Uncomment the marked blocks in `src/pages/Subscription.jsx`
4. Add two server routes:
   ```
   POST /api/create-payment-intent  →  { clientSecret }
   POST /api/create-subscription    →  { clientSecret }
   ```
Apple Pay and Google Pay appear automatically when the browser supports them (detected via `ApplePaySession` and `PaymentRequest` API).

---

## Quota System

Story generation is rate-limited on **both sides** to protect API costs:

- **Client** (`src/hooks/useQuota.js`) — reads `localStorage`, blocks the button instantly, syncs with server on mount
- **Server** (`api/usageQuota.js`) — double-checks every request, returns `429` if exceeded
- Keys are `guestId:YYYY-MM` — reset automatically each month
- **Production upgrade**: swap the in-memory `Map` for Redis — drop-in commented block included in `usageQuota.js`

---

## PWA

- Installable on Android (Chrome) and iOS (Safari — Add to Home Screen)
- App shell and games cached for offline use
- Auto-update: service worker sends `SW_UPDATED` → `SwUpdateToast` prompts the user to reload

---

## Roadmap

- [ ] Stripe checkout endpoints (server-side)
- [ ] Redis quota store for multi-instance production
- [ ] Parent dashboard with reading history
- [ ] Push notifications for new story packs
- [ ] iOS / Android app via Capacitor

---

*Built with ❤️ for migrant families. Kiddsy makes bilingual learning magical.*
