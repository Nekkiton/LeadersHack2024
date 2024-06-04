import { useState, useEffect } from 'react'

export const useControlValue = <Value = unknown, BaseValue = unknown>({
  baseValue,
  baseOnChange,
  transformBaseValue,
  transformValue,
}: {
  baseValue?: BaseValue
  baseOnChange?: (val: BaseValue) => void
  transformBaseValue: (val: BaseValue | undefined) => Value
  transformValue: (val: Value) => BaseValue
}) => {
  const [value, setValue] = useState<Value>(transformBaseValue(baseValue))

  useEffect(() => {
    setValue(transformBaseValue(baseValue))
  }, [baseValue])
  // TODO: eslint warning

  const onChange = (val: Value) => {
    if (baseOnChange || baseValue !== undefined) {
      baseOnChange?.(transformValue(val))
      if (baseValue === undefined) {
        setValue(val)
      }
    } else {
      setValue(val)
    }
  }

  return { value, setValue: onChange, setValue_: setValue }
}
