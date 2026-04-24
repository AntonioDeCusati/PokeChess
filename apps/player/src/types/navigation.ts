/**
 * The 5 top-level routes, matching the bottom navigation order in every mockup.
 */
export type AppRoute = 'shop' | 'board' | 'home' | 'league' | 'friends';

export interface NavTab {
  route: AppRoute;
  /** Localized label shown under the icon (Italian in mockups). */
  label: string;
  /** Icon key — resolved in the UI layer. */
  icon: string;
}

/** Tabs inside the Board screen ("SCACCHIERA" / "COLLEZIONE"). */
export type BoardTab = 'board' | 'collection';
