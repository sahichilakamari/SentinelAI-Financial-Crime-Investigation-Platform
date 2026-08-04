# SentinelAI — AI Financial Crime Investigation Platform

A full-stack financial crime investigation platform with a Netflix-style "investigation room" experience. Analysts step through fraud cases as sequential episodes instead of static dashboards.

![SentinelAI](https://img.shields.io/badge/Stack-React%20%2B%20Express%20%2B%20PostgreSQL-blue)
![License](https://img.shields.io/badge/License-MIT-green)

---

## Features

- **Investigation Center** — Netflix-style grid of active fraud cases with risk scores and severity badges
- **Investigation Room** — 7-episode narrative case flow per investigation:
  1. Initial Alert — AI-generated case narrative
  2. Attack Timeline — animated transaction replay
  3. Evidence Collection — digital evidence wall
  4. Relationship Explorer — interactive SVG entity graph
  5. AI Findings — fraud probability gauge with SHAP-style factor breakdown
  6. Recommended Actions — analyst action checklist
  7. Investigation Report — compliance-ready export
- **Analytics Dashboard** — live stats, risk breakdown chart, activity feed
- **Dark war-room aesthetic** — deep navy + electric blue + crimson, Space Mono + Inter

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS v4, Framer Motion, Recharts, Wouter |
| Backend | Express 5, Node.js |
| Database | PostgreSQL, Drizzle ORM |
| Validation | Zod, drizzle-zod |
| API Contract | OpenAPI 3.1, Orval codegen |
| Package Manager | pnpm workspaces |

---

## Project Structure

```
sentinel-ai/
├── artifacts/
│   ├── sentinel-ai/          # React + Vite frontend
│   │   └── src/
│   │       ├── pages/
│   │       │   ├── home.tsx              # Investigation Center
│   │       │   ├── investigation-room.tsx # 7-episode case interface
│   │       │   ├── investigations.tsx     # All cases list
│   │       │   └── dashboard.tsx         # Analytics
│   │       └── components/
│   └── api-server/           # Express 5 REST API
│       └── src/
│           └── routes/
│               ├── investigations.ts     # Case + episode endpoints
│               └── dashboard.ts         # Stats + activity endpoints
├── lib/
│   ├── api-spec/
│   │   └── openapi.yaml      # API contract (source of truth)
│   ├── api-client-react/     # Auto-generated React Query hooks
│   ├── api-zod/              # Auto-generated Zod schemas
│   └── db/
│       └── src/schema/
│           └── investigations.ts  # All DB tables
└── scripts/                  # Utility scripts (seed, migrations)
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 9+
- PostgreSQL database

### Installation

```bash
# Clone the repo
git clone https://github.com/sahichilakamari/SentinelAI-Financial-Crime-Investigation-Platform.git
cd SentinelAI-Financial-Crime-Investigation-Platform

# Install dependencies
pnpm install

# Set environment variable
export DATABASE_URL="postgresql://user:password@localhost:5432/sentinelai"

# Push database schema
pnpm --filter @workspace/db run push

# Seed investigation data
pnpm --filter @workspace/scripts exec tsx src/seed-ai-findings.ts
```

### Development

```bash
# Start the API server (port 8080)
pnpm --filter @workspace/api-server run dev

# Start the frontend (separate terminal)
pnpm --filter @workspace/sentinel-ai run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the app.

### Regenerate API Client (after changing openapi.yaml)

```bash
pnpm --filter @workspace/api-spec run codegen
```

---

## Database Schema

| Table | Description |
|---|---|
| `investigations` | Core fraud cases with risk score, severity, status |
| `episodes` | 7 investigation phases per case |
| `evidence_items` | Digital evidence artifacts (logs, screenshots, device data) |
| `transaction_events` | Attack timeline events for animated replay |
| `entity_nodes` | Fraud network entities (accounts, devices, IPs) |
| `entity_edges` | Relationships between entities |
| `ai_findings` | ML model output: fraud probability, SHAP factors, conclusions |
| `activity_log` | Analyst action audit trail |

---

## API Endpoints

```
GET  /api/investigations              List all investigations
POST /api/investigations              Create investigation
GET  /api/investigations/:id          Get investigation
PATCH /api/investigations/:id         Update investigation

GET  /api/investigations/:id/episodes       List episodes
GET  /api/investigations/:id/evidence       List evidence
GET  /api/investigations/:id/transactions   Attack timeline
GET  /api/investigations/:id/graph          Entity relationship graph
GET  /api/investigations/:id/ai-findings    ML model output
GET  /api/investigations/:id/report         Compliance report

GET  /api/dashboard/summary           Stats cards
GET  /api/dashboard/recent-activity   Activity feed
GET  /api/dashboard/risk-breakdown    Chart data
```

---

## Seeded Demo Data

Four investigation cases are pre-loaded:

| Case | Type | Risk | Exposure |
|---|---|---|---|
| Money Mule Network | Wire Fraud | 94% | $284,500 |
| Account Takeover — Premium Client | ATO | 89% | $127,300 |
| Card Testing Attack — Merchant #4421 | Carding | 76% | $18,400 |
| Synthetic Identity — Loan Fraud | Synthetic ID | 81% | $142,000 |

---

## License

MIT
