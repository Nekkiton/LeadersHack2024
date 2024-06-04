import { Axios } from '@/config/axios'
import { User } from '@/types/entities/user'

export const Api = {
  users: {
    me: () =>
      Axios.get<User>('/users/me/')
        .then((res) => res.data)
        .catch(() => null),
  },

  auth: {
    login: (data: { initData: string }) =>
      Axios.post<string>('/auth/login/', data).then((res) => res.data),
  },
}
