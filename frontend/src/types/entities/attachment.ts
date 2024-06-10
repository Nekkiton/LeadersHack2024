import { BaseEntity } from '@/types/entities/base-entity'

export interface Attachment extends BaseEntity {
  name: string
  size: number
}

export interface UpdateAttachment extends Omit<Attachment, 'id'> {
  id?: string
}
