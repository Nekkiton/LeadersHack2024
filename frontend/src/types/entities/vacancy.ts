import { BaseEntity } from '@/types/entities/base-entity'

export enum VacancyStatus {}

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
  work_experience: string
  work_type_id: string
  work_schedule_id: string
  scope_id: string
  stages: string[] // TODO
}

export interface GetVacanciesParams {}
