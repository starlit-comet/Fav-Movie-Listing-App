import type { ReactNode } from 'react'
import { useEffect } from 'react'

interface ModalProps {
  open: boolean
  title?: string
  children: ReactNode
  onClose: () => void
}

export default function Modal({ open, title, children, onClose }: ModalProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    if (open) document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  // restore overflow on unmount or when closing
  useEffect(() => {
    const prev = document.body.style.overflow
    if (open) document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [open])

  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative z-10 w-full max-w-xl rounded-lg bg-white p-4 shadow-lg ring-1 ring-gray-200 max-h-[85vh] overflow-y-auto">
        {title && <h3 className="mb-3 text-base font-semibold text-gray-900">{title}</h3>}
        {children}
      </div>
    </div>
  )
}
