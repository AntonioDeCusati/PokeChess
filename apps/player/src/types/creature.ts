import type { CreatureId, CreatureType, SpriteRef } from './common';

/** Rarity tier used to tint the creature card frame. */
export type CreatureRarity = 'common' | 'rare' | 'epic' | 'legendary';

/**
 * A creature (the "monster" shown in Collezione, in team slots, and as shop rewards).
 * Level + progress fuel the card's progress bar ("12/50", "8/50", ...).
 */
export interface Creature {
  id: CreatureId;
  name: string;
  type: CreatureType;
  rarity: CreatureRarity;
  sprite: SpriteRef;
  level: number;
  /** Number of shards/duplicates owned toward next level. */
  progressCurrent: number;
  /** Shards required to level up. */
  progressMax: number;
  /** Whether the creature is fully owned (not locked/ghosted). */
  owned: boolean;
}
