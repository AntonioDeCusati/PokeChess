import type {
  BackgroundId,
  SpriteRef,
  SupportId,
  TrainerId,
} from './common';

/**
 * The 3 items in the "Configurazione" section of the Board screen:
 * Supporto, Allenatore, Sfondo. Each has its own shape but shares a
 * preview + label + change action pattern.
 */

export interface SupportUnit {
  id: SupportId;
  name: string;
  sprite: SpriteRef;
  description?: string;
}

export interface Trainer {
  id: TrainerId;
  name: string;
  avatar: SpriteRef;
}

export interface Background {
  id: BackgroundId;
  name: string;
  image: SpriteRef;
}

/** Aggregated "Configurazione" selection. */
export interface BoardConfiguration {
  supportId: SupportId;
  trainerId: TrainerId;
  backgroundId: BackgroundId;
}
