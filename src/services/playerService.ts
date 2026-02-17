import api from './api';
import type { DiscoveredRookie, PlayerDetails } from '@/types/player';

export const playerService = {
  discoverRookie: async (): Promise<DiscoveredRookie> => {
    return await api.post('/players/discover/rookie');
  },
  getPlayer: async (playerId: string): Promise<PlayerDetails> => {
    return await api.get(`/players/${playerId}`);
  },
};
