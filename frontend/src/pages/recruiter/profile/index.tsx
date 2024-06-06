import { Page } from '@/types/page'
import { Role } from '@/types/entities/user'
import SidebarMenuLayout from '@/components/layouts/SidebarMenuLayout'
import RecruiterProfile from '@/components/main/recriuter/RecruiterProfile'

export default function RecruiterProfilePage() {
  return <RecruiterProfile />
}

;(RecruiterProfilePage as Page).layout = SidebarMenuLayout
;(RecruiterProfilePage as Page).permission = Role.Recruiter
