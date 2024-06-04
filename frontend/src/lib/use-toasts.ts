import { ReactNode, useContext, createContext } from 'react'

export type ToastType = 'info' | 'success' | 'error'

export interface ToastInput {
  title?: ReactNode
  content: ReactNode
}

export interface Toast extends ToastInput {
  id: string
  type: ToastType
}

export const ToastsContext = createContext<{
  items: Toast[]
  remove: (id: string) => void
  info: (data: ToastInput) => void
  success: (data: ToastInput) => void
  error: (data: ToastInput) => void
}>({
  items: [],
  remove: () => {},
  info: () => {},
  success: () => {},
  error: () => {},
})

export const useToasts = () => {
  return useContext(ToastsContext)
}
