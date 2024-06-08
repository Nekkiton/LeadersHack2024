import { Api } from '@/config/api'
import { createUseMutation } from '@/lib/create-use-mutation'

export const useCurCandidateUpdateProfile = createUseMutation(
  Api.candidates.me.updateProfile
)
