import { Section } from '@/components/Section';
import { movesById } from '@/data';
import type { UserCreature, TeamSlot } from '@/types';
import { TeamSlotCard } from './TeamSlotCard';

export interface PrimaLineaSectionProps {
  creatures: UserCreature[];
  teamSlots: TeamSlot[] | null;
  onChangeSlot?: (slotIndex: number) => void;
}

export function PrimaLineaSection({
  creatures,
  teamSlots,
  onChangeSlot,
}: PrimaLineaSectionProps) {
  const creatureMap = new Map(creatures.map((c) => [c.id, c]));
  const slots = teamSlots ?? [];
  const filled = slots.length;

  const emptySlots = Array.from({ length: Math.max(0, 6 - slots.length) }, (_, i) => i + slots.length + 1);

  return (
    <Section
      title={`PRIMA LINEA (${filled}/6)`}
      subtitle="La tua squadra principale"
    >
      <ul className="grid grid-cols-3 gap-2">
        {slots.map((slot) => {
          const creature = creatureMap.get(slot.creatureId);
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
        {emptySlots.map((idx) => (
          <li key={`empty-${idx}`} className="min-w-0">
            <button
              type="button"
              onClick={() => onChangeSlot?.(idx)}
              className="flex w-full aspect-square items-center justify-center rounded-card border-2 border-dashed border-border-subtle bg-bg-elevated/50 text-text-secondary hover:border-accent transition-colors"
            >
              <span className="text-2xl">+</span>
            </button>
          </li>
        ))}
      </ul>
    </Section>
  );
}
