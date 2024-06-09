import { User, Role } from '@/types/entities/user'
import { ResponseStage } from '@/types/entities/response-stage'
import { WorkHistory } from '@/types/entities/work-history'

export interface Candidate extends User {
  role: Role.Candidate
  city: string
  job_title: string
  education_id: string
  work_schedule_id: string
  work_type_id: string
  work_experience_id: string
  // work_history: string[] // TODO
  work_history?: WorkHistory[] // TODO
  skills: string[] // TODO
  // responces: string[] // TODO
  responses?: ResponseStage[]
  vacancy_match?: number
  salary_expectation: number
}

export interface GetCandidatesParams {
  query?: string
  work_experiences?: string[]
  skills?: string[]
  page?: number
}
