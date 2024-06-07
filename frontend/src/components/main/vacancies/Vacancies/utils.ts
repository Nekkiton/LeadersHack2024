import { GetVacanciesParams } from '@/types/entities/vacancy'

export interface FiltersFormData {
  query: string | null
  statuses: string[]
  recruiters: string[]
  work_scopes: string[]
}

export const transformFilters = (data: FiltersFormData): GetVacanciesParams => {
  return {
    ...data,
    query: data.query ?? undefined,
  }
}
