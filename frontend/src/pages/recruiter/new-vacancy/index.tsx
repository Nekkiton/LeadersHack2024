import { useRouter } from 'next/router'
import { Page } from '@/types/page'
import { Role } from '@/types/entities/user'
import { Routes } from '@/config/routes'
import VacancyForm from '@/components/main/vacancies/VacancyForm'

export default function RecruiterNewVacancyPage() {
  const router = useRouter()

  return (
    <VacancyForm
      backLink={
        router.query.copyId
          ? {
              text: 'Вернуться к вакансии',
              url: Routes.recruiterVacancy(router.query.copyId as string),
            }
          : {
              text: 'Вернуться к вакансиям',
              url: Routes.recruiterVacancies,
            }
      }
      copyId={router.query.copyId as string | undefined}
    />
  )
}

;(RecruiterNewVacancyPage as Page).permission = Role.Recruiter
