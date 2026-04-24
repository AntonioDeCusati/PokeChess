import type { CreatureId, MoveId, Team, TeamSlot } from '@/types';

/**
 * The 6 slots shown in Prima Linea, matching mockup #2 from left to right.
 * Numbering (1..6) comes directly from the badges printed above each slot.
 */
const s = (
  index: 1 | 2 | 3 | 4 | 5 | 6,
  creatureSlug: string,
  moveSlug: string,
): TeamSlot => ({
  index,
  creatureId: `creature-${creatureSlug}` as CreatureId,
  moveId: `move-${moveSlug}` as MoveId,
});

export const team: Team = {
  slots: [
    s(1, 'flarepup',  'horizontal'),
    s(2, 'voidbat',   'vertical'),
    s(3, 'leafling',  'diagonal'),
    s(4, 'bubblet',   'l-shape'),
    s(5, 'sparkit',   'jump'),
    s(6, 'blushling', 'projection'),
  ],
};
