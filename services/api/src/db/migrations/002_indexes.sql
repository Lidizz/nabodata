CREATE INDEX idx_kommuner_fylke ON kommuner(fylke_id);
CREATE INDEX idx_kommuner_geom  ON kommuner USING GIST(geom);
CREATE INDEX idx_fylker_geom    ON fylker   USING GIST(geom);
CREATE INDEX idx_kommune_stats  ON kommune_stats(data_year);
CREATE INDEX idx_kommuner_slug  ON kommuner(slug);
CREATE INDEX idx_fylker_slug    ON fylker(slug);
