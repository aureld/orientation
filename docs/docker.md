# Docker Deployment

This document covers how to build and run Aventure Metier with Docker, including an optional hardened configuration for CTF / security testing.

## Prerequisites

- Docker Engine 20+ with Compose v2 (or standalone `docker-compose` v2+)
- Port 3000 available on the host

## Quick Start

```bash
# Build and start (app + PostgreSQL with pgvector)
docker-compose up --build

# Detached mode
docker-compose up --build -d

# Stop (data volume persists)
docker-compose down

# Stop and wipe database
docker-compose down -v
```

The app is available at `http://localhost:3000` once started.

## Architecture

```
                ┌──────────────┐
  Host :3000 ──>│   app        │
                │  (Next.js)   │──> db:5432
                └──────────────┘    ┌──────────────┐
                                    │   db         │
                                    │ (PG+pgvector)│
                                    └──────────────┘
                                         │
                                    pgdata volume
```

### Multi-stage Dockerfile

The build has three stages to keep the production image small:

| Stage | Purpose | Base |
|-------|---------|------|
| **deps** | Install all npm dependencies via `npm ci` | `node:22-alpine` |
| **builder** | Generate Prisma client, build Next.js standalone output | `node:22-alpine` |
| **runner** | Production image with only runtime artifacts | `node:22-alpine` |

The final image contains:
- Next.js standalone server (`server.js` + traced `node_modules`)
- Static assets (`.next/static/`, `public/`)
- Prisma schema, migrations, and generated client
- Prisma CLI + dotenv (for running migrations at startup)
- i18n message files (`messages/`)

### Entrypoint

`docker-entrypoint.sh` runs on container start:

1. **Applies pending migrations** via `prisma migrate deploy`
2. **Starts the Next.js server** via `exec node server.js`

Using `exec` replaces the shell with Node as PID 1, so it receives OS signals (SIGTERM, SIGINT) directly for graceful shutdown.

### Database

The `db` service uses `pgvector/pgvector:pg17`, which is standard PostgreSQL 17 with the `vector` extension pre-compiled. The pgvector extension itself is enabled by the Prisma migration `20260403000000_add_pgvector_embeddings`.

Data is persisted in a named Docker volume (`pgdata`).

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_URL` | `postgresql://orientation:orientation@db:5432/orientation?schema=public` | PostgreSQL connection string (auto-configured for the `db` service) |
| `AUTH_SECRET` | `change-me-in-production` | Auth.js signing secret. **Must be changed in production.** |
| `AUTH_URL` | `http://localhost:3000` | Public URL of the application |

Override via a `.env` file in the project root, or pass directly:

```bash
AUTH_SECRET=my-secret AUTH_URL=https://example.com docker-compose up -d
```

## Seeding the Database

After the first startup (migrations applied automatically), seed the database:

```bash
docker-compose exec app npx prisma db seed
```

## Standalone Output

`next.config.ts` sets `output: "standalone"`, which makes Next.js trace all `import`/`require` calls and produce a self-contained server. This is what enables the small production image — only the files actually needed at runtime are copied.

Notable exceptions that must be copied explicitly:
- **Prisma generated client** — pgvector uses `$queryRaw` which the static tracer can't follow
- **Prisma CLI + dotenv** — build-time tools not traced by Next.js, needed for migrations
- **`messages/`** — loaded dynamically by next-intl at request time
- **`public/`** and **`.next/static/`** — served directly, not traced into the standalone bundle

## CTF / Hardened Mode

An overlay file `docker-compose.ctf.yml` adds security hardening for running the app in an untrusted or adversarial environment (CTF challenges, pentesting, security research).

### Usage

```bash
# Start with hardening
docker-compose -f docker-compose.yml -f docker-compose.ctf.yml up --build

# Detached
docker-compose -f docker-compose.yml -f docker-compose.ctf.yml up --build -d

# Alias (add to shell rc for convenience)
alias dc-ctf='docker-compose -f docker-compose.yml -f docker-compose.ctf.yml'
dc-ctf up --build
```

### Isolation Layers

| Layer | What it does | Protects against |
|-------|-------------|-----------------|
| **`internal: true` network** | App and DB have no internet access. Only app port 3000 is exposed to the host via a separate `web` network. | Data exfiltration, reverse shells, C2 callbacks |
| **DB port removed** | PostgreSQL is only reachable from the app container, not from the host. | Direct DB access / dumping from host network |
| **`read_only: true`** | Root filesystem is immutable. Only `/tmp` is writable (RAM-backed tmpfs, wiped on restart). | Malware persistence, backdoor implantation, web shells |
| **`cap_drop: ALL`** | All Linux capabilities are dropped. The container cannot mount filesystems, modify network interfaces, trace processes, or load kernel modules. | Privilege escalation, container escape via capabilities |
| **`no-new-privileges`** | Prevents gaining privileges via SUID/SGID binaries or other mechanisms. | Escalation through setuid binaries inside the image |
| **Resource limits** | 1 CPU core, 512MB RAM per container. | Fork bombs, memory exhaustion, cryptominers |

### Network Topology (CTF mode)

```
                         web network
               ┌─────────────────────────┐
  Host :3000 ──│──> app :3000            │
               └─────────────────────────┘
                         │
                    internal network
                    (no internet)
               ┌─────────────────────────┐
               │    app ──> db :5432     │
               └─────────────────────────┘
                              │
                         pgdata volume
```

### Verifying Isolation

After starting in CTF mode, you can confirm each layer is active:

```bash
# App responds normally
curl -I http://localhost:3000/fr

# DB port is NOT exposed
curl --connect-timeout 2 http://localhost:5432  # should fail

# App cannot reach the internet
docker-compose -f docker-compose.yml -f docker-compose.ctf.yml \
  exec app wget -q --timeout=3 https://example.com -O /dev/null  # should fail

# Filesystem is read-only
docker-compose -f docker-compose.yml -f docker-compose.ctf.yml \
  exec app touch /app/test  # should fail

# All capabilities are zero
docker-compose -f docker-compose.yml -f docker-compose.ctf.yml \
  exec app cat /proc/1/status | grep Cap  # all 0000000000000000
```

## File Reference

| File | Purpose |
|------|---------|
| `Dockerfile` | Multi-stage build: deps, builder, runner |
| `docker-compose.yml` | Base configuration: app + PostgreSQL with pgvector |
| `docker-compose.ctf.yml` | Hardening overlay for CTF / security testing |
| `docker-entrypoint.sh` | Startup script: migrate then serve |
| `.dockerignore` | Excludes node_modules, .git, .env, .claude from build context |
| `next.config.ts` | `output: "standalone"` for optimized Docker images |
