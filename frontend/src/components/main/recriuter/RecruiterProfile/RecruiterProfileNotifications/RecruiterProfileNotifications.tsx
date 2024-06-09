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
        <Controller
          control={control}
          name="_siteNotifications"
          render={({ field, fieldState }) => (
            <Checkbox {...field} error={fieldState.error}>
              На сайте
            </Checkbox>
          )}
        />
        <Controller
          control={control}
          name="_tgNotifications"
          render={({ field, fieldState }) => (
            <Checkbox {...field} error={fieldState.error}>
              В telegram
            </Checkbox>
          )}
        />
      </div>
    </div>
  )
}
