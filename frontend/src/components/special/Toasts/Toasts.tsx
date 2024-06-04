import { useToasts } from '@/lib/use-toasts'
import { useMultipleAppearTransition } from '@/lib/use-multiple-appear-transition'
import classNames from 'classnames'
import Icon from '@/components/ui/Icon'
import styles from './Toasts.module.scss'
import BaseButton from '@/components/ui/BaseButton'
import AppearTransition from '@/components/ui/AppearTransition'

export default function Toasts() {
  const { items: items_, remove } = useToasts()

  const items = useMultipleAppearTransition(items_)

  if (!items.length) return null

  return (
    <div className={styles.container}>
      {items.map((toast) => (
        <AppearTransition className={styles.toastContainer} key={toast.id} gap>
          {toast.isActive && (
            <div className={classNames(styles.toast, styles[toast.value.type])}>
              <div className={styles.toastMain}>
                {toast.value.title && (
                  <div className={styles.toastTitle}>{toast.value.title}</div>
                )}
                <div className={styles.toastContent}>{toast.value.content}</div>
              </div>
              <BaseButton onClick={() => remove(toast.id)} hoverable>
                <Icon className={styles.toastCloseIcon} icon="times" />
              </BaseButton>
            </div>
          )}
        </AppearTransition>
      ))}
    </div>
  )
}
