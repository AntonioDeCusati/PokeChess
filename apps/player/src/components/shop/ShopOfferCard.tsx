import { Sprite } from '@/components/Sprite';
import type { ShopItem } from '@/types';
import { OfferBadgeRibbon } from './OfferBadgeRibbon';
import { PriceChip } from './PriceChip';

export interface ShopOfferCardProps {
  item: ShopItem;
  onBuy?: (item: ShopItem) => void;
}

/**
 * Special-offer card (OFFERTE SPECIALI row).
 * Taller than the currency/chest tiles, badge ribbon on top, optional
 * "value tag" chip sitting on the artwork (e.g. "x2 Valore", "+20%").
 */
export function ShopOfferCard({ item, onBuy }: ShopOfferCardProps) {
  return (
    <div
      className="
        relative flex h-full flex-col gap-2 overflow-hidden
        rounded-card border border-border-subtle bg-bg-elevated p-2 pt-8
      "
    >
      {item.badge && <OfferBadgeRibbon badge={item.badge} />}

      <div className="relative flex flex-1 items-center justify-center py-1">
        <Sprite
          sprite={item.sprite}
          width="80%"
          height="80%"
          alt={item.title}
        />
        {item.valueTag && (
          <span
            className="
              absolute bottom-0 right-0 rounded-tile bg-accent-red
              px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide
              text-white shadow-[0_1px_0_rgba(0,0,0,0.35)]
            "
          >
            {item.valueTag}
          </span>
        )}
      </div>

      <span className="min-h-[30px] text-center text-[11px] font-semibold leading-tight text-text-primary">
        {item.title}
      </span>

      <PriceChip price={item.price} onClick={() => onBuy?.(item)} />
    </div>
  );
}
