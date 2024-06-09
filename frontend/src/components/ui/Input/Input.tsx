import { ForwardedRef, ReactNode, Ref, forwardRef, useId, useMemo } from 'react'
import { FormError } from '@/lib/use-form-error'
import BaseInput, { BaseInputProps, InputType } from '@/components/ui/BaseInput'
import ControlContainer from '@/components/ui/ControlContainer'

interface Props<Type extends InputType>
  extends Omit<BaseInputProps<Type>, 'error'> {
  className?: string
  label?: string
  postscript?: string
  notRequiredHint?: boolean
  error?: FormError
}

const Input = <Type extends InputType = 'text'>(
  {
    className,
    label,
    postscript,
    notRequiredHint,
    error,
    ...baseInputProps
  }: Props<Type>,
  ref: ForwardedRef<HTMLInputElement>
) => {
  const defaultInputId = useId()

  const inputId = useMemo(
    () => baseInputProps.id ?? defaultInputId,
    [baseInputProps.id]
    // TODO: esling warning
  )

  return (
    <ControlContainer
      className={className}
      controlId={inputId}
      label={label}
      postscript={postscript}
      notRequiredHint={notRequiredHint}
      error={error}
    >
      <BaseInput {...baseInputProps} ref={ref} id={inputId} error={!!error} />
    </ControlContainer>
  )
}

export default (() => forwardRef(Input))() as <Type extends InputType = 'text'>(
  props: Props<Type> & {
    ref?: Ref<HTMLInputElement>
  }
) => ReactNode
