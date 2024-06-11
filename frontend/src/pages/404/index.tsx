import { Routes } from '@/config/routes'
import Button from '@/components/ui/Button'
import Icon from '@/components/ui/Icon'
import styles from './index.module.scss'

export default function NotFoundPage() {
  return (
    <div className={styles.container}>
      <Icon className={styles.icon} icon="loupeOff" />
      <p>Здесь ничего нет</p>
      <Button type="primary" href={Routes.home}>
        На главную
      </Button>
    </div>
  )
}
