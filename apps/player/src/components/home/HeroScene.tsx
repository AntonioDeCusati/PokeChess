import { Sprite } from '@/components/Sprite';
import { backgrounds } from '@/data';

/**
 * The castle/landscape illustration sitting above the BATTAGLIA button.
 * Reads the active background from the data layer (so swapping the
 * "Sfondo" config later updates the Home hero automatically).
 */
export function HeroScene() {
  const active = backgrounds[0];
  if (!active) return null;
  return (
    <div
      className="
        relative mx-auto aspect-[4/3] w-full overflow-hidden
        rounded-card border border-border-subtle
      "
    >
      <Sprite
        sprite={active.image}
        width="100%"
        height="100%"
        alt={active.name}
        className="h-full w-full"
      />
      {/* Subtle vignette so the BATTAGLIA CTA keeps visual dominance. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, transparent 40%, rgba(11,13,18,0.55) 100%)',
        }}
      />
    </div>
  );
}
