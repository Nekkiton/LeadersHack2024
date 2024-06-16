import { useRouter } from 'next/router'
import { Routes } from '@/config/routes'
import NewsSingle from '@/components/main/news/NewsSingle'

export default function NewsSinglePage() {
  const router = useRouter()

  return (
    <NewsSingle
      id={router.query.id as string}
      backLink={{ text: 'На главную', url: Routes.home }}
    />
  )
}
