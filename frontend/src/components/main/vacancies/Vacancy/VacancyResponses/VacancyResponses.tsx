import { useState } from 'react'
import { Vacancy } from '@/types/entities/vacancy'
import { Role } from '@/types/entities/user'
import { useCurRecruiterResponses } from '@/api/responses'
import { Site } from '@/config/site'
import RemoteData from '@/components/special/RemoteData'
import ResponseCard from '@/components/base/responses/ResponseCard'
import Pagination from '@/components/ui/Pagination'
import Icon from '@/components/ui/Icon'
import styles from './VacancyResponses.module.scss'

interface Props {
  vacancy: Vacancy
}

export default function VacancyResponses({ vacancy }: Props) {
  const [page, setPage] = useState(0)

  const responses = useCurRecruiterResponses({
    vacancy_id: vacancy._id,
    page,
    limit: Site.cardsPerPage,
  })

  return (
    <RemoteData
      data={responses}
      renderSuccess={(data) => (
        <div className={styles.container}>
          <div className={styles.responses}>
            {data.items.length ? (
              data.items.map((response) => (
                <ResponseCard
                  key={response._id}
                  response={response}
                  role={Role.Recruiter}
                  vacancy={vacancy}
                />
              ))
            ) : (
              <div className={styles.nothing}>
                <Icon className={styles.nothingIcon} icon="documentLoupe" />
                <p>Откликов еще нет</p>
              </div>
            )}
            <Pagination
              page={data.page}
              totalPages={data.total_pages}
              loadPage={(val) => setPage(val)}
            />
          </div>
          <div className={styles.sidebar}>
            {/* TODO: data from api */}
            <div className={styles.sidebarBlock}>
              <h6>Соответствие вакансии</h6>
              <div className={styles.sidebarItem}>
                <span className={styles.sidebarItemMainTitle}>Не важно</span>
                <span className={styles.sidebarItemValue}>7</span>
              </div>
              <div className={styles.sidebarItem}>
                <span>от 30%</span>
                <span className={styles.sidebarItemValue}>6</span>
              </div>
            </div>
            <span className={styles.sidebarSeparator} />
            <div className={styles.sidebarBlock}>
              <h6>Воронка</h6>
              <div className={styles.sidebarItem}>
                <span className={styles.sidebarItemMainTitle}>Все</span>
                <span className={styles.sidebarItemValue}>7</span>
              </div>
              <div className={styles.sidebarItem}>
                <span>Неразобранные</span>
                <span className={styles.sidebarItemValue}>4</span>
              </div>
            </div>
          </div>
        </div>
      )}
    />
  )
}
