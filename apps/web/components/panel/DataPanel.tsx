'use client';

import { useEffect, useState, useCallback } from 'react';
import { useMapStore } from '@nabodata/store';
import { getKommune, ApiClientError } from '@nabodata/api-client';
import type { Kommune } from '@nabodata/types';
import { StatCard } from './StatCard';
import { AgePyramid } from './AgePyramid';
import { HorizontalBarChart } from './HorizontalBarChart';

const API_URL = process.env['NEXT_PUBLIC_API_URL'] ?? 'http://localhost:3002';

type PanelState = 'idle' | 'loading' | 'ready' | 'no-data' | 'error';

export function DataPanel() {
  const { activeKommuneSlug } = useMapStore();
  const close = useCallback(() => useMapStore.getState().setActiveKommuneSlug(null), []);
  const [kommune, setKommune] = useState<Kommune | null>(null);
  const [state, setState] = useState<PanelState>('idle');

  useEffect(() => {
    if (!activeKommuneSlug) {
      setKommune(null);
      setState('idle');
      return;
    }
    setState('loading');
    setKommune(null);
    getKommune(API_URL, activeKommuneSlug)
      .then(({ data }) => {
        setKommune(data);
        setState('ready');
      })
      .catch((err: unknown) => {
        if (err instanceof ApiClientError && err.statusCode === 404) {
          setState('no-data');
        } else {
          setState('error');
        }
      });
  }, [activeKommuneSlug]);

  const isOpen = activeKommuneSlug !== null;

  return (
    <aside
      aria-label="Datavisning"
      style={{
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        width: 400,
        background: 'var(--surface-1)',
        borderLeft: '1px solid var(--border-1)',
        boxShadow: 'var(--shadow-panel)',
        transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform var(--dur-panel) var(--ease-out)',
        zIndex: 'var(--z-panel)' as unknown as number,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--sp-4)',
        padding: 'var(--sp-5)',
      }}
    >
      <button
        onClick={close}
        aria-label="Lukk panel"
        style={{
          position: 'absolute',
          top: 12,
          right: 12,
          width: 28,
          height: 28,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 'var(--r-2)',
          border: '1px solid var(--border-1)',
          background: 'var(--surface-2)',
          color: 'var(--fg-3)',
          cursor: 'pointer',
          fontSize: 16,
          lineHeight: 1,
        }}
      >
        ×
      </button>
      {state === 'loading' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingTop: 8 }}>
          {[100, 80, 100, 180, 60].map((w, i) => (
            <div
              key={i}
              style={{
                height: i === 3 ? 120 : 48,
                width: `${Math.min(w, 100)}%`,
                borderRadius: 'var(--r-3)',
                background: 'var(--surface-3)',
                animation: 'pulse 1.4s ease-in-out infinite',
              }}
            />
          ))}
        </div>
      )}

      {state === 'no-data' && (
        <div style={{ paddingTop: 24, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <p style={{ fontSize: 'var(--fs-h3)', fontWeight: 600, color: 'var(--fg-1)' }}>
            {activeKommuneSlug}
          </p>
          <p style={{ fontSize: 'var(--fs-body-sm)', color: 'var(--fg-3)' }}>
            Ingen statistikk tilgjengelig ennå.
          </p>
          <p style={{ fontSize: 'var(--fs-body-sm)', color: 'var(--fg-4)' }}>
            Data hentes fra SSB og lastes inn fortløpende.
          </p>
        </div>
      )}

      {state === 'error' && (
        <div style={{ paddingTop: 24 }}>
          <p style={{ fontSize: 'var(--fs-body-sm)', color: 'var(--danger)' }}>
            Kunne ikke laste området. Prøv igjen.
          </p>
        </div>
      )}

      {state === 'ready' && kommune && (
        <>
          <div>
            <h2 style={{ fontSize: 'var(--fs-h2)', fontWeight: 600, color: 'var(--fg-1)', marginBottom: 4 }}>
              {kommune.name.nb}
            </h2>
            <p style={{ fontSize: 'var(--fs-body-sm)', color: 'var(--fg-3)', fontFamily: 'var(--font-mono)' }}>
              Oppdatert {new Date(kommune.updatedAt).toLocaleDateString('nb-NO')}
            </p>
          </div>

          <StatCard
            label="Innbyggere"
            value={kommune.stats.population.total}
            trend={kommune.stats.population.changeYoY}
            trendLabel="siste år"
          />
          <StatCard
            label="Tetthet"
            value={kommune.stats.population.densityPerKm2}
            unit="innb. / km²"
          />
          <StatCard
            label="Medianinntekt"
            value={kommune.stats.income.medianHousehold}
            unit="kr"
            trend={kommune.stats.income.vsNational}
            trendLabel="vs. nasjonalt"
            formatValue={(n) =>
              n.toLocaleString('nb-NO', { style: 'currency', currency: 'NOK', maximumFractionDigits: 0 })
            }
          />

          <AgePyramid data={kommune.stats.age} label="Aldersfordeling" />

          <HorizontalBarChart
            title="Næringsliv — topp sektorer"
            items={kommune.stats.businesses.topSectors.map((s) => ({
              label: s.sector,
              value: s.count,
            }))}
          />
        </>
      )}
    </aside>
  );
}
