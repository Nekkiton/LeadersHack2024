import { Routes } from '@/config/routes'
import { Role } from '@/types/entities/user'
import { Response } from '@/types/entities/response'
import Icon from '@/components/ui/Icon'
import Button from '@/components/ui/Button'
import ResponseCard from '@/components/base/responses/ResponseCard'
import styles from './ResponsesResponses.module.scss'

interface Props {
  responses: Response[]
}

export default function ResponsesResponses({ responses }: Props) {
  if (!responses.length) {
    return (
      <div className={styles.nothing}>
        <Icon className={styles.nothingIcon} icon="documentLoupe" />
        <p>
          Вы еще не откликнулись ни на одну
          <br />
          вакансию. Самое время это сделать
        </p>
        <Button type="primary" href={Routes.candidateVacancies}>
          Перейти к подходящим вакансиям
        </Button>
      </div>
    )
  }

  return (
    <div className={styles.responses}>
      {responses.map(
        (response) =>
          response.vacancy && (
            <ResponseCard
              key={response._id}
              response={response}
              vacancy={response.vacancy}
              role={Role.Candidate}
            />
          )
      )}
    </div>
  )
}
