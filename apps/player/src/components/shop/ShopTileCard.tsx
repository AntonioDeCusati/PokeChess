import { Sprite } from '@/components/Sprite';
import type { ShopItem } from '@/types';
import { PriceChip } from './PriceChip';

export interface ShopTileCardProps {
  item: ShopItem;
  onBuy?: (item: ShopItem) => void;
}

/**
 * Compact tile used for chests, gold packs, and gem packs.
 * Layout: title on top, artwork centered, price chip on the bottom.
 */
export function ShopTileCard({ item, onBuy }: ShopTileCardProps) {
  const isChest = item.category === 'chest';
  const freeLimit =
    item.price.kind === 'free' ? item.price.limitLabel : undefined;

  return (
    <div
      className="
        flex h-full flex-col items-stretch gap-2
        rounded-card border border-border-subtle bg-bg-elevated p-2
      "
    >
      <span className="text-center text-[11px] font-semibold text-text-primary">
        {item.title}
      </span>

      <div className="flex flex-1 items-center justify-center py-1">
        <Sprite
          sprite={item.sprite}
          width={isChest ? '75%' : '70%'}
          height={isChest ? '75%' : '70%'}
          alt={item.title}
        />
      </div>

      <PriceChip price={item.price} onClick={() => onBuy?.(item)} />

      {freeLimit && (
        <span className="text-center text-[10px] text-text-secondary">
          {freeLimit}
        </span>
      )}
    </div>
  );
}
