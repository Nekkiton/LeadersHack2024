import { useRouter } from 'next/router'
import { Routes } from '@/config/routes'
import { Role } from '@/types/entities/user'
import { Page } from '@/types/page'
import NewsForm from '@/components/main/news/NewsForm'

export default function RecruiterEditNewsPage() {
  const router = useRouter()

  return (
    <NewsForm
      editId={router.query.id as string}
      backLink={{
        url: Routes.recruiterNews,
        text: 'Вернуться к новостям',
      }}
    />
  )
}

;(RecruiterEditNewsPage as Page).permission = Role.Recruiter
