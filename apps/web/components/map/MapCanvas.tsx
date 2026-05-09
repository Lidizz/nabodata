'use client';

import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import { useMapStore } from '@nabodata/store';
import { getStyleForTheme, KARTVERKET_ATTRIBUTION } from '../../lib/map';
import { applyTheme, readStoredTheme } from '../../lib/theme';
import { ChoroplethLayer } from './ChoroplethLayer';

interface MapCanvasProps {
  initialBbox?: [number, number, number, number];
}

export function MapCanvas({ initialBbox }: MapCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [mapInstance, setMapInstance] = useState<maplibregl.Map | null>(null);
  const { activeTheme, setTheme, setZoom } = useMapStore();

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const storedTheme = readStoredTheme();
    const initialTheme = storedTheme ?? activeTheme;
    if (storedTheme && storedTheme !== activeTheme) {
      setTheme(storedTheme);
      applyTheme(storedTheme);
    }

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: getStyleForTheme(initialTheme),
      center: [15.0, 65.0],
      zoom: 4.5,
      minZoom: 3,
      maxZoom: 18,
      attributionControl: false,
    });

    map.addControl(
      new maplibregl.AttributionControl({
        customAttribution: KARTVERKET_ATTRIBUTION,
        compact: true,
      }),
      'bottom-right',
    );

    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'bottom-right');

    if (initialBbox) {
      map.fitBounds(
        [
          [initialBbox[0], initialBbox[1]],
          [initialBbox[2], initialBbox[3]],
        ],
        { padding: 60, duration: 600 },
      );
    }

    map.on('zoom', () => {
      setZoom(map.getZoom());
    });

    mapRef.current = map;
    setMapInstance(map);
    return () => {
      map.remove();
      mapRef.current = null;
      setMapInstance(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync theme changes to map style
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    map.setStyle(getStyleForTheme(activeTheme), { diff: false });
  }, [activeTheme]);

  return (
    <>
      <div
        ref={containerRef}
        className="absolute inset-0 h-full w-full"
        style={{ zIndex: 'var(--z-map)' }}
      />
      {mapInstance && <ChoroplethLayer map={mapInstance} theme={activeTheme} />}
    </>
  );
}
