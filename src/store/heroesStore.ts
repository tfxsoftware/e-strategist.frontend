import { create } from 'zustand';
import api from '@/services/api';
import type { Hero } from '@/types/hero';

interface HeroesState {
  heroes: Hero[];
  loaded: boolean;
  fetchHeroes: () => Promise<void>;
  getHeroById: (id: string) => Hero | undefined;
}

export const useHeroesStore = create<HeroesState>((set, get) => ({
  heroes: [],
  loaded: false,

  fetchHeroes: async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) return;
    try {
      const list = await api.get('/heroes');
      set({ heroes: Array.isArray(list) ? list : [], loaded: true });
    } catch {
      set({ loaded: true });
    }
  },

  getHeroById: (id: string) => get().heroes.find((h) => h.id === id),
}));
