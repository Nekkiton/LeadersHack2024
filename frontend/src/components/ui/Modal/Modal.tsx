import { ReactNode } from 'react'
import { RemoveScroll } from 'react-remove-scroll'
import classNames from 'classnames'
import Overlay from '@/components/ui/Overlay'
import styles from './Modal.module.scss'

export interface ModalStateProps {
  isShowed: boolean
  setIsShowed: (val: boolean) => void
}

export interface ModalProps extends ModalStateProps {
  className?: string
  width?: number
  header: ReactNode
  mobileHeader?: ReactNode
  footer?: ReactNode
  children?: ReactNode
}

export default function Modal({
  className,
  width = 600,
  header,
  mobileHeader = header,
  footer,
  children,
  isShowed,
  setIsShowed,
}: ModalProps) {
  return (
    <Overlay
      className={classNames('modal', styles.container)}
      isShowed={isShowed}
      setIsShowed={setIsShowed}
    >
      <RemoveScroll>
        <span className={styles.backdrop} onClick={() => setIsShowed(false)} />
        <div className={classNames(className, styles.modal)} style={{ width }}>
          <div className={styles.modalHeader}>
            <div className={classNames(styles.modalTitle, styles.desktop)}>
              {header}
            </div>
            <div className={classNames(styles.modalTitle, styles.mobile)}>
              {mobileHeader}
            </div>
          </div>
          {children}
          {footer && <div className={styles.modalFooter}>{footer}</div>}
        </div>
      </RemoveScroll>
    </Overlay>
  )
}
