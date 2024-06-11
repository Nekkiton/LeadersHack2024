import {
  BaseEntity,
  BaseEntityPk,
  BaseEntityPkType,
} from '@/types/entities/base-entity'

export interface Stage extends BaseEntity {
  title: string
  auto_interview: boolean
  approve_template: string
  reject_template: string
  position: number
}

export interface UpdateStage
  extends Omit<Stage, typeof BaseEntityPk | 'created_at'> {
  [BaseEntityPk]?: BaseEntityPkType
  created_at?: string
}
