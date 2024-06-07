import { BaseEntity } from '@/types/entities/base-entity'
import { Recruiter } from '@/types/entities/recruiter'

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
  description: string
  responsibilities: string
  candidate_expectation: string
  additions: string
  conditions: string
  salary_from: number
  salary_to: number
  status: VacancyStatus
  responces: string[] // TODO
  skills: string[] // TODO
  recruiter_id: string
  recruiter?: Recruiter // TODO
  work_experience: string
  work_type_id: string
  work_schedule_id: string
  scope_id: string
  stages: string[] // TODO
  creation_date: string
}

export interface GetVacanciesParams {}
