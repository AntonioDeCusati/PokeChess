import { ProgressBar } from '@/components/ProgressBar';
import { CreaturePortrait } from '@/components/CreaturePortrait';
import type { CreatureType, UserCreature } from '@/types';

export interface CreatureCardProps {
  creature: UserCreature;
  onClick?: (creature: UserCreature) => void;
}

const typeTint: Record<CreatureType, { glow: string; bar: string }> = {
  normal:   { glow: '#A8A878', bar: '#A8A878' },
  fire:     { glow: '#F08030', bar: '#F08030' },
  water:    { glow: '#6890F0', bar: '#6890F0' },
  grass:    { glow: '#78C850', bar: '#78C850' },
  electric: { glow: '#F8D030', bar: '#F8D030' },
  ice:      { glow: '#98D8D8', bar: '#98D8D8' },
  fighting: { glow: '#C03028', bar: '#C03028' },
  poison:   { glow: '#A040A0', bar: '#A040A0' },
  ground:   { glow: '#E0C068', bar: '#E0C068' },
  flying:   { glow: '#A890F0', bar: '#A890F0' },
  psychic:  { glow: '#F85888', bar: '#F85888' },
  bug:      { glow: '#A8B820', bar: '#A8B820' },
  rock:     { glow: '#B8A038', bar: '#B8A038' },
  ghost:    { glow: '#705898', bar: '#705898' },
  dragon:   { glow: '#7038F8', bar: '#7038F8' },
  dark:     { glow: '#705848', bar: '#705848' },
  steel:    { glow: '#B8B8D0', bar: '#B8B8D0' },
  fairy:    { glow: '#EE99AC', bar: '#EE99AC' },
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
  const tint = typeTint[creature.type1];

  return (
    <button
      type="button"
      onClick={() => onClick?.(creature)}
      aria-label={`${creature.name} livello ${creature.level}`}
      className={[
        'group relative flex flex-col gap-1 rounded-card border border-border-subtle bg-bg-elevated p-1.5',
        'text-left transition-colors hover:border-border-strong',
        creature.owned ? '' : 'opacity-60',
      ].join(' ')}
    >
      <div
        className="relative flex aspect-square items-center justify-center overflow-hidden rounded-tile"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 40%, ${tint.glow}33 0%, transparent 70%)`,
          backgroundColor: '#11141A',
        }}
      >
        <CreaturePortrait
          pokedexPath={creature.pokedexPath}
          name={creature.name}
          size="80%"
        />
      </div>

      <div className="flex items-baseline justify-between px-0.5">
        <span className="text-[11px] font-semibold text-text-primary">
          Liv. {creature.level}
        </span>
      </div>

      <ProgressBar
        current={creature.currentExp}
        max={creature.expMax}
        color={tint.bar}
        height={4}
        className="px-0.5"
        showLabel
        label={`${creature.currentExp}/${creature.expMax}`}
      />
    </button>
  );
}
