import { Page } from '@/types/page'
import { Role } from '@/types/entities/user'
import SidebarMenuLayout from '@/components/layouts/SidebarMenuLayout'
import CandidateProfile from '@/components/main/candidate/CandidateProfile'

export default function CandidateProfilePage() {
  return <CandidateProfile />
}

;(CandidateProfilePage as Page).layout = SidebarMenuLayout
;(CandidateProfilePage as Page).permission = Role.Candidate
