import { User } from '@/types/entities/user'

export const getUserPhone = (user: User): string => {
  let phone = user.phone
  if (phone.startsWith('tel:')) phone = phone.slice(4)
  return phone.replaceAll('-', ' ')
}
