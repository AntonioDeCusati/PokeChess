import { useMemo, type CSSProperties } from 'react';
import type { SpriteRef } from '@/types';
import { resolveSprite } from '@/assets';

type SizeValue = number | string;

export interface SpriteProps {
  /** The asset reference (from the data layer). */
  sprite: SpriteRef;
  /** Square size shortcut — applied as both width and height. */
  size?: SizeValue;
  /** Explicit width, overrides `size`. */
  width?: SizeValue;
  /** Explicit height, overrides `size`. */
  height?: SizeValue;
  /** Extra classes applied to the outer wrapper. */
  className?: string;
  /** Accessible label (defaults to the sprite key). */
  alt?: string;
  /** Whether to preserve crisp pixel-art scaling. Default: true. */
  pixelated?: boolean;
  /** Inline style overrides. */
  style?: CSSProperties;
}

const px = (v: SizeValue | undefined): string | undefined =>
  v === undefined ? undefined : typeof v === 'number' ? `${v}px` : v;

/**
 * Renders a sprite referenced by a `SpriteRef`.
 *
 * Components never hardcode URLs — they always pass a SpriteRef coming
 * from the data layer. The asset registry (src/assets/registry.ts) resolves
 * the key; if it's missing we render a tinted placeholder tile.
 *
 * The same keys are reused by the future Phaser pipeline.
 */
export function Sprite({
  sprite,
  size,
  width,
  height,
  className = '',
  alt,
  pixelated = true,
  style,
}: SpriteProps) {
  const resolved = useMemo(() => resolveSprite(sprite), [sprite]);

  const w = px(width ?? size);
  const h = px(height ?? size);

  const baseStyle: CSSProperties = {
    width: w,
    height: h,
    imageRendering: pixelated ? 'pixelated' : undefined,
    ...style,
  };

  const label = alt ?? resolved.alt;

  if (resolved.kind === 'image') {
    return (
      <img
        src={resolved.url}
        alt={label}
        className={`block select-none object-contain ${className}`}
        style={baseStyle}
        draggable={false}
      />
    );
  }

  if (resolved.kind === 'spritesheet') {
    const { url, columns, frameWidth, frameHeight, frameCount, frameIndex } =
      resolved;
    const rows = Math.ceil(frameCount / columns);
    const col = frameIndex % columns;
    const row = Math.floor(frameIndex / columns);

    /* We render at the requested display size, scaling the whole sheet
       by the same factor so the right frame lands in the viewport. */
    const sheetStyle: CSSProperties = {
      ...baseStyle,
      backgroundImage: `url(${url})`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: `${columns * 100}% ${rows * 100}%`,
      backgroundPosition: `${(col / Math.max(columns - 1, 1)) * 100}% ${
        (row / Math.max(rows - 1, 1)) * 100
      }%`,
      aspectRatio: w === undefined && h === undefined
        ? `${frameWidth} / ${frameHeight}`
        : undefined,
    };

    return (
      <span
        role="img"
        aria-label={label}
        className={`block ${className}`}
        style={sheetStyle}
      />
    );
  }

  // Placeholder (unknown or mismatched key).
  const placeholderStyle: CSSProperties = {
    ...baseStyle,
    backgroundColor: resolved.color,
  };

  return (
    <span
      role="img"
      aria-label={label}
      className={`flex items-center justify-center rounded-tile text-[10px] font-semibold uppercase tracking-wide text-white/80 ring-1 ring-inset ring-white/5 ${className}`}
      style={placeholderStyle}
    >
      {resolved.label}
    </span>
  );
}
