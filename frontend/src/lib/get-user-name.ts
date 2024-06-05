import { User } from '@/types/entities/user'

export const getUserName = (user: User, format: 'Name S.' | 'Name Surname') => {
  switch (format) {
    case 'Name S.':
      return `${user.name} ${user.surname[0]}.`
    case 'Name Surname':
      return `${user.name} ${user.surname}`
  }
}
