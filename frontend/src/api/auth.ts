import { Api } from '@/config/api'
import { createUseMutation } from '@/lib/create-use-mutation'

export const useLogin = createUseMutation(Api.auth.login)

export const useRegister = createUseMutation(Api.auth.register)

export const useForgotPassword = createUseMutation(Api.auth.forgotPassword)

export const useResetPassword = createUseMutation(Api.auth.resetPassword)
