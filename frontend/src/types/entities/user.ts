import { BaseEntity } from '@/types/entities/base-entity'

export interface User extends BaseEntity {
  name: string
  surname: string
  avatar: string
}
