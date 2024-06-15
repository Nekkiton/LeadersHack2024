import { Api } from '@/config/api'
import { createUseQuery } from '@/lib/create-use-query'

export const useResponseSchedule = createUseQuery(
  'responses.schedule',
  Api.responses.schedule
)

export const useCurRecruiterResponses = createUseQuery(
  'recruiters.me.responses',
  Api.recruiters.me.responses
)
