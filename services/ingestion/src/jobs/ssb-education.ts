import type postgres from 'postgres';

// SSB table 09429: Population by highest completed education, municipality
// TODO: implement SSB PxWebApi v2 call
export async function runEducationIngestion(_sql: postgres.Sql): Promise<void> {
  throw new Error('Not implemented: SSB education ingestion');
}
