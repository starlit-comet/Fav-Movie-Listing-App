import { useState } from 'react';
import FormField from '../ui/FormField';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { useToast } from '../ui/ToastProvider';

interface Props {
  onCreated?: () => void;
}

export default function AddFavoriteTab({ onCreated }: Props) {
  const { success } = useToast();
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'movie' | 'tv'>('movie');
  const [year, setYear] = useState<string>('');
  const [rating, setRating] = useState<string>('');
  const [director, setDirector] = useState('');
  const [durationMinutes, setDurationMinutes] = useState<string>('');
  const [location, setLocation] = useState('');
  const [budget, setBudget] = useState<string>('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!title) {
      setError('Title is required');
      return;
    }
    const token = sessionStorage.getItem('token');
    if (!token) {
      setError('Not authenticated');
      return;
    }
    try {
      setLoading(true);
      const API_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:4000';
      const resp = await fetch(`${API_URL}/favorites`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          type,
          year: year ? Number(year) : undefined,
          rating: rating ? Number(rating) : undefined,
          director: director || undefined,
          durationMinutes: durationMinutes ? Number(durationMinutes) : undefined,
          description: description || undefined,
          location: location || undefined,
          budget: budget ? Number(budget) : undefined,
        }),
      });
      const data = await resp.json().catch(() => ({}));
      if (!resp.ok) {
        setError(data?.message || 'Failed to create favorite');
        return;
      }
      // Reset form
      setTitle('');
      setType('movie');
      setYear('');
      setRating('');
      setDirector('');
      setDurationMinutes('');
      setLocation('');
      setBudget('');
      setDescription('');
      success('Favorite added', `${data?.title ?? title} has been saved.`);
      if (onCreated) onCreated();
    } catch (err) {
      setError('Failed to create favorite');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900">Add a favorite</h2>
      <form onSubmit={onSubmit} className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
        {error ? (
          <div className="md:col-span-2 rounded-md bg-red-50 p-2 text-sm text-red-700 ring-1 ring-red-200">{error}</div>
        ) : null}

        <FormField label="Title">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Movie title" />
        </FormField>

        <FormField label="Type">
          <select
            value={type}
            onChange={(e) => setType(e.target.value as 'movie' | 'tv')}
            className="w-full rounded-md border bg-white px-3 py-2 text-sm text-gray-900 outline-none ring-1 ring-gray-200 focus:ring-2 focus:ring-indigo-500"
          >
            <option value="movie">Movie</option>
            <option value="tv">TV</option>
          </select>
        </FormField>

        <FormField label="Year">
          <Input type="number" value={year} onChange={(e) => setYear(e.target.value)} placeholder="e.g., 2010" />
        </FormField>

        <FormField label="Rating (0-10)">
          <Input type="number" step="0.1" min="0" max="10" value={rating} onChange={(e) => setRating(e.target.value)} placeholder="8.5" />
        </FormField>

        <FormField label="Director">
          <Input value={director} onChange={(e) => setDirector(e.target.value)} placeholder="Director name" />
        </FormField>

        <FormField label="Duration (minutes)">
          <Input type="number" min="0" value={durationMinutes} onChange={(e) => setDurationMinutes(e.target.value)} placeholder="120" />
        </FormField>

        <FormField label="Location">
          <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Filming location" />
        </FormField>

        <FormField label="Budget">
          <Input type="number" min="0" step="0.01" value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="1000000" />
        </FormField>

        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full rounded-md border bg-white px-3 py-2 text-sm text-gray-900 outline-none ring-1 ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500"
            placeholder="Why do you like this?"
          />
        </div>

        <div className="md:col-span-2">
          <Button type="submit" loading={loading}>Save</Button>
        </div>
      </form>
    </div>
  );
}
