
# SentinelAI

## AI-Powered Financial Crime Investigation Platform

Traditional fraud systems tell analysts **whether** a transaction is suspicious.

**SentinelAI explains what happened, why it happened, who was involved, and how the fraud unfolded through an interactive investigation experience.**

---

## Why SentinelAI?

Traditional fraud tools overwhelm analysts with disconnected alerts, logs, and dashboards.

SentinelAI restructures investigations into a guided workflow where evidence, timelines, relationships, and AI explanations are presented in the order analysts naturally investigate a case.

---

## Architecture diagram

<img width="243" height="223" alt="image" src="https://github.com/user-attachments/assets/d1833109-8c0e-472f-a6d8-23b1e7a55407" />

<img width="241" height="214" alt="image" src="https://github.com/user-attachments/assets/c088eb3f-e7db-4432-a5cb-4c174b896b6e" />

<img width="155" height="101" alt="image" src="https://github.com/user-attachments/assets/b0e6030f-f2bd-4e57-a5e2-fd0ebf9f204e" />

<img width="169" height="101" alt="image" src="https://github.com/user-attachments/assets/d8bd1b47-85b4-4629-9935-47ac16b9a2a7" />

<img width="156" height="103" alt="image" src="https://github.com/user-attachments/assets/29c8f0d9-9997-41e1-9b52-01c5f72bffa2" />

---

## Features

- **Investigation Center** — Netflix-style grid of active fraud cases with risk scores and severity badges
  <img width="959" height="494" alt="image" src="https://github.com/user-attachments/assets/97f20813-935b-4df3-b6b3-d50e2d22e6d1" />
- **Investigation Room** — 7-episode narrative case flow per investigation:
  1. Initial Alert — AI-generated case narrative
     <img width="935" height="488" alt="image" src="https://github.com/user-attachments/assets/d7eee108-5365-4a39-9522-6bcf09ddfb88" />

  2. Attack Timeline — animated transaction replay
     <img width="828" height="495" alt="image" src="https://github.com/user-attachments/assets/aa384cfd-23af-48ce-84cf-34bf127aaa25" />

  3. Evidence Collection — digital evidence wall
     <img width="943" height="488" alt="image" src="https://github.com/user-attachments/assets/34cce0c1-e1cf-4647-8f5e-a7da7d2b9ebb" />

  4. Relationship Explorer — interactive SVG entity graph
     <img width="941" height="485" alt="image" src="https://github.com/user-attachments/assets/e3ef9005-b3f3-4cc0-85cd-4c7dee31e0cc" />

  5. AI Findings — fraud probability gauge with SHAP-style factor breakdown
      <img width="940" height="493" alt="image" src="https://github.com/user-attachments/assets/033faa14-eb4d-41f2-aead-91c43f2e4fb4" />

  6. Recommended Actions — analyst action checklist
      <img width="944" height="488" alt="image" src="https://github.com/user-attachments/assets/378c307f-3849-4ec7-acc8-386441b11692" />

  7. Investigation Report — compliance-ready export
      <img width="944" height="481" alt="image" src="https://github.com/user-attachments/assets/727d68ea-ead4-42e4-9c34-40dea9ad5ac4" />

- **Analytics Dashboard** — live stats, risk breakdown chart, activity feed
<img width="941" height="489" alt="image" src="https://github.com/user-attachments/assets/7b996ff7-d8e7-4a92-8d14-c50a8b9dc55d" />

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

## Engineering Decisions (Trade-offs)

1. API-First Architecture

Decision: Designed the backend around REST APIs with an OpenAPI specification before implementing frontend features.

Trade-off: Required additional upfront work for API contracts and code generation, but ensured frontend/backend remained decoupled and easier to maintain.

2. Monorepo with pnpm Workspaces

Decision: Organized frontend, backend, shared schemas, and API contracts in a single monorepo.

Trade-off: Slightly more complex project setup, but simplified dependency management, code sharing, and version consistency across services.

3. SVG Graph instead of React Flow

Decision: Implemented the fraud relationship explorer using custom SVG rendering.

Trade-off: Required writing custom layout logic, but reduced bundle size, removed a heavy dependency, and provided complete control over graph rendering.

4. OpenAPI + Orval Code Generation

Decision: Generated React API hooks and Zod validation schemas directly from the OpenAPI specification.

Trade-off: Added a code-generation step to development, but eliminated duplicate API definitions and reduced integration bugs.

5. Simulated AI Findings

Decision: Seeded SHAP explanations and investigation conclusions instead of deploying live ML inference.

Trade-off: Sacrificed real-time model execution, but allowed the platform to demonstrate the complete investigation workflow without requiring GPU infrastructure or production models.

6. PostgreSQL as Primary Store

Decision: Stored investigations, evidence, transactions, and reports in PostgreSQL.

Trade-off: Graph traversals are less efficient than a graph database, but simplified deployment and kept relational data management straightforward.

7. Episode-Based Investigation UX

Decision: Structured investigations as sequential "episodes" instead of multiple dashboards.

Trade-off: Less flexible for experienced analysts who prefer jumping between modules, but significantly improves usability and reduces cognitive load during investigations.

8. Dark-Only Interface

Decision: Optimized the interface exclusively for a cybersecurity war-room environment.

Trade-off: No light-theme support, but improves readability during prolonged monitoring sessions and reinforces the operational context.

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

## Demo Investigation Cases

Four investigation cases are pre-loaded:

| Case | Type | Risk | Exposure |
|---|---|---|---|
| Money Mule Network | Wire Fraud | 94% | $284,500 |
| Account Takeover — Premium Client | ATO | 89% | $127,300 |
| Card Testing Attack — Merchant #4421 | Carding | 76% | $18,400 |
| Synthetic Identity — Loan Fraud | Synthetic ID | 81% | $142,000 |

---

## Roadmap

Phase 1 – Intelligence Layer
Integrate live fraud detection models (XGBoost + Isolation Forest)
Replace seeded SHAP explanations with real model inference
Support streaming transaction scoring

Phase 2 – Graph Intelligence
Migrate relationship analysis to Neo4j
Add shortest-path and community detection algorithms
Automatically identify coordinated fraud rings

Phase 3 – Event-Driven Architecture
Integrate Kafka for real-time transaction ingestion
Support asynchronous investigation creation
Add background workers for evidence processing

Phase 4 – Agentic AI
Implement LangGraph multi-agent workflows
Timeline Agent
Evidence Agent
Pattern Matching Agent
Recommendation Agent
Compliance Report Agent

Phase 5 – Enterprise Readiness
JWT/OAuth2 authentication with role-based access control (RBAC)
Audit logging and immutable investigation history
Multi-tenant organization support
Compliance-ready PDF and SAR report generation

Phase 6 – Observability & Deployment
Dockerized deployment
GitHub Actions CI/CD
Prometheus metrics
Grafana dashboards
Structured logging and alerting

---
