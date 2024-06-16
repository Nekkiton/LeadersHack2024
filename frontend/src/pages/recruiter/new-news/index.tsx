import { Routes } from '@/config/routes'
import { Role } from '@/types/entities/user'
import { Page } from '@/types/page'
import NewsForm from '@/components/main/news/NewsForm'

export default function NewNewsPage() {
  return (
    <NewsForm
      backLink={{ text: 'Вернуться к новостям', url: Routes.recruiterNews }}
    />
  )
}

;(NewNewsPage as Page).permission = Role.Recruiter
