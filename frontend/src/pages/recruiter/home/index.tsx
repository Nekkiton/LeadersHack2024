import { Role } from '@/types/entities/user'
import { Page } from '@/types/page'
import SidebarMenuLayout from '@/components/layouts/SidebarMenuLayout'

export default function RecruiterHomePage() {
  return <div>coming soon</div>
}

;(RecruiterHomePage as Page).layout = SidebarMenuLayout
;(RecruiterHomePage as Page).permission = Role.Recruiter
