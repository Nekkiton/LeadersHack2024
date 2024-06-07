import { Page } from '@/types/page'
import { Role } from '@/types/entities/user'
import SidebarMenuLayout from '@/components/layouts/SidebarMenuLayout'
import Vacancies from '@/components/main/vacancies/Vacancies'

export default function RecruiterVacanciesPage() {
  return <Vacancies role={Role.Recruiter} />
}

;(RecruiterVacanciesPage as Page).layout = SidebarMenuLayout
;(RecruiterVacanciesPage as Page).permission = Role.Recruiter
