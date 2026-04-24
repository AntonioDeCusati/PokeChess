import type { SVGProps } from 'react';
import type { MovePattern } from '@/types';

type IconProps = SVGProps<SVGSVGElement>;

const base = (extra: Partial<IconProps> = {}): IconProps => ({
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  ...extra,
});

/** Horizontal movement — double arrow left↔right. */
export function HorizontalMoveIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 12h16" />
      <path d="M8 8l-4 4 4 4" />
      <path d="M16 8l4 4-4 4" />
    </svg>
  );
}

/** Vertical movement — double arrow up↕down. */
export function VerticalMoveIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 4v16" />
      <path d="M8 8l4-4 4 4" />
      <path d="M8 16l4 4 4-4" />
    </svg>
  );
}

/** Diagonal — X-shaped arrows. */
export function DiagonalMoveIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M5 5l14 14" />
      <path d="M19 5L5 19" />
      <path d="M5 9V5h4" />
      <path d="M15 5h4v4" />
      <path d="M5 15v4h4" />
      <path d="M15 19h4v-4" />
    </svg>
  );
}

/** Knight-style L-shape. */
export function LShapeMoveIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M7 4v10a2 2 0 0 0 2 2h9" />
      <path d="M15 13l3 3-3 3" />
    </svg>
  );
}

/** Jump — arc over an obstacle. */
export function JumpMoveIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 18c2-8 14-8 16 0" />
      <path d="M4 18h4" />
      <path d="M16 18h4" />
      <path d="M10 14l2-2 2 2" />
    </svg>
  );
}

/** Projection — crosshair / reticle. */
export function ProjectionMoveIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="7" />
      <circle cx="12" cy="12" r="2.5" />
      <path d="M12 2v3" />
      <path d="M12 19v3" />
      <path d="M2 12h3" />
      <path d="M19 12h3" />
    </svg>
  );
}

/**
 * Resolver used by the UI: `MoveIcon({ pattern })` renders the right glyph.
 * Keeping components dumb — they only know the pattern, not the file.
 */
export function MoveIcon({
  pattern,
  ...rest
}: IconProps & { pattern: MovePattern }) {
  switch (pattern) {
    case 'horizontal': return <HorizontalMoveIcon {...rest} />;
    case 'vertical':   return <VerticalMoveIcon {...rest} />;
    case 'diagonal':   return <DiagonalMoveIcon {...rest} />;
    case 'l-shape':    return <LShapeMoveIcon {...rest} />;
    case 'jump':       return <JumpMoveIcon {...rest} />;
    case 'projection': return <ProjectionMoveIcon {...rest} />;
  }
}
