import { Api } from '@/config/api'
import { Routes } from '@/config/routes'
import { createUseMutation } from '@/lib/create-use-mutation'
import { Role } from '@/types/entities/user'

export const useLogin = createUseMutation(Api.auth.login, {
  invalidateQueriesFn: () => [{ queryKey: ['users.me'] }],
  onSuccess: ([user], { router }) => {
    setTimeout(() => {
      router.push(
        {
          [Role.Recruiter]: Routes.recruiterVacancies,
          [Role.Candidate]: Routes.candidateVacancies,
        }[user.role]
      )
    }, 100)
  },
})

export const useRegister = createUseMutation(Api.auth.register, {
  invalidateQueriesFn: () => [{ queryKey: ['users.me'] }],
  onSuccess: ([], { router }) => {
    setTimeout(() => {
      router.push(Routes.candidateProfile)
    }, 100)
  },
})

export const useForgotPassword = createUseMutation(Api.auth.forgotPassword, {
  onError: ([], { toasts }) => {
    toasts.info({ content: 'Данный функционал пока в разработке' })
    return true
  },
})

export const useResetPassword = createUseMutation(Api.auth.resetPassword, {
  onError: ([], { toasts }) => {
    toasts.info({ content: 'Данный функционал пока в разработке' })
    return true
  },
})

export const useLogout = createUseMutation(Api.auth.logout, {
  onSuccess: ([], { queryClient, router }) => {
    queryClient.resetQueries()
    router.push(Routes.home)
  },
})

export const useChangePassword = createUseMutation(Api.auth.changePassword, {
  invalidateQueriesFn: () => [{ queryKey: ['users.me'] }],
  onSuccess: (_, { toasts }) => {
    toasts.info({ content: 'Пароль изменен' })
  },
})
