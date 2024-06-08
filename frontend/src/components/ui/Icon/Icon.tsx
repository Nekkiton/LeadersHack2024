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
const FileFilledIcon = dynamic(() => import('@/assets/icons/file-filled.svg'))
const ChevronDownIcon = dynamic(() => import('@/assets/icons/chevron-down.svg'))
const ChevronUpIcon = dynamic(() => import('@/assets/icons/chevron-up.svg'))
const ChevronLeftIcon = dynamic(() => import('@/assets/icons/chevron-left.svg'))
const ChevronRightIcon = dynamic(
  () => import('@/assets/icons/chevron-right.svg')
)
const LoginIcon = dynamic(() => import('@/assets/icons/login.svg'))
const LogoutIcon = dynamic(() => import('@/assets/icons/logout.svg'))
const BellIcon = dynamic(() => import('@/assets/icons/bell.svg'))
const UserIcon = dynamic(() => import('@/assets/icons/user.svg'))
const UsersIcon = dynamic(() => import('@/assets/icons/users.svg'))
const MessageSentIcon = dynamic(() => import('@/assets/icons/message-sent.svg'))
const HouseIcon = dynamic(() => import('@/assets/icons/house.svg'))
const PenIcon = dynamic(() => import('@/assets/icons/pen.svg'))
const PlusIcon = dynamic(() => import('@/assets/icons/plus.svg'))
const MinusIcon = dynamic(() => import('@/assets/icons/minus.svg'))
const DocumentLoupeIcon = dynamic(
  () => import('@/assets/icons/document-loupe.svg')
)
const DocumentCheckIcon = dynamic(
  () => import('@/assets/icons/document-check.svg')
)
const LoupeIcon = dynamic(() => import('@/assets/icons/loupe.svg'))
const MoreHIcon = dynamic(() => import('@/assets/icons/more-h.svg'))
const LinkExternalIcon = dynamic(
  () => import('@/assets/icons/link-external.svg')
)
const TrashIcon = dynamic(() => import('@/assets/icons/trash.svg'))
const QuestionIcon = dynamic(() => import('@/assets/icons/question.svg'))
const CopyIcon = dynamic(() => import('@/assets/icons/copy.svg'))
const TelegramIcon = dynamic(() => import('@/assets/icons/telegram.svg'))

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
    | 'fileFilled'
    | 'chevronDown'
    | 'chevronUp'
    | 'chevronLeft'
    | 'chevronRight'
    | 'login'
    | 'logout'
    | 'bell'
    | 'user'
    | 'users'
    | 'messageSent'
    | 'house'
    | 'pen'
    | 'plus'
    | 'minus'
    | 'documentLoupe'
    | 'documentCheck'
    | 'loupe'
    | 'moreH'
    | 'linkExternal'
    | 'trash'
    | 'question'
    | 'copy'
    | 'telegram'
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
      case 'fileFilled':
        return FileFilledIcon
      case 'chevronDown':
        return ChevronDownIcon
      case 'chevronUp':
        return ChevronUpIcon
      case 'chevronLeft':
        return ChevronLeftIcon
      case 'chevronRight':
        return ChevronRightIcon
      case 'login':
        return LoginIcon
      case 'logout':
        return LogoutIcon
      case 'bell':
        return BellIcon
      case 'user':
        return UserIcon
      case 'users':
        return UsersIcon
      case 'messageSent':
        return MessageSentIcon
      case 'house':
        return HouseIcon
      case 'pen':
        return PenIcon
      case 'plus':
        return PlusIcon
      case 'minus':
        return MinusIcon
      case 'documentLoupe':
        return DocumentLoupeIcon
      case 'documentCheck':
        return DocumentCheckIcon
      case 'loupe':
        return LoupeIcon
      case 'moreH':
        return MoreHIcon
      case 'linkExternal':
        return LinkExternalIcon
      case 'trash':
        return TrashIcon
      case 'question':
        return QuestionIcon
      case 'copy':
        return CopyIcon
      case 'telegram':
        return TelegramIcon
    }
  }, [icon])

  return (
    <div
      className={classNames(styles.container, className, 'icon', {
        [styles.pure]: icon === 'telegram',
      })}
    >
      <Icon />
    </div>
  )
}
