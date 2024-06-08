import { Key, ReactNode, useEffect, useRef } from 'react'
import { useControlValue } from '@/lib/use-control-value'
import classNames from 'classnames'
import BaseButton from '@/components/ui/BaseButton'
import styles from './TabsLine.module.scss'

interface Props<Value extends Key> {
  items: {
    key: Key
    value: ReactNode
  }[]
  value?: Value
  onChange?: (val: Value) => void
}

export default function TabsLine<Value extends Key = Key>({
  items,
  value: baseValue,
  onChange: baseOnChange,
}: Props<Value>) {
  const { value, setValue } = useControlValue({
    baseValue,
    baseOnChange,
    transformBaseValue: (val) =>
      val ?? items[0].key ?? new Error('Items cannot be empty'),
    transformValue: (val) => val as Value,
  })

  const containerRef = useRef<HTMLDivElement | null>(null)
  const activeBgRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const itemEl = containerRef.current?.querySelector(`[data-key="${value}"]`)
    if (itemEl && activeBgRef.current) {
      activeBgRef.current.style.left = `${(itemEl as HTMLElement).offsetLeft}px`
      activeBgRef.current.style.width = `${
        (itemEl as HTMLElement).offsetWidth
      }px`
    }
  }, [value])

  return (
    <div className={styles.container} ref={containerRef}>
      <span className={styles.activeBg} ref={activeBgRef} />
      {items.map((item) => (
        <div key={item.key} data-key={item.key}>
          <BaseButton onClick={() => setValue(item.key)}>
            {item.value}
          </BaseButton>
        </div>
      ))}
    </div>
  )
}
