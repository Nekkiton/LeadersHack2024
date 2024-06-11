import { useRouter } from 'next/router'
import { Routes } from '@/config/routes'
import { Page } from '@/types/page'
import { Role } from '@/types/entities/user'
import VacancyForm from '@/components/main/vacancies/VacancyForm'

export default function RecruiterEditVacancyPage() {
  const router = useRouter()

  return (
    <VacancyForm
      editId={router.query.id as string}
      backLink={{
        text: 'Назад к вакансии',
        url: Routes.recruiterVacancy(router.query.id as string),
      }}
    />
  )
}

;(RecruiterEditVacancyPage as Page).permission = Role.Recruiter
