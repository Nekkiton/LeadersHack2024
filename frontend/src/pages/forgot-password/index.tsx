import { useForm, Controller } from 'react-hook-form'
import { Page } from '@/types/page'
import { ForgotPasswordData } from '@/types/entities/auth'
import { Routes } from '@/config/routes'
import { useForgotPassword } from '@/api/auth'
import AuthLayout from '@/components/layouts/AuthLayout'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Icon from '@/components/ui/Icon'
import styles from '@/assets/css/auth-form.module.scss'

export default function ForgotPasswordPage() {
  const { control, handleSubmit } = useForm<ForgotPasswordData>()

  const { mutate: forgotPassword, status } = useForgotPassword()

  const submit = handleSubmit((data) => {
    forgotPassword(data)
    console.log(data)
  })

  return (
    <form className={styles.container} onSubmit={submit}>
      <h1>Восстановление пароля</h1>
      <Button className={styles.centerElement} type="text" href={Routes.login}>
        <Icon icon="chevronLeft" />
        <span>Вернуться ко входу</span>
      </Button>
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
      <Button
        type="primary"
        htmlType="submit"
        loading={status === 'pending'}
        fullWidth
      >
        Восстановить пароль
      </Button>
    </form>
  )
}

;(ForgotPasswordPage as Page).layout = AuthLayout
