import { User, Role } from '@/types/entities/user'
import { ResponseStage } from '@/types/entities/response-stage'
import { UpdateWorkHistory, WorkHistory } from '@/types/entities/work-history'
import { UpdateAttachment } from '@/types/entities/attachment'
import { City } from '@/types/entities/city'
import { Education } from '@/types/entities/education'
import { WorkSchedule } from '@/types/entities/work-schedule'
import { WorkType } from '@/types/entities/work-type'
import { WorkExperience } from '@/types/entities/work-experience'
import { Skill } from '@/types/entities/skill'

export interface Candidate extends User {
  role: Role.Candidate
  city: City
  birthday: string
  job_title: string
  education: Education
  work_schedule: WorkSchedule
  work_type: WorkType
  work_experience: WorkExperience
  skills: Skill[]
  // work_history: string[] // TODO
  work_history?: WorkHistory[] // TODO
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

export interface UpdateCandidateData {
  photo: UpdateAttachment | null
  name: string
  surname: string
  patronymic: string | null
  birthday: string
  city: string
  education: Education
  phone: string
  telegram: string
  email: string
  skills: Skill[]
  job_title: string
  work_schedule: WorkSchedule
  work_type: WorkType
  work_experience: WorkExperience
  salary_expectation: number
  work_history: UpdateWorkHistory[]
  site_notifications: boolean
  tg_notifications: boolean
}
