import { useEffect, useState } from 'react'
import { WorkScope } from '@/types/entities/work-scope'
import { useWorkScopes } from '@/api/work-scopes'
import { useVacancies } from '@/api/vacancies'
import { Routes } from '@/config/routes'
import classNames from 'classnames'
import BaseButton from '@/components/ui/BaseButton'
import RemoteData from '@/components/special/RemoteData'
import VacancyCard from '@/components/base/vacancies/VacancyCard'
import Pagination from '@/components/ui/Pagination'
import Button from '@/components/ui/Button'
import styles from './HomeVacancies.module.scss'

export default function HomeVacancies() {
  const scopes = useWorkScopes()

  const [activeScope, setActiveScope] = useState<WorkScope | null>(null)
  const [page, setPage] = useState(0)

  useEffect(() => {
    setPage(0)
  }, [activeScope])

  const vacancies = useVacancies()

  return (
    <div className={styles.container}>
      <h2>Открытые вакансии</h2>
      <div className={styles.scopes}>
        <BaseButton
          className={classNames(styles.scope, {
            [styles.active]: !activeScope,
          })}
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
                {vacancies.data.map((vacancy) => (
                  <VacancyCard key={vacancy.id} vacancy={vacancy} />
                ))}
                <Pagination
                  className={styles.vacanciesPagination}
                  currentPage={vacancies.current_page}
                  lastPage={vacancies.last_page}
                  loadPage={(val) => setPage(val)}
                />
              </>
            )}
          />
        </div>
        <div className={styles.sidebar}>
          <div className={styles.sidebarText}>
            <h3>Не нашли подходящую вакансию?</h3>
            <p className={styles.sidebarTextHint}>
              Создайте аккаунт на нашем сайте и загрузите резюме. Мы сами
              предложим вам вакансию, как только появится подходящая
            </p>
          </div>
          <Button type="secondary" href={Routes.login} fullWidth>
            Создать аккаунт
          </Button>
        </div>
      </div>
    </div>
  )
}
