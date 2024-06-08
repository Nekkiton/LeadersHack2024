import { useEffect, useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { Role } from '@/types/entities/user'
import { useVacancies } from '@/api/vacancies'
import { Routes } from '@/config/routes'
import { FiltersFormData, transformFilters } from './utils'
import Link from 'next/link'
import RemoteData from '@/components/special/RemoteData'
import Button from '@/components/ui/Button'
import Icon from '@/components/ui/Icon'
import VacancyCard from '@/components/base/vacancies/VacancyCard'
import VacanciesFilters from './VacanciesFilters'
import styles from './Vacancies.module.scss'
import Pagination from '@/components/ui/Pagination'

interface Props {
  role?: Role
}

export default function Vacancies({ role }: Props) {
  const formMethods = useForm<FiltersFormData>({
    defaultValues: {
      query: null,
      statuses: [],
      recruiters: [],
      work_scopes: [],
    },
  })
  const { watch } = formMethods
  const filters = watch()

  const [page, setPage] = useState(1)
  const [vacanciesExist, setVacanciesExist] = useState<null | boolean>(null)

  const vacancies = useVacancies({ ...transformFilters(filters), page })

  useEffect(() => {
    if (vacanciesExist === null && vacancies.status === 'success') {
      setVacanciesExist(!!vacancies.value.data.length)
    }
  }, [vacancies, vacanciesExist])

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Вакансии</h1>
        {role === Role.Recruiter && vacanciesExist !== false && (
          <Button type="primary" href={Routes.recruiterNewVacancy}>
            <Icon icon="plus" />
            <span>Создать вакансию</span>
          </Button>
        )}
      </div>
      {vacanciesExist && (
        <FormProvider {...formMethods}>
          <VacanciesFilters />
        </FormProvider>
      )}
      <RemoteData
        data={vacancies}
        renderSuccess={(vacancies) =>
          !vacanciesExist ? (
            <div className={styles.nothing}>
              <Icon className={styles.nothingIcon} icon="documentLoupe" />
              {role === Role.Recruiter && (
                <>
                  <p>
                    Вы еще не создали ни одной вакансии.
                    <br />
                    Самое время это исправить
                  </p>
                  <Button type="primary" href={Routes.recruiterNewVacancy}>
                    <Icon icon="plus" />
                    <span>Создать вакансию</span>
                  </Button>
                </>
              )}
            </div>
          ) : (
            <>
              {vacancies.data.map((vacancy) => (
                <Link
                  href={
                    role === Role.Recruiter
                      ? Routes.recruiterVacancy(vacancy.id)
                      : '#'
                  }
                  key={vacancy.id}
                >
                  <VacancyCard vacancy={vacancy} />
                </Link>
              ))}
              <Pagination
                currentPage={vacancies.current_page}
                lastPage={vacancies.last_page}
                loadPage={(val) => setPage(val)}
              />
            </>
          )
        }
      />
    </div>
  )
}
