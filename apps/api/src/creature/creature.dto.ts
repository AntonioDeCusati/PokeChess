import type { Creature, UserCreature } from '@prisma/client';

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
  name: string;
  type: string;
  rarity: string;
  sprite: SpriteRefDto;
  defaultProgressMax: number;
}

/**
 * Catalog metadata + per-user ownership overlay.
 *
 * Consumed by:
 *   - GET /user/creatures       (only rows the user actually owns)
 *   - GET /app/bootstrap        (ALL catalog creatures; unowned ones have
 *                                owned=false, level=0, progress=0)
 */
export interface UserCreatureDto extends CreatureDto {
  level: number;
  progressCurrent: number;
  progressMax: number;
  owned: boolean;
}

/**
 * Asset reference shape consumed by the client asset registry.
 * Matches `apps/player/src/types/common.ts::SpriteRef`.
 */
export interface SpriteRefDto {
  key: string;
  type: 'image' | 'spritesheet';
  frame?: number;
  fallbackColor?: string;
  fallbackLabel?: string;
}

function toSpriteRef(c: Creature): SpriteRefDto {
  return {
    key: c.spriteKey,
    type: c.spriteType,
    ...(c.spriteFrame !== null ? { frame: c.spriteFrame } : {}),
    ...(c.fallbackColor ? { fallbackColor: c.fallbackColor } : {}),
    ...(c.fallbackLabel ? { fallbackLabel: c.fallbackLabel } : {}),
  };
}

export function toCreatureDto(c: Creature): CreatureDto {
  return {
    id: c.id,
    slug: c.slug,
    name: c.name,
    type: c.type,
    rarity: c.rarity,
    sprite: toSpriteRef(c),
    defaultProgressMax: c.defaultProgressMax,
  };
}

/**
 * Merge a catalog creature with (optionally) the user's UserCreature row.
 * When the user does not own the creature, returns a stable unowned shape
 * (owned=false, level=0, progressCurrent=0, progressMax=default).
 */
export function toUserCreatureDto(
  c: Creature,
  uc: UserCreature | null | undefined,
): UserCreatureDto {
  return {
    ...toCreatureDto(c),
    level: uc?.level ?? 0,
    progressCurrent: uc?.progressCurrent ?? 0,
    progressMax: uc?.progressMax ?? c.defaultProgressMax,
    owned: uc?.owned ?? false,
  };
}
