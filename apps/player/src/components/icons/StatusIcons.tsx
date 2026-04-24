import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

const base = (extra: Partial<IconProps> = {}): IconProps => ({
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  ...extra,
});

export function CheckIcon(props: IconProps) {
  return (
    <svg {...base({ ...props, strokeWidth: 2.4 })}>
      <path d="M4 12l5 5 11-11" />
    </svg>
  );
}

export function LockIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
      <circle cx="12" cy="15.5" r="1.2" fill="currentColor" />
    </svg>
  );
}

export function SwordsIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M14.5 14.5L21 21l-2 2-6.5-6.5" />
      <path d="M9.5 9.5L3 3l2-2 6.5 6.5" />
      <path d="M14.5 14.5l-5-5" />
      <path d="M9.5 14.5L3 21l2 2 6.5-6.5" />
      <path d="M14.5 9.5L21 3l-2-2-6.5 6.5" />
    </svg>
  );
}

export function TrophyIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M7 4h10v4a5 5 0 0 1-10 0V4Z" />
      <path d="M7 6H4v2a3 3 0 0 0 3 3" />
      <path d="M17 6h3v2a3 3 0 0 1-3 3" />
      <path d="M9 20h6" />
      <path d="M12 13v7" />
    </svg>
  );
}

export function ScrollIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M6 4h10a2 2 0 0 1 2 2v11a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V6a2 2 0 0 1 2-2Z" />
      <path d="M18 20a3 3 0 0 0 3-3v-2h-5" />
      <path d="M9 9h6" />
      <path d="M9 13h6" />
    </svg>
  );
}

export function ClockIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

export function ChestIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M3 10a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-8Z" />
      <path d="M3 11h18" />
      <rect x="10.5" y="10" width="3" height="4" rx="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function ChevronRightIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}

export function SendIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 20l16-8L4 4l3 8-3 8Z" />
      <path d="M7 12h9" />
    </svg>
  );
}
