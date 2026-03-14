# 2026 Resolution System

Your personal habit tracking and accountability system built with React + Vite.

---

## What's Inside

- Daily checklist with Morning Routine + 3 Main Tasks
- M-T-W-T-F-S-S habit grid across 6 life categories
- Photo evidence upload per habit
- Accountability partner system with Google Calendar notifications
- Weekly Summary with full progress report sent to partners
- Monthly Scorecard with self-check questions
- Vision Board with quarterly goals + images
- Year-end Milestone tracker
- All data saved locally in your browser

---

## Requirements

- **Node.js** (version 18 or higher)
- Download from: https://nodejs.org

---

## Setup (Do This Once)

### Step 1 — Download or clone the project
Put the `resolution-system` folder somewhere on your computer.

### Step 2 — Open a terminal in the project folder

**On Windows:**
- Open the folder in File Explorer
- Click the address bar, type `cmd`, press Enter

**On Mac:**
- Right-click the folder → "Open Terminal at Folder"

### Step 3 — Install dependencies
```bash
npm install
```
This downloads everything needed. Wait for it to finish (takes 1-2 minutes).

---

## Running the App

```bash
npm run dev
```

Then open your browser and go to:
```
http://localhost:5173
```

The app will live-reload when you make changes.

---

## Building for Production (to deploy online)

```bash
npm run build
```

This creates a `dist/` folder with your production-ready app.

---

## Free Deployment (Share with Others)

### Option A — Netlify (Easiest)
1. Go to https://netlify.com and sign up free
2. Run `npm run build`
3. Drag the `dist/` folder into the Netlify dashboard
4. You get a live URL instantly (e.g. `my-2026-goals.netlify.app`)

### Option B — Vercel
1. Go to https://vercel.com and sign up free
2. Install Vercel CLI: `npm install -g vercel`
3. Run `vercel` in the project folder
4. Follow the prompts — live in 30 seconds

---

## Project Structure

```
resolution-system/
├── index.html                  Entry point
├── vite.config.js              Vite configuration
├── package.json                Dependencies
├── src/
│   ├── main.jsx                React mount point
│   ├── App.jsx                 Main app, navigation, state management
│   ├── styles/
│   │   └── app.css             All styles
│   ├── data/
│   │   └── categories.js       All habits, milestones, constants, helpers
│   └── components/
│       ├── Daily.jsx           Daily checklist page
│       ├── Weekly.jsx          Weekly summary page
│       ├── Monthly.jsx         Monthly scorecard page
│       ├── Vision.jsx          Vision board page
│       └── Milestones.jsx      Milestones page
```

---

## How the Accountability Partner System Works

1. Add your partner's **name** and **Gmail address** in any category
2. Click **"Set Weekly Reminder"** — Google Calendar opens in a new tab
3. The event is pre-filled with your weekly progress summary
4. Click **Save** once in Google Calendar
5. Your partner receives an email invite
6. Once they accept, Google automatically reminds them **every week**
7. Use **"Notify All Partners"** on the Weekly or Monthly page to send to everyone at once

---

## Data Storage

All your data is saved in your browser's **localStorage**.
- It persists between sessions on the same browser
- To back it up: open browser console → type `localStorage.getItem('res2026')` → copy the output
- To restore: `localStorage.setItem('res2026', '<paste your backup here>')`

---

## Tips

- On mobile, add to Home Screen for an app-like experience
- Use Chrome or Edge for best performance
- The streak counter tracks consecutive days where you checked off at least one habit

---

Built for your 2026 goals. Discipline over motivation. 🌱
