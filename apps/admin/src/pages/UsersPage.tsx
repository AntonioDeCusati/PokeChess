import { useState } from 'react';
import { useResource } from '@/lib/useResource';
import { DataTable, type Column } from '@/components/DataTable';
import { PageHeader } from '@/components/PageHeader';
import { FormModal, Field, inputClass } from '@/components/FormModal';
import { ConfirmDialog } from '@/components/ConfirmDialog';

interface UserRow {
  id: string;
  email: string;
  username: string;
  level: number;
  exp: number;
  expToNext: number;
  gold: number;
  gems: number;
  createdAt: string;
  _count: { creatures: number; teamSlots: number };
}

export function UsersPage() {
  const { items, loading, update, remove } = useResource<UserRow>('/admin/users');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<UserRow>>({});
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<UserRow | null>(null);
  const [deleting, setDeleting] = useState(false);

  const columns: Column<UserRow>[] = [
    {
      key: 'username',
      header: 'Username',
      render: (r) => <span className="font-medium">{r.username}</span>,
    },
    {
      key: 'email',
      header: 'Email',
      render: (r) => <span className="text-xs text-text-secondary">{r.email}</span>,
    },
    {
      key: 'level',
      header: 'Livello',
      render: (r) => (
        <div className="flex items-center gap-2">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-brand/10 text-xs font-bold text-brand">
            {r.level}
          </span>
          <span className="text-[10px] text-text-muted">
            {r.exp}/{r.expToNext} XP
          </span>
        </div>
      ),
    },
    {
      key: 'gold',
      header: 'Valuta',
      render: (r) => (
        <div className="flex flex-col text-xs">
          <span className="text-amber-600">{r.gold.toLocaleString('it')} oro</span>
          <span className="text-blue-500">{r.gems.toLocaleString('it')} gemme</span>
        </div>
      ),
    },
    {
      key: '_count',
      header: 'Creature',
      render: (r) => (
        <span className="text-xs text-text-secondary">{r._count.creatures} possedute</span>
      ),
    },
    {
      key: 'createdAt',
      header: 'Registrato',
      render: (r) => (
        <span className="text-xs text-text-muted">
          {new Date(r.createdAt).toLocaleDateString('it', { day: '2-digit', month: 'short', year: 'numeric' })}
        </span>
      ),
    },
  ];

  const openEdit = (u: UserRow) => {
    setEditingId(u.id);
    setForm({
      username: u.username,
      email: u.email,
      level: u.level,
      exp: u.exp,
      expToNext: u.expToNext,
      gold: u.gold,
      gems: u.gems,
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!editingId) return;
    setSaving(true);
    try {
      await update(editingId, {
        username: form.username,
        email: form.email,
        level: Number(form.level),
        exp: Number(form.exp),
        expToNext: Number(form.expToNext),
        gold: Number(form.gold),
        gems: Number(form.gems),
      } as Partial<UserRow>);
      setModalOpen(false);
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Errore');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await remove(deleteTarget.id);
      setDeleteTarget(null);
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Errore');
    } finally {
      setDeleting(false);
    }
  };

  const set = <K extends keyof UserRow>(k: K, v: UserRow[K]) =>
    setForm((p) => ({ ...p, [k]: v }));

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="Utenti"
        description={`${items.length} utenti registrati`}
      />

      <DataTable
        columns={columns}
        data={items}
        loading={loading}
        onEdit={openEdit}
        onDelete={setDeleteTarget}
        emptyMessage="Nessun utente registrato."
      />

      <FormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Modifica Utente"
        onSubmit={handleSave}
        loading={saving}
      >
        <div className="grid grid-cols-2 gap-4">
          <Field label="Username">
            <input
              className={inputClass}
              value={form.username ?? ''}
              onChange={(e) => set('username', e.target.value)}
              required
            />
          </Field>
          <Field label="Email">
            <input
              className={inputClass}
              type="email"
              value={form.email ?? ''}
              onChange={(e) => set('email', e.target.value)}
              required
            />
          </Field>
          <Field label="Livello">
            <input
              className={inputClass}
              type="number"
              min={1}
              value={form.level ?? 1}
              onChange={(e) => set('level', Number(e.target.value) as never)}
            />
          </Field>
          <Field label="EXP">
            <input
              className={inputClass}
              type="number"
              min={0}
              value={form.exp ?? 0}
              onChange={(e) => set('exp', Number(e.target.value) as never)}
            />
          </Field>
          <Field label="EXP per il prossimo livello">
            <input
              className={inputClass}
              type="number"
              min={1}
              value={form.expToNext ?? 1200}
              onChange={(e) => set('expToNext', Number(e.target.value) as never)}
            />
          </Field>
          <div />
          <Field label="Oro">
            <input
              className={inputClass}
              type="number"
              min={0}
              value={form.gold ?? 0}
              onChange={(e) => set('gold', Number(e.target.value) as never)}
            />
          </Field>
          <Field label="Gemme">
            <input
              className={inputClass}
              type="number"
              min={0}
              value={form.gems ?? 0}
              onChange={(e) => set('gems', Number(e.target.value) as never)}
            />
          </Field>
        </div>
      </FormModal>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Elimina utente"
        message={`Eliminare l'utente "${deleteTarget?.username}" (${deleteTarget?.email})? Verranno rimossi anche tutte le creature, il team e la configurazione associati. Azione irreversibile.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
        danger
      />
    </div>
  );
}
