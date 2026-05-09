-- Add population_density column to kommuner so Martin can serve it in MVT tiles
ALTER TABLE kommuner ADD COLUMN IF NOT EXISTS population_density FLOAT8;

-- Back-fill from existing kommune_stats
UPDATE kommuner k
SET population_density = (ks.stats -> 'population' ->> 'densityPerKm2')::float8
FROM kommune_stats ks
WHERE ks.kommune_id = k.id;
