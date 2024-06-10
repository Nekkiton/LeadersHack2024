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

export const useVacancy = createUseQuery('vacancy.one', Api.vacancies.one)

export const useVacancyResponses = createUseQuery(
  'vacancy.responses',
  Api.vacancies.responses
)

export const useCreateVacancy = createUseMutation(Api.vacancies.create) // TODO: process result

export const useRespondToVacancy = createUseMutation(Api.vacancies.respond, {
  invalidateQueriesFn: () => [
    { queryKey: ['vacancies.all'] },
    { queryKey: ['vacancies.one'] },
  ],
})
