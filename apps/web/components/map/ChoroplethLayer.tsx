'use client';
import { useEffect, useRef } from 'react';
import type maplibregl from 'maplibre-gl';
import type { MapLayerMouseEvent } from 'maplibre-gl';
import type { Theme } from '@nabodata/types';
import { useMapStore } from '@nabodata/store';

const TILE_SERVER_URL = process.env['NEXT_PUBLIC_TILE_SERVER_URL'] ?? 'http://localhost:3001';

// ── Layer / source IDs ────────────────────────────────────────────────────────
const K_SOURCE  = 'kommuner-mvt';
const K_FILL    = 'kommuner-fill';
const K_LINE    = 'kommuner-line';
const K_LABEL   = 'kommuner-label';

const F_SOURCE  = 'fylker-mvt';
const F_FILL    = 'fylker-fill';
const F_LINE    = 'fylker-line';
const F_LABEL   = 'fylker-label';

// Zoom threshold: below this shows fylker overview, above shows kommuner detail
const DRILL_ZOOM = 6;

const DENSITY_BREAKS = [0, 50, 200, 600, 1500, 3000, 6000] as const;

// ── Colour helpers ────────────────────────────────────────────────────────────
function getChoro(theme: Theme): string[] {
  if (theme === 'dark')
    return ['#0D2137', '#0E3352', '#0A4F72', '#076B8A', '#0E7C86', '#1DA8B5', '#2DB7C2'];
  if (theme === 'color')
    return ['#EFE8D2', '#D5D2B0', '#A8B795', '#6E988A', '#487C81', '#275F76', '#143F60'];
  return ['#ECF1F6', '#C9D6E5', '#9CB1CB', '#6E8DAF', '#486D92', '#2C5176', '#15355A'];
}

function getBorderColor(theme: Theme): string {
  if (theme === 'dark') return 'rgba(45,183,194,0.45)';
  if (theme === 'color') return '#C8B99A';
  return '#D2D8E0';
}

function getLabelColor(theme: Theme): string {
  if (theme === 'dark') return '#ECF1F6';
  return '#0F1723';
}

function getLabelHalo(theme: Theme): string {
  if (theme === 'dark') return 'rgba(11,15,20,0.7)';
  return 'rgba(255,255,255,0.85)';
}

function getFillOpacity(theme: Theme): number {
  return theme === 'dark' ? 0.6 : 0.75;
}

function buildStepExpression(theme: Theme): maplibregl.ExpressionSpecification {
  const colors = getChoro(theme);
  const fallback = colors[0] ?? '#ECF1F6';
  // coalesce: if population_density is null (not yet in tiles), default to 0
  const expr: unknown[] = ['step', ['coalesce', ['get', 'population_density'], 0], fallback];
  for (let i = 0; i < DENSITY_BREAKS.length && i < colors.length - 1; i++) {
    expr.push(DENSITY_BREAKS[i]);
    expr.push(colors[i + 1] ?? '#ECF1F6');
  }
  return expr as maplibregl.ExpressionSpecification;
}

// ── Bounds helper ─────────────────────────────────────────────────────────────
type LngLatBounds = [[number, number], [number, number]];

function boundsFromFeature(feature: { geometry: GeoJSON.Geometry }): LngLatBounds | null {
  const geom = feature.geometry;
  if (geom.type !== 'Polygon' && geom.type !== 'MultiPolygon') return null;
  let minLng = Infinity, maxLng = -Infinity, minLat = Infinity, maxLat = -Infinity;
  function scanRing(coords: GeoJSON.Position[]) {
    for (const coord of coords) {
      const lng = coord[0]; const lat = coord[1];
      if (lng === undefined || lat === undefined) continue;
      if (lng < minLng) minLng = lng; if (lng > maxLng) maxLng = lng;
      if (lat < minLat) minLat = lat; if (lat > maxLat) maxLat = lat;
    }
  }
  if (geom.type === 'Polygon') {
    geom.coordinates.forEach(scanRing);
  } else {
    geom.coordinates.forEach((poly) => poly.forEach(scanRing));
  }
  if (!isFinite(minLng)) return null;
  return [[minLng, minLat], [maxLng, maxLat]];
}

// ── Component ─────────────────────────────────────────────────────────────────
interface ChoroplethLayerProps {
  map: maplibregl.Map;
  theme: Theme;
}

export function ChoroplethLayer({ map, theme }: ChoroplethLayerProps) {
  useMapStore();
  const themeRef = useRef(theme);
  themeRef.current = theme;

  // ── Effect 1: Add all layers on every style load ──────────────────────────
  useEffect(() => {
    function addLayers() {
      const t = themeRef.current;

      // ── Fylker source + layers (overview, zoom < DRILL_ZOOM) ──
      if (!map.getSource(F_SOURCE)) {
        map.addSource(F_SOURCE, {
          type: 'vector',
          tiles: [`${TILE_SERVER_URL}/fylker/{z}/{x}/{y}`],
          minzoom: 0,
          maxzoom: 14,
        });
      }
      if (!map.getLayer(F_FILL)) {
        map.addLayer({
          id: F_FILL,
          type: 'fill',
          source: F_SOURCE,
          'source-layer': 'fylker',
          maxzoom: DRILL_ZOOM,
          paint: {
            // Very subtle hover-only fill — borders carry the visual weight
            'fill-color': t === 'dark' ? '#2DB7C2' : '#0E7C86',
            'fill-opacity': 0.08,
          },
        });
      }
      if (!map.getLayer(F_LINE)) {
        map.addLayer({
          id: F_LINE,
          type: 'line',
          source: F_SOURCE,
          'source-layer': 'fylker',
          maxzoom: DRILL_ZOOM + 1,
          paint: {
            'line-color': t === 'dark' ? '#2DB7C2' : '#0E7C86',
            'line-width': ['interpolate', ['linear'], ['zoom'], 3, 1.5, 6, 2.5],
            'line-opacity': 0.7,
          },
        });
      }
      if (!map.getLayer(F_LABEL)) {
        map.addLayer({
          id: F_LABEL,
          type: 'symbol',
          source: F_SOURCE,
          'source-layer': 'fylker',
          minzoom: 4,
          maxzoom: DRILL_ZOOM,
          layout: {
            'text-field': ['get', 'name_nb'],
            'text-font': ['Noto Sans Regular'],
            'text-size': ['interpolate', ['linear'], ['zoom'], 4, 10, 6, 13],
            'text-anchor': 'center',
            'text-max-width': 8,
          },
          paint: {
            'text-color': getLabelColor(t),
            'text-halo-color': getLabelHalo(t),
            'text-halo-width': 1.5,
          },
        });
      }

      // ── Kommuner source + layers (detail, zoom ≥ DRILL_ZOOM) ──
      if (!map.getSource(K_SOURCE)) {
        map.addSource(K_SOURCE, {
          type: 'vector',
          tiles: [`${TILE_SERVER_URL}/kommuner/{z}/{x}/{y}`],
          minzoom: 4,
          maxzoom: 14,
        });
      }
      if (!map.getLayer(K_FILL)) {
        map.addLayer({
          id: K_FILL,
          type: 'fill',
          source: K_SOURCE,
          'source-layer': 'kommuner',
          minzoom: DRILL_ZOOM,
          paint: {
            'fill-color': buildStepExpression(t),
            'fill-opacity': getFillOpacity(t),
          },
        });
      }
      if (!map.getLayer(K_LINE)) {
        map.addLayer({
          id: K_LINE,
          type: 'line',
          source: K_SOURCE,
          'source-layer': 'kommuner',
          minzoom: DRILL_ZOOM,
          paint: {
            'line-color': getBorderColor(t),
            'line-width': 0.5,
          },
        });
      }
      if (!map.getLayer(K_LABEL)) {
        map.addLayer({
          id: K_LABEL,
          type: 'symbol',
          source: K_SOURCE,
          'source-layer': 'kommuner',
          minzoom: 7,
          layout: {
            'text-field': ['get', 'name_nb'],
            'text-font': ['Noto Sans Regular'],
            'text-size': ['interpolate', ['linear'], ['zoom'], 7, 9, 12, 13],
            'text-anchor': 'center',
            'text-max-width': 6,
          },
          paint: {
            'text-color': getLabelColor(t),
            'text-halo-color': getLabelHalo(t),
            'text-halo-width': 1,
          },
        });
      }
    }

    map.on('style.load', addLayers);
    if (map.isStyleLoaded()) addLayers();

    return () => {
      map.off('style.load', addLayers);
      for (const id of [K_LABEL, K_LINE, K_FILL, F_LABEL, F_LINE, F_FILL]) {
        if (map.getLayer(id)) map.removeLayer(id);
      }
      for (const id of [K_SOURCE, F_SOURCE]) {
        if (map.getSource(id)) map.removeSource(id);
      }
    };
  }, [map]);

  // ── Effect 2: Update paint on theme change ────────────────────────────────
  useEffect(() => {
    if (!map.isStyleLoaded()) return;
    if (map.getLayer(K_FILL)) {
      map.setPaintProperty(K_FILL, 'fill-color', buildStepExpression(theme));
      map.setPaintProperty(K_FILL, 'fill-opacity', getFillOpacity(theme));
    }
    if (map.getLayer(K_LINE))  map.setPaintProperty(K_LINE, 'line-color', getBorderColor(theme));
    if (map.getLayer(F_LINE))  map.setPaintProperty(F_LINE, 'line-color', getBorderColor(theme));
    if (map.getLayer(K_LABEL)) {
      map.setPaintProperty(K_LABEL, 'text-color', getLabelColor(theme));
      map.setPaintProperty(K_LABEL, 'text-halo-color', getLabelHalo(theme));
    }
    if (map.getLayer(F_LABEL)) {
      map.setPaintProperty(F_LABEL, 'text-color', getLabelColor(theme));
      map.setPaintProperty(F_LABEL, 'text-halo-color', getLabelHalo(theme));
    }
  }, [map, theme]);

  // ── Effect 3: Click handlers ──────────────────────────────────────────────
  useEffect(() => {
    // Fylke click → fly to bounds (overview drill-down)
    function handleFylkeClick(e: MapLayerMouseEvent) {
      const feature = e.features?.[0];
      if (!feature) return;
      const bounds = boundsFromFeature(feature);
      if (bounds) {
        map.fitBounds(bounds, { padding: 60, duration: 800, maxZoom: 10 });
      }
    }

    // Kommune click → open DataPanel
    function handleKommuneClick(e: MapLayerMouseEvent) {
      const slug = e.features?.[0]?.properties?.['slug'] as string | undefined;
      if (slug) useMapStore.getState().setActiveKommuneSlug(slug);
    }

    function onEnterFylke() { map.getCanvas().style.cursor = 'zoom-in'; }
    function onEnterKommune() { map.getCanvas().style.cursor = 'pointer'; }
    function onLeave() { map.getCanvas().style.cursor = ''; }

    map.on('click',      F_FILL, handleFylkeClick);
    map.on('mouseenter', F_FILL, onEnterFylke);
    map.on('mouseleave', F_FILL, onLeave);

    map.on('click',      K_FILL, handleKommuneClick);
    map.on('mouseenter', K_FILL, onEnterKommune);
    map.on('mouseleave', K_FILL, onLeave);

    return () => {
      map.off('click',      F_FILL, handleFylkeClick);
      map.off('mouseenter', F_FILL, onEnterFylke);
      map.off('mouseleave', F_FILL, onLeave);
      map.off('click',      K_FILL, handleKommuneClick);
      map.off('mouseenter', K_FILL, onEnterKommune);
      map.off('mouseleave', K_FILL, onLeave);
    };
  }, [map]);

  return null;
}
