import api from './api';
import { DashboardResponse, Roster } from '@/types/dashboard';

interface UpdateRosterPayload {
  addPlayerIds: string[];
  removePlayerIds: string[];
}

export const dashboardService = {
  getDashboardData: async (): Promise<DashboardResponse> => {
    return await api.get('/dashboard');
  },
  updateRoster: async (rosterId: string, payload: UpdateRosterPayload): Promise<Roster> => {
    return await api.put(`/rosters/${rosterId}`, payload);
  },
  createRoster: async (name: string, region: string): Promise<Roster> => {
    return await api.post('/rosters', { name, region });
  },
  deleteRoster: async (rosterId: string): Promise<void> => {
    await api.delete(`/rosters/${rosterId}`);
  },
};
