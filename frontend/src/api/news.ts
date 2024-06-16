import { Api } from '@/config/api'
import { createUseMutation } from '@/lib/create-use-mutation'
import { createUseQuery } from '@/lib/create-use-query'

export const useNews = createUseQuery('news.all', Api.news.all)

export const useDailyNews = createUseQuery('news.daily', Api.news.daily)

export const useCurRecruiterNews = createUseQuery(
  'recruiters.me.news',
  Api.recruiters.me.news
)

export const useCreateNews = createUseMutation(Api.news.create, {
  invalidateQueriesFn: () => [
    { queryKey: ['news.all'] },
    { queryKey: ['news.daily'] },
    { queryKey: ['recruiters.me.news'] },
  ],
  onSuccess: (_, { toasts }) => {
    toasts.info({ content: 'Новость добавлена' })
  },
  onError: ([error], { toasts, setError }) => {
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
})
