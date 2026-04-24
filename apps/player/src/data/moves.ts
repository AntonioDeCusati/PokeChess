import type { Move, MoveId } from '@/types';

/**
 * The 6 movement patterns shown under Prima Linea slots.
 * Labels are verbatim from the Board mockup.
 */
export const moves: readonly Move[] = [
  {
    id: 'move-horizontal' as MoveId,
    pattern: 'horizontal',
    label: 'Orizzontale',
    icon: 'move-horizontal',
  },
  {
    id: 'move-vertical' as MoveId,
    pattern: 'vertical',
    label: 'Verticale',
    icon: 'move-vertical',
  },
  {
    id: 'move-diagonal' as MoveId,
    pattern: 'diagonal',
    label: 'Diagonale',
    icon: 'move-diagonal',
  },
  {
    id: 'move-l-shape' as MoveId,
    pattern: 'l-shape',
    label: 'L-Shape',
    icon: 'move-l-shape',
  },
  {
    id: 'move-jump' as MoveId,
    pattern: 'jump',
    label: 'Salto',
    icon: 'move-jump',
  },
  {
    id: 'move-projection' as MoveId,
    pattern: 'projection',
    label: 'Proiezione',
    icon: 'move-projection',
  },
];

export const movesById: Readonly<Record<string, Move>> = Object.fromEntries(
  moves.map((m) => [m.id, m]),
);
