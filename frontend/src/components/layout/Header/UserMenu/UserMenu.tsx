import { useState } from 'react'
import classNames from 'classnames'
import { Role, User } from '@/types/entities/user'
import { getUserName } from '@/lib/get-user-name'
import { Routes } from '@/config/routes'
import WithPopover from '@/components/ui/WithPopover'
import Icon from '@/components/ui/Icon'
import Image from '@/components/ui/Image'
import Button from '@/components/ui/Button'
import styles from './UserMenu.module.scss'

interface Props {
  user: User
}

export default function UserMenu({ user }: Props) {
  const [isUserMenuActive, setIsUserMenuActive] = useState(false)

  return (
    <WithPopover
      popoverClassName={styles.menuPopover}
      isActive={isUserMenuActive}
      setIsActive={setIsUserMenuActive}
      reference={
        <div className={styles.user}>
          <Image
            className={styles.userAvatar}
            src={user.avatar}
            width={58}
            height={58}
            alt={getUserName(user, 'Name Surname')}
          />
          <div className={styles.userNameContainer}>
            <p>{getUserName(user, 'Name S.')}</p>
            <Icon
              className={classNames(styles.userMenuIcon, {
                [styles.active]: isUserMenuActive,
              })}
              icon="chevronDown"
            />
          </div>
        </div>
      }
      popover={
        <div className={styles.menu}>
          <Button
            type="text"
            href={{ [Role.Recruiter]: Routes.recruiterProfile }[user.role]}
          >
            <Icon icon="user" />
            <span>Профиль</span>
          </Button>
          <span className={styles.menuSeparator} />
          <Button className={styles.menuLogoutBtn} type="text">
            <Icon className={styles.menuLogoutBtnIcon} icon="logout" />
            <span>Выйти</span>
          </Button>
        </div>
      }
    />
  )
}
