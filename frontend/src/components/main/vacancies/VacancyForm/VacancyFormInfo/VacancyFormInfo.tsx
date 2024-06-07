import { useFormContext, Controller } from 'react-hook-form'
import { useWorkTypes } from '@/api/work-types'
import { useWorkScopes } from '@/api/work-scopes'
import { useWorkExperiences } from '@/api/work-experiences'
import { useWorkSchedules } from '@/api/work-schedules'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import KeywordsInput from '@/components/ui/KeywordsInput'
import Select from '@/components/ui/Select'
import styles from './VacancyFormInfo.module.scss'

interface FormData {
  title: string
  work_scope_id: string
  description: string | null
  responsibilities: string
  candidate_expectation: string
  _plus: string | null
  _conditions: string | null
  work_type_id: string
  work_schedule_id: string
  work_experience_id: string
  salary_from: string | null
  salary_to: string | null
  _skills: string[]
}

export default function VacancyFormInfo() {
  const { control } = useFormContext<FormData>()

  const workTypes = useWorkTypes()
  const workScopes = useWorkScopes()
  const workExperiences = useWorkExperiences()
  const workSchedules = useWorkSchedules()

  return (
    <>
      <div className={styles.fieldsRow}>
        <Controller
          control={control}
          name="title"
          rules={{ required: true }}
          render={({ field, fieldState }) => (
            <Input
              {...field}
              error={fieldState.error}
              label="Название *"
              placeholder="Укажите название должности"
            />
          )}
        />
        <Controller
          control={control}
          name="work_scope_id"
          rules={{ required: true }}
          render={({ field, fieldState }) => (
            <Select
              {...field}
              error={fieldState.error}
              label="Направление *"
              placeholder="Выберите из списка"
              items={
                workScopes.status === 'success'
                  ? workScopes.value.map((i) => ({ key: i.id, value: i.scope }))
                  : []
              }
            />
          )}
        />
      </div>
      <Controller
        control={control}
        name="description"
        render={({ field, fieldState }) => (
          <Textarea
            {...field}
            error={fieldState.error}
            label="Описание"
            placeholder="Опишите вакансию общими словами"
          />
        )}
      />
      <Controller
        control={control}
        name="responsibilities"
        rules={{ required: true }}
        render={({ field, fieldState }) => (
          <Textarea
            {...field}
            error={fieldState.error}
            label="Задачи *"
            placeholder="Опишите задачи, которые нужно будет выполнять соискателю "
          />
        )}
      />
      <Controller
        control={control}
        name="candidate_expectation"
        rules={{ required: true }}
        render={({ field, fieldState }) => (
          <Textarea
            {...field}
            error={fieldState.error}
            label="Ожидания от соискателя *"
            placeholder="Опишите, каких знаний, навыков и умений вы ждете от соискателя"
          />
        )}
      />
      <Controller
        control={control}
        name="_plus"
        render={({ field, fieldState }) => (
          <Textarea
            {...field}
            error={fieldState.error}
            label="Будет плюсом"
            placeholder="Опишите необязательные навыки соискателя, которые будут преимуществом при найме"
          />
        )}
      />
      <Controller
        control={control}
        name="_conditions"
        render={({ field, fieldState }) => (
          <Textarea
            {...field}
            error={fieldState.error}
            label="Условия"
            placeholder="Опишите необязательные навыки соискателя, которые будут преимуществом при найме"
          />
        )}
      />
      <div className={styles.fieldsRow}>
        <Controller
          control={control}
          name="work_type_id"
          rules={{ required: true }}
          render={({ field, fieldState }) => (
            <Select
              {...field}
              error={fieldState.error}
              label="Формат работы *"
              placeholder="Выберите из списка"
              items={
                workTypes.status === 'success'
                  ? workTypes.value.map((i) => ({ key: i.id, value: i.type }))
                  : []
              }
            />
          )}
        />
        <Controller
          control={control}
          name="work_schedule_id"
          rules={{ required: true }}
          render={({ field, fieldState }) => (
            <Select
              {...field}
              error={fieldState.error}
              label="График работы *"
              placeholder="Выберите из списка"
              items={
                workSchedules.status === 'success'
                  ? workSchedules.value.map((i) => ({
                      key: i.id,
                      value: i.schedule,
                    }))
                  : []
              }
            />
          )}
        />
      </div>
      <div className={styles.fieldsRow}>
        <Controller
          control={control}
          name="work_experience_id"
          rules={{ required: true }}
          render={({ field, fieldState }) => (
            <Select
              {...field}
              error={fieldState.error}
              label="Опыт работы *"
              placeholder="Выберите из списка"
              items={
                workExperiences.status === 'success'
                  ? workExperiences.value.map((i) => ({
                      key: i.id,
                      value: i.experience,
                    }))
                  : []
              }
            />
          )}
        />
        <div className={styles.fieldsRow}>
          <Controller
            control={control}
            name="salary_from"
            render={({ field, fieldState }) => (
              <Input
                {...field}
                error={fieldState.error}
                label="Заработная плата"
                placeholder="от"
                postfix="₽"
              />
            )}
          />
          <Controller
            control={control}
            name="salary_to"
            render={({ field, fieldState }) => (
              <Input
                {...field}
                error={fieldState.error}
                label="⠀"
                placeholder="до"
                postfix="₽"
              />
            )}
          />
        </div>
      </div>
      <Controller
        control={control}
        name="_skills"
        rules={{ required: true }}
        render={({ field, fieldState }) => (
          <KeywordsInput
            {...field}
            error={fieldState.error}
            label="Ключевые навыки *"
            placeholder="Укажите до 10 ключевых навыков, которыми должен обладать соискатель"
            maxCount={10}
            items={[
              { key: 1, value: 'hello' },
              { key: 2, value: 'workd' },
              { key: 3, value: 'how are you' },
            ]}
          />
        )}
      />
    </>
  )
}
