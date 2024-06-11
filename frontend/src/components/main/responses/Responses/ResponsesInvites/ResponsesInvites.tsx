import { useEffect, useState } from 'react'
import { ResponseStage } from '@/types/entities/response-stage'
import { Routes } from '@/config/routes'
import { Role } from '@/types/entities/user'
import Icon from '@/components/ui/Icon'
import Button from '@/components/ui/Button'
import ResponseCard from '@/components/base/responses/ResponseCard'
import styles from './ResponsesInvites.module.scss'

interface Props {
  invites: ResponseStage[][]
}

export default function ResponsesInvites({ invites }: Props) {
  const [invitesExist, setInvitesExist] = useState<null | boolean>(null)

  useEffect(() => {
    if (invitesExist === null) {
      setInvitesExist(!!invites.length)
    }
  }, [invites, invitesExist])

  if (invitesExist === false) {
    return (
      <div className={styles.nothing}>
        <Icon className={styles.nothingIcon} icon="documentLoupe" />
        <p>
          Приглашений еще нет. Проверьте, что вы полностью
          <br />
          заполнили профиль. Так шанс получить приглашение выше
        </p>
        <Button type="primary" href={Routes.candidateProfile}>
          Перейти к профилю
        </Button>
      </div>
    )
  }

  return (
    <div className={styles.invites}>
      {invites.map(
        (responses) =>
          responses[responses.length - 1].vacancy && (
            <ResponseCard
              response={responses[responses.length - 1]}
              key={responses[responses.length - 1]._id}
              vacancy={responses[responses.length - 1].vacancy!}
              role={Role.Candidate}
              responseStages={responses}
            />
          )
      )}
    </div>
  )
}
