import { Api } from '@/config/api'
import { createUseMutation } from '@/lib/create-use-mutation'
import { createUseQuery } from '@/lib/create-use-query'

export const useCandidates = createUseQuery(
  'candidates.all',
  Api.candidates.all
)

export const useCurCandidateUpdateProfile = createUseMutation(
  Api.candidates.me.updateProfile
)
