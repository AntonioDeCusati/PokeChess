import type { MoveId } from './common';

/**
 * Movement patterns shown under each team slot in the Board screen.
 * Maps exactly to the 6 labels in mockup #2:
 * Orizzontale, Verticale, Diagonale, L-Shape, Salto, Proiezione.
 */
export type MovePattern =
  | 'horizontal'
  | 'vertical'
  | 'diagonal'
  | 'l-shape'
  | 'jump'
  | 'projection';

export interface Move {
  id: MoveId;
  pattern: MovePattern;
  /** Localized display label (Italian in mockups). */
  label: string;
  /** Name of the icon used to render the pattern glyph. */
  icon: string;
  description?: string;
}
