import { MoveIcon } from '@/components/icons';
import { moves } from '@/data';
import type { Move, MovePattern } from '@/types';

interface MovePickerModalProps {
  currentMoveId: string;
  /** Set of move patterns already used by other slots (for queen limit). */
  usedMovePatterns: Map<MovePattern, number>;
  onPick: (move: Move) => void;
  onClose: () => void;
}

const MAX_PER_PATTERN: Partial<Record<MovePattern, number>> = {
  projection: 1,
};

export function MovePickerModal({
  currentMoveId,
  usedMovePatterns,
  onPick,
  onClose,
}: MovePickerModalProps) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-app rounded-t-2xl border-t border-border-subtle bg-bg-elevated p-4 pb-8 animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-bold text-text-primary">Scegli Movimento</h3>
          <button
            onClick={onClose}
            className="text-xs text-text-muted hover:text-text-primary"
          >
            Chiudi
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {moves.map((move) => {
            const isCurrent = move.id === currentMoveId;
            const count = usedMovePatterns.get(move.pattern) ?? 0;
            const max = MAX_PER_PATTERN[move.pattern];
            const isLimited = max !== undefined && count >= max && !isCurrent;

            return (
              <button
                key={move.id}
                disabled={isLimited}
                onClick={() => { if (!isLimited) onPick(move); }}
                className={`
                  flex flex-col items-center gap-1.5 rounded-card border p-3 transition
                  ${isCurrent
                    ? 'border-accent bg-accent/10'
                    : isLimited
                      ? 'border-border-subtle bg-bg-base/50 opacity-40 cursor-not-allowed'
                      : 'border-border-subtle bg-bg-base hover:border-accent/50'
                  }
                `}
              >
                <MoveIcon pattern={move.pattern} className={`h-6 w-6 ${isCurrent ? 'text-accent' : 'text-text-primary'}`} />
                <span className={`text-[11px] font-semibold ${isCurrent ? 'text-accent' : 'text-text-primary'}`}>
                  {move.label}
                </span>
                {isLimited && (
                  <span className="text-[9px] text-danger">Max {max}</span>
                )}
                {isCurrent && (
                  <span className="text-[9px] text-accent">Attuale</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
