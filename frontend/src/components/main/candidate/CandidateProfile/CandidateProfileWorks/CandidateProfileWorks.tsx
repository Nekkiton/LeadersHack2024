import { useFormContext, Controller, useFieldArray } from 'react-hook-form'
import { FormData } from '../utils'
import moment from 'moment'
import BaseButton from '@/components/ui/BaseButton'
import Button from '@/components/ui/Button'
import Icon from '@/components/ui/Icon'
import Checkbox from '@/components/ui/Checkbox'
import Textarea from '@/components/ui/Textarea'
import ControlContainer from '@/components/ui/ControlContainer'
import styles from './CandidateProfileWorks.module.scss'
import DatePicker from '@/components/ui/DatePicker'

export default function CandidateProfileWorks() {
  const { control } = useFormContext<FormData>()

  const {
    fields: works,
    append: addWork,
    remove: removeWork,
  } = useFieldArray({
    control,
    name: 'work_history',
  })

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3>Опыт работы</h3>
        <Button
          type="text"
          onClick={() =>
            addWork({
              company: '',
              job_title: '',
              responsibilities: '',
              start_date: undefined as any,
              end_date: null,
            })
          }
        >
          <Icon icon="plus" />
          <span>Добавить место работы</span>
        </Button>
      </div>
      {works.map((work, idx) => (
        <div className={styles.work} key={work.id}>
          <div className={styles.workHeader}>
            <p className={styles.workTitle}>Место работы {idx + 1}</p>
            <BaseButton onClick={() => removeWork(idx)} hoverable>
              <Icon className={styles.workRemoveIcon} icon="trash" />
            </BaseButton>
          </div>
          <div className={styles.workFieldsRow}>
            <Controller
              control={control}
              name={`work_history.${idx}.start_date`}
              rules={{ required: true }}
              render={({ field, fieldState }) => (
                <DatePicker
                  {...field}
                  error={fieldState.error}
                  label="Начало работы"
                  placeholder="Выберите дату"
                />
              )}
            />
            <Controller
              control={control}
              name={`work_history.${idx}.end_date`}
              render={({ field, fieldState }) => (
                <ControlContainer
                  label="По настоящее время"
                  error={fieldState.error}
                >
                  <div className={styles.workEndDateContainer}>
                    <Checkbox
                      className={styles.workEndDateContainerCheckbox}
                      value={field.value ? false : true}
                      onChange={(val) => field.onChange(val ? null : moment())}
                    >
                      По настоящее время
                    </Checkbox>
                    <DatePicker {...field} placeholder="Выберите дату" />
                  </div>
                </ControlContainer>
              )}
            />
          </div>
          <div className={styles.workFieldsRow}>
            <Controller
              control={control}
              name={`work_history.${idx}.job_title`}
              rules={{ required: true }}
              render={({ field, fieldState }) => (
                <Textarea
                  {...field}
                  error={fieldState.error}
                  label="Должность"
                  placeholder="Какую должность вы занимали"
                />
              )}
            />
            <Controller
              control={control}
              name={`work_history.${idx}.company`}
              rules={{ required: true }}
              render={({ field, fieldState }) => (
                <Textarea
                  {...field}
                  error={fieldState.error}
                  label="Организация"
                  placeholder="Введите название компании"
                />
              )}
            />
          </div>
          <Controller
            control={control}
            name={`work_history.${idx}.responsibilities`}
            rules={{ required: true }}
            render={({ field, fieldState }) => (
              <Textarea
                {...field}
                error={fieldState.error}
                label="Задачи"
                placeholder="Какие у вас были обязанности"
              />
            )}
          />
        </div>
      ))}
    </div>
  )
}
