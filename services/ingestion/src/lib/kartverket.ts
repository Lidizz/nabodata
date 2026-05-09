// Kartverket WFS / GeoNorge API client
// Docs: https://kartkatalog.geonorge.no

export const GEONORGE_WFS_BASE = 'https://wfs.geonorge.no/skwms1/wfs.administrative_enheter';

export async function downloadKommuneGeometries(): Promise<unknown> {
  // TODO: implement GeoNorge WFS download
  // Use WFS GetFeature request for kommuner (Kommuner layer)
  // EPSG:4326, GeoJSON output format
  throw new Error('Not implemented');
}

export async function downloadFylkeGeometries(): Promise<unknown> {
  // TODO: implement GeoNorge WFS download
  // Use WFS GetFeature request for fylker (Fylker layer)
  throw new Error('Not implemented');
}
