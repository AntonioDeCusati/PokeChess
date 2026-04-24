import type { ShopItem, ShopItemId } from '@/types';
import { uiSprite } from './sprites';

/**
 * Exact contents of mockup #1 (Shop / Negozio):
 * - 3 special offers (best / popular / limited)
 * - 4 chest tiers (wood free, iron, gold, diamond)
 * - 3 gold packs
 * - 3 gem packs
 */

const id = (s: string) => s as ShopItemId;

export const offerItems: readonly ShopItem[] = [
  {
    id: id('offer-champion-pack'),
    category: 'offer',
    title: 'Pacchetto Campione',
    sprite: uiSprite('offer-treasure-chest', 'OF'),
    price: { kind: 'real', currency: 'EUR', amount: 9.99 },
    badge: { kind: 'best', label: 'MIGLIORE' },
    valueTag: 'x2 Valore',
  },
  {
    id: id('offer-1200-gems'),
    category: 'offer',
    title: '1200 Gemme',
    sprite: uiSprite('offer-gem-pile', 'GM'),
    price: { kind: 'real', currency: 'EUR', amount: 9.99 },
    badge: { kind: 'popular', label: 'POPOLARE' },
    valueTag: '+20%',
  },
  {
    id: id('offer-epic-monster'),
    category: 'offer',
    title: 'Mostro Epico',
    sprite: uiSprite('offer-epic-monster', 'EM'),
    price: { kind: 'real', currency: 'EUR', amount: 4.99 },
    badge: { kind: 'limited', label: 'LIMITATO' },
  },
];

export const chestItems: readonly ShopItem[] = [
  {
    id: id('chest-wood'),
    category: 'chest',
    chestTier: 'wood',
    title: 'Legno',
    sprite: uiSprite('chest-wood', 'W'),
    price: { kind: 'free', limitLabel: '1/1' },
  },
  {
    id: id('chest-iron'),
    category: 'chest',
    chestTier: 'iron',
    title: 'Ferro',
    sprite: uiSprite('chest-iron', 'I'),
    price: { kind: 'gem', amount: 150 },
  },
  {
    id: id('chest-gold'),
    category: 'chest',
    chestTier: 'gold',
    title: 'Oro',
    sprite: uiSprite('chest-gold', 'G'),
    price: { kind: 'gem', amount: 450 },
  },
  {
    id: id('chest-diamond'),
    category: 'chest',
    chestTier: 'diamond',
    title: 'Diamante',
    sprite: uiSprite('chest-diamond', 'D'),
    price: { kind: 'gem', amount: 1200 },
  },
];

export const goldPacks: readonly ShopItem[] = [
  {
    id: id('gold-1k'),
    category: 'gold-pack',
    title: '1.000',
    sprite: uiSprite('gold-small', '1K'),
    price: { kind: 'real', currency: 'EUR', amount: 0.99 },
  },
  {
    id: id('gold-5k'),
    category: 'gold-pack',
    title: '5.000',
    sprite: uiSprite('gold-medium', '5K'),
    price: { kind: 'real', currency: 'EUR', amount: 4.99 },
  },
  {
    id: id('gold-12k'),
    category: 'gold-pack',
    title: '12.000',
    sprite: uiSprite('gold-large', '12K'),
    price: { kind: 'real', currency: 'EUR', amount: 9.99 },
  },
];

export const gemPacks: readonly ShopItem[] = [
  {
    id: id('gem-100'),
    category: 'gem-pack',
    title: '100',
    sprite: uiSprite('gem-small', '100'),
    price: { kind: 'real', currency: 'EUR', amount: 0.99 },
  },
  {
    id: id('gem-550'),
    category: 'gem-pack',
    title: '550',
    sprite: uiSprite('gem-medium', '550'),
    price: { kind: 'real', currency: 'EUR', amount: 4.99 },
  },
  {
    id: id('gem-1200'),
    category: 'gem-pack',
    title: '1200',
    sprite: uiSprite('gem-large', '1200'),
    price: { kind: 'real', currency: 'EUR', amount: 9.99 },
  },
];

export const shopItems: readonly ShopItem[] = [
  ...offerItems,
  ...chestItems,
  ...goldPacks,
  ...gemPacks,
];
