import { createContext, useContext } from 'react';
import type { Theme } from './tokens.js';

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const ThemeContext = createContext<ThemeContextValue>({
  theme: 'light',
  setTheme: () => undefined,
});

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}
