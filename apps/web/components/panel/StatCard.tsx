interface StatCardProps {
  label: string;
  value: number;
  unit?: string;
  trend?: number;
  trendLabel?: string;
  formatValue?: (n: number) => string;
}

function formatNorwegian(n: number): string {
  return n.toLocaleString('nb-NO');
}

export function StatCard({ label, value, unit, trend, trendLabel, formatValue }: StatCardProps) {
  const displayValue = formatValue ? formatValue(value) : formatNorwegian(value);
  const isPositive = trend !== undefined && trend > 0;
  const isNegative = trend !== undefined && trend < 0;

  return (
    <div
      className="rounded-3 p-4 shadow-1"
      style={{ background: 'var(--surface-2)', border: '1px solid var(--border-1)' }}
    >
      <div
        style={{
          fontSize: 'var(--fs-label)',
          color: 'var(--fg-2)',
          fontWeight: 500,
          textTransform: 'uppercase',
          letterSpacing: 'var(--tr-eyebrow)',
          marginBottom: 4,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 'var(--fs-display)',
          fontVariantNumeric: 'tabular-nums',
          color: 'var(--fg-1)',
          lineHeight: 'var(--lh-tight)',
          fontWeight: 600,
        }}
      >
        {displayValue}
        {unit && (
          <span
            style={{
              fontSize: 'var(--fs-h3)',
              color: 'var(--fg-3)',
              fontWeight: 400,
              marginLeft: 6,
            }}
          >
            {unit}
          </span>
        )}
      </div>
      {trend !== undefined && trendLabel && (
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--fs-data)',
            color: isPositive ? 'var(--success)' : isNegative ? 'var(--danger)' : 'var(--fg-3)',
            marginTop: 4,
          }}
        >
          {isPositive ? '▲' : isNegative ? '▼' : '–'}{' '}
          {Math.abs(trend).toLocaleString('nb-NO', { minimumFractionDigits: 1 })} % {trendLabel}
        </div>
      )}
    </div>
  );
}
