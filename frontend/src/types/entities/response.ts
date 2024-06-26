import { BaseEntity, BaseEntityPkType } from '@/types/entities/base-entity'
import { Role } from '@/types/entities/user'
import { Vacancy } from '@/types/entities/vacancy'
import { Candidate } from '@/types/entities/candidate'

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
  Custom = 'message',
}

export interface Response extends BaseEntity {
  status: ResponseStatus
  stage_id: string
  candidate?: Candidate
  vacancy?: Vacancy
  match?: number
  inviter: Role
  comment: string | null
  messages: {
    created_at: string
    type: ResponseMessageType
    text: string
    meet_at?: string | null
    meet_url?: string | null
    meet_on?: string | null
    sender_role: Role
    stage_id: BaseEntityPkType
    interview_timestamp?: string
  }[]
}

export interface GetCandidateResponsesParams {
  page?: number
  limit?: number
  inviter?: 'recruiter' | 'candidate'
}

export interface GetRecruiterResponsesParams {
  page?: number
  limit?: number
  vacancy_id: string
}

export interface CurCandidateAnswerToResponseData {
  status: 'approve' | 'reject'
  message: string | null
  meet_at: string | null
  meet_on: 'zoom' | 'googlemeet' | 'telemost' | null
}

export interface CurRecruiterAnswerToResponseData {
  status: 'approve' | 'reject'
  message: string
}

export interface CommentResponseData {
  comment: string
}

export interface GetResponseScheduleParams {
  end: string
}

export interface SendResponseMessageData {
  message: string
}
