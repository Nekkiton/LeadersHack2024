import { BaseEntity, BaseEntityPkType } from '@/types/entities/base-entity'
import { Role } from '@/types/entities/user'
import { Vacancy } from '@/types/entities/vacancy'

export enum ResponseStatus {
  WaitingForRecruiter = 'waiting_for_recruiter',
  WaitingForCandidate = 'waiting_for_candidate',
  Rejected = 'rejected',
  Approved = 'approved',
}

export enum ResponseMessageType {
  CandidateRequest = 'candidate_request',
  RecruiterRequest = 'recruiter_request',
  NextStageRequest = 'next_stage_request',
  CandidateAnswer = 'candidate_answer',
  Result = 'result',
}

export interface Response extends BaseEntity {
  status: ResponseStatus
  // candidate_id: string // TODO
  // vacancy_id: string // TODO
  vacancy?: Vacancy
  messages: {
    created_at: string
    type: ResponseMessageType
    text: string
    meet_date?: string | null
    meet_link?: string | null
    sender_role: Role
    stage_id: BaseEntityPkType
  }[]
}

export interface GetCandidateResponsesParams {
  page?: number
  limit?: number
  inviter?: 'recruiter' | 'candidate'
}