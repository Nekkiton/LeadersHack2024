import { Page } from '@/types/page'
import AuthLayout from '@/components/layouts/AuthLayout'
import Icon from '@/components/ui/Icon'
import styles from './index.module.scss'

export default function ForgotPasswordSuccessPage() {
  return (
    <div className={styles.container}>
      <Icon className={styles.icon} icon="messageSent" />
      <div className={styles.text}>
        <h3>Ссылка на восстановление пароля отправлена</h3>
        <p>
          Перейдите по ней, чтобы установить новый пароль для входа в личный
          кабинет
        </p>
      </div>
    </div>
  )
}

;(ForgotPasswordSuccessPage as Page).layout = AuthLayout
