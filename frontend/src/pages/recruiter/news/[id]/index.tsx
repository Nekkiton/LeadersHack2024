import { useRouter } from 'next/router'
import { Routes } from '@/config/routes'
import { Page } from '@/types/page'
import { Role } from '@/types/entities/user'
import NewsSingle from '@/components/main/news/NewsSingle'

export default function RecruiterNewsSinglePage() {
  const router = useRouter()

  return (
    <NewsSingle
      id={router.query.id as string}
      backLink={{ text: 'Вернуться к новостям', url: Routes.recruiterNews }}
      role={Role.Recruiter}
    />
  )
}

;(RecruiterNewsSinglePage as Page).permission = Role.Recruiter
