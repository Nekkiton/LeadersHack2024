import { useState } from 'react'
import { ResponseStage } from '@/types/entities/response-stage'
import { Routes } from '@/config/routes'
import { Vacancy } from '@/types/entities/vacancy'
import { Role } from '@/types/entities/user'
import classNames from 'classnames'
import Button from '@/components/ui/Button'
import RadialProgressBar from '@/components/ui/RadialProgressBar'
import CandidateCardInfo from '@/components/base/candidates/CandidateCardInfo'
import VacancyCardInfo from '@/components/base/vacancies/VacancyCardInfo'
import TabsLine from '@/components/ui/TabsLine'
import ResponseCardFunnel from './ResponseCardFunnel'
import styles from './ResponseCard.module.scss'
import { Response } from '@/types/entities/response'

interface Props {
  className?: string
  response: Response
  // responseStages?: ResponseStage[]
  vacancy: Vacancy
  role: Role
}

export default function ResponseCard({
  className,
  response,
  // responseStages,
  vacancy,
  role,
}: Props) {
  const [activeKey, setActiveKey] = useState<
    'funnel' | 'responsesHistory' | 'comments'
  >('funnel')

  return (
    <div className={classNames(className, styles.container)}>
      <div className={styles.header}>
        <div className={styles.headerInfo}>
          <span className={styles.headerTag}>TODO</span>
          <div className={styles.headerMathPercent}>
            <RadialProgressBar value={55} />
            {role === Role.Recruiter && <span>55% соответствия</span>}
            {role === Role.Candidate && <span>Подходит на 55%</span>}
          </div>
        </div>
        {/* {role === Role.Recruiter && response.candidate && (
          <Button
            type="secondary"
            href={Routes.recruiterCandidate(response.candidate._id)}
            target="_blank"
          >
            Открыть резюме
          </Button>
        )} */}
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
      {/* {role === Role.Recruiter && response.candidate && (
        <CandidateCardInfo candidate={response.candidate} />
      )} */}
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
      {activeKey !== 'funnel' && 'coming soon'}
    </div>
  )
}
