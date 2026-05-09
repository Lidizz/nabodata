'use client';

import { useEffect, useState } from 'react';
import { useMapStore } from '@nabodata/store';
import { getKommune } from '@nabodata/api-client';
import type { Kommune } from '@nabodata/types';
import { StatCard } from './StatCard';
import { AgePyramid } from './AgePyramid';
import { HorizontalBarChart } from './HorizontalBarChart';

const API_URL = process.env['NEXT_PUBLIC_API_URL'] ?? 'http://localhost:3002';

export function DataPanel() {
  const { activeKommuneSlug } = useMapStore();
  const [kommune, setKommune] = useState<Kommune | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!activeKommuneSlug) {
      setKommune(null);
      return;
    }
    setLoading(true);
    getKommune(API_URL, activeKommuneSlug)
      .then(({ data }) => { setKommune(data); })
      .catch(() => { setKommune(null); })
      .finally(() => { setLoading(false); });
  }, [activeKommuneSlug]);

  const isOpen = !!activeKommuneSlug;

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
      {kommune && !loading ? (
        <>
          <div>
            <h2
              style={{
                fontSize: 'var(--fs-h2)',
                fontWeight: 600,
                color: 'var(--fg-1)',
                marginBottom: 4,
              }}
            >
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
      ) : isOpen ? (
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
      ) : null}
    </aside>
  );
}
