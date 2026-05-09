import type postgres from 'postgres';

// OpenStreetMap POIs via Overpass API
// TODO: implement OSM Overpass query
export async function runOsmIngestion(_sql: postgres.Sql): Promise<void> {
  throw new Error('Not implemented: OSM POI ingestion');
}
