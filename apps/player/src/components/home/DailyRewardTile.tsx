import {
  CheckIcon,
  ChestIcon,
  GemIcon,
  GoldCoinIcon,
} from '@/components/icons';
import { formatNumber } from '@/lib/format';
import type { DailyReward } from '@/types';

export interface DailyRewardTileProps {
  reward: DailyReward;
}

function RewardGlyph({ reward }: { reward: DailyReward }) {
  switch (reward.kind) {
    case 'gem':
      return <GemIcon className="h-6 w-6" />;
    case 'gold':
      return <GoldCoinIcon className="h-6 w-6" />;
    case 'chest':
      return <ChestIcon className="h-6 w-6 text-accent" />;
    case 'item':
    default:
      return <ChestIcon className="h-6 w-6 text-text-secondary" />;
  }
}

/** One of the 5 day tiles in the daily rewards strip. */
export function DailyRewardTile({ reward }: DailyRewardTileProps) {
  const { status } = reward;
  const isToday = status === 'today';
  const isClaimed = status === 'claimed';

  return (
    <div
      className={[
        'relative flex flex-col items-center gap-1 rounded-card border p-2 text-center transition-colors',
        isToday
          ? 'border-accent bg-accent/10 shadow-glow'
          : 'border-border-subtle bg-bg-elevated',
        isClaimed ? 'opacity-85' : '',
      ].join(' ')}
      aria-current={isToday ? 'step' : undefined}
    >
      <span className="text-[10px] font-semibold uppercase tracking-wide text-text-secondary">
        Giorno
      </span>
      <span
        className={[
          'text-sm font-bold leading-none',
          isToday ? 'text-accent' : 'text-text-primary',
        ].join(' ')}
      >
        {reward.day}
      </span>

      <div className="flex h-7 items-center justify-center">
        {isClaimed ? (
          <CheckIcon className="h-5 w-5 text-success" />
        ) : (
          <RewardGlyph reward={reward} />
        )}
      </div>

      {reward.amount !== undefined && !isClaimed && (
        <span className="text-[10px] font-semibold tabular-nums text-text-primary">
          {formatNumber(reward.amount)}
        </span>
      )}
    </div>
  );
}
