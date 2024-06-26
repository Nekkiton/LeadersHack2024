import { useEffect, useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { Role } from '@/types/entities/user'
import {
  useCurCandidateVacancies,
  useCurRecruiterVacancies,
} from '@/api/vacancies'
import { Routes } from '@/config/routes'
import {
  CandidateFiltersFormData,
  RecruiterFiltersFormData,
  transformCandidateFilters,
  transformRecruiterFilters,
} from './utils'
import Link from 'next/link'
import RemoteData from '@/components/special/RemoteData'
import Button from '@/components/ui/Button'
import Icon from '@/components/ui/Icon'
import VacancyCard from '@/components/base/vacancies/VacancyCard'
import VacanciesFilters from './VacanciesFilters'
import styles from './Vacancies.module.scss'
import Pagination from '@/components/ui/Pagination'

interface Props {
  role: Role
}

export default function Vacancies({ role }: Props) {
  const formMethods = useForm<
    CandidateFiltersFormData & RecruiterFiltersFormData
  >({
    defaultValues: {
      query: null,
      scopes: [],
      statuses: [],
      skills: [],
      recommended: false,
    },
  })
  const { watch } = formMethods
  const filters = watch()

  const [page, setPage] = useState(0)
  watch(() => {
    setPage(0)
  })

  const [vacanciesExist, setVacanciesExist] = useState<null | boolean>(null)

  const candidateVacancies = useCurCandidateVacancies(
    { ...transformCandidateFilters(filters), page },
    { enabled: role === Role.Candidate }
  )
  const recruiterVacancies = useCurRecruiterVacancies(
    { ...transformRecruiterFilters(filters), page },
    { enabled: role === Role.Recruiter }
  )

  useEffect(() => {
    if (vacanciesExist === null) {
      if (role === Role.Candidate && candidateVacancies.status === 'success') {
        setVacanciesExist(!!candidateVacancies.value.items.length)
      } else if (
        role === Role.Recruiter &&
        recruiterVacancies.status === 'success'
      ) {
        setVacanciesExist(!!recruiterVacancies.value.items.length)
      }
    }
  }, [vacanciesExist, candidateVacancies, recruiterVacancies, role])

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>{role === Role.Candidate ? 'Вакансии для вас' : 'Вакансии'}</h1>
        {role === Role.Recruiter && vacanciesExist !== false && (
          <Button type="primary" href={Routes.recruiterNewVacancy}>
            <Icon icon="plus" />
            <span>Создать вакансию</span>
          </Button>
        )}
      </div>
      {vacanciesExist && (
        <FormProvider {...formMethods}>
          <VacanciesFilters role={role} />
        </FormProvider>
      )}
      <RemoteData
        data={role === Role.Candidate ? candidateVacancies : recruiterVacancies}
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
              {role === Role.Candidate && (
                <p>
                  Сейчас для вас нет подходящих
                  <br />
                  вакансий
                </p>
              )}
            </div>
          ) : (
            <>
              {vacancies.items.length ? (
                vacancies.items.map((vacancy) => (
                  <Link
                    href={
                      {
                        [Role.Recruiter]: Routes.recruiterVacancy(vacancy._id),
                        [Role.Candidate]: Routes.candidateVacancy(vacancy._id),
                      }[role]
                    }
                    key={vacancy._id}
                  >
                    <VacancyCard vacancy={vacancy} role={role} />
                  </Link>
                ))
              ) : (
                <div className={styles.nothing}>
                  <Icon className={styles.nothingIcon} icon="loupeOff" />
                  <p>К сожалению, по вашему запросу ничего не найдено</p>
                </div>
              )}
              <Pagination
                page={vacancies.page}
                totalPages={vacancies.total_pages}
                loadPage={(val) => setPage(val)}
              />
            </>
          )
        }
      />
    </div>
  )
}
