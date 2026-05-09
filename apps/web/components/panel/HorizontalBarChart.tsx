interface BarItem {
  label: string;
  value: number;
}

interface HorizontalBarChartProps {
  items: BarItem[];
  title?: string;
  unit?: string;
}

export function HorizontalBarChart({ items, title, unit }: HorizontalBarChartProps) {
  const max = Math.max(...items.map((i) => i.value));

  return (
    <div>
      {title && (
        <div
          style={{
            fontSize: 'var(--fs-label)',
            color: 'var(--fg-2)',
            fontWeight: 500,
            textTransform: 'uppercase',
            letterSpacing: 'var(--tr-eyebrow)',
            marginBottom: 8,
          }}
        >
          {title}
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {items.map((item) => {
          const pct = max > 0 ? (item.value / max) * 100 : 0;
          return (
            <div key={item.label}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: 2,
                  fontSize: 'var(--fs-body-sm)',
                  color: 'var(--fg-2)',
                }}
              >
                <span>{item.label}</span>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 'var(--fs-data)',
                    color: 'var(--fg-3)',
                  }}
                >
                  {item.value.toLocaleString('nb-NO')}
                  {unit ? ` ${unit}` : ''}
                </span>
              </div>
              <div
                style={{
                  height: 6,
                  background: 'var(--surface-3)',
                  borderRadius: 'var(--r-pill)',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${pct}%`,
                    background: 'var(--accent)',
                    borderRadius: 'var(--r-pill)',
                    transition: 'width var(--dur-slow) var(--ease-out)',
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
