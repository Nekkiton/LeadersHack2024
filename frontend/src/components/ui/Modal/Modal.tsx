import { ReactNode } from 'react'
// import { RemoveScroll } from 'react-remove-scroll'
import classNames from 'classnames'
import Floating from '@/components/ui/Overlay'
import Icon from '@/components/ui/Icon'
import BaseButton from '@/components/ui/BaseButton'
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
    <Floating
      className={classNames('modal', styles.container)}
      isShowed={isShowed}
      setIsShowed={setIsShowed}
    >
      {/* <RemoveScroll> */}
      <span className={styles.backdrop} onClick={() => setIsShowed(false)} />
      <div className={classNames(className, styles.modal)} style={{ width }}>
        <div className={styles.modalHeader}>
          <div className={classNames(styles.modalTitle, styles.desktop)}>
            {header}
          </div>
          <div className={classNames(styles.modalTitle, styles.mobile)}>
            {mobileHeader}
          </div>
          <BaseButton onClick={() => setIsShowed(false)} hoverable>
            <Icon icon="times" />
          </BaseButton>
        </div>
        {children}
        {footer && <div className={styles.modalFooter}>{footer}</div>}
      </div>
      {/* </RemoveScroll> */}
    </Floating>
  )
}
