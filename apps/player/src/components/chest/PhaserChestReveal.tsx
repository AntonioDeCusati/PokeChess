import { useEffect, useLayoutEffect, useRef } from 'react';
import Phaser from 'phaser';
import { ChestOpenScene } from '@/game/chest/ChestOpenScene';
import { EventBus } from '@/game/battle/EventBus';

interface PhaserChestRevealProps {
  pokedexPath: string;
  rarity: string;
  name: string;
  tier: string;
  isNew: boolean;
  wasPity: boolean;
  onDone: () => void;
}

export function PhaserChestReveal({
  pokedexPath,
  rarity,
  name,
  tier,
  isNew,
  wasPity,
  onDone,
}: PhaserChestRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el || gameRef.current) return;

    const game = new Phaser.Game({
      type: Phaser.AUTO,
      parent: el,
      width: el.clientWidth,
      height: el.clientHeight,
      backgroundColor: '#000000',
      pixelArt: true,
      scale: { mode: Phaser.Scale.NONE },
      scene: [ChestOpenScene],
      audio: { noAudio: true },
      input: { touch: { target: el } },
      transparent: true,
    });

    gameRef.current = game;
    game.scene.start('ChestOpenScene', { pokedexPath, rarity, name, tier });

    return () => {
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, []);

  useEffect(() => {
    const handleDone = () => onDone();
    EventBus.on('chest-reveal-done', handleDone);
    return () => { EventBus.off('chest-reveal-done', handleDone); };
  }, [onDone]);

  return (
    <div className="fixed inset-0 z-[200]">
      <div
        ref={containerRef}
        className="w-full h-full"
        style={{ touchAction: 'none' }}
      />

      {/* Overlay badges on top of Phaser canvas */}
      <div className="absolute top-4 left-0 right-0 flex justify-center gap-2 pointer-events-none">
        {wasPity && (
          <span className="rounded-full bg-yellow-500/20 px-3 py-1 text-[10px] font-bold text-yellow-300 uppercase tracking-wider backdrop-blur">
            Pity garantito
          </span>
        )}
        {isNew && (
          <span className="rounded-full bg-green-500/20 px-3 py-1 text-[10px] font-bold text-green-300 uppercase tracking-wider backdrop-blur border border-green-500/30">
            Nuovo!
          </span>
        )}
      </div>
    </div>
  );
}
