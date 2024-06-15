import { Api } from '@/config/api'
import { createUseMutation } from '@/lib/create-use-mutation'
import { createUseQuery } from '@/lib/create-use-query'

export const useVacancies = createUseQuery('vacancies.all', Api.vacancies.all)

export const useCurCandidateVacancies = createUseQuery(
  'candidates.me.vacancies',
  Api.candidates.me.vacancies
)

export const useCurRecruiterVacancies = createUseQuery(
  'recruiters.me.vacancies',
  Api.recruiters.me.vacancies
)

export const useFindVacanciesViaCV = createUseMutation(Api.vacancies.findViaCV)

export const useVacancy = createUseQuery('vacancies.one', Api.vacancies.one)

export const useCurCandidateVacancy = createUseQuery(
  'candidates.me.vacancy',
  Api.candidates.me.vacancy
)

export const useCreateVacancy = createUseMutation(Api.vacancies.create, {
  invalidateQueriesFn: () => [
    { queryKey: ['vacancies.all'] },
    { queryKey: ['vacancies.one'] },
  ],
  onSuccess: (_, { toasts, queryClient }) => {
    toasts.info({ content: 'Вакансия создана' })
    queryClient.removeQueries({ queryKey: ['recruiters.me.vacancies'] })
  },
})

export const useUpdateVacancy = createUseMutation(Api.vacancies.update, {
  invalidateQueriesFn: () => [
    { queryKey: ['vacancies.all'] },
    { queryKey: ['vacancies.one'] },
  ],
  onSuccess: (_, { toasts }) => {
    toasts.info({ content: 'Вакансия изменена' })
  },
})

export const useCloseVacancy = createUseMutation(Api.vacancies.close, {
  invalidateQueriesFn: () => [
    { queryKey: ['vacancies.all'] },
    { queryKey: ['vacancies.one'] },
    { queryKey: ['recruiters.me.responses'] },
  ],
  onSuccess: (_, { toasts }) => {
    toasts.info({ content: 'Вакансия закрыта' })
  },
})

export const useRespondToVacancy = createUseMutation(Api.vacancies.respond, {
  invalidateQueriesFn: () => [
    { queryKey: ['vacancies.all'] },
    { queryKey: ['vacancies.one'] },
    { queryKey: ['candidates.me.responses'] },
    { queryKey: ['candidates.me.vacancy-response'] },
  ],
  onSuccess: (_, { toasts }) => {
    toasts.info({ content: 'Отклик отправлен' })
  },
})
