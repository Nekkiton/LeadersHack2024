import { Api } from '@/config/api'
import { createUseQuery } from '@/lib/create-use-query'

export const useWorkSchedules = createUseQuery(
  'workSchedules.all',
  Api.workSchedules.all
)
