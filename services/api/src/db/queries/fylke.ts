import type postgres from 'postgres';
import type { Fylke, KommuneSummary } from '@nabodata/types';

interface FylkeRow {
  id: string;
  slug: string;
  name_nb: string;
  name_en: string;
  bbox: number[];
}

interface KommuneRow {
  id: string;
  slug: string;
  name_nb: string;
  name_en: string;
  fylke_id: string;
}

function rowToFylke(row: FylkeRow, kommuner: KommuneSummary[]): Fylke {
  return {
    id: row.id,
    slug: row.slug,
    name: { nb: row.name_nb, en: row.name_en },
    bbox: row.bbox as [number, number, number, number],
    kommuner,
  };
}

function rowToKommuneSummary(row: KommuneRow): KommuneSummary {
  return {
    id: row.id,
    slug: row.slug,
    name: { nb: row.name_nb, en: row.name_en },
    fylkeId: row.fylke_id,
  };
}

export async function queryAllFylker(sql: postgres.Sql): Promise<Fylke[]> {
  const fylkerRows = await sql<FylkeRow[]>`
    SELECT id, slug, name_nb, name_en, bbox FROM fylker ORDER BY name_nb
  `;
  const kommuneRows = await sql<KommuneRow[]>`
    SELECT id, slug, name_nb, name_en, fylke_id FROM kommuner ORDER BY name_nb
  `;

  const kommuneByFylke = new Map<string, KommuneSummary[]>();
  for (const row of kommuneRows) {
    const list = kommuneByFylke.get(row.fylke_id) ?? [];
    list.push(rowToKommuneSummary(row));
    kommuneByFylke.set(row.fylke_id, list);
  }

  return fylkerRows.map((f) => rowToFylke(f, kommuneByFylke.get(f.id) ?? []));
}

export async function queryFylkeBySlug(sql: postgres.Sql, slug: string): Promise<Fylke | null> {
  const fylkerRows = await sql<FylkeRow[]>`
    SELECT id, slug, name_nb, name_en, bbox FROM fylker WHERE slug = ${slug} LIMIT 1
  `;
  const fylkeRow = fylkerRows[0];
  if (!fylkeRow) return null;

  const kommuneRows = await sql<KommuneRow[]>`
    SELECT id, slug, name_nb, name_en, fylke_id FROM kommuner
    WHERE fylke_id = ${fylkeRow.id} ORDER BY name_nb
  `;

  return rowToFylke(fylkeRow, kommuneRows.map(rowToKommuneSummary));
}
