import type {
  AnimationType,
  Creature,
  CreatureAnimation,
  UserCreature,
} from '@prisma/client';

// ---------------------------------------------------------------------------
// Animation
// ---------------------------------------------------------------------------

export interface AnimationDto {
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

function toAnimationDto(a: CreatureAnimation): AnimationDto {
  return {
    type: a.type,
    frameWidth: a.frameWidth,
    frameHeight: a.frameHeight,
    frameCount: a.frameCount,
    durations: a.durations as number[],
    ...(a.rushFrame   !== null ? { rushFrame:   a.rushFrame   } : {}),
    ...(a.hitFrame    !== null ? { hitFrame:    a.hitFrame    } : {}),
    ...(a.returnFrame !== null ? { returnFrame: a.returnFrame } : {}),
  };
}

// ---------------------------------------------------------------------------
// Creature (catalog)
// ---------------------------------------------------------------------------

/**
 * Catalog-only creature. Pure metadata — no per-user state.
 *
 * Consumed by:
 *   - GET /creatures
 *   - GET /creatures/:id
 */
export interface CreatureDto {
  id: string;
  slug: string;
  pokedexNumber: number;
  /** Relative path under apps/assets/sprite/ (e.g. "0006" or "0006/0005"). */
  pokedexPath: string;
  name: string;
  type1: string;
  type2?: string;
  rarity: string;
  /** Base exp cap for level-up (game logic may scale per level). */
  expMax: number;
  canEvolve: boolean;
  /** ID of the creature this one evolves into (only present when canEvolve=true). */
  evolveToId?: string;
  rewardType1: number;
  rewardType2: number;
  /** Sprite animation data for this creature (idle / walk / attack / hurt). */
  animations: AnimationDto[];
}

type CreatureWithAnimations = Creature & { animations: CreatureAnimation[] };

export function toCreatureDto(c: CreatureWithAnimations): CreatureDto {
  return {
    id: c.id,
    slug: c.slug,
    pokedexNumber: c.pokedexNumber,
    pokedexPath: c.pokedexPath,
    name: c.name,
    type1: c.type1,
    ...(c.type2        ? { type2:       c.type2       } : {}),
    rarity: c.rarity,
    expMax: c.expMax,
    canEvolve: c.canEvolve,
    ...(c.evolveToId  ? { evolveToId: c.evolveToId } : {}),
    rewardType1: c.rewardType1,
    rewardType2: c.rewardType2,
    animations: c.animations.map(toAnimationDto),
  };
}

// ---------------------------------------------------------------------------
// UserCreature (catalog + per-user state)
// ---------------------------------------------------------------------------

/**
 * Catalog metadata merged with per-user ownership state.
 *
 * Consumed by:
 *   - GET /user/creatures       (only rows the user actually owns)
 *   - GET /app/bootstrap        (ALL catalog creatures; unowned ones have
 *                                owned=false, level=0, currentExp=0)
 */
export interface UserCreatureDto extends CreatureDto {
  level: number;
  currentExp: number;
  owned: boolean;
}

/**
 * Merge a catalog creature with (optionally) the user's UserCreature row.
 * When the user does not own the creature, returns a stable unowned shape
 * (owned=false, level=0, currentExp=0).
 */
export function toUserCreatureDto(
  c: CreatureWithAnimations,
  uc: UserCreature | null | undefined,
): UserCreatureDto {
  return {
    ...toCreatureDto(c),
    level:      uc?.level      ?? 0,
    currentExp: uc?.currentExp ?? 0,
    owned:      uc?.owned      ?? false,
  };
}


