import { Sprite } from '@/components/Sprite';
import { CheckIcon, LockIcon } from '@/components/icons';
import type { Gym } from '@/types';

export interface GymCardProps {
  gym: Gym;
  onChallenge?: (gym: Gym) => void;
}

const typeTint: Record<Gym['type'], string> = {
  fire:     '#E85C3A',
  water:    '#4FA8E0',
  grass:    '#5BBF4A',
  electric: '#E8C244',
  poison:   '#8A4FB8',
  dark:     '#3E4454',
  ghost:    '#C7C7D1',
  dragon:   '#55B89C',
  light:    '#F5D787',
};

/**
 * A single gym tile in the "PALESTRE" grid.
 * Shows a check for defeated gyms and a lock when the gym is gated.
 */
export function GymCard({ gym, onChallenge }: GymCardProps) {
  const tint = typeTint[gym.type];
  const disabled = gym.locked;

  return (
    <button
      type="button"
      onClick={() => !disabled && onChallenge?.(gym)}
      disabled={disabled}
      className={[
        'relative flex flex-col items-center gap-1 rounded-card border border-border-subtle bg-bg-elevated p-2',
        'transition-colors disabled:cursor-not-allowed',
        disabled ? 'opacity-70' : 'hover:bg-bg-hover',
      ].join(' ')}
      aria-label={`Palestra ${gym.name}${gym.locked ? ' (bloccata)' : ''}`}
    >
      <div
        className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-tile"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 40%, ${tint}44 0%, transparent 70%)`,
          backgroundColor: '#11141A',
        }}
      >
        <Sprite
          sprite={gym.sprite}
          width="75%"
          height="75%"
          alt={gym.name}
        />
      </div>

      <span className="text-[11px] font-semibold text-text-primary">
        {gym.name}
      </span>

      <span className="flex h-4 items-center">
        {gym.defeated ? (
          <CheckIcon className="h-4 w-4 text-success" />
        ) : gym.locked ? (
          <LockIcon className="h-4 w-4 text-text-muted" />
        ) : null}
      </span>
    </button>
  );
}
