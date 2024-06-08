import classNames from 'classnames'
import styles from './RadialProgressBar.module.scss'

interface Props {
  className?: string
  value: number
}

export default function RadialProgressBar({ className, value }: Props) {
  return (
    <div
      className={classNames(className, styles.progressBar, {
        [styles.success]: value > 50,
      })}
      style={{ '--value': value } as any}
    />
  )
}
