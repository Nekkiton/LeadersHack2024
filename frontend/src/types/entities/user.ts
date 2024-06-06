import { BaseEntity } from '@/types/entities/base-entity'

export enum Role {
  Recruiter = 'recruiter',
}

export interface User extends BaseEntity {
  name: string
  surname: string
  avatar: string
  role: Role
}
