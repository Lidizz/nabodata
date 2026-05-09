import type postgres from 'postgres';

// SSB table 06944: Median household income by municipality
// TODO: implement SSB PxWebApi v2 call
export async function runIncomeIngestion(_sql: postgres.Sql): Promise<void> {
  throw new Error('Not implemented: SSB income ingestion');
}
