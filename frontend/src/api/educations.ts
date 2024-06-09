import { Api } from '@/config/api'
import { createUseQuery } from '@/lib/create-use-query'

export const useEducations = createUseQuery(
  'educations.all',
  Api.educations.all
)
