import { GetCandidatesParams } from '@/types/entities/candidate'

export interface FiltersFormData {
  query: string | null
  work_experiences: string[]
  skills: string[]
}

export const transformFilters = (
  data: FiltersFormData
): GetCandidatesParams => {
  return {
    ...data,
    query: data.query ?? undefined,
  }
}
