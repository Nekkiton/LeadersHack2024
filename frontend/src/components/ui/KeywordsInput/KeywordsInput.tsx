import { Key, useState } from 'react'
import { FormError } from '@/lib/use-form-error'
import { useControlValue } from '@/lib/use-control-value'
import classNames from 'classnames'
import ControlContainer from '@/components/ui/ControlContainer'
import WithPopover from '@/components/ui/WithPopover'
import BaseButton from '@/components/ui/BaseButton'
import Icon from '@/components/ui/Icon'
import styles from './KeywordsInput.module.scss'

interface Props {
  className?: string
  label?: string
  placeholder?: string
  notRequiredHint?: boolean
  error?: FormError
  maxCount?: number
  items?: { key: Key; value: string }[]
  value?: Key[]
  onChange?: (val: Key[]) => void
}

export default function KeywordsInput({
  className,
  label,
  placeholder,
  notRequiredHint,
  error,
  maxCount,
  items,
  value: baseValue,
  onChange: baseOnChange,
}: Props) {
  const { value, setValue } = useControlValue({
    baseValue,
    baseOnChange,
    transformBaseValue: (val) => val ?? [],
    transformValue: (val) => val,
  })

  const [isActive, setIsActive] = useState(false)
  const [query, setQuery] = useState('')

  const addItem = (item: { key: Key; value: string }) => {
    if (maxCount && value.length >= maxCount) {
      return
    }
    setValue([...value, item.key])
    setIsActive(false)
    setQuery('')
  }

  const removeItem = (key: Key) => () => {
    setValue(value.filter((i) => i !== key))
    setTimeout(() => {
      setIsActive(false)
    }, 0)
  }

  return (
    <ControlContainer
      className={className}
      label={label}
      postscript={maxCount ? `${value.length}/${maxCount}` : undefined}
      notRequiredHint={notRequiredHint}
      error={error}
    >
      <WithPopover
        className={classNames(styles.withPopover, {
          [styles.active]: isActive,
          [styles.error]: !!error,
        })}
        isActive={isActive}
        setIsActive={setIsActive}
        reference={
          <div className={styles.inputContainer}>
            {value.map((key) => (
              <BaseButton
                className={styles.selectedItem}
                key={key}
                onClick={removeItem(key)}
              >
                <span>{items?.find((i) => i.key === key)?.value}</span>
                <Icon className={styles.selectedItemIcon} icon="times" />
              </BaseButton>
            ))}
            <input
              className={styles.input}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={placeholder}
            />
          </div>
        }
        popoverClassName={styles.popover}
        popover={
          <div className={styles.items}>
            {items
              ?.filter(
                (item) =>
                  item.value.includes(query) && !value.includes(item.key)
              )
              .map((item) => (
                <div
                  className={styles.item}
                  key={item.key}
                  onClick={() => addItem(item)}
                >
                  {item.value}
                </div>
              ))}
          </div>
        }
      />
    </ControlContainer>
  )
}
