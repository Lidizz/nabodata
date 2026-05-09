import type postgres from 'postgres';

// Brønnøysund Register Centre — open data via data.brreg.no
// TODO: implement Brønnøysund API call
export async function runBusinessIngestion(_sql: postgres.Sql): Promise<void> {
  throw new Error('Not implemented: Brønnøysund business ingestion');
}
