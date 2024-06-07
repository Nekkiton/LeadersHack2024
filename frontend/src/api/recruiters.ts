import { Api } from '@/config/api'
import { createUseMutation } from '@/lib/create-use-mutation'

export const useCurRecruiterUpdateProfile = createUseMutation(
  Api.recruiters.me.updateProfile
)
