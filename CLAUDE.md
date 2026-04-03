# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

"Aventure Métier" — A multilingual career orientation game for young people in Canton Zurich. Players explore interactive scenarios representing different professional sectors, make choices that build a personality profile across 12 dimensions, and get matched to real Swiss professions (CFC/AFP) using both cosine similarity and semantic vector search (pgvector). Data sourced from orientation.ch.

## Development Commands

```bash
# Dev server (Turbopack, default in Next.js 16)
npm run dev

# Full dev: starts PostgreSQL, Prisma dev server, runs migrations, then Next.js
npm run dev:full            # runs dev.sh

# Build
npm run build

# Tests (Vitest)
npm run test                # single run
npm run test:watch          # watch mode
npm run test:coverage       # with coverage

# Prisma
npx prisma generate          # Generate client after schema changes
npx prisma migrate dev       # Create/apply migrations
npx prisma db seed            # Seed database

# Lint
npm run lint

# Data pipeline scripts (run manually with tsx)
npx tsx scripts/scrape-orientationch.ts    # Scrape profession data from orientation.ch
npx tsx scripts/import-professions.ts      # Import scraped data into DB
npx tsx scripts/generate-embeddings.ts     # Generate vector embeddings for professions
```

## Architecture

### Stack

- **Next.js 16.1** (App Router + Turbopack)
- **React 19**
- **TypeScript**
- **Prisma 7** + PostgreSQL + **pgvector** (configured via `prisma.config.ts`, client generated to `src/generated/prisma/`)
- **next-intl** for i18n (3 locales: fr, de, en)
- **Tailwind CSS v4** (no `@apply` with custom classes — use plain CSS in `globals.css`)
- **Vitest** + jsdom + Testing Library for tests

### Key Directories

```
src/
├── app/
│   ├── [locale]/              # All pages under locale segment
│   │   ├── page.tsx           # Home
│   │   ├── profile/           # User profile view
│   │   ├── results/           # Match results
│   │   ├── scenarios/         # Scenario list
│   │   ├── scenario/[id]/     # Scenario player
│   │   ├── careers/           # Career directory (grouped by Swissdoc domain)
│   │   └── career/[id]/       # Career detail page
│   ├── actions/               # Server Actions (no API routes — all data via actions)
│   │   ├── career.ts          # getCareerById(id, locale)
│   │   ├── careers.ts         # getAllCareers(locale) → grouped by Swissdoc domain
│   │   ├── scenarios.ts       # getScenarioList, getScenarioById
│   │   ├── semantic-search.ts # semanticSearch(query, locale, limit)
│   │   └── similar-professions.ts # getSimilarProfessions via embeddings
│   └── globals.css            # Tailwind + custom component styles
├── components/                # Shared React components
│   ├── career-detail.tsx      # Career detail view
│   ├── career-search.tsx      # Career search/filter
│   ├── flip-card.tsx          # Animated flip card
│   ├── header-bar.tsx         # Top navigation
│   ├── progress-bar.tsx       # Progress indicator
│   ├── radar-chart.tsx        # 12-dimension radar visualization
│   ├── scenario-player.tsx    # Scenario/choice UI
│   ├── similar-professions.tsx # Similar profession recommendations
│   └── theme-toggle.tsx       # Dark/light mode
├── lib/                       # Core business logic
│   ├── db.ts                  # Prisma client singleton (PrismaPg adapter)
│   ├── matching.ts            # Cosine similarity matching engine
│   ├── matching-hybrid.ts     # Hybrid matching: dimensions + semantic search
│   ├── profile-dimensions.ts  # 12 dimensions definition, radar pairs, types
│   └── embeddings/            # Vector embedding system
│       ├── index.ts           # Provider factory (getEmbeddingProvider)
│       ├── types.ts           # EmbeddingProvider interface
│       ├── ollama.ts          # Ollama provider (bge-m3, 1024 dims)
│       ├── openai.ts          # OpenAI provider (text-embedding-3-small, 1536 dims)
│       ├── vector-search.ts   # pgvector DB operations (store, search, similarity)
│       ├── compose-text.ts    # Text composition for embedding input
│       └── seed-embeddings.ts # Batch embedding generation
├── i18n/                      # Internationalization config
│   ├── routing.ts             # Locales: ["fr", "de", "en"], default: "fr"
│   ├── request.ts             # Per-request message loading
│   └── navigation.ts          # Locale-aware Link, useRouter, redirect
└── generated/prisma/          # Auto-generated Prisma client (do not edit)
```

### i18n Setup

- Routing config: `src/i18n/routing.ts` — defines locales `["fr", "de", "en"]`, default `"fr"`
- Request config: `src/i18n/request.ts` — loads messages per locale
- Navigation helpers: `src/i18n/navigation.ts` — locale-aware `Link`, `useRouter`, `redirect`
- Proxy: `proxy.ts` at project root (replaces `middleware.ts` in Next.js 16)
- UI strings: `messages/{fr,de,en}.json`
- DB content: translation tables per entity (ProfessionTranslation, ScenarioTranslation, etc.)

### Profile System

12 dimensions (0-10 scale): `manuel`, `intellectuel`, `creatif`, `analytique`, `interieur`, `exterieur`, `equipe`, `independant`, `contactHumain`, `technique`, `routine`, `variete`. Stored both on User model and Profession model in Prisma. Matching uses cosine similarity (shape-based, magnitude-independent).

### Matching System

Two matching approaches, combined in hybrid mode:

1. **Cosine similarity** (`matching.ts`) — Compares 12-dimension profile vectors. Shape-based, magnitude-independent.
2. **Semantic search** (`embeddings/vector-search.ts`) — pgvector cosine distance on profession text embeddings. Uses pluggable providers (Ollama bge-m3 at 1024 dims, or OpenAI text-embedding-3-small at 1536 dims).
3. **Hybrid** (`matching-hybrid.ts`) — Blends dimension scores with semantic search scores using configurable weights.

### Database Schema

Content is multilingual via `*Translation` tables (one per entity: Sector, Profession, Scenario, Scene, Choice, Badge). Each translation table has a `@@unique([entityId, locale])` constraint. `ProfessionTranslation` includes an `embedding` column (`vector(1024)`) managed via `$queryRaw` for pgvector operations. User game state is stored in User + related tables (UserScenario, UserChoice, UserCareerView, UserBadge). Professions are grouped by `swissdocGroup` (100–800) derived from the Swissdoc classification.

### Tailwind v4 Notes

- Uses `@theme inline` for custom design tokens — no `tailwind.config.ts`
- Custom component styles (`.btn`, `.card`, `.scenario-card`) are written as plain CSS in `globals.css`, NOT using `@apply` with custom classes (unsupported in v4)
- Dark mode via `[data-theme="dark"]` CSS attribute selector

### Testing

- **Vitest** with jsdom environment, globals enabled
- Config: `vitest.config.ts` with `@` path alias to `src/`
- Test files colocated in `__tests__/` directories alongside source
- Mocking via `vi.mock()` for Prisma client and embedding providers
- Coverage via `@vitest/coverage-v8`

## TDD Development Rules

### Core Principles

1. **Tests first**: Any new feature must have failing tests first
2. **Minimal implementation**: Only write code just enough to pass tests
3. **Continuous refactoring**: Consider refactoring after each green light

### Development Flow

1. Receive requirement → Write tests first
2. Confirm test fails (Red)
3. Write minimal code to pass tests (Green)
4. Refactor (keep Green)
5. Repeat

### Forbidden

- Don't write feature code without tests
- Don't delete or skip existing tests
- Don't write "tests later" code
