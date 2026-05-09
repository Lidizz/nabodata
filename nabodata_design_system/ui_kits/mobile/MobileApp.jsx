// Mobile App — Nabodata RN-feel inside iOS frame.

const { useState, useEffect } = React;

// Reuse Map component (loaded by index.html before this script).
function MobileApp() {
  const [theme, setTheme] = useState('light');
  const [selectedFylke, setSelectedFylke] = useState(null);
  const [selectedKommune, setSelectedKommune] = useState(null);
  const [snap, setSnap] = useState('peek'); // peek | half | full

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const trail = [{ label: 'Norge' }];
  if (selectedFylke) trail.push({ label: selectedFylke.name });
  if (selectedKommune) trail.push({ label: selectedKommune });

  let panelData = null, level = null;
  if (selectedKommune && window.NABO_DATA.kommuner[selectedKommune]) {
    panelData = { name: selectedKommune, ...window.NABO_DATA.kommuner[selectedKommune] };
    level = 'kommune';
  } else if (selectedFylke) {
    const f = window.NABO_DATA.fylker.find(f => f.id === selectedFylke.id);
    panelData = {
      name: f.name,
      population: f.kommuner.length * 80000 + 120000,
      density: [0,5,17,80,250,800,2000,7000][f.density] || 0,
      housing: f.density >= 5 ? 'Tett' : f.density >= 3 ? 'Middels' : 'Spredt',
      kommunerList: f.kommuner,
    };
    level = 'fylke';
  }

  const sheetOpen = !!panelData;
  const sheetHeights = { peek: 88, half: '52%', full: 'calc(100% - 56px)' };
  const sheetHeight = sheetOpen ? sheetHeights[snap] : 0;
  const cycleSnap = () => setSnap(s => s === 'peek' ? 'half' : s === 'half' ? 'full' : 'peek');

  return (
    <div style={{
      width: '100%', height: '100%', position: 'relative', overflow: 'hidden',
      background: theme === 'dark' ? '#0B0F14' : theme === 'color' ? '#F2EEE3' : '#F7F8FA',
      fontFamily: 'var(--font-sans)',
    }}>
      {/* Map */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <NabodataMap
          theme={theme}
          selectedId={selectedFylke?.id}
          onSelect={(f) => { setSelectedFylke(f); setSelectedKommune(null); setSnap('half'); }}
        />
      </div>

      {/* Top chrome — search pill + theme switcher */}
      <div style={{
        position: 'absolute', top: 12, left: 12, right: 12, zIndex: 10,
        display: 'flex', gap: 8, alignItems: 'center',
      }}>
        <div style={{
          flex: 1, display: 'flex', alignItems: 'center', height: 40, padding: '0 12px', gap: 8,
          background: 'rgba(255,255,255,0.94)', backdropFilter: 'blur(12px)',
          border: '1px solid var(--border-1)', borderRadius: 999, boxShadow: 'var(--shadow-2)',
          color: 'var(--fg-3)', fontSize: 13,
        }}>
          <Icon.Search size={16} />
          <span>Søk område…</span>
        </div>
        <ThemeSwitcher theme={theme} onChange={setTheme} />
      </div>

      {/* Breadcrumb (when drilled) */}
      {selectedFylke && (
        <div style={{ position: 'absolute', top: 60, left: 12, zIndex: 10 }}>
          <Breadcrumb trail={trail} onNav={(i) => {
            if (i === 0) { setSelectedFylke(null); setSelectedKommune(null); setSnap('peek'); }
            else if (i === 1) setSelectedKommune(null);
          }} />
        </div>
      )}

      {/* Bottom sheet */}
      <aside style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        height: sheetHeight,
        background: 'var(--surface-1)',
        borderTopLeftRadius: 16, borderTopRightRadius: 16,
        boxShadow: 'var(--shadow-panel)',
        transition: 'height 320ms var(--ease-out)',
        overflow: 'hidden', display: 'flex', flexDirection: 'column',
        zIndex: 30,
      }}>
        {sheetOpen && (
          <>
            <button onClick={cycleSnap} aria-label="Bytt høyde" style={{
              padding: '8px 0 0', border: 0, background: 'transparent', cursor: 'pointer',
            }}>
              <div style={{ width: 36, height: 4, background: 'var(--border-strong)', borderRadius: 2, margin: '0 auto' }} />
            </button>

            {/* Compact peek summary */}
            {snap === 'peek' ? (
              <div style={{
                padding: '8px 16px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <div>
                  <div className="eyebrow" style={{ fontSize: 10 }}>{level === 'fylke' ? 'Fylke' : 'Kommune'}</div>
                  <div style={{ fontWeight: 600, fontSize: 16 }}>{panelData.name}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="data-label">Innbyggere</div>
                  <div className="tabular" style={{ fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 500 }}>
                    {panelData.population.toLocaleString('nb-NO').replace(/,/g, ' ')}
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ overflowY: 'auto', padding: '4px 16px 32px', display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div>
                  <div className="eyebrow" style={{ fontSize: 10 }}>{level === 'fylke' ? 'Fylke' : 'Kommune'}</div>
                  <h1 className="h1" style={{ marginTop: 4 }}>{panelData.name}</h1>
                  {panelData.fylke && <div style={{ fontSize: 12, color: 'var(--fg-3)', marginTop: 2 }}>i {panelData.fylke}</div>}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <StatCard label="Innbyggere"
                    value={panelData.population.toLocaleString('nb-NO').replace(/,/g, ' ')}
                    trend={panelData.popTrend ? { dir: panelData.popTrend > 0 ? 'up' : 'down', text: `${panelData.popTrend > 0 ? '+' : ''}${panelData.popTrend} %` } : null} />
                  <StatCard label="Tetthet"
                    value={panelData.density.toLocaleString('nb-NO')} suffix="innb./km²" />
                </div>

                {panelData.ageBands && (
                  <section>
                    <h3 className="h3" style={{ marginBottom: 6 }}>Aldersfordeling</h3>
                    <AgePyramid bands={panelData.ageBands} />
                  </section>
                )}

                {panelData.origins && (
                  <section>
                    <h3 className="h3" style={{ marginBottom: 8 }}>Topp opphavsland</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {panelData.origins.slice(0, 5).map(o => {
                        const max = Math.max(...panelData.origins.map(x => x.n));
                        return <BarRow key={o.country} label={o.country} value={o.n} max={max} />;
                      })}
                    </div>
                  </section>
                )}

                {panelData.poi && (
                  <section>
                    <h3 className="h3" style={{ marginBottom: 8 }}>POI</h3>
                    <PoiChips poi={panelData.poi} />
                  </section>
                )}

                {level === 'fylke' && panelData.kommunerList && (
                  <section>
                    <h3 className="h3" style={{ marginBottom: 8 }}>Kommuner</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', borderTop: '1px solid var(--border-1)' }}>
                      {panelData.kommunerList.map(name => (
                        <button key={name} onClick={() => { setSelectedKommune(name); setSnap('half'); }}
                          style={{
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            padding: '10px 4px', border: 0, borderBottom: '1px solid var(--border-1)',
                            background: 'transparent', cursor: 'pointer', textAlign: 'left',
                            font: '14px var(--font-sans)', color: 'var(--fg-1)',
                          }}>
                          <span>{name}</span>
                          <span style={{ color: 'var(--fg-3)' }}>›</span>
                        </button>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            )}
          </>
        )}
      </aside>
    </div>
  );
}

function MobileRoot() {
  return (
    <IOSDevice width={390} height={780}>
      <MobileApp />
    </IOSDevice>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<MobileRoot />);
