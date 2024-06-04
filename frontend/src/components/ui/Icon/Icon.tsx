import { useMemo } from 'react'
import classNames from 'classnames'
import dynamic from 'next/dynamic'
import styles from './Icon.module.scss'

const TimesIcon = dynamic(() => import('@/assets/icons/times.svg'))
const CheckIcon = dynamic(() => import('@/assets/icons/check.svg'))
const LoaderIcon = dynamic(() => import('@/assets/icons/loader.svg'))
const EyeIcon = dynamic(() => import('@/assets/icons/eye.svg'))
const EyeOffIcon = dynamic(() => import('@/assets/icons/eye-off.svg'))
const BoxIcon = dynamic(() => import('@/assets/icons/box.svg'))
const FileIcon = dynamic(() => import('@/assets/icons/file.svg'))

interface Props {
  className?: string
  icon: 'times' | 'check' | 'loader' | 'eye' | 'eye-off' | 'box' | 'file'
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
      case 'eye':
        return EyeIcon
      case 'eye-off':
        return EyeOffIcon
      case 'box':
        return BoxIcon
      case 'file':
        return FileIcon
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
