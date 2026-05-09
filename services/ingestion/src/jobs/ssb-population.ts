import type postgres from 'postgres';
import { ssbFetch } from '../lib/ssb.js';

// SSB table 07459: Population by municipality
// TODO: implement SSB PxWebApi v2 call
export async function runPopulationIngestion(_sql: postgres.Sql): Promise<void> {
  void ssbFetch; // client available
  throw new Error('Not implemented: SSB population ingestion');
}
