import type postgres from 'postgres';

export async function upsertKommuneStats(
  sql: postgres.Sql,
  kommuneId: string,
  stats: unknown,
  dataYear: number,
): Promise<void> {
  await sql`
    INSERT INTO kommune_stats (kommune_id, stats, data_year, updated_at)
    VALUES (${kommuneId}, ${sql.json(stats as never)}, ${dataYear}, NOW())
    ON CONFLICT (kommune_id) DO UPDATE
      SET stats = EXCLUDED.stats,
          data_year = EXCLUDED.data_year,
          updated_at = NOW()
  `;
}