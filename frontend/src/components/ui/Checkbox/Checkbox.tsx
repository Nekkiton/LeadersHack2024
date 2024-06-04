import { ReactNode } from 'react'
import { FormError } from '@/lib/use-form-error'
import { useControlValue } from '@/lib/use-control-value'
import classNames from 'classnames'
import ControlContainer from '@/components/ui/ControlContainer'
import BaseButton from '@/components/ui/BaseButton'
import Icon from '@/components/ui/Icon'
import styles from './Checkbox.module.scss'

interface Props {
  className?: string
  error?: FormError | boolean
  postscript?: string
  value?: boolean
  children?: ReactNode
  onChange?: (val: boolean) => void
}

export default function Checkbox({
  className,
  error,
  postscript,
  value: baseValue,
  children,
  onChange: baseOnChange,
}: Props) {
  // TODO: ref - for react hook form
  // TODO: accessibility, semantic

  const { value, setValue } = useControlValue({
    baseValue,
    baseOnChange,
    transformBaseValue: (val) => val ?? false,
    transformValue: (val) => val,
  })

  return (
    <ControlContainer
      className={classNames(className, styles.container)}
      postscript={postscript}
      error={typeof error !== 'boolean' ? error : undefined}
    >
      <div
        className={classNames(styles.main, {
          [styles.active]: value,
          [styles.error]: !!error,
        })}
        onClick={() => setValue(!value)}
      >
        <BaseButton className={styles.checkbox}>
          <Icon className={styles.checkboxIcon} icon="check" />
        </BaseButton>
        {children}
      </div>
    </ControlContainer>
  )
}
