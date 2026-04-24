import { SwordsIcon } from '@/components/icons';

export interface BattleButtonProps {
  onClick?: () => void;
}

/**
 * The dominant CTA on the Home screen.
 * Tall, bright gold, with a swords glyph on the left. Full-width.
 */
export function BattleButton({ onClick }: BattleButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        relative flex h-14 w-full items-center justify-center gap-3
        rounded-card
        bg-gradient-to-b from-[#F5C552] to-[#C78A1A]
        font-display text-[15px] uppercase tracking-[0.15em] text-[#3A2A0B]
        shadow-[0_3px_0_0_#7A4E10,0_6px_12px_rgba(0,0,0,0.35)]
        transition-transform active:translate-y-0.5 active:shadow-[0_1px_0_0_#7A4E10]
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-hover
      "
    >
      <SwordsIcon className="h-6 w-6" />
      <span>Battaglia</span>
    </button>
  );
}
