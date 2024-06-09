import { Role } from '@/types/entities/user'
import { Page } from '@/types/page'
import SidebarMenuLayout from '@/components/layouts/SidebarMenuLayout'

export default function RecruiterNewsPage() {
  return <div>coming soon</div>
}

;(RecruiterNewsPage as Page).layout = SidebarMenuLayout
;(RecruiterNewsPage as Page).permission = Role.Recruiter
