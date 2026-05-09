import type postgres from 'postgres';
import pino from 'pino';
import {
  ssbFetch,
  buildStrides,
  getStatValue,
  sumStatValues,
  getDimKeys,
  type JsonStat2,
} from '../lib/ssb.js';
import { upsertKommuneStats } from '../lib/upsert.js';
import type { KommuneStats } from '@nabodata/types';

const logger = pino({ level: 'info' });

const AGE_BANDS = [
  { label: '0–9',   start: 0,  end: 9   },
  { label: '10–19', start: 10, end: 19  },
  { label: '20–29', start: 20, end: 29  },
  { label: '30–39', start: 30, end: 39  },
  { label: '40–49', start: 40, end: 49  },
  { label: '50–59', start: 50, end: 59  },
  { label: '60–69', start: 60, end: 69  },
  { label: '70–79', start: 70, end: 79  },
  { label: '80+',   start: 80, end: 105 },
];

function ageCode(n: number): string {
  if (n >= 105) return '105+';
  return String(n).padStart(3, '0');
}

function ageCodes(start: number, end: number): string[] {
  return Array.from({ length: end - start + 1 }, (_, i) => ageCode(start + i));
}

const ALL_AGE_CODES = ageCodes(0, 105);

function popTotal(
  data: JsonStat2,
  strides: number[],
  region: string,
  year: string,
): number {
  let total = 0;
  for (const sex of ['1', '2']) {
    total += sumStatValues(
      data, strides,
      { Region: region, Kjonn: sex, ContentsCode: 'Personer1', Tid: year },
      'Alder', ALL_AGE_CODES,
    );
  }
  return total;
}

function popBandBySex(
  data: JsonStat2,
  strides: number[],
  region: string,
  sex: '1' | '2',
  start: number,
  end: number,
  year: string,
): number {
  return sumStatValues(
    data, strides,
    { Region: region, Kjonn: sex, ContentsCode: 'Personer1', Tid: year },
    'Alder', ageCodes(start, end),
  );
}

function medianAge(
  data: JsonStat2,
  strides: number[],
  region: string,
  year: string,
  total: number,
): number {
  const half = total / 2;
  let cumulative = 0;
  for (let age = 0; age <= 105; age++) {
    const code = ageCode(age);
    const m = getStatValue(data, strides, { Region: region, Kjonn: '1', Alder: code, ContentsCode: 'Personer1', Tid: year }) ?? 0;
    const f = getStatValue(data, strides, { Region: region, Kjonn: '2', Alder: code, ContentsCode: 'Personer1', Tid: year }) ?? 0;
    cumulative += m + f;
    if (cumulative >= half) return age;
  }
  return 40;
}

export async function runPopulationIngestion(sql: postgres.Sql): Promise<void> {
  // 1. All kommunenummer from DB
  const rows = await sql<{ id: string }[]>`SELECT id FROM kommuner ORDER BY id`;
  const kommuneIds = rows.map((r) => r.id);
  logger.info({ count: kommuneIds.length }, 'Kommuner loaded from DB');

  // 2. Area in km² from PostGIS (UTM 33N → accurate area for Norway)
  const areaRows = await sql<{ id: string; area_km2: number }[]>`
    SELECT id, ST_Area(ST_Transform(geom, 25833)) / 1000000.0 AS area_km2
    FROM kommuner WHERE geom IS NOT NULL
  `;
  const areaMap = new Map(areaRows.map((r) => [r.id, r.area_km2]));

  // 3. Population by age + sex — table 07459
  logger.info('Fetching SSB 07459 (population by age/sex)…');
  const popData = await ssbFetch<JsonStat2>('07459', {
    query: [
      { code: 'Region',       selection: { filter: 'item', values: kommuneIds } },
      { code: 'Kjonn',        selection: { filter: 'item', values: ['1', '2'] } },
      { code: 'Alder',        selection: { filter: 'item', values: ALL_AGE_CODES } },
      { code: 'ContentsCode', selection: { filter: 'item', values: ['Personer1'] } },
      { code: 'Tid',          selection: { filter: 'top',  values: ['2'] } },
    ],
    response: { format: 'json-stat2' },
  });
  const popStrides = buildStrides(popData);
  const years      = getDimKeys(popData, 'Tid').sort();
  const latestYear = years.at(-1)!;
  const prevYear   = years.at(-2) ?? latestYear;
  logger.info({ latestYear, prevYear }, 'Population fetched');

  // 4. Household income — table 06944
  // Region "0" = all of Norway for national median
  logger.info('Fetching SSB 06944 (household income)…');
  const incData = await ssbFetch<JsonStat2>('06944', {
    query: [
      { code: 'Region',       selection: { filter: 'item', values: ['0', ...kommuneIds] } },
      { code: 'HusholdType',  selection: { filter: 'item', values: ['0000'] } },
      { code: 'ContentsCode', selection: { filter: 'item', values: ['InntSkatt'] } },
      { code: 'Tid',          selection: { filter: 'top',  values: ['1'] } },
    ],
    response: { format: 'json-stat2' },
  });
  const incStrides = buildStrides(incData);
  const incYear    = getDimKeys(incData, 'Tid').at(-1)!;
  const nationalIncome = getStatValue(incData, incStrides, {
    Region: '0', HusholdType: '0000', ContentsCode: 'InntSkatt', Tid: incYear,
  }) ?? 0;
  logger.info({ incYear, nationalIncome }, 'Income fetched');

  // 5. Upsert stats for each kommune
  let upserted = 0;
  let noData   = 0;

  for (const id of kommuneIds) {
    const totalNow  = popTotal(popData, popStrides, id, latestYear);
    const totalPrev = popTotal(popData, popStrides, id, prevYear);

    if (totalNow === 0) { noData++; continue; }

    const changeYoY = totalPrev > 0
      ? Math.round(((totalNow - totalPrev) / totalPrev) * 1000) / 10
      : 0;

    const areakm2 = areaMap.get(id) ?? 0;
    const density = areakm2 > 0 ? Math.round(totalNow / areakm2) : 0;

    const bands = AGE_BANDS.map(({ label, start, end }) => ({
      label,
      male:   popBandBySex(popData, popStrides, id, '1', start, end, latestYear),
      female: popBandBySex(popData, popStrides, id, '2', start, end, latestYear),
    }));

    const median = medianAge(popData, popStrides, id, latestYear, totalNow);

    const income = getStatValue(incData, incStrides, {
      Region: id, HusholdType: '0000', ContentsCode: 'InntSkatt', Tid: incYear,
    }) ?? 0;
    const vsNational = income > 0 && nationalIncome > 0
      ? Math.round(((income - nationalIncome) / nationalIncome) * 1000) / 10
      : 0;

    const stats: KommuneStats = {
      population: {
        total:          totalNow,
        densityPerKm2:  density,
        changeYoY,
        year:           Number(latestYear),
      },
      age: {
        bands,
        medianAge: median,
        year:      Number(latestYear),
      },
      income: {
        medianHousehold: income,
        vsNational,
        year:            Number(incYear),
      },
      // Remaining fields are stubs — implemented in Phase 4
      education:  { primaryShare: 0, secondaryShare: 0, higherShare: 0, year: Number(latestYear) },
      migration:  { topCountries: [], totalForeign: 0, totalForeignShare: 0, year: Number(latestYear) },
      businesses: { total: 0, perCapita: 0, topSectors: [], year: Number(latestYear) },
      health:     { lifeExpectancyMale: 0, lifeExpectancyFemale: 0, year: Number(latestYear) },
    };

    await upsertKommuneStats(sql, id, stats, Number(latestYear));
    upserted++;

    if (upserted % 50 === 0) {
      logger.info({ upserted, remaining: kommuneIds.length - upserted - noData }, 'Progress');
    }
  }

  logger.info({ upserted, noData, total: kommuneIds.length }, 'SSB population ingestion complete');
}
