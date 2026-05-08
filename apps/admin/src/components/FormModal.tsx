import { useEffect, useRef, type ReactNode } from 'react';

interface FormModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  onSubmit: () => void;
  loading?: boolean;
  children: ReactNode;
}

export function FormModal({ open, onClose, title, onSubmit, loading, children }: FormModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    else if (!open && el.open) el.close();
  }, [open]);

  if (!open) return null;

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className="m-auto w-full max-w-lg rounded-card border border-border-subtle bg-surface-elevated p-0 shadow-lg backdrop:bg-black/40"
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className="flex flex-col"
      >
        <header className="flex items-center justify-between border-b border-border-subtle px-6 py-4">
          <h3 className="text-base font-semibold text-text-primary">{title}</h3>
          <button type="button" onClick={onClose} className="text-text-muted hover:text-text-primary text-lg leading-none">
            &times;
          </button>
        </header>

        <div className="flex flex-col gap-4 px-6 py-5">
          {children}
        </div>

        <footer className="flex items-center justify-end gap-3 border-t border-border-subtle px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-control border border-border-subtle px-4 py-2 text-sm font-medium text-text-secondary hover:bg-surface-muted transition-colors"
          >
            Annulla
          </button>
          <button
            type="submit"
            disabled={loading}
            className="rounded-control bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-hover disabled:opacity-50 transition-colors"
          >
            {loading ? 'Salvataggio…' : 'Salva'}
          </button>
        </footer>
      </form>
    </dialog>
  );
}

interface FieldProps {
  label: string;
  children: ReactNode;
}

export function Field({ label, children }: FieldProps) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-text-secondary">{label}</span>
      {children}
    </label>
  );
}

export const inputClass =
  'w-full rounded-control border border-border-subtle bg-surface-base px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand';

export const selectClass = inputClass;
