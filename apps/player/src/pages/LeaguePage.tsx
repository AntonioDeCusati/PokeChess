import { Section } from '@/components/Section';
import {
  GymCard,
  LiveEventCard,
  TrainingTierCard,
} from '@/components/league';
import { gyms, liveEvents, trainingTiers } from '@/data';

/**
 * League screen (mockup #4).
 *
 * 3 sections:
 *   1. EVENTI LIVE   — live event hero cards (Torneo del Fuoco)
 *   2. ALLENAMENTO   — 3 difficulty tiers (facile / medio / difficile)
 *   3. PALESTRE      — 4 gym cards with defeated/locked states
 */
export function LeaguePage() {
  return (
    <div className="flex flex-col gap-3 px-3 py-3">
      <h1 className="text-lg font-bold tracking-[0.12em] text-text-primary">
        LEGA
      </h1>

      <Section
        title="Eventi Live"
        subtitle="Sfida altri giocatori e vinci ricompense esclusive!"
      >
        <div className="flex flex-col gap-2">
          {liveEvents.map((event) => (
            <LiveEventCard key={event.id} event={event} />
          ))}
        </div>
      </Section>

      <Section
        title="Allenamento"
        subtitle="Affronta la IA e migliora la tua squadra."
      >
        <div className="grid grid-cols-3 gap-2">
          {trainingTiers.map((tier) => (
            <TrainingTierCard key={tier.difficulty} tier={tier} />
          ))}
        </div>
      </Section>

      <Section
        title="Palestre"
        subtitle="Sconfiggi i Leader e ottieni trofei!"
      >
        <ul className="grid grid-cols-4 gap-2">
          {gyms.map((gym) => (
            <li key={gym.id}>
              <GymCard gym={gym} />
            </li>
          ))}
        </ul>
      </Section>
    </div>
  );
}
