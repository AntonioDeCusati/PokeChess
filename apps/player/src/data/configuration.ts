import type {
  Background,
  BackgroundId,
  BoardConfiguration,
  SupportId,
  SupportUnit,
  Trainer,
  TrainerId,
} from '@/types';
import { backgroundSprite, supportSprite, trainerSprite } from './sprites';

/** The purple creature shown in "Supporto". */
export const supportUnits: readonly SupportUnit[] = [
  {
    id: 'support-umbra' as SupportId,
    name: 'Umbra',
    sprite: supportSprite('umbra', 'UM'),
  },
];

/** The player's trainer avatar shown in "Allenatore". */
export const trainers: readonly Trainer[] = [
  {
    id: 'trainer-deku' as TrainerId,
    name: 'Deku',
    avatar: trainerSprite('deku', 'D'),
  },
];

/** Battle backgrounds selectable in "Sfondo". */
export const backgrounds: readonly Background[] = [
  {
    id: 'bg-castle-road' as BackgroundId,
    name: 'Castle Road',
    image: backgroundSprite('castle-road', 'CR'),
  },
];

/** Current Board configuration selection (mirrors the mockup). */
export const boardConfiguration: BoardConfiguration = {
  supportId: 'support-umbra' as SupportId,
  trainerId: 'trainer-deku' as TrainerId,
  backgroundId: 'bg-castle-road' as BackgroundId,
};

export const supportById = Object.fromEntries(supportUnits.map((s) => [s.id, s]));
export const trainerById = Object.fromEntries(trainers.map((t) => [t.id, t]));
export const backgroundById = Object.fromEntries(backgrounds.map((b) => [b.id, b]));
