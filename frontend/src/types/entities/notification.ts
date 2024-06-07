import { BaseEntity } from '@/types/entities/base-entity'

export enum NotificationType {
  Website = 'website',
  Telegram = 'telegram',
}

export interface Notification extends BaseEntity {
  user_id: string
  type: NotificationType
  isActive: boolean
  messages: string[] // TODO
}

export interface NotificationMessage extends BaseEntity {
  date: string
  message: string
  message_id: string
}
