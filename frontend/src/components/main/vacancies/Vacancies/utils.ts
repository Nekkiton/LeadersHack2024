import { Skill } from '@/types/entities/skill'
import {
  GetCandidateVacanciesParams,
  GetRecruiterVacanciesParams,
  VacancyStatus,
} from '@/types/entities/vacancy'
import { WorkScope } from '@/types/entities/work-scope'

export interface CandidateFiltersFormData {
  query: string | null
  work_scopes: WorkScope[]
  skills: Skill[]
}

export interface RecruiterFiltersFormData {
  query: string | null
  statuses?: VacancyStatus[]
  work_scopes?: WorkScope[]
}

export const transformCandidateFilters = (
  data: CandidateFiltersFormData
): GetCandidateVacanciesParams => {
  return {
    ...data,
    query: data.query ?? undefined,
  }
}

export const transformRecruiterFilters = (
  data: RecruiterFiltersFormData
): GetRecruiterVacanciesParams => {
  return {
    ...data,
    query: data.query ?? undefined,
  }
}
