import { ReactNode } from 'react'
import { useRouter } from 'next/router'
import { Routes } from '@/config/routes'
import { useCurUser } from '@/api/users'
import { Role } from '@/types/entities/user'
import { useLogout } from '@/api/auth'
import { useToasts } from '@/lib/use-toasts'
import classNames from 'classnames'
import Link from 'next/link'
import Icon from '@/components/ui/Icon'
import Button from '@/components/ui/Button'
import BaseButton from '@/components/ui/BaseButton'
import styles from './SidebarMenuLayout.module.scss'

interface Props {
  children?: ReactNode
}

export default function SidebarMenuLayout({ children }: Props) {
  const router = useRouter()
  const toasts = useToasts()

  const user = useCurUser()

  const { mutate: logout } = useLogout()

  const links = {
    [Role.Recruiter]: [
      {
        name: 'Вакансии',
        url: Routes.recruiterVacancies,
        icon: <Icon icon="documentCheck" />,
        disabled: user.status === 'success' && !user.value?.name,
      },
      {
        name: 'База резюме',
        url: Routes.recruiterCandidates,
        icon: <Icon icon="users" />,
        disabled: user.status === 'success' && !user.value?.name,
      },
      {
        name: 'Новости',
        url: Routes.recruiterNews,
        icon: <Icon icon="fileFilled" />,
        disabled: user.status === 'success' && !user.value?.name,
      },
      {
        name: 'Профиль',
        url: Routes.recruiterProfile,
        icon: <Icon icon="user" />,
      },
    ],
    [Role.Candidate]: [
      {
        name: 'Вакансии для вас',
        url: Routes.candidateVacancies,
        icon: <Icon icon="documentCheck" />,
        disabled: user.status === 'success' && !user.value?.name,
      },
      {
        name: 'Отклики и приглашения',
        url: Routes.candidateResponses,
        icon: <Icon icon="comment" />,
        disabled: user.status === 'success' && !user.value?.name,
      },
      {
        name: 'Профиль',
        url: Routes.candidateProfile,
        icon: <Icon icon="user" />,
      },
    ],
  }

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        {user.status === 'success' && user.value && (
          <>
            {links[user.value.role]?.map((link, idx) => (
              <Link
                className={classNames(styles.sidebarLink, {
                  [styles.active]: router.pathname === link.url,
                  [styles.disabled]: link.disabled,
                })}
                key={idx + link.name}
                href={link.url}
                onClick={(e) => {
                  if (link.disabled) {
                    e.preventDefault()
                    toasts.info({ content: 'Заполните профиль' })
                  }
                }}
              >
                {link.icon}
                <span>{link.name}</span>
              </Link>
            ))}
            <span className={styles.sidebarSeparator} />
            <BaseButton
              className={classNames(
                styles.sidebarLink,
                styles.sidebarLogoutBtn
              )}
              onClick={logout}
            >
              <Icon icon="logout" />
              <span>Выйти</span>
            </BaseButton>
          </>
        )}
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
