interface PageHeaderProps {
  title: string;
  description?: string;
  onAdd?: () => void;
  addLabel?: string;
}

export function PageHeader({ title, description, onAdd, addLabel = 'Nuovo' }: PageHeaderProps) {
  return (
    <header className="flex items-start justify-between gap-4">
      <div>
        <h2 className="text-xl font-semibold text-text-primary">{title}</h2>
        {description && (
          <p className="mt-1 text-sm text-text-secondary">{description}</p>
        )}
      </div>
      {onAdd && (
        <button
          onClick={onAdd}
          className="shrink-0 rounded-control bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-hover transition-colors"
        >
          + {addLabel}
        </button>
      )}
    </header>
  );
}
