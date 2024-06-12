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
  responses: number
  // responces: string[] // TODO
  // responses?: ResponseStage[] // TODo
  skills: Skill[]
  // recruiter_id: string
  // recruiter?: Recruiter // TODO
  work_experience: WorkExperience
  work_type: WorkType
  work_schedule: WorkSchedule
  scope: WorkScope
  // stages: string[] // TODO
  stages?: Stage[]
  match?: number
}

export interface GetVacanciesParams {
  page?: number
  limit?: number
  scope?: WorkScope
  status?: VacancyStatus
}

export interface GetCandidateVacanciesParams {
  page?: number
  limit?: number
  query?: string
  work_scopes?: WorkScope[]
  skills?: Skill[]
}

export interface GetRecruiterVacanciesParams {
  page?: number
  limit?: number
  query?: string
  statuses?: VacancyStatus[]
  scopes?: WorkScope[]
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

export interface RespondToVacancyData {
  message: string
}
