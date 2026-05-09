import type { AgeDistribution } from '@nabodata/types';

interface AgePyramidProps {
  data: AgeDistribution;
  label?: string;
}

const VIEWBOX_W = 660;
const VIEWBOX_H = 200;
const BAR_HEIGHT = 16;
const BAR_GAP = 5;
const AXIS_X = VIEWBOX_W / 2;
const MAX_BAR_W = 270;
const LABEL_W = 36;
const Y_START = 14;

export function AgePyramid({ data, label }: AgePyramidProps) {
  const maxCount = Math.max(...data.bands.flatMap((b) => [b.male, b.female]));

  function barWidth(count: number): number {
    return (count / maxCount) * MAX_BAR_W;
  }

  return (
    <div>
      {label && (
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
          {label}
        </div>
      )}
      <svg
        viewBox={`0 0 ${VIEWBOX_W} ${VIEWBOX_H}`}
        aria-label="Aldersfordeling"
        role="img"
        style={{ width: '100%', height: 'auto' }}
      >
        {/* Axis line */}
        <line
          x1={AXIS_X}
          y1={0}
          x2={AXIS_X}
          y2={VIEWBOX_H}
          stroke="var(--border-1)"
          strokeWidth={1}
        />

        {data.bands.map((band, i) => {
          const y = Y_START + i * (BAR_HEIGHT + BAR_GAP);
          const maleW = barWidth(band.male);
          const femaleW = barWidth(band.female);

          return (
            <g key={band.label}>
              {/* Male bar (left) */}
              <rect
                x={AXIS_X - maleW}
                y={y}
                width={maleW}
                height={BAR_HEIGHT}
                fill="var(--viz-4)"
                rx={1}
              />
              {/* Female bar (right) */}
              <rect
                x={AXIS_X}
                y={y}
                width={femaleW}
                height={BAR_HEIGHT}
                fill="var(--viz-1)"
                rx={1}
              />
              {/* Age band label */}
              <text
                x={AXIS_X - LABEL_W / 2}
                y={y + BAR_HEIGHT / 2 + 1}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="var(--fg-3)"
                fontFamily="var(--font-mono)"
                fontSize={9}
              >
                {band.label}
              </text>
            </g>
          );
        })}

        {/* Legend */}
        <text
          x={AXIS_X - MAX_BAR_W}
          y={VIEWBOX_H - 2}
          fill="var(--fg-3)"
          fontFamily="var(--font-mono)"
          fontSize={9}
          textAnchor="start"
        >
          Menn
        </text>
        <text
          x={AXIS_X + MAX_BAR_W}
          y={VIEWBOX_H - 2}
          fill="var(--fg-3)"
          fontFamily="var(--font-mono)"
          fontSize={9}
          textAnchor="end"
        >
          Kvinner
        </text>
      </svg>
    </div>
  );
}
