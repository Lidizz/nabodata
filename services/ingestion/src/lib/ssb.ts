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
