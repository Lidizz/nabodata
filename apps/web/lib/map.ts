// OpenFreeMap — free vector tiles, no API key, OpenStreetMap data
// https://openfreemap.org
const OFM_STYLES = {
  light: 'https://tiles.openfreemap.org/styles/liberty',
  dark:  'https://tiles.openfreemap.org/styles/dark',
  color: 'https://tiles.openfreemap.org/styles/bright',
} as const;

export type MapTheme = 'light' | 'dark' | 'color';

export function getStyleForTheme(theme: MapTheme): string {
  return OFM_STYLES[theme];
}

// Required attribution for the kommuner/fylker overlay tiles (Kartverket CC BY 4.0)
export const KARTVERKET_ATTRIBUTION =
  '© <a href="https://www.kartverket.no" target="_blank">Kartverket</a> · © <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>';
