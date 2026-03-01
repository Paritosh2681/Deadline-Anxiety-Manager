<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Deployed-Render-46E3B7?style=for-the-badge&logo=render&logoColor=white" alt="Render" />
</p>

<h1 align="center">⏰ Deadline Anxiety Manager (DAM)</h1>

<p align="center">
  <strong>Stop pretending you'll get to it later.</strong><br/>
  A full-stack productivity app that quantifies your procrastination into a real-time pressure score — and breaks every task into micro-steps you might actually finish.
</p>

<p align="center">
  <a href="https://deadline-anxiety-manager.onrender.com">🌐 Live Demo</a> ·
  <a href="#-features">Features</a> ·
  <a href="#-tech-stack">Tech Stack</a> ·
  <a href="#-getting-started">Getting Started</a>
</p>

---

## 💡 The Problem

Most to-do apps assume you're organized. You're not. You've got 14 tabs open, an assignment due tomorrow, and a vague sense of dread.

**DAM doesn't motivate. It mirrors.** It shows you a number that represents how screwed you are — and gives you the smallest possible action to make it better.

---

## ✨ Features

### 🔥 Real-Time Pressure Scoring
Every task gets a live **pressure score (0–100)** that recalculates dynamically based on time remaining, effort level, and how much you've actually done.

| Zone | Score | Meaning |
|------|-------|---------|
| 🟢 Calm | 0–30 | You're fine. For now. |
| 🟡 Warning | 31–60 | Things are getting real. |
| 🔴 Panic | 61–100 | It's 3 AM. The deadline is tomorrow. |

### 🧩 Micro-Task Breakdown
Every task is split into smaller, actionable steps at creation. Big tasks paralyze — small steps don't. Complete one, watch the pressure drop, feel the relief.

### 🔮 Deadline Simulator
*"What if I skip today?"* — answered with cold, hard numbers. See your projected pressure score if you do nothing. Spoiler: it's worse.

### 📈 Behavior Insights & Analytics
- Interactive **pressure timeline chart** (Recharts)
- Tracks patterns: when you create tasks, when you actually complete them
- Personalized stats: completion rates, procrastination streaks, productivity trends

### 🔔 Scheduled Notifications
- Set a **daily reminder time** per task (e.g., 9:00 AM)
- Browser notifications fire at your specified time every day until the deadline
- Per-task urgency indicators (🔴🟡🟢) with time remaining

### 🔐 Authentication
- JWT-based auth with **httpOnly secure cookies**
- Password hashing with bcryptjs
- Route protection via Next.js middleware
- Per-user data isolation

### 📱 Progressive Web App
- Installable on mobile & desktop
- Offline support via service worker
- Responsive design with mobile bottom navigation

### 🎨 UI/UX
- Dark/Light mode toggle
- Animated pressure meter on landing page
- Keyboard shortcuts for power users
- Toast notifications for feedback

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 14 (App Router) |
| **Frontend** | React 18, TypeScript |
| **Styling** | Vanilla CSS with custom design system (CSS variables) |
| **State** | SWR + React Context (Auth, Theme, Tasks) |
| **Database** | MongoDB Atlas via Mongoose |
| **Auth** | JWT (jose) + bcryptjs + httpOnly cookies |
| **Charts** | Recharts |
| **Notifications** | Browser Notification API + Service Worker |
| **Deployment** | Render |

---

## 📁 Project Structure

```
src/
├── app/
│   ├── (app)/                 # Authenticated app pages
│   │   ├── dashboard/         # Main dashboard
│   │   ├── tasks/new/         # Task creation
│   │   └── insights/          # Analytics
│   ├── (auth)/                # Login & Signup
│   ├── (marketing)/           # Landing page
│   └── api/
│       ├── auth/              # signup · login · logout · me
│       ├── tasks/             # CRUD · complete · simulate · pressure
│       ├── insights/          # Analytics · timeline
│       └── cron/              # Pressure recalculation
├── components/
│   ├── dashboard/             # Dashboard widgets
│   ├── insights/              # Charts & analytics
│   ├── layout/                # AppShell · Sidebar · MobileNav
│   ├── tasks/                 # TaskForm · TaskCard · TaskDetail
│   └── ui/                    # Button · Input · Modal · Badge etc.
├── context/                   # AuthContext · ThemeContext · TaskContext
├── hooks/                     # useTasks · useNotifications · useKeyboardShortcuts
├── lib/
│   ├── db/                    # Connection & Models (User, Task, UserBehavior)
│   ├── auth.ts                # JWT & cookie utilities
│   └── pressure.ts            # Pressure score algorithm
├── middleware.ts               # Route protection
├── types/                     # TypeScript definitions
└── utils/                     # Helpers & constants
```

---

## 🔧 API Reference

<details>
<summary><strong>Authentication</strong></summary>

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/signup` | Create account |
| `POST` | `/api/auth/login` | Sign in |
| `POST` | `/api/auth/logout` | Sign out |
| `GET` | `/api/auth/me` | Current user |

</details>

<details>
<summary><strong>Tasks</strong></summary>

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/tasks?status=all` | List tasks |
| `POST` | `/api/tasks` | Create task |
| `GET` | `/api/tasks/:id` | Task detail |
| `PUT` | `/api/tasks/:id` | Update / reschedule |
| `DELETE` | `/api/tasks/:id` | Delete task |
| `POST` | `/api/tasks/:id/complete` | Complete micro-task |
| `POST` | `/api/tasks/:id/simulate` | Simulate skipping days |
| `GET` | `/api/tasks/:id/pressure` | Pressure breakdown |

</details>

<details>
<summary><strong>Insights</strong></summary>

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/insights` | Behavior insights |
| `GET` | `/api/insights/timeline` | Pressure timeline data |
| `GET` | `/api/cron` | Trigger recalculation |

</details>

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18+
- **MongoDB Atlas** account (free tier works)

### 1. Clone & Install
```bash
git clone https://github.com/Paritosh2681/Deadline-Anxiety-Manager.git
cd Deadline-Anxiety-Manager
npm install
```

### 2. Environment Variables
Create a `.env.local` file:
```env
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/dam
JWT_SECRET=your-super-secret-key
```

### 3. Run
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

### 4. Build for Production
```bash
npm run build
npm start
```

---

## 🌐 Deployment (Render)

1. Connect your GitHub repo on [Render](https://render.com)
2. **Build Command:** `npm install --include=dev && npm run build`
3. **Start Command:** `npm start`
4. Add environment variables (`MONGODB_URI`, `JWT_SECRET`)
5. In MongoDB Atlas → Network Access → Allow `0.0.0.0/0`

---

## 🎯 What Makes DAM Different

| Other Apps | DAM |
|------------|-----|
| Priority labels | Real-time pressure score |
| Motivation quotes | Cold, hard numbers |
| Weekly planning | "What happens if I skip today?" |
| Complex organization | One list, pressure-sorted |
| Generic reminders | Scheduled per-task notifications |

---

## 📄 License

[Paritosh](https://github.com/Paritosh2681)

---

<p align="center">
  <em>Built with anxiety and Next.js</em><br/>
  <strong>⏰ DAM © 2026</strong>
</p>
