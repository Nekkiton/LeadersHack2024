import { Api } from '@/config/api'
import { createUseQuery } from '@/lib/create-use-query'

export const useWorkExperiences = createUseQuery(
  'workExperiences.all',
  Api.workExperiences.all
)
