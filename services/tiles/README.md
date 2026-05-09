# Martin tile server

Serves vector tiles (MVT format) from PostGIS.

## Run locally

```bash
docker run -p 3001:3000 \
  -e DATABASE_URL=postgresql://nabodata:password@host.docker.internal:5432/nabodata \
  -v $(pwd)/config.yaml:/config/config.yaml \
  ghcr.io/maplibre/martin:latest --config /config/config.yaml
```

Or via docker compose (from repo root):

```bash
docker compose up -d martin
```

## Tile endpoints

- `http://localhost:3001/tiles/kommuner/{z}/{x}/{y}` — kommune MVT tiles
- `http://localhost:3001/tiles/fylker/{z}/{x}/{y}` — fylke MVT tiles
- `http://localhost:3001/catalog` — all available sources
