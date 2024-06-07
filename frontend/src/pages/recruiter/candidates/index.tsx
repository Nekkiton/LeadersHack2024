import { Role } from '@/types/entities/user'
import { Page } from '@/types/page'
import SidebarMenuLayout from '@/components/layouts/SidebarMenuLayout'

export default function RecruiterCandidatesPage() {
  return <div>coming soon</div>
}

;(RecruiterCandidatesPage as Page).layout = SidebarMenuLayout
;(RecruiterCandidatesPage as Page).permission = Role.Recruiter
