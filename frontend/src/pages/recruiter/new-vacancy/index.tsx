import { Page } from '@/types/page'
import { Role } from '@/types/entities/user'
import { Routes } from '@/config/routes'
import VacancyForm from '@/components/main/vacancies/VacancyForm'

export default function RecruiterNewVacancyPage() {
  return (
    <VacancyForm
      backLink={{
        text: 'Вернуться к вакансиям',
        url: Routes.recruiterVacancies,
      }}
    />
  )
}

;(RecruiterNewVacancyPage as Page).permission = Role.Recruiter
