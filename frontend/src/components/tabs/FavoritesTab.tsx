import { memo, useMemo, useState } from 'react';
import Modal from '../ui/Modal';
import FavoriteForm, { type FavoriteFormValues } from '../forms/FavoriteForm';
import { useToast } from '../ui/ToastProvider';
import { API_URL } from '../../config/env';
export type FavoriteItem = {
  id: number;
  title: string;
  type: 'movie' | 'tv';
  director?: string | null;
  budget?: number | null;
  location?: string | null;
  durationMinutes?: number | null;
  year?: number | null;
  rating?: number | null;
  description?: string | null;
  createdAt?: string;
};

interface Props {
  items: FavoriteItem[];
  loading?: boolean;
  onItemUpdated?: (item: FavoriteItem) => void;
  onItemDeleted?: (id: number) => void;
}

function FavoritesTabComp({ items, loading, onItemUpdated, onItemDeleted }: Props) {
  const { success, error } = useToast();
  const [editing, setEditing] = useState<FavoriteItem | null>(null);
  const [toDelete, setToDelete] = useState<FavoriteItem | null>(null);
  const initialForm: FavoriteFormValues | null = useMemo(() => {
    if (!editing) return null;
    return {
      title: editing.title,
      type: editing.type,
      year: editing.year != null ? String(editing.year) : '',
      rating: editing.rating != null ? String(editing.rating) : '',
      director: editing.director || '',
      durationMinutes: editing.durationMinutes != null ? String(editing.durationMinutes) : '',
      location: editing.location || '',
      budget: editing.budget != null ? String(editing.budget as any) : '',
      description: editing.description || '',
    };
  }, [editing]);
  if (!items || items.length === 0) {
    return (
      <p className="mt-2 text-gray-600">{loading ? 'Loading...' : 'No favorites yet.'}</p>
    );
  }

  const Row = memo(({ f }: { f: FavoriteItem }) => (
    <tr className="hover:bg-gray-50">
      <td className="px-3 py-2 text-gray-900">{f.id}</td>
      <td className="px-3 py-2 text-gray-900">{f.title}</td>
      <td className="px-3 py-2 text-gray-600 uppercase">{f.type}</td>
      <td className="px-3 py-2 text-gray-600">{f.director || '-'}</td>
      <td className="px-3 py-2 text-gray-600">{typeof f.budget === 'number' ? Number(f.budget).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '-'}</td>
      <td className="px-3 py-2 text-gray-600">{f.location || '-'}</td>
      <td className="px-3 py-2 text-gray-600">{typeof f.durationMinutes === 'number' ? `${f.durationMinutes} min` : '-'}</td>
      <td className="px-3 py-2 text-gray-600">{f.year ?? '-'}</td>
      <td className="px-3 py-2 text-gray-600">
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex h-7 w-7 items-center justify-center rounded hover:bg-gray-200"
            title="Edit"
            aria-label="Edit"
            onClick={() => setEditing(f)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 text-gray-700">
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
            </svg>
          </button>
          <button
            type="button"
            className="inline-flex h-7 w-7 items-center justify-center rounded hover:bg-gray-200"
            title="Delete"
            aria-label="Delete"
            onClick={() => setToDelete(f)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 text-red-600">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
              <path d="M10 11v6" />
              <path d="M14 11v6" />
              <path d="M9 6V4a1 1 0 0 1 1-1h4a 1 1 0 0 1 1 1v2" />
            </svg>
          </button>
        </div>
      </td>
    </tr>
  ));

  return (
    <div className="mt-4 overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-3 py-2 text-left font-medium text-gray-700">Id</th>
            <th className="px-3 py-2 text-left font-medium text-gray-700">Title</th>
            <th className="px-3 py-2 text-left font-medium text-gray-700">Type</th>
            <th className="px-3 py-2 text-left font-medium text-gray-700">Director</th>
            <th className="px-3 py-2 text-left font-medium text-gray-700">Budget</th>
            <th className="px-3 py-2 text-left font-medium text-gray-700">Location</th>
            <th className="px-3 py-2 text-left font-medium text-gray-700">Duration</th>
            <th className="px-3 py-2 text-left font-medium text-gray-700">Year/Time</th>
            <th className="px-3 py-2 text-left font-medium text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {items.map((f) => (
            <Row key={f.id} f={f} />
          ))}
        </tbody>
      </table>
      <Modal open={!!editing} title="Edit favorite" onClose={() => setEditing(null)}>
        {initialForm && editing ? (
          <FavoriteForm
            initial={initialForm}
            submitLabel="Save changes"
            onSubmit={async (vals) => {
              const token = sessionStorage.getItem('token');
              if (!token) { error('Not authenticated'); return; }
              const resp = await fetch(`${API_URL}/favorites/${editing.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({
                  title: vals.title,
                  type: vals.type,
                  year: vals.year ? Number(vals.year) : undefined,
                  rating: vals.rating ? Number(vals.rating) : undefined,
                  director: vals.director || null,
                  durationMinutes: vals.durationMinutes ? Number(vals.durationMinutes) : undefined,
                  description: vals.description || null,
                  location: vals.location || null,
                  budget: vals.budget ? Number(vals.budget) : undefined,
                }),
              });
              const data = await resp.json().catch(() => ({}));
              if (!resp.ok) {
                error('Failed to update favorite', data?.message);
                return;
              }
              success('Favorite updated');
              setEditing(null);
              if (onItemUpdated) onItemUpdated(data);
            }}
            onCancel={() => setEditing(null)}
          />
        ) : null}
      </Modal>

      <Modal open={!!toDelete} title="Delete favorite" onClose={() => setToDelete(null)}>
        {toDelete ? (
          <div>
            <p className="text-sm text-gray-700">Are you sure you want to delete <span className="font-medium">{toDelete.title}</span>?</p>
            <div className="mt-4 flex items-center gap-3">
              <button
                className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-500"
                onClick={async () => {
                  const token = sessionStorage.getItem('token');
                  if (!token) { error('Not authenticated'); return; }
                  const resp = await fetch(`${API_URL}/favorites/${toDelete.id}`, {
                    method: 'DELETE',
                    headers: { Authorization: `Bearer ${token}` },
                  });
                  if (!resp.ok) {
                    const data = await resp.json().catch(() => ({}));
                    error('Failed to delete favorite', data?.message);
                    return;
                  }
                  success('Favorite deleted');
                  const deletedId = toDelete.id;
                  setToDelete(null);
                  if (onItemDeleted) onItemDeleted(deletedId);
                }}
              >
                Delete
              </button>
              <button
                className="rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-gray-900"
                onClick={() => setToDelete(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}

export default memo(FavoritesTabComp);
