# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Nabodata is a Norwegian neighbourhood-intelligence platform — a map-first web and mobile application for exploring demographic, geographic, and social data about Norwegian regions (fylker, kommuner, grunnkretser).

**Current state:** Full monorepo scaffolded. The design system lives in `nabodata_design_system/`; the specification is in `claude-code-prompt.md`. Production ingestion jobs (SSB, Kartverket, etc.) and the mobile MapView are stubbed — see Known Gaps below.

## Key Documents

- `claude-code-prompt.md` — Primary specification (800+ lines): complete monorepo structure, tech stack, database schema, API routes, i18n setup, environment variables, CI/CD, and hard constraints
- `nabodata_design_system/README.md` — Brand and design guidelines (voice, themes, typography, spacing, motion)
- `nabodata_design_system/colors_and_type.css` — Design tokens as CSS custom properties (drop this in as-is; do not modify)

## Planned Monorepo Architecture

Once scaffolded per `claude-code-prompt.md`:

```
nabodata/
├── apps/
│   ├── web/          # Next.js 15 App Router — full-bleed map interface
│   └── mobile/       # Expo SDK 52+ with Expo Router
├── packages/
│   ├── types/        # Shared TypeScript interfaces (Fylke, Kommune, Stats)
│   ├── api-client/   # Typed fetch client shared by web and mobile
│   ├── store/        # Zustand state (active area, theme, UI)
│   ├── i18n/         # i18next setup: nb-NO (primary) + en
│   └── ui/           # Design tokens as TS/JS for React Native StyleSheets
└── services/
    ├── api/          # Fastify 4 backend — /api/v1/* with Redis caching
    ├── ingestion/    # Nightly ETL: SSB stats, Kartverket boundaries, OSM POIs
    └── tiles/        # Martin tile server config (PostGIS → MVT)
```

**Data flow:** User clicks map → Zustand updates `activeArea` → frontend fetches `/api/areas/kommune/:slug/summary` (Fastify → PostgreSQL + Redis cache) → choropleth updates from Martin tiles at `NEXT_PUBLIC_TILE_SERVER_URL/kommuner/{z}/{x}/{y}`

## Commands (once monorepo is scaffolded)

```bash
# Install
npm install

# Local infrastructure (PostgreSQL + PostGIS, Redis, Martin tile server)
docker compose up -d

# Development (all packages via Turborepo)
npx turbo dev

# Build / lint / typecheck / test
npm run build
npm run lint
npm run typecheck
npm run test

# Database migrations
npm run migrate
```

## Design System

`nabodata_design_system/` is the source of truth for all visual decisions. Every prototype and production component must follow its rules.

### Themes

Three first-class themes switched via `data-theme` on `<html>`:
- **light** (default) — cool paper (`#F7F8FA`)
- **dark** — near-black (`#0B0F14`)
- **color** — warm birch-paper (`#F2EEE3`) with richer accents

Theme changes must set `document.documentElement.dataset.theme` to trigger CSS variable switching.

### Typography

- IBM Plex Sans (UI) + IBM Plex Mono (data/numbers)
- All numeric data: `font-variant-numeric: tabular-nums`
- Norwegian number format: space as thousands separator, comma as decimal (`1 234,56`)

### Layout

The map is the hero — floating chrome must never cover more than 30% of the viewport. Cards float 16px from edges on desktop, 12px on mobile.

### Motion

120–320ms transitions, `cubic-bezier(0.22, 1, 0.36, 1)` ease-out only. No bounces, no spring physics.

### Icons

Lucide exclusively — 1.5px stroke, 20px size, `currentColor`. No emoji.

## Hard Constraints

- **No Mapbox** — use MapLibre GL JS + Kartverket (Norwegian government) tiles
- **No styled-components** — use Tailwind CSS + CSS custom properties from design tokens
- **No Storybook**
- **No `any` in TypeScript** — strict mode throughout all packages
- **No `console.log`** — use `pino` logger in all services
- **Norwegian first:** all user-facing content defaults to bokmål (nb-NO); English is secondary
- **Accent color:** Fjord teal (`#0E7C86` light / `#2DB7C2` dark) — do not substitute

## Known Gaps (stubbed)

These files exist with `// TODO` markers and throw `Error('Not implemented')`:

| File | What's missing |
|---|---|
| `services/ingestion/src/jobs/ssb-*.ts` | SSB PxWebApi v2 calls |
| `services/ingestion/src/jobs/kartverket-boundaries.ts` | GeoNorge WFS boundary download |
| `services/ingestion/src/jobs/bronnoy-businesses.ts` | Brønnøysund register API |
| `services/ingestion/src/jobs/osm-pois.ts` | OSM Overpass query |
| `services/ingestion/src/jobs/fhi-health.ts` | FHI kommunehelsa API |
| `apps/mobile/components/map/MapView.tsx` | `@maplibre/maplibre-react-native` init |
| `apps/mobile/components/map/ChoroplethLayer.tsx` | MVT layer for mobile map |
| `services/api/src/routes/i18n.ts` | Anthropic API AI-translation |
