export interface Profile {
  username: string;
  region: string;
  balance: number;
  organizationImageUrl: string | null;
}

export interface Roster {
  id: string;
  name: string;
  energy: number;
  morale: number;
  cohesion: number;
  activity: string;
}

export interface Player {
  id: string;
  nickname: string;
  pictureUrl: string;
  rosterName: string;
  condition: string;
  traits: string[];
  salary: number;
  nextSalaryPaymentDate: string | null;
  isStar: boolean;
}

export interface NextMatch {
  // Define fields if known, or leave as any for now
  id: string;
  opponentName: string;
  scheduledAt: string;
}

export interface DashboardResponse {
  profile: Profile;
  rosters: Roster[];
  players: Player[];
  nextMatch: NextMatch | null;
}
