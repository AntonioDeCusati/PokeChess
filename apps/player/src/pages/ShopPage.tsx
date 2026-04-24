import { Section } from '@/components/Section';
import {
  ShopOfferCard,
  ShopTileCard,
} from '@/components/shop';
import {
  chestItems,
  gemPacks,
  goldPacks,
  offerItems,
} from '@/data';

/**
 * Shop screen (mockup #1).
 *
 * 4 stacked sections:
 *   1. OFFERTE SPECIALI  — 3 tall offer cards with badges
 *   2. BAULI             — 4 chest tiers
 *   3. ORO               — 3 gold packs
 *   4. GEMME             — 3 gem packs
 */
export function ShopPage() {
  return (
    <div className="flex flex-col gap-3 px-3 py-3">
      {/* Page heading */}
      <h1 className="text-lg font-bold tracking-[0.12em] text-text-primary">
        NEGOZIO
      </h1>

      <Section title="Offerte Speciali">
        <ul className="grid grid-cols-3 gap-2">
          {offerItems.map((item) => (
            <li key={item.id}>
              <ShopOfferCard item={item} />
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Bauli">
        <ul className="grid grid-cols-4 gap-2">
          {chestItems.map((item) => (
            <li key={item.id}>
              <ShopTileCard item={item} />
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Oro">
        <ul className="grid grid-cols-3 gap-2">
          {goldPacks.map((item) => (
            <li key={item.id}>
              <ShopTileCard item={item} />
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Gemme">
        <ul className="grid grid-cols-3 gap-2">
          {gemPacks.map((item) => (
            <li key={item.id}>
              <ShopTileCard item={item} />
            </li>
          ))}
        </ul>
      </Section>
    </div>
  );
}
