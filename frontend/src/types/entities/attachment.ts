import {
  BaseEntity,
  BaseEntityPk,
  BaseEntityPkType,
} from '@/types/entities/base-entity'

export interface Attachment extends BaseEntity {
  name: string
  size: number
}

export interface UpdateAttachment
  extends Omit<Attachment, typeof BaseEntityPk> {
  [BaseEntityPk]?: BaseEntityPkType
}
