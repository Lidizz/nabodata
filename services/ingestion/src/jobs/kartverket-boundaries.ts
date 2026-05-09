import type postgres from 'postgres';
import pino from 'pino';
import { fetchFylker, fetchKommuner } from '../lib/kartverket.js';

const logger = pino({ level: 'info' });

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/æ/g, 'ae')
    .replace(/ø/g, 'o')
    .replace(/å/g, 'a')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function runBoundaryIngestion(sql: postgres.Sql): Promise<void> {
  // ── Fylker ──────────────────────────────────────────────────────────────────
  logger.info('Fetching fylker from Kartverket WFS…');
  const fylker = await fetchFylker();
  logger.info({ count: fylker.length }, 'Fetched fylker');

  for (const f of fylker) {
    await sql`
      INSERT INTO fylker (id, slug, name_nb, name_en, geom, updated_at)
      VALUES (
        ${f.id},
        ${slugify(f.name)},
        ${f.name},
        ${f.name},
        ST_SetSRID(ST_GeomFromGML(${f.gml}), 4326),
        NOW()
      )
      ON CONFLICT (id) DO UPDATE SET
        name_nb    = EXCLUDED.name_nb,
        geom       = EXCLUDED.geom,
        updated_at = NOW()
    `;
  }

  // Compute bboxes from geometry in one pass
  await sql`
    UPDATE fylker
    SET bbox = ARRAY[
      ST_XMin(ST_Envelope(geom)),
      ST_YMin(ST_Envelope(geom)),
      ST_XMax(ST_Envelope(geom)),
      ST_YMax(ST_Envelope(geom))
    ]::float8[]
    WHERE geom IS NOT NULL
  `;

  const [{ count: fylkeCount }] = await sql<[{ count: string }]>`
    SELECT COUNT(*)::text AS count FROM fylker
  `;
  logger.info({ fylkeCount }, 'Fylker upserted');

  // ── Kommuner ─────────────────────────────────────────────────────────────────
  logger.info('Fetching kommuner from Kartverket WFS…');
  const kommuner = await fetchKommuner();
  logger.info({ count: kommuner.length }, 'Fetched kommuner');

  // Two-pass slug computation: disambiguate duplicate names (e.g. two municipalities named Våler)
  const rawSlugs = kommuner.map((k) => slugify(k.name));
  const slugCount = new Map<string, number>();
  for (const s of rawSlugs) slugCount.set(s, (slugCount.get(s) ?? 0) + 1);
  const kommuneSlugs = kommuner.map((k, i) => {
    const base = rawSlugs[i] ?? slugify(k.id);
    return (slugCount.get(base) ?? 1) > 1 ? `${base}-${k.id}` : base;
  });

  let skipped = 0;
  for (let i = 0; i < kommuner.length; i++) {
    const k = kommuner[i]!;
    const slug = kommuneSlugs[i]!;

    // Skip if the parent fylke wasn't inserted (shouldn't happen but be safe)
    const [parent] = await sql<[{ id: string }?]>`
      SELECT id FROM fylker WHERE id = ${k.fylkeId} LIMIT 1
    `;
    if (!parent) {
      logger.warn({ kommuneId: k.id, fylkeId: k.fylkeId }, 'Parent fylke not found, skipping');
      skipped++;
      continue;
    }

    await sql`
      INSERT INTO kommuner (id, slug, name_nb, name_en, fylke_id, geom, updated_at)
      VALUES (
        ${k.id},
        ${slug},
        ${k.name},
        ${k.name},
        ${k.fylkeId},
        ST_SetSRID(ST_GeomFromGML(${k.gml}), 4326),
        NOW()
      )
      ON CONFLICT (id) DO UPDATE SET
        name_nb    = EXCLUDED.name_nb,
        slug       = EXCLUDED.slug,
        geom       = EXCLUDED.geom,
        updated_at = NOW()
    `;
  }

  await sql`
    UPDATE kommuner
    SET bbox = ARRAY[
      ST_XMin(ST_Envelope(geom)),
      ST_YMin(ST_Envelope(geom)),
      ST_XMax(ST_Envelope(geom)),
      ST_YMax(ST_Envelope(geom))
    ]::float8[]
    WHERE geom IS NOT NULL
  `;

  const [{ count: kommuneCount }] = await sql<[{ count: string }]>`
    SELECT COUNT(*)::text AS count FROM kommuner
  `;
  logger.info({ kommuneCount, skipped }, 'Kommuner upserted');

  // ── Verification ─────────────────────────────────────────────────────────────
  logger.info('── Boundary ingestion complete ──');
  logger.info(`Fylker  : ${fylkeCount ?? '?'} (expected 15)`);
  logger.info(`Kommuner: ${kommuneCount ?? '?'} (expected 356)`);

  if (Number(fylkeCount) < 15 || Number(kommuneCount) < 356) {
    logger.warn('Row counts below minimum expected — verify before promoting to production');
  }
}
