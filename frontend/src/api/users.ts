import { Api } from '@/config/api'
import { createUseQuery } from '@/lib/create-use-query'

export const useCurUser = createUseQuery('users.me', Api.users.me)
