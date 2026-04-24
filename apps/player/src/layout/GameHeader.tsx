import { Sprite } from '@/components/Sprite';
import { ProgressBar } from '@/components/ProgressBar';
import { GemIcon, GoldCoinIcon, PlusIcon } from '@/components/icons';
import { playerProfile } from '@/data';
import type { PlayerProfile } from '@/types';

interface CurrencyChipProps {
  icon: React.ReactNode;
  amount: number;
  onAdd?: () => void;
  ariaLabel: string;
}

/** Gold / gem pill shown on the right of the header. */
function CurrencyChip({ icon, amount, onAdd, ariaLabel }: CurrencyChipProps) {
  return (
    <div
      className="flex h-8 items-center gap-1.5 rounded-pill border border-border-subtle bg-bg-elevated pl-1.5 pr-1"
      aria-label={ariaLabel}
    >
      <span className="h-5 w-5 shrink-0">{icon}</span>
      <span className="min-w-0 text-xs font-semibold tabular-nums text-text-primary">
        {formatAmount(amount)}
      </span>
      <button
        type="button"
        onClick={onAdd}
        className="ml-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent text-black hover:bg-accent-hover active:bg-accent-deep"
        aria-label={`Aggiungi ${ariaLabel}`}
      >
        <PlusIcon className="h-3 w-3" />
      </button>
    </div>
  );
}

function formatAmount(n: number): string {
  // 12.450 style — Italian thousands separator, matching the mockups.
  return n.toLocaleString('it-IT');
}

export interface GameHeaderProps {
  profile?: PlayerProfile;
  onAddGold?: () => void;
  onAddGems?: () => void;
}

/**
 * Fixed top header.
 *
 * Layout (compact, two rows):
 *   ┌ avatar ─┬─ username ─────────────────── gold-chip ┐
 *   │         │  Livello N                   gem-chip   │
 *   │         │  [====EXP====]                          │
 *   └─────────┴──────────────────────────────────────────┘
 */
export function GameHeader({
  profile = playerProfile,
  onAddGold,
  onAddGems,
}: GameHeaderProps) {
  const { avatar, username, experience, wallet } = profile;

  return (
    <header
      className="
        fixed inset-x-0 top-0 z-40
        mx-auto w-full max-w-app
        border-b border-border-subtle
        bg-bg-base/95 backdrop-blur supports-[backdrop-filter]:bg-bg-base/80
      "
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
    >
      <div className="flex items-center gap-3 px-3 py-2">
        {/* Avatar */}
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border-2 border-accent-red bg-bg-elevated">
          <Sprite sprite={avatar} size="100%" className="h-full w-full" />
        </div>

        {/* Name + level + EXP */}
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-baseline gap-2">
            <span className="truncate text-sm font-semibold text-accent">
              {username}
            </span>
          </div>
          <span className="text-xxs leading-tight text-text-secondary">
            Livello {experience.level}
          </span>
          <ProgressBar
            current={experience.current}
            max={experience.max}
            color="#3FA9F5"
            height={5}
            className="mt-1"
            showLabel
            label={`${experience.current}/${experience.max}`}
          />
        </div>

        {/* Currencies */}
        <div className="flex shrink-0 flex-col items-end gap-1.5">
          <CurrencyChip
            icon={<GoldCoinIcon />}
            amount={wallet.gold}
            onAdd={onAddGold}
            ariaLabel="oro"
          />
          <CurrencyChip
            icon={<GemIcon />}
            amount={wallet.gem}
            onAdd={onAddGems}
            ariaLabel="gemme"
          />
        </div>
      </div>
    </header>
  );
}
