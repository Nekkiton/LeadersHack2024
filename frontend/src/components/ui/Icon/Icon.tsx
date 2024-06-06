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
const ChevronDownIcon = dynamic(() => import('@/assets/icons/chevron-down.svg'))
const ChevronLeftIcon = dynamic(() => import('@/assets/icons/chevron-left.svg'))
const LoginIcon = dynamic(() => import('@/assets/icons/login.svg'))
const LogoutIcon = dynamic(() => import('@/assets/icons/logout.svg'))
const BellIcon = dynamic(() => import('@/assets/icons/bell.svg'))
const UserIcon = dynamic(() => import('@/assets/icons/user.svg'))
const MessageSentIcon = dynamic(() => import('@/assets/icons/message-sent.svg'))
const HouseIcon = dynamic(() => import('@/assets/icons/house.svg'))
const PenIcon = dynamic(() => import('@/assets/icons/pen.svg'))
const PlusIcon = dynamic(() => import('@/assets/icons/plus.svg'))
const DocumentLoupe = dynamic(() => import('@/assets/icons/document-loupe.svg'))
const DocumentCheck = dynamic(() => import('@/assets/icons/document-check.svg'))

interface Props {
  className?: string
  icon:
    | 'times'
    | 'check'
    | 'loader'
    | 'eye'
    | 'eyeOff'
    | 'box'
    | 'file'
    | 'chevronDown'
    | 'chevronLeft'
    | 'login'
    | 'logout'
    | 'bell'
    | 'user'
    | 'messageSent'
    | 'house'
    | 'pen'
    | 'plus'
    | 'documentLoupe'
    | 'documentCheck'
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
      case 'eyeOff':
        return EyeOffIcon
      case 'box':
        return BoxIcon
      case 'file':
        return FileIcon
      case 'chevronDown':
        return ChevronDownIcon
      case 'chevronLeft':
        return ChevronLeftIcon
      case 'login':
        return LoginIcon
      case 'logout':
        return LogoutIcon
      case 'bell':
        return BellIcon
      case 'user':
        return UserIcon
      case 'messageSent':
        return MessageSentIcon
      case 'house':
        return HouseIcon
      case 'pen':
        return PenIcon
      case 'plus':
        return PlusIcon
      case 'documentLoupe':
        return DocumentLoupe
      case 'documentCheck':
        return DocumentCheck
    }
  }, [icon])

  return (
    <div className={classNames(styles.container, className, 'icon')}>
      <Icon />
    </div>
  )
}
