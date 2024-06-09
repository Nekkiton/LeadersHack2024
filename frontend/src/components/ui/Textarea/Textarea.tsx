import { FormEventHandler, useEffect, useRef } from 'react'
import { FormError } from '@/lib/use-form-error'
import { useControlValue } from '@/lib/use-control-value'
import classNames from 'classnames'
import ControlContainer from '@/components/ui/ControlContainer'
import styles from './Textarea.module.scss'

interface Props {
  className?: string
  label?: string
  placeholder?: string
  postscript?: string
  notRequiredHint?: boolean
  error?: FormError
  height?: number
  value?: string | null
  onChange?: (val: string | null) => void
}

export default function Textarea({
  className,
  label,
  placeholder,
  postscript,
  notRequiredHint,
  error,
  height,
  value: baseValue,
  onChange: baseOnChange,
}: Props) {
  const targetDivRef = useRef<HTMLDivElement | null>(null)

  const { value, setValue } = useControlValue({
    baseValue,
    baseOnChange,
    transformBaseValue: (val) => val ?? null,
    transformValue: (val) => val,
  })

  useEffect(() => {
    if (
      targetDivRef.current &&
      value &&
      targetDivRef.current.innerText !== value
    ) {
      targetDivRef.current.innerText = value
    }
  }, [value, targetDivRef])

  const onInput: FormEventHandler<HTMLDivElement> = (e) => {
    setValue((e.target as HTMLElement).innerText)
  }

  return (
    <ControlContainer
      className={className}
      label={label}
      postscript={postscript}
      notRequiredHint={notRequiredHint}
      error={error}
    >
      <div
        className={classNames(styles.container, { [styles.error]: !!error })}
      >
        <div
          ref={targetDivRef}
          className={styles.targetDiv}
          data-placeholder={placeholder}
          onInput={onInput}
          style={{ height }}
          contentEditable
        />
      </div>
    </ControlContainer>
  )
}
