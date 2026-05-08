import { useEffect, useLayoutEffect, useRef } from 'react';
import Phaser from 'phaser';
import type { BattleState } from '@/types/battle';
import { createBattleConfig } from '@/game/battle/config';
import { BattleScene } from '@/game/battle/BattleScene';
import { EventBus } from '@/game/battle/EventBus';

interface PhaserBattleProps {
  initialState: BattleState;
  onStateChange: (state: BattleState) => void;
  onSceneReady: (scene: BattleScene) => void;
}

export function PhaserBattle({ initialState, onStateChange, onSceneReady }: PhaserBattleProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el || gameRef.current) return;

    const w = el.clientWidth;
    const h = el.clientHeight;

    const config = createBattleConfig(el, w, h);
    const game = new Phaser.Game(config);
    gameRef.current = game;

    game.scene.start('BattleScene', { state: initialState });

    return () => {
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, []);

  useEffect(() => {
    const handleReady = (scene: BattleScene) => onSceneReady(scene);
    const handleChange = (state: BattleState) => onStateChange(state);

    EventBus.on('scene-ready', handleReady);
    EventBus.on('state-changed', handleChange);

    return () => {
      EventBus.off('scene-ready', handleReady);
      EventBus.off('state-changed', handleChange);
    };
  }, [onSceneReady, onStateChange]);

  return (
    <div
      ref={containerRef}
      className="flex-1 w-full"
      style={{ touchAction: 'none' }}
    />
  );
}
