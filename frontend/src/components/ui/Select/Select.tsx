import {
  FocusEvent,
  Key,
  KeyboardEvent,
  MouseEvent,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import classNames from 'classnames'
import { useControlValue } from '@/lib/use-control-value'
import { FormError } from '@/lib/use-form-error'
import { useEffectExceptMount } from '@/lib/use-effect-except-mount'
import BaseInput from '@/components/ui/BaseInput'
import BaseButton from '@/components/ui/BaseButton'
import ControlContainer from '@/components/ui/ControlContainer'
import WithPopover from '@/components/ui/WithPopover'
import Sandwich from '@/components/ui/Sandwich'
import SelectItems, { SelectItemsRef } from './SelectItems'
import Icon from '@/components/ui/Icon'
import styles from './Select.module.scss'

interface Item<ItemValue> {
  key: Key
  value: ItemValue
}

type Value<IsMultiple> = IsMultiple extends true ? Key[] : Key

interface Props<ItemValue, IsMultiple extends boolean> {
  className?: string
  label?: string
  postscript?: string
  error?: FormError
  placeholder?: string
  multiple?: IsMultiple
  clearable?: boolean
  inputtable?: boolean
  withConfirmation?: boolean
  longPopover?: boolean
  items?: Item<ItemValue>[]
  value?: Value<IsMultiple>
  onChange?: (val: Value<IsMultiple>) => void
  renderItem?: (item: Item<ItemValue>) => ReactNode
  filterItem?: (item: Item<ItemValue>, query: string) => boolean
  onFocus?: any
  onBlur?: any
}

export default function Select<
  ItemValue = unknown,
  IsMultiple extends boolean = false
>({
  className,
  label,
  postscript,
  error,
  placeholder,
  multiple: isMultiple,
  clearable: isClearable,
  inputtable: isInputtable,
  withConfirmation: isWithConfirmation,
  longPopover: isLongPopover,
  items = [],
  value: baseValue,
  onChange: baseOnChange,
  renderItem,
  filterItem,
  onFocus,
  onBlur,
}: Props<ItemValue, IsMultiple>) {
  // TODO: ref - for react hook form
  // TODO: accessabilty, semantic
  // TODO: add extra method to transform value for input
  // TODO: improve user experience (text in input, clise select - all values quckly changes)
  // TODO: esc, blur after close
  // TODO: after blur input focus on select
  // TODO: rotate chevron icon
  // TODO: not found message
  // TODO: classnames

  const inputContainerRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const itemsRef = useRef<SelectItemsRef>(null)

  const transformBaseValue = (val: Key | Key[] | undefined) =>
    Array.isArray(val) ? val : val === undefined ? [] : [val]

  const { value, setValue, setValue_ } = useControlValue({
    baseValue,
    baseOnChange: baseOnChange as any,
    transformBaseValue,
    transformValue: (val) => (isMultiple ? val : val[0]),
  })

  const [isActive, setIsActive] = useState(false)
  const [query, setQuery] = useState<null | string>(null)

  useEffect(() => {
    if (isActive && !isInputtable) {
      // we need timeout because appearing of items takes a little time
      setTimeout(() => {
        itemsRef.current?.activateCurrentItem()
      }, 0)
    } else if (!isActive && !query !== null) {
      setQuery(null)
    }
  }, [isActive])

  // const shouldFocusAfterDeactivate = useRef(true)
  const shouldFocusAfterDeactivate = useRef(false) // TODO: changed

  useEffectExceptMount(() => {
    if (isInputtable && !isActive && shouldFocusAfterDeactivate.current) {
      inputRef.current?.focus()
    }
  }, [isActive])

  const inputEventHandlers = {
    click: (e: MouseEvent) => {
      if (!isInputtable) return
      if ((e.target as Element).tagName === 'INPUT') {
        setIsActive(true)
      } else {
        setIsActive(!isActive)
      }
    },
    keyDown: (e: KeyboardEvent) => {
      if (!isInputtable) return
      if (e.key === 'Enter') {
        setIsActive(true)
        setTimeout(() => {
          itemsRef.current?.activateCurrentItem()
        }, 0)
      }
    },
    blur: (e: FocusEvent) => {
      if (!isInputtable) return
      if (
        !inputContainerRef.current?.contains(e.relatedTarget) &&
        !itemsRef.current?.html.contains(e.relatedTarget)
      ) {
        shouldFocusAfterDeactivate.current = false
        setIsActive(false)
      }
    },
    focus: () => {
      if (!isInputtable) return
      shouldFocusAfterDeactivate.current = true
    },
  }

  const additionEventHandlers = {
    toggleClick: () => {
      if (isActive) {
        setTimeout(() => {
          inputRef.current?.blur()
        }, 0)
      }
    },
    clearClick: () => {
      setValue([])
      if (!isActive) {
        // TODO: fix
        // we need timeout because withPopover handles click first
        setTimeout(() => {
          setIsActive(false)
        }, 10)
      }
      setTimeout(() => {
        inputRef.current?.blur()
      }, 0)
    },
  }

  const clear = () => {
    setValue([])
    setIsActive(false)
    setTimeout(() => {
      inputRef.current?.blur()
    }, 0)
  }

  const confirm = () => {
    setIsActive(false)
    setTimeout(() => {
      inputRef.current?.blur()
    }, 0)
  }

  const inputValue = useMemo(() => {
    if (query || (isInputtable && isActive)) {
      return query
    } else if (!value.length) {
      return null
    } else if (value.length > 1) {
      return `Выбрано: ${value.length}`
    } else {
      const item = items.find((i) => i.key === value[0])

      if (!item) {
        return null
      } else if (
        typeof item.value === 'number' ||
        typeof item.value === 'string'
      ) {
        return item.value.toString()
      } else {
        return 'Выбрано'
      }
    }
  }, [query, value, items, isActive, isInputtable])

  return (
    <ControlContainer
      className={className}
      label={label}
      postscript={postscript}
      error={error}
    >
      <WithPopover
        className={classNames(styles.withPopover, {
          [styles.inputtable]: isInputtable,
          [styles.error]: !!error,
          [styles.active]: isActive,
        })}
        popoverClassName={classNames(styles.popover, {
          [styles.long]: isLongPopover,
        })}
        reference={
          <div
            ref={inputContainerRef}
            style={{ display: 'contents' }}
            onBlur={inputEventHandlers.blur}
            onFocus={inputEventHandlers.focus}
          >
            <BaseInput
              className={styles.inputContainer}
              inputClassName={styles.input}
              ref={inputRef}
              error={!!error}
              placeholder={placeholder}
              blocked={!isInputtable}
              value={inputValue}
              onChange={setQuery}
              onKeyDown={inputEventHandlers.keyDown}
              onClick={inputEventHandlers.click}
              postfix={
                <Sandwich
                  items={[
                    {
                      isActive: !isClearable || !value.length,
                      value: (
                        <BaseButton
                          onClick={additionEventHandlers.toggleClick}
                          hoverable
                        >
                          <Icon
                            className={classNames(styles.chevronIcon, {
                              [styles.active]: isActive,
                            })}
                            icon="chevronDown"
                          />
                        </BaseButton>
                      ),
                    },
                    {
                      isActive: !!isClearable && !!value.length,
                      value: (
                        <BaseButton
                          onClick={additionEventHandlers.clearClick}
                          stopPropagation
                          hoverable
                        >
                          <Icon icon="times" />
                        </BaseButton>
                      ),
                    },
                  ]}
                />
              }
            />
          </div>
        }
        popover={
          <SelectItems
            ref={itemsRef}
            value={value}
            setValue={setValue}
            setIsActive={setIsActive}
            query={query}
            items={items}
            filterItem={filterItem}
            renderItem={renderItem}
            inputtable={isInputtable}
            multiple={isMultiple}
            withConfirmation={isWithConfirmation}
            onConfirm={confirm}
            onClear={clear}
          />
        }
        isActive={isActive}
        setIsActive={setIsActive}
        notInteractive={isInputtable}
      />
    </ControlContainer>
  )
}
