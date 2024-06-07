import { User, Role } from '@/types/entities/user'

export interface Candidate extends User {
  role: Role.Candidate
  city: string
  job_title: string
  education_id: string
  work_schedule_id: string
  work_type_id: string
  work_experience_id: string
  work_history: string[] // TODO
  skills: string[] // TODO
  responces: string[] // TODO
}
