export interface HeroMasteryEntry {
  level: number;
  experience: number;
}

export interface RoleMasteryEntry {
  level: number;
  experience: number;
}

/** Full player/rookie details from API (discover or GET by id) */
export interface PlayerDetails {
  id: string;
  nickname: string;
  pictureUrl: string;
  condition: string;
  traits: string[];
  salary: number;
  nextSalaryPaymentDate: string | null;
  star: boolean;
  rosterId: string | null;
  heroMastery: Record<string, HeroMasteryEntry>;
  roleMasteries: Record<string, RoleMasteryEntry>;
}

export type DiscoveredRookie = PlayerDetails;
