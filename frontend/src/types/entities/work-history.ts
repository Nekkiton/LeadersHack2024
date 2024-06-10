import { BaseEntity } from '@/types/entities/base-entity'

export interface WorkHistory extends BaseEntity {
  company: string
  job_title: string
  start_date: string
  end_date: string | null
  responsabilites: string
}

export interface UpdateWorkHistory extends Omit<WorkHistory, 'id'> {
  id?: string
}
