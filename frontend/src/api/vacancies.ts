import { Api } from '@/config/api'
import { createUseMutation } from '@/lib/create-use-mutation'
import { createUseQuery } from '@/lib/create-use-query'

export const useVacancies = createUseQuery('vacancies.all', Api.vacancies.all)

export const useVacancy = createUseQuery('vacancy.one', Api.vacancies.one)

export const useCreateVacancy = createUseMutation(Api.vacancies.create)
