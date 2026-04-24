import { Section } from '@/components/Section';
import {
  backgroundById,
  boardConfiguration,
  supportById,
  trainerById,
} from '@/data';
import type { BoardConfiguration } from '@/types';
import { ConfigCard } from './ConfigCard';

export interface ConfigurazioneSectionProps {
  config?: BoardConfiguration;
  onChangeSupport?: () => void;
  onChangeTrainer?: () => void;
  onChangeBackground?: () => void;
}

/**
 * "CONFIGURAZIONE" — 3 cards:
 *   Supporto (circle), Allenatore (circle), Sfondo (landscape tile).
 */
export function ConfigurazioneSection({
  config = boardConfiguration,
  onChangeSupport,
  onChangeTrainer,
  onChangeBackground,
}: ConfigurazioneSectionProps) {
  const support = supportById[config.supportId];
  const trainer = trainerById[config.trainerId];
  const background = backgroundById[config.backgroundId];

  return (
    <Section title="CONFIGURAZIONE">
      <div className="grid grid-cols-3 gap-2">
        {support && (
          <ConfigCard
            label="Supporto"
            preview={support.sprite}
            shape="circle"
            onChange={onChangeSupport}
          />
        )}
        {trainer && (
          <ConfigCard
            label="Allenatore"
            preview={trainer.avatar}
            shape="circle"
            onChange={onChangeTrainer}
          />
        )}
        {background && (
          <ConfigCard
            label="Sfondo"
            preview={background.image}
            shape="square"
            onChange={onChangeBackground}
          />
        )}
      </div>
    </Section>
  );
}
