import { BaseEntity } from '@/types/entities/base-entity'

export interface Notification extends BaseEntity {
  user_id: string
  message: string
}
