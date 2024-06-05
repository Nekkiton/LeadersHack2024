import { useCurUser } from '@/api/users'
import { Routes } from '@/config/routes'
import Link from 'next/link'
import Icon from '@/components/ui/Icon'
import Image from '@/components/ui/Image'
import BaseButton from '@/components/ui/BaseButton'
import Button from '@/components/ui/Button'
import UserMenu from './UserMenu'
import logoImg from '@/assets/images/logo.png'
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
            <BaseButton hoverable>
              <Icon icon="bell" />
            </BaseButton>
            <UserMenu user={user.value} />
          </div>
        ) : (
          <Button type="primary" href={Routes.login}>
            <span>Войти</span>
            <Icon icon="login" />
          </Button>
        )}
      </div>
    </div>
  )
}
