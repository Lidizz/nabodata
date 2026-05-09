import type postgres from 'postgres';

// Kartverket administrative boundaries from GeoNorge WFS
// TODO: implement GeoNorge WFS download
export async function runBoundaryIngestion(_sql: postgres.Sql): Promise<void> {
  throw new Error('Not implemented: Kartverket boundary ingestion');
}
