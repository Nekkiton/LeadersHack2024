import { ReactNode } from 'react'
import classNames from 'classnames'
import styles from './Sandwich.module.scss'

interface Props {
  items?: {
    isActive: boolean
    value: ReactNode
  }[]
}

/**
 * Items places on top of each other. One of them is active (showed), other - not active (hidden)
 */
export default function Sandwich({ items }: Props) {
  if (!items) return null

  return (
    <div className={styles.container}>
      {items.map((item, idx) => (
        <div
          className={classNames(styles.item, {
            [styles.active]: item.isActive,
          })}
          key={idx}
        >
          {item.value}
        </div>
      ))}
    </div>
  )
}
