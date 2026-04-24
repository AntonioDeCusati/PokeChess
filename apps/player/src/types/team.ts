import type { CreatureId, MoveId } from './common';

/** Index of a slot in "Prima Linea" (1..6). */
export type TeamSlotIndex = 1 | 2 | 3 | 4 | 5 | 6;

/**
 * A single slot in the front line (Prima Linea).
 * Each slot pairs a creature with a movement pattern, and exposes
 * a "Cambia" action in the UI.
 */
export interface TeamSlot {
  index: TeamSlotIndex;
  creatureId: CreatureId;
  moveId: MoveId;
}

/** The ordered team configuration — always exactly 6 slots. */
export interface Team {
  slots: readonly [TeamSlot, TeamSlot, TeamSlot, TeamSlot, TeamSlot, TeamSlot];
}
