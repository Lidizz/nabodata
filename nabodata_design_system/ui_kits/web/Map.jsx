// Stylized Norway map — abstract placeholder for real vector tiles.
// 12 fylker as polygon approximations with choropleth fills.

const FYLKER = [
  { id: 'finnmark',  name: 'Finnmark',  density: 0,
    points: '460,40 760,60 770,200 600,250 460,200 430,120' },
  { id: 'troms',     name: 'Troms',     density: 1,
    points: '320,180 460,200 540,260 480,330 360,310 290,250' },
  { id: 'nordland',  name: 'Nordland',  density: 1,
    points: '230,290 360,310 460,360 410,500 290,520 200,440 180,380' },
  { id: 'trondelag', name: 'Trøndelag', density: 2,
    points: '290,520 460,520 540,580 480,640 340,640 280,600' },
  { id: 'more',      name: 'Møre',      density: 2,
    points: '200,640 340,640 360,720 240,750 180,720' },
  { id: 'innlandet', name: 'Innlandet', density: 1,
    points: '460,580 600,600 620,760 520,800 440,760 420,660' },
  { id: 'vestland',  name: 'Vestland',  density: 3,
    points: '180,720 360,720 380,820 280,880 180,830 140,790' },
  { id: 'rogaland',  name: 'Rogaland',  density: 3,
    points: '180,830 320,860 320,940 220,950 170,910' },
  { id: 'agder',     name: 'Agder',     density: 2,
    points: '320,860 440,840 460,940 340,960 320,940' },
  { id: 'vestfold',  name: 'Vestfold',  density: 4,
    points: '460,820 560,820 570,910 470,920' },
  { id: 'akershus',  name: 'Akershus',  density: 5,
    points: '440,720 600,710 600,820 460,820 440,800' },
  { id: 'oslo',      name: 'Oslo',      density: 7,
    points: '498,778 528,778 530,800 500,800' },
];

// Map a density score (0..7) to a choropleth step (1..7) via CSS var.
const choroFor = (d) => `var(--choro-${Math.max(1, Math.min(7, Math.round(d * 1.0) + 1))})`;

// Cities — labels show on map, drawn at zoom-level. (Static here.)
const CITIES = [
  { name: 'Oslo',       x: 514, y: 790 },
  { name: 'Bergen',     x: 220, y: 790 },
  { name: 'Trondheim',  x: 410, y: 580 },
  { name: 'Stavanger',  x: 220, y: 900 },
  { name: 'Tromsø',     x: 420, y: 250 },
];

function NabodataMap({ selectedId, onSelect, theme }) {
  return (
    <svg
      viewBox="0 0 800 1000"
      preserveAspectRatio="xMidYMid meet"
      style={{ width: '100%', height: '100%', display: 'block' }}
      aria-label="Map of Norway"
    >
      {/* Sea / canvas */}
      <rect width="800" height="1000" fill={
        theme === 'dark' ? '#0B0F14'
        : theme === 'color' ? '#D8E4EA'
        : '#EAF0F4'
      } />

      {/* Subtle latitude lines (cartographic flavor) */}
      <g stroke={theme === 'dark' ? '#181E27' : 'rgba(15,23,35,0.05)'} strokeWidth="1">
        {[150, 350, 550, 750, 900].map(y =>
          <line key={y} x1="0" x2="800" y1={y} y2={y} />
        )}
      </g>

      {/* Fylker */}
      <g>
        {FYLKER.map(f => {
          const isSelected = selectedId === f.id;
          return (
            <polygon
              key={f.id}
              points={f.points}
              fill={choroFor(f.density)}
              stroke={isSelected
                ? 'var(--accent)'
                : (theme === 'dark' ? '#0B0F14' : '#FFFFFF')}
              strokeWidth={isSelected ? 2.5 : 1}
              style={{
                cursor: 'pointer',
                transition: 'opacity 200ms var(--ease-out), stroke 200ms',
                opacity: !selectedId || isSelected ? 1 : 0.85,
              }}
              onClick={() => onSelect(f)}
              onMouseEnter={(e) => {
                if (!isSelected) e.currentTarget.setAttribute('stroke', 'var(--accent)');
              }}
              onMouseLeave={(e) => {
                if (!isSelected) e.currentTarget.setAttribute(
                  'stroke',
                  theme === 'dark' ? '#0B0F14' : '#FFFFFF'
                );
              }}
            >
              <title>{f.name}</title>
            </polygon>
          );
        })}
      </g>

      {/* City dots */}
      <g style={{ fontFamily: 'var(--font-sans)' }} fontSize="13" fontWeight="500">
        {CITIES.map(c => (
          <g key={c.name}>
            <circle cx={c.x} cy={c.y} r="3.5"
              fill={theme === 'dark' ? '#ECEFF4' : '#FFFFFF'}
              stroke={theme === 'dark' ? '#0B0F14' : '#0F1723'}
              strokeWidth="1.25" />
            <text x={c.x + 8} y={c.y + 4}
              fill={theme === 'dark' ? '#ECEFF4' : '#0F1723'}
              style={{ paintOrder: 'stroke', stroke: theme === 'dark' ? '#0B0F14' : '#FFFFFF', strokeWidth: 3, strokeLinejoin: 'round' }}>
              {c.name}
            </text>
          </g>
        ))}
      </g>

      {/* Disclaimer */}
      <text x="780" y="990" textAnchor="end"
        style={{ fontFamily: 'var(--font-mono)' }} fontSize="9"
        fill={theme === 'dark' ? '#5B6571' : '#9AA3B2'}>
        © Nabodata · stylized · placeholder geometry
      </text>
    </svg>
  );
}

window.NabodataMap = NabodataMap;
window.NABO_FYLKER = FYLKER;
