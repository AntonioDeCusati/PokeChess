import { Sprite } from '@/components/Sprite';
import { Button } from '@/components/Button';
import { MoveIcon } from '@/components/icons';
import type { Creature, Move, TeamSlot } from '@/types';

export interface TeamSlotCardProps {
  slot: TeamSlot;
  creature: Creature;
  move: Move;
  onChange?: (slotIndex: TeamSlot['index']) => void;
}

/**
 * A single slot card in the "Prima Linea" horizontal row.
 *
 * Layout (top → bottom):
 *   - Slot number badge (top-left of the sprite frame)
 *   - Creature sprite (colored frame tinted by creature type)
 *   - Thin divider
 *   - Move icon
 *   - Move label
 *   - "Cambia" button
 *
 * Sized to be compact on mobile (~88px wide).
 */
export function TeamSlotCard({
  slot,
  creature,
  move,
  onChange,
}: TeamSlotCardProps) {
  const tint = creature.sprite.fallbackColor ?? '#2A3038';

  return (
    <div
      className="flex w-full flex-col items-stretch gap-2"
      aria-label={`Slot ${slot.index}: ${creature.name}, ${move.label}`}
    >
      {/* Sprite tile + number badge */}
      <div
        className="relative flex aspect-square items-center justify-center overflow-hidden rounded-card border border-border-strong bg-bg-elevated"
        style={{
          backgroundImage: `linear-gradient(180deg, ${tint}22 0%, transparent 70%)`,
        }}
      >
        <span
          className="absolute left-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent-red text-[10px] font-bold text-white ring-1 ring-black/30"
          aria-hidden
        >
          {slot.index}
        </span>
        <Sprite
          sprite={creature.sprite}
          width="70%"
          height="70%"
          alt={creature.name}
        />
      </div>

      {/* Move info */}
      <div className="flex flex-col items-center gap-0.5">
        <MoveIcon
          pattern={move.pattern}
          className="h-5 w-5 text-accent"
          aria-hidden
        />
        <span className="text-[11px] leading-tight text-text-secondary">
          {move.label}
        </span>
      </div>

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
