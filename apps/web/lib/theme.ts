import type { Theme } from '@nabodata/types';

const STORAGE_KEY = 'nabodata-theme';

export function applyTheme(theme: Theme): void {
  document.documentElement.dataset['theme'] = theme;
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // localStorage may be unavailable in certain contexts
  }
}

export function readStoredTheme(): Theme | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark' || stored === 'color') {
      return stored;
    }
  } catch {
    // ignore
  }
  return null;
}
