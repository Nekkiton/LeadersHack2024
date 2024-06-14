import { useFormContext, Controller } from 'react-hook-form'
import { FormData } from '../utils'
import AvatarUpload from '@/components/ui/AvatarUpload'
import Input from '@/components/ui/Input'
import styles from './RecruiterProfileBaseInfo.module.scss'

export default function RecruiterProfileBaseInfo() {
  const { control } = useFormContext<FormData>()

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
                placeholder="+7 ___ ___ __ __"
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
      </div>
    </div>
  )
}
