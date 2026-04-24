import { Sprite } from '@/components/Sprite';
import { Button } from '@/components/Button';
import type { SpriteRef } from '@/types';

export type ConfigPreviewShape = 'circle' | 'square' | 'landscape';

export interface ConfigCardProps {
  label: string;
  preview: SpriteRef;
  shape?: ConfigPreviewShape;
  onChange?: () => void;
}

const shapeClass: Record<ConfigPreviewShape, string> = {
  circle: 'rounded-full aspect-square',
  square: 'rounded-card aspect-square',
  landscape: 'rounded-card aspect-[16/10]',
};

/**
 * One of the 3 cards in the "Configurazione" section.
 *
 * Slightly different preview shape per role:
 *   - Support  → circle
 *   - Trainer  → circle
 *   - Background → landscape tile
 */
export function ConfigCard({
  label,
  preview,
  shape = 'square',
  onChange,
}: ConfigCardProps) {
  const tint = preview.fallbackColor ?? '#2A3038';

  return (
    <div className="flex flex-col items-stretch gap-2 rounded-card border border-border-subtle bg-bg-elevated p-2">
      <span className="text-center text-[11px] font-semibold uppercase tracking-wide text-text-secondary">
        {label}
      </span>

      <div
        className={[
          'relative mx-auto flex w-full items-center justify-center overflow-hidden border border-border-strong',
          shapeClass[shape],
        ].join(' ')}
        style={{
          backgroundImage: `linear-gradient(180deg, ${tint}33 0%, ${tint}11 100%)`,
        }}
      >
        <Sprite
          sprite={preview}
          /* Fill the tile; the Sprite handles both images & placeholders. */
          width="80%"
          height="80%"
          alt={label}
        />
      </div>

      <Button variant="outline" size="xs" fullWidth onClick={onChange}>
        Cambia
      </Button>
    </div>
  );
}
