import { useRouter } from 'next/router'
import { Role } from '@/types/entities/user'
import { Page } from '@/types/page'
import { Routes } from '@/config/routes'
import Vacancy from '@/components/main/vacancies/Vacancy'

export default function RecruiterVacancyPage() {
  const router = useRouter()

  return (
    <Vacancy
      id={router.query.id as string}
      role={Role.Recruiter}
      backLink={{
        text: 'Вернуться к вакансиям',
        url: Routes.recruiterVacancies,
      }}
    />
  )
}

;(RecruiterVacancyPage as Page).permission = Role.Recruiter
