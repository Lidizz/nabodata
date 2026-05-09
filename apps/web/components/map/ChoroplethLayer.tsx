'use client';
import { useEffect, useRef } from 'react';
import type maplibregl from 'maplibre-gl';
import type { MapLayerMouseEvent } from 'maplibre-gl';
import type { Theme } from '@nabodata/types';
import { useMapStore } from '@nabodata/store';

const TILE_SERVER_URL = process.env['NEXT_PUBLIC_TILE_SERVER_URL'] ?? 'http://localhost:3001';
const SOURCE_ID = 'kommuner-mvt';
const FILL_LAYER = 'kommuner-fill';
const LINE_LAYER = 'kommuner-line';
const DENSITY_BREAKS = [0, 50, 200, 600, 1500, 3000, 6000] as const;

function getChoro(theme: Theme): string[] {
  if (theme === 'dark') {
    // Dark navy → teal: visible against the dark basemap, low values don't disappear
    return ['#0D2137', '#0E3352', '#0A4F72', '#076B8A', '#0E7C86', '#1DA8B5', '#2DB7C2'];
  }
  if (theme === 'color') {
    return ['#EFE8D2', '#D5D2B0', '#A8B795', '#6E988A', '#487C81', '#275F76', '#143F60'];
  }
  return ['#ECF1F6', '#C9D6E5', '#9CB1CB', '#6E8DAF', '#486D92', '#2C5176', '#15355A'];
}

function getBorderColor(theme: Theme): string {
  // Dark mode: semi-transparent teal so boundaries are visible against the dark basemap
  if (theme === 'dark') return 'rgba(45, 183, 194, 0.45)';
  if (theme === 'color') return '#C8B99A';
  return '#D2D8E0';
}

function getFillOpacity(theme: Theme): number {
  return theme === 'dark' ? 0.6 : 0.75;
}

function buildStepExpression(theme: Theme): maplibregl.ExpressionSpecification {
  const colors = getChoro(theme);
  const fallback = colors[0] ?? '#ECF1F6';
  const expr: unknown[] = ['step', ['get', 'population_density'], fallback];
  for (let i = 0; i < DENSITY_BREAKS.length && i < colors.length - 1; i++) {
    expr.push(DENSITY_BREAKS[i]);
    expr.push(colors[i + 1] ?? '#ECF1F6');
  }
  return expr as maplibregl.ExpressionSpecification;
}

interface ChoroplethLayerProps {
  map: maplibregl.Map;
  theme: Theme;
}

export function ChoroplethLayer({ map, theme }: ChoroplethLayerProps) {
  useMapStore(); // subscribe so re-renders happen when slug changes
  // Keep a ref so the style.load callback always reads the current theme
  const themeRef = useRef(theme);
  themeRef.current = theme;

  // Effect 1: Add layers on every style load (handles initial load + theme switches).
  // Using map.on (persistent) instead of map.once so it fires after every setStyle call.
  useEffect(() => {
    function addLayers() {
      const t = themeRef.current;
      if (!map.getSource(SOURCE_ID)) {
        map.addSource(SOURCE_ID, {
          type: 'vector',
          tiles: [`${TILE_SERVER_URL}/kommuner/{z}/{x}/{y}`],
          minzoom: 4,
          maxzoom: 14,
        });
      }
      if (!map.getLayer(FILL_LAYER)) {
        map.addLayer({
          id: FILL_LAYER,
          type: 'fill',
          source: SOURCE_ID,
          'source-layer': 'kommuner',
          paint: {
            'fill-color': buildStepExpression(t),
            'fill-opacity': getFillOpacity(t),
          },
        });
      }
      if (!map.getLayer(LINE_LAYER)) {
        map.addLayer({
          id: LINE_LAYER,
          type: 'line',
          source: SOURCE_ID,
          'source-layer': 'kommuner',
          paint: {
            'line-color': getBorderColor(t),
            'line-width': 0.5,
          },
        });
      }
    }

    map.on('style.load', addLayers);
    if (map.isStyleLoaded()) addLayers();

    return () => {
      map.off('style.load', addLayers);
      if (map.getLayer(LINE_LAYER)) map.removeLayer(LINE_LAYER);
      if (map.getLayer(FILL_LAYER)) map.removeLayer(FILL_LAYER);
      if (map.getSource(SOURCE_ID)) map.removeSource(SOURCE_ID);
    };
  }, [map]); // only depends on map — theme is read via ref

  // Effect 2: Update paint properties when theme changes without re-adding layers.
  useEffect(() => {
    if (!map.isStyleLoaded() || !map.getLayer(FILL_LAYER)) return;
    map.setPaintProperty(FILL_LAYER, 'fill-color', buildStepExpression(theme));
    map.setPaintProperty(FILL_LAYER, 'fill-opacity', getFillOpacity(theme));
    map.setPaintProperty(LINE_LAYER, 'line-color', getBorderColor(theme));
  }, [map, theme]);

  // Effect 3: Click to select kommune — read store at call time to avoid stale closure
  useEffect(() => {
    function handleClick(e: MapLayerMouseEvent) {
      const slug = e.features?.[0]?.properties?.['slug'] as string | undefined;
      if (slug) useMapStore.getState().setActiveKommuneSlug(slug);
    }
    function onEnter() { map.getCanvas().style.cursor = 'pointer'; }
    function onLeave() { map.getCanvas().style.cursor = ''; }

    map.on('click', FILL_LAYER, handleClick);
    map.on('mouseenter', FILL_LAYER, onEnter);
    map.on('mouseleave', FILL_LAYER, onLeave);

    return () => {
      map.off('click', FILL_LAYER, handleClick);
      map.off('mouseenter', FILL_LAYER, onEnter);
      map.off('mouseleave', FILL_LAYER, onLeave);
    };
  }, [map]);

  return null;
}
