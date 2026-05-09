// SSB PxWebApi v2 typed client
// Docs: https://www.ssb.no/api/pxwebapi

export const SSB_API_BASE = 'https://data.ssb.no/api/v0/no/table';

export interface PxWebQuery {
  query: PxWebSelection[];
  response: { format: 'json-stat2' };
}

export interface PxWebSelection {
  code: string;
  selection: {
    filter: 'item' | 'all' | 'top';
    values: string[];
  };
}

export interface JsonStat2 {
  class: 'dataset';
  id: string[];
  size: number[];
  dimension: Record<string, {
    label?: string;
    category: {
      index: Record<string, number>;
      label?: Record<string, string>;
    };
  }>;
  value: (number | null)[];
}

export async function ssbFetch<T>(tableId: string, query: PxWebQuery): Promise<T> {
  const res = await fetch(`${SSB_API_BASE}/${tableId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(query),
  });

  if (!res.ok) {
    throw new Error(`SSB API error ${res.status}: ${res.statusText} (table ${tableId})`);
  }

  return res.json() as Promise<T>;
}

/** Pre-compute strides for flat-index lookup in a json-stat2 dataset. */
export function buildStrides(data: JsonStat2): number[] {
  const strides = new Array<number>(data.id.length).fill(1);
  for (let d = data.id.length - 2; d >= 0; d--) {
    strides[d] = strides[d + 1]! * data.size[d + 1]!;
  }
  return strides;
}

/**
 * Look up a single value from a json-stat2 dataset given one value per dimension.
 * Returns null if any dimension key is not present.
 */
export function getStatValue(
  data: JsonStat2,
  strides: number[],
  coords: Record<string, string>,
): number | null {
  let flatIdx = 0;
  for (let d = 0; d < data.id.length; d++) {
    const dimId = data.id[d]!;
    const key = coords[dimId];
    if (key === undefined) return null;
    const idx = data.dimension[dimId]!.category.index[key];
    if (idx === undefined) return null;
    flatIdx += idx * strides[d]!;
  }
  return data.value[flatIdx] ?? null;
}

/**
 * Sum values over a list of keys for one dimension, holding other dims fixed.
 */
export function sumStatValues(
  data: JsonStat2,
  strides: number[],
  fixedCoords: Record<string, string>,
  sumDim: string,
  sumKeys: string[],
): number {
  let total = 0;
  for (const key of sumKeys) {
    const v = getStatValue(data, strides, { ...fixedCoords, [sumDim]: key });
    if (v !== null) total += v;
  }
  return total;
}

/** Get the ordered list of keys for a dimension (sorted by their index). */
export function getDimKeys(data: JsonStat2, dimId: string): string[] {
  const cat = data.dimension[dimId]!.category;
  return Object.entries(cat.index)
    .sort((a, b) => a[1] - b[1])
    .map(([k]) => k);
}
