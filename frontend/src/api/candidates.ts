import { Api } from '@/config/api'
import { createUseMutation } from '@/lib/create-use-mutation'
import { createUseQuery } from '@/lib/create-use-query'

export const useCandidates = createUseQuery(
  'candidates.all',
  Api.candidates.all
)

export const useCandidate = createUseQuery('candidates.one', Api.candidates.one)

export const useCurCandidateResponses = createUseQuery(
  'candidates.me.responses',
  Api.candidates.me.responses
)

export const useCurCandidateUpdateProfile = createUseMutation(
  Api.candidates.me.updateProfile
)

export const useCurCandidateUpdateProfileFromFile = createUseMutation(
  Api.candidates.me.updateProfileFromFile
)
