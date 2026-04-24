import { Button } from '@/components/Button';
import { Sprite } from '@/components/Sprite';
import { ClockIcon, GemIcon, GoldCoinIcon } from '@/components/icons';
import { formatCountdown, formatNumber } from '@/lib/format';
import type { LeagueEvent } from '@/types';

export interface LiveEventCardProps {
  event: LeagueEvent;
  onJoin?: (event: LeagueEvent) => void;
}

/**
 * A live-event card (e.g. "Torneo del Fuoco").
 * Fire-tinted gradient to evoke the heat theme in the mockup, with a
 * hero artwork on the right, countdown, rewards, and a "PARTECIPA" CTA.
 */
export function LiveEventCard({ event, onJoin }: LiveEventCardProps) {
  const { maxReward } = event;
  return (
    <article
      className="
        relative overflow-hidden rounded-card border border-accent/40
        bg-gradient-to-br from-[#2A1512] via-[#221014] to-[#160B11]
        p-3
      "
    >
      <div className="flex items-start gap-3">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <h3 className="truncate text-base font-bold text-accent">
            {event.title}
          </h3>
          <span className="inline-flex items-center gap-1 text-xxs text-text-secondary">
            <ClockIcon className="h-3.5 w-3.5" />
            Termina tra:{' '}
            <span className="font-semibold text-text-primary">
              {formatCountdown(event.endsAt)}
            </span>
          </span>

          <span className="mt-2 text-[10px] font-semibold uppercase tracking-wide text-text-secondary">
            Ricompensa massima:
          </span>
          <div className="flex flex-wrap items-center gap-3">
            {maxReward.gems !== undefined && (
              <span className="inline-flex items-center gap-1 text-sm font-semibold tabular-nums text-text-primary">
                <GemIcon className="h-4 w-4" />
                {formatNumber(maxReward.gems)}
              </span>
            )}
            {maxReward.gold !== undefined && (
              <span className="inline-flex items-center gap-1 text-sm font-semibold tabular-nums text-text-primary">
                <GoldCoinIcon className="h-4 w-4" />
                {formatNumber(maxReward.gold)}
              </span>
            )}
          </div>
        </div>

        <Sprite
          sprite={event.heroSprite}
          size={72}
          alt={event.title}
          className="shrink-0"
        />
      </div>

      <Button
        variant="primary"
        size="md"
        fullWidth
        className="mt-3"
        onClick={() => onJoin?.(event)}
      >
        PARTECIPA
      </Button>
    </article>
  );
}
