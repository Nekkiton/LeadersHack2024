import { useFormContext, Controller, useFieldArray } from 'react-hook-form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import BaseButton from '@/components/ui/BaseButton'
import Icon from '@/components/ui/Icon'
import TimePicker from '@/components/ui/TimePicker'
import styles from './RecruiterProfileCalendar.module.scss'
import moment, { Moment } from 'moment'

interface FormData {
  maxCount: number
  schedule: { from: Moment; to: Moment }[]
}

export default function RecruiterProfileCalendar() {
  const { control } = useFormContext<FormData>()

  const {
    fields: schedule,
    append: addSchedule,
    remove: removeSchedule,
  } = useFieldArray({
    control,
    name: 'schedule',
  })

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3>Управление календарем</h3>
        <p className={styles.headerHint}>
          Настройте свободные промежутки времени для интервью и их количество
        </p>
      </div>
      <Controller
        control={control}
        name="maxCount"
        rules={{ required: true }}
        render={({ field, fieldState }) => (
          <Input
            {...field}
            className={styles.field}
            error={fieldState.error}
            label="Максимальное количество интервью в день"
            type="number"
          />
        )}
      />
      <div className={styles.schedule}>
        <p className={styles.scheduleTitle}>Свободное время для интервью</p>
        {schedule.map((scheduleItem, idx) => (
          <div className={styles.scheduleItem} key={scheduleItem.id}>
            <Controller
              control={control}
              name={`schedule.${idx}.from`}
              rules={{ required: true }}
              render={({ field, fieldState }) => (
                <TimePicker {...field} error={fieldState.error} label="с" />
              )}
            />
            <Controller
              control={control}
              name={`schedule.${idx}.to`}
              rules={{ required: true }}
              render={({ field, fieldState }) => (
                <TimePicker {...field} error={fieldState.error} label="до" />
              )}
            />
            <BaseButton
              className={styles.scheduleItemRemoveBtn}
              onClick={() => removeSchedule(idx)}
              hoverable
            >
              <Icon className={styles.scheduleItemRemoveIcon} icon="times" />
            </BaseButton>
          </div>
        ))}
        <Button
          type="text"
          onClick={() => addSchedule({ from: moment(), to: moment() })}
        >
          <Icon icon="plus" />
          <span>Добавить промежуток времени</span>
        </Button>
      </div>
    </div>
  )
}
