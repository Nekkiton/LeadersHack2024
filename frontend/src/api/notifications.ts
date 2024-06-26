import { Api } from '@/config/api'
import { createUseMutation } from '@/lib/create-use-mutation'
import { createUseQuery } from '@/lib/create-use-query'

export const useCurUserNotifications = createUseQuery(
  'notifications.all',
  Api.notifications.all,
  {
    refetchInterval: 1000 * 60 * 2,
  }
)

export const useCurUserReadNotifications = createUseMutation(
  Api.notifications.read,
  {
    invalidateQueriesFn: () => [{ queryKey: ['notifications.all'] }],
  }
)
