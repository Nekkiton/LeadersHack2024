import { useEffect, useState } from 'react'
import { ResponseStageStatus } from '@/types/entities/response-stage'
import { Vacancy } from '@/types/entities/vacancy'
import { useCurCandidateVacancyResponse } from '@/api/candidates'
import classNames from 'classnames'
import Steps from '@/components/ui/Steps'
import styles from './VacancyInfoCandidateResponse.module.scss'

interface Props {
  vacancy: Vacancy
}

export default function VacancyInfoCandidateResponse({ vacancy }: Props) {
  const responses = useCurCandidateVacancyResponse(vacancy._id)

  const [steps, setSteps] = useState<{ key: number | string; value: any }[]>([])
  const [activeStep, setActiveStep] = useState<number | string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    if (responses.status !== 'success' || !responses.value.length) {
      setSteps([])
      setActiveStep(null)
      setMessage(null)
      return
    }

    const newSteps: typeof steps = []
    let newActiveStep: number | string = -1
    let hasMoreStages = true

    responses.value.every((responseStage, idx) => {
      newActiveStep = idx
      newSteps.push({
        key: idx,
        value: responseStage.stage?.title,
      })

      if (
        responseStage.status === ResponseStageStatus.RejectedByCandidate ||
        responseStage.status === ResponseStageStatus.RejectedByRecruiter
      ) {
        newSteps.push({
          key: 'rejected',
          value: 'Отклонен',
        })
        setMessage(
          responseStage.status === ResponseStageStatus.RejectedByCandidate
            ? responseStage.candidate_message
            : responseStage.recruiter_message
        )
        newActiveStep = 'rejected'
        hasMoreStages = false
        return false
      } else if (
        responseStage.status === ResponseStageStatus.ApprovedByRecruiter &&
        idx === (vacancy.stages?.length ?? 0) - 1
      ) {
        newSteps.push({
          key: 'approved',
          value: 'Принят',
        })
        newActiveStep = 'approved'
        hasMoreStages = false
        return false
      }

      return true
    })

    console.log(newSteps)

    if (responses.value.length !== vacancy.stages?.length && hasMoreStages) {
      vacancy.stages
        ?.slice(responses.value.length)
        .forEach((i) => newSteps.push({ key: i._id, value: i.title }))
    }

    setSteps(newSteps)
    setActiveStep(newActiveStep)
  }, [responses.status])

  return (
    <div
      className={classNames(styles.container, {
        [styles.active]:
          responses.status === 'success' && responses.value.length,
      })}
    >
      <p className={styles.title}>Статус отклика</p>
      {responses.status === 'success' &&
        steps.length &&
        activeStep !== null && (
          <>
            <Steps items={steps} activeKey={activeStep} />
            {message && (
              <div className={styles.message}>
                <p className={styles.messageTitle}>Причина отклонения</p>
                <p className={styles.messageText}>{message}</p>
              </div>
            )}
          </>
        )}
    </div>
  )
}
