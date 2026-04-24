import { GemIcon, GoldCoinIcon } from '@/components/icons';
import { formatCurrencyEur, formatNumber } from '@/lib/format';
import type { ShopPrice } from '@/types';

export interface PriceChipProps {
  price: ShopPrice;
  onClick?: () => void;
  /** If true renders full width (default). */
  fullWidth?: boolean;
  /** Override the tone (normally derived from price kind). */
  tone?: 'buy' | 'free' | 'gold' | 'gem';
}

const toneClasses: Record<NonNullable<PriceChipProps['tone']>, string> = {
  buy:  'bg-success text-white hover:brightness-110 active:brightness-95',
  free: 'bg-success text-white hover:brightness-110 active:brightness-95',
  gold: 'bg-bg-elevated text-text-primary border border-border-strong hover:bg-bg-hover',
  gem:  'bg-bg-elevated text-text-primary border border-border-strong hover:bg-bg-hover',
};

function priceContent(price: ShopPrice) {
  switch (price.kind) {
    case 'real':
      return formatCurrencyEur(price.amount);
    case 'free':
      return 'Gratis';
    case 'gold':
      return (
        <span className="inline-flex items-center gap-1 tabular-nums">
          <GoldCoinIcon className="h-4 w-4" />
          {formatNumber(price.amount)}
        </span>
      );
    case 'gem':
      return (
        <span className="inline-flex items-center gap-1 tabular-nums">
          <GemIcon className="h-4 w-4" />
          {formatNumber(price.amount)}
        </span>
      );
  }
}

function resolveTone(price: ShopPrice, explicit?: PriceChipProps['tone']) {
  if (explicit) return explicit;
  if (price.kind === 'real') return 'buy';
  if (price.kind === 'free') return 'free';
  if (price.kind === 'gold') return 'gold';
  return 'gem';
}

/**
 * The CTA button shown at the bottom of every shop tile.
 * Content and color follow the price kind automatically.
 */
export function PriceChip({ price, onClick, fullWidth = true, tone }: PriceChipProps) {
  const resolved = resolveTone(price, tone);
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'inline-flex h-8 items-center justify-center rounded-tile px-3',
        'text-xs font-semibold transition-colors',
        fullWidth ? 'w-full' : '',
        toneClasses[resolved],
      ].join(' ')}
    >
      {priceContent(price)}
    </button>
  );
}
