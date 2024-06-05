import { useForm, Controller } from 'react-hook-form'
import { Page } from '@/types/page'
import { Routes } from '@/config/routes'
import { useLogin } from '@/api/auth'
import { LoginData } from '@/types/entities/auth'
import AuthLayout from '@/components/layouts/AuthLayout'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import styles from '@/assets/css/auth-form.module.scss'

export default function LoginPage() {
  const { control, handleSubmit } = useForm<LoginData>()

  const { mutate: login, status } = useLogin()

  const submit = handleSubmit((data) => {
    login(data)
    console.log(data)
  })

  return (
    <form className={styles.container} onSubmit={submit}>
      <div className={styles.header}>
        <div className={styles.headerMain}>
          <h1>Вход</h1>
          <Button type="text" href={Routes.register}>
            Регистрация
          </Button>
        </div>
      </div>
      <div className={styles.fields}>
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
            />
          )}
        />
        <Controller
          control={control}
          name="password"
          rules={{ required: true }}
          render={({ field, fieldState }) => (
            <Input
              {...field}
              error={fieldState.error}
              label="Пароль"
              type="password"
            />
          )}
        />
        <Button
          className={styles.fieldsResetPasswordBtn}
          type="text"
          href={Routes.forgotPassword}
        >
          Не помню пароль
        </Button>
      </div>
      <Button
        type="primary"
        htmlType="submit"
        loading={status === 'pending'}
        fullWidth
      >
        Войти
      </Button>
    </form>
  )
}

;(LoginPage as Page).layout = AuthLayout
