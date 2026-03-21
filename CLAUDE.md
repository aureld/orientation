# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

"Aventure Métier" — A multilingual career orientation game for young people in Canton Zurich. Players explore interactive scenarios representing different professional sectors, make choices that build a personality profile across 12 dimensions, and get matched to real Swiss professions (CFC/AFP) using cosine similarity. Data sourced from orientation.ch.

## Repository Structure

- `next/` — The Next.js 16 app (main development)
- Root files (`index.html`, `js/`, `css/`) — Original vanilla JS proof-of-concept (legacy)

## Development Commands

```bash
cd next

# Dev server (Turbopack, default in Next.js 16)
npm run dev

# Build
npm run build

# Prisma
npx prisma generate          # Generate client after schema changes
npx prisma migrate dev       # Create/apply migrations
npx prisma db seed           # Seed database (once seed.ts is created)

# Lint
npm run lint
```

## Architecture (next/)

### Stack

- **Next.js 16.1** (App Router + Turbopack)
- **TypeScript**
- **Prisma 7** + PostgreSQL (configured via `prisma.config.ts`, client generated to `src/generated/prisma/`)
- **next-intl** for i18n (3 locales: fr, de, en)
- **Tailwind CSS v4** (no `@apply` with custom classes — use plain CSS in `globals.css`)

### i18n Setup

- Routing config: `src/i18n/routing.ts` — defines locales `["fr", "de", "en"]`, default `"fr"`
- Request config: `src/i18n/request.ts` — loads messages per locale
- Navigation helpers: `src/i18n/navigation.ts` — locale-aware `Link`, `useRouter`, `redirect`
- Proxy: `proxy.ts` at project root (replaces `middleware.ts` in Next.js 16)
- UI strings: `messages/{fr,de,en}.json`
- DB content: translation tables per entity (ProfessionTranslation, ScenarioTranslation, etc.)

### Key Directories

- `src/app/[locale]/` — All pages, nested under locale segment
- `src/components/` — Shared React components (RadarChart, HeaderBar, ProgressBar, ThemeToggle)
- `src/lib/` — Core logic:
  - `matching.ts` — Cosine similarity matching engine (ported from original)
  - `profile-dimensions.ts` — 12 dimensions definition, radar pairs, types
  - `db.ts` — Prisma client singleton

### Profile System

12 dimensions (0-10 scale): `manuel`, `intellectuel`, `creatif`, `analytique`, `interieur`, `exterieur`, `equipe`, `independant`, `contactHumain`, `technique`, `routine`, `variete`. Stored both on User model and Profession model in Prisma. Matching uses cosine similarity (shape-based, magnitude-independent).

### Database Schema

Content is multilingual via `*Translation` tables (one per entity: Sector, Profession, Scenario, Scene, Choice, Badge). Each translation table has a `@@unique([entityId, locale])` constraint. User game state is stored in User + related tables (UserScenario, UserChoice, UserCareerView, UserBadge).

### Tailwind v4 Notes

- Uses `@theme inline` for custom design tokens — no `tailwind.config.ts`
- Custom component styles (`.btn`, `.card`, `.scenario-card`) are written as plain CSS in `globals.css`, NOT using `@apply` with custom classes (unsupported in v4)
- Dark mode via `[data-theme="dark"]` CSS attribute selector

# TDD Development Rules

## Core Principles

1. **Tests first**: Any new feature must have failing tests first
2. **Minimal implementation**: Only write code just enough to pass tests
3. **Continuous refactoring**: Consider refactoring after each green light

## Development Flow

1. Receive requirement → Write tests first
2. Confirm test fails (Red)
3. Write minimal code to pass tests (Green)
4. Refactor (keep Green)
5. Repeat

## Forbidden

- ❌ Don't write feature code without tests
- ❌ Don't delete or skip existing tests
- ❌ Don't write "tests later" code
