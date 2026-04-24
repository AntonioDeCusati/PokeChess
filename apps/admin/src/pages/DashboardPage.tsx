import { Link } from 'react-router-dom';
import { adminModules, moduleGroups, type ModuleGroup } from '@/lib/modules';

/**
 * Landing page dell'admin: card-grid di tutti i moduli raggruppati
 * per dominio. Ogni card linka alla rotta corrispondente (placeholder).
 */
export function DashboardPage() {
  const groups = Object.keys(moduleGroups) as ModuleGroup[];
  return (
    <div className="flex flex-col gap-6">
      <header>
        <h2 className="text-xl font-semibold text-text-primary">Dashboard</h2>
        <p className="mt-1 text-sm text-text-secondary">
          Gestione dei contenuti del gioco. Scegli un modulo per iniziare.
        </p>
      </header>

      {groups.map((group) => {
        const items = adminModules.filter((m) => m.group === group);
        if (items.length === 0) return null;
        return (
          <section key={group} className="flex flex-col gap-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
              {moduleGroups[group].label}
            </h3>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {items.map((m) => (
                <Link
                  key={m.slug}
                  to={`/${m.slug}`}
                  className="group rounded-card border border-border-subtle bg-surface-elevated p-4 shadow-card transition-colors hover:border-brand/40 hover:bg-brand-soft/30"
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <h4 className="text-sm font-semibold text-text-primary">
                      {m.label}
                    </h4>
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-text-muted group-hover:text-brand">
                      Apri →
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-text-secondary">{m.description}</p>
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
