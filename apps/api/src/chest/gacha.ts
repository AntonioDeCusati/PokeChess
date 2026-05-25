import type { CreatureRarity, ChestTier } from '@prisma/client';

/**
 * Gacha probability tables per chest tier.
 *
 * Each tier defines the base % chance for each rarity.
 * The pity system increases the odds of rare+ drops after
 * consecutive misses — identical to how top gacha games work.
 */

interface RarityWeights {
  common: number;
  rare: number;
  epic: number;
  legendary: number;
}

const BASE_RATES: Record<ChestTier, RarityWeights> = {
  wood:    { common: 75, rare: 20, epic: 4.5, legendary: 0.5 },
  iron:    { common: 55, rare: 30, epic: 12,  legendary: 3 },
  gold:    { common: 30, rare: 35, epic: 25,  legendary: 10 },
  diamond: { common: 5,  rare: 20, epic: 40,  legendary: 35 },
};

/**
 * Pity thresholds: after N consecutive opens of the same tier
 * without pulling >= the target rarity, guarantee it.
 */
const PITY_THRESHOLDS: Record<ChestTier, { epic: number; legendary: number }> = {
  wood:    { epic: 30, legendary: 100 },
  iron:    { epic: 20, legendary: 60 },
  gold:    { epic: 10, legendary: 30 },
  diamond: { epic: 5,  legendary: 15 },
};

/**
 * Bonus multiplier applied to rare+ rates for every consecutive miss.
 * e.g. after 5 misses at iron tier, legendary chance becomes
 * 3% * (1 + 5 * 0.15) = 3% * 1.75 = 5.25%.
 */
const PITY_BONUS_PER_MISS = 0.15;

export interface GachaResult {
  rarity: CreatureRarity;
  wasPity: boolean;
}

/**
 * Roll a rarity from the gacha table, accounting for pity.
 *
 * @param tier          Which chest tier is being opened.
 * @param missStreak    Number of consecutive opens (same tier) since
 *                      the last epic+ pull (0 = no streak).
 */
export function rollRarity(tier: ChestTier, missStreak: number): GachaResult {
  const pity = PITY_THRESHOLDS[tier];

  if (missStreak >= pity.legendary) {
    return { rarity: 'legendary', wasPity: true };
  }
  if (missStreak >= pity.epic) {
    return { rarity: 'epic', wasPity: true };
  }

  const base = { ...BASE_RATES[tier] };

  const boost = 1 + missStreak * PITY_BONUS_PER_MISS;
  base.legendary *= boost;
  base.epic *= boost;
  base.rare *= 1 + missStreak * (PITY_BONUS_PER_MISS * 0.5);

  const total = base.common + base.rare + base.epic + base.legendary;
  const roll = Math.random() * total;

  let acc = 0;
  acc += base.legendary;
  if (roll < acc) return { rarity: 'legendary', wasPity: false };
  acc += base.epic;
  if (roll < acc) return { rarity: 'epic', wasPity: false };
  acc += base.rare;
  if (roll < acc) return { rarity: 'rare', wasPity: false };

  return { rarity: 'common', wasPity: false };
}

/**
 * Given a rarity, checks if it resets the pity miss streak
 * (any epic or legendary pull resets it).
 */
export function resetsPity(rarity: CreatureRarity): boolean {
  return rarity === 'epic' || rarity === 'legendary';
}
