import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'

export type Toast = {
  id: string
  title?: string
  description?: string
  variant?: 'success' | 'error' | 'info'
  durationMs?: number
}

type ToastContextValue = {
  show: (t: Omit<Toast, 'id'>) => void
  success: (message: string, description?: string) => void
  error: (message: string, description?: string) => void
  info: (message: string, description?: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const idRef = useRef(0)

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const show = useCallback((t: Omit<Toast, 'id'>) => {
    const id = String(++idRef.current)
    const toast: Toast = { id, durationMs: 3000, variant: 'info', ...t }
    setToasts((prev) => [...prev, toast])
    const timeout = setTimeout(() => dismiss(id), toast.durationMs)
    return () => clearTimeout(timeout)
  }, [dismiss])

  const value = useMemo<ToastContextValue>(() => ({
    show,
    success: (message, description) => show({ title: message, description, variant: 'success' }),
    error: (message, description) => show({ title: message, description, variant: 'error', durationMs: 5000 }),
    info: (message, description) => show({ title: message, description, variant: 'info' }),
  }), [show])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Toaster toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

export function Toaster({ toasts, onDismiss }: { toasts: Toast[]; onDismiss: (id: string) => void }) {
  return (
    <div className="pointer-events-none fixed right-4 top-4 z-50 flex w-80 flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={[
            'pointer-events-auto rounded-md border px-4 py-3 shadow-sm ring-1 ring-black/5 transition-all',
            t.variant === 'success' ? 'border-green-200 bg-white' : '',
            t.variant === 'error' ? 'border-red-200 bg-white' : '',
            t.variant === 'info' ? 'border-gray-200 bg-white' : '',
          ].join(' ')}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              {t.title && (
                <p className="truncate text-sm font-medium text-gray-900">{t.title}</p>
              )}
              {t.description && (
                <p className="mt-0.5 line-clamp-3 text-xs text-gray-600">{t.description}</p>
              )}
            </div>
            <button
              onClick={() => onDismiss(t.id)}
              className="ml-2 inline-flex shrink-0 items-center justify-center rounded-md px-2 py-1 text-xs font-medium text-gray-500 hover:text-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
