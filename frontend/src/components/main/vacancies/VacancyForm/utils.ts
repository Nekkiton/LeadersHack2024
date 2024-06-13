import { Site } from '@/config/site'
import { CreateVacancyData, Vacancy } from '@/types/entities/vacancy'
import { WorkExperience } from '@/types/entities/work-experience'
import { WorkSchedule } from '@/types/entities/work-schedule'
import { WorkScope } from '@/types/entities/work-scope'
import { WorkType } from '@/types/entities/work-type'

export interface FormData {
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
  skills: string[]
  stages: {
    title: string
    auto_interview: boolean
    approve_template: string
    reject_template: string
    _isRequired: boolean
  }[]
}

export const transformFormData = (data: FormData): CreateVacancyData => {
  return {
    ...data,
    stages: data.stages.map((i, idx) => ({
      ...i,
      position: idx,
    })),
  }
}

export const getInitialData = (vacancy?: Vacancy): Partial<FormData> => {
  return {
    ...(vacancy ?? {}),
    stages:
      vacancy?.stages?.map((i, idx) => ({ ...i, _isRequired: idx === 0 })) ??
      [],
    conditions: vacancy ? vacancy.conditions : Site.defaultVacancyConditions,
  }
}
