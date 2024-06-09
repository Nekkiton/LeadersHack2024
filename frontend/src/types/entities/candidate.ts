import { User, Role } from '@/types/entities/user'
import { ResponseStage } from '@/types/entities/response-stage'
import { UpdateWorkHistory, WorkHistory } from '@/types/entities/work-history'
import { UpdateAttachment } from '@/types/entities/attachment'

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

export interface RegisterCandidateData {
  photo: UpdateAttachment | null
  name: string
  surname: string
  patronymic: string | null
  birthday: string
  city: string
  education_id: string
  phone: string
  telegram: string | null
  email: string
  skills: string[] // array of ids
  job_title: string
  work_schedule_id: string
  work_type_id: string
  work_experience_id: string
  salary_expectation: number
  work_history: UpdateWorkHistory[]
  site_notifications: boolean
  tg_notifications: boolean
}

export interface UpdateCandidateData extends Partial<RegisterCandidateData> {}
