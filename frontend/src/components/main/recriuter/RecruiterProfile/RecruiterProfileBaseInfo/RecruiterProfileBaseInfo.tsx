import { useFormContext, Controller } from 'react-hook-form'
import classNames from 'classnames'
import AvatarUpload from '@/components/ui/AvatarUpload'
import Input from '@/components/ui/Input'
import styles from './RecruiterProfileBaseInfo.module.scss'

interface FormData {
  avatar: any
  name: string
  surname: string
  patronymic: string
  phone: string
  tgNickname: string | null
  email: string
}

export default function RecruiterProfileBaseInfo() {
  const { control } = useFormContext<FormData>()

  return (
    <div className={styles.container}>
      <Controller
        control={control}
        name="avatar"
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
                <Input {...field} error={fieldState.error} label="Фамилия" />
              )}
            />
            <Controller
              control={control}
              name="name"
              rules={{ required: true }}
              render={({ field, fieldState }) => (
                <Input {...field} error={fieldState.error} label="Имя" />
              )}
            />
            <Controller
              control={control}
              name="patronymic"
              rules={{ required: true }}
              render={({ field, fieldState }) => (
                <Input
                  {...field}
                  error={fieldState.error}
                  label="Отчество"
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
                placeholder="+7 (___) ___-__-__"
              />
            )}
          />
          <div className={styles.mainBlockFieldsRow}>
            <Controller
              control={control}
              name="tgNickname"
              render={({ field, fieldState }) => (
                <Input
                  {...field}
                  error={fieldState.error}
                  label="Ник в телеграм"
                />
              )}
            />
            <Controller
              control={control}
              name="email"
              render={({ field, fieldState }) => (
                <Input
                  {...field}
                  error={fieldState.error}
                  label="Эл. почта"
                  type="email"
                />
              )}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
