import { Section } from '@/components/Section';
import { SwordsIcon, TrophyIcon } from '@/components/icons';
import { playerStats } from '@/data';
import { formatNumber } from '@/lib/format';
import type { PlayerStats } from '@/types';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  subline?: string;
  sublineTone?: 'positive' | 'muted';
  iconTint?: string;
}

function StatCard({
  icon,
  label,
  value,
  subline,
  sublineTone = 'muted',
  iconTint = 'text-accent',
}: StatCardProps) {
  return (
    <div className="flex items-center gap-3 rounded-card border border-border-subtle bg-bg-elevated p-3">
      <div className={`shrink-0 ${iconTint}`}>{icon}</div>
      <div className="min-w-0 flex-1">
        <span className="text-[10px] font-semibold uppercase tracking-wide text-text-secondary">
          {label}
        </span>
        <div className="text-lg font-bold leading-none text-text-primary">
          {value}
        </div>
        {subline && (
          <span
            className={[
              'text-xxs font-medium',
              sublineTone === 'positive' ? 'text-success' : 'text-text-secondary',
            ].join(' ')}
          >
            {subline}
          </span>
        )}
      </div>
    </div>
  );
}

export interface StatisticsSectionProps {
  stats?: PlayerStats;
}

export function StatisticsSection({ stats = playerStats }: StatisticsSectionProps) {
  return (
    <Section title="Statistiche">
      <div className="grid grid-cols-2 gap-2">
        <StatCard
          icon={<TrophyIcon className="h-7 w-7" />}
          label="Trofei"
          value={formatNumber(stats.trophies)}
          subline={stats.trophiesDelta ? `+${stats.trophiesDelta}` : undefined}
          sublineTone="positive"
          iconTint="text-accent"
        />
        <StatCard
          icon={<SwordsIcon className="h-7 w-7" />}
          label="Vittorie"
          value={formatNumber(stats.victories)}
          subline={stats.topPercent}
          iconTint="text-accent-red"
        />
      </div>
    </Section>
  );
}
