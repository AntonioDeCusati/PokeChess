import { useParams } from 'react-router-dom';
import { adminModules } from '@/lib/modules';

/**
 * Placeholder renderizzato dalle rotte /<slug> finché non implementiamo
 * la pagina reale del modulo (tabella + form + CRUD).
 *
 * Pattern target per ogni modulo (quando verrà implementato):
 *   - header: titolo + "Nuovo" CTA
 *   - filtri (tipo, rarità, stato)
 *   - tabella paginata + search
 *   - drawer/modale per create/edit con form validato
 *   - preview sprite dove rilevante
 */
export function ModulePlaceholderPage() {
  const { slug } = useParams<{ slug: string }>();
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
          <strong>{module?.label.toLowerCase() ?? slug}</strong>.<br />
          Vedi <code className="rounded bg-surface-muted px-1 py-0.5 font-mono text-[11px]">apps/admin/README.md</code>{' '}
          per la roadmap.
        </p>
      </div>
    </div>
  );
}
