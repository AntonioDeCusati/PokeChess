import {
  BattleButton,
  DailyRewardsSection,
  HeroScene,
  SeasonBanner,
  StatisticsSection,
  VictoryChestCard,
} from '@/components/home';
import { seasonProgress, victoryChest } from '@/data';

/**
 * Home screen (mockup #3).
 *
 * Vertical stack:
 *   1. SeasonBanner   — "Stagione 2" + 120/200 + Missioni
 *   2. HeroScene      — castle/background illustration
 *   3. BattleButton   — primary CTA
 *   4. VictoryChest   — "Baule della vittoria" / APRI
 *   5. DailyRewards   — 5 day strip
 *   6. Statistics     — Trofei + Vittorie
 */
export function HomePage() {
  return (
    <div className="flex flex-col gap-3 px-3 py-3">
      <SeasonBanner season={seasonProgress} />
      <HeroScene />
      <BattleButton />
      <VictoryChestCard chest={victoryChest} />
      <DailyRewardsSection />
      <StatisticsSection />
    </div>
  );
}
