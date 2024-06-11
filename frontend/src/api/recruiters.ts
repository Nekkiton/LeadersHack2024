import { Api } from '@/config/api'
import { createUseMutation } from '@/lib/create-use-mutation'

export const useCurRecruiterUpdateProfile = createUseMutation(
  Api.recruiters.me.updateProfile,
  {
    onError: ([error], { setError, toasts }) => {
      if (setError) {
        const detail = (error.response?.data as any).detail
        if (Array.isArray(detail)) {
          detail.forEach((i) => {
            const name = i.loc.slice(1).join('.')
            setError(name, { message: i.msg, type: '' })
          })
        }
      }
      if (error.response?.status === 422) {
        toasts.error({ content: 'Исправьте ошибки' })
        return true
      }
    },
    onSuccess: (_, { toasts }) => {
      toasts.info({ content: 'Профиль обновлен' })
    },
  }
)
