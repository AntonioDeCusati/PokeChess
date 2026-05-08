import type { CreatureId, MoveId, Team, TeamSlot } from '@/types';

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
    s(1, 'charizard',  'horizontal'),
    s(2, 'blastoise',  'vertical'),
    s(3, 'venusaur',   'diagonal'),
    s(4, 'pikachu',    'l-shape'),
    s(5, 'gengar',     'jump'),
    s(6, 'dragonite',  'projection'),
  ],
};
