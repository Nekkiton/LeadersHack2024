import classNames from 'classnames'
import Icon from '@/components/ui/Icon'
import styles from './Spinner.module.scss'

interface Props {
  className?: string
}

export default function Spinner({ className }: Props) {
  return (
    <Icon className={classNames(styles.spinner, className)} icon="loader" />
  )
}
