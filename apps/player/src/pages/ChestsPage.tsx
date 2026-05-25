import { useState } from 'react';
import { Section } from '@/components/Section';
import { ChestIcon } from '@/components/chest/ChestIcon';
import { ChestRevealModal } from '@/components/chest/ChestRevealModal';
import { useChests, type ChestTier, type ChestOpenResult } from '@/hooks/useChests';

const TIER_META: Record<ChestTier, { label: string; desc: string; gemCost: number | null }> = {
  wood:    { label: 'Legno',    desc: 'Creature comuni',           gemCost: null },
  iron:    { label: 'Ferro',    desc: 'Buone probabilità rare',    gemCost: 150 },
  gold:    { label: 'Oro',      desc: 'Creature epiche garantite', gemCost: 450 },
  diamond: { label: 'Diamante', desc: 'Leggendarie frequenti',     gemCost: 1200 },
};

const TIER_ORDER: ChestTier[] = ['wood', 'iron', 'gold', 'diamond'];

export function ChestsPage() {
  const { slots, loading, openChest, grantChest } = useChests();
  const [opening, setOpening] = useState(false);
  const [result, setResult] = useState<ChestOpenResult | null>(null);

  const handleOpen = async (tier: ChestTier) => {
    if (opening) return;
    setOpening(true);
    try {
      const res = await openChest(tier);
      setResult(res);
    } catch (err: any) {
      alert(err?.message ?? 'Errore apertura baule');
    } finally {
      setOpening(false);
    }
  };

  const handleDevGrant = async (tier: ChestTier) => {
    await grantChest(tier, 5);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <span className="text-text-secondary text-sm">Caricamento...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 px-3 py-3">
      <h1 className="text-lg font-bold tracking-[0.12em] text-text-primary">
        BAULI
      </h1>

      <Section title="I tuoi Bauli" subtitle="Apri un baule per ottenere nuove creature">
        <div className="grid grid-cols-2 gap-3">
          {TIER_ORDER.map((tier) => {
            const meta = TIER_META[tier];
            const slot = slots.find((s) => s.tier === tier);
            const qty = slot?.quantity ?? 0;

            return (
              <div
                key={tier}
                className="flex flex-col items-center gap-2 rounded-card border border-border-subtle bg-bg-elevated p-3"
              >
                <ChestIcon tier={tier} size={72} />

                <div className="text-center">
                  <p className="text-sm font-bold text-text-primary">{meta.label}</p>
                  <p className="text-[10px] text-text-secondary">{meta.desc}</p>
                </div>

                <span className="text-xs font-semibold text-text-muted">
                  x{qty}
                </span>

                <button
                  disabled={qty <= 0 || opening}
                  onClick={() => handleOpen(tier)}
                  className={`
                    w-full rounded-lg py-2 text-xs font-bold transition
                    ${qty > 0
                      ? 'bg-accent text-black hover:bg-accent/90'
                      : 'bg-bg-base text-text-secondary cursor-not-allowed'
                    }
                  `}
                >
                  {opening ? '...' : 'APRI'}
                </button>

                {import.meta.env.DEV && (
                  <button
                    onClick={() => handleDevGrant(tier)}
                    className="text-[9px] text-text-muted underline"
                  >
                    +5 (dev)
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </Section>

      <Section title="Probabilità" subtitle="Ogni baule ha diverse probabilità">
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
                { tier: 'Legno',    c: '75%', r: '20%', e: '4.5%', l: '0.5%' },
                { tier: 'Ferro',    c: '55%', r: '30%', e: '12%',  l: '3%'   },
                { tier: 'Oro',      c: '30%', r: '35%', e: '25%',  l: '10%'  },
                { tier: 'Diamante', c: '5%',  r: '20%', e: '40%',  l: '35%'  },
              ].map((row) => (
                <tr key={row.tier} className="border-b border-border-subtle/50">
                  <td className="py-1.5 font-medium text-text-primary">{row.tier}</td>
                  <td className="py-1.5 text-center">{row.c}</td>
                  <td className="py-1.5 text-center text-blue-400">{row.r}</td>
                  <td className="py-1.5 text-center text-purple-400">{row.e}</td>
                  <td className="py-1.5 text-center text-yellow-400">{row.l}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-[10px] text-text-muted">
          Sistema pity: le probabilità aumentano dopo aperture consecutive senza epiche o leggendarie.
        </p>
      </Section>

      {result && (
        <ChestRevealModal
          creature={result.creature}
          isNew={result.isNew}
          wasPity={result.wasPity}
          onClose={() => setResult(null)}
        />
      )}
    </div>
  );
}
