import type { HTMLAttributes, ReactNode } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Card surface tone. Default 'elevated'. */
  tone?: 'elevated' | 'surface' | 'transparent';
  /** Padding preset. Default 'md'. */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  children: ReactNode;
}

const toneClasses = {
  elevated: 'bg-bg-elevated border border-border-subtle',
  surface: 'bg-bg-surface border border-border-subtle',
  transparent: 'bg-transparent',
} as const;

const paddingClasses = {
  none: 'p-0',
  sm: 'p-2',
  md: 'p-3',
  lg: 'p-4',
} as const;

/**
 * Low-level card primitive used as the base for every game card
 * (ShopItemCard, TeamSlotCard, CreatureCard, ...).
 */
export function Card({
  tone = 'elevated',
  padding = 'md',
  className = '',
  children,
  ...rest
}: CardProps) {
  return (
    <div
      {...rest}
      className={[
        'rounded-card',
        toneClasses[tone],
        paddingClasses[padding],
        className,
      ].join(' ')}
    >
      {children}
    </div>
  );
}
