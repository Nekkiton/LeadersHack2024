import { useCurUser } from '@/api/users'
import { Routes } from '@/config/routes'
import { getUserName } from '@/lib/get-user-name'
import { Role } from '@/types/entities/user'
import Link from 'next/link'
import Icon from '@/components/ui/Icon'
import Image from '@/components/ui/Image'
import BaseButton from '@/components/ui/BaseButton'
import Button from '@/components/ui/Button'
import logoImg from '@/assets/images/logo.png'
import userImg from '@/assets/images/user.png'
import styles from './Header.module.scss'

export default function Header() {
  const user = useCurUser()

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <Link href={Routes.home}>
          <Image className={styles.logo} src={logoImg} />
        </Link>
        {user.status === 'success' && user.value ? (
          <div className={styles.menu}>
            <BaseButton className={styles.desktop} hoverable>
              <Icon icon="bell" />
            </BaseButton>
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
                src={user.value.photo ?? userImg}
                width={58}
                height={58}
                alt={getUserName(user.value, 'Name Surname')}
              />
              <p>{getUserName(user.value, 'Name S.')}</p>
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
