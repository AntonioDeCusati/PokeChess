import { Sprite } from '@/components/Sprite';
import { GemIcon, GoldCoinIcon } from '@/components/icons';
import { formatNumber } from '@/lib/format';
import type { TrainingTier } from '@/types';

export interface TrainingTierCardProps {
  tier: TrainingTier;
  onStart?: (tier: TrainingTier) => void;
}

/**
 * Per-difficulty color and label — matches the mockup's green / yellow / red
 * headers under "ALLENAMENTO".
 */
const difficultyPreset: Record<
  TrainingTier['difficulty'],
  { label: string; labelColor: string; borderColor: string; rewardBg: string }
> = {
  easy: {
    label: 'Facile',
    labelColor: 'text-success',
    borderColor: 'border-success/40',
    rewardBg: 'from-[#183320] to-[#0F1E14]',
  },
  medium: {
    label: 'Medio',
    labelColor: 'text-accent',
    borderColor: 'border-accent/40',
    rewardBg: 'from-[#2D2311] to-[#1A150A]',
  },
  hard: {
    label: 'Difficile',
    labelColor: 'text-danger',
    borderColor: 'border-danger/40',
    rewardBg: 'from-[#2F1412] to-[#1A0B0C]',
  },
};

function RewardGlyph({ tier }: { tier: TrainingTier }) {
  if (tier.rewardSprite) {
    return <Sprite sprite={tier.rewardSprite} size={36} alt={tier.rewardKind} />;
  }
  if (tier.rewardKind === 'gold') return <GoldCoinIcon className="h-9 w-9" />;
  if (tier.rewardKind === 'gem') return <GemIcon className="h-9 w-9" />;
  return null;
}

export function TrainingTierCard({ tier, onStart }: TrainingTierCardProps) {
  const preset = difficultyPreset[tier.difficulty];

  return (
    <button
      type="button"
      onClick={() => onStart?.(tier)}
      className={[
        'group flex flex-col items-stretch gap-1 rounded-card border bg-bg-elevated p-2 text-left',
        'transition-colors hover:bg-bg-hover',
        preset.borderColor,
      ].join(' ')}
    >
      <span
        className={`text-[11px] font-bold uppercase tracking-wide ${preset.labelColor}`}
      >
        {preset.label}
      </span>
      <span className="text-[10px] text-text-secondary">Ricompensa:</span>

      <div
        className={[
          'mt-1 flex flex-1 flex-col items-center justify-center gap-1 rounded-tile bg-gradient-to-b py-2',
          preset.rewardBg,
        ].join(' ')}
      >
        <RewardGlyph tier={tier} />
        <span className="text-xs font-bold tabular-nums text-text-primary">
          {formatNumber(tier.rewardAmount)}
        </span>
      </div>
    </button>
  );
}
