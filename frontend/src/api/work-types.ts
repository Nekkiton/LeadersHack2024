import { Api } from '@/config/api'
import { createUseQuery } from '@/lib/create-use-query'

export const useWorkTypes = createUseQuery('workTypes.all', Api.workTypes.all)
