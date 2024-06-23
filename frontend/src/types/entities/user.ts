import { BaseEntity } from '@/types/entities/base-entity'

export enum Role {
  Recruiter = 'recruiter',
  Candidate = 'candidate',
}

export interface BaseUser {
  email: string
  role: Role
  name: undefined
  password_changed_at: string | null
}

export interface User extends BaseEntity {
  surname: string
  name: string
  patronymic: string | null
  phone: string
  email: string
  telegram: string
  image: string | null
  role: Role
  password_changed_at: string | null
  preferences: {
    email_notify: boolean
    site_notify: boolean
    timezone: string // +03
  } | null
}
