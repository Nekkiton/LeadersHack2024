import { Page } from '@/types/page'
import { Role } from '@/types/entities/user'
import SidebarMenuLayout from '@/components/layouts/SidebarMenuLayout'

export default function CandidateVacanciesPage() {
  return <div>coming soon</div>
}

;(CandidateVacanciesPage as Page).layout = SidebarMenuLayout
;(CandidateVacanciesPage as Page).permission = Role.Candidate
