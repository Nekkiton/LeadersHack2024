import { BaseEntity } from '@/types/entities/base-entity'

export interface InterviewSlots extends BaseEntity {
  recruiter_id: string
  start_time: string
  end_time: string
}
