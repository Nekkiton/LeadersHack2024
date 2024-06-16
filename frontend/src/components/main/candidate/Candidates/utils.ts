import { Site } from '@/config/site'
import { escapeRegexp } from '@/lib/escape-regexp'
import { GetCandidatesParams } from '@/types/entities/candidate'

export interface FiltersFormData {
  query: string | null
  work_experiences: string[]
  skills: string[]
}

export const transformFilters = (
  data: FiltersFormData,
  page: number
): GetCandidatesParams => {
  return {
    ...data,
    fio: data.query ? escapeRegexp(data.query) : undefined,
    experience: data.work_experiences,
    page,
    limit: Site.cardsPerPage,
  }
}
