import { BaseEntity } from '@/types/entities/base-entity'
import { Candidate } from './candidate'

export interface Response extends BaseEntity {
  candidate_id: string
  candidate?: Candidate // TODO
  vacancy_id: string
}
