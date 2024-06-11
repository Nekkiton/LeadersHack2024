import { Vacancy } from '@/types/entities/vacancy'
import { useVacancyResponses } from '@/api/vacancies'
import { Role } from '@/types/entities/user'
import RemoteData from '@/components/special/RemoteData'
import ResponseCard from '@/components/base/responses/ResponseCard'
import styles from './VacancyResponses.module.scss'

interface Props {
  vacancy: Vacancy
  role: Role
}

export default function VacancyResponses({ vacancy, role }: Props) {
  const responses = useVacancyResponses(vacancy._id)

  return (
    <RemoteData
      data={responses}
      renderSuccess={(data) => (
        <div className={styles.container}>
          <div className={styles.responses}>
            {data.responses.map((responses) => (
              <ResponseCard
                key={responses[responses.length - 1]._id}
                response={responses[responses.length - 1]}
                responseStages={responses}
                vacancy={vacancy}
                role={role}
              />
            ))}
          </div>
          <div className={styles.sidebar}>coming soon</div>
        </div>
      )}
    />
  )
}
