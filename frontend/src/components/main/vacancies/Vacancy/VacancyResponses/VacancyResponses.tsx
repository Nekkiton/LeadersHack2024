import { Vacancy } from '@/types/entities/vacancy'
import ResponseCard from '@/components/base/responses/ResponseCard'
import styles from './VacancyResponses.module.scss'

interface Props {
  vacancy: Vacancy
}

export default function VacancyResponses({ vacancy }: Props) {
  return (
    <div className={styles.container}>
      <div className={styles.responses}>
        {vacancy.responses?.map((response) => (
          <ResponseCard key={response.id} response={response} />
        ))}
      </div>
      <div className={styles.sidebar}>coming soon</div>
    </div>
  )
}
