import { PropsWithChildren, useState } from 'react'
import { generateId } from '@/lib/generate-id'
import { ToastsContext, ToastInput, ToastType, Toast } from '@/lib/use-toasts'

export default function ToastsProvider({ children }: PropsWithChildren) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const remove = (id: string) => {
    setToasts((prev) => {
      const idx = prev.findIndex((i) => i.id === id)
      if (idx !== -1) {
        return [...prev.slice(0, idx), ...prev.slice(idx + 1)]
      }
      return prev
    })
  }

  const add = (data: ToastInput & { type: ToastType }) => {
    const id = generateId()

    setToasts((prev) => [
      ...prev,
      {
        ...data,
        id,
      },
    ])

    setTimeout(() => {
      remove(id)
    }, 10000)
  }

  return (
    <ToastsContext.Provider
      value={{
        items: toasts,
        remove,
        info: (data) => add({ ...data, type: 'info' }),
        success: (data) => add({ ...data, type: 'success' }),
        error: (data) => add({ ...data, type: 'error' }),
      }}
    >
      {children}
    </ToastsContext.Provider>
  )
}
