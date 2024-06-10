import { FormEventHandler, ReactNode } from 'react'
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
  form?: boolean
  onSubmit?: FormEventHandler<HTMLFormElement>
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
  form: isForm,
  onSubmit,
  setIsShowed,
}: ModalProps) {
  const content = (
    <>
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
    </>
  )

  return (
    <Overlay
      className={classNames('modal', styles.container)}
      isShowed={isShowed}
      setIsShowed={setIsShowed}
    >
      <RemoveScroll>
        <span className={styles.backdrop} onClick={() => setIsShowed(false)} />
        {isForm ? (
          <form
            className={classNames(className, styles.modal)}
            style={{ width }}
            onSubmit={onSubmit}
          >
            {content}
          </form>
        ) : (
          <div
            className={classNames(className, styles.modal)}
            style={{ width }}
          >
            {content}
          </div>
        )}
      </RemoveScroll>
    </Overlay>
  )
}
