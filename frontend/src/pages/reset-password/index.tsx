import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Page } from '@/types/page'
import { useResetPassword } from '@/api/auth'
import { ResetPasswordData } from '@/types/entities/auth'
import AuthLayout from '@/components/layouts/AuthLayout'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import styles from '@/assets/css/auth-form.module.scss'

interface FormData extends ResetPasswordData {
  passwordRepeat: string
}

export default function ResetPasswordPage() {
  const { control, handleSubmit, watch, formState, trigger } =
    useForm<FormData>()

  const { mutate: resetPassword, status } = useResetPassword()

  const submit = handleSubmit((data) => {
    resetPassword(data)
  })

  const password = watch('password')
  const passwordRepeat = watch('passwordRepeat')

  useEffect(() => {
    if (formState.isSubmitted) {
      trigger('password')
      trigger('passwordRepeat')
    }
  }, [password, passwordRepeat, formState.isSubmitted, trigger])

  return (
    <form className={styles.container} onSubmit={submit}>
      <div className={styles.header}>
        <div className={styles.headerMain}>
          <h1>Установка нового пароля</h1>
        </div>
      </div>
      <div className={styles.fields}>
        <Controller
          control={control}
          name="password"
          rules={{
            required: true,
            validate: (val) =>
              val === passwordRepeat ? true : 'Пароли не совпадают',
          }}
          render={({ field, fieldState }) => (
            <Input
              {...field}
              error={fieldState.error}
              label="Новый пароль"
              type="password"
            />
          )}
        />
        <Controller
          control={control}
          name="passwordRepeat"
          rules={{
            required: true,
            validate: (val) =>
              val === passwordRepeat ? true : 'Пароли не совпадают',
          }}
          render={({ field, fieldState }) => (
            <Input
              {...field}
              error={fieldState.error}
              label="Повторите пароль"
              type="password"
            />
          )}
        />
      </div>
      <Button
        type="primary"
        htmlType="submit"
        loading={status === 'pending'}
        fullWidth
      >
        Сохранить
      </Button>
    </form>
  )
}

;(ResetPasswordPage as Page).layout = AuthLayout
