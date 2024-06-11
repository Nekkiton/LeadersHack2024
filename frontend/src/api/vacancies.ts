import { Api } from '@/config/api'
import { createUseMutation } from '@/lib/create-use-mutation'
import { createUseQuery } from '@/lib/create-use-query'
import { create } from 'domain'

export const useVacancies = createUseQuery('vacancies.all', Api.vacancies.all)

export const useCurCandidateVacancies = createUseQuery(
  'candidates.me.vacancies',
  Api.candidates.me.vacancies
)

export const useCurRecruiterVacancies = createUseQuery(
  'recruiters.me.vacancies',
  Api.recruiters.me.vacancies
)

export const useVacancy = createUseQuery('vacancy.one', Api.vacancies.one)

export const useVacancyResponses = createUseQuery(
  'vacancy.responses',
  Api.vacancies.responses
)

export const useCreateVacancy = createUseMutation(Api.vacancies.create, {
  invalidateQueriesFn: () => [
    { queryKey: ['vacancies.all'] },
    { queryKey: ['vacancies.one'] },
  ],
  onSuccess: (_, { toasts }) => {
    toasts.info({ content: 'Вакансия создана' })
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
  ],
  onSuccess: (_, { toasts }) => {
    toasts.info({ content: 'Вакансия закрыта' })
  },
})

export const useRespondToVacancy = createUseMutation(Api.vacancies.respond, {
  invalidateQueriesFn: () => [
    { queryKey: ['vacancies.all'] },
    { queryKey: ['vacancies.one'] },
  ],
})
