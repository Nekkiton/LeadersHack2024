import { Axios } from '@/config/axios'
import {
  ForgotPasswordData,
  LoginData,
  RegisterData,
  ResetPasswordData,
} from '@/types/entities/auth'
import { Role, User } from '@/types/entities/user'

export const Api = {
  users: {
    me: () =>
      Axios.get<User>('/users/me/')
        .then((res) => res.data)
        .catch(() => ({
          id: 'f',
          name: 'Alexey',
          surname: 'Levedev',
          avatar:
            'https://img-cdn.pixlr.com/image-generator/history/65bb506dcb310754719cf81f/ede935de-1138-4f66-8ed7-44bd16efc709/medium.webp',
          role: Role.Recruiter,
        })),
    // .catch(() => null),
  },

  auth: {
    login: (data: LoginData) => Axios.post('/auth/login/', data),
    register: (data: RegisterData) => Axios.post('/auth/register/', data),
    forgotPassword: (data: ForgotPasswordData) =>
      Axios.post('/auth/forgot/', data),
    resetPassword: (data: ResetPasswordData) =>
      Axios.post('/auth/reset-password/', data),
  },
}
