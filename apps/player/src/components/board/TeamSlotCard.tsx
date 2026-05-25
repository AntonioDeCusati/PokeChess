import { Button } from '@/components/Button';
import { MoveIcon } from '@/components/icons';
import { CreaturePortrait } from '@/components/CreaturePortrait';
import type { Creature, Move, TeamSlot } from '@/types';

export interface TeamSlotCardProps {
  slot: TeamSlot;
  creature: Creature;
  move: Move;
  onChange?: (slotIndex: TeamSlot['index']) => void;
  onChangeMove?: (slotIndex: TeamSlot['index']) => void;
}

export function TeamSlotCard({
  slot,
  creature,
  move,
  onChange,
  onChangeMove,
}: TeamSlotCardProps) {
  return (
    <div
      className="flex w-full flex-col items-stretch gap-2"
      aria-label={`Slot ${slot.index}: ${creature.name}, ${move.label}`}
    >
      <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-card border border-border-strong bg-bg-elevated">
        <span
          className="absolute left-1 top-1 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-accent-red text-[10px] font-bold text-white ring-1 ring-black/30"
          aria-hidden
        >
          {slot.index}
        </span>
        <CreaturePortrait
          pokedexPath={creature.pokedexPath}
          name={creature.name}
          size="70%"
        />
      </div>

      <button
        type="button"
        onClick={() => onChangeMove?.(slot.index)}
        className="flex flex-col items-center gap-0.5 rounded-lg border border-border-subtle bg-bg-base/50 py-1 hover:border-accent/50 transition"
      >
        <MoveIcon
          pattern={move.pattern}
          className="h-5 w-5 text-accent"
          aria-hidden
        />
        <span className="text-[10px] leading-tight text-text-secondary">
          {move.label}
        </span>
      </button>

      <Button
        variant="outline"
        size="xs"
        fullWidth
        onClick={() => onChange?.(slot.index)}
      >
        Cambia
      </Button>
    </div>
  );
}
