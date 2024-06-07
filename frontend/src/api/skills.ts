import { Api } from '@/config/api'
import { createUseQuery } from '@/lib/create-use-query'

export const useSkills = createUseQuery('skills.all', Api.skills.all)
