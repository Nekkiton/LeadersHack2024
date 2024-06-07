import { Page } from '@/types/page'
import { Role } from '@/types/entities/user'
import VacancyForm from '@/components/main/vacancies/VacancyForm'

export default function RecruiterNewVacancyPage() {
  return <VacancyForm />
}

;(RecruiterNewVacancyPage as Page).permission = Role.Recruiter
