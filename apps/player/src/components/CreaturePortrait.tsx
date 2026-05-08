import { useState, type CSSProperties } from 'react';

interface CreaturePortraitProps {
  pokedexPath: string;
  name: string;
  size?: number | string;
  className?: string;
  style?: CSSProperties;
}

const px = (v: number | string | undefined): string | undefined =>
  v === undefined ? undefined : typeof v === 'number' ? `${v}px` : v;

/**
 * Renders a creature's portrait from the shared assets folder.
 * Falls back to a colored placeholder tile with the creature's initials.
 *
 * Portraits live at: /portrait/{pokedexPath}/Normal.png
 */
export function CreaturePortrait({
  pokedexPath,
  name,
  size,
  className = '',
  style,
}: CreaturePortraitProps) {
  const [failed, setFailed] = useState(false);
  const src = `/portrait/${pokedexPath}/Normal.png`;
  const dim = px(size);

  if (failed) {
    return (
      <span
        className={`flex items-center justify-center rounded-tile bg-bg-elevated text-[10px] font-semibold uppercase text-text-secondary ring-1 ring-inset ring-border-subtle ${className}`}
        style={{ width: dim, height: dim, ...style }}
        role="img"
        aria-label={name}
      >
        {name.slice(0, 2)}
      </span>
    );
  }

  return (
    <img
      src={src}
      alt={name}
      className={`block select-none object-contain ${className}`}
      style={{ width: dim, height: dim, imageRendering: 'pixelated', ...style }}
      draggable={false}
      onError={() => setFailed(true)}
    />
  );
}
