import { useMemo } from 'react'

// TODO: move to types
export type FormError =
  | string
  | {
      message?: string
      type: string
    }

export const useFormError = (error?: FormError) => {
  const message = useMemo(() => {
    if (!error) {
      return null
    } else if (typeof error === 'string') {
      return error
    }

    if (error.type === 'required') {
      return 'Заполните это поле'
    } else if (error.message) {
      return error.message
    } else if (error.type) {
      return error.type
    } else {
      return 'Ошибка'
    }
  }, [error])

  return message
}
