import { Page } from '@/types/page'
import { Role } from '@/types/entities/user'
import SidebarMenuLayout from '@/components/layouts/SidebarMenuLayout'
import Vacancies from '@/components/main/vacancies/Vacancies'

export default function CandidateVacanciesPage() {
  return <Vacancies role={Role.Candidate} />
}

;(CandidateVacanciesPage as Page).layout = SidebarMenuLayout
;(CandidateVacanciesPage as Page).permission = Role.Candidate
