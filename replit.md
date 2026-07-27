# SentinelAI

AI-powered financial crime investigation platform with a Netflix-style investigation experience — analysts step through fraud cases as sequential "episodes" instead of traditional dashboards.

## Run & Operate

- `pnpm --filter @workspace/sentinel-ai run dev` — run the frontend (port assigned by workflow)
- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string (auto-provisioned by Replit)

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React 18 + Vite + Tailwind CSS v4 + Framer Motion + Recharts + Wouter
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

```
artifacts/sentinel-ai/        # React + Vite frontend (dark war room UI)
  src/pages/
    home.tsx                  # Investigation Center (Netflix-style landing)
    investigations.tsx        # Full investigations list
    investigation-room.tsx    # 7-episode investigation case interface
    dashboard.tsx             # Analytics dashboard
artifacts/api-server/         # Express 5 API server
  src/routes/
    investigations.ts         # All investigation + episode + graph endpoints
    dashboard.ts              # Summary stats, activity feed, risk breakdown
lib/api-spec/openapi.yaml     # Source of truth for all API contracts
lib/db/src/schema/
  investigations.ts           # All DB tables (investigations, episodes, evidence, etc.)
```

## Architecture decisions

- **Netflix-episode UI pattern**: Each fraud case is a 7-episode investigation flow — Initial Alert, Attack Replay, Evidence Wall, Relationship Explorer, AI Findings, Recommended Actions, Report. This is the product's core identity.
- **Dark-mode-only**: SentinelAI is permanently dark (cybersecurity war room aesthetic). The `dark` class is applied programmatically in `main.tsx`.
- **SVG entity graph**: The fraud relationship graph (Episode 4) uses hand-built SVG with radial layout — no react-flow dependency. This avoids a heavy dependency and gives full visual control.
- **AI findings simulated locally**: SHAP-style risk factor breakdown is seeded data. Real ML integration would replace the `ai_findings` table content with live model output.
- **Flat Tailwind v4 custom properties**: All colors defined as HSL space-separated values in `index.css` `:root` block (no `hsl()` wrapper). Google Fonts import must be first line of CSS file.

## Product

**Investigation Center** (`/`): Netflix-style grid of active fraud cases with risk scores and severity badges. Cases animate in with staggered framer-motion. 

**Investigation Room** (`/investigations/:id`): The core experience. Left panel shows 7 episode steps; right panel shows dynamic content per episode:
1. Initial Alert — AI narrative text readout
2. Attack Replay — animated transaction timeline (Framer Motion sequential reveals)
3. Evidence Wall — digital evidence cards grid
4. Relationship Explorer — interactive SVG node graph
5. AI Findings — semicircular fraud probability gauge + SHAP factor bars
6. Recommended Actions — analyst action checklist
7. Investigation Report — compliance export

**Analytics** (`/dashboard`): Live stats cards, Recharts risk breakdown bar chart, recent activity feed.

## Seeded Data

4 investigation cases:
- Money Mule Network (Critical, 94% risk) — full data including episodes, evidence, transactions, entity graph, AI findings
- Account Takeover — Premium Client (Critical, 89% risk) — partial data
- Card Testing Attack — Merchant #4421 (High, 76%)
- Synthetic Identity — Loan Fraud (High, 81%)

## User preferences

- Push all code to GitHub after build
- GitHub username: sahichilakamari

## Gotchas

- `@apply dark` is invalid in Tailwind v4 — add `dark` class via JS instead (`document.documentElement.classList.add('dark')`)
- Google Fonts `@import url(...)` must be the very first line in `index.css` before any other `@import` statements
- Fine-grained GitHub PATs need "Administration: write" permission to create new repositories via API
- Always run `pnpm --filter @workspace/api-spec run codegen` after changing `lib/api-spec/openapi.yaml`

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
