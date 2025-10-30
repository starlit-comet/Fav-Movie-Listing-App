import { memo } from 'react';
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
  createdAt?: string;
};

interface Props {
  items: FavoriteItem[];
  loading?: boolean;
}

function FavoritesTabComp({ items, loading }: Props) {
  if (!items || items.length === 0) {
    return (
      <p className="mt-2 text-gray-600">{loading ? 'Loading...' : 'No favorites yet.'}</p>
    );
  }

  const Row = memo(({ f }: { f: FavoriteItem }) => (
    <tr {...(f.id % 2 === 0 ? { className: "  hover:bg-gray-200" } : { className: "bg-gray-100 hover:bg-gray-300" })}>
      <td className="px-3 py-2 text-gray-900">{f.id}</td>
      <td className="px-3 py-2 text-gray-900">{f.title}</td>
      <td className="px-3 py-2 text-gray-600 uppercase">{f.type}</td>
      <td className="px-3 py-2 text-gray-600">{f.director || '-'}</td>
      <td className="px-3 py-2 text-gray-600">{typeof f.budget === 'number' ? Number(f.budget).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '-'}</td>
      <td className="px-3 py-2 text-gray-600">{f.location || '-'}</td>
      <td className="px-3 py-2 text-gray-600">{typeof f.durationMinutes === 'number' ? `${f.durationMinutes} min` : '-'}</td>
      <td className="px-3 py-2 text-gray-600">{f.year ?? '-'}</td>
      <td className="px-3 py-2 text-gray-600">
        <button className="text-indigo-600 hover:underline" disabled>View</button>
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
    </div>
  );
}

export default memo(FavoritesTabComp);
