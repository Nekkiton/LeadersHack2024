import { BaseEntity } from '@/types/entities/base-entity'

export interface InterviewSlot extends BaseEntity {
  // recruiter_id: string // TODO
  start_time: string
  end_time: string
}

export interface UpdateInterviewSlot extends Omit<InterviewSlot, 'id'> {
  id?: string
}
