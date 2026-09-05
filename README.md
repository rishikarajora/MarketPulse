# 📈 MarketPulse — Intelligent Market Watchlist

> **Don't just tell me what my stocks are doing. Tell me what changed, how significant it is, and why it deserves my attention.**

MarketPulse is an intelligent market watchlist built for **CODE 2026**.

Unlike a traditional watchlist that simply displays prices and percentage changes, MarketPulse remembers what the user saw previously and identifies **meaningful changes since their last visit**.

---

## 🚀 Live Demo

**Demo:** `https://market-pulse-eight-theta.vercel.app/`

## 💻 Source Code

**GitHub:** https://github.com/rishikarajora/MarketPulse

---

## 🎯 The Problem

Traditional stock watchlists answer:

> "What is the price of my stock right now?"

But they don't answer:

* What changed since I last checked?
* Which change actually matters?
* Is this movement significant or just normal market noise?
* Is the stock behaving differently from its sector?
* Why should I pay attention to this stock?

MarketPulse is designed around these questions.

---

# 💡 What MarketPulse Does

MarketPulse transforms a passive watchlist into an **attention-focused market intelligence layer**.

When a user returns to the application, MarketPulse compares the latest market state with the user's previous snapshot and surfaces the changes that matter most.

### Core experience

**Last visit → Market changes → Intelligence → Attention**

Instead of overwhelming the user with raw market data, MarketPulse prioritizes meaningful signals.

---

# ⭐ Key Features

## 1. 🕐 Since You Last Checked

MarketPulse stores a snapshot of the user's watchlist and compares it with the latest market state.

The dashboard highlights:

* Price movement
* Volume changes
* Significance changes
* Meaningful movements above configured thresholds

This gives the user an immediate answer to:

> **"What did I miss?"**

---

## 2. 🧠 Meaningful Change Engine

Not every price movement deserves attention.

MarketPulse calculates a **Significance Score** using multiple market signals:

* Price movement
* Volume anomaly
* Sector divergence
* Recent volatility

The signals are combined into a single score from **0–100**.

### Significance levels

| Score  | Level  |
| ------ | ------ |
| 0–39   | Low    |
| 40–69  | Medium |
| 70–100 | High   |

This allows the watchlist to prioritize important movements instead of simply sorting by price percentage.

---

## 3. 🔍 Explainable Intelligence

Every significant movement can be investigated through **View Why**.

The explanation exposes the signals contributing to the stock's significance, rather than presenting an unexplained AI-generated conclusion.

Example signals include:

```text
Price Movement
Volume Anomaly
Sector Divergence
Recent Volatility
```

The goal is simple:

> **Don't just surface an alert. Explain why it surfaced.**

---

## 4. 📊 Market Context

MarketPulse provides additional context around individual stock movements, including:

* Sector performance
* Relative performance
* Volume compared with average activity
* Recent volatility
* Market-level information

This helps distinguish isolated movements from broader market behaviour.

---

## 5. 💾 Persistent Snapshots

MarketPulse stores market snapshots using a backend and MongoDB Atlas.

This enables the application to remember the user's previous market state instead of relying only on temporary browser state.

The snapshot system supports the core:

**"Since You Last Checked"**

experience.

---

## 6. 🛡️ Resilient Market Data

Market data can become unavailable, delayed, or restricted depending on provider coverage and API plan.

MarketPulse is designed to handle this gracefully through:

* Market-data service abstraction
* Fallback behaviour
* Explicit stale/fallback state
* Separation between data retrieval and intelligence processing

The application avoids silently treating fallback data as live market data.

---

## 7. 📋 Smart Watchlist

Users can:

* Add stocks
* Remove stocks
* View watchlist market information
* Persist their watchlist
* Return later and see what changed

---

## 🏗️ Architecture

```text
                    ┌──────────────────────┐
                    │      React + Vite    │
                    │       Frontend       │
                    └──────────┬───────────┘
                               │
                               │ REST API
                               ▼
                    ┌──────────────────────┐
                    │   Node + Express     │
                    │       Backend        │
                    └──────┬────────┬──────┘
                           │        │
              ┌────────────┘        └─────────────┐
              ▼                                    ▼
    ┌──────────────────┐                 ┌──────────────────┐
    │  Market Data     │                 │   Intelligence   │
    │    Service       │                 │     Engine       │
    └────────┬─────────┘                 └──────────────────┘
             │
             ▼
    ┌──────────────────┐
    │  Market Data API │
    │  + Fallback      │
    └──────────────────┘

                    ┌──────────────────────┐
                    │     MongoDB Atlas    │
                    │ Watchlists/Snapshots │
                    └──────────────────────┘
```

---

# 🧩 Backend Structure

```text
backend/
├── config/
│   └── db.js
│
├── controllers/
│   ├── watchlist.controller.js
│   ├── market.controller.js
│   ├── alerts.controller.js
│   └── snapshot.controller.js
│
├── models/
│   ├── Watchlist.js
│   └── Snapshot.js
│
├── routes/
│   ├── watchlist.routes.js
│   ├── market.routes.js
│   ├── alerts.routes.js
│   └── snapshot.routes.js
│
├── services/
│   ├── marketData.service.js
│   ├── intelligence.service.js
│   └── snapshot.service.js
│
├── utils/
│   └── significance.js
│
├── server.js
└── package.json
```

---

# 🛠️ Tech Stack

### Frontend

* React
* Vite
* React Router
* Recharts
* CSS

### Backend

* Node.js
* Express.js
* REST APIs

### Database

* MongoDB Atlas
* Mongoose

### Market Data

* Market data provider integration
* Fallback market-data handling

### Deployment

* Vercel — Frontend
* Render — Backend
* MongoDB Atlas — Database

---

# 🔄 How It Works

### Step 1 — Build the Watchlist

The user adds stocks to their watchlist.

### Step 2 — Fetch Market Data

The backend retrieves market information through the market-data service.

### Step 3 — Analyse Signals

The intelligence engine calculates:

```text
Price Movement
       +
Volume Anomaly
       +
Sector Divergence
       +
Recent Volatility
       ↓
Significance Score
```

### Step 4 — Save Snapshot

When the user marks the market as checked, the current watchlist state is stored as a snapshot.

### Step 5 — User Returns

The latest market state is compared with the previous snapshot.

### Step 6 — Surface What Matters

Only meaningful changes are surfaced in:

**Since You Last Checked**

### Step 7 — Explain

The user can open **View Why** to understand the signals behind the change.

---

# 🔌 API Overview

### Health

```http
GET /api/health
```

### Watchlist

```http
GET    /api/watchlist
POST   /api/watchlist
DELETE /api/watchlist/:symbol
```

### Market

```http
GET /api/market/quote/:symbol
GET /api/market/watchlist
```

### Snapshots

```http
POST /api/snapshot
GET  /api/snapshot/latest
GET  /api/snapshot/changes
```

---

# 🛡️ Edge Cases & Resilience

MarketPulse is designed with real-world failure scenarios in mind.

### Empty Watchlist

The application gracefully handles an empty watchlist.

### No Previous Snapshot

If the user has never created a snapshot, there is no false "change" shown.

### Missing Stock in Previous Snapshot

Newly added stocks are not incorrectly treated as historical movements.

### Market Data Failure

The market-data layer can fall back when the primary provider is unavailable.

### Stale Data

Fallback/stale market data is explicitly represented rather than silently presented as live data.

### Small Market Movements

Minor movements below the meaningful-change threshold are filtered to reduce noise.

---

# 🧠 Product Philosophy

MarketPulse is built around **attention, not information overload**.

A conventional watchlist gives users more numbers.

MarketPulse tries to give users:

**Fewer, more meaningful signals.**

The core product question is:

> **"What deserves my attention right now?"**

---

# ⚖️ Responsible Financial UX

MarketPulse is an informational market-intelligence tool.

It does **not** provide personalized investment advice or claim that a detected event caused a price movement without supporting evidence.

Signals are presented as indicators for further investigation.

---

# 📸 Screenshots
<img width="1919" height="997" alt="image" src="https://github.com/user-attachments/assets/8492951f-f500-442b-bba4-ae0d89b78f79" />
<img width="1896" height="996" alt="image" src="https://github.com/user-attachments/assets/6304158d-dbab-483f-b778-c6502aa799ab" />
<img width="1879" height="977" alt="image" src="https://github.com/user-attachments/assets/e690d19e-af1b-4488-89ca-f3f245bf44cf" />





---

# 🚀 Run Locally

## Prerequisites

* Node.js 18+
* MongoDB Atlas account
* Market data API key

---

## Backend

```bash
cd backend
npm install
```

Create:

```text
backend/.env
```

Add:

```env
MONGODB_URI=your_mongodb_connection_string
TWELVE_DATA_API_KEY=your_market_data_api_key
```

Start the backend:

```bash
node server.js
```

Backend:

```text
http://localhost:5000
```

---

## Frontend

Open a new terminal:

```bash
cd marketpulse-frontend
npm install
npm run dev
```

Open the Vite development URL shown in the terminal.

Typically:

```text
http://localhost:5173
```

---

# 🌐 Production

The production architecture separates the frontend, backend, database, and market-data layer:

```text
Vercel
  │
  ▼
React Frontend
  │
  ▼
Render
  │
  ├── Express API
  ├── Intelligence Engine
  └── Market Data Service
          │
          ▼
     MongoDB Atlas
```

---

# 🔮 Future Improvements

The current architecture can be extended with:

* Real-time WebSocket market updates
* Redis-based market-data caching
* Multiple personalized watchlists
* Advanced event correlation
* Smart notifications
* Personalized attention scoring
* Market-wide intelligence
* More sophisticated anomaly detection
* Scalable market-data ingestion

---

# 🏆 Built for CODE 2026

MarketPulse was built for the **CODE 2026 hackathon** with a focus on:

* Engineering depth
* Product interpretation
* Edge-case resilience
* Explainable intelligence
* Clean architecture
* Meaningful differentiation from a traditional watchlist

---

## 💚 MarketPulse

**A smarter way to know what changed.**

> **Since you last checked.**
