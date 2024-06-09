import { useEffect, useState } from 'react'
import { ResponseStage } from '@/types/entities/response-stage'
import { Routes } from '@/config/routes'
import { Role } from '@/types/entities/user'
import Icon from '@/components/ui/Icon'
import Button from '@/components/ui/Button'
import ResponseCard from '@/components/base/responses/ResponseCard'
import styles from './ResponsesResponses.module.scss'

interface Props {
  responses: ResponseStage[][]
}

export default function ResponsesResponses({ responses }: Props) {
  const [responsesExist, setResponsesExist] = useState<null | boolean>(null)

  useEffect(() => {
    if (responsesExist === null) {
      setResponsesExist(!!responses.length)
    }
  }, [responses, responsesExist])

  if (responsesExist === false) {
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
        (responses) =>
          responses[responses.length - 1].vacancy && (
            <ResponseCard
              response={responses[responses.length - 1]}
              key={responses[responses.length - 1].id}
              vacancy={responses[responses.length - 1].vacancy!}
              role={Role.Candidate}
              responseStages={responses}
            />
          )
      )}
    </div>
  )
}
