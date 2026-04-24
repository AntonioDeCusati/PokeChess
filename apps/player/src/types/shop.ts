import type { ShopItemId, SpriteRef } from './common';

/**
 * Shop item categories map 1:1 to the mockup's sections:
 * "OFFERTE SPECIALI", "BAULI", "ORO", "GEMME".
 */
export type ShopCategory = 'offer' | 'chest' | 'gold-pack' | 'gem-pack';

/** Badge shown on premium offers (MIGLIORE, POPOLARE, LIMITATO). */
export type OfferBadge = 'best' | 'popular' | 'limited';

/** Price paid in real money (EUR) — shown as "€9,99". */
export interface RealMoneyPrice {
  kind: 'real';
  currency: 'EUR';
  amount: number;
}

/** Price paid in gems (diamond icon). */
export interface GemPrice {
  kind: 'gem';
  amount: number;
}

/** Price paid in gold (coin icon). */
export interface GoldPrice {
  kind: 'gold';
  amount: number;
}

/** Free item (e.g. the Wooden Chest — "Gratis"). */
export interface FreePrice {
  kind: 'free';
  /** Optional daily-like limit string shown below, e.g. "1/1". */
  limitLabel?: string;
}

export type ShopPrice = RealMoneyPrice | GemPrice | GoldPrice | FreePrice;

/** Chest tiers shown in the "BAULI" row. */
export type ChestTier = 'wood' | 'iron' | 'gold' | 'diamond';

/** Optional bonus label drawn across the artwork (e.g. "x2 Valore", "+20%"). */
export interface ShopBadge {
  kind: OfferBadge;
  label: string;
}

/**
 * A single shop listing. Category discriminates optional fields.
 */
export interface ShopItem {
  id: ShopItemId;
  category: ShopCategory;
  title: string;
  subtitle?: string;
  sprite: SpriteRef;
  price: ShopPrice;
  badge?: ShopBadge;
  /** Only set when category === "chest". */
  chestTier?: ChestTier;
  /** Overlay label, e.g. "x2 Valore" on the best offer. */
  valueTag?: string;
}
