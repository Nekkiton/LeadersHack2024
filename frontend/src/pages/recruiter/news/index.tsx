import { Role } from '@/types/entities/user'
import { Page } from '@/types/page'
import SidebarMenuLayout from '@/components/layouts/SidebarMenuLayout'
import News from '@/components/main/news/News'

export default function RecruiterNewsPage() {
  return <News />
}

;(RecruiterNewsPage as Page).layout = SidebarMenuLayout
;(RecruiterNewsPage as Page).permission = Role.Recruiter
