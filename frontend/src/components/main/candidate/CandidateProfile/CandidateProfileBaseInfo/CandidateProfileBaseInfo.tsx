import { useFormContext, Controller } from 'react-hook-form'
import { useEducations } from '@/api/educations'
import { Cities } from '@/config/cities'
import { useSkills } from '@/api/skills'
import { useWorkSchedules } from '@/api/work-schedules'
import { useWorkTypes } from '@/api/work-types'
import { useWorkExperiences } from '@/api/work-experiences'
import { FormData } from '../utils'
import AvatarUpload from '@/components/ui/AvatarUpload'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import DatePicker from '@/components/ui/DatePicker'
import KeywordsInput from '@/components/ui/KeywordsInput'
import styles from './CandidateProfileBaseInfo.module.scss'

export default function RecruiterProfileBaseInfo() {
  const { control } = useFormContext<FormData>()

  const educations = useEducations()
  const skills = useSkills()
  const workSchedules = useWorkSchedules()
  const workTypes = useWorkTypes()
  const workExperiences = useWorkExperiences()

  return (
    <div className={styles.container}>
      <Controller
        control={control}
        name="photo"
        render={({ field, fieldState }) => (
          <AvatarUpload {...field} error={fieldState.error} />
        )}
      />
      <div className={styles.main}>
        <div className={styles.mainBlock}>
          <h3>Основная информация</h3>
          <div className={styles.mainBlockFieldsRow}>
            <Controller
              control={control}
              name="surname"
              rules={{ required: true }}
              render={({ field, fieldState }) => (
                <Input
                  {...field}
                  error={fieldState.error}
                  label="Фамилия"
                  placeholder="Введите фамилию"
                />
              )}
            />
            <Controller
              control={control}
              name="name"
              rules={{ required: true }}
              render={({ field, fieldState }) => (
                <Input
                  {...field}
                  error={fieldState.error}
                  label="Имя"
                  placeholder="Введите имя"
                />
              )}
            />
            <Controller
              control={control}
              name="patronymic"
              render={({ field, fieldState }) => (
                <Input
                  {...field}
                  error={fieldState.error}
                  label="Отчество"
                  placeholder="Введите отчество"
                  notRequiredHint
                />
              )}
            />
          </div>
          <div className={styles.mainBlockFieldsRow}>
            <Controller
              control={control}
              name="birthday"
              rules={{ required: true }}
              render={({ field, fieldState }) => (
                <DatePicker
                  {...field}
                  error={fieldState.error}
                  label="Дата рождения"
                  placeholder="дд.мм.гггг"
                />
              )}
            />
            <Controller
              control={control}
              name="city"
              rules={{ required: true }}
              render={({ field, fieldState }) => (
                <Select
                  {...field}
                  error={fieldState.error}
                  label="Город"
                  placeholder="Выберите из списка"
                  items={Cities.map((i) => ({ key: i, value: i }))}
                  inputtable
                />
              )}
            />
          </div>
          <Controller
            control={control}
            name="education_id"
            rules={{ required: true }}
            render={({ field, fieldState }) => (
              <Select
                {...field}
                className={styles.mainBlockHalfField}
                error={fieldState.error}
                label="Образование"
                placeholder="Выберите из списка"
                items={
                  educations.status === 'success'
                    ? educations.value.map((i) => ({
                        key: i.id,
                        value: i.education,
                      }))
                    : undefined
                }
              />
            )}
          />
        </div>
        <div className={styles.mainBlock}>
          <h3>Контактная информация</h3>
          <Controller
            control={control}
            name="phone"
            rules={{ required: true }}
            render={({ field, fieldState }) => (
              <Input
                {...field}
                className={styles.mainBlockHalfField}
                error={fieldState.error}
                label="Телефон"
                placeholder="+7 (___) ___-__-__"
              />
            )}
          />
          <div className={styles.mainBlockFieldsRow}>
            <Controller
              control={control}
              name="telegram"
              rules={{ required: true }}
              render={({ field, fieldState }) => (
                <Input
                  {...field}
                  error={fieldState.error}
                  label="Ник в телеграм"
                  placeholder="Введите без @"
                />
              )}
            />
            <Controller
              control={control}
              name="email"
              rules={{ required: true }}
              render={({ field, fieldState }) => (
                <Input
                  {...field}
                  error={fieldState.error}
                  label="Эл. почта"
                  type="email"
                  placeholder="Введите эл. почту"
                />
              )}
            />
          </div>
        </div>
        <div className={styles.mainBlock}>
          <h3>Профессиональная информация</h3>
          <Controller
            control={control}
            name="skills"
            rules={{ required: true }}
            render={({ field, fieldState }) => (
              <KeywordsInput
                {...field}
                error={fieldState.error}
                label="Ключевые навыки"
                placeholder="Выберите ваши основные навыки"
                maxCount={10}
                items={
                  skills.status === 'success'
                    ? skills.value.map((i) => ({ key: i.id, value: i.skill }))
                    : undefined
                }
              />
            )}
          />
          <Controller
            control={control}
            name="job_title"
            rules={{ required: true }}
            render={({ field, fieldState }) => (
              <Input
                {...field}
                error={fieldState.error}
                label="Желаемая должность"
                placeholder="Кем вы хотите работать"
              />
            )}
          />
          <div className={styles.mainBlockFieldsRow}>
            <Controller
              control={control}
              name="work_schedule_id"
              rules={{ required: true }}
              render={({ field, fieldState }) => (
                <Select
                  {...field}
                  error={fieldState.error}
                  label="График работы"
                  placeholder="Выберите из списка"
                  items={
                    workSchedules.status === 'success'
                      ? workSchedules.value.map((i) => ({
                          key: i.id,
                          value: i.schedule,
                        }))
                      : undefined
                  }
                />
              )}
            />
            <Controller
              control={control}
              name="work_type_id"
              rules={{ required: true }}
              render={({ field, fieldState }) => (
                <Select
                  {...field}
                  error={fieldState.error}
                  label="Формат работы"
                  placeholder="Выберите из списка"
                  items={
                    workTypes.status === 'success'
                      ? workTypes.value.map((i) => ({
                          key: i.id,
                          value: i.type,
                        }))
                      : undefined
                  }
                />
              )}
            />
          </div>
          <div className={styles.mainBlockFieldsRow}>
            <Controller
              control={control}
              name="work_experience_id"
              rules={{ required: true }}
              render={({ field, fieldState }) => (
                <Select
                  {...field}
                  error={fieldState.error}
                  label="Стаж работы"
                  placeholder="Выберите из списка"
                  items={
                    workExperiences.status === 'success'
                      ? workExperiences.value.map((i) => ({
                          key: i.id,
                          value: i.experience,
                        }))
                      : undefined
                  }
                />
              )}
            />
            <Controller
              control={control}
              name="salary_expectation"
              rules={{ required: true }}
              render={({ field, fieldState }) => (
                <Input
                  {...field}
                  error={fieldState.error}
                  label="Желаемая з/п"
                  placeholder="от"
                  type="number"
                />
              )}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
