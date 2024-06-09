import { useRouter } from 'next/router'
import { Page } from '@/types/page'
import { Role } from '@/types/entities/user'
import { Routes } from '@/config/routes'
import Vacancy from '@/components/main/vacancies/Vacancy'

export default function CandidateVacancyPage() {
  const router = useRouter()

  return (
    <Vacancy
      id={router.query.id as string}
      role={Role.Candidate}
      backLink={{
        text: 'Вернуться к вакансиям',
        url: Routes.candidateVacancies,
      }}
    />
  )
}

;(CandidateVacancyPage as Page).permission = Role.Candidate
