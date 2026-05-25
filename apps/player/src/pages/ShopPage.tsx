import { useCallback, useState } from 'react';
import { Section } from '@/components/Section';
import { ShopOfferCard, ShopTileCard } from '@/components/shop';
import { ChestIcon } from '@/components/chest/ChestIcon';
import { PhaserChestReveal } from '@/components/chest/PhaserChestReveal';
import { gemPacks, goldPacks, offerItems } from '@/data';
import { useChests, type ChestTier, type ChestOpenResult } from '@/hooks/useChests';
import { useProfile } from '@/hooks/useProfile';

const TIER_ORDER: ChestTier[] = ['wood', 'iron', 'gold', 'diamond'];

const TIER_META: Record<ChestTier, { label: string; desc: string }> = {
  wood:    { label: 'Legno',    desc: 'Creature comuni' },
  iron:    { label: 'Ferro',    desc: 'Buone probabilità rare' },
  gold:    { label: 'Oro',      desc: 'Creature epiche garantite' },
  diamond: { label: 'Diamante', desc: 'Leggendarie frequenti' },
};

const TIER_COST: Record<ChestTier, { label: string; icon: string }> = {
  wood:    { label: '100', icon: '🪙' },
  iron:    { label: '150', icon: '💎' },
  gold:    { label: '450', icon: '💎' },
  diamond: { label: '1200', icon: '💎' },
};

export function ShopPage() {
  const { slots, loading, buyChest, grantChest } = useChests();
  const { refreshProfile } = useProfile();
  const [opening, setOpening] = useState(false);
  const [result, setResult] = useState<(ChestOpenResult & { tier: ChestTier }) | null>(null);

  const handleBuy = useCallback(async (tier: ChestTier) => {
    if (opening) return;
    setOpening(true);
    try {
      const res = await buyChest(tier);
      setResult({ ...res, tier });
      refreshProfile();
    } catch (err: any) {
      alert(err?.message ?? 'Errore apertura baule');
    } finally {
      setOpening(false);
    }
  }, [opening, buyChest, refreshProfile]);

  const handleRevealDone = useCallback(() => {
    setResult(null);
  }, []);

  return (
    <div className="flex flex-col gap-3 px-3 py-3">
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

      <Section title="Bauli" subtitle="Acquista e apri subito un baule">
        {loading ? (
          <p className="text-center text-xs text-text-secondary py-4">Caricamento...</p>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {TIER_ORDER.map((tier) => {
              const meta = TIER_META[tier];
              const cost = TIER_COST[tier];
              const inv = slots.find((s) => s.tier === tier);
              const qty = inv?.quantity ?? 0;

              return (
                <div
                  key={tier}
                  className="flex flex-col items-center gap-2 rounded-card border border-border-subtle bg-bg-elevated p-3"
                >
                  <ChestIcon tier={tier} size={64} />

                  <div className="text-center">
                    <p className="text-sm font-bold text-text-primary">{meta.label}</p>
                    <p className="text-[10px] text-text-secondary">{meta.desc}</p>
                  </div>

                  {qty > 0 && (
                    <span className="text-[10px] text-text-muted">
                      In inventario: x{qty}
                    </span>
                  )}

                  <button
                    disabled={opening}
                    onClick={() => handleBuy(tier)}
                    className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-accent py-2 text-xs font-bold text-black hover:bg-accent/90 transition disabled:opacity-50"
                  >
                    {opening ? '...' : (
                      <>
                        <span>{cost.icon}</span>
                        <span>{cost.label}</span>
                      </>
                    )}
                  </button>

                  {import.meta.env.DEV && (
                    <button
                      onClick={() => grantChest(tier, 5)}
                      className="text-[9px] text-text-muted underline"
                    >
                      +5 inventario (dev)
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </Section>

      <Section title="Probabilità" subtitle="Ogni baule ha diverse probabilità di drop">
        <div className="overflow-x-auto">
          <table className="w-full text-[11px] text-text-secondary">
            <thead>
              <tr className="border-b border-border-subtle">
                <th className="py-1 text-left font-semibold text-text-primary">Baule</th>
                <th className="py-1 text-center">Comune</th>
                <th className="py-1 text-center text-blue-400">Raro</th>
                <th className="py-1 text-center text-purple-400">Epico</th>
                <th className="py-1 text-center text-yellow-400">Leggend.</th>
              </tr>
            </thead>
            <tbody>
              {[
                { t: 'Legno',    c: '75%', r: '20%', e: '4.5%', l: '0.5%' },
                { t: 'Ferro',    c: '55%', r: '30%', e: '12%',  l: '3%'   },
                { t: 'Oro',      c: '30%', r: '35%', e: '25%',  l: '10%'  },
                { t: 'Diamante', c: '5%',  r: '20%', e: '40%',  l: '35%'  },
              ].map((row) => (
                <tr key={row.t} className="border-b border-border-subtle/50">
                  <td className="py-1.5 font-medium text-text-primary">{row.t}</td>
                  <td className="py-1.5 text-center">{row.c}</td>
                  <td className="py-1.5 text-center text-blue-400">{row.r}</td>
                  <td className="py-1.5 text-center text-purple-400">{row.e}</td>
                  <td className="py-1.5 text-center text-yellow-400">{row.l}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-[10px] text-text-muted italic">
          Sistema pity: le probabilità aumentano dopo aperture consecutive senza epiche o leggendarie.
        </p>
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

      {result && (
        <PhaserChestReveal
          pokedexPath={result.creature.pokedexPath}
          rarity={result.creature.rarity}
          name={result.creature.name}
          tier={result.tier}
          isNew={result.isNew}
          wasPity={result.wasPity}
          onDone={handleRevealDone}
        />
      )}
    </div>
  );
}
