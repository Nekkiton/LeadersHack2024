import { RemoteData } from '@/types/remote-data'
import { AxiosError } from 'axios'
import { useCurUser } from '@/api/users'
import { Routes } from '@/config/routes'
import { getUserName } from '@/lib/get-user-name'
import { BaseUser, Role, User } from '@/types/entities/user'
import Link from 'next/link'
import Icon from '@/components/ui/Icon'
import Image from '@/components/ui/Image'
import Button from '@/components/ui/Button'
import HeaderNotifications from './HeaderNotifications'
import logoImg from '@/assets/images/logo.png'
import userImg from '@/assets/images/user.png'
import styles from './Header.module.scss'

export default function Header() {
  const user: RemoteData<User | BaseUser | null, AxiosError> = useCurUser()

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <Link href={Routes.home}>
          <Image className={styles.logo} src={logoImg} />
        </Link>
        {user.status === 'success' && user.value ? (
          <div className={styles.menu}>
            <HeaderNotifications />
            <Link
              className={styles.user}
              href={
                {
                  [Role.Recruiter]: Routes.recruiterVacancies,
                  [Role.Candidate]: Routes.candidateVacancies,
                }[user.value.role]
              }
            >
              <Image
                className={styles.userAvatar}
                src={(user.value.name ? user.value.image : null) ?? userImg}
                width={58}
                height={58}
              />
              <p>
                {user.value.name
                  ? getUserName(user.value, 'Name S.')
                  : user.value.email}
              </p>
            </Link>
          </div>
        ) : (
          <Button type="primary" href={Routes.login}>
            <span className={styles.desktop}>Войти</span>
            <Icon icon="login" />
          </Button>
        )}
      </div>
    </div>
  )
}
