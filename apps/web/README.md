# Web App (`apps/web`)

Next.js frontend for the ERP suite.

## Run

```bash
pnpm --filter web dev
```

Web default URL: `http://localhost:3000`

## Environment

```bash
copy .env.example .env.local
```

`NEXT_PUBLIC_API_BASE_URL` should point to the API service (default: `http://localhost:4000`).
