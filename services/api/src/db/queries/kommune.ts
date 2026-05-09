import type postgres from 'postgres';
import type { Kommune, KommuneSummary } from '@nabodata/types';

interface KommuneRow {
  id: string;
  slug: string;
  name_nb: string;
  name_en: string;
  fylke_id: string;
  bbox: number[];
  stats: unknown;
  updated_at: string;
}

export async function queryKommuneBySlug(
  sql: postgres.Sql,
  slug: string,
): Promise<Kommune | null> {
  const rows = await sql<KommuneRow[]>`
    SELECT
      k.id, k.slug, k.name_nb, k.name_en, k.fylke_id, k.bbox,
      ks.stats, ks.updated_at
    FROM kommuner k
    JOIN kommune_stats ks ON ks.kommune_id = k.id
    WHERE k.slug = ${slug}
    LIMIT 1
  `;
  const row = rows[0];
  if (!row) return null;

  const summary: KommuneSummary = {
    id: row.id,
    slug: row.slug,
    name: { nb: row.name_nb, en: row.name_en },
    fylkeId: row.fylke_id,
  };

  return {
    ...summary,
    bbox: row.bbox as [number, number, number, number],
    stats: row.stats as Kommune['stats'],
    updatedAt: row.updated_at,
  };
}

export async function queryKommuneSearch(
  sql: postgres.Sql,
  q: string,
): Promise<KommuneSummary[]> {
  const term = `%${q}%`;
  const rows = await sql<{ id: string; slug: string; name_nb: string; name_en: string; fylke_id: string }[]>`
    SELECT id, slug, name_nb, name_en, fylke_id FROM kommuner
    WHERE name_nb ILIKE ${term} OR name_en ILIKE ${term}
    ORDER BY name_nb
    LIMIT 20
  `;
  return rows.map((r) => ({
    id: r.id,
    slug: r.slug,
    name: { nb: r.name_nb, en: r.name_en },
    fylkeId: r.fylke_id,
  }));
}
