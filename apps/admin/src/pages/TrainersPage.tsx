import { useState } from 'react';
import { useResource } from '@/lib/useResource';
import { DataTable, type Column } from '@/components/DataTable';
import { PageHeader } from '@/components/PageHeader';
import { FormModal, Field, inputClass } from '@/components/FormModal';
import { ConfirmDialog } from '@/components/ConfirmDialog';

interface Trainer {
  id: string;
  slug: string;
  name: string;
  imageUrl?: string | null;
  createdAt: string;
}

const emptyForm = (): Partial<Trainer> => ({
  slug: '',
  name: '',
  imageUrl: null,
});

export function TrainersPage() {
  const { items, loading, create, update, remove } = useResource<Trainer>('/admin/trainers');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm());
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Trainer | null>(null);
  const [deleting, setDeleting] = useState(false);

  const columns: Column<Trainer>[] = [
    { key: 'name', header: 'Nome', render: (r) => <span className="font-medium">{r.name}</span> },
    { key: 'slug', header: 'Slug', render: (r) => <code className="text-xs font-mono text-text-muted">{r.slug}</code> },
    { key: 'imageUrl', header: 'Immagine', render: (r) => r.imageUrl
      ? <img src={r.imageUrl} alt={r.name} className="h-8 w-8 rounded object-cover" />
      : <span className="text-xs text-text-muted">—</span>
    },
    { key: 'createdAt', header: 'Creato', render: (r) => <span className="text-xs text-text-muted">{new Date(r.createdAt).toLocaleDateString('it')}</span> },
  ];

  const openCreate = () => { setEditingId(null); setForm(emptyForm()); setModalOpen(true); };
  const openEdit = (t: Trainer) => { setEditingId(t.id); setForm(t); setModalOpen(true); };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = { slug: form.slug, name: form.name, imageUrl: form.imageUrl || undefined };
      if (editingId) await update(editingId, payload as Partial<Trainer>);
      else await create(payload as Partial<Trainer>);
      setModalOpen(false);
    } catch (e) { alert(e instanceof Error ? e.message : 'Errore'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try { await remove(deleteTarget.id); setDeleteTarget(null); }
    catch (e) { alert(e instanceof Error ? e.message : 'Errore'); }
    finally { setDeleting(false); }
  };

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <div className="flex flex-col gap-5">
      <PageHeader title="Trainer" description={`${items.length} trainer disponibili`} onAdd={openCreate} addLabel="Nuovo trainer" />
      <DataTable columns={columns} data={items} loading={loading} onEdit={openEdit} onDelete={setDeleteTarget} emptyMessage="Nessun trainer." />

      <FormModal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Modifica Trainer' : 'Nuovo Trainer'} onSubmit={handleSave} loading={saving}>
        <Field label="Nome"><input className={inputClass} value={form.name ?? ''} onChange={(e) => set('name', e.target.value)} required /></Field>
        <Field label="Slug"><input className={inputClass} value={form.slug ?? ''} onChange={(e) => set('slug', e.target.value)} required placeholder="es. deku" /></Field>
        <Field label="URL immagine (opzionale)"><input className={inputClass} value={form.imageUrl ?? ''} onChange={(e) => set('imageUrl', e.target.value || null)} placeholder="https://..." /></Field>
      </FormModal>

      <ConfirmDialog open={!!deleteTarget} title="Elimina trainer" message={`Eliminare "${deleteTarget?.name}"?`} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} loading={deleting} danger />
    </div>
  );
}
