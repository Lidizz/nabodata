import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Theme, Fylke, KommuneSummary } from '@nabodata/types';

interface MapState {
  activeTheme: Theme;
  activeFylke: Fylke | null;
  activeKommune: KommuneSummary | null;
  activeKommuneSlug: string | null;
  zoom: number;
  setTheme: (theme: Theme) => void;
  setActiveFylke: (fylke: Fylke | null) => void;
  setActiveKommune: (kommune: KommuneSummary | null) => void;
  setActiveKommuneSlug: (slug: string | null) => void;
  setZoom: (zoom: number) => void;
}

export const useMapStore = create<MapState>()(
  persist(
    (set) => ({
      activeTheme: 'light',
      activeFylke: null,
      activeKommune: null,
      activeKommuneSlug: null,
      zoom: 5,
      setTheme: (theme) => set({ activeTheme: theme }),
      setActiveFylke: (fylke) => set({ activeFylke: fylke, activeKommune: null, activeKommuneSlug: null }),
      setActiveKommune: (kommune) => set({ activeKommune: kommune }),
      setActiveKommuneSlug: (slug) => set({ activeKommuneSlug: slug }),
      setZoom: (zoom) => set({ zoom }),
    }),
    {
      name: 'nabodata-map',
      partialize: (state) => ({ activeTheme: state.activeTheme }),
    },
  ),
);
