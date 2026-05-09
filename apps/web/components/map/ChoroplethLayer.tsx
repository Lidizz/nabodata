'use client';
import { useEffect } from 'react';
import type maplibregl from 'maplibre-gl';
import type { MapLayerMouseEvent } from 'maplibre-gl';
import type { Theme } from '@nabodata/types';
import { useMapStore } from '@nabodata/store';

const TILE_SERVER_URL = process.env['NEXT_PUBLIC_TILE_SERVER_URL'] ?? 'http://localhost:3001';
const DENSITY_BREAKS = [0, 50, 200, 600, 1500, 3000, 6000] as const;

function getChoro(theme: Theme): string[] {
  if (theme === 'dark') {
    return ['#2B241B', '#4F3D26', '#7A5A36', '#A57850', '#3F8580', '#5FA3A5', '#2DB7C2'];
  }
  if (theme === 'color') {
    return ['#EFE8D2', '#D5D2B0', '#A8B795', '#6E988A', '#487C81', '#275F76', '#143F60'];
  }
  return ['#ECF1F6', '#C9D6E5', '#9CB1CB', '#6E8DAF', '#486D92', '#2C5176', '#15355A'];
}

function getBorderColor(theme: Theme): string {
  if (theme === 'dark') return '#2C3540';
  if (theme === 'color') return '#C8B99A';
  return '#D2D8E0';
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
  const { setActiveKommuneSlug } = useMapStore();

  // Add/re-add sources and layers whenever map instance or theme changes
  useEffect(() => {
    const SOURCE_ID = 'kommuner-mvt';
    const FILL_LAYER = 'kommuner-fill';
    const LINE_LAYER = 'kommuner-line';

    function addLayers() {
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
            'fill-color': buildStepExpression(theme),
            'fill-opacity': 0.75,
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
            'line-color': getBorderColor(theme),
            'line-width': 0.5,
          },
        });
      }
    }

    if (map.isStyleLoaded()) {
      addLayers();
    } else {
      map.once('style.load', addLayers);
    }

    return () => {
      map.off('style.load', addLayers);
      if (map.getLayer(LINE_LAYER)) map.removeLayer(LINE_LAYER);
      if (map.getLayer(FILL_LAYER)) map.removeLayer(FILL_LAYER);
      if (map.getSource(SOURCE_ID)) map.removeSource(SOURCE_ID);
    };
  }, [map, theme]);

  // Click to select kommune — sets slug in store, DataPanel fetches the rest
  useEffect(() => {
    const FILL_LAYER = 'kommuner-fill';

    function handleClick(e: MapLayerMouseEvent) {
      const slug = e.features?.[0]?.properties?.['slug'] as string | undefined;
      if (slug) setActiveKommuneSlug(slug);
    }

    function onEnter() {
      map.getCanvas().style.cursor = 'pointer';
    }

    function onLeave() {
      map.getCanvas().style.cursor = '';
    }

    map.on('click', FILL_LAYER, handleClick);
    map.on('mouseenter', FILL_LAYER, onEnter);
    map.on('mouseleave', FILL_LAYER, onLeave);

    return () => {
      map.off('click', FILL_LAYER, handleClick);
      map.off('mouseenter', FILL_LAYER, onEnter);
      map.off('mouseleave', FILL_LAYER, onLeave);
    };
  }, [map, setActiveKommuneSlug]);

  return null;
}
