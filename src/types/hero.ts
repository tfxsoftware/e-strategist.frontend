export interface Hero {
  id: string;
  name: string;
  pictureUrl: string;
  archetype: string;
  primaryRole: string;
  primaryTier: string;
  secondaryRole: string | null;
  secondaryTier: string | null;
}
