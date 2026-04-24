import type { DailyReward, SeasonProgress, VictoryChest } from '@/types';
import { uiSprite } from './sprites';

/** Season banner at the top of the Home screen. */
export const seasonProgress: SeasonProgress = {
  seasonNumber: 2,
  current: 120,
  max: 200,
  questsLabel: 'Missioni',
};

/** "Baule della vittoria" card. */
export const victoryChest: VictoryChest = {
  title: 'Baule della vittoria',
  subtitle: 'Pronto da aprire!',
  ctaLabel: 'APRI',
  ready: true,
  sprite: uiSprite('chest-victory', 'VC'),
};

/**
 * Daily login rewards — Giorno 1..5.
 * Day 1 & 2 are claimed (checkmark), Day 3 is today (highlighted),
 * Day 4 & 5 are upcoming.
 */
export const dailyRewards: readonly DailyReward[] = [
  { day: 1, status: 'claimed', kind: 'item' },
  { day: 2, status: 'claimed', kind: 'item' },
  { day: 3, status: 'today', kind: 'gem', amount: 20 },
  { day: 4, status: 'upcoming', kind: 'gold', amount: 500 },
  { day: 5, status: 'upcoming', kind: 'chest' },
];
