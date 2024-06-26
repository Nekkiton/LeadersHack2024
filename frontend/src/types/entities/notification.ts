import { BaseEntity } from '@/types/entities/base-entity'

export enum NotificationType {
  Website = 'website',
  Telegram = 'telegram',
}

export interface Notification extends BaseEntity {
  title: string
  content: string
  is_read: boolean
}
