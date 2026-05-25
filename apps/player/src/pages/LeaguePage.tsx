import { useNavigate } from 'react-router-dom';
import { Section } from '@/components/Section';
import { LiveEventCard } from '@/components/league';
import { liveEvents, REGIONS } from '@/data';

const MEDAL_PLACEHOLDERS = Array.from({ length: 8 }, (_, i) => i);

export function LeaguePage() {
  const nav = useNavigate();

  // TODO: fetch from user profile / DB
  const currentRegion = REGIONS[0];
  const medalsWon = 2; // first N medals won

  return (
    <div className="flex flex-col gap-3 px-3 py-3">
      <h1 className="text-lg font-bold tracking-[0.12em] text-text-primary">
        LEGA
      </h1>

      {/* --- EVENTI LIVE (horizontal scroll) --- */}
      <Section title="Eventi Live" subtitle="Sfida altri giocatori e vinci ricompense esclusive!">
        <div className="flex gap-2.5 overflow-x-auto no-scrollbar -mx-1 px-1 pb-1">
          {liveEvents.map((event) => (
            <div key={event.id} className="shrink-0 w-[280px]">
              <LiveEventCard event={event} />
            </div>
          ))}
        </div>
      </Section>

      {/* --- ALLENATI card --- */}
      <button
        type="button"
        onClick={() => nav('/training')}
        className="
          relative overflow-hidden rounded-card border border-border-subtle
          bg-gradient-to-r from-bg-elevated to-bg-surface
          p-4 text-left transition hover:border-accent/40 active:scale-[0.98]
        "
      >
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/15 text-2xl">
            ⚔️
          </div>
          <div>
            <h3 className="text-sm font-bold text-text-primary">Allenati</h3>
            <p className="text-[11px] text-text-secondary">
              Affronta la IA e migliora la tua strategia
            </p>
          </div>
        </div>
      </button>

      {/* --- ROAD TO CHAMPIONS card --- */}
      <button
        type="button"
        onClick={() => nav('/campaign')}
        className="
          relative overflow-hidden rounded-card border border-accent/30
          bg-gradient-to-br from-[#1A1810] via-bg-elevated to-[#12161A]
          p-4 text-left transition hover:border-accent/60 active:scale-[0.98]
        "
      >
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-bold text-accent">Road to Champions</h3>
            <p className="text-[11px] text-text-secondary mt-0.5">
              Regione: <span className="font-semibold text-text-primary">{currentRegion}</span>
            </p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/15 text-xl">
            🏆
          </div>
        </div>

        {/* Medals row */}
        <div className="flex gap-1.5">
          {MEDAL_PLACEHOLDERS.map((i) => {
            const won = i < medalsWon;
            return (
              <div
                key={i}
                className={`
                  flex h-9 w-9 items-center justify-center rounded-lg border text-sm font-bold
                  ${won
                    ? 'border-green-500/40 bg-green-500/15 text-green-400'
                    : 'border-border-subtle bg-bg-base/60 text-text-secondary/30 grayscale'
                  }
                `}
              >
                {won ? '🏅' : '🏅'}
              </div>
            );
          })}
        </div>
      </button>
    </div>
  );
}
