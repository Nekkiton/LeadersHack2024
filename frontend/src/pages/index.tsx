import { Page } from '@/types/page'
import SidebarMenuLayout from '@/components/layouts/SidebarMenuLayout'

export default function HomePage() {
  return <h1>Leaders Hack 2024!</h1>
}

;(HomePage as Page).layout = SidebarMenuLayout
