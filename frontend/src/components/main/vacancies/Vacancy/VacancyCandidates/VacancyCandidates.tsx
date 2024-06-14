import { useState } from 'react'
import { Vacancy } from '@/types/entities/vacancy'
import { useVacancyCandidates } from '@/api/candidates'
import { Site } from '@/config/site'
import classNames from 'classnames'
import Pagination from '@/components/ui/Pagination'
import RemoteData from '@/components/special/RemoteData'
import CandidateCard from '@/components/base/candidates/CandidateCard'
import Icon from '@/components/ui/Icon'
import styles from './VacancyCandidates.module.scss'

interface Props {
  vacancy: Vacancy
}

export default function VacancyCandidates({ vacancy }: Props) {
  const [page, setPage] = useState(0)

  const candidates = useVacancyCandidates({
    vacancy_id: vacancy._id,
    page,
    limit: Site.cardsPerPage,
  })

  return (
    <RemoteData
      data={candidates}
      renderSuccess={(candidates) => (
        <div className={styles.container}>
          <div className={styles.candidates}>
            {candidates.items.length ? (
              candidates.items.map((candidate) => (
                <CandidateCard
                  key={candidate._id}
                  candidate={candidate}
                  type="expandedTop"
                  vacancy={vacancy}
                />
              ))
            ) : (
              <div className={styles.nothing}>
                <Icon className={styles.nothingIcon} icon="documentLoupe" />
                <p>Подходящих кандидатов в базе нет</p>
              </div>
            )}
            <Pagination
              page={candidates.page}
              totalPages={candidates.total_pages}
              loadPage={(val) => setPage(val)}
            />
          </div>
          <div
            className={classNames(styles.sidebar, {
              [styles.hidden]: !candidates.items.length,
            })}
          >
            <h6>Соответствие вакансии</h6>
            <div className={styles.sidebarItem}>
              <span className={styles.sidebarItemMainTitle}>Не важно</span>
              <span className={styles.sidebarItemValue}>
                {candidates.match.all}
              </span>
            </div>
            <div className={styles.sidebarItem}>
              <span>от 50%</span>
              <span className={styles.sidebarItemValue}>
                {candidates.match.gte50}
              </span>
            </div>
            <div className={styles.sidebarItem}>
              <span>от 70%</span>
              <span className={styles.sidebarItemValue}>
                {candidates.match.gte70}
              </span>
            </div>
            <div className={styles.sidebarItem}>
              <span>от 90%</span>
              <span className={styles.sidebarItemValue}>
                {candidates.match.gte90}
              </span>
            </div>
          </div>
        </div>
      )}
    />
  )
}
