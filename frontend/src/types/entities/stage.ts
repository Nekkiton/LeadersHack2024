import { BaseEntity } from '@/types/entities/base-entity'

export interface Stage extends BaseEntity {
  title: string
  auto_interview: boolean
  approve_template: string
  reject_template: string
  position: number
}

export interface UpdateStage extends Omit<Stage, 'id'> {
  id?: string
}
