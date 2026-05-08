import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { idleSpriteData, type IdleSpriteData } from '@/data/idle-sprite-data';

/**
 * PMD spritesheet directions (8 rows):
 *   0 = South (down)       → opponent pieces face the player
 *   1 = South-East
 *   2 = East
 *   3 = North-East
 *   4 = North (up)         → player pieces face the opponent
 *   5 = North-West (flipped NE in some sheets)
 *   6 = West (flipped E)
 *   7 = South-West (flipped SE)
 */
const DIRECTION_ROWS = 8;
const OPPONENT_ROW = 0; // facing down toward player
const PLAYER_ROW = 4;   // facing up toward opponent

interface AnimatedSpriteProps {
  pokedexPath: string;
  owner: 'player' | 'opponent';
  /** Display size in CSS units. The sprite scales to fit. */
  size?: number;
  className?: string;
}

const DEFAULT_FALLBACK: IdleSpriteData = { w: 32, h: 32, frames: 2, durs: [16, 16] };

export function AnimatedSprite({
  pokedexPath,
  owner,
  size = 40,
  className = '',
}: AnimatedSpriteProps) {
  const data = idleSpriteData[pokedexPath] ?? DEFAULT_FALLBACK;
  const [frame, setFrame] = useState(0);
  const [imgLoaded, setImgLoaded] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const dirRow = owner === 'opponent' ? OPPONENT_ROW : PLAYER_ROW;
  const src = `/sprite/${pokedexPath}/Idle-Anim.png`;

  // Frame animation loop using per-frame durations from AnimData.
  // PMD duration values are in internal ticks; 1 tick ≈ 50ms gives
  // natural idle speeds across all Pokemon (each has its own timing).
  const MS_PER_TICK = 50;

  useEffect(() => {
    if (!imgLoaded || data.frames <= 1) return;

    const tick = () => {
      setFrame((prev) => {
        const next = (prev + 1) % data.frames;
        const durTicks = data.durs[next] ?? 10;
        timerRef.current = setTimeout(tick, Math.max(durTicks * MS_PER_TICK, 80));
        return next;
      });
    };

    const durTicks = data.durs[0] ?? 10;
    timerRef.current = setTimeout(tick, Math.max(durTicks * MS_PER_TICK, 80));

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [imgLoaded, data.frames, data.durs]);

  // The spritesheet is laid out as: columns=frames, rows=8 directions.
  // We clip to show only one frame from the correct directional row.
  const sheetWidth = data.w * data.frames;
  const sheetHeight = data.h * DIRECTION_ROWS;

  const scaleX = size / data.w;
  const scaleY = size / data.h;
  const scale = Math.min(scaleX, scaleY);

  const displayW = data.w * scale;
  const displayH = data.h * scale;

  const bgW = sheetWidth * scale;
  const bgH = sheetHeight * scale;
  const bgX = -(frame * data.w * scale);
  const bgY = -(dirRow * data.h * scale);

  const style: CSSProperties = {
    width: displayW,
    height: displayH,
    backgroundImage: `url(${src})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: `${bgW}px ${bgH}px`,
    backgroundPosition: `${bgX}px ${bgY}px`,
    imageRendering: 'pixelated',
  };

  return (
    <>
      {/* Hidden img to trigger onLoad */}
      <img
        src={src}
        alt=""
        onLoad={() => setImgLoaded(true)}
        style={{ display: 'none' }}
      />
      <span
        role="img"
        aria-label={`sprite-${pokedexPath}`}
        className={`block ${className}`}
        style={style}
      />
    </>
  );
}
