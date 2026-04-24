import type { PlayerId, SpriteRef } from './common';
import type { CurrencyWallet } from './currency';

/** EXP progression shown in the header. */
export interface ExperienceBar {
  current: number;
  max: number;
  /** Player level (shown as "Livello N"). */
  level: number;
}

/**
 * Top-level player profile used by the global header and by the
 * Home screen statistics block.
 */
export interface PlayerProfile {
  id: PlayerId;
  username: string;
  avatar: SpriteRef;
  experience: ExperienceBar;
  wallet: CurrencyWallet;
}

/** Stats block shown at the bottom of the Home screen. */
export interface PlayerStats {
  trophies: number;
  /** Trophies earned this week/season (e.g. "+45"). */
  trophiesDelta?: number;
  victories: number;
  /** Percentile ranking text (e.g. "Top 12%"). */
  topPercent?: string;
}
