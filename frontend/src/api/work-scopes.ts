import { Api } from '@/config/api'
import { createUseQuery } from '@/lib/create-use-query'

export const useWorkScopes = createUseQuery(
  'workScopes.all',
  Api.workScopes.all
)
