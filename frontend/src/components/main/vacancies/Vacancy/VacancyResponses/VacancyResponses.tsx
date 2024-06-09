import { Vacancy } from '@/types/entities/vacancy'
import { useVacancyResponses } from '@/api/vacancies'
import RemoteData from '@/components/special/RemoteData'
import ResponseCard from '@/components/base/responses/ResponseCard'
import styles from './VacancyResponses.module.scss'

interface Props {
  vacancy: Vacancy
}

export default function VacancyResponses({ vacancy }: Props) {
  const responses = useVacancyResponses(vacancy.id)

  return (
    <RemoteData
      data={responses}
      renderSuccess={(data) => (
        <div className={styles.container}>
          <div className={styles.responses}>
            {data.responses.map((responses) => (
              <ResponseCard
                key={responses[responses.length - 1].id}
                response={responses[responses.length - 1]}
                responseStages={responses}
                vacancy={vacancy}
              />
            ))}
          </div>
          <div className={styles.sidebar}>coming soon</div>
        </div>
      )}
    />
  )
}
