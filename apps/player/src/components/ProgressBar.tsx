import type { CSSProperties } from 'react';

export interface ProgressBarProps {
  current: number;
  max: number;
  /** Height in px. Default 6. */
  height?: number;
  /** Fill color (any CSS color or Tailwind var). */
  color?: string;
  /** Track color. */
  trackColor?: string;
  /** Optional extra classes for the outer container. */
  className?: string;
  /** Show numeric label aligned to the right of the bar. */
  showLabel?: boolean;
  /** Label override (defaults to "current/max"). */
  label?: string;
}

/**
 * A thin, game-styled progress bar used for EXP, creature shards,
 * season progress, etc. Accessible via `role="progressbar"`.
 */
export function ProgressBar({
  current,
  max,
  height = 6,
  color = '#3FA9F5',
  trackColor = '#1F242C',
  className = '',
  showLabel = false,
  label,
}: ProgressBarProps) {
  const clampedMax = Math.max(max, 1);
  const clampedCurrent = Math.min(Math.max(current, 0), clampedMax);
  const pct = (clampedCurrent / clampedMax) * 100;

  const trackStyle: CSSProperties = {
    height,
    backgroundColor: trackColor,
  };
  const fillStyle: CSSProperties = {
    width: `${pct}%`,
    backgroundColor: color,
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div
        role="progressbar"
        aria-valuenow={clampedCurrent}
        aria-valuemin={0}
        aria-valuemax={clampedMax}
        className="relative flex-1 overflow-hidden rounded-pill shadow-insetBar"
        style={trackStyle}
      >
        <div
          className="h-full rounded-pill transition-[width] duration-300 ease-out"
          style={fillStyle}
        />
      </div>
      {showLabel && (
        <span className="shrink-0 text-xxs font-semibold tabular-nums text-text-secondary">
          {label ?? `${clampedCurrent}/${clampedMax}`}
        </span>
      )}
    </div>
  );
}
