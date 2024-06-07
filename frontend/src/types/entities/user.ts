import { BaseEntity } from '@/types/entities/base-entity'

export enum Role {
  Recruiter = 'recruiter',
  Candidate = 'candidate',
}

export interface User extends BaseEntity {
  surname: string
  name: string
  patronymic: string
  birthday: string
  phone: string
  email: string
  telegram: string
  photo: unknown
  role: Role
}
