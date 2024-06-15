import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Response } from '@/types/entities/response'
import { Vacancy } from '@/types/entities/vacancy'
import { useCurCandidateAnswerToResponse } from '@/api/candidates'
import { useResponseSchedule } from '@/api/responses'
import { useToasts } from '@/lib/use-toasts'
import classNames from 'classnames'
import moment, { Moment } from 'moment'
import ReactDatePicker from 'react-datepicker'
import Modal, { ModalStateProps } from '@/components/ui/Modal'
import ControlContainer from '@/components/ui/ControlContainer'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import BaseButton from '@/components/ui/BaseButton'
import RemoteData from '@/components/special/RemoteData'
import styles from './SetupInterviewModal.module.scss'
import 'react-datepicker/dist/react-datepicker.css'

interface Props extends ModalStateProps {
  response: Response
  vacancy: Vacancy
}

interface FormData {
  date: Moment
  meet_at: Moment
  meet_on: 'googlemeet' | 'zoom' | 'telemost'
}

export default function SetupInterviewModal({
  vacancy,
  response,
  ...stateProps
}: Props) {
  const toasts = useToasts()

  const { control, handleSubmit, watch, setValue } = useForm<FormData>({
    defaultValues: {
      date: moment(),
    },
  })
  const selectedDate = watch('date')

  useEffect(() => {
    setValue('meet_at', undefined as any)
  }, [selectedDate])

  const { mutate, status } = useCurCandidateAnswerToResponse()

  const onSubmit = handleSubmit((data) => {
    mutate(
      {
        ...data,
        pk: response._id,
        status: 'approve',
        message: null,
        meet_on: data.meet_on,
        meet_at: data.meet_at.toISOString(),
      },
      {
        onSettled: () => {
          stateProps.setIsShowed(false)
        },
        onError: (e) => {
          const detail = (e.response as any).data.detail
          if (Array.isArray(detail)) {
            detail.forEach((i) => toasts.error({ content: i.msg }))
          }
        },
      }
    )
  })

  const schedule = useResponseSchedule({
    pk: response._id,
    end: selectedDate.clone().endOf('month').toISOString(),
  })

  return (
    <Modal
      {...stateProps}
      header="Когда и где вам удобно провести интервью"
      width={403}
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
                selected={field.value.toDate()}
                onChange={(val) => field.onChange(val ? moment(val) : null)}
                disabledKeyboardNavigation
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
          name="meet_at"
          rules={{ required: true }}
          render={({ field, fieldState }) => (
            <ControlContainer error={fieldState.error}>
              <div className={styles.timePickerOptions}>
                <RemoteData
                  data={schedule}
                  renderSuccess={(schedule) => {
                    const children = schedule
                      .filter((i) =>
                        moment(i.day).isSame(
                          selectedDate.clone().startOf('day')
                        )
                      )
                      .flatMap((day) =>
                        day.slots.map((slot) => (
                          <BaseButton
                            className={classNames(styles.timePickerOption, {
                              [styles.active]: moment(
                                `${day.day}T${slot}Z`
                              ).isSame(field.value),
                            })}
                            key={slot}
                            onClick={() =>
                              field.onChange(moment(`${day.day}T${slot}Z`))
                            }
                          >
                            {moment(`${day.day}T${slot}Z`).format('HH:mm')}
                          </BaseButton>
                        ))
                      )
                    if (children.length) return children
                    return <p>В выбранный день нет свободного времени</p>
                  }}
                />
              </div>
            </ControlContainer>
          )}
        />
      </div>
      <Controller
        control={control}
        name="meet_on"
        rules={{
          required: true,
          validate: (val) =>
            val && val !== 'telemost'
              ? 'На данные момент поддерживается только Telemost'
              : true,
        }}
        render={({ field, fieldState }) => (
          <Select
            {...field}
            error={fieldState.error}
            label="Платформа для проведения интервью"
            placeholder="Выберите из списка"
            items={[
              { key: 'telemost', value: 'Telemost' },
              { key: 'googlemeet', value: 'GoogleMeet' },
              { key: 'zoom', value: 'Zoom' },
            ]}
          />
        )}
      />
    </Modal>
  )
}
