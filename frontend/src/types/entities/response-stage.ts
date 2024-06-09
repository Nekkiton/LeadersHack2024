import { BaseEntity } from '@/types/entities/base-entity'
import { Candidate } from '@/types/entities/candidate'
import { Stage } from '@/types/entities/stage'
import { Vacancy } from '@/types/entities/vacancy'

export enum ResponseStageStatus {
  WaitingForCandidate = 'waiting_for_candidate',
  ApprovedByCandidate = 'approved_by_candidate',
  RejectedByCandidate = 'rejected_by_candidate',
  WaitingForRecruiter = 'waiting_for_recruiter',
  ApprovedByRecruiter = 'approved_by_recruiter',
  RejectedByRecruiter = 'rejected_by_recruiter',
}

export interface ResponseStage extends BaseEntity {
  candidate_id: string
  candidate?: Candidate // TODO
  vacancy_id: string
  vacancy?: Vacancy // TODO
  stage_id: string
  stage?: Stage // TODO
  status: ResponseStageStatus
  meet_link: string
  recruiter_message: string
  recruiter_message_timestamp: string
  candidate_message: string
  candidate_timestamp: string
  meed_date: string
}
