import { useMemo, useState } from 'react'
import { Routes } from '@/config/routes'
import { Vacancy } from '@/types/entities/vacancy'
import { Role } from '@/types/entities/user'
import {
  Response,
  ResponseMessageType,
  ResponseStatus,
} from '@/types/entities/response'
import classNames from 'classnames'
import Button from '@/components/ui/Button'
import RadialProgressBar from '@/components/ui/RadialProgressBar'
import CandidateCardInfo from '@/components/base/candidates/CandidateCardInfo'
import VacancyCardInfo from '@/components/base/vacancies/VacancyCardInfo'
import TabsLine from '@/components/ui/TabsLine'
import ResponseCardFunnel from './ResponseCardFunnel'
import ResponseCardComment from './ResponseCardComment'
import ResponseCardResponsesHistory from './ResponseCardResponsesHistory'
import styles from './ResponseCard.module.scss'

interface Props {
  className?: string
  response: Response
  vacancy: Vacancy
  role: Role
}

export default function ResponseCard({
  className,
  response,
  vacancy,
  role,
}: Props) {
  const [activeKey, setActiveKey] = useState<
    'funnel' | 'responsesHistory' | 'comments'
  >('funnel')

  const stageTitle = useMemo(() => {
    if (response.status === ResponseStatus.Approved) {
      return 'Принят'
    } else if (response.status === ResponseStatus.Rejected) {
      return 'Отказ'
    } else if (
      response.messages.findLast((i) => i.type !== ResponseMessageType.Custom)
        ?.type === ResponseMessageType.CandidateRequest
    ) {
      return 'Неразобранный'
    }
    const stage = vacancy.stages?.find(
      (i) => i._id === response.messages[response.messages.length - 1].stage_id
    )
    return stage?.title ?? 'В процессе'
  }, [response, vacancy])

  return (
    <div className={classNames(className, styles.container)}>
      <div className={styles.header}>
        <div className={styles.headerInfo}>
          <span className={styles.headerTag}>{stageTitle}</span>
          {response.match !== undefined && (
            <div className={styles.headerMathPercent}>
              <RadialProgressBar value={response.match} />
              {role === Role.Recruiter && (
                <span>{response.match}% соответствия</span>
              )}
              {role === Role.Candidate && (
                <span>Подходит на {response.match}%</span>
              )}
            </div>
          )}
        </div>
        {role === Role.Recruiter && response.candidate && (
          <Button
            type="secondary"
            href={Routes.recruiterCandidate(response.candidate._id)}
            target="_blank"
          >
            Открыть резюме
          </Button>
        )}
        {role === Role.Candidate && (
          <Button
            type="secondary"
            target="_blank"
            href={Routes.candidateVacancy(vacancy._id)}
          >
            Открыть вакансию
          </Button>
        )}
      </div>
      {role === Role.Recruiter && response.candidate && (
        <CandidateCardInfo candidate={response.candidate} />
      )}
      {role === Role.Candidate && <VacancyCardInfo vacancy={vacancy} />}
      <span className={styles.separator} />
      {role === Role.Recruiter && (
        <TabsLine
          items={[
            { key: 'funnel', value: 'Движение по воронке' },
            { key: 'responsesHistory', value: 'История откликов' },
            { key: 'comments', value: 'Комментарий' },
          ]}
          value={activeKey}
          onChange={setActiveKey}
        />
      )}
      {activeKey === 'funnel' && (
        <ResponseCardFunnel response={response} vacancy={vacancy} role={role} />
      )}
      {activeKey === 'responsesHistory' && (
        <ResponseCardResponsesHistory response={response} />
      )}
      {activeKey === 'comments' && <ResponseCardComment response={response} />}
    </div>
  )
}
