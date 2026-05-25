import type { Move, MoveId } from '@/types';

/**
 * All movement patterns available for team slot assignment.
 *
 * Rules:
 *   - 'projection' (Regina) can be assigned to max 1 slot per team.
 *   - All others have no limit.
 */
export const moves: readonly Move[] = [
  { id: 'horizontal' as MoveId,  pattern: 'horizontal',  label: 'Orizzontale', icon: 'move-horizontal' },
  { id: 'vertical' as MoveId,    pattern: 'vertical',    label: 'Verticale',   icon: 'move-vertical' },
  { id: 'diagonal' as MoveId,    pattern: 'diagonal',    label: 'Alfiere',     icon: 'move-diagonal' },
  { id: 'l-shape' as MoveId,     pattern: 'l-shape',     label: 'Cavallo',     icon: 'move-l-shape' },
  { id: 'jump' as MoveId,        pattern: 'jump',        label: 'Salto',       icon: 'move-jump' },
  { id: 'projection' as MoveId,  pattern: 'projection',  label: 'Regina',      icon: 'move-projection' },
  { id: 'rook' as MoveId,        pattern: 'rook',        label: 'Torre',       icon: 'move-rook' },
  { id: 'pawn' as MoveId,        pattern: 'pawn',        label: 'Soldato',     icon: 'move-pawn' },
  { id: 'king' as MoveId,        pattern: 'king',        label: 'Re',          icon: 'move-king' },
];

export const movesById: Readonly<Record<string, Move>> = Object.fromEntries(
  moves.map((m) => [m.id, m]),
);
