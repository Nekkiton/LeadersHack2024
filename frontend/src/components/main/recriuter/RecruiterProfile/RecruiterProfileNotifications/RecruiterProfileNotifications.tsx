import { useFormContext, Controller } from 'react-hook-form'
import { FormData } from '../utils'
import Checkbox from '@/components/ui/Checkbox'
import styles from './RecruiterProfileNotifications.module.scss'

export default function RecruiterProfileNotifications() {
  const { control } = useFormContext<FormData>()

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3>Уведомления</h3>
        <p className={styles.headerHint}>
          Выберите, куда хотите получать уведомления о вакансиях и резюме
        </p>
      </div>
      <div className={styles.fields}>
        {/* <Checkbox value>На сайте</Checkbox> */}
        <Controller
          control={control}
          name="preferences.email_notify"
          render={({ field, fieldState }) => (
            <Checkbox {...field} error={fieldState.error}>
              На эл. почту
            </Checkbox>
          )}
        />
      </div>
    </div>
  )
}
