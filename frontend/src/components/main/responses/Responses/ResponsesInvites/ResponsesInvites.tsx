import { Response } from '@/types/entities/response'
import { Routes } from '@/config/routes'
import { Role } from '@/types/entities/user'
import Icon from '@/components/ui/Icon'
import Button from '@/components/ui/Button'
import ResponseCard from '@/components/base/responses/ResponseCard'
import styles from './ResponsesInvites.module.scss'

interface Props {
  invites: Response[]
}

export default function ResponsesInvites({ invites }: Props) {
  if (!invites.length) {
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
