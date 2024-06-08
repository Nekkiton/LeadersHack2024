import { Page } from '@/types/page'
import { Role } from '@/types/entities/user'
import SidebarMenuLayout from '@/components/layouts/SidebarMenuLayout'

export default function CandidateProfilePage() {
  return <div>coming soon</div>
}

;(CandidateProfilePage as Page).layout = SidebarMenuLayout
;(CandidateProfilePage as Page).permission = Role.Candidate
