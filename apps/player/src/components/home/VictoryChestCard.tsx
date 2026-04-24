import { Button } from '@/components/Button';
import { Sprite } from '@/components/Sprite';
import type { VictoryChest } from '@/types';

export interface VictoryChestCardProps {
  chest: VictoryChest;
  onOpen?: () => void;
}

/** "Baule della vittoria" card under the BATTAGLIA button. */
export function VictoryChestCard({ chest, onOpen }: VictoryChestCardProps) {
  return (
    <div className="flex items-center gap-3 rounded-card border border-border-subtle bg-bg-surface p-3">
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-sm font-semibold text-text-primary">
          {chest.title}
        </span>
        <span className="text-xxs text-text-secondary">
          {chest.subtitle}
        </span>
        <Button
          variant="primary"
          size="sm"
          onClick={onOpen}
          disabled={!chest.ready}
          className="mt-2 self-start px-5"
        >
          {chest.ctaLabel}
        </Button>
      </div>
      <Sprite
        sprite={chest.sprite}
        size={64}
        alt={chest.title}
        className="shrink-0"
      />
    </div>
  );
}
