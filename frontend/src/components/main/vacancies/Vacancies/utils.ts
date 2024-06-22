import { Site } from '@/config/site'
import { escapeRegexp } from '@/lib/escape-regexp'
import { Skill } from '@/types/entities/skill'
import {
  GetCandidateVacanciesParams,
  GetRecruiterVacanciesParams,
  VacancyStatus,
} from '@/types/entities/vacancy'
import { WorkScope } from '@/types/entities/work-scope'

export interface CandidateFiltersFormData {
  query: string | null
  scopes: WorkScope[]
  skills: Skill[]
  recommended: boolean
}

export interface RecruiterFiltersFormData {
  query: string | null
  statuses?: VacancyStatus[]
  scopes?: WorkScope[]
}

export const transformCandidateFilters = (
  data: CandidateFiltersFormData
): GetCandidateVacanciesParams => {
  return {
    ...data,
    query: data.query ? escapeRegexp(data.query) : undefined,
    limit: Site.cardsPerPage,
    match: data.recommended ? 50 : 0,
  }
}

export const transformRecruiterFilters = (
  data: RecruiterFiltersFormData
): GetRecruiterVacanciesParams => {
  return {
    ...data,
    query: data.query ? escapeRegexp(data.query) : undefined,
    limit: Site.cardsPerPage,
  }
}
