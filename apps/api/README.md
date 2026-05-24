# API Service (`apps/api`)

NestJS backend service for the ERP suite.

## Run

```bash
pnpm --filter api start:dev
```

API default URL: `http://localhost:4000`

## Database (Prisma)

```bash
pnpm --filter api db:generate
pnpm --filter api db:migrate
pnpm --filter api db:seed
```

Create local env first:

```bash
copy .env.example .env
```
