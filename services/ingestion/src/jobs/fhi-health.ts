import type postgres from 'postgres';

// Norwegian Institute of Public Health (FHI) — kommunehelsa statistics
// https://statistikkbank.fhi.no/kommunehelsa
// TODO: implement FHI API call
export async function runHealthIngestion(_sql: postgres.Sql): Promise<void> {
  throw new Error('Not implemented: FHI health ingestion');
}
