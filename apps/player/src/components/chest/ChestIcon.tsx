interface ChestIconProps {
  tier: 'wood' | 'iron' | 'gold' | 'diamond';
  size?: number;
  className?: string;
}

const TIER_COLORS = {
  wood:    { body: '#8B6914', lid: '#A07828', lock: '#CD9B1D', shine: '#D4A843' },
  iron:    { body: '#5C6370', lid: '#6E7681', lock: '#9CA3AF', shine: '#B0B8C4' },
  gold:    { body: '#B8860B', lid: '#DAA520', lock: '#FFD700', shine: '#FFE555' },
  diamond: { body: '#4169E1', lid: '#6495ED', lock: '#ADD8E6', shine: '#E0F0FF' },
} as const;

export function ChestIcon({ tier, size = 80, className }: ChestIconProps) {
  const c = TIER_COLORS[tier];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Body */}
      <rect x="10" y="35" width="60" height="35" rx="4" fill={c.body} />
      <rect x="10" y="35" width="60" height="35" rx="4" fill="black" fillOpacity="0.15" />

      {/* Lid */}
      <path
        d="M8 35 C8 25, 15 15, 40 12 C65 15, 72 25, 72 35 L8 35Z"
        fill={c.lid}
      />
      <path
        d="M8 35 C8 25, 15 15, 40 12 C65 15, 72 25, 72 35 L8 35Z"
        fill="white"
        fillOpacity="0.15"
      />

      {/* Metal band */}
      <rect x="10" y="33" width="60" height="5" rx="1" fill={c.lock} />

      {/* Lock */}
      <rect x="33" y="38" width="14" height="14" rx="3" fill={c.lock} />
      <rect x="36" y="41" width="8" height="8" rx="2" fill={c.body} />
      <circle cx="40" cy="45" r="2" fill={c.shine} />

      {/* Shine */}
      <path
        d="M18 22 L22 18 L24 22 L22 26 Z"
        fill={c.shine}
        fillOpacity="0.7"
      />
      <path
        d="M56 20 L59 17 L61 20 L59 23 Z"
        fill={c.shine}
        fillOpacity="0.5"
      />

      {/* Bottom highlights */}
      <rect x="14" y="55" width="52" height="2" rx="1" fill="white" fillOpacity="0.08" />
    </svg>
  );
}
