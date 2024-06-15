import { useEffect, useState, useRef } from 'react'
import { FormError } from '@/lib/use-form-error'
import { useControlValue } from '@/lib/use-control-value'
import classNames from 'classnames'
import moment, { Moment } from 'moment'
import BaseInput from '@/components/ui/BaseInput'
import BaseButton from '@/components/ui/BaseButton'
import ControlContainer from '@/components/ui/ControlContainer'
import WithPopover from '@/components/ui/WithPopover'
import Sandwich from '@/components/ui/Sandwich'
import Icon from '@/components/ui/Icon'
import styles from './TimePicker.module.scss'

interface Props {
  className?: string
  label?: string
  placeholder?: string
  postscript?: string
  error?: FormError
  clearable?: boolean
  value?: Moment | null
  onChange?: (val: Moment | null) => void
  minutes?: number[]
}

export default function TimePicker({
  className,
  label,
  placeholder,
  postscript,
  error,
  clearable: isClearable,
  value: baseValue,
  onChange: baseOnChange,
  minutes,
}: Props) {
  // TODO: ref - for react hook form
  // TODO: accessibility, semantic
  // TODO: esc

  const [isActive, setIsActive] = useState(false)

  const minutesRef = useRef<HTMLDivElement | null>(null)
  const hoursRef = useRef<HTMLDivElement | null>(null)

  const { value, setValue } = useControlValue({
    baseValue,
    baseOnChange,
    transformBaseValue: (val) => val ?? null,
    transformValue: (val) => val,
  })

  useEffect(() => {
    if (minutes?.length && value && !minutes.includes(value.minutes())) {
      value.minutes(minutes[0])
    }
  }, [value])

  useEffect(() => {
    if (value) {
      hoursRef.current
        ?.querySelectorAll(`.${styles.item}`)
        [value.hour()].scrollIntoView({ block: 'nearest', behavior: 'smooth' })
      if (!minutes) {
        minutesRef.current
          ?.querySelectorAll(`.${styles.item}`)
          [value.minute()].scrollIntoView({
            block: 'nearest',
            behavior: 'smooth',
          })
      }
    }
  }, [value])

  const clear = () => {
    setValue(null)
    setIsActive(false)
  }

  return (
    <ControlContainer
      className={classNames(className, styles.container, {
        [styles.error]: error,
      })}
      label={label}
      postscript={postscript}
      error={error}
    >
      <WithPopover
        className={classNames(styles.withPopover, {
          [styles.active]: isActive,
        })}
        popoverClassName={styles.popover}
        isActive={isActive}
        setIsActive={setIsActive}
        reference={
          <BaseInput
            className={styles.inputContainer}
            inputClassName={styles.input}
            placeholder={placeholder}
            error={!!error}
            value={value?.format('HH:mm') ?? null}
            postfix={
              <Sandwich
                items={[
                  {
                    isActive: !!(isClearable && value),
                    value: (
                      <BaseButton onClick={clear} stopPropagation hoverable>
                        <Icon icon="times" />
                      </BaseButton>
                    ),
                  },
                  {
                    isActive: !(isClearable && value),
                    value: (
                      <Icon
                        className={classNames(styles.chevronIcon, {
                          [styles.active]: isActive,
                        })}
                        icon="chevronDown"
                      />
                    ),
                  },
                ]}
              />
            }
            blocked
          />
        }
        popover={
          <>
            <div className={styles.items} ref={hoursRef}>
              {Array.from({ length: 24 }).map((_, i) => (
                <span
                  className={classNames(styles.item, {
                    [styles.active]: value?.hour() === i,
                  })}
                  key={i}
                  onClick={() => setValue(moment(value ?? undefined).hour(i))}
                >
                  {i}
                </span>
              ))}
            </div>
            <div className={styles.items} ref={minutesRef}>
              {minutes
                ? minutes.map((i) => (
                    <span
                      className={classNames(styles.item, {
                        [styles.active]: value?.minute() === i,
                      })}
                      key={i}
                      onClick={() =>
                        setValue(moment(value ?? undefined).minute(i))
                      }
                    >
                      {i}
                    </span>
                  ))
                : Array.from({ length: 60 }).map((_, i) => (
                    <span
                      className={classNames(styles.item, {
                        [styles.active]: value?.minute() === i,
                      })}
                      key={i}
                      onClick={() =>
                        setValue(moment(value ?? undefined).minute(i))
                      }
                    >
                      {i}
                    </span>
                  ))}
            </div>
          </>
        }
      />
    </ControlContainer>
  )
}
