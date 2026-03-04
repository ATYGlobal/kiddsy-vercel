# ✨ Kiddsy Loop — Vercel Edition

Bilingual storybook app for migrant families learning English together.

## Stack
- **Frontend**: React + Vite + Tailwind CSS + Framer Motion
- **Backend**: Express as Vercel Serverless Function (`/api/index.js`)
- **AI**: OpenAI GPT-4o-mini for personalized story generation

## Project Structure
```
kiddsy-loop/
├── api/
│   └── index.js          ← Vercel serverless function (Express)
├── src/
│   ├── App.jsx           ← Main React component (all views)
│   ├── main.jsx          ← React entry point
│   └── index.css         ← Tailwind + global styles
├── index.html            ← Vite HTML entry
├── vercel.json           ← Vercel routing config
├── vite.config.js        ← Vite config (with API proxy for dev)
├── tailwind.config.js
└── package.json
```

## Deploy to Vercel

### 1. Install Vercel CLI
```bash
npm install -g vercel
```

### 2. Clone and install
```bash
npm install
```

### 3. Add environment variables
```bash
cp .env.example .env
# Edit .env and add your OPENAI_API_KEY
```

On Vercel dashboard: **Settings → Environment Variables → Add `OPENAI_API_KEY`**

### 4. Deploy
```bash
vercel deploy --prod
```

Or connect the repo to Vercel for automatic deployments on push.

## Local Development
```bash
npm run dev
# Frontend: http://localhost:3000
# API:      http://localhost:5000
```

## Features
- 📚 **Story Library** — 5 built-in bilingual stories
- 🪄 **AI Story Generator** — Personalized stories with child's name + theme
- 🌍 **3 Languages** — Spanish, French, Arabic translations
- 📖 **Magical Book Reader** — Animated page turns, keyboard navigation
- ✨ **Kid-friendly UI** — Fredoka + Nunito fonts, soft shadows, rounded design
