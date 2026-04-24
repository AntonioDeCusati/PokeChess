import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

const base = (extra: Partial<IconProps> = {}): IconProps => ({
  viewBox: '0 0 24 24',
  ...extra,
});

export function GoldCoinIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="10" fill="#E0A83B" stroke="#8A5E1A" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="7"  fill="#F5C552" stroke="#B07E1F" strokeWidth="1" />
      <text
        x="12"
        y="15.5"
        textAnchor="middle"
        fontSize="9"
        fontWeight="800"
        fill="#8A5E1A"
        fontFamily="system-ui, sans-serif"
      >
        $
      </text>
    </svg>
  );
}

export function GemIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path
        d="M6 9 12 3l6 6-6 12L6 9Z"
        fill="#4FC3F7"
        stroke="#1E6B91"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path d="M6 9h12" stroke="#1E6B91" strokeWidth="1.2" />
      <path d="M12 3v6l-6 0" stroke="#A7E3FF" strokeWidth="1" opacity="0.6" />
    </svg>
  );
}

export function PlusIcon(props: IconProps) {
  return (
    <svg {...base({ ...props, fill: 'none', stroke: 'currentColor', strokeWidth: 2.2, strokeLinecap: 'round' })}>
      <path d="M12 6v12M6 12h12" />
    </svg>
  );
}
