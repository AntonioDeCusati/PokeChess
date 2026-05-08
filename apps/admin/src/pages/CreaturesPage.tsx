import { useState } from 'react';
import { useResource } from '@/lib/useResource';
import { DataTable, type Column } from '@/components/DataTable';
import { PageHeader } from '@/components/PageHeader';
import { FormModal, Field, inputClass, selectClass } from '@/components/FormModal';
import { ConfirmDialog } from '@/components/ConfirmDialog';

interface Animation {
  id: string;
  type: string;
  frameWidth: number;
  frameHeight: number;
  frameCount: number;
  durations: number[];
  rushFrame?: number;
  hitFrame?: number;
  returnFrame?: number;
}

interface Creature {
  id: string;
  slug: string;
  pokedexNumber: number;
  pokedexPath: string;
  name: string;
  type1: string;
  type2?: string | null;
  rarity: string;
  expMax: number;
  canEvolve: boolean;
  evolvesToId?: string | null;
  animations: Animation[];
  createdAt: string;
}

const TYPES = ['fire', 'water', 'grass', 'electric', 'poison', 'dark', 'ghost', 'dragon', 'light'] as const;
const RARITIES = ['common', 'rare', 'epic', 'legendary'] as const;

const typeColors: Record<string, string> = {
  fire: 'bg-red-100 text-red-800',
  water: 'bg-blue-100 text-blue-800',
  grass: 'bg-green-100 text-green-800',
  electric: 'bg-yellow-100 text-yellow-800',
  poison: 'bg-purple-100 text-purple-800',
  dark: 'bg-gray-200 text-gray-800',
  ghost: 'bg-indigo-100 text-indigo-800',
  dragon: 'bg-teal-100 text-teal-800',
  light: 'bg-amber-50 text-amber-800',
};

const rarityColors: Record<string, string> = {
  common: 'bg-gray-100 text-gray-700',
  rare: 'bg-blue-100 text-blue-700',
  epic: 'bg-purple-100 text-purple-700',
  legendary: 'bg-amber-100 text-amber-700',
};

function Badge({ label, className }: { label: string; className: string }) {
  return (
    <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${className}`}>
      {label}
    </span>
  );
}

const emptyForm = (): Partial<Creature> & { animationsJson: string } => ({
  slug: '',
  pokedexNumber: 0,
  pokedexPath: '',
  name: '',
  type1: 'fire',
  type2: null,
  rarity: 'common',
  expMax: 100,
  canEvolve: false,
  evolvesToId: null,
  animationsJson: '[]',
});

export function CreaturesPage() {
  const { items, loading, create, update, remove } = useResource<Creature>('/admin/creatures');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm());
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Creature | null>(null);
  const [deleting, setDeleting] = useState(false);

  const columns: Column<Creature>[] = [
    { key: 'pokedexNumber', header: '#', className: 'w-16', render: (r) => <span className="font-mono text-xs">{r.pokedexNumber}</span> },
    { key: 'name', header: 'Nome', render: (r) => <span className="font-medium">{r.name}</span> },
    { key: 'slug', header: 'Slug', className: 'hidden lg:table-cell', render: (r) => <code className="text-xs text-text-muted font-mono">{r.slug}</code> },
    { key: 'type1', header: 'Tipo', render: (r) => (
      <div className="flex gap-1">
        <Badge label={r.type1} className={typeColors[r.type1] ?? ''} />
        {r.type2 && <Badge label={r.type2} className={typeColors[r.type2] ?? ''} />}
      </div>
    )},
    { key: 'rarity', header: 'Rarità', render: (r) => <Badge label={r.rarity} className={rarityColors[r.rarity] ?? ''} /> },
    { key: 'expMax', header: 'Exp Max', className: 'hidden md:table-cell' },
    { key: 'canEvolve', header: 'Evolve', className: 'hidden md:table-cell', render: (r) => r.canEvolve ? 'Sì' : '—' },
    { key: 'animations', header: 'Anim.', className: 'hidden lg:table-cell', render: (r) => <span className="text-xs text-text-muted">{r.animations.length}/4</span> },
  ];

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm());
    setModalOpen(true);
  };

  const openEdit = (c: Creature) => {
    setEditingId(c.id);
    setForm({
      ...c,
      animationsJson: JSON.stringify(c.animations.map(({ id: _id, ...a }) => a), null, 2),
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      let animations: unknown[] | undefined;
      try {
        animations = JSON.parse(form.animationsJson || '[]');
      } catch {
        alert('JSON animazioni non valido');
        setSaving(false);
        return;
      }

      const payload = {
        slug: form.slug,
        pokedexNumber: Number(form.pokedexNumber),
        pokedexPath: form.pokedexPath,
        name: form.name,
        type1: form.type1,
        type2: form.type2 || undefined,
        rarity: form.rarity,
        expMax: Number(form.expMax),
        canEvolve: form.canEvolve,
        evolvesToId: form.evolvesToId || undefined,
        animations,
      };

      if (editingId) {
        await update(editingId, payload as Partial<Creature>);
      } else {
        await create(payload as Partial<Creature>);
      }
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

  const set = <K extends keyof typeof form>(key: K, val: (typeof form)[K]) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="Creature"
        description={`${items.length} creature nel catalogo`}
        onAdd={openCreate}
        addLabel="Nuova creatura"
      />

      <DataTable
        columns={columns}
        data={items}
        loading={loading}
        onEdit={openEdit}
        onDelete={setDeleteTarget}
        emptyMessage="Nessuna creatura nel catalogo. Clicca '+ Nuova creatura' per aggiungerne una."
      />

      <FormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Modifica Creatura' : 'Nuova Creatura'}
        onSubmit={handleSave}
        loading={saving}
      >
        <div className="grid grid-cols-2 gap-4">
          <Field label="Nome">
            <input className={inputClass} value={form.name ?? ''} onChange={(e) => set('name', e.target.value)} required />
          </Field>
          <Field label="Slug">
            <input className={inputClass} value={form.slug ?? ''} onChange={(e) => set('slug', e.target.value)} required placeholder="es. bulbasaur" />
          </Field>
          <Field label="Pokedex #">
            <input className={inputClass} type="number" value={form.pokedexNumber ?? 0} onChange={(e) => set('pokedexNumber', Number(e.target.value) as never)} required />
          </Field>
          <Field label="Pokedex Path">
            <input className={inputClass} value={form.pokedexPath ?? ''} onChange={(e) => set('pokedexPath', e.target.value)} required placeholder="es. 0001" />
          </Field>
          <Field label="Tipo 1">
            <select className={selectClass} value={form.type1 ?? 'fire'} onChange={(e) => set('type1', e.target.value)}>
              {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="Tipo 2 (opzionale)">
            <select className={selectClass} value={form.type2 ?? ''} onChange={(e) => set('type2', e.target.value || null)}>
              <option value="">Nessuno</option>
              {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="Rarità">
            <select className={selectClass} value={form.rarity ?? 'common'} onChange={(e) => set('rarity', e.target.value)}>
              {RARITIES.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </Field>
          <Field label="Exp Max">
            <input className={inputClass} type="number" value={form.expMax ?? 100} onChange={(e) => set('expMax', Number(e.target.value) as never)} />
          </Field>
          <Field label="Può evolvere">
            <select className={selectClass} value={form.canEvolve ? 'true' : 'false'} onChange={(e) => set('canEvolve', e.target.value === 'true' as never)}>
              <option value="false">No</option>
              <option value="true">Sì</option>
            </select>
          </Field>
          <Field label="Evolve in (ID)">
            <input className={inputClass} value={form.evolvesToId ?? ''} onChange={(e) => set('evolvesToId', e.target.value || null)} placeholder="cuid del target" />
          </Field>
        </div>
        <Field label="Animazioni (JSON)">
          <textarea
            className={`${inputClass} font-mono text-xs`}
            rows={8}
            value={form.animationsJson ?? '[]'}
            onChange={(e) => set('animationsJson', e.target.value)}
          />
        </Field>
      </FormModal>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Elimina creatura"
        message={`Eliminare "${deleteTarget?.name}" (#${deleteTarget?.pokedexNumber})? Questa azione è irreversibile e rimuoverà anche le assegnazioni utente.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
        danger
      />
    </div>
  );
}
