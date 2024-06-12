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
          <div className={styles.sidebar}>coming soon</div>
        </div>
      )}
    />
  )
}
