import { useLocation } from 'react-router-dom';
import { adminModules } from '@/lib/modules';

export function ModulePlaceholderPage() {
  const { pathname } = useLocation();
  const slug = pathname.replace(/^\//, '');
  const module = adminModules.find((m) => m.slug === slug);

  return (
    <div className="flex flex-col gap-4">
      <header>
        <h2 className="text-xl font-semibold text-text-primary">
          {module?.label ?? 'Modulo sconosciuto'}
        </h2>
        {module && (
          <p className="mt-1 text-sm text-text-secondary">{module.description}</p>
        )}
      </header>

      <div className="rounded-card border border-dashed border-border-strong bg-surface-elevated p-10 text-center">
        <p className="text-sm font-medium text-text-primary">
          Modulo non ancora implementato
        </p>
        <p className="mt-1 text-xs text-text-secondary">
          Questa pagina ospiterà la gestione CRUD di{' '}
          <strong>{module?.label.toLowerCase() ?? slug}</strong>.
        </p>
      </div>
    </div>
  );
}
