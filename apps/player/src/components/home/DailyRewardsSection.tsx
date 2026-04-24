import { Section } from '@/components/Section';
import { dailyRewards } from '@/data';
import type { DailyReward } from '@/types';
import { DailyRewardTile } from './DailyRewardTile';

export interface DailyRewardsSectionProps {
  rewards?: readonly DailyReward[];
}

export function DailyRewardsSection({
  rewards = dailyRewards,
}: DailyRewardsSectionProps) {
  return (
    <Section title="Ricompense Giornaliere">
      <ul className="grid grid-cols-5 gap-2">
        {rewards.map((r) => (
          <li key={r.day}>
            <DailyRewardTile reward={r} />
          </li>
        ))}
      </ul>
    </Section>
  );
}
