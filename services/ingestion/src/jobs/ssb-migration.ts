import type postgres from 'postgres';

// SSB table 05183: Immigrants and Norwegian-born to immigrant parents, by municipality
// LEGAL NOTE: kommune level only — no grunnkrets breakdown ever
// FRAMING: always "country of background", never "ethnicity" or "origin"
// TODO: implement SSB PxWebApi v2 call
export async function runMigrationIngestion(_sql: postgres.Sql): Promise<void> {
  throw new Error('Not implemented: SSB migration ingestion');
}
