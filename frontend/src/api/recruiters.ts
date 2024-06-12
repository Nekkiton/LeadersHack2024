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

export const useCurRecruiterAnswerToRespond = createUseMutation(
  Api.recruiters.me.answerToResponse,
  {
    invalidateQueriesFn: () => [{ queryKey: ['recruiters.me.responses'] }],
    onSuccess: ([_, { status }], { toasts }) => {
      if (status === 'approve') {
        toasts.info({ content: 'Приглашение отправлено' })
      } else if (status === 'reject') {
        toasts.info({ content: 'Отказ отправлен' })
      }
    },
  }
)
