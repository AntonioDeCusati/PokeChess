/**
 * Public asset-system API.
 *
 * `resolveSprite(ref)` is what UI components actually call (via <Sprite />).
 * It returns a discriminated union that the renderer uses to pick between:
 *   - a plain <img>
 *   - a clipped spritesheet frame
 *   - a placeholder tile (when the asset isn't registered yet)
 */

import type { SpriteRef } from '@/types/common';
import { assetRegistry, type RegisteredAsset } from './registry';

/** Resolved renderable — consumed by the <Sprite /> component. */
export type ResolvedSprite =
  | {
      kind: 'image';
      url: string;
      alt: string;
    }
  | {
      kind: 'spritesheet';
      url: string;
      frameWidth: number;
      frameHeight: number;
      columns: number;
      frameCount: number;
      frameIndex: number;
      alt: string;
    }
  | {
      kind: 'placeholder';
      color: string;
      label: string;
      alt: string;
    };

const DEFAULT_PLACEHOLDER_COLOR = '#1F242C';

function placeholder(ref: SpriteRef): ResolvedSprite {
  const label =
    ref.fallbackLabel ??
    ref.key.split('/').pop()?.slice(0, 2).toUpperCase() ??
    '??';
  return {
    kind: 'placeholder',
    color: ref.fallbackColor ?? DEFAULT_PLACEHOLDER_COLOR,
    label,
    alt: ref.key,
  };
}

/**
 * Resolve a SpriteRef into something directly renderable.
 *
 * - If the key isn't registered → placeholder.
 * - If the ref's `type` disagrees with the registered asset kind → placeholder
 *   (keeps rendering safe if a key is migrated between image ↔ sheet).
 */
export function resolveSprite(ref: SpriteRef): ResolvedSprite {
  const entry: RegisteredAsset | undefined = assetRegistry[ref.key];
  if (!entry) return placeholder(ref);

  if (ref.type === 'image' && entry.kind === 'image') {
    return { kind: 'image', url: entry.url, alt: ref.key };
  }

  if (ref.type === 'spritesheet' && entry.kind === 'spritesheet') {
    const frameIndex = Math.min(
      Math.max(0, ref.frame ?? 0),
      entry.frameCount - 1,
    );
    return {
      kind: 'spritesheet',
      url: entry.url,
      frameWidth: entry.frameWidth,
      frameHeight: entry.frameHeight,
      columns: entry.columns,
      frameCount: entry.frameCount,
      frameIndex,
      alt: ref.key,
    };
  }

  return placeholder(ref);
}

/** Convenience re-export for the Phaser preloader down the line. */
export { assetRegistry };
export type { RegisteredAsset };
