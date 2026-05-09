// TopBar — search, breadcrumb, theme switcher, language toggle.

const Icon = {
  Search: (p) => <svg width={p.size||18} height={p.size||18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.35-4.35"/></svg>,
  Sun: (p) => <svg width={p.size||16} height={p.size||16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>,
  Moon: (p) => <svg width={p.size||16} height={p.size||16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>,
  Palette: (p) => <svg width={p.size||16} height={p.size||16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>,
  X: (p) => <svg width={p.size||16} height={p.size||16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>,
};

function ThemeSwitcher({ theme, onChange }) {
  const opts = [
    { id: 'light', label: 'Light', icon: <Icon.Sun /> },
    { id: 'dark',  label: 'Dark',  icon: <Icon.Moon /> },
    { id: 'color', label: 'Color', icon: <Icon.Palette /> },
  ];
  return (
    <div style={{
      display: 'inline-flex', padding: 4,
      background: 'rgba(255,255,255,0.92)',
      border: '1px solid var(--border-1)', borderRadius: 999,
      backdropFilter: 'blur(12px)', boxShadow: 'var(--shadow-2)',
    }} className="theme-switcher">
      {opts.map(o => (
        <button key={o.id}
          aria-pressed={theme === o.id} aria-label={o.label}
          onClick={() => onChange(o.id)}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: 32, height: 32, border: 0, cursor: 'pointer',
            background: theme === o.id ? 'var(--surface-3)' : 'transparent',
            borderRadius: 999,
            color: theme === o.id ? 'var(--fg-1)' : 'var(--fg-3)',
            transition: 'all 120ms var(--ease-out)',
          }}>
          {o.icon}
        </button>
      ))}
    </div>
  );
}

function LangToggle({ lang, onChange }) {
  return (
    <div style={{
      display: 'inline-flex', padding: 2,
      background: 'rgba(242,244,247,0.92)', borderRadius: 4,
      backdropFilter: 'blur(12px)', border: '1px solid var(--border-1)',
      fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 500,
    }}>
      {['NO', 'EN'].map(l => (
        <button key={l} onClick={() => onChange(l)}
          style={{
            padding: '4px 8px', border: 0, borderRadius: 2,
            cursor: 'pointer',
            background: lang === l ? 'var(--surface-1)' : 'transparent',
            boxShadow: lang === l ? 'var(--shadow-1)' : 'none',
            color: lang === l ? 'var(--fg-1)' : 'var(--fg-3)',
          }}>{l}</button>
      ))}
    </div>
  );
}

function SearchBar() {
  const [v, setV] = React.useState('');
  return (
    <div style={{
      position: 'relative', width: 480, maxWidth: '100%',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', height: 44, padding: '0 14px', gap: 10,
        background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(12px)',
        border: '1px solid var(--border-1)', borderRadius: 8,
        boxShadow: 'var(--shadow-2)',
        color: 'var(--fg-3)',
      }}>
        <Icon.Search />
        <input value={v} onChange={(e) => setV(e.target.value)}
          placeholder="Søk fylke, kommune, sted…"
          style={{
            flex: 1, border: 0, background: 'transparent', outline: 'none',
            font: '14px var(--font-sans)', color: 'var(--fg-1)',
          }} />
        <kbd style={{
          padding: '2px 6px', border: '1px solid var(--border-2)', borderRadius: 4,
          font: '500 11px var(--font-mono)', color: 'var(--fg-3)',
          background: 'var(--surface-2)',
        }}>⌘K</kbd>
      </div>
    </div>
  );
}

function Breadcrumb({ trail, onNav }) {
  // trail: [{ label, level }]
  if (!trail || trail.length === 0) return null;
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '6px 10px',
      background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(12px)',
      border: '1px solid var(--border-1)', borderRadius: 999,
      boxShadow: 'var(--shadow-2)',
      fontSize: 13,
    }}>
      {trail.map((t, i) => {
        const isLast = i === trail.length - 1;
        return (
          <React.Fragment key={i}>
            {i > 0 && <span style={{ color: 'var(--fg-4)' }}>›</span>}
            {isLast ? (
              <span style={{ color: 'var(--fg-1)', fontWeight: 500 }}>{t.label}</span>
            ) : (
              <a onClick={() => onNav(i)} style={{ color: 'var(--fg-2)', cursor: 'pointer' }}>{t.label}</a>
            )}
          </React.Fragment>
        );
      })}
      {trail.length > 1 && (
        <span style={{
          marginLeft: 8, padding: '2px 6px', borderRadius: 4,
          background: 'var(--accent-soft)', color: 'var(--accent-press)',
          font: '500 10px var(--font-mono)', letterSpacing: '0.04em', textTransform: 'uppercase',
        }}>
          {trail.length === 2 ? 'Fylke' : 'Kommune'}
        </span>
      )}
    </div>
  );
}

Object.assign(window, { ThemeSwitcher, LangToggle, SearchBar, Breadcrumb, Icon });
