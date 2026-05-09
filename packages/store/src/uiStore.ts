import { create } from 'zustand';
import type { Locale } from '@nabodata/types';

interface UiState {
  panelOpen: boolean;
  searchQuery: string;
  locale: Locale;
  setPanelOpen: (open: boolean) => void;
  setSearchQuery: (query: string) => void;
  setLocale: (locale: Locale) => void;
}

export const useUiStore = create<UiState>()((set) => ({
  panelOpen: false,
  searchQuery: '',
  locale: 'nb',
  setPanelOpen: (open) => set({ panelOpen: open }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setLocale: (locale) => set({ locale }),
}));
