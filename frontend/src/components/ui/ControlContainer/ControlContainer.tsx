import { ReactNode } from 'react'
import { useFormError, FormError } from '@/lib/use-form-error'
import classNames from 'classnames'
import AppearTransition from '@/components/ui/AppearTransition'
import styles from './ControlContainer.module.scss'

export interface ControlContainerProps {
  className?: string
  controlId?: string
  label?: string
  postscript?: string
  error?: FormError
  children?: ReactNode
}

export default function ControlContainer({
  className,
  controlId,
  label,
  postscript,
  error,
  children,
}: ControlContainerProps) {
  const errorMsg = useFormError(error)

  return (
    <section className={classNames(styles.container, className)}>
      {label && (
        <label className={styles.label} htmlFor={controlId}>
          {label}
        </label>
      )}
      {children}
      <AppearTransition orientation="v" gap>
        {errorMsg && (
          <p className={classNames(styles.postscript, styles.error)}>
            {errorMsg}
          </p>
        )}
      </AppearTransition>
      {postscript && <p className={styles.postscript}>{postscript}</p>}
    </section>
  )
}
