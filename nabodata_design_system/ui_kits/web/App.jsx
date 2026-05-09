// App — orchestrates state for the Nabodata web kit.

const { useState, useEffect } = React;

function App() {
  const [theme, setTheme] = useState('light');
  const [lang, setLang] = useState('NO');
  const [selectedFylke, setSelectedFylke] = useState(null);
  const [selectedKommune, setSelectedKommune] = useState(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const trail = [{ label: 'Norge' }];
  if (selectedFylke) trail.push({ label: selectedFylke.name });
  if (selectedKommune) trail.push({ label: selectedKommune });

  const handleNav = (i) => {
    if (i === 0) { setSelectedFylke(null); setSelectedKommune(null); }
    else if (i === 1) setSelectedKommune(null);
  };

  // Build panel data
  let panelData = null, level = null;
  if (selectedKommune && window.NABO_DATA.kommuner[selectedKommune]) {
    panelData = { name: selectedKommune, ...window.NABO_DATA.kommuner[selectedKommune] };
    level = 'kommune';
  } else if (selectedFylke) {
    const f = window.NABO_DATA.fylker.find(f => f.id === selectedFylke.id);
    panelData = {
      name: f.name,
      population: f.kommuner.length * 80000 + 120000, // illustrative
      density: [0,5,17,80,250,800,2000,7000][f.density] || 0,
      housing: f.density >= 5 ? 'Tett' : f.density >= 3 ? 'Middels' : 'Spredt',
      kommunerList: f.kommuner,
    };
    level = 'fylke';
  }

  const mapBg = theme === 'dark' ? '#0B0F14' : theme === 'color' ? '#F2EEE3' : '#F7F8FA';

  return (
    <div style={{
      width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden',
      background: mapBg, transition: 'background 200ms',
      fontFamily: 'var(--font-sans)',
    }}>
      {/* Map */}
      <div style={{
        position: 'absolute', inset: 0,
        right: panelData ? 400 : 0,
        transition: 'right 360ms var(--ease-out)',
      }}>
        <NabodataMap
          theme={theme}
          selectedId={selectedFylke?.id}
          onSelect={(f) => { setSelectedFylke(f); setSelectedKommune(null); }}
        />
      </div>

      {/* Top-left: logo */}
      <div style={{ position: 'absolute', top: 16, left: 16, zIndex: 10, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{
          padding: '6px 12px',
          background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(12px)',
          border: '1px solid var(--border-1)', borderRadius: 8,
          boxShadow: 'var(--shadow-2)', color: 'var(--fg-1)',
          display: 'flex', alignItems: 'center',
        }}>
          <img src="../../assets/logo-wordmark.svg" alt="Nabodata" style={{ height: 24 }} />
        </div>
        <Breadcrumb trail={trail} onNav={handleNav} />
      </div>

      {/* Top-center: search */}
      <div style={{
        position: 'absolute', top: 16, left: '50%', transform: 'translateX(-50%)',
        zIndex: 10, transition: 'left 360ms',
      }}>
        <SearchBar />
      </div>

      {/* Top-right: theme + lang */}
      <div style={{
        position: 'absolute', top: 16,
        right: panelData ? 416 : 16, zIndex: 10,
        transition: 'right 360ms var(--ease-out)',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <LangToggle lang={lang} onChange={setLang} />
        <ThemeSwitcher theme={theme} onChange={setTheme} />
      </div>

      {/* Bottom-left: choropleth legend */}
      <div style={{
        position: 'absolute', bottom: 16, left: 16, zIndex: 10,
        padding: 10,
        background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(12px)',
        border: '1px solid var(--border-1)', borderRadius: 8, boxShadow: 'var(--shadow-2)',
      }}>
        <div className="data-label" style={{ marginBottom: 6 }}>Befolkningstetthet · innb./km²</div>
        <div style={{ display: 'flex', height: 8, width: 240, borderRadius: 1, overflow: 'hidden' }}>
          {[1,2,3,4,5,6,7].map(i => (
            <div key={i} style={{ flex: 1, background: `var(--choro-${i})` }} />
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--fg-3)', marginTop: 4 }}>
          <span>0</span><span>50</span><span>200</span><span>600</span><span>1.5k</span><span>3k</span><span>6k+</span>
        </div>
      </div>

      {/* Right: data panel */}
      <div style={{
        position: 'absolute', top: 0, right: 0, height: '100%',
        zIndex: 20,
      }}>
        {panelData && (
          <DataPanel
            data={panelData} level={level}
            onClose={() => { setSelectedFylke(null); setSelectedKommune(null); }}
            onDrillKommune={(name) => setSelectedKommune(name)}
          />
        )}
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
