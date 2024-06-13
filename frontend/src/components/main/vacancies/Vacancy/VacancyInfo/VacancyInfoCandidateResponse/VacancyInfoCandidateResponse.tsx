import { useEffect, useMemo, useState } from 'react'
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
  return null

  const response = useCurCandidateVacancyResponse(vacancy._id)

  // const [steps, setSteps] = useState<{ key: number | string; value: any }[]>([])
  // const [activeStep, setActiveStep] = useState<number | string | null>(null)
  // const [message, setMessage] = useState<string | null>(null)

  // return 1

  // useEffect(() => {
  //   if (responses.status !== 'success' || !responses.value.length) {
  //     setSteps([])
  //     setActiveStep(null)
  //     setMessage(null)
  //     return
  //   }

  //   const newSteps: typeof steps = []
  //   let newActiveStep: number | string = -1
  //   let hasMoreStages = true

  //   // responses.value.every((responseStage, idx) => {
  //   //   newActiveStep = idx
  //   //   newSteps.push({
  //   //     key: idx,
  //   //     value: responseStage.stage?.title,
  //   //   })

  //   //   if (
  //   //     responseStage.status === ResponseStageStatus.RejectedByCandidate ||
  //   //     responseStage.status === ResponseStageStatus.RejectedByRecruiter
  //   //   ) {
  //   //     newSteps.push({
  //   //       key: 'rejected',
  //   //       value: 'Отклонен',
  //   //     })
  //   //     setMessage(
  //   //       responseStage.status === ResponseStageStatus.RejectedByCandidate
  //   //         ? responseStage.candidate_message
  //   //         : responseStage.recruiter_message
  //   //     )
  //   //     newActiveStep = 'rejected'
  //   //     hasMoreStages = false
  //   //     return false
  //   //   } else if (
  //   //     responseStage.status === ResponseStageStatus.ApprovedByRecruiter &&
  //   //     idx === (vacancy.stages?.length ?? 0) - 1
  //   //   ) {
  //   //     newSteps.push({
  //   //       key: 'approved',
  //   //       value: 'Принят',
  //   //     })
  //   //     newActiveStep = 'approved'
  //   //     hasMoreStages = false
  //   //     return false
  //   //   }

  //   //   return true
  //   // })

  //   console.log(newSteps)

  //   if (responses.value.length !== vacancy.stages?.length && hasMoreStages) {
  //     vacancy.stages
  //       ?.slice(responses.value.length)
  //       .forEach((i) => newSteps.push({ key: i._id, value: i.title }))
  //   }

  //   setSteps(newSteps)
  //   setActiveStep(newActiveStep)
  // }, [responses.status])

  const steps = useMemo(() => {
    if (
      !(
        response.status === 'success' &&
        response.value &&
        response.value.vacancy
      )
    ) {
      return null
    }

    response.value.vacancy

    // return response.value.messages.map(message => ({
    //   key: '1',
    //   value: '1'
    // }))
  }, [response.value])

  return (
    <div
      className={classNames(styles.container, {
        [styles.active]: response.status === 'success' && response.value,
      })}
    >
      <p className={styles.title}>Статус отклика</p>
      {steps && <Steps items={steps} />}
      {/* {response.status === 'success' && response.value && response.value.messages.map()} */}
      {/* {responses.status === 'success' &&
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
        )} */}
    </div>
  )
}
