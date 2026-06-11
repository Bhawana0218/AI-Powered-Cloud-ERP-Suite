# Enterprise AI-Powered Cloud ERP Suite

Monorepo for an ERP platform with a Next.js frontend, NestJS API, Prisma, and local Docker infrastructure.

## Repository Status

Last verified: **May 24, 2026**

- `pnpm lint` passes
- `pnpm test` passes
- `pnpm build` passes
- `pnpm db:generate` passes
- `pnpm db:migrate` passes
- `pnpm db:seed` passes

## Monorepo Structure

```text
enterprise-ai-cloud-erp/
├─ apps/
│  ├─ api/         # NestJS API + Prisma
│  ├─ web/         # Next.js frontend
│  └─ ml-service/  # placeholder (currently scaffold only)
├─ packages/
│  ├─ config/      # placeholder
│  ├─ db/          # placeholder
│  ├─ shared/      # placeholder
│  └─ ui/          # placeholder
├─ docker-compose.dev.yml
├─ turbo.json
├─ pnpm-workspace.yaml
└─ package.json
```

## Tech Stack

- Workspace: `pnpm` + `turbo`
- Frontend: Next.js 16, React 19
- Backend: NestJS 11
- ORM/DB: Prisma 7 + PostgreSQL 17
- Cache: Redis 7
- Tooling: ESLint, Prettier, Husky

## Prerequisites

- Node.js `>=22`
- pnpm `>=9`
- Docker Desktop
- Git

## Environment Files

Create these files before running:

- `apps/api/.env` from `apps/api/.env.example`
- `apps/web/.env.local` from `apps/web/.env.example`

Current values:

- `apps/api/.env.example`
  - `PORT=4000`
  - `DATABASE_URL=postgresql://postgres:postgres@localhost:5432/enterprise_erp?schema=public`
- `apps/web/.env.example`
  - `NEXT_PUBLIC_API_BASE_URL=http://localhost:4000`

## First-Time Setup

1. Clone and enter project
```bash
git clone <your-repo-url>
cd enterprise-ai-cloud-erp
```

2. Install dependencies
```bash
pnpm install
```

3. Create env files
```bash
# Windows PowerShell
copy apps\api\.env.example apps\api\.env
copy apps\web\.env.example apps\web\.env.local

# macOS/Linux
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
```

4. Start infra services
```bash
pnpm docker:up
```

5. Prepare database
```bash
pnpm db:generate
pnpm db:migrate
pnpm db:seed
```

6. Start development servers
```bash
pnpm dev
```

## Service URLs

- Web: `http://localhost:3000`
- API: `http://localhost:4000`
- PostgreSQL: `localhost:5432`
- Redis: `localhost:6379`
- pgAdmin: `http://localhost:5050`
- MailHog: `http://localhost:8025`

pgAdmin login:

- Email: `admin@erp.com`
- Password: `admin`

## Commands

Root:

```bash
pnpm dev
pnpm build
pnpm test
pnpm lint
pnpm format
pnpm db:generate
pnpm db:migrate
pnpm db:seed
pnpm docker:up
pnpm docker:down
```

App-specific:

```bash
pnpm --filter api start:dev
pnpm --filter api db:generate
pnpm --filter api db:migrate
pnpm --filter api db:seed

pnpm --filter web dev
pnpm --filter web build
```

## Team Workflow

1. Create a branch from `main`
2. Make focused changes
3. Run checks before push
```bash
pnpm lint
pnpm test
pnpm build
```
4. Open PR with summary, reason, and migration notes (if DB changed)

## Troubleshooting

### Docker compose says `no configuration file provided`

Cause: default command searches for `docker-compose.yml` or `compose.yml`, but this repo uses `docker-compose.dev.yml`.

Use:
```bash
docker compose -f docker-compose.dev.yml up --build
```

Or use:
```bash
pnpm docker:up
```

### Docker API/daemon errors


Examples:

- `failed to connect to the docker API at npipe...`
- `request returned 500 Internal Server Error ... dockerDesktopLinuxEngine`

Fix:

1. Open Docker Desktop and wait for engine to become healthy
2. Retry `pnpm docker:up`
3. If it persists, restart Docker Desktop (or machine), then retry

### `pnpm` shows `fetch failed`

```bash
corepack enable
pnpm -v
pnpm install
```

If needed, verify proxy/firewall settings.

### Port conflict

- Web uses `3000`
- API uses `4000`

If occupied, change `PORT` in `apps/api/.env`.

### Git tracking confusion

- Ensure you are in `enterprise-ai-cloud-erp` root
- Keep a single `.git` repo at root
- Do not create nested repos inside `apps/*`
