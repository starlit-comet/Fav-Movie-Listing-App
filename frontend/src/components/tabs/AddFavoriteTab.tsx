import { useState } from 'react';
import { useToast } from '../ui/ToastProvider';
import { API_URL } from '../../config/env';
import FavoriteForm, { type FavoriteFormValues } from '../forms/FavoriteForm';

interface Props {
  onCreated?: () => void;
}

export default function AddFavoriteTab({ onCreated }: Props) {
  const { success, error: toastError } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitForm = async (vals: FavoriteFormValues) => {
    setError(null);
    const token = sessionStorage.getItem('token');
    if (!token) {
      setError('Not authenticated');
      toastError('Not authenticated');
      return;
    }
    try {
      setLoading(true);
      const resp = await fetch(`${API_URL}/favorites`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: vals.title,
          type: vals.type,
          year: vals.year ? Number(vals.year) : undefined,
          rating: vals.rating ? Number(vals.rating) : undefined,
          director: vals.director || undefined,
          durationMinutes: vals.durationMinutes ? Number(vals.durationMinutes) : undefined,
          description: vals.description || undefined,
          location: vals.location || undefined,
          budget: vals.budget ? Number(vals.budget) : undefined,
        }),
      });
      const data = await resp.json().catch(() => ({}));
      if (!resp.ok) {
        setError(data?.message || 'Failed to create favorite');
        toastError('Failed to create favorite', data?.message);
        return;
      }
      success('Favorite added', `${data?.item?.title ?? vals.title} has been saved.`);
      if (onCreated) onCreated();
    } catch (err) {
      setError('Failed to create favorite');
      toastError('Failed to create favorite');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900">Add a favorite</h2>
      {error ? (
        <div className="mt-2 rounded-md bg-red-50 p-2 text-sm text-red-700 ring-1 ring-red-200">{error}</div>
      ) : null}
      <div className="mt-4">
        <FavoriteForm
          initial={{
            title: '',
            type: 'movie',
            year: '',
            rating: '',
            director: '',
            durationMinutes: '',
            location: '',
            budget: '',
            description: '',
          }}
          submitLabel={loading ? 'Saving…' : 'Save'}
          onSubmit={submitForm}
        />
      </div>
    </div>
  );
}
