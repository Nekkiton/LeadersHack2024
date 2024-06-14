import Icon from '@/components/ui/Icon'
import styles from './News.module.scss'

export default function News() {
  return (
    <div className={styles.nothing}>
      <Icon className={styles.nothingIcon} icon="documentLoupe" />
      <p>Функционал в разработке</p>
    </div>
  )
}
