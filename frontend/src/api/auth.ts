import { Api } from '@/config/api'
import { createUseMutation } from '@/lib/create-use-mutation'

export const useLogin = createUseMutation(Api.auth.login)
