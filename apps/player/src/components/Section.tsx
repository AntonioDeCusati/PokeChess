import type { ReactNode } from 'react';

export interface SectionProps {
  /** UPPERCASE section title ("NEGOZIO", "BAULI", ...). */
  title?: string;
  /** Optional right-aligned slot (e.g. a filter dropdown). */
  headerRight?: ReactNode;
  /** Optional subtitle shown under the title in secondary text. */
  subtitle?: string;
  children: ReactNode;
  className?: string;
  /** Use surface card styling (dark panel). Default: true. */
  surface?: boolean;
}

/**
 * A section block — matches the dark panels that segment every mockup
 * ("OFFERTE SPECIALI", "BAULI", "PRIMA LINEA", "COLLEZIONE", ...).
 */
export function Section({
  title,
  headerRight,
  subtitle,
  children,
  className = '',
  surface = true,
}: SectionProps) {
  const container = surface
    ? 'section-card'
    : 'rounded-card';
  return (
    <section className={`${container} ${className}`}>
      {(title || headerRight) && (
        <header className="mb-3 flex items-center justify-between gap-3">
          <div className="min-w-0">
            {title && (
              <h2 className="text-xs font-bold uppercase tracking-[0.12em] text-text-primary">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="mt-0.5 truncate text-xxs text-text-secondary">
                {subtitle}
              </p>
            )}
          </div>
          {headerRight && <div className="shrink-0">{headerRight}</div>}
        </header>
      )}
      {children}
    </section>
  );
}
