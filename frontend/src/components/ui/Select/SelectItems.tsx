import {
  ForwardedRef,
  Key,
  KeyboardEvent,
  KeyboardEventHandler,
  ReactNode,
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'
import classNames from 'classnames'
import Icon from '@/components/ui/Icon'
import Button from '@/components/ui/Button'
import styles from './Select.module.scss'

export interface Item {
  key: Key
  value: any
}

export interface SelectItemsRef {
  html: HTMLDivElement
  activateCurrentItem: () => void
  activateNextItem: () => void
  activatePrevItem: () => void
}

interface Props {
  value: Key[]
  setValue: (val: Key[]) => void
  setIsActive: (val: boolean) => void
  query: string | null
  items: Item[]
  filterItem?: (item: Item, query: string) => boolean
  renderItem?: (item: Item) => ReactNode
  inputtable?: boolean
  multiple?: boolean
  withConfirmation?: boolean
  onConfirm?: () => void
  onClear?: () => void
}

const SelectItems = (
  {
    value,
    setValue,
    setIsActive,
    query,
    items,
    filterItem,
    renderItem,
    inputtable: isInputtable,
    multiple: isMultiple,
    withConfirmation: isWithConfirmation,
    onConfirm,
    onClear,
  }: Props,
  forwardedRef: ForwardedRef<SelectItemsRef>
) => {
  const containerRef = useRef<HTMLDivElement | null>(null)

  const [activeItemIdx, setActiveItemIdx] = useState(0)

  const activateCurrentItem = () => {
    const items = containerRef.current?.firstElementChild?.children
    if (!items) return
    setActiveItemIdx(0)
    ;(items[0] as HTMLElement | undefined)?.focus({})
  }

  const activateNextItem = () => {
    const items = containerRef.current?.firstElementChild?.children
    if (!items) return

    if (activeItemIdx === items.length - 1) {
      setActiveItemIdx(0)
      ;(items[0] as HTMLElement).focus()
    } else {
      setActiveItemIdx(activeItemIdx + 1)
      ;(items[activeItemIdx + 1] as HTMLElement).focus()
    }
  }

  const activatePrevItem = () => {
    const items = containerRef.current?.firstElementChild?.children
    if (!items) return

    if (activeItemIdx === 0) {
      setActiveItemIdx(items.length - 1)
      ;(items[items.length - 1] as HTMLElement).focus()
    } else {
      setActiveItemIdx(activeItemIdx - 1)
      ;(items[activeItemIdx - 1] as HTMLElement).focus()
    }
  }

  const toggleItem = (item: Item) => {
    if (isMultiple) {
      const idx = value.indexOf(item.key)
      if (idx === -1) {
        setValue([...value, item.key])
      } else {
        setValue([...value.slice(0, idx), ...value.slice(idx + 1)])
      }
    } else {
      if (value.includes(item.key)) {
        setValue([])
      } else {
        setValue([item.key])
      }
      setIsActive(false)
    }
  }

  const onKeyDown: KeyboardEventHandler = (e) => {
    if (e.code === 'ArrowDown') {
      e.preventDefault()
      activateNextItem()
    } else if (e.code === 'ArrowUp') {
      e.preventDefault()
      activatePrevItem()
    }
  }

  const itemEventHandlers = {
    click: (item: Item) => toggleItem(item),
    keydown: (e: KeyboardEvent, item: Item) => {
      if (e.key === 'Enter') {
        toggleItem(item)
      } else if (e.key === ' ') {
        toggleItem(item)
        e.preventDefault()
      }
    },
  }

  useImperativeHandle(forwardedRef, () => ({
    html: containerRef.current!,
    activateCurrentItem,
    activateNextItem,
    activatePrevItem,
  }))

  const filteredItems = useMemo(() => {
    return items.filter(
      (item) =>
        !isInputtable ||
        query === null ||
        (filterItem?.(item, query) ??
          item.value?.toString().toLowerCase().includes(query.toLowerCase()))
    )
  }, [items, isInputtable, query, filterItem])

  return (
    <div
      className={styles.itemsContainer}
      ref={containerRef}
      onKeyDown={onKeyDown}
      tabIndex={-1}
    >
      <div className={styles.items}>
        {!filteredItems.length ? (
          <p className={styles.itemsNothing}>Ничего не найдено</p>
        ) : (
          filteredItems.map((item) => (
            <div
              className={classNames(styles.item, {
                [styles.active]: value.includes(item.key),
              })}
              key={item.key}
              tabIndex={-1}
              onClick={() => itemEventHandlers.click(item)}
              onKeyDown={(e) => itemEventHandlers.keydown(e, item)}
            >
              {renderItem?.(item) ?? String(item.value)}
              <Icon className={styles.itemIcon} icon="check" />
            </div>
          ))
        )}
      </div>
      {isWithConfirmation && (
        <div className={styles.itemsControls}>
          <Button type="text" onClick={onClear}>
            Сбросить
          </Button>
          <Button type="primary" onClick={onConfirm}>
            Применить
          </Button>
        </div>
      )}
    </div>
  )
}

export default forwardRef(SelectItems)
