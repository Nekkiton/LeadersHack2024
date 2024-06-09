import { Page } from '@/types/page'
import { Role } from '@/types/entities/user'
import SidebarMenuLayout from '@/components/layouts/SidebarMenuLayout'
import Responses from '@/components/main/responses/Responses'

export default function CandidateResponsesPage() {
  return <Responses />
}

;(CandidateResponsesPage as Page).layout = SidebarMenuLayout
;(CandidateResponsesPage as Page).permission = Role.Candidate
