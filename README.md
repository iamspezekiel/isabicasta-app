# IsabiCasta 🏺🪙

> **A private way to choose, when you are undecided.**

[![License: MIT](https://img.shields.io/badge/License-MIT-8c6239.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-19-61dafb.svg)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-7-3178c6.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8-646cff.svg)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8.svg)](https://tailwindcss.com)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-8c6239.svg)](#-contributing)

**IsabiCasta** is a lightweight, open-source decision-making web app inspired by the biblical practice of casting lots. It helps people who feel indecisive or stuck in analysis paralysis choose peacefully and impartially — no accounts, no analytics, no servers. Everything runs 100% in your browser.

The app offers two time-honored tools:

- 🪙 **Three-Flip Coin** — a best-of-three coin discernment with a 3D, physics-style flip animation.
- 🏺 **Cast Lots** — enter any number of options and let the lot fall on one of them.

---

## 📑 Table of Contents

- [✨ Features](#-features)
- [📖 Biblical Background & Scriptural Context](#-biblical-background--scriptural-context)
- [🛠️ Technology Stack](#️-technology-stack)
- [🚀 Getting Started](#-getting-started)
- [📜 Available Scripts](#-available-scripts)
- [⚙️ Environment Variables](#️-environment-variables)
- [📂 Project Architecture](#-project-architecture)
- [🗄️ Data & Privacy](#️-data--privacy)
- [🌐 Deployment](#-deployment)
- [🐛 Troubleshooting](#-troubleshooting)
- [🤝 Contributing](#-contributing)
- [⚖️ License](#️-license)

---

## ✨ Features

### 🪙 Three-Flip Coin

- **Best-of-three discernment** — flip a shekel-style coin up to three times and let the majority outcome decide, mirroring the app's "Three-Flip Principle".
- **Meaningful outcomes** — optionally attach your own meaning to *Heads* and *Tails* before flipping (e.g. "Heads = go for it").
- **Session tallies** — running Heads vs. Tails counts plus a flip-by-flip record saved with each outcome.
- **Realistic 3D animation** — full-perspective coin with a struck obverse (Heads) and olive-wreath reverse (Tails), multi-turn physics-based flip, expanding shadow, and natural deceleration.
- **One-tap Flip Again** to re-run the discernment.

### 🏺 Cast Lots

- **Free-form options** — enter as many choices as you like, one per line.
- **Automatic validation** — empty lines are dropped, whitespace is trimmed, and at least two *distinct* choices are required.
- **Quick presets** — one-tap pools for rapid testing (dinner choices, daily focus, weekend plans).
- **Tumbling lots animation** — inscribed stone/ceramic pieces tumble before the selection settles.
- **Clear announcement** — *"The lot has fallen on: [selected option]"*.
- **Cast Again** (re-rolls the same pool) and **Edit Options** actions.

### 🕰️ History

- Every **accepted** outcome (coin discernments and drawn lots) is saved to a dedicated History view with a live count badge in the bottom navigation.
- **Timestamped entries** with the outcome, options, flip records, and tally.
- **Per-item deletion** and a **Clear all** action guarded by a confirmation step.
- History is capped to the **100 most recent** entries.

### 👤 Profile & Settings

- Personalize your **display name** and **avatar initials**.
- See lightweight personal stats — decisions made, coin flips vs. lots cast, and your favorite mode.
- Toggles for **sound**, **haptics**, **default mode** (Coin or Lots), and **animation speed** (normal/fast).
- Theme preference (light/dark/system) for your profile.

### 📜 Onboarding Slider

- First-time interactive modal with **swipe** and **keyboard arrow** navigation.
- Explains the historical casting-lots background with full scripture citations and reflections.
- **Next / Previous / Skip / Get Started** controls.
- Completion is persisted in `localStorage`, so returning users go straight to the app.
- Re-openable anytime from the app's **Biblical Background** entry point.

### ℹ️ About Page

- Explains the **Three-Flip Principle**, the app's philosophy, and the respectful use of the biblical material.

### 🔊 Procedural Sound Effects

- Built entirely with the **Web Audio API** — zero `.mp3`/`.wav` downloads.
- Metallic coin ring, settling clink, tumbling stone rattle, and a gentle decision bell.
- Master mute toggle with a persisted preference.

### 🔒 100% Client-Side Privacy

- Runs entirely in the browser; all data lives in `localStorage`.
- **Zero** analytics, ads, external API calls, trackers, or logins.
- One-click history reset with confirmation safeguards.

### 📱 Mobile-First Responsive Design

- Ergonomic touch targets (≥ 44 px; bottom navigation uses a 48 px minimum height).
- Warm parchment palette with **Fraunces** and **Source Sans 3** typography.
- High-contrast, WCAG AA-oriented color choices and accessible focus states.

---

## 📖 Biblical Background & Scriptural Context

Throughout the scriptures, casting lots (*goral* in Hebrew, *klēros* in Greek) was utilized in antiquity to eliminate human partiality, resolve contentious disputes, and make decisions without factional politics. IsabiCasta features an interactive onboarding guide detailing these accounts with texts from the **New World Translation of the Holy Scriptures**:

1. **Proverbs 16:33** — *"The lot is cast into the lap, but every decision by it is from Jehovah."*
   *Context*: Ancient Hebrew practice where casting lots eliminated personal bias and argument, allowing decisions to be settled peacefully.
2. **Leviticus 16:8** — *"Aaron will draw lots over the two goats, one lot for Jehovah and the other for Azaʹzel."*
   *Context*: Sacred administrative duty on the Day of Atonement, ensuring total objectivity in the solemn assignment of duties.
3. **Jonah 1:7** — *"Come, let us cast lots to find out who is responsible for this calamity."*
   *Context*: Maritime use by sailors in a severe crisis, seeking impartial clarity amidst critical uncertainty.
4. **Acts 1:26** — *"So they cast lots over them, and the lot fell on Mat·thiʹas, and he was counted along with the eleven apostles."*
   *Context*: Impartial selection of an apostle among qualified candidates following prayer, preventing partisan lobbying.

### 🕊️ Respectful Context & Purpose

IsabiCasta presents this biblical background respectfully. The app does not claim that a random outcome reveals divine will. Rather, it serves as a practical, philosophical, and peaceful decision aid for everyday indecisiveness (such as deciding what to cook, which chore to start first, or breaking a deadlock between choices) by encouraging users to let go of overthinking.

---

## 🛠️ Technology Stack

| Layer | Technology |
| --- | --- |
| UI framework | React 19 |
| Language | TypeScript (ES2022, `noEmit`, `bundler` module resolution) |
| Styling | Tailwind CSS v4 (via `@tailwindcss/vite`) |
| Animation | Motion (`motion/react`) |
| Icons | Lucide React |
| Build tool | Vite 8 |
| Audio | Web Audio API (procedural synthesis) |
| Persistence | Browser `localStorage` |
| Fonts | Fraunces + Source Sans 3 (Google Fonts) |

> `express`, `dotenv`, and `@google/genai` are declared in `package.json` for AI Studio's optional server-side capability, but **no current source file imports them** — the shipped app is fully client-side.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18 or later (Node 20+ LTS recommended) — check with `node --version`
- **npm** 10+ (or [Bun](https://bun.sh), which the committed `bun.lock` targets)
- **Git**

### 1. Clone the repository

```bash
git clone https://github.com/iamspezekiel/isabicasta-app.git
cd isabicasta-app
```

### 2. Install dependencies

```bash
npm install
```

> Using [Bun](https://bun.sh) instead of npm? Run `bun install` (the repo also ships a `bun.lock`).

### 3. (Optional) Configure environment

```powershell
Copy-Item .env.example .env
```

No variables are required for local development — see [Environment Variables](#️-environment-variables).

### 4. Start the development server

```bash
npm run dev
```

Open **http://localhost:3000** in your browser. If port 3000 is already in use, Vite automatically falls back to the next free port (e.g. `3001`) and prints the URL in the terminal.

### Production build & preview

```bash
npm run build   # outputs optimized static assets to dist/
npm run preview # serves the production build locally
npm run lint    # type-check only (tsc --noEmit)
```

---

## 📜 Available Scripts

| Script | Command | Description |
| --- | --- | --- |
| `dev` | `npm run dev` | Starts the Vite dev server on port **3000**, bound to `0.0.0.0` (LAN-accessible), with HMR |
| `build` | `npm run build` | Bundles production assets into `dist/` |
| `preview` | `npm run preview` | Serves the `dist/` build locally for smoke testing |
| `lint` | `npm run lint` | Runs `tsc --noEmit` (type checking only) |
| `clean` | `npm run clean` | Removes `dist/` and `server.js` |

> ℹ️ `clean` uses POSIX `rm -rf`, so it needs **Git Bash, WSL, or macOS/Linux**. On plain PowerShell run: `Remove-Item -Recurse -Force dist, server.js -ErrorAction SilentlyContinue`.

---

## ⚙️ Environment Variables

Copy `.env.example` to `.env` and fill in values if needed:

| Variable | Purpose | Required? |
| --- | --- | --- |
| `GEMINI_API_KEY` | Gemini API key for AI Studio's server-side Gemini capability | No — unused by current client-side code |
| `APP_URL` | Public URL of the hosted app (self-referential links / callbacks in AI Studio) | No |

The app performs **no** environment lookups at runtime today (`import.meta.env` is not used in `src/`).

---

## 📂 Project Architecture

```
isabicasta-app/
├── index.html                  # HTML5 shell: SEO/OG meta, Google Fonts, inline splash screen
├── metadata.json               # AI Studio app metadata
├── package.json                # Dependencies & scripts
├── package-lock.json           # npm lockfile
├── bun.lock                    # Bun lockfile (original toolchain)
├── tsconfig.json               # TypeScript config (ES2022, bundler resolution, @/* paths)
├── vite.config.ts              # Vite config: React + Tailwind plugins, @ alias, HMR control
├── .env.example                # Environment variable template
├── LICENSE                     # MIT
├── README.md
└── src/
    ├── main.tsx                # React entry point
    ├── App.tsx                 # Root layout: view routing, tabs, settings/profile/history state
    ├── index.css               # Typography, palette & 3D CSS utilities (Tailwind v4)
    ├── types.ts                # Shared interfaces (DecisionHistoryItem, settings, profile…)
    ├── assets/
    │   └── images/             # Ancient casting-lots & coin shekel artwork
    ├── components/
    │   ├── AboutPage.tsx       # Philosophy & "Three-Flip Principle"
    │   ├── CastLots.tsx        # Multi-option lot casting with tumbling animation
    │   ├── CoinFlip.tsx        # 3D animated best-of-three coin discernment
    │   ├── HistoryPage.tsx     # Saved outcomes: list, stats, delete/clear
    │   ├── OnboardingSlider.tsx # Swipeable scriptural-context onboarding
    │   ├── Preloader.tsx       # Animated brand splash on first load
    │   └── ProfilePage.tsx     # Profile, stats & app settings
    ├── data/
    │   └── scriptures.ts       # Biblical scriptures, context & translations
    └── utils/
        └── sound.ts            # Procedural Web Audio API sound generator
```

**Views**: the app is a single-page shell (`App.tsx`) switching between `decision` (with `coin` / `lots` tabs), `history`, `profile`, and `about`, driven by a fixed bottom navigation.

---

## 🗄️ Data & Privacy

All state lives in your browser's `localStorage` under these keys:

| Key | Type | Contents |
| --- | --- | --- |
| `isabicasta_history` | JSON array | Accepted outcomes, capped at the **100** most recent |
| `isabicasta_settings` | JSON object | `soundEnabled`, `hapticsEnabled`, `defaultMode`, `animationSpeed` |
| `isabicasta_profile` | JSON object | `displayName`, `avatarInitials`, `themePreference`, `createdAt` |
| `isabicasta_onboarding_completed` | `"true"` | Whether the onboarding slider was finished |
| `isabicasta_sound_muted` | `"true"` / `"false"` | Persisted master mute state for sound effects |

Nothing ever leaves the device. To fully reset the app, clear these keys (or all site data) in your browser's DevTools → Application → Local Storage.

---

## 🌐 Deployment

`npm run build` emits a fully static bundle in `dist/` that can be hosted anywhere:

1. **Vercel / Netlify / Cloudflare Pages** — build command `npm run build`, output directory `dist`.
2. **GitHub Pages** — publish `dist/` (e.g. with `actions/upload-pages-artifact` or `peaceiris/actions-gh-pages`).
3. **Any static server / CDN** — serve the contents of `dist/` directly; no backend or environment variables are needed.

---

## 🐛 Troubleshooting

| Symptom | Fix |
| --- | --- |
| "Port 3000 is in use" | Expected — Vite picks the next free port. Or stop the other process: `Get-NetTCPConnection -LocalPort 3000 -State Listen`, then `Stop-Process -Id <pid>` |
| `rm: command not found` when running `npm run clean` | Use Git Bash / WSL / macOS, or delete `dist/` manually |
| Vite warns about `__dirname` in `vite.config.ts` | Harmless forward-compat warning; the config works today |
| Changes don't appear | Ensure the dev server is running; if `DISABLE_HMR=true` is set, HMR and file watching are intentionally off — restart the server |
| App looks reset | Data is per-browser/per-device in `localStorage`; private windows won't persist |

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository and create your feature branch: `git checkout -b feature/awesome-thing`
2. Make your changes with clear, focused commits.
3. Verify types: `npm run lint`
4. Smoke-test locally: `npm run dev`
5. Open a pull request describing the motivation and behavior change.

Please keep the project's principles intact: **client-side only, no tracking, no accounts, respectful use of the biblical material.**

---

## ⚖️ License

IsabiCasta is free and open-source software licensed under the [MIT License](LICENSE).