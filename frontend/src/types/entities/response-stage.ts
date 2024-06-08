import { BaseEntity } from '@/types/entities/base-entity'
import { Candidate } from '@/types/entities/candidate'

export enum ResponseStageStatus {
  ApprovedByCandidate = 'approved_by_candidate',
  ApprovedByRecruiter = 'approved_by_recruiter',
  RejectedByCandidate = 'rejected_by_candidate',
  RejectedByRecruiter = 'rejected_by_recruiter',
}

export interface ResponseStage extends BaseEntity {
  candidate_id: string
  candidate?: Candidate // TODO
  vacancy_id: string
  stage_id: string
  status: ResponseStageStatus
  meet_link: string
  recruiter_message: string
  recruiter_message_timestamp: string
  candidate_timestamp: string
  meed_date: string
}
