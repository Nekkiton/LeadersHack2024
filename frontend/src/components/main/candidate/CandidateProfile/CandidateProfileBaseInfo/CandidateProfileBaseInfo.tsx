import { useFormContext, Controller } from 'react-hook-form'
import { useEducations } from '@/api/educations'
import { useSkills } from '@/api/skills'
import { useWorkSchedules } from '@/api/work-schedules'
import { useWorkTypes } from '@/api/work-types'
import { useWorkExperiences } from '@/api/work-experiences'
import { useCitites } from '@/api/cities'
import { getTimezones } from '@/lib/get-timezones'
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
  const cities = useCitites()

  return (
    <div className={styles.container}>
      <Controller
        control={control}
        name="image"
        render={({ field, fieldState }) => (
          <AvatarUpload
            {...field}
            className={styles.avatarUpload}
            error={fieldState.error}
          />
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
                  items={
                    cities.status === 'success'
                      ? cities.value.map((i) => ({ key: i, value: i }))
                      : undefined
                  }
                  inputtable
                />
              )}
            />
          </div>
          <Controller
            control={control}
            name="education"
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
                        key: i,
                        value: i,
                      }))
                    : undefined
                }
              />
            )}
          />
        </div>
        <div className={styles.mainBlock}>
          <h3>Контактная информация</h3>
          <div className={styles.mainBlockFieldsRow}>
            <Controller
              control={control}
              name="phone"
              rules={{ required: true }}
              render={({ field, fieldState }) => (
                <Input
                  {...field}
                  error={fieldState.error}
                  label="Телефон"
                  placeholder="+7 ___ ___ __ __"
                />
              )}
            />
            <Controller
              control={control}
              name="preferences.timezone"
              rules={{ required: true }}
              render={({ field, fieldState }) => (
                <Select
                  {...field}
                  error={fieldState.error}
                  label="Часовой пояс"
                  placeholder="Выберите из списка"
                  items={getTimezones()}
                />
              )}
            />
          </div>
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
                    ? skills.value.map((i) => ({ key: i, value: i }))
                    : undefined
                }
              />
            )}
          />
          <Controller
            control={control}
            name="desired_position"
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
              name="work_schedule"
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
                          key: i,
                          value: i,
                        }))
                      : undefined
                  }
                />
              )}
            />
            <Controller
              control={control}
              name="work_type"
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
                          key: i,
                          value: i,
                        }))
                      : undefined
                  }
                  inputtable
                />
              )}
            />
          </div>
          <div className={styles.mainBlockFieldsRow}>
            <Controller
              control={control}
              name="work_experience"
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
                          key: i,
                          value: i,
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
