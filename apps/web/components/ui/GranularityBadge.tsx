type Granularity = 'fylke' | 'kommune' | 'grunnkrets';

interface GranularityBadgeProps {
  level: Granularity;
}

const LABELS: Record<Granularity, string> = {
  fylke: 'Fylke',
  kommune: 'Kommune',
  grunnkrets: 'Grunnkrets',
};

export function GranularityBadge({ level }: GranularityBadgeProps) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '2px 8px',
        borderRadius: 'var(--r-pill)',
        background: 'var(--accent-soft)',
        color: 'var(--accent)',
        fontSize: 'var(--fs-micro)',
        fontWeight: 600,
        letterSpacing: 'var(--tr-eyebrow)',
        textTransform: 'uppercase',
      }}
    >
      {LABELS[level]}
    </span>
  );
}
