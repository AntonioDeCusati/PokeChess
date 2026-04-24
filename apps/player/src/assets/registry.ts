/**
 * Asset registry — the single source of truth that maps every `SpriteRef.key`
 * to the actual imported file (URL) and its layout metadata.
 *
 * Components never touch this directly; they call `resolveSprite()` from
 * `./index.ts` which reads from here.
 *
 * The shape is deliberately compatible with Phaser's loader:
 *   - `kind: 'image'`       → this.load.image(key, url)
 *   - `kind: 'spritesheet'` → this.load.spritesheet(key, url, { frameWidth, frameHeight })
 *
 * HOW TO ADD A NEW ASSET
 * ----------------------
 * 1. Drop the file in `/src/assets/images` or `/src/assets/spritesheets`.
 * 2. Import it at the top of this file.
 * 3. Add an entry to `assetRegistry` below.
 * 4. Reference it from the data layer via `{ key, type, frame? }`.
 */

export type ImageAsset = {
  kind: 'image';
  url: string;
};

export type SpritesheetAsset = {
  kind: 'spritesheet';
  url: string;
  frameWidth: number;
  frameHeight: number;
  /** Number of columns in the sheet (needed to compute frame x/y offsets). */
  columns: number;
  /** Total number of frames in the sheet (row-major, left→right, top→bottom). */
  frameCount: number;
};

export type RegisteredAsset = ImageAsset | SpritesheetAsset;

/* ---------- Asset imports (populate as real files arrive) ----------
 * Example:
 *   import trainerDeku from './images/trainer-deku.png';
 *   import creaturesFire from './spritesheets/creatures-fire.png';
 */

/**
 * The registry.
 *
 * Currently empty — every lookup will fall back to the placeholder tile.
 * Add entries here as real sprite sheets / PNGs are dropped into `/src/assets`.
 *
 * Example entries:
 *
 *   'trainer/deku': { kind: 'image', url: trainerDeku },
 *   'creatures/fire': {
 *     kind: 'spritesheet',
 *     url: creaturesFire,
 *     frameWidth: 32,
 *     frameHeight: 32,
 *     columns: 4,
 *     frameCount: 16,
 *   },
 */
export const assetRegistry: Readonly<Record<string, RegisteredAsset>> = {
  // Intentionally empty — register real assets here.
};
