import { Sprite } from '@/components/Sprite';
import { ProgressBar } from '@/components/ProgressBar';
import type { Creature } from '@/types';

export interface CreatureCardProps {
  creature: Creature;
  onClick?: (creature: Creature) => void;
}

/** Maps the creature type to a soft tint + progress-bar color. */
const typeTint: Record<Creature['type'], { glow: string; bar: string }> = {
  fire:     { glow: '#E85C3A', bar: '#E85C3A' },
  water:    { glow: '#4FA8E0', bar: '#4FA8E0' },
  grass:    { glow: '#5BBF4A', bar: '#5BBF4A' },
  electric: { glow: '#E8C244', bar: '#E8C244' },
  poison:   { glow: '#8A4FB8', bar: '#8A4FB8' },
  dark:     { glow: '#3E4454', bar: '#6B7280' },
  ghost:    { glow: '#C7C7D1', bar: '#C7C7D1' },
  dragon:   { glow: '#55B89C', bar: '#55B89C' },
  light:    { glow: '#EDE8D0', bar: '#EDE8D0' },
};

/**
 * A single cell in the Collezione grid.
 *
 * Layout:
 *   - sprite tile with type-tinted glow
 *   - "Liv. N" label
 *   - tiny shard progress bar
 *
 * Locked/unowned creatures are rendered dimmed.
 */
export function CreatureCard({ creature, onClick }: CreatureCardProps) {
  const tint = typeTint[creature.type];
  const owned = creature.owned;

  return (
    <button
      type="button"
      onClick={() => onClick?.(creature)}
      aria-label={`${creature.name} livello ${creature.level}`}
      className={[
        'group relative flex flex-col gap-1 rounded-card border border-border-subtle bg-bg-elevated p-1.5',
        'text-left transition-colors hover:border-border-strong',
        owned ? '' : 'opacity-60',
      ].join(' ')}
    >
      <div
        className="relative flex aspect-square items-center justify-center overflow-hidden rounded-tile"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 40%, ${tint.glow}33 0%, transparent 70%)`,
          backgroundColor: '#11141A',
        }}
      >
        <Sprite
          sprite={creature.sprite}
          width="80%"
          height="80%"
          alt={creature.name}
        />
      </div>

      <div className="flex items-baseline justify-between px-0.5">
        <span className="text-[11px] font-semibold text-text-primary">
          Liv. {creature.level}
        </span>
      </div>

      <ProgressBar
        current={creature.progressCurrent}
        max={creature.progressMax}
        color={tint.bar}
        height={4}
        className="px-0.5"
        showLabel
        label={`${creature.progressCurrent}/${creature.progressMax}`}
      />
    </button>
  );
}
