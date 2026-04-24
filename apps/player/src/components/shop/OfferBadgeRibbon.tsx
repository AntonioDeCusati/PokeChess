import type { ShopBadge } from '@/types';

const toneByBadge: Record<ShopBadge['kind'], string> = {
  best:    'bg-rarity-best text-white',
  popular: 'bg-rarity-popular text-white',
  limited: 'bg-rarity-limited text-white',
};

/** The colored ribbon at the top of a special-offer card. */
export function OfferBadgeRibbon({ badge }: { badge: ShopBadge }) {
  return (
    <span
      className={[
        'absolute left-1.5 right-1.5 top-1.5 z-10 flex h-5 items-center justify-center',
        'rounded-tile text-[10px] font-bold uppercase tracking-[0.1em]',
        'shadow-[0_1px_0_rgba(0,0,0,0.35)]',
        toneByBadge[badge.kind],
      ].join(' ')}
    >
      {badge.label}
    </span>
  );
}
