#!/usr/bin/env bash
set -euo pipefail

DATABASE_URL="${DATABASE_URL:-postgresql://nabodata:password@localhost:5432/nabodata}"

echo "Seeding dev database..."

psql "$DATABASE_URL" <<'SQL'
-- Sample fylke: Vestland
INSERT INTO fylker (id, slug, name_nb, name_en, bbox) VALUES
  ('46', 'vestland', 'Vestland', 'Vestland', '{4.5,59.8,7.5,61.5}')
ON CONFLICT (id) DO NOTHING;

-- Sample kommuner
INSERT INTO kommuner (id, slug, name_nb, name_en, fylke_id, bbox) VALUES
  ('4601', 'bergen', 'Bergen', 'Bergen', '46', '{5.1,60.2,5.6,60.5}'),
  ('4602', 'kinn', 'Kinn', 'Kinn', '46', '{4.7,61.5,5.2,61.9}')
ON CONFLICT (id) DO NOTHING;

-- Sample stats for Bergen
INSERT INTO kommune_stats (kommune_id, stats, data_year) VALUES (
  '4601',
  '{
    "population": {"total": 289574, "densityPerKm2": 636, "changeYoY": 0.8, "year": 2024},
    "income": {"medianHousehold": 612000, "vsNational": 3.2, "year": 2023},
    "age": {
      "medianAge": 38.4,
      "year": 2024,
      "bands": [
        {"label": "0–9", "male": 18200, "female": 17400},
        {"label": "10–19", "male": 17800, "female": 16900},
        {"label": "20–29", "male": 22100, "female": 21300},
        {"label": "30–39", "male": 23800, "female": 23100},
        {"label": "40–49", "male": 20400, "female": 19800},
        {"label": "50–59", "male": 19200, "female": 18700},
        {"label": "60–69", "male": 15600, "female": 15800},
        {"label": "70–79", "male": 10200, "female": 11400},
        {"label": "80+", "male": 5100, "female": 7800}
      ]
    },
    "education": {"primaryShare": 22.1, "secondaryShare": 35.4, "higherShare": 42.5, "year": 2023},
    "migration": {
      "totalForeign": 48200,
      "totalForeignShare": 16.6,
      "year": 2024,
      "topCountries": [
        {"country": "Polen", "count": 7800, "share": 2.7},
        {"country": "Eritrea", "count": 4200, "share": 1.4},
        {"country": "Somalia", "count": 3900, "share": 1.3}
      ]
    },
    "businesses": {
      "total": 34200,
      "perCapita": 118,
      "year": 2024,
      "topSectors": [
        {"sector": "Varehandel", "count": 5400},
        {"sector": "Bygg og anlegg", "count": 4800},
        {"sector": "Profesjonelle tjenester", "count": 4200}
      ]
    },
    "health": {"lifeExpectancyMale": 79.8, "lifeExpectancyFemale": 83.4, "year": 2023}
  }',
  2024
) ON CONFLICT (kommune_id) DO NOTHING;
SQL

echo "Seed complete."
