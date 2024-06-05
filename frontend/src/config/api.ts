import { Axios } from '@/config/axios'
import { User } from '@/types/entities/user'

export const Api = {
  users: {
    me: () =>
      Axios.get<User>('/users/me/')
        .then((res) => res.data)
        // .catch(() => ({
        //   id: 'f',
        //   name: 'Alexey',
        //   surname: 'Levedev',
        //   avatar:
        //     'https://img-cdn.pixlr.com/image-generator/history/65bb506dcb310754719cf81f/ede935de-1138-4f66-8ed7-44bd16efc709/medium.webp',
        // })),
        .catch(() => null),
  },

  auth: {
    login: (data: { initData: string }) =>
      Axios.post<string>('/auth/login/', data).then((res) => res.data),
  },
}
