import { Api } from '@/config/api'
import { createUseQuery } from '@/lib/create-use-query'

export const useCurUserNotifications = createUseQuery(
  'notifications.all',
  Api.notifications.all
)
