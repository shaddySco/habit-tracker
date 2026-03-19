# 2026 Resolution System

A privacy-first personal habit tracking and accountability web app.

## Tech Stack
- **React 18** + **Vite 5** — fast builds, instant HMR
- **PWA ready** — installable on phone via vite-plugin-pwa
- **Zero backend** — all data in localStorage, no server needed
- **Deploy free** — Vercel, Netlify, or GitHub Pages

---

## Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Run locally
```bash
npm run dev
```
Open http://localhost:5173

### 3. Build for production
```bash
npm run build
```
Output goes to `/dist` folder.

---

## Deploy to Vercel (recommended — free)

1. Push this folder to a GitHub repo
2. Go to [vercel.com](https://vercel.com) → New Project → Import your repo
3. Framework: **Vite** (auto-detected)
4. Click **Deploy** — done. Live in ~1 minute.

## Deploy to Netlify (free)

1. Push to GitHub
2. Go to [netlify.com](https://netlify.com) → Add new site → Import from Git
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Deploy

## Deploy to GitHub Pages (free)

1. Add to `vite.config.js`: `base: '/your-repo-name/'`
2. Run `npm run build`
3. Push `/dist` to the `gh-pages` branch

---

## Features
- 3-step onboarding with paragraph bulk-import of resolutions
- Auto-assign engine — reads plain English and assigns category + frequency
- Daily / Weekly / Monthly resolution views, all synced
- Edit, Add, Delete on every item everywhere
- Accountability partners — max 2 per category, Google Calendar + email
- Photo evidence upload for habits
- Monthly scorecard with star ratings
- Year heatmap
- PDF summary export
- Dark mode
- PWA installable

---

## Project Structure
```
src/
  App.jsx              — main shell, nav, routing
  useAppState.js       — global useReducer state + computed stats
  autoAssign.js        — keyword-based resolution auto-assign engine
  index.css            — CSS variables (light + dark tokens)
  components/
    Onboarding.jsx     — 3-step setup wizard
    Daily.jsx          — daily checklist + daily resolutions
    Resolutions.jsx    — bulk import + all resolutions management
    Pages.jsx          — Weekly, Monthly, Partners, Milestones, Summary
    UI.jsx             — shared components (CheckItem, ResItem, Modal, etc.)
```
