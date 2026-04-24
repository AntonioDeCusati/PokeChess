import { type ButtonHTMLAttributes, type ReactNode } from 'react';

type Variant = 'primary' | 'accent' | 'success' | 'ghost' | 'outline' | 'danger';
type Size = 'xs' | 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-accent text-black hover:bg-accent-hover active:bg-accent-deep shadow-card',
  accent:
    'bg-accent-red text-white hover:brightness-110 active:brightness-95 shadow-card',
  success:
    'bg-success text-white hover:brightness-110 active:brightness-95 shadow-card',
  ghost:
    'bg-bg-elevated text-text-primary hover:bg-bg-hover border border-border-subtle',
  outline:
    'bg-transparent text-text-primary border border-border-strong hover:bg-bg-hover',
  danger:
    'bg-danger text-white hover:brightness-110 active:brightness-95 shadow-card',
};

const sizeClasses: Record<Size, string> = {
  xs: 'h-7 px-2 text-xxs rounded-tile',
  sm: 'h-8 px-3 text-xs rounded-tile',
  md: 'h-10 px-4 text-sm rounded-tile',
  lg: 'h-12 px-5 text-base rounded-card font-semibold',
};

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  leftIcon,
  rightIcon,
  className = '',
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      className={[
        'inline-flex items-center justify-center gap-2 font-medium tracking-wide transition-colors',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60',
        fullWidth ? 'w-full' : '',
        variantClasses[variant],
        sizeClasses[size],
        className,
      ].join(' ')}
    >
      {leftIcon && <span className="shrink-0">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
}
