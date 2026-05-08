import type { ReactNode } from 'react';

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T extends { id: string }> {
  columns: Column<T>[];
  data: T[];
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  loading?: boolean;
  emptyMessage?: string;
}

export function DataTable<T extends { id: string }>({
  columns,
  data,
  onEdit,
  onDelete,
  loading,
  emptyMessage = 'Nessun elemento.',
}: DataTableProps<T>) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 text-sm text-text-secondary">
        Caricamento…
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="rounded-card border border-dashed border-border-strong bg-surface-elevated p-10 text-center text-sm text-text-secondary">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-card border border-border-subtle bg-surface-elevated shadow-card">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-border-subtle bg-surface-muted">
            {columns.map((col) => (
              <th key={col.key} className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider text-text-muted ${col.className ?? ''}`}>
                {col.header}
              </th>
            ))}
            {(onEdit || onDelete) && (
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-text-muted">
                Azioni
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id} className="border-b border-border-subtle last:border-0 hover:bg-surface-muted/50 transition-colors">
              {columns.map((col) => (
                <td key={col.key} className={`px-4 py-3 ${col.className ?? ''}`}>
                  {col.render ? col.render(row) : String((row as Record<string, unknown>)[col.key] ?? '—')}
                </td>
              ))}
              {(onEdit || onDelete) && (
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {onEdit && (
                      <button
                        onClick={() => onEdit(row)}
                        className="rounded-control border border-border-subtle bg-surface-elevated px-3 py-1.5 text-xs font-medium text-text-primary hover:border-brand hover:text-brand transition-colors"
                      >
                        Modifica
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(row)}
                        className="rounded-control border border-border-subtle bg-surface-elevated px-3 py-1.5 text-xs font-medium text-status-danger hover:border-status-danger transition-colors"
                      >
                        Elimina
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
