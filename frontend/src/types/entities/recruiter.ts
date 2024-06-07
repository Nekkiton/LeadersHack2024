import { User, Role } from '@/types/entities/user'

export interface Recruiter extends User {
  role: Role.Recruiter
  interview_per_day: number
  interview_slots: string[] // TODO
}
