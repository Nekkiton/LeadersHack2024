import { useMemo } from 'react'
import { Vacancy } from '@/types/entities/vacancy'
import { useCurCandidateVacancyResponse } from '@/api/candidates'
import { ResponseStatus } from '@/types/entities/response'
import classNames from 'classnames'
import Steps from '@/components/ui/Steps'
import styles from './VacancyInfoCandidateResponse.module.scss'

interface Props {
  vacancy: Vacancy
}

export default function VacancyInfoCandidateResponse({ vacancy }: Props) {
  const response = useCurCandidateVacancyResponse(vacancy._id)

  const steps: null | { key: string; value: string }[] = useMemo(() => {
    if (!(response.status === 'success' && response.value && vacancy.stages)) {
      return null
    }

    const stages = vacancy.stages.map((i) => ({
      key: i._id,
      value: i.title,
    }))
    stages[0].value = 'Неразобранный'

    if (response.value.status === ResponseStatus.Rejected) {
      const lastStageId =
        response.value.messages[response.value.messages.length - 1].stage_id
      const lastStageIdx = stages.findIndex((i) => i.key === lastStageId)
      stages.splice(lastStageIdx + 1)
      stages.push({ key: 'rejected', value: 'Отказ' })
    } else {
      stages.push({ key: 'approved', value: 'Принят на работу' })
    }

    return stages
  }, [response, vacancy])

  const activeStep: string | null = useMemo(() => {
    if (
      !(
        response.status === 'success' &&
        response.value &&
        vacancy.stages &&
        steps
      )
    ) {
      return null
    }

    if (
      response.value.status === ResponseStatus.Rejected ||
      response.value.status === ResponseStatus.Approved
    ) {
      return steps[steps.length - 1].key
    }

    return response.value.stage_id
  }, [response, vacancy, steps])

  return (
    <div
      className={classNames(styles.container, {
        [styles.active]: response.status === 'success' && response.value,
      })}
    >
      <p className={styles.title}>Статус отклика</p>
      {steps && activeStep && <Steps items={steps} activeKey={activeStep} />}
      {response.status === 'success' &&
        response.value?.status === ResponseStatus.Rejected && (
          <div className={styles.message}>
            <p className={styles.messageTitle}>Причина отклонения</p>
            <p className={styles.messageText}>
              {response.value.messages[response.value.messages.length - 1].text}
            </p>
          </div>
        )}
    </div>
  )
}
