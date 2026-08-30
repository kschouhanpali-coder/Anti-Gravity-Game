<div align="center">

# 🚀 Anti Gravity

**Flip gravity. Dodge the void. Chase the high score.**

A fast-paced, browser-based arcade game where a single key press inverts gravity to keep your ship alive. Navigate a neon obstacle course, rack up points, and climb the global leaderboard.

[![Live Demo](https://img.shields.io/badge/🎮_Live_Demo-Play_Now-9D4EDD?style=for-the-badge)](https://squaruns.netlify.app/)
![Status](https://img.shields.io/badge/status-live-brightgreen?style=flat-square)
![React](https://img.shields.io/badge/Built%20with-React-61DAFB?style=flat-square&logo=react&logoColor=black)

</div>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Live Demo](#-live-demo)
- [Features](#-features)
- [Tech Stack](#️-tech-stack)
- [Getting Started](#-getting-started)
- [How to Play](#-how-to-play)
- [Game Mechanics](#-game-mechanics)
- [Project Structure](#️-project-structure)
- [Deployment](#-deployment)
- [Contributing](#-contributing)

---

## 🎮 Overview

**Anti Gravity** is a retro-styled, space-themed arcade game played entirely in the browser. Control a glowing ship through an endless neon obstacle course by inverting gravity with a single key press — `SPACE`. There's no complex control scheme, no learning curve, just one input and split-second timing. Survive as long as possible, rack up points, and beat your best score, with a live leaderboard and a personal dashboard to track your stats along the way.

---

## 🌐 Live Demo

<div align="center">

### 👉 [**Play Anti Gravity Now**](https://squaruns.netlify.app/)

*Runs instantly in your browser — no download or installation needed.*

</div>

---

## ✨ Features

<table>
<tr>
<td valign="top" width="50%">

### 🕹️ Gameplay
- **One-Key Control** — press `SPACE` to invert gravity (UP ↔ DOWN)
- **Space Aesthetic** — dark neon environment with a starfield background and glowing platform obstacles
- **Launch Mission** — quick-start button from the dashboard to jump straight into a run

</td>
<td valign="top" width="50%">

### 📊 Progression
- **Live Score Tracking** — real-time score and personal best displayed during gameplay
- **Leaderboard** — global leaderboard to compete with other players
- **Player Dashboard** — view your High Score and Total Runs at a glance
- **Game Over Screen** — a "DEFEATED" screen shows mission data with options to RE-INITIALIZE or ABORT

</td>
</tr>
</table>

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | React |
| **Language** | JavaScript |
| **Styling** | CSS (dark neon theme) |
| **Routing** | React Router (`/game`, `/leaderboard`) |
| **Dev Server** | Node.js / Vite |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn

**1. Clone the repository**
```bash
git clone https://github.com/your-username/anti-gravity.git
cd anti-gravity
```

**2. Install dependencies**
```bash
npm install
```

**3. Run the app**
```bash
npm run dev
```

The game will open at `http://localhost:5173` 🚀

---

## 🎯 How to Play

| Step | Action |
|---|---|
| 1️⃣ | Click **PLAY NOW** from the navbar to start a game |
| 2️⃣ | Press **`SPACE`** to flip gravity and navigate through obstacles |
| 3️⃣ | Avoid hitting platforms — survive as long as possible |
| 4️⃣ | When defeated, view your score and choose **RE-INITIALIZE** (play again) or **ABORT** |
| 5️⃣ | Check the **Leaderboard** to see where you rank |
| 6️⃣ | Visit the **Dashboard** to view your High Score and Total Runs |

---

## 📊 Game Mechanics

| Element | Description |
|---|---|
| **Gravity** | Toggles between DOWN and UP on each `SPACE` press |
| **Obstacles** | Neon purple platforms spawning from the right |
| **Score** | Increases continuously while alive |
| **Best Score** | Saved locally across sessions |
| **Defeat** | Triggered on collision with any platform |

---

## 🗂️ Project Structure

```bash
anti-gravity/
├── src/
│   ├── pages/
│   │   ├── Game.jsx          # Core game logic & canvas
│   │   ├── Leaderboard.jsx   # Global leaderboard page
│   │   └── Dashboard.jsx     # Player stats dashboard
│   ├── components/
│   │   └── Navbar.jsx        # Navigation bar
│   ├── App.jsx                # App entry & routing
│   └── index.css              # Global dark theme styles
├── public/
└── package.json
```

---

## ☁️ Deployment

**Deploy on Vercel (Free):**

```bash
npm run build
vercel deploy
```

Or connect your GitHub repo directly on [vercel.com](https://vercel.com) — it auto-deploys on every push. 🚀

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you'd like to change.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a pull request
