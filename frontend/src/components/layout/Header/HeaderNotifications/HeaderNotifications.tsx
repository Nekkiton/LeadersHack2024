import { useEffect, useMemo, useState } from 'react'
import {
  useCurUserNotifications,
  useCurUserReadNotifications,
} from '@/api/notifications'
import moment from 'moment'
import WithPopover from '@/components/ui/WithPopover'
import Icon from '@/components/ui/Icon'
import RemoteData from '@/components/special/RemoteData'
import styles from './HeaderNotifications.module.scss'
import classNames from 'classnames'

export default function HeaderNotifications() {
  const [isActive, setIsActive] = useState(false)

  const notifications = useCurUserNotifications()
  const { mutate } = useCurUserReadNotifications()

  const newNotificationsCount = useMemo(() => {
    if (notifications.status === 'success') {
      return notifications.value.reduce(
        (prev, cur) => (cur.is_read ? prev : prev + 1),
        0
      )
    }
    return 0
  }, [(notifications as any).value])

  useEffect(() => {
    if (!isActive && newNotificationsCount) {
      mutate(0)
    }
  }, [isActive])

  return (
    <WithPopover
      className={styles.container}
      reference={
        <div
          className={classNames(styles.referenceIconContainer, {
            [styles.marked]: newNotificationsCount,
          })}
        >
          <Icon icon="bell" />
        </div>
      }
      popoverClassName={styles.popover}
      popover={
        <div className={styles.notificationsContainer}>
          <h4>
            {newNotificationsCount
              ? `Новых уведомлений: ${newNotificationsCount}`
              : 'Новых уведомлений нет'}
          </h4>
          <RemoteData
            data={notifications}
            renderSuccess={(notifications) =>
              !!notifications.length && (
                <div className={styles.notifications}>
                  {notifications.map((notification) => (
                    <div className={styles.notification} key={notification._id}>
                      <div className={styles.notificationHeader}>
                        {!notification.is_read && (
                          <span className={styles.notificationHeaderMark} />
                        )}
                        <span>
                          {moment(`${notification.created_at}Z`).format(
                            'DD MMMM YYYY, HH:mm'
                          )}
                        </span>
                      </div>
                      <p className={styles.notificationText}>
                        {notification.title}. {notification.content}
                      </p>
                    </div>
                  ))}
                </div>
              )
            }
          />
        </div>
      }
      isActive={isActive}
      setIsActive={setIsActive}
    />
  )
}
