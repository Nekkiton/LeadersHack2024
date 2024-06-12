import { useMemo } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Response } from '@/types/entities/response'
import { Vacancy } from '@/types/entities/vacancy'
import { useCurCandidateAnswerToResponse } from '@/api/candidates'
import classNames from 'classnames'
import moment, { Moment } from 'moment'
import ReactDatePicker from 'react-datepicker'
import Modal, { ModalStateProps } from '@/components/ui/Modal'
import ControlContainer from '@/components/ui/ControlContainer'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import BaseButton from '@/components/ui/BaseButton'
import styles from './SetupInterviewModal.module.scss'
import 'react-datepicker/dist/react-datepicker.css'

interface Props extends ModalStateProps {
  response: Response
  vacancy: Vacancy
}

interface FormData {
  date: Moment
  time: string
  meet_on?: 'GoogleMeet' | 'Zoom' | 'Telemost'
}

export default function SetupInterviewModal({
  vacancy,
  response,
  ...stateProps
}: Props) {
  const { control, handleSubmit } = useForm<FormData>()

  const { mutate, status } = useCurCandidateAnswerToResponse()

  const onSubmit = handleSubmit((data) => {
    const meet_at = data.date // TODO
    mutate(
      {
        ...data,
        pk: response._id,
        status: 'approve',
        message: null,
        meet_on: data.meet_on ?? null,
        meet_at: meet_at?.toISOString(),
      },
      {
        onSettled: () => {
          stateProps.setIsShowed(false)
        },
      }
    )
  })

  const isAutoIntervew = useMemo(() => {
    const stage = vacancy.stages?.find((i) => i._id === response.stage_id)
    return stage?.auto_interview
  }, [vacancy, response])

  return (
    <Modal
      {...stateProps}
      header="Когда и где вам удобно провести интервью"
      width={370}
      onSubmit={onSubmit}
      footer={
        <>
          <Button
            type="secondary"
            onClick={() => stateProps.setIsShowed(false)}
          >
            Отмена
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={status === 'pending'}
          >
            Назначить встречу
          </Button>
        </>
      }
      form
    >
      <Controller
        control={control}
        name="date"
        rules={{ required: true }}
        render={({ field, fieldState }) => (
          <ControlContainer error={fieldState.error}>
            <div className={styles.datePicker}>
              {/* TODO: pretty calendar */}
              <ReactDatePicker
                selected={field.value?.toDate()}
                onChange={(val) => field.onChange(val ? moment(val) : null)}
                inline
              />
            </div>
          </ControlContainer>
        )}
      />
      <div className={styles.timePicker}>
        <p className={styles.timePickerTitle}>Свободное время</p>
        <Controller
          control={control}
          name="time"
          rules={{ required: true }}
          render={({ field, fieldState }) => (
            <ControlContainer error={fieldState.error}>
              <BaseButton className={styles.timePickerOptions}>
                <span
                  className={classNames(styles.timePickerOption, {
                    [styles.active]: field.value === '1',
                  })}
                  onClick={() => field.onChange('1')}
                >
                  TODO
                </span>
              </BaseButton>
            </ControlContainer>
          )}
        />
      </div>
      {isAutoIntervew && (
        <Controller
          control={control}
          name="meet_on"
          rules={{ required: true }}
          render={({ field, fieldState }) => (
            <Select
              {...field}
              error={fieldState.error}
              label="Платформа для проведения интервью"
              placeholder="Выберите из списка"
              items={[
                { key: 'GoogleMeet', value: 'GoogleMeet' },
                { key: 'Zoom', value: 'Zoom' },
                { key: 'Telemost', value: 'Telemost' },
              ]}
            />
          )}
        />
      )}
    </Modal>
  )
}
