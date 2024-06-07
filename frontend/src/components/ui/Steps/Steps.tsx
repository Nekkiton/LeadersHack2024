import { Key, ReactNode } from 'react'
import classNames from 'classnames'
import styles from './Steps.module.scss'

interface Props {
  className?: string
  items?: { key: Key; value: ReactNode }[]
  activeKey: Key
}

export default function Steps({ className, items = [], activeKey }: Props) {
  return (
    <div className={classNames(className, styles.container)}>
      {items.map(({ key, value }) => (
        <div
          className={classNames(styles.item, {
            [styles.active]: key === activeKey,
          })}
          key={key}
        >
          <span className={styles.itemMark} />
          <div className={styles.itemContent}>{value}</div>
        </div>
      ))}
    </div>
  )
}
