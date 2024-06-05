import { ReactNode } from 'react'
import { useRouter } from 'next/router'
import { Routes } from '@/config/routes'
import classNames from 'classnames'
import Link from 'next/link'
import Icon from '@/components/ui/Icon'
import Button from '@/components/ui/Button'
import styles from './SidebarMenuLayout.module.scss'

interface Props {
  // links?: {
  //   name: string
  //   icon: ReactNode
  //   url: string
  // }[]
  children?: ReactNode
}

export default function SidebarMenuLayout({ children }: Props) {
  const router = useRouter()

  // TODO: links
  const links = [
    {
      name: 'Главная',
      url: Routes.home,
      icon: <Icon icon="house" />,
    },
  ]

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        {links?.map((link, idx) => (
          <Link
            className={classNames(styles.sidebarLink, {
              [styles.active]: router.pathname === link.url,
            })}
            key={idx + link.name}
            href={link.url}
          >
            {link.icon}
            <span className={styles.sidebarLinkName}>{link.name}</span>
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
