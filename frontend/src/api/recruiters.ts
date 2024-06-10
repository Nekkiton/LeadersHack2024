import { Api } from '@/config/api'
import { createUseMutation } from '@/lib/create-use-mutation'

export const useCurRecruiterUpdateProfile = createUseMutation(
  Api.recruiters.me.updateProfile,
  {
    onError: ([error], { setError }) => {
      if (setError) {
        const detail = (error.response?.data as any).detail
        if (Array.isArray(detail)) {
          detail.forEach((i) => {
            const name = i.loc.slice(1).join('.')
            setError(name, { message: i.msg, type: '' })
          })
        }
      }
    },
  }
)
