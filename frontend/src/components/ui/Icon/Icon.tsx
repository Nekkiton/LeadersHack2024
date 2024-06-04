import { useMemo } from 'react'
import classNames from 'classnames'
import dynamic from 'next/dynamic'
import styles from './Icon.module.scss'

const TimesIcon = dynamic(() => import('@/assets/icons/times.svg'))
const CheckIcon = dynamic(() => import('@/assets/icons/check.svg'))
const LoaderIcon = dynamic(() => import('@/assets/icons/loader.svg'))

interface Props {
  className?: string
  icon: 'times' | 'check' | 'loader'
}

export default function Icon({ icon, className }: Props) {
  const Icon = useMemo(() => {
    switch (icon) {
      case 'times':
        return TimesIcon
      case 'check':
        return CheckIcon
      case 'loader':
        return LoaderIcon
      default:
        return null
    }
  }, [icon])

  if (!Icon) {
    return null
  }

  return (
    <div className={classNames(styles.container, className, 'icon')}>
      <Icon />
    </div>
  )
}
