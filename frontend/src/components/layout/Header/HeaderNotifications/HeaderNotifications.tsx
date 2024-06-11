import WithPopover from '@/components/ui/WithPopover'
import Icon from '@/components/ui/Icon'
import styles from './HeaderNotifications.module.scss'

export default function HeaderNotifications() {
  return (
    <WithPopover
      className={styles.container}
      reference={<Icon icon="bell" />}
      popoverClassName={styles.popover}
      popover={
        <div className={styles.notificationsContainer}>
          <h4>Новых уведомлений нет</h4>
        </div>
      }
    />
  )
}
