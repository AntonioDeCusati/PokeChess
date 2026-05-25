import type { CreatureType } from './common';

export type CreatureRarity = 'common' | 'rare' | 'epic' | 'legendary';

/** The four animation clips loaded at runtime for every creature. */
export type AnimationType = 'idle' | 'walk' | 'attack' | 'hurt';

/**
 * Per-animation spritesheet metadata.
 * Mirrors the data stored in AnimData.xml (and seeded to the DB so the
 * client never has to parse XML at runtime).
 */
export interface AnimationData {
  type: AnimationType;
  frameWidth: number;
  frameHeight: number;
  /** Total number of frames (= durations.length). */
  frameCount: number;
  /** Per-frame durations in game ticks (60 fps). */
  durations: number[];
  /** Frame index where the rush/charge starts (attack only). */
  rushFrame?: number;
  /** Frame index of impact (attack only). */
  hitFrame?: number;
  /** Frame index where the creature starts returning (attack only). */
  returnFrame?: number;
}

/**
 * Catalog entry for a creature — pure metadata, no per-player state.
 * Shown in Collezione (all entries) and in team slot pickers.
 *
 * Sprite resolution:
 *   The PNG files live at:
 *     apps/assets/sprite/{pokedexPath}/Idle-Anim.png
 *     apps/assets/sprite/{pokedexPath}/Walk-Anim.png
 *     apps/assets/sprite/{pokedexPath}/Attack-Anim.png
 *     apps/assets/sprite/{pokedexPath}/Hurt-Anim.png
 *   Frame dimensions and per-frame timings come from `animations`.
 */
export interface Creature {
  id: string;
  slug: string;
  pokedexNumber: number;
  /**
   * Relative path under apps/assets/sprite/.
   * Simple form:  "0006"
   * Nested form:  "0006/0005"  (alternate form / regional variant)
   */
  pokedexPath: string;
  name: string;
  type1: CreatureType;
  type2?: CreatureType;
  rarity: CreatureRarity;
  /** Base exp required to level up (game logic may apply per-level scaling). */
  expMax: number;
  canEvolve: boolean;
  /** `id` of the Creature this one evolves into (only set when canEvolve=true). */
  evolvesToId?: string;
  rewardType1: number;
  rewardType2: number;
  /** Animation clip data for this creature (idle / walk / attack / hurt). */
  animations: AnimationData[];
}

/**
 * A creature merged with the player's ownership row.
 * When the player doesn't own it yet: level=0, currentExp=0, owned=false
 * (used to render locked/ghosted cards in Collezione).
 */
export interface UserCreature extends Creature {
  level: number;
  /** Exp accumulated toward the next level-up. */
  currentExp: number;
  owned: boolean;
}


