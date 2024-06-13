import { Response, ResponseStatus } from '@/types/entities/response'
import { useCandidateResponses } from '@/api/candidates'
import { Role } from '@/types/entities/user'
import moment from 'moment'
import RemoteData from '@/components/special/RemoteData'
import styles from './ResponseCardResponsesHistory.module.scss'

interface Props {
  response: Response
}

export default function ResponseCardResponsesHistory({ response }: Props) {
  const responses = useCandidateResponses(response.candidate?._id!, {
    enabled: !!response.candidate,
  })

  if (!response.candidate) {
    return null
  }

  return (
    <div className={styles.container}>
      <RemoteData
        data={responses}
        renderSuccess={(responses) =>
          responses.length > 1
            ? responses
                .filter((i) => i._id !== response._id)
                .map((response) => (
                  <div className={styles.response} key={response._id}>
                    <p className={styles.responseDate}>
                      {moment(`${response.created_at}Z`).format('DD MMMM YYYY')}
                    </p>
                    <p className={styles.responseTitle}>
                      {response.inviter === Role.Candidate
                        ? 'Отклик'
                        : 'Приглашение'}{' '}
                      на вакансию «{response.vacancy?.title}»
                    </p>
                    <span className={styles.responseSeparator} />
                    <div className={styles.responseResult}>
                      {response.status === ResponseStatus.Approved && (
                        <p>Принят на работу</p>
                      )}
                      {response.status === ResponseStatus.Rejected && (
                        <p>
                          Отказ на этапе «
                          {
                            response.vacancy?.stages?.find(
                              (i) => i._id === response.stage_id
                            )?.title
                          }
                          »
                        </p>
                      )}
                      {response.status !== ResponseStatus.Approved &&
                        response.status !== ResponseStatus.Rejected && (
                          <p>
                            В процессе на этапе «
                            {
                              response.vacancy?.stages?.find(
                                (i) => i._id === response.stage_id
                              )?.title
                            }
                            »
                          </p>
                        )}
                      {response.comment && (
                        <p className={styles.responseComment}>
                          Комментарий: {response.comment}
                        </p>
                      )}
                    </div>
                  </div>
                ))
            : 'Откликов в компанию раньше не было'
        }
      />
    </div>
  )
}
