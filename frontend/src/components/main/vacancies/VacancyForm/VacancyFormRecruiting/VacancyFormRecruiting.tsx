import { useState } from 'react'
import { useFormContext, Controller, useFieldArray } from 'react-hook-form'
import { FormData } from '../utils'
import { Site } from '@/config/site'
import Icon from '@/components/ui/Icon'
import BaseButton from '@/components/ui/BaseButton'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import AppearTransition from '@/components/ui/AppearTransition'
import Checkbox from '@/components/ui/Checkbox'
import Textarea from '@/components/ui/Textarea'
import styles from './VacancyFormRecruiting.module.scss'

interface Props {
  disabled?: boolean
}

export default function VacancyFormRecruiting({ disabled }: Props) {
  const { control } = useFormContext<FormData>()

  const {
    fields: stages,
    append: addStage,
    remove: removeStage,
    move: moveStage,
  } = useFieldArray({
    control,
    name: 'stages',
  })

  const [hiddenStageIds, setHiddenStageIds] = useState<string[]>([])

  const toggleStage = (id: string) => {
    if (hiddenStageIds.includes(id)) {
      setHiddenStageIds(hiddenStageIds.filter((i) => i !== id))
    } else {
      setHiddenStageIds([...hiddenStageIds, id])
    }
  }

  const moveStageUp = (idx: number) => {
    moveStage(idx, idx - 1)
  }

  const moveStageDown = (idx: number) => {
    moveStage(idx, idx + 1)
  }

  return (
    <div className={styles.container}>
      <p className={styles.hint}>Настройте этапы найма для вакансии</p>
      <div className={styles.stages}>
        {stages.map((stage, idx) => (
          <div className={styles.stage} key={stage.id}>
            <div className={styles.stageHeader}>
              <div className={styles.stageHeaderTitleContainer}>
                {!stage._isRequired && (
                  <BaseButton
                    onClick={() => moveStageUp(idx)}
                    disabled={
                      idx === 0 || stages[idx - 1]._isRequired || disabled
                    }
                    hoverable
                  >
                    <Icon icon="chevronUp" />
                  </BaseButton>
                )}
                {!stage._isRequired && (
                  <BaseButton
                    onClick={() => moveStageDown(idx)}
                    disabled={
                      idx === stages.length - 1 ||
                      stages[idx + 1]._isRequired ||
                      disabled
                    }
                    hoverable
                  >
                    <Icon icon="chevronDown" />
                  </BaseButton>
                )}
                <Controller
                  control={control}
                  name={`stages.${idx}.title`}
                  rules={{ required: true }}
                  render={({ field, fieldState }) =>
                    stage._isRequired ? (
                      <p className={styles.stageHeaderTitle}>{field.value}</p>
                    ) : (
                      <Input
                        {...field}
                        error={fieldState.error}
                        className={styles.stageHeaderInput}
                        inputClassName={styles.stageHeaderInputInput}
                      />
                    )
                  }
                />
              </div>
              <div className={styles.stageHeaderControls}>
                {!stage._isRequired && (
                  <BaseButton
                    onClick={() => removeStage(idx)}
                    disabled={disabled}
                    hoverable
                  >
                    <Icon
                      className={styles.stageHeaderRemoveIcon}
                      icon="trash"
                    />
                  </BaseButton>
                )}
                <BaseButton onClick={() => toggleStage(stage.id)} hoverable>
                  <Icon icon="minus" />
                </BaseButton>
              </div>
            </div>
            {/* <AppearTransition orientation="v" gap> */}
            {!hiddenStageIds.includes(stage.id) && (
              <div className={styles.stageBody}>
                <Controller
                  control={control}
                  name={`stages.${idx}.auto_interview`}
                  render={({ field, fieldState }) => (
                    <Checkbox {...field} error={fieldState.error}>
                      <p>Назначать онлайн интервью при положительном ответе</p>
                      <div title="Поставьте галочку, если для этого этапа отбора нужно онлайн-интервью. Соискатель выберет удобное время исходя из ваших свободных слотов в календаре">
                        <Icon icon="question" />
                      </div>
                    </Checkbox>
                  )}
                />
                <Controller
                  control={control}
                  name={`stages.${idx}.approve_template`}
                  rules={{ required: true }}
                  render={({ field, fieldState }) => (
                    <Textarea
                      {...field}
                      error={fieldState.error}
                      label="Шаблон приглашения на следующий этап"
                    />
                  )}
                />
                <Controller
                  control={control}
                  name={`stages.${idx}.reject_template`}
                  rules={{ required: true }}
                  render={({ field, fieldState }) => (
                    <Textarea
                      {...field}
                      error={fieldState.error}
                      label="Шаблон отказа"
                    />
                  )}
                />
              </div>
            )}
            {/* </AppearTransition> */}
          </div>
        ))}
        <Button
          type="text"
          underline="dashed"
          onClick={() =>
            addStage({
              title: '',
              auto_interview: false,
              approve_template: '',
              reject_template: Site.recruitingDefaultRejectTemplate,
              _isRequired: false,
            })
          }
          disabled={disabled}
        >
          <Icon icon="plus" />
          <span>Добавить этап</span>
        </Button>
      </div>
    </div>
  )
}
