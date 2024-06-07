import { Api } from '@/config/api'
import { createUseQuery } from '@/lib/create-use-query'

export const useVacancies = createUseQuery('vacancies.all', Api.vacancies.all)
