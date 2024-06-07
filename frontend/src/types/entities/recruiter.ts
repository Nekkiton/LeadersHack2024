import { User, Role } from '@/types/entities/user'

export interface Recruiter extends User {
  role: Role.Recruiter
  interview_per_day: number
  interview_slots: unknown[] // TODO
}

export interface InterviewSlots {
  id: string
  recruiter_id: string
  start_time: string
  end_time: string
}
