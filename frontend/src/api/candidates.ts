import { Api } from '@/config/api'
import { createUseMutation } from '@/lib/create-use-mutation'
import { createUseQuery } from '@/lib/create-use-query'

export const useCandidates = createUseQuery(
  'candidates.all',
  Api.candidates.all
)

export const useCandidate = createUseQuery('candidates.one', Api.candidates.one)

export const useCurCandidateResponses = createUseQuery(
  'candidates.me.responses',
  Api.candidates.me.responses
)

export const useCurCandidateVacancyResponse = createUseQuery(
  'candidates.me.vacancy-response',
  Api.candidates.me.vacancyResponse
)

export const useCurCandidateUpdateProfile = createUseMutation(
  Api.candidates.me.updateProfile,
  {
    invalidateQueriesFn: () => [{ queryKey: ['users.me'] }],
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
    onSuccess: ([], { toasts }) => {
      toasts.info({ content: 'Профиль обновлен' })
    },
  }
)

export const useCurCandidateUpdateProfileFromFile = createUseMutation(
  Api.candidates.me.updateProfileFromFile
)
