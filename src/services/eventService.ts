import api from './api';
import type { EventsResponse, EventsQueryParams, EventRoster } from '@/types/event';

function buildQueryString(params: EventsQueryParams): string {
  const searchParams = new URLSearchParams();
  if (params.page != null) searchParams.set('page', String(params.page));
  if (params.size != null) searchParams.set('size', String(params.size));
  if (params.sort) searchParams.set('sort', params.sort);
  if (params.region) searchParams.set('region', params.region);
  if (params.status) searchParams.set('status', params.status);
  if (params.tier) searchParams.set('tier', params.tier);
  if (params.type) searchParams.set('type', params.type);
  const qs = searchParams.toString();
  return qs ? `?${qs}` : '';
}

export const eventService = {
  getEvents: async (params: EventsQueryParams = {}): Promise<EventsResponse> => {
    const query = buildQueryString(params);
    return await api.get(`/events${query}`);
  },
  registerRoster: async (eventId: string, rosterId: string): Promise<void> => {
    return await api.post(`/events/${eventId}/register/roster/${rosterId}`);
  },
  getEventRosters: async (eventId: string): Promise<EventRoster[]> => {
    return await api.get(`/events/${eventId}/rosters`);
  },
};
