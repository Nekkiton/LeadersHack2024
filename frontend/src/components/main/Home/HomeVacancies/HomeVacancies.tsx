import { useEffect, useState } from 'react'
import { WorkScope } from '@/types/entities/work-scope'
import { useWorkScopes } from '@/api/work-scopes'
import { useVacancies } from '@/api/vacancies'
import { Routes } from '@/config/routes'
import { Site } from '@/config/site'
import { VacancyStatus } from '@/types/entities/vacancy'
import { useCurUser } from '@/api/users'
import { Role } from '@/types/entities/user'
import classNames from 'classnames'
import Link from 'next/link'
import BaseButton from '@/components/ui/BaseButton'
import RemoteData from '@/components/special/RemoteData'
import VacancyCard from '@/components/base/vacancies/VacancyCard'
import Pagination from '@/components/ui/Pagination'
import Button from '@/components/ui/Button'
import styles from './HomeVacancies.module.scss'

export default function HomeVacancies() {
  const user = useCurUser()

  const scopes = useWorkScopes()

  const [activeScope, setActiveScope] = useState<WorkScope | null>(null)

  const [page, setPage] = useState(0)
  useEffect(() => {
    setPage(0)
  }, [activeScope])

  const vacancies = useVacancies({
    page,
    scope: activeScope ?? undefined,
    limit: Site.cardsPerPage,
    status: VacancyStatus.Active,
  })

  return (
    <div className={styles.container}>
      <h2>Открытые вакансии</h2>
      <div className={styles.scopes}>
        <BaseButton
          className={classNames(styles.scope, {
            [styles.active]: !activeScope,
          })}
          onClick={() => setActiveScope(null)}
        >
          Все
        </BaseButton>
        {scopes.status === 'success' &&
          scopes.value.map((scope) => (
            <BaseButton
              className={classNames(styles.scope, {
                [styles.active]: scope === activeScope,
              })}
              key={scope}
              onClick={() => setActiveScope(scope)}
            >
              {scope}
            </BaseButton>
          ))}
      </div>
      <div className={styles.main}>
        <div className={styles.vacancies}>
          <RemoteData
            data={vacancies}
            renderSuccess={(vacancies) => (
              <>
                {!vacancies.items.length && <p>Ничего нет</p>}
                {vacancies.items.map((vacancy) => (
                  <Link key={vacancy._id} href={Routes.vacancy(vacancy._id)}>
                    <VacancyCard vacancy={vacancy} />
                  </Link>
                ))}
                <Pagination
                  className={styles.vacanciesPagination}
                  totalPages={vacancies.total_pages}
                  page={vacancies.page}
                  loadPage={(val) => setPage(val)}
                />
              </>
            )}
          />
        </div>
        {(user as any).value?.role !== Role.Recruiter && (
          <div className={styles.sidebar}>
            <div className={styles.sidebarText}>
              <h3>Не нашли подходящую вакансию?</h3>
              <p className={styles.sidebarTextHint}>
                {user.status === 'success' && user.value
                  ? 'Загрузите резюме.'
                  : 'Создайте аккаунт на нашем сайте и загрузите резюме.'}{' '}
                Мы сами предложим вам вакансию, как только появится подходящая
              </p>
            </div>
            {user.status === 'success' && user.value ? (
              <Button
                type="secondary"
                fullWidth
                href={{
                  pathname: Routes.candidateProfile,
                  query: { action: 'upload-cv' },
                }}
              >
                Загрузить резюме
              </Button>
            ) : (
              <Button type="secondary" href={Routes.register} fullWidth>
                Создать аккаунт
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
