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
