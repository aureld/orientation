# ── Stage 1: Install dependencies ──────────────────────
FROM node:22-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# ── Stage 2: Build the application ────────────────────
FROM node:22-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma client (outputs to src/generated/prisma/)
RUN npx prisma generate

# Build Next.js (standalone output)
RUN npm run build

# ── Stage 3: Production runner ─────────────────────────
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy standalone server and static assets
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Copy Prisma schema, config, and migrations for runtime migrate commands
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts

# Install Prisma CLI + dotenv (needed by prisma.config.ts) for runtime migrations
RUN npm install --no-save prisma dotenv

# Copy generated Prisma client (standalone doesn't trace $queryRaw pgvector deps fully)
COPY --from=builder /app/src/generated/prisma ./src/generated/prisma

# Copy i18n messages (loaded at runtime by next-intl)
COPY --from=builder /app/messages ./messages

# Copy entrypoint script (runs migrations then starts the server)
COPY docker-entrypoint.sh ./docker-entrypoint.sh

USER nextjs

EXPOSE 3000

ENTRYPOINT ["./docker-entrypoint.sh"]
