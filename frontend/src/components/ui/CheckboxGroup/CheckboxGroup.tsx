import { Key, ReactNode } from 'react'
import { useControlValue } from '@/lib/use-control-value'
import { FormError } from '@/lib/use-form-error'
import classNames from 'classnames'
import ControlContainer from '@/components/ui/ControlContainer'
import Checkbox from '@/components/ui/Checkbox'
import styles from './CheckboxGroup.module.scss'

interface Props {
  className?: string
  label?: string
  postscript?: string
  error?: FormError
  items?: {
    key: Key
    value: ReactNode
  }[]
  value?: Key[]
  onChange?: (val: Key[]) => void
}

export default function CheckboxGroup({
  className,
  label,
  postscript,
  error,
  items = [],
  value: baseValue,
  onChange: baseOnChange,
}: Props) {
  // TODo: ref - for react hook form
  // TODO: accessibility, semantic

  const { value, setValue } = useControlValue({
    baseValue,
    baseOnChange,
    transformBaseValue: (val) => val ?? [],
    transformValue: (val) => val,
  })

  const toggleItem = (key: Key) => {
    const idx = value.indexOf(key) ?? -1
    if (idx === -1) {
      setValue([...value, key])
    } else {
      setValue([...value.slice(0, idx), ...value.slice(idx + 1)])
    }
  }

  return (
    <ControlContainer
      className={classNames(className, styles.container)}
      label={label}
      postscript={postscript}
      error={error}
    >
      <div className={styles.main}>
        {items.map((item) => (
          <Checkbox
            key={item.key}
            value={value?.includes(item.key)}
            onChange={() => toggleItem(item.key)}
            error={!!error}
          >
            {item.value}
          </Checkbox>
        ))}
      </div>
    </ControlContainer>
  )
}
