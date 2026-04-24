import { ProgressBar } from '@/components/ProgressBar';
import { ScrollIcon, TrophyIcon } from '@/components/icons';
import type { SeasonProgress } from '@/types';

export interface SeasonBannerProps {
  season: SeasonProgress;
  onOpenQuests?: () => void;
}

/**
 * Top banner on Home: season label + progress bar + "Missioni" pill.
 */
export function SeasonBanner({ season, onOpenQuests }: SeasonBannerProps) {
  return (
    <div className="section-card flex items-center gap-3">
      <TrophyIcon className="h-6 w-6 shrink-0 text-accent" />
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="text-[11px] font-bold uppercase tracking-wider text-accent">
          Stagione {season.seasonNumber}
        </span>
        <ProgressBar
          current={season.current}
          max={season.max}
          color="#E0A83B"
          height={6}
          className="mt-1"
          showLabel
          label={`${season.current}/${season.max}`}
        />
      </div>
      {season.questsLabel && (
        <button
          type="button"
          onClick={onOpenQuests}
          className="flex shrink-0 flex-col items-center gap-0.5 rounded-card border border-border-subtle bg-bg-elevated px-2 py-1.5 hover:bg-bg-hover"
        >
          <ScrollIcon className="h-5 w-5 text-accent" />
          <span className="text-[10px] font-medium text-text-primary">
            {season.questsLabel}
          </span>
        </button>
      )}
    </div>
  );
}
