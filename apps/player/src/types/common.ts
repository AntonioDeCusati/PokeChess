/**
 * Shared primitives used across domain types.
 */

/** Branded id helpers — keep ids type-safe without runtime cost. */
export type Id<T extends string> = string & { readonly __brand: T };

export type PlayerId = Id<'Player'>;
export type CreatureId = Id<'Creature'>;
export type MoveId = Id<'Move'>;
export type ShopItemId = Id<'ShopItem'>;
export type FriendId = Id<'Friend'>;
export type LeagueEventId = Id<'LeagueEvent'>;
export type GymId = Id<'Gym'>;
export type MessageId = Id<'Message'>;
export type BackgroundId = Id<'Background'>;
export type TrainerId = Id<'Trainer'>;
export type SupportId = Id<'Support'>;

/** Creature element / type palette used everywhere (cards, gyms, badges). */
export type CreatureType =
  | 'normal'
  | 'fire'
  | 'water'
  | 'grass'
  | 'electric'
  | 'ice'
  | 'fighting'
  | 'poison'
  | 'ground'
  | 'flying'
  | 'psychic'
  | 'bug'
  | 'rock'
  | 'ghost'
  | 'dragon'
  | 'dark'
  | 'steel'
  | 'fairy';

/**
 * Asset reference — the ONLY way components know which artwork to render.
 *
 *  - `type: "image"`       → a single PNG/WebP in /src/assets/images
 *  - `type: "spritesheet"` → a frame inside a sheet in /src/assets/spritesheets
 *
 * `key` is resolved by the asset registry (src/assets/index.ts). If the key
 * is not registered, the UI falls back to a placeholder tile tinted with
 * `fallbackColor`.
 *
 * This shape is intentionally Phaser-compatible: the same (key, frame) tuple
 * can later be loaded as `this.load.spritesheet(key, url, { frameWidth, frameHeight })`
 * and consumed via `this.add.sprite(x, y, key, frame)`.
 */
export type SpriteType = 'image' | 'spritesheet';

export interface SpriteRef {
  /** Stable asset key (registry lookup, also the Phaser scene key). */
  key: string;
  type: SpriteType;
  /** Frame index, only meaningful when type === "spritesheet". */
  frame?: number;
  /** Placeholder color (CSS) used until the asset resolves. */
  fallbackColor?: string;
  /** Optional short label used by the placeholder (e.g. first letter). */
  fallbackLabel?: string;
}

/** Generic normalized value 0..1 for bars/progress. */
export type Normalized = number;
