# Architecture — Aventure Métier

## Overview

Aventure Métier is a multilingual career orientation game for young people in Canton Zurich. The architecture follows a layered pattern designed to support growing data sources, authentication, and future features like study paths and subscription tiers.

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16.1 (App Router, Turbopack) |
| UI | React 19, Tailwind CSS v4 |
| Language | TypeScript (strict) |
| Database | PostgreSQL + pgvector |
| ORM | Prisma 7 (PrismaPg adapter) |
| Auth | Auth.js v5 (JWT strategy, credentials provider) |
| i18n | next-intl (fr, de, en) |
| Testing | Vitest + jsdom + Testing Library |
| Embeddings | Pluggable: Ollama (bge-m3, 1024d) or OpenAI (text-embedding-3-small, 1536d) |

## Layered Architecture

```
┌─────────────────────────────────────────────────┐
│  Pages & Components (React, "use client")       │
│  src/app/[locale]/, src/components/             │
├─────────────────────────────────────────────────┤
│  Server Actions (thin orchestration layer)      │
│  src/app/actions/                               │
├─────────────────────────────────────────────────┤
│  Repositories (data access, Prisma queries)     │
│  src/repositories/                              │
├──────────────────────┬──────────────────────────┤
│  Domain (pure logic) │  Infrastructure (I/O)    │
│  src/domain/         │  src/infrastructure/     │
│  - profile/          │  - db.ts (Prisma)        │
│  - matching/         │  - auth.ts (Auth.js)     │
│                      │  - password.ts (bcrypt)  │
│                      │  - embeddings/ (vectors) │
└──────────────────────┴──────────────────────────┘
```

### Dependency rules

- **Domain** depends on nothing. Pure functions, no I/O, no framework imports.
- **Infrastructure** depends on external systems (PostgreSQL, Auth.js, embedding APIs).
- **Repositories** depend on infrastructure (db) and domain (types).
- **Actions** depend on repositories and domain. Never import Prisma directly.
- **Components/Pages** depend on actions (server actions) and domain (pure functions only — never import infrastructure or repositories).

### Import conventions

```typescript
// Domain (safe everywhere, including client components)
import { emptyProfile } from "@/domain/profile";
import { getRadarData } from "@/domain/matching/radar";

// Infrastructure (server only)
import { prisma } from "@/infrastructure/db";
import { auth } from "@/infrastructure/auth";

// Repositories (server only)
import { findProfessionById } from "@/repositories/profession-repository";

// Actions (callable from client components via server actions)
import { saveChoice } from "@/app/actions/game-state";

// Components
import { HeaderBar } from "@/components/layout/header-bar";
import { RadarChart } from "@/components/game/radar-chart";
```

**Warning**: Never import from the barrel `@/domain/matching` in client components — it re-exports `hybrid-matcher.ts` which transitively imports infrastructure code (Prisma/pg). Use direct submodule imports like `@/domain/matching/radar`.

## Directory Structure

```
src/
├── domain/                         # Pure business logic
│   ├── profile/
│   │   ├── dimensions.ts           # 12 dimensions, types, emptyProfile
│   │   ├── accumulate.ts           # Profile accumulation (sum choice tags)
│   │   └── index.ts
│   └── matching/
│       ├── cosine-similarity.ts    # Shape-based profile matching
│       ├── radar.ts                # Radar chart data computation
│       ├── hybrid-matcher.ts       # Blends dimension + semantic scores
│       └── index.ts
│
├── infrastructure/                 # External integrations
│   ├── db.ts                       # Prisma client singleton
│   ├── auth.ts                     # Auth.js v5 config (JWT, credentials)
│   ├── password.ts                 # bcrypt hash/verify
│   └── embeddings/                 # Vector embedding system
│       ├── types.ts                # EmbeddingProvider interface
│       ├── ollama.ts / openai.ts   # Provider implementations
│       ├── vector-search.ts        # pgvector operations ($queryRaw)
│       ├── compose-text.ts         # Text composition for embedding
│       └── seed-embeddings.ts      # Batch embedding generation
│
├── repositories/                   # Data access (Prisma queries)
│   ├── profession-repository.ts    # findById, findAll, findByIds
│   ├── scenario-repository.ts      # findAll, findById
│   ├── embedding-repository.ts     # Re-exports vector search ops
│   ├── user-repository.ts          # create, find, increment profile, upgrade
│   └── game-state-repository.ts    # choices, scenarios, progress
│
├── scrapers/                       # Pluggable data source scrapers
│   ├── types.ts                    # Scraper, ScrapedRecord interfaces
│   ├── registry.ts                 # ScraperRegistry singleton
│   ├── index.ts                    # Registers all scrapers
│   └── orientation-ch/             # orientation.ch implementation
│
├── app/
│   ├── [locale]/
│   │   ├── page.tsx                # Home (guest session start)
│   │   ├── error.tsx / loading.tsx # Error/loading boundaries
│   │   ├── (game)/                 # Route group: game features
│   │   │   ├── scenarios/          # Scenario list
│   │   │   ├── scenario/[id]/      # Scenario player
│   │   │   ├── results/            # Match results (real profile data)
│   │   │   └── profile/            # User profile + stats
│   │   ├── (explore)/              # Route group: content exploration
│   │   │   ├── careers/            # Career directory
│   │   │   └── career/[id]/        # Career detail
│   │   └── (auth)/                 # Route group: authentication
│   │       ├── login/              # Email + password login
│   │       └── register/           # Guest → registered upgrade
│   ├── api/auth/[...nextauth]/     # Auth.js route handler
│   ├── actions/                    # Server Actions
│   │   ├── game-state.ts           # startGame, saveChoice, completeScenario
│   │   ├── auth.ts                 # registerUser, loginUser, logoutUser
│   │   ├── career.ts / careers.ts  # Career data
│   │   ├── scenarios.ts            # Scenario data
│   │   ├── semantic-search.ts      # Vector search
│   │   └── similar-professions.ts  # Profession similarity
│   └── globals.css
│
├── components/                     # Feature-grouped UI components
│   ├── layout/                     # header-bar, progress-bar, theme-toggle
│   ├── game/                       # scenario-player, radar-chart, flip-card
│   └── career/                     # career-detail, career-search, similar
│
├── i18n/                           # next-intl config
├── lib/                            # Re-export shims (legacy, to be removed)
└── generated/prisma/               # Auto-generated Prisma client
```

## Authentication Flow

```
Guest Flow:
  Home → startGame(name) → creates User(isGuest:true) → sets userId cookie
    → plays scenarios → choices saved via cookie-based userId

Registration:
  Register page → registerUser(email, password)
    → finds userId from cookie → upgrades User (isGuest:false, sets email+hash)

Login:
  Login page → loginUser(email, password)
    → Auth.js signIn("credentials") → JWT session with userId

Session Resolution (getUserId):
  1. Check Auth.js session (registered users) → session.user.id
  2. Fall back to userId cookie (guest users)
```

## Game State Flow

```
Player clicks choice in ScenarioPlayer
  → saveChoice(scenarioId, sceneKey, choiceId, tags)  [fire-and-forget]
    → UserChoice row created in DB
    → User profile dimensions atomically incremented (Prisma { increment })

Player reaches final scene
  → completeScenario(scenarioId)  [useEffect on EndScreen mount]
    → UserScenario row upserted

Results/Profile pages
  → getUserGameState()
    → reads User profile (12 dimensions) from DB
    → reads completed scenario count
    → feeds real data to RadarChart
```

## Matching System

Two algorithms combined in hybrid mode:

1. **Cosine similarity** — Compares player's 12-dimension profile vector against profession profiles. Shape-based (magnitude-independent).
2. **Semantic search** — Embeds player's top dimensions as text, searches profession embeddings via pgvector cosine distance.
3. **Hybrid** — Weighted blend: `score = dim_score * 0.7 + semantic_score * 0.3`

## Data Pipeline

Data sources are pluggable via the `Scraper` interface:

```typescript
interface Scraper {
  readonly sourceId: string;
  readonly supportedLocales: string[];
  scrape(locale: string, options?: ScrapeOptions): Promise<ScrapedRecord[]>;
}
```

Current source: `orientation-ch` (CFC professions from orientation.ch).
New sources: implement `Scraper`, register in `src/scrapers/index.ts`.

## Testing Strategy

| Layer | Mocks | Example |
|-------|-------|---------|
| Domain | None (pure functions) | `accumulate.test.ts` |
| Infrastructure | Global fetch, env vars | `embedding-provider.test.ts` |
| Repositories | `@/infrastructure/db` | `user-repository.test.ts` |
| Actions | `@/repositories/*`, `@/infrastructure/auth` | `game-state.test.ts` |
| Components | Server actions, next-intl, next/navigation | `scenario-player.test.tsx` |

Each layer mocks only the layer directly below it, never skipping levels.

## Database Schema (key models)

- **User** — Profile dimensions (12 ints), auth fields (email, passwordHash, isGuest), game state relations
- **Profession** — Profile dimensions, swissdoc classification, translations with embeddings
- **Scenario → Scene → Choice** — Game content with dimension tags on each choice
- **UserChoice / UserScenario** — Game state tracking
- **Account / Session / VerificationToken** — Auth.js standard tables

## Future Architecture (planned)

### Phase 3: Background Ingestion
- `IngestionLog` model for tracking scrape runs
- `/api/cron/ingest` route for scheduled data updates
- Multiple data sources via scraper registry

### Phase 4: Study Paths & Schools
- `School`, `StudyProgram`, `StudyPath` models
- New scraper for school data
- Personalized study path recommendations

### Subscription Tiers (when needed)
- `role` field on User (`free` / `premium` / `admin`)
- `can(user, action)` permission check in services
- Stripe integration (deferred)
