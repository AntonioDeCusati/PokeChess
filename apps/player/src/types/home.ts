import type { SpriteRef } from './common';

/**
 * Daily reward strip on the Home screen (Giorno 1..5).
 * Each day can be claimed, today, or upcoming; today shows a highlight ring.
 */
export type DailyRewardStatus = 'claimed' | 'today' | 'upcoming';

export type DailyRewardKind = 'gold' | 'gem' | 'chest' | 'item';

export interface DailyReward {
  /** 1-based day index (matches "Giorno N" labels). */
  day: number;
  status: DailyRewardStatus;
  kind: DailyRewardKind;
  amount?: number;
  sprite?: SpriteRef;
}

/** "Baule della vittoria" card on Home. */
export interface VictoryChest {
  title: string;
  subtitle: string;
  ctaLabel: string;
  ready: boolean;
  sprite: SpriteRef;
}
