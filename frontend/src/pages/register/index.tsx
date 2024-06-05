import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Page } from '@/types/page'
import { Routes } from '@/config/routes'
import { useRegister } from '@/api/auth'
import { RegisterData } from '@/types/entities/auth'
import Link from 'next/link'
import AuthLayout from '@/components/layouts/AuthLayout'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Checkbox from '@/components/ui/Checkbox'
import styles from '@/assets/css/auth-form.module.scss'

interface FormData extends RegisterData {
  passwordRepeat: string
  rules: boolean
}

export default function RegisterPage() {
  const { control, handleSubmit, watch, formState, trigger } =
    useForm<FormData>()

  const { mutate: register, status } = useRegister()

  const submit = handleSubmit((data) => {
    register(data)
    console.log(data)
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
          <h1>Регистрация</h1>
          <Button type="text" href={Routes.login}>
            Вход
          </Button>
        </div>
        <p className={styles.headerHint}>Шаг 1 из 2. Создание аккаунта</p>
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
          rules={{
            required: true,
            validate: (val) =>
              val === passwordRepeat ? true : 'Пароли не совпадают',
          }}
          render={({ field, fieldState }) => (
            <Input
              {...field}
              error={fieldState.error}
              label="Пароль"
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
              val === password ? true : 'Пароли не совпадают',
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
      <Controller
        control={control}
        name="rules"
        rules={{ required: true }}
        render={({ field, fieldState }) => (
          <Checkbox {...field} error={fieldState.error}>
            <p className={styles.rules}>
              Даю согласагие на{' '}
              <Link href={Routes.privacy} target="_blank">
                обработку персональных данных
              </Link>
            </p>
          </Checkbox>
        )}
      />
      <Button
        type="primary"
        htmlType="submit"
        loading={status === 'pending'}
        fullWidth
      >
        Зарегистрироваться
      </Button>
    </form>
  )
}

;(RegisterPage as Page).layout = AuthLayout
