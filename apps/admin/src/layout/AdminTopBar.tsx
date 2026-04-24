/**
 * Top bar dell'admin — per ora mostra solo il titolo della pagina
 * (placeholder). Spazio già previsto per breadcrumbs, ricerca globale e
 * menu utente quando verranno implementati.
 */
export function AdminTopBar() {
  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b border-border-subtle bg-surface-elevated px-6">
      <h1 className="text-sm font-semibold text-text-primary">
        Admin Backoffice
      </h1>
      <span className="ml-auto rounded-control border border-border-subtle bg-surface-muted px-2 py-1 text-[11px] text-text-secondary">
        env: local · scaffold v0.0.1
      </span>
    </header>
  );
}
