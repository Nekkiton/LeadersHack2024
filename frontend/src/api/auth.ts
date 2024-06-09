import { Api } from '@/config/api'
import { Routes } from '@/config/routes'
import { createUseMutation } from '@/lib/create-use-mutation'
import { Role } from '@/types/entities/user'

export const useLogin = createUseMutation(Api.auth.login, {
  invalidateQueriesFn: () => [{ queryKey: ['users.me'] }],
  onError: ([e], { toasts }) => {
    if (e.status === 400) {
      toasts.error({ content: 'Почта или пароль не правильны' })
      return true
    }
  },
  onSuccess: ([user], { router }) => {
    router.push(
      {
        [Role.Recruiter]: Routes.recruiterVacancies,
        [Role.Candidate]: Routes.candidateVacancies,
      }[user.role]
    )
  },
})

export const useRegister = createUseMutation(Api.auth.register, {
  invalidateQueriesFn: () => [{ queryKey: ['users.me'] }],
  onSuccess: ([user], { router }) => {
    router.push(
      {
        [Role.Recruiter]: Routes.recruiterProfile,
        [Role.Candidate]: Routes.candidateProfile,
      }[user.role]
    )
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
