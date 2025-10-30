import { useEffect, useMemo, useState } from 'react'
import FormField from '../ui/FormField'
import Input from '../ui/Input'
import Button from '../ui/Button'

export type FavoriteFormValues = {
  title: string
  type: 'movie' | 'tv'
  year?: string
  rating?: string
  director?: string
  durationMinutes?: string
  location?: string
  budget?: string
  description?: string
}

export type FavoriteFormErrors = Partial<Record<keyof FavoriteFormValues, string>>

function validate(values: FavoriteFormValues): FavoriteFormErrors {
  const errors: FavoriteFormErrors = {}
  if (!values.title.trim()) errors.title = 'Title is required'
  if (values.type !== 'movie' && values.type !== 'tv') errors.type = 'Type must be movie or tv'
  if (values.year && !/^\d+$/.test(values.year)) errors.year = 'Year must be an integer'
  if (values.rating) {
    const r = Number(values.rating)
    if (Number.isNaN(r) || r < 0 || r > 10) errors.rating = 'Rating must be between 0 and 10'
  }
  if (values.durationMinutes) {
    const d = Number(values.durationMinutes)
    if (Number.isNaN(d) || d < 0) errors.durationMinutes = 'Duration must be a non-negative number'
  }
  if (values.budget) {
    const b = Number(values.budget)
    if (Number.isNaN(b) || b < 0) errors.budget = 'Budget must be a non-negative number'
  }
  return errors
}

function valuesEqual(a: FavoriteFormValues, b: FavoriteFormValues) {
  return (
    a.title === b.title &&
    a.type === b.type &&
    (a.year || '') === (b.year || '') &&
    (a.rating || '') === (b.rating || '') &&
    (a.director || '') === (b.director || '') &&
    (a.durationMinutes || '') === (b.durationMinutes || '') &&
    (a.location || '') === (b.location || '') &&
    (a.budget || '') === (b.budget || '') &&
    (a.description || '') === (b.description || '')
  )
}

export default function FavoriteForm({
  initial,
  submitLabel,
  onSubmit,
  onCancel,
}: {
  initial: FavoriteFormValues
  submitLabel: string
  onSubmit: (values: FavoriteFormValues) => Promise<void> | void
  onCancel?: () => void
}) {
  const [values, setValues] = useState<FavoriteFormValues>(initial)
  const [errors, setErrors] = useState<FavoriteFormErrors>({})
  const dirty = useMemo(() => !valuesEqual(values, initial), [values, initial])

  useEffect(() => {
    setValues(initial)
    setErrors({})
  }, [initial])

  const onChange = (patch: Partial<FavoriteFormValues>) => {
    setValues((v) => ({ ...v, ...patch }))
  }

  const trySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const nextErrors = validate(values)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return
    await onSubmit(values)
  }

  return (
    <form onSubmit={trySubmit} className="grid grid-cols-1 gap-3 md:grid-cols-2">
      <FormField label="Title">
        <Input value={values.title} onChange={(e) => onChange({ title: e.target.value })} placeholder="Movie title" />
        {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title}</p>}
      </FormField>

      <FormField label="Type">
        <select
          value={values.type}
          onChange={(e) => onChange({ type: e.target.value as 'movie' | 'tv' })}
          className="w-full rounded-md border bg-white px-3 py-2 text-sm text-gray-900 outline-none ring-1 ring-gray-200 focus:ring-2 focus:ring-indigo-500"
        >
          <option value="movie">Movie</option>
          <option value="tv">TV</option>
        </select>
        {errors.type && <p className="mt-1 text-xs text-red-600">{errors.type}</p>}
      </FormField>

      <FormField label="Year">
        <Input type="text" value={values.year || ''} onChange={(e) => onChange({ year: e.target.value })} placeholder="e.g., 2010" />
        {errors.year && <p className="mt-1 text-xs text-red-600">{errors.year}</p>}
      </FormField>

      <FormField label="Rating (0-10)">
        <Input type="text" value={values.rating || ''} onChange={(e) => onChange({ rating: e.target.value })} placeholder="8.5" />
        {errors.rating && <p className="mt-1 text-xs text-red-600">{errors.rating}</p>}
      </FormField>

      <FormField label="Director">
        <Input value={values.director || ''} onChange={(e) => onChange({ director: e.target.value })} placeholder="Director name" />
      </FormField>

      <FormField label="Duration (minutes)">
        <Input type="text" value={values.durationMinutes || ''} onChange={(e) => onChange({ durationMinutes: e.target.value })} placeholder="120" />
        {errors.durationMinutes && <p className="mt-1 text-xs text-red-600">{errors.durationMinutes}</p>}
      </FormField>

      <FormField label="Location">
        <Input value={values.location || ''} onChange={(e) => onChange({ location: e.target.value })} placeholder="Filming location" />
      </FormField>

      <FormField label="Budget">
        <Input type="text" value={values.budget || ''} onChange={(e) => onChange({ budget: e.target.value })} placeholder="1000000" />
        {errors.budget && <p className="mt-1 text-xs text-red-600">{errors.budget}</p>}
      </FormField>

      <div className="md:col-span-2">
        <label className="mb-1 block text-sm font-medium text-gray-700">Description</label>
        <textarea
          value={values.description || ''}
          onChange={(e) => onChange({ description: e.target.value })}
          rows={4}
          className="w-full rounded-md border bg-white px-3 py-2 text-sm text-gray-900 outline-none ring-1 ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500"
          placeholder="Why do you like this?"
        />
      </div>

      <div className="md:col-span-2 flex items-center hover:cursor-pointer gap-2">
        <Button type="submit" loading={false} disabled={!dirty}>{submitLabel}</Button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="text-sm text-gray-600 hover:text-gray-800">Cancel</button>
        )}
      </div>
    </form>
  )
}
