import { Role } from '@/types/entities/user'
import { Page } from '@/types/page'
import SidebarMenuLayout from '@/components/layouts/SidebarMenuLayout'
import Candidates from '@/components/main/candidate/Candidates'

export default function RecruiterCandidatesPage() {
  return <Candidates />
}

;(RecruiterCandidatesPage as Page).layout = SidebarMenuLayout
;(RecruiterCandidatesPage as Page).permission = Role.Recruiter
