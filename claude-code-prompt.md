# Claude Code prompt — Nabodata monorepo scaffold

You are scaffolding the production monorepo for **Nabodata** — a Norwegian neighbourhood intelligence platform being built as a startup and pitched to Norwegian municipalities. This is not a prototype. Every file you create should be production-grade: correct types, real error handling, no `// TODO` stubs unless explicitly marked as a known gap.

Read this entire prompt before writing a single file.

---

## What Nabodata is

A map-first web and mobile app. Users explore demographic, social, and geographic data for any area in Norway by drilling down: **fylke → kommune** (v1), **grunnkrets** added in v1.1. The map is always the hero — the UI chrome exists to serve it, not the other way around. Use cases: moving research, vacation planning, business location scouting, municipal planning.

---

## Stack — non-negotiable, do not substitute

| Layer | Technology |
|---|---|
| Monorepo | Turborepo |
| Web app | Next.js 15, App Router, TypeScript, Tailwind CSS |
| Mobile app | Expo SDK 52+, React Native, TypeScript |
| Shared packages | `api-client`, `store` (Zustand), `i18n` (i18next), `types`, `ui` (design tokens) |
| Backend | Fastify 4 + Node.js, TypeScript |
| Tile server | Martin (Rust, MVT format) — config file only, no Node wrapper |
| Database | PostgreSQL 16 + PostGIS — schema + migration files only |
| Cache | Redis — client wiring only |
| Map engine (web) | **MapLibre GL JS 4**
| Map engine (mobile) | **`@maplibre/maplibre-react-native`**
| Map tiles | **Kartverket open tile API** — Norwegian government tiles, CC BY 4.0, no API key |
| Build / deploy | Vercel (web), Fly.io (backend + tile server), Expo EAS (mobile) |
| CI/CD | GitHub Actions |

**Why MapLibre + Kartverket instead of Mapbox:**
- Zero vendor lock-in, no credit card, no per-load pricing
- Kartverket tiles are authoritative Norwegian government geodata — more accurate for Norway than any commercial provider
- MapLibre GL JS is API-compatible with Mapbox GL JS v2; migration path exists if needed
- Aligns with the all-open-data philosophy of the platform

---

## Monorepo structure — create exactly this

```
nabodata/
├── .github/
│   └── workflows/
│       ├── ci.yml               # lint + typecheck + test on PR
│       └── deploy-web.yml       # Vercel deploy on main merge
├── apps/
│   ├── web/                     # Next.js 15 App Router
│   │   ├── app/
│   │   │   ├── layout.tsx       # root layout: fonts, theme, i18n provider
│   │   │   ├── page.tsx         # / → full-bleed map, search bar floating
│   │   │   ├── [locale]/        # nb / en route groups
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── page.tsx
│   │   │   │   ├── fylke/
│   │   │   │   │   └── [slug]/
│   │   │   │   │       ├── page.tsx
│   │   │   │   │       └── loading.tsx
│   │   │   │   └── kommune/
│   │   │   │       └── [slug]/
│   │   │   │           ├── page.tsx
│   │   │   │           └── loading.tsx
│   │   │   └── api/
│   │   │       └── health/
│   │   │           └── route.ts
│   │   ├── components/
│   │   │   ├── map/
│   │   │   │   ├── MapCanvas.tsx        # MapLibre GL JS wrapper
│   │   │   │   ├── ChoroplethLayer.tsx  # MVT layer + paint expressions
│   │   │   │   ├── ThemeSwitcher.tsx    # Light / Dark / Color
│   │   │   │   └── BreadcrumbOverlay.tsx
│   │   │   ├── panel/
│   │   │   │   ├── DataPanel.tsx        # 400px slide-in panel
│   │   │   │   ├── StatCard.tsx
│   │   │   │   ├── AgePyramid.tsx       # SVG, no charting lib
│   │   │   │   └── HorizontalBarChart.tsx
│   │   │   ├── search/
│   │   │   │   └── SearchBar.tsx        # floating, translucent
│   │   │   └── ui/
│   │   │       ├── GranularityBadge.tsx
│   │   │       ├── LoadingSkeleton.tsx
│   │   │       └── LanguageSwitcher.tsx
│   │   ├── lib/
│   │   │   ├── map.ts           # MapLibre style URL helpers, Kartverket tile URLs
│   │   │   └── theme.ts         # data-theme attribute management
│   │   ├── public/
│   │   │   ├── logo-mark.svg
│   │   │   ├── logo-wordmark.svg
│   │   │   └── favicon-32.svg
│   │   ├── styles/
│   │   │   ├── globals.css      # imports tokens, sets html/body
│   │   │   └── tokens.css       # full design token file (see DESIGN SYSTEM section)
│   │   ├── next.config.ts
│   │   ├── tailwind.config.ts   # maps CSS vars → Tailwind tokens
│   │   ├── tsconfig.json
│   │   └── package.json
│   └── mobile/                  # Expo SDK 52+ / React Native
│       ├── app/
│       │   ├── _layout.tsx      # Expo Router root layout
│       │   ├── index.tsx        # full-bleed map + bottom sheet
│       │   ├── (nb)/            # Norwegian locale screens
│       │   │   ├── _layout.tsx
│       │   │   ├── fylke/
│       │   │   │   └── [slug].tsx
│       │   │   └── kommune/
│       │   │       └── [slug].tsx
│       │   └── (en)/            # English locale screens
│       │       ├── _layout.tsx
│       │       ├── fylke/
│       │       │   └── [slug].tsx
│       │       └── kommune/
│       │           └── [slug].tsx
│       ├── components/
│       │   ├── map/
│       │   │   ├── MapView.tsx          # @maplibre/maplibre-react-native wrapper
│       │   │   └── ChoroplethLayer.tsx
│       │   ├── sheet/
│       │   │   ├── BottomSheet.tsx      # 3 snap heights: 88px, 50vh, 100vh-56
│       │   │   ├── StatCard.tsx
│       │   │   └── AgePyramid.tsx
│       │   └── ui/
│       │       ├── ThemeSwitcher.tsx
│       │       └── SearchBar.tsx
│       ├── lib/
│       │   └── theme.ts
│       ├── app.json
│       ├── eas.json
│       ├── tsconfig.json
│       └── package.json
├── packages/
│   ├── types/                   # shared TypeScript types
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── geo.ts           # Fylke, Kommune, Grunnkrets, BoundingBox
│   │   │   ├── stats.ts         # PopulationStats, IncomeStats, AgeDistribution, etc.
│   │   │   ├── api.ts           # API request/response envelope types
│   │   │   └── theme.ts         # Theme = 'light' | 'dark' | 'color'
│   │   ├── tsconfig.json
│   │   └── package.json
│   ├── api-client/              # typed fetch client, used by web + mobile
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── client.ts        # base fetch wrapper with error handling
│   │   │   ├── endpoints/
│   │   │   │   ├── fylke.ts
│   │   │   │   ├── kommune.ts
│   │   │   │   └── search.ts
│   │   │   └── types.ts         # re-exports from @nabodata/types
│   │   ├── tsconfig.json
│   │   └── package.json
│   ├── store/                   # Zustand stores, shared state
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── mapStore.ts      # activeTheme, activeFylke, activeKommune, zoom
│   │   │   ├── uiStore.ts       # panelOpen, searchQuery, locale
│   │   │   └── dataStore.ts     # cached kommune stats, loading states
│   │   ├── tsconfig.json
│   │   └── package.json
│   ├── i18n/                    # i18next setup + translation files
│   │   ├── src/
│   │   │   ├── index.ts         # exports configured i18next instance
│   │   │   ├── config.ts        # i18next init: ns, fallbackLng, interpolation
│   │   │   └── locales/
│   │   │       ├── nb/
│   │   │       │   ├── common.json      # shared: buttons, errors, nav
│   │   │       │   ├── map.json         # map chrome: tooltips, labels
│   │   │       │   ├── data.json        # data panel: stat labels, descriptions
│   │   │       │   └── meta.json        # SEO, page titles
│   │   │       └── en/
│   │   │           ├── common.json
│   │   │           ├── map.json
│   │   │           ├── data.json
│   │   │           └── meta.json
│   │   ├── tsconfig.json
│   │   └── package.json
│   └── ui/                      # design tokens as JS/TS + re-usable primitives
│       ├── src/
│       │   ├── index.ts
│       │   ├── tokens.ts        # JS object mirror of CSS vars (for RN StyleSheet)
│       │   └── theme.ts         # ThemeContext, useTheme hook
│       ├── tsconfig.json
│       └── package.json
├── services/
│   ├── api/                     # Fastify backend
│   │   ├── src/
│   │   │   ├── index.ts         # server entry point
│   │   │   ├── app.ts           # Fastify instance, plugins, routes registered
│   │   │   ├── plugins/
│   │   │   │   ├── cors.ts
│   │   │   │   ├── redis.ts
│   │   │   │   └── postgres.ts
│   │   │   ├── routes/
│   │   │   │   ├── health.ts    # GET /health
│   │   │   │   ├── fylke.ts     # GET /api/v1/fylke, GET /api/v1/fylke/:slug
│   │   │   │   ├── kommune.ts   # GET /api/v1/kommune/:slug (full stats payload)
│   │   │   │   ├── search.ts    # GET /api/v1/search?q= (typeahead)
│   │   │   │   └── i18n.ts      # GET /api/v1/i18n/:lang (AI-translated strings cache)
│   │   │   ├── db/
│   │   │   │   ├── queries/
│   │   │   │   │   ├── fylke.ts
│   │   │   │   │   └── kommune.ts
│   │   │   │   └── migrations/
│   │   │   │       ├── 001_initial_schema.sql
│   │   │   │       └── 002_indexes.sql
│   │   │   └── lib/
│   │   │       ├── cache.ts     # Redis get/set helpers with TTL
│   │   │       └── errors.ts    # typed API error classes
│   │   ├── Dockerfile
│   │   ├── fly.toml
│   │   ├── tsconfig.json
│   │   └── package.json
│   ├── ingestion/               # nightly ETL jobs
│   │   ├── src/
│   │   │   ├── index.ts         # job runner / scheduler entry
│   │   │   ├── jobs/
│   │   │   │   ├── ssb-population.ts    # SSB PxWebApi v2
│   │   │   │   ├── ssb-income.ts
│   │   │   │   ├── ssb-education.ts
│   │   │   │   ├── ssb-migration.ts     # kommune level only — see DATA DECISIONS
│   │   │   │   ├── kartverket-boundaries.ts
│   │   │   │   ├── bronnoy-businesses.ts
│   │   │   │   ├── osm-pois.ts
│   │   │   │   └── fhi-health.ts
│   │   │   └── lib/
│   │   │       ├── ssb.ts       # PxWebApi v2 typed client
│   │   │       ├── kartverket.ts
│   │   │       └── upsert.ts    # generic PostGIS upsert helper
│   │   ├── tsconfig.json
│   │   └── package.json
│   └── tiles/                   # Martin tile server config
│       ├── config.yaml          # Martin source definitions (PostGIS → MVT)
│       ├── fly.toml
│       └── README.md            # how to run Martin locally
├── infra/
│   ├── docker-compose.yml       # local dev: postgres + postgis + redis + martin
│   └── scripts/
│       ├── seed-dev.sh          # loads sample fylke/kommune data for local dev
│       └── run-migrations.sh
├── .nvmrc                       # contains: 22
├── turbo.json
├── package.json                 # root — workspaces, dev scripts
├── .env.example                 # all required env vars documented, no real values
├── .eslintrc.js
├── .prettierrc
└── tsconfig.base.json
```

---

## Design system — implement exactly these tokens

Create `apps/web/styles/tokens.css` with this exact content (this IS the design system, do not modify):

```css
/* Nabodata — Foundations: Colors + Type */
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Serif:wght@400;500&display=swap');

:root {
  --font-sans: 'IBM Plex Sans', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif;
  --font-mono: 'IBM Plex Mono', ui-monospace, 'SF Mono', Menlo, monospace;
  --font-serif: 'IBM Plex Serif', ui-serif, Georgia, serif;

  --fs-display: 34px; --fs-h1: 24px; --fs-h2: 18px; --fs-h3: 15px;
  --fs-body: 14px; --fs-body-sm: 13px; --fs-label: 12px;
  --fs-data: 11px; --fs-micro: 10px;

  --lh-tight: 1.1; --lh-snug: 1.25; --lh-base: 1.45; --lh-loose: 1.6;
  --tr-tight: -0.01em; --tr-base: 0; --tr-wide: 0.04em; --tr-eyebrow: 0.08em;
  --fw-light: 300; --fw-regular: 400; --fw-medium: 500;
  --fw-semibold: 600; --fw-bold: 700;

  --bg: #F7F8FA; --surface-1: #FFFFFF; --surface-2: #F2F4F7;
  --surface-3: #E8ECF1; --scrim: rgba(15,23,35,0.04);
  --scrim-strong: rgba(15,23,35,0.10);

  --fg-1: #0F1723; --fg-2: #3D4A5C; --fg-3: #6B7787;
  --fg-4: #9AA3B2; --fg-on-accent: #FFFFFF;

  --border-1: #E4E8EE; --border-2: #D2D8E0; --border-strong: #A8B1BF;

  --accent: #0E7C86; --accent-hover: #0A6973; --accent-press: #075860;
  --accent-soft: #DCEFF1; --accent-ring: rgba(14,124,134,0.28);

  --success: #2E7D5B; --warning: #B5740E;
  --danger: #B23A48; --info: #2C5F90;

  --shadow-1: 0 1px 2px rgba(15,23,35,0.05), 0 1px 1px rgba(15,23,35,0.04);
  --shadow-2: 0 2px 6px rgba(15,23,35,0.06), 0 1px 2px rgba(15,23,35,0.04);
  --shadow-3: 0 8px 24px rgba(15,23,35,0.08), 0 2px 6px rgba(15,23,35,0.05);
  --shadow-panel: 0 -2px 16px rgba(15,23,35,0.06);

  --choro-1: #ECF1F6; --choro-2: #C9D6E5; --choro-3: #9CB1CB;
  --choro-4: #6E8DAF; --choro-5: #486D92; --choro-6: #2C5176; --choro-7: #15355A;

  --sp-1: 4px; --sp-2: 8px; --sp-3: 12px; --sp-4: 16px;
  --sp-5: 20px; --sp-6: 24px; --sp-7: 32px; --sp-8: 40px;
  --sp-9: 56px; --sp-10: 72px;

  --r-1: 2px; --r-2: 4px; --r-3: 8px; --r-4: 12px; --r-5: 16px; --r-pill: 999px;

  --dur-fast: 120ms; --dur-base: 200ms; --dur-slow: 320ms;
  --dur-panel: 360ms; --dur-zoom: 600ms;
  --ease-out: cubic-bezier(0.22, 1, 0.36, 1);
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);

  --z-map: 0; --z-overlay: 10; --z-panel: 20; --z-sheet: 30;
  --z-modal: 40; --z-toast: 50;

  --viz-1: #0E7C86; --viz-2: #6B8E4E; --viz-3: #B23A48; --viz-4: #B86E3C;
  --viz-5: #5C6B7A; --viz-6: #C8A65A; --viz-7: #6E4C7A; --viz-8: #5A8FBF;
}

[data-theme="dark"] {
  --bg: #0B0F14; --surface-1: #11161D; --surface-2: #181E27; --surface-3: #232A35;
  --scrim: rgba(255,255,255,0.04); --scrim-strong: rgba(255,255,255,0.10);
  --fg-1: #ECEFF4; --fg-2: #B6BFCB; --fg-3: #828D9C; --fg-4: #5B6571;
  --fg-on-accent: #06181B;
  --border-1: #1F2731; --border-2: #2C3540; --border-strong: #475160;
  --accent: #2DB7C2; --accent-hover: #4FCBD5; --accent-press: #1F9EA8;
  --accent-soft: rgba(45,183,194,0.14); --accent-ring: rgba(45,183,194,0.34);
  --success: #4FB088; --warning: #E0A040; --danger: #E37582; --info: #6EA3D8;
  --shadow-1: 0 1px 2px rgba(0,0,0,0.5);
  --shadow-2: 0 2px 8px rgba(0,0,0,0.55);
  --shadow-3: 0 12px 32px rgba(0,0,0,0.6);
  --shadow-panel: 0 -4px 24px rgba(0,0,0,0.55);
  --choro-1: #2B241B; --choro-2: #4F3D26; --choro-3: #7A5A36;
  --choro-4: #A57850; --choro-5: #3F8580; --choro-6: #5FA3A5; --choro-7: #2DB7C2;
  --viz-1: #2DB7C2; --viz-2: #9CC36C; --viz-3: #E37582; --viz-4: #E59761;
  --viz-5: #93A3B6; --viz-6: #E8C778; --viz-7: #B58CC7; --viz-8: #8FB6E0;
}

[data-theme="color"] {
  --bg: #F2EEE3; --surface-1: #FAF6EC; --surface-2: #ECE6D5; --surface-3: #DDD5BF;
  --scrim: rgba(40,35,25,0.04); --scrim-strong: rgba(40,35,25,0.10);
  --fg-1: #1F2A24; --fg-2: #4A5650; --fg-3: #767F78; --fg-4: #A19E91;
  --fg-on-accent: #FAF6EC;
  --border-1: #E0D7C2; --border-2: #C9BFA6; --border-strong: #9C9277;
  --accent: #275F76; --accent-hover: #1F4F63; --accent-press: #163E50;
  --accent-soft: #D8E4EA; --accent-ring: rgba(39,95,118,0.30);
  --choro-1: #EFE8D2; --choro-2: #D5D2B0; --choro-3: #A8B795;
  --choro-4: #6E988A; --choro-5: #487C81; --choro-6: #275F76; --choro-7: #143F60;
}
```

Mirror all CSS custom properties as a TypeScript constant in `packages/ui/src/tokens.ts` for use in React Native StyleSheets:

```typescript
export const tokens = {
  light: { bg: '#F7F8FA', surface1: '#FFFFFF', /* ... all vars ... */ },
  dark: { bg: '#0B0F14', /* ... */ },
  color: { bg: '#F2EEE3', /* ... */ },
  shared: {
    fontSans: 'IBMPlexSans',
    fontMono: 'IBMPlexMono',
    sp1: 4, sp2: 8, sp3: 12, sp4: 16, sp5: 20, sp6: 24, sp7: 32, sp8: 40,
    r1: 2, r2: 4, r3: 8, r4: 12, r5: 16,
    durFast: 120, durBase: 200, durSlow: 320, durPanel: 360,
  }
} as const;
export type Theme = 'light' | 'dark' | 'color';
```

---

## Key data types — create these exactly in `packages/types/src/`

```typescript
// geo.ts
export interface Fylke {
  id: string;          // e.g. "46"
  slug: string;        // e.g. "vestland"
  name: { nb: string; en: string };
  bbox: [number, number, number, number]; // [minLng, minLat, maxLng, maxLat]
  kommuner: KommuneSummary[];
}

export interface KommuneSummary {
  id: string;          // e.g. "4601"
  slug: string;        // e.g. "bergen"
  name: { nb: string; en: string };
  fylkeId: string;
}

export interface Kommune extends KommuneSummary {
  bbox: [number, number, number, number];
  stats: KommuneStats;
  updatedAt: string;   // ISO 8601
}

// stats.ts
export interface KommuneStats {
  population: PopulationStats;
  income: IncomeStats;
  age: AgeDistribution;
  education: EducationStats;
  migration: MigrationStats;
  businesses: BusinessStats;
  health: HealthStats;
}

export interface PopulationStats {
  total: number;
  densityPerKm2: number;
  changeYoY: number;
  year: number;
}

export interface AgeDistribution {
  bands: AgeBand[];
  medianAge: number;
  year: number;
}

export interface AgeBand {
  label: string;
  male: number;
  female: number;
}

export interface IncomeStats {
  medianHousehold: number;   // NOK
  vsNational: number;        // signed percentage
  year: number;
}

export interface MigrationStats {
  // LEGAL NOTE: kommune level only — no grunnkrets breakdown ever
  // FRAMING: always "country of background", never "ethnicity" or "origin"
  topCountries: { country: string; count: number; share: number }[];
  totalForeign: number;
  totalForeignShare: number;
  year: number;
}
```

---

## API routes — Fastify, create these in `services/api/src/routes/`

All routes return `{ data: T, meta: { generatedAt: string, cached: boolean } }`.
All routes return proper HTTP status codes with typed error bodies.
All localised text fields accept optional `?lang=nb|en`.

```
GET  /health                         → { status: 'ok', version: string }
GET  /api/v1/fylke                   → Fylke[]
GET  /api/v1/fylke/:slug             → Fylke
GET  /api/v1/kommune/:slug           → Kommune
GET  /api/v1/search?q=&lang=         → { results: KommuneSummary[] }
GET  /api/v1/i18n/:lang              → Record<string, string>
```

Redis cache TTLs: fylke list 24h, fylke detail 24h, kommune 6h, search 1h, i18n 7 days.

---

## Database schema — `services/api/src/db/migrations/001_initial_schema.sql`

```sql
CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE fylker (
  id          TEXT PRIMARY KEY,
  slug        TEXT UNIQUE NOT NULL,
  name_nb     TEXT NOT NULL,
  name_en     TEXT NOT NULL,
  geom        GEOMETRY(MULTIPOLYGON, 4326),
  bbox        FLOAT8[4],
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE kommuner (
  id          TEXT PRIMARY KEY,
  slug        TEXT UNIQUE NOT NULL,
  name_nb     TEXT NOT NULL,
  name_en     TEXT NOT NULL,
  fylke_id    TEXT REFERENCES fylker(id),
  geom        GEOMETRY(MULTIPOLYGON, 4326),
  bbox        FLOAT8[4],
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE kommune_stats (
  kommune_id  TEXT PRIMARY KEY REFERENCES kommuner(id),
  stats       JSONB NOT NULL,
  data_year   INT NOT NULL,
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE i18n_cache (
  lang         TEXT NOT NULL,
  namespace    TEXT NOT NULL,
  strings      JSONB NOT NULL,
  ai_generated BOOLEAN DEFAULT FALSE,
  updated_at   TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (lang, namespace)
);

CREATE INDEX idx_kommuner_fylke ON kommuner(fylke_id);
CREATE INDEX idx_kommuner_geom  ON kommuner USING GIST(geom);
CREATE INDEX idx_fylker_geom    ON fylker   USING GIST(geom);
CREATE INDEX idx_kommune_stats  ON kommune_stats(data_year);
```

---

## i18n — create all four namespaces for both locales

`packages/i18n/src/locales/nb/common.json`:
```json
{
  "nav.search": "Søk etter kommune eller fylke",
  "nav.back": "Tilbake",
  "action.compare": "Sammenlign",
  "action.download": "Last ned",
  "action.filter": "Filtrer",
  "error.loadArea": "Kunne ikke laste området. Prøv igjen.",
  "error.noResults": "Ingen resultater",
  "loading": "Laster data",
  "theme.light": "Lyst",
  "theme.dark": "Mørkt",
  "theme.color": "Farge"
}
```

`packages/i18n/src/locales/nb/data.json`:
```json
{
  "stat.population": "Innbyggere",
  "stat.density": "Tetthet",
  "stat.densityUnit": "innb. / km²",
  "stat.medianIncome": "Medianinntekt",
  "stat.changeYoY": "endring siste år",
  "stat.vsNational": "vs. nasjonalt",
  "chart.agePyramid": "Aldersfordeling",
  "chart.male": "Menn",
  "chart.female": "Kvinner",
  "panel.about": "Om {name}",
  "panel.updatedAt": "Oppdatert {date}"
}
```

Mirror all keys in `en/` with English values. Keys must be identical across locales.

---

## Map tile configuration — Kartverket

**No API key required.** All Kartverket tile URLs are open, CC BY 4.0 licensed.

Create `apps/web/lib/map.ts` with these exact contents:

```typescript
// Kartverket open tile services — no API key, CC BY 4.0
// https://kartkatalog.geonorge.no

export const KARTVERKET_TILES = {
  // Greyscale topo — best base for light theme (choropleth reads clearly over grey)
  topoGraatone: 'https://cache.kartverket.no/v1/wmts/1.0.0/topoGraatone/default/webmercator/{z}/{y}/{x}.png',
  // Full colour topo — matches birch/moss palette of color theme
  topo: 'https://cache.kartverket.no/v1/wmts/1.0.0/topo/default/webmercator/{z}/{y}/{x}.png',
  // Simple/minimal — good base for dark theme (CSS filter inverts it)
  egk: 'https://cache.kartverket.no/v1/wmts/1.0.0/egk/default/webmercator/{z}/{y}/{x}.png',
} as const;

export type MapTheme = 'light' | 'dark' | 'color';

// Returns a full MapLibre StyleSpecification for each Nabodata theme
export function getStyleForTheme(theme: MapTheme) {
  const tileUrl = {
    light: KARTVERKET_TILES.topoGraatone,
    dark:  KARTVERKET_TILES.egk,
    color: KARTVERKET_TILES.topo,
  }[theme];

  return {
    version: 8 as const,
    sources: {
      kartverket: {
        type: 'raster' as const,
        tiles: [tileUrl],
        tileSize: 256,
        attribution: '© Kartverket',
      },
    },
    layers: [
      {
        id: 'kartverket-base',
        type: 'raster' as const,
        source: 'kartverket',
      },
    ],
  };
}

// Required attribution — Kartverket CC BY 4.0 licence
export const KARTVERKET_ATTRIBUTION = '© <a href="https://www.kartverket.no" target="_blank">Kartverket</a>';
```

Dark theme tile inversion: in `globals.css`, add:
```css
.map-theme-dark .maplibregl-canvas {
  filter: invert(1) hue-rotate(180deg);
}
```
Apply class `map-theme-dark` to the map container div when theme is `dark`. The choropleth layer is vector (served by Martin) and is not affected by the CSS filter.

---

## Component implementation notes

### MapCanvas (web)
- Package: `maplibre-gl`. Import: `import maplibregl from 'maplibre-gl'`.
- Import CSS: `import 'maplibre-gl/dist/maplibre-gl.css'` in `globals.css`.
- No token required. No `transformRequest`.
- Initialize with `getStyleForTheme(activeTheme)` from `lib/map.ts`.
- Theme switch: call `map.setStyle(getStyleForTheme(newTheme), { diff: true })`.
- Add attribution: `new maplibregl.AttributionControl({ customAttribution: KARTVERKET_ATTRIBUTION })`.
- Map fills 100% viewport. Chrome floats via absolute positioning at `z-index: var(--z-overlay)`.

### ChoroplethLayer (web + mobile)
- Source: Martin tile server at `NEXT_PUBLIC_TILE_SERVER_URL/tiles/kommuner/{z}/{x}/{y}`
- Source type: `vector`
- Paint: step function on `population_density` against breakpoints [0, 50, 200, 600, 1500, 3000, 6000] using the active theme's choro hex values.
- Hover: `var(--accent)` outline 1.5px. Selected: 2px stroke + 12% accent fill.

### DataPanel (web)
- 400px wide, slides from right. Transition: `transform 360ms cubic-bezier(0.22, 1, 0.36, 1)`.
- Fully opaque `var(--surface-1)`. Contains: BreadcrumbOverlay, 3× StatCard, AgePyramid, HorizontalBarChart.
- Tablet (<1024px): 44% width, map never below 480px.

### StatCard
```
[label: --fs-label, --fg-2]
[display number: --fs-display, tabular-nums]
[trend: --font-mono, 11px, --success or --danger]
```
Trend: `▲ +1,8 % siste år` / `▼ −0,3 % vs. nasjonalt`. Thousands separator: `\u202F` (thin space). Decimal: comma.

### AgePyramid
- Pure SVG, no charting library. ViewBox: `0 0 660 200`.
- 9 bands. Left = Menn `var(--viz-4)` copper. Right = Kvinner `var(--viz-1)` teal.
- Axis: 1px `var(--border-1)`. Labels: `var(--font-mono)` 9px `var(--fg-3)`.

### BottomSheet (mobile)
- Snaps: 88px / 50vh / calc(100vh - 56px). Handle: 36×4px `var(--border-strong)` centered.
- Top corners `var(--r-5)`. Background `var(--surface-1)`.
- Animate with `react-native-reanimated` + `react-native-gesture-handler`.

### ThemeSwitcher
- Top-right, 16px from edge. Three segments: labels from i18n (`theme.light` / `theme.dark` / `theme.color`).
- Background: `var(--surface-1)` 92% opacity + `backdrop-filter: blur(12px)`.
- Active: `var(--accent)` bg, `var(--fg-on-accent)` text.
- On change: set `data-theme` on `<html>`, persist to `localStorage`, call `map.setStyle()`.

---

## Environment variables — `.env.example`

```bash
# Database
DATABASE_URL=postgresql://nabodata:password@localhost:5432/nabodata

# Redis
REDIS_URL=redis://localhost:6379

# Tile server (Martin — no auth required)
NEXT_PUBLIC_TILE_SERVER_URL=http://localhost:3001
TILE_SERVER_URL=http://localhost:3001

# API
NEXT_PUBLIC_API_URL=http://localhost:3002
API_URL=http://localhost:3002

# Expo / React Native
EXPO_PUBLIC_API_URL=http://localhost:3002

# Anthropic (v2 — AI translation only, not needed for v1)
ANTHROPIC_API_KEY=sk-ant-...

# App
NODE_ENV=development
PORT=3002

# NOTE: No map API token needed.
# Base tiles: Kartverket open tiles (CC BY 4.0, no key required)
# Data tiles: Martin self-hosted tile server
```

---

## CI/CD — `.github/workflows/ci.yml`

```yaml
name: CI
on:
  pull_request:
    branches: [main]
jobs:
  lint-and-typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'npm'
      - run: npm ci
      - run: npx turbo lint typecheck
  test:
    runs-on: ubuntu-latest
    needs: lint-and-typecheck
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'npm'
      - run: npm ci
      - run: npx turbo test
```

---

## `turbo.json`

```json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": { "dependsOn": ["^build"], "outputs": [".next/**", "dist/**"] },
    "lint": { "outputs": [] },
    "typecheck": { "dependsOn": ["^build"], "outputs": [] },
    "test": { "dependsOn": ["^build"], "outputs": [] },
    "dev": { "cache": false, "persistent": true }
  }
}
```

---

## `docker-compose.yml`

```yaml
version: '3.8'
services:
  postgres:
    image: postgis/postgis:16-3.4
    environment:
      POSTGRES_DB: nabodata
      POSTGRES_USER: nabodata
      POSTGRES_PASSWORD: password
    ports: ['5432:5432']
    volumes: ['pg_data:/var/lib/postgresql/data']
  redis:
    image: redis:7-alpine
    ports: ['6379:6379']
  martin:
    image: ghcr.io/maplibre/martin:latest
    command: ['--config', '/config/config.yaml']
    environment:
      DATABASE_URL: postgresql://nabodata:password@postgres:5432/nabodata
    ports: ['3001:3000']
    volumes: ['./services/tiles/config.yaml:/config/config.yaml']
    depends_on: [postgres]
volumes:
  pg_data:
```

---

## What NOT to do — hard constraints

- **Do not** use `mapbox-gl` or `@rnmapbox/maps`. The map engine is `maplibre-gl` and `@maplibre/maplibre-react-native`. No Mapbox dependency anywhere in the monorepo.
- **Do not** reference any Mapbox token, `mapbox://` style URL, or Mapbox API endpoint. All tiles from Kartverket + Martin.
- **Do not** use React Native Web as a compromise. `apps/web` is Next.js only. `apps/mobile` is Expo only.
- **Do not** show migration/origin data below kommune level. `MigrationStats` is deliberately limited. No grunnkrets breakdown ever.
- **Do not** add crime data at neighbourhood level. Not in scope.
- **Do not** use a charting library for AgePyramid. Pure SVG only.
- **Do not** wrap Martin in a Node.js proxy. Martin is called directly from the frontend.
- **Do not** use `any` in TypeScript. Use `unknown` and narrow it.
- **Do not** use `console.log` in production code. Use pino.
- **Do not** add Storybook.
- **Do not** use `styled-components` or `emotion`.
- **Do not** commit `.env` files. Only `.env.example` goes in the repo.
- **Do not** use Node 20 in CI. Project is Node 22 throughout.

---

## What to scaffold vs stub

**Scaffold fully:**
- Complete directory and file structure as listed above
- All TypeScript types (complete, not partial)
- All `package.json` files with correct deps and `@nabodata/*` workspace references
- `tokens.css` and `tokens.ts` with every token
- i18n config + all JSON translation files (nb + en, 4 namespaces each)
- Database schema SQL
- Fastify route skeletons with typed request/response
- Docker Compose
- GitHub Actions CI
- `.env.example`
- `turbo.json`
- `.nvmrc` containing `22`

**Implement with real logic:**
- `MapCanvas.tsx` — real MapLibre GL JS init, Kartverket tiles, theme switching
- `apps/web/lib/map.ts` — complete as specced above
- `StatCard.tsx` — real component, correct number formatting
- `AgePyramid.tsx` — real SVG pyramid
- `ThemeSwitcher.tsx` — real three-segment toggle

**Stub with comment:**
- SSB API calls in ingestion jobs (`// TODO: implement SSB PxWebApi v2 call`)
- Kartverket boundary download (`// TODO: implement GeoNorge WFS download`)
- `MapView.tsx` mobile (`// TODO: initialize @maplibre/maplibre-react-native with Kartverket tiles`)
- AI translation route (`// TODO: call Anthropic API, cache in i18n_cache table`)

---

## Final instruction

After scaffolding, output a summary:

```
## Scaffold complete

### Files created: N
### Packages: list each with its role
### Known gaps (stubbed): list each file and what needs implementation
### First commands to run:
  npm install
  docker compose up -d
  cd services/api && npm run migrate
  npx turbo dev
```

`README.md` at root must be a pure engineering document: how to run locally, how to deploy, how to add a data source, how to add a language. Do not describe what Nabodata is.
