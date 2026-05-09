# Nabodata — Engineering

## Local development

**Prerequisites:** Node 22, Docker, `psql` CLI

```bash
# 1. Install dependencies
npm install

# 2. Start local infrastructure (Postgres + PostGIS, Redis, Martin tile server)
docker compose -f infra/docker-compose.yml up -d

# 3. Run database migrations
bash infra/scripts/run-migrations.sh

# 4. Seed sample data (Bergen + Vestland)
bash infra/scripts/seed-dev.sh

# 5. Start all apps in dev mode
npx turbo dev
```

Services run at:
- **Web:** http://localhost:3000
- **API:** http://localhost:3002
- **Tile server (Martin):** http://localhost:3001
- **Tile catalog:** http://localhost:3001/catalog

## Add a data source

1. Create a new job file in `services/ingestion/src/jobs/`
2. Add a `run<Name>Ingestion(sql)` export
3. Register it in `services/ingestion/src/index.ts` under a new `JOB` case
4. Schedule it in your CI/CD or cron by setting `JOB=<name>` and running the ingestion service

## Add a language

1. Create a new locale directory in `packages/i18n/src/locales/<lang>/`
2. Add `common.json`, `map.json`, `data.json`, `meta.json` with keys matching the `nb` locale exactly
3. Import and register the locale in `packages/i18n/src/index.ts`
4. Add the locale to `supportedLngs` in `packages/i18n/src/config.ts`
5. Add a `(lang)/` route group in `apps/mobile/app/` mirroring `(nb)/`
6. Add the locale to `generateStaticParams` in `apps/web/app/[locale]/layout.tsx`

## Deployment

**Web (Vercel):** Push to `main`. GitHub Actions runs `turbo build --filter=@nabodata/web` then deploys via Vercel.

**API (Fly.io):**
```bash
fly deploy --config services/api/fly.toml
```

**Tile server (Fly.io):**
```bash
fly deploy --config services/tiles/fly.toml
```

**Mobile (EAS):**
```bash
cd apps/mobile
eas build --platform all
eas submit --platform all
```

## Environment variables

See `.env.example` for all required variables. Copy to `.env.local` for local development. Never commit `.env` files.
