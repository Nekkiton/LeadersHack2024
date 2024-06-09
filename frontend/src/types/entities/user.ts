import { BaseEntity } from '@/types/entities/base-entity'
import { Attachment } from '@/types/entities/attachment'

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
  photo?: Attachment | null
  role: Role
  notifications: string[] // TODO
}
