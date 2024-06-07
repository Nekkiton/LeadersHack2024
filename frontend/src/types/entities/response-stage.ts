import { BaseEntity } from '@/types/entities/base-entity'

export enum ResponseStageStatus {}

export interface ResponseStage extends BaseEntity {
  candidate_id: string
  vacancy_id: string
  stage_id: string
  status: ResponseStageStatus
  meet_link: string
  recruiter_message: string
  recruiter_message_timestamp: string
  candidate_timestamp: string
  meed_date: string
}
