import { Api } from '@/config/api'
import { createUseMutation } from '@/lib/create-use-mutation'
import { createUseQuery } from '@/lib/create-use-query'

export const useRecruiters = createUseQuery(
  'recruiters.all',
  Api.recruiters.all
)

export const useCurRecruiterUpdateProfile = createUseMutation(
  Api.recruiters.me.updateProfile
)
