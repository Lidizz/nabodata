'use client';

import { useMapStore } from '@nabodata/store';
import { applyTheme } from '../../lib/theme';
import type { Theme } from '@nabodata/types';

const THEMES: { value: Theme; labelNb: string }[] = [
  { value: 'light', labelNb: 'Lyst' },
  { value: 'dark', labelNb: 'Mørkt' },
  { value: 'color', labelNb: 'Farge' },
];

export function ThemeSwitcher() {
  const { activeTheme, setTheme } = useMapStore();

  function handleSelect(theme: Theme) {
    setTheme(theme);
    applyTheme(theme);
  }

  return (
    <div
      className="flex overflow-hidden rounded-3 shadow-2"
      style={{
        background: 'rgba(var(--surface-1-rgb, 255,255,255), 0.92)',
        backdropFilter: 'blur(12px)',
        border: '1px solid var(--border-1)',
      }}
    >
      {THEMES.map(({ value, labelNb }) => (
        <button
          key={value}
          onClick={() => handleSelect(value)}
          className="px-3 py-1.5 text-label font-medium transition-colors duration-fast"
          style={{
            background: activeTheme === value ? 'var(--accent)' : 'transparent',
            color: activeTheme === value ? 'var(--fg-on-accent)' : 'var(--fg-2)',
          }}
          aria-pressed={activeTheme === value}
        >
          {labelNb}
        </button>
      ))}
    </div>
  );
}
