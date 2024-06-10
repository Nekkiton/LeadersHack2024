import { Api } from '@/config/api'
import { createUseQuery } from '@/lib/create-use-query'

export const useCitites = createUseQuery('cities.all', Api.cities.all)
