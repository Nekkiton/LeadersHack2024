import { useRouter } from 'next/router'
import { Page } from '@/types/page'
import { Role } from '@/types/entities/user'
import { Routes } from '@/config/routes'
import Candidate from '@/components/main/candidate/Candidate'

export default function RecruiterCandidatePage() {
  const router = useRouter()

  return (
    <Candidate
      id={router.query.id as string}
      backLink={{
        text: 'Вернуться к базе резюме',
        url: Routes.recruiterCandidates,
      }}
    />
  )
}

;(RecruiterCandidatePage as Page).permission = Role.Recruiter
