import { Key, ReactNode } from 'react'
import { useControlValue } from '@/lib/use-control-value'
import { FormError } from '@/lib/use-form-error'
import classNames from 'classnames'
import ControlContainer from '@/components/ui/ControlContainer'
import Radio from '@/components/ui/Radio'
import styles from './RadioGroup.module.scss'

interface Props {
  className?: string
  label?: string
  postscript?: string
  error?: FormError
  items?: {
    key: Key
    value: ReactNode
  }[]
  value?: Key | null
  onChange?: (val: Key | null) => void
}

export default function RadioGroup({
  className,
  label,
  postscript,
  error,
  items = [],
  value: baseValue,
  onChange: baseOnChange,
}: Props) {
  // TODO: ref - for react hook form
  // TODO: accessibility, semantic

  const { value, setValue } = useControlValue({
    baseValue,
    baseOnChange,
    transformBaseValue: (val) => val ?? null,
    transformValue: (val) => val,
  })

  return (
    <ControlContainer
      className={classNames(className, styles.container)}
      label={label}
      postscript={postscript}
      error={error}
    >
      <div className={styles.radios}>
        {items.map((item) => (
          <Radio
            key={item.key}
            value={value === item.key}
            onChange={(val) => setValue(val ? item.key : null)}
            error={!!error}
          >
            {item.value}
          </Radio>
        ))}
      </div>
    </ControlContainer>
  )
}
