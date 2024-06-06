import { ReactNode } from 'react'
import { useRouter } from 'next/router'
import { Routes } from '@/config/routes'
import { useCurUser } from '@/api/users'
import classNames from 'classnames'
import Link from 'next/link'
import Icon from '@/components/ui/Icon'
import Button from '@/components/ui/Button'
import styles from './SidebarMenuLayout.module.scss'
import { Role } from '@/types/entities/user'

interface Props {
  children?: ReactNode
}

export default function SidebarMenuLayout({ children }: Props) {
  const router = useRouter()

  const user = useCurUser()

  const links = {
    [Role.Recruiter]: [
      {
        name: 'Главная',
        url: Routes.recruiterHome,
        icon: <Icon icon="house" />,
      },
      {
        name: 'Вакансии',
        url: Routes.recruiterVacancies,
        icon: <Icon icon="documentCheck" />,
      },
    ],
  }

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        {user.status === 'success' &&
          user.value &&
          links[user.value.role]?.map((link, idx) => (
            <Link
              className={classNames(styles.sidebarLink, {
                [styles.active]: router.pathname === link.url,
              })}
              key={idx + link.name}
              href={link.url}
            >
              {link.icon}
              <span>{link.name}</span>
            </Link>
          ))}
      </div>
      <div className={styles.main}>
        {children}
        <Button
          className={styles.mainFooter}
          type="text"
          href={Routes.privacy}
          target="_blank"
        >
          Политика обработки персональных данных
        </Button>
      </div>
    </div>
  )
}
