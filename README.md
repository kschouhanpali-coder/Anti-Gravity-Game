# Anti Gravity 🚀

> *A fast-paced browser-based arcade game where you flip gravity to survive. Navigate your ship through obstacles, collect points, and climb the leaderboard.*

![Status](https://img.shields.io/badge/status-live-brightgreen?style=flat-square)
![Stack](https://img.shields.io/badge/Built%20with-React-61DAFB?style=flat-square&logo=react)
![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)

---

## 🎮 What is Anti Gravity?

**Anti Gravity** is a retro-styled, space-themed arcade game played entirely in the browser. Control a glowing ship through a neon obstacle course by inverting gravity with a single key press — `SPACE`. Survive as long as possible, rack up points, and beat your best score. Features a live leaderboard and personal dashboard to track your stats.

---

## ✨ Features

- 🕹️ **One-Key Control** — Press `SPACE` to invert gravity (UP ↔ DOWN)
- 🌌 **Space Aesthetic** — Dark neon environment with starfield background and glowing platform obstacles
- 📊 **Live Score Tracking** — Real-time score and personal best displayed during gameplay
- 🏆 **Leaderboard** — Global leaderboard to compete with other players
- 👤 **Player Dashboard** — View your High Score and Total Runs at a glance
- 💀 **Game Over Screen** — "DEFEATED" screen shows mission data (final score) with options to RE-INITIALIZE or ABORT
- 🚀 **Launch Mission** — Quick-start button from the dashboard to jump straight into a run

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | React |
| Language | JavaScript |
| Styling | CSS (dark neon theme) |
| Routing | React Router (`/game`, `/leaderboard`) |
| Dev Server | Node.js / Vite |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn

### 1. Clone the repository
```bash
git clone https://github.com/your-username/anti-gravity.git
cd anti-gravity
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run the app
```bash
npm run dev
```

---

## 🎯 How to Play

1. Click **PLAY NOW** from the navbar to start a game
2. Press **`SPACE`** to flip gravity and navigate through obstacles
3. Avoid hitting platforms — survive as long as possible
4. When defeated, view your score and choose to **RE-INITIALIZE** (play again) or **ABORT**
5. Check the **Leaderboard** to see where you rank
6. Visit **Dashboard** to view your High Score and Total Runs

---

## 🗂️ Project Structure

```
anti-gravity/
├── src/
│   ├── pages/
│   │   ├── Game.jsx          # Core game logic & canvas
│   │   ├── Leaderboard.jsx   # Global leaderboard page
│   │   └── Dashboard.jsx     # Player stats dashboard
│   ├── components/
│   │   └── Navbar.jsx        # Navigation bar
│   ├── App.jsx               # App entry & routing
│   └── index.css             # Global dark theme styles
├── public/
└── package.json
```

---

## 📊 Game Mechanics

| Element | Description |
|---|---|
| Gravity | Toggles between DOWN and UP on `SPACE` press |
| Obstacles | Neon purple platforms spawning from the right |
| Score | Increases continuously while alive |
| Best Score | Saved locally across sessions |
| Defeat | Triggered on collision with any platform |

---

## 🌐 Deployment

### Deploy on Vercel (Free)
```bash
npm run build
vercel deploy
```

Or connect your GitHub repo directly on [vercel.com](https://vercel.com) and it auto-deploys on every push.

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you'd like to change.

---

## 📄 License

MIT © 2026 — Built with ❤️ for arcade game lovers.
