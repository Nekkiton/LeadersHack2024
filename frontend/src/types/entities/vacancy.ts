import { BaseEntity } from '@/types/entities/base-entity'
import { Recruiter } from '@/types/entities/recruiter'
import { ResponseStage } from '@/types/entities/response-stage'
import { Stage, UpdateStage } from '@/types/entities/stage'
import { WorkScope } from '@/types/entities/work-scope'
import { Skill } from '@/types/entities/skill'
import { WorkType } from '@/types/entities/work-type'
import { WorkSchedule } from '@/types/entities/work-schedule'
import { WorkExperience } from '@/types/entities/work-experience'

export enum VacancyStatus {
  Active = 'active',
  Closed = 'closed',
}

export const VacancyStatuses: Record<
  VacancyStatus,
  { title: string; color: string }
> = {
  [VacancyStatus.Active]: { title: 'Активна', color: 'green' },
  [VacancyStatus.Closed]: { title: 'Закрыта', color: 'gray-4' },
}

export interface Vacancy extends BaseEntity {
  title: string
  description: string | null
  responsabilities: string
  candidate_expectation: string
  additions: string | null
  conditions: string | null
  salary_from: number | null
  salary_to: number | null
  status: VacancyStatus
  // responces: string[] // TODO
  responses?: ResponseStage[] // TODo
  skills: string[] // TODO
  recruiter_id: string
  recruiter?: Recruiter // TODO
  work_experience_id: string
  work_type_id: string
  work_schedule_id: string
  scope_id: string
  // stages: string[] // TODO
  stages?: Stage[]
  creation_date: string
}

export interface GetVacanciesParams {
  page?: number
  scope?: WorkScope
}

export interface GetCandidateVacanciesParams {
  page?: number
  query?: string
  work_scopes?: WorkScope[]
  skills?: Skill[]
}

export interface GetRecruiterVacanciesParams {
  page?: number
  query?: string
  statuses?: VacancyStatus[]
  work_scopes?: WorkScope[]
}

export interface CreateVacancyData {
  title: string
  scope: WorkScope
  description: string | null
  responsabilities: string
  candidate_expectation: string
  additions: string | null
  conditions: string | null
  work_type: WorkType
  work_schedule: WorkSchedule
  work_experience: WorkExperience
  salary_from: number | null
  salary_to: number | null
  skills: Skill[]
  stages: UpdateStage[]
}
