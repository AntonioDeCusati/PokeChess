import { useLayoutEffect, useRef } from 'react';
import Phaser from 'phaser';
import { ClassicChessTestScene } from '@/game/scenes/ClassicChessTestScene';

export function ChessTestPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el || gameRef.current) return;

    const w = el.clientWidth;
    const h = el.clientHeight;

    const game = new Phaser.Game({
      type: Phaser.AUTO,
      parent: el,
      width: w,
      height: h,
      backgroundColor: '#0B0D12',
      scale: { mode: Phaser.Scale.NONE },
      scene: [ClassicChessTestScene],
      audio: { noAudio: true },
    });

    gameRef.current = game;

    return () => {
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 bg-bg-base"
      style={{ touchAction: 'none' }}
    />
  );
}
