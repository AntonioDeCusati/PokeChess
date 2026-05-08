import Phaser from 'phaser';
import { BattleScene } from './BattleScene';

export function createBattleConfig(
  parent: HTMLElement,
  width: number,
  height: number,
): Phaser.Types.Core.GameConfig {
  return {
    type: Phaser.AUTO,
    parent,
    width,
    height,
    backgroundColor: '#0B0D12',
    pixelArt: true,
    scale: {
      mode: Phaser.Scale.NONE,
    },
    scene: [BattleScene],
    audio: { noAudio: true },
    input: {
      touch: { target: parent },
    },
  };
}
