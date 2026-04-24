import { Section } from '@/components/Section';
import { creaturesById, movesById, team } from '@/data';
import type { Team, TeamSlot } from '@/types';
import { TeamSlotCard } from './TeamSlotCard';

export interface PrimaLineaSectionProps {
  teamData?: Team;
  onChangeSlot?: (slotIndex: TeamSlot['index']) => void;
}

/**
 * "PRIMA LINEA (6/6)" — the player's main 6-slot team.
 * The row scrolls horizontally to stay compact on narrow screens.
 */
export function PrimaLineaSection({
  teamData = team,
  onChangeSlot,
}: PrimaLineaSectionProps) {
  const filled = teamData.slots.filter(
    (s) => creaturesById[s.creatureId],
  ).length;

  return (
    <Section
      title={`PRIMA LINEA (${filled}/${teamData.slots.length})`}
      subtitle="La tua squadra principale"
    >
      {/* 3 colonne × 2 righe — tutte le 6 card visibili senza scroll. */}
      <ul className="grid grid-cols-3 gap-2">
        {teamData.slots.map((slot) => {
          const creature = creaturesById[slot.creatureId];
          const move = movesById[slot.moveId];
          if (!creature || !move) return null;
          return (
            <li key={slot.index} className="min-w-0">
              <TeamSlotCard
                slot={slot}
                creature={creature}
                move={move}
                onChange={onChangeSlot}
              />
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
