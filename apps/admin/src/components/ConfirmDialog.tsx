import { useEffect, useRef } from 'react';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
  danger?: boolean;
}

export function ConfirmDialog({ open, title, message, onConfirm, onCancel, loading, danger }: ConfirmDialogProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    else if (!open && el.open) el.close();
  }, [open]);

  if (!open) return null;

  return (
    <dialog
      ref={ref}
      onClose={onCancel}
      className="m-auto w-full max-w-sm rounded-card border border-border-subtle bg-surface-elevated p-6 shadow-lg backdrop:bg-black/40"
    >
      <h3 className="text-base font-semibold text-text-primary">{title}</h3>
      <p className="mt-2 text-sm text-text-secondary">{message}</p>
      <div className="mt-5 flex items-center justify-end gap-3">
        <button
          onClick={onCancel}
          className="rounded-control border border-border-subtle px-4 py-2 text-sm font-medium text-text-secondary hover:bg-surface-muted"
        >
          Annulla
        </button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className={`rounded-control px-4 py-2 text-sm font-medium text-white disabled:opacity-50 ${
            danger ? 'bg-status-danger hover:bg-red-700' : 'bg-brand hover:bg-brand-hover'
          }`}
        >
          {loading ? 'Eliminazione…' : 'Conferma'}
        </button>
      </div>
    </dialog>
  );
}
