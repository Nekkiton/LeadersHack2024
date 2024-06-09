import { Controller, useForm } from 'react-hook-form'
import classNames from 'classnames'
import moment, { Moment } from 'moment'
import ReactDatePicker from 'react-datepicker'
import Modal, { ModalStateProps } from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import BaseButton from '@/components/ui/BaseButton'
import styles from './SetupInterviewModal.module.scss'
import 'react-datepicker/dist/react-datepicker.css'
import ControlContainer from '@/components/ui/ControlContainer'

interface Props extends ModalStateProps {}

interface FormData {
  date: Moment
  time: string
}

export default function SetupInterviewModal({ ...stateProps }: Props) {
  const { control, handleSubmit } = useForm<FormData>()

  const onSubmit = handleSubmit((data) => {
    console.log(data)
  })

  return (
    <Modal
      {...stateProps}
      header="Выберите дату и время интервью"
      width={452}
      onSubmit={onSubmit}
      footer={
        <>
          <Button
            type="secondary"
            onClick={() => stateProps.setIsShowed(false)}
          >
            Отмена
          </Button>
          <Button type="primary" htmlType="submit">
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
    </Modal>
  )
}
