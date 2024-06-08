import { Page } from '@/types/page'
import { Role } from '@/types/entities/user'
import SidebarMenuLayout from '@/components/layouts/SidebarMenuLayout'

export default function CandidateResponsesPage() {
  return <div>coming soon</div>
}

;(CandidateResponsesPage as Page).layout = SidebarMenuLayout
;(CandidateResponsesPage as Page).permission = Role.Candidate
