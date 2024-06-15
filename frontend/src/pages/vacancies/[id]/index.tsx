import { useRouter } from 'next/router'
import { Routes } from '@/config/routes'
import Vacancy from '@/components/main/vacancies/Vacancy'

export default function VacancyPage() {
  const router = useRouter()

  return (
    <Vacancy
      id={router.query.id as string}
      backLink={{
        text: 'Вернуться на главную',
        url: Routes.home,
      }}
    />
  )
}
