// DataPanel — right rail with stat cards, age pyramid, bars, POI chips.

const fmtNb = (n) => n.toLocaleString('nb-NO').replace(/,/g, ' ');

function StatCard({ label, value, trend, suffix, size = 'sm' }) {
  return (
    <div style={{
      background: 'var(--surface-1)', border: '1px solid var(--border-1)',
      borderRadius: 8, padding: size === 'lg' ? '16px 16px 14px' : '12px 12px 10px',
    }}>
      <div className="label" style={{ marginBottom: size === 'lg' ? 8 : 6 }}>{label}</div>
      <div className="display tabular" style={{
        fontSize: size === 'lg' ? 34 : 22,
        lineHeight: 1.05,
        letterSpacing: '-0.01em',
      }}>{value}</div>
      {(trend || suffix) && (
        <div style={{
          display: 'flex', alignItems: 'baseline', gap: 6, marginTop: size === 'lg' ? 8 : 6,
          fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums', fontSize: 11,
        }}>
          {trend && (
            <span style={{
              color: trend.dir === 'up' ? 'var(--success)'
                   : trend.dir === 'down' ? 'var(--danger)'
                   : 'var(--fg-3)',
            }}>
              {trend.dir === 'up' ? '↑' : trend.dir === 'down' ? '↓' : '·'} {trend.text}
            </span>
          )}
          {suffix && <span style={{ color: 'var(--fg-3)' }}>{suffix}</span>}
        </div>
      )}
    </div>
  );
}

function AgePyramid({ bands }) {
  // bands: array of 9 percentages
  const labels = ['0–9','10–19','20–29','30–39','40–49','50–59','60–69','70–79','80+'];
  const max = Math.max(...bands);
  const W = 360, H = 196, axisX = W / 2;
  const rowH = 16, gap = 4;
  const top = 8;
  const halfMax = 130; // px each side

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H}
      style={{ fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums' }}>
      {/* axis */}
      <line x1={axisX} y1={top - 4} x2={axisX} y2={top + 9 * (rowH + gap)}
        stroke="var(--border-2)" strokeWidth="1" />
      {/* ticks */}
      {[-20, -10, 0, 10, 20].map(t => {
        const x = axisX + (t / 20) * halfMax;
        return (
          <g key={t}>
            <line x1={x} y1={top + 9 * (rowH + gap)} x2={x} y2={top + 9 * (rowH + gap) + 3}
              stroke="var(--border-2)" />
            <text x={x} y={top + 9 * (rowH + gap) + 14} textAnchor="middle"
              fontSize="9" fill="var(--fg-3)">{Math.abs(t)}%</text>
          </g>
        );
      })}

      {bands.map((p, i) => {
        const wMen = (p / max) * halfMax;
        const wWomen = ((p * 1.05) / max) * halfMax; // illustrative skew
        const y = top + i * (rowH + gap);
        return (
          <g key={i}>
            <text x={axisX} y={y + rowH * 0.72} textAnchor="middle"
              fontSize="9" fill="var(--fg-3)">{labels[i]}</text>
            <rect x={axisX - wMen - 18} y={y} width={wMen} height={rowH}
              fill="var(--viz-4)" rx="1" />
            <rect x={axisX + 18} y={y} width={wWomen} height={rowH}
              fill="var(--viz-1)" rx="1" />
          </g>
        );
      })}

      {/* legend */}
      <g fontSize="10" fill="var(--fg-2)" fontFamily="var(--font-sans)">
        <rect x="6" y={H - 12} width="8" height="8" fill="var(--viz-4)" rx="1" />
        <text x="18" y={H - 5}>Menn</text>
        <rect x={W - 70} y={H - 12} width="8" height="8" fill="var(--viz-1)" rx="1" />
        <text x={W - 58} y={H - 5}>Kvinner</text>
      </g>
    </svg>
  );
}

function BarRow({ label, value, max, suffix = '', accent = 'var(--accent)' }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '88px 1fr 60px', gap: 12, alignItems: 'center', fontSize: 12 }}>
      <span style={{ color: 'var(--fg-2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</span>
      <div style={{ height: 6, background: 'var(--surface-2)', borderRadius: 1, overflow: 'hidden' }}>
        <div style={{ width: `${(value / max) * 100}%`, height: '100%', background: accent }} />
      </div>
      <span className="tabular" style={{ fontFamily: 'var(--font-mono)', textAlign: 'right', color: 'var(--fg-2)' }}>
        {fmtNb(value)}{suffix}
      </span>
    </div>
  );
}

function PoiChips({ poi }) {
  // Map POI categories to viz palette tokens (theme-aware).
  const categoryColors = {
    'Skoler': 'var(--viz-1)',
    'Helse': 'var(--viz-3)',
    'Spise': 'var(--viz-2)',
    'Religion': 'var(--viz-5)',
    'Kultur': 'var(--viz-4)',
    'Idrett': 'var(--viz-6)',
  };
  const entries = Object.entries(poi);
  const [active, setActive] = React.useState(entries[0]?.[0]);
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
      {entries.map(([k, n]) => {
        const isOn = active === k;
        return (
          <button key={k} onClick={() => setActive(isOn ? null : k)} style={{
            display: 'inline-flex', alignItems: 'center', gap: 8, height: 28, padding: '0 10px',
            background: isOn ? 'var(--accent-soft)' : 'var(--surface-1)',
            color: isOn ? 'var(--accent-press)' : 'var(--fg-1)',
            border: isOn ? '1px solid var(--accent)' : '1px solid var(--border-2)',
            borderRadius: 999, font: '500 12px var(--font-sans)', cursor: 'pointer',
            transition: 'all 140ms var(--ease-out)',
          }}>
            <span style={{
              width: 8, height: 8, borderRadius: 999,
              background: categoryColors[k] || 'var(--accent)',
            }} />
            <span>{k}</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: isOn ? 'var(--accent-press)' : 'var(--fg-3)' }}>
              {fmtNb(n)}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function KostraRing({ score }) {
  const r = 26, c = 2 * Math.PI * r;
  const off = c - (score / 100) * c;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <svg width="64" height="64" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r={r} fill="none" stroke="var(--surface-3)" strokeWidth="6" />
        <circle cx="32" cy="32" r={r} fill="none" stroke="var(--accent)" strokeWidth="6"
          strokeDasharray={c} strokeDashoffset={off}
          transform="rotate(-90 32 32)" strokeLinecap="round" />
        <text x="32" y="37" textAnchor="middle"
          style={{ fontFamily: 'var(--font-sans)', fontVariantNumeric: 'tabular-nums' }}
          fontSize="16" fontWeight="600" fill="var(--fg-1)">{score}</text>
      </svg>
      <div style={{ minWidth: 0 }}>
        <div className="label">KOSTRA-score</div>
        <div style={{ fontSize: 12, color: 'var(--fg-2)', marginTop: 2 }}>
          Kommunale tjenester &amp; nøkkeltall
        </div>
      </div>
    </div>
  );
}

// Density-step swatch chip — shows where this area falls on the choropleth.
function DensityChip({ step, label }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      padding: '4px 10px 4px 6px',
      background: 'var(--surface-2)', borderRadius: 999,
      border: '1px solid var(--border-1)',
    }}>
      <span style={{
        display: 'inline-flex', gap: 1, padding: 2,
        background: 'var(--surface-1)', borderRadius: 999,
      }}>
        {[1,2,3,4,5,6,7].map(i => (
          <span key={i} style={{
            width: 6, height: 10, borderRadius: 1,
            background: `var(--choro-${i})`,
            opacity: i === step ? 1 : 0.35,
            transform: i === step ? 'scaleY(1.15)' : 'none',
          }} />
        ))}
      </span>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-2)', letterSpacing: '0.04em' }}>
        {label}
      </span>
    </div>
  );
}

function DataPanel({ data, onClose, onDrillKommune, level }) {
  if (!data) return null;
  const k = data;
  const maxOrigin = Math.max(...(k.origins || [{n:1}]).map(o => o.n));
  const maxIncome = Math.max(...(k.income || [{pct:1}]).map(o => o.pct));

  // Determine choropleth step for this area (1..7) for the density chip.
  const densityStep = (() => {
    const breaks = [0, 50, 200, 600, 1500, 3000, 6000];
    for (let i = breaks.length - 1; i >= 0; i--) if (k.density >= breaks[i]) return i + 1;
    return 1;
  })();

  return (
    <aside style={{
      width: 400, height: '100%',
      background: 'var(--surface-1)',
      borderLeft: '1px solid var(--border-1)',
      boxShadow: 'var(--shadow-3)',
      overflowY: 'auto',
      animation: 'panelIn 360ms var(--ease-out)',
    }}>
      <style>{`
        @keyframes panelIn { from { transform: translateX(40px); opacity: 0; } }
        .nb-section + .nb-section { border-top: 1px solid var(--border-1); padding-top: 20px; }
      `}</style>

      <header style={{
        padding: '20px 20px 16px',
        position: 'sticky', top: 0, background: 'var(--surface-1)', zIndex: 1,
        borderBottom: '1px solid var(--border-1)',
      }}>
        <div style={{
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12,
        }}>
          <div style={{ minWidth: 0 }}>
            <div className="eyebrow">{level === 'fylke' ? 'Fylke' : 'Kommune'}</div>
            <h1 className="h1" style={{ marginTop: 4, letterSpacing: '-0.015em' }}>{k.name}</h1>
            {k.fylke && (
              <div style={{ fontSize: 12, color: 'var(--fg-3)', marginTop: 4 }}>
                i {k.fylke}
              </div>
            )}
          </div>
          <button onClick={onClose} aria-label="Lukk" style={{
            width: 32, height: 32, border: 0, borderRadius: 6, background: 'transparent',
            color: 'var(--fg-2)', cursor: 'pointer', flexShrink: 0,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--surface-2)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
            <Icon.X />
          </button>
        </div>
        <div style={{ marginTop: 12 }}>
          <DensityChip step={densityStep} label={`TETTHET · STEG ${densityStep}/7`} />
        </div>
      </header>

      <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* Hero stat — population spans full width */}
        <StatCard
          size="lg"
          label="Innbyggere"
          value={fmtNb(k.population)}
          trend={k.popTrend ? { dir: k.popTrend > 0 ? 'up' : 'down', text: `${k.popTrend > 0 ? '+' : ''}${k.popTrend}\u202f%  siste år` } : null}
          suffix={k.popTrend ? '· SSB 2024' : null}
        />

        {/* Secondary stats — 2-up grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <StatCard label="Tetthet"
            value={fmtNb(k.density)} suffix="innb./km²" />
          <StatCard label="Boligtetthet" value={k.housing || '—'} />
          {k.medianIncome && (
            <StatCard label="Medianinntekt"
              value={fmtNb(k.medianIncome)}
              trend={k.incomeTrend ? { dir: k.incomeTrend > 0 ? 'up' : 'down', text: `${k.incomeTrend > 0 ? '+' : ''}${k.incomeTrend}\u202f% vs. land` } : null} />
          )}
          {k.kostra && (
            <div style={{
              background: 'var(--surface-1)', border: '1px solid var(--border-1)',
              borderRadius: 8, padding: '12px',
              display: 'flex', alignItems: 'center',
            }}>
              <KostraRing score={k.kostra} />
            </div>
          )}
        </div>

        {k.ageBands && (
          <section className="nb-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
              <h3 className="h3">Aldersfordeling</h3>
              <span className="data-label">{k.name} · 2024</span>
            </div>
            <AgePyramid bands={k.ageBands} />
          </section>
        )}

        {k.origins && (
          <section className="nb-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
              <h3 className="h3">Topp opphavsland</h3>
              <span className="data-label">innvandrere</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {k.origins.map(o => <BarRow key={o.country} label={o.country} value={o.n} max={maxOrigin} accent="var(--viz-1)" />)}
            </div>
          </section>
        )}

        {k.income && (
          <section className="nb-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
              <h3 className="h3">Inntektsfordeling</h3>
              <span className="data-label">husholdninger</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {k.income.map(b => <BarRow key={b.band} label={b.band} value={b.pct} max={maxIncome} suffix=" %" accent="var(--viz-2)" />)}
            </div>
          </section>
        )}

        {k.poi && (
          <section className="nb-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
              <h3 className="h3">POI i området</h3>
              <span className="data-label">trykk for å filtrere</span>
            </div>
            <PoiChips poi={k.poi} />
          </section>
        )}

        {/* Kommune list (only at fylke level) */}
        {level === 'fylke' && k.kommunerList && (
          <section className="nb-section">
            <h3 className="h3" style={{ marginBottom: 12 }}>Kommuner i {k.name}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', borderTop: '1px solid var(--border-1)' }}>
              {k.kommunerList.map(name => (
                <button key={name} onClick={() => onDrillKommune(name)}
                  style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '12px 4px', border: 0, borderBottom: '1px solid var(--border-1)',
                    background: 'transparent', cursor: 'pointer', textAlign: 'left',
                    font: '14px var(--font-sans)', color: 'var(--fg-1)',
                    transition: 'background 140ms',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--surface-2)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                  <span>{name}</span>
                  <span style={{ color: 'var(--fg-3)', fontSize: 16 }}>›</span>
                </button>
              ))}
            </div>
          </section>
        )}
      </div>
    </aside>
  );
}

Object.assign(window, { DataPanel, StatCard, AgePyramid, BarRow, PoiChips, KostraRing, DensityChip });
