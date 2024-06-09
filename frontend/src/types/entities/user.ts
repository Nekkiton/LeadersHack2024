import { BaseEntity } from '@/types/entities/base-entity'

export enum Role {
  Recruiter = 'recruiter',
  Candidate = 'candidate',
}

export interface User extends BaseEntity {
  surname: string
  name: string
  patronymic: string | null
  birthday: string | null
  phone: string
  email: string
  telegram: string | null
  photo: any // TODO:
  role: Role
  notifications: string[] // TODO
}
