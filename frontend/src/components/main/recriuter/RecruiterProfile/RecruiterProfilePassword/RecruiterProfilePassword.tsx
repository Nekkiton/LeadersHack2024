import Button from '@/components/ui/Button'
import Icon from '@/components/ui/Icon'
import styles from './RecruiterProfilePassword.module.scss'

export default function RecruiterProfilePassword() {
  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <h3>Пароль</h3>
        <p className={styles.mainHint}>Не менялся</p>
      </div>
      {/* TODO: action */}
      <Button type="text">
        <Icon icon="pen" />
        <span>Изменить пароль</span>
      </Button>
    </div>
  )
}
