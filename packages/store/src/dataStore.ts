import { create } from 'zustand';
import type { Kommune } from '@nabodata/types';

interface DataState {
  kommuneCache: Map<string, Kommune>;
  loadingKommune: Set<string>;
  errors: Map<string, string>;
  setKommune: (slug: string, kommune: Kommune) => void;
  setLoading: (slug: string, loading: boolean) => void;
  setError: (slug: string, error: string) => void;
  clearError: (slug: string) => void;
}

export const useDataStore = create<DataState>()((set) => ({
  kommuneCache: new Map(),
  loadingKommune: new Set(),
  errors: new Map(),

  setKommune: (slug, kommune) =>
    set((state) => {
      const next = new Map(state.kommuneCache);
      next.set(slug, kommune);
      return { kommuneCache: next };
    }),

  setLoading: (slug, loading) =>
    set((state) => {
      const next = new Set(state.loadingKommune);
      loading ? next.add(slug) : next.delete(slug);
      return { loadingKommune: next };
    }),

  setError: (slug, error) =>
    set((state) => {
      const next = new Map(state.errors);
      next.set(slug, error);
      return { errors: next };
    }),

  clearError: (slug) =>
    set((state) => {
      const next = new Map(state.errors);
      next.delete(slug);
      return { errors: next };
    }),
}));
