export interface Event {
  id: string;
  name: string;
  description: string;
  imageUrl: string | null;
  location: string | null;
  region: string;
  opensAt: string;
  startsAt: string;
  finishesAt: string | null;
  type: string;
  status: string;
  tier: string;
  entryFee: number;
  totalPrizePool: number;
  rankPrizes: Record<string, number>;
  gamesPerBlock: number;
  minutesBetweenGames: number;
  minutesBetweenBlocks: number;
}

export interface EventsPageable {
  offset: number;
  pageNumber: number;
  pageSize: number;
  paged: boolean;
  sort: { empty: boolean; sorted: boolean; unsorted: boolean };
  unpaged: boolean;
}

export interface EventsSort {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
}

export interface EventsResponse {
  content: Event[];
  empty: boolean;
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  pageable: EventsPageable;
  size: number;
  sort: EventsSort;
  totalElements: number;
  totalPages: number;
}

export interface EventsQueryParams {
  page?: number;
  size?: number;
  sort?: string;
  region?: string;
  status?: string;
  tier?: string;
  type?: string;
}

export interface EventRoster {
  name: string;
  ownerName: string;
  cohesion: number;
  morale: number;
  position: number | null;
  wins: number | null;
  losses: number | null;
}
