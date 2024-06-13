import { useFormContext, Controller } from 'react-hook-form'
import { useWorkTypes } from '@/api/work-types'
import { useWorkScopes } from '@/api/work-scopes'
import { useWorkExperiences } from '@/api/work-experiences'
import { useWorkSchedules } from '@/api/work-schedules'
import { useSkills } from '@/api/skills'
import { FormData } from '../utils'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import KeywordsInput from '@/components/ui/KeywordsInput'
import Select from '@/components/ui/Select'
import styles from './VacancyFormInfo.module.scss'

export default function VacancyFormInfo() {
  const { control } = useFormContext<FormData>()

  const workTypes = useWorkTypes()
  const workScopes = useWorkScopes()
  const workExperiences = useWorkExperiences()
  const workSchedules = useWorkSchedules()
  const skills = useSkills()

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
          name="scope"
          rules={{ required: true }}
          render={({ field, fieldState }) => (
            <Select
              {...field}
              error={fieldState.error}
              label="Направление *"
              placeholder="Выберите из списка"
              items={
                workScopes.status === 'success'
                  ? workScopes.value.map((i) => ({ key: i, value: i }))
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
        name="additions"
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
        name="conditions"
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
          name="work_type"
          rules={{ required: true }}
          render={({ field, fieldState }) => (
            <Select
              {...field}
              error={fieldState.error}
              label="Формат работы *"
              placeholder="Выберите из списка"
              items={
                workTypes.status === 'success'
                  ? workTypes.value.map((i) => ({ key: i, value: i }))
                  : []
              }
              inputtable
            />
          )}
        />
        <Controller
          control={control}
          name="work_schedule"
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
                      key: i,
                      value: i,
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
          name="work_experience"
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
                      key: i,
                      value: i,
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
                type="number"
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
                type="number"
              />
            )}
          />
        </div>
      </div>
      <Controller
        control={control}
        name="skills"
        rules={{ required: true }}
        render={({ field, fieldState }) => (
          <KeywordsInput
            {...field}
            error={fieldState.error}
            label="Ключевые навыки *"
            placeholder="Укажите до 10 ключевых навыков, которыми должен обладать соискатель"
            maxCount={10}
            items={
              skills.status === 'success'
                ? skills.value.map((i) => ({ key: i, value: i }))
                : undefined
            }
          />
        )}
      />
    </>
  )
}
