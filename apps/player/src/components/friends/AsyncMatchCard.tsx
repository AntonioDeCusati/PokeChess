import { SendIcon } from '@/components/icons';

export interface AsyncMatchCardProps {
  onStart?: () => void;
}

/**
 * The "PARTITE ASINCRONE" CTA card — invites the player to start
 * an async challenge (prominent purple button).
 */
export function AsyncMatchCard({ onStart }: AsyncMatchCardProps) {
  return (
    <div className="flex flex-col gap-3 rounded-card border border-border-subtle bg-bg-elevated p-3">
      <p className="text-xs text-text-secondary">
        Sfida i tuoi amici in una battaglia asincrona!
      </p>
      <button
        type="button"
        onClick={onStart}
        className="
          inline-flex h-10 w-full items-center justify-center gap-2
          rounded-tile bg-rarity-popular text-white
          text-xs font-bold uppercase tracking-[0.12em]
          shadow-[0_2px_0_rgba(0,0,0,0.35)]
          transition-transform hover:brightness-110 active:translate-y-px
        "
      >
        <SendIcon className="h-4 w-4" />
        Nuova Sfida
      </button>
    </div>
  );
}
