import { ReactNode, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useCurUser } from '@/api/users'
import { Role } from '@/types/entities/user'
import { Routes } from '@/config/routes'
import { useToasts } from '@/lib/use-toasts'
import { useRefreshAuth } from '@/api/auth'
import Spinner from '@/components/ui/Spinner'
import styles from './PermissionManager.module.scss'

interface Props {
  permission?: 'auth' | Role
  children: ReactNode
}

export default function PermissionManager({ permission, children }: Props) {
  const router = useRouter()
  const toasts = useToasts()

  const user = useCurUser({ enabled: !!permission })

  const { mutate: refreshAuth } = useRefreshAuth({ handleError: false })

  useEffect(() => {
    refreshAuth(0)
  }, [])

  useEffect(() => {
    if (
      permission &&
      user.status === 'success' &&
      user.value &&
      !user.value.name &&
      router.pathname !== Routes.candidateProfile &&
      router.pathname !== Routes.recruiterProfile
    ) {
      toasts.info({ content: 'Заполните профиль' })
      router.replace(
        {
          [Role.Candidate]: Routes.candidateProfile,
          [Role.Recruiter]: Routes.recruiterProfile,
        }[user.value.role]
      )
    }
  }, [user.status, router.pathname])

  const loader = (
    <div className={styles.loading}>
      <Spinner />
    </div>
  )

  if (permission) {
    if (user.status === 'success') {
      if (!user.value) {
        router.replace(Routes.login)
        return loader
      } else if (
        Object.values(Role).includes(permission as any) &&
        permission !== user.value.role
      ) {
        router.replace(Routes.home)
        return loader
      } else if (
        !user.value.name &&
        router.pathname !== Routes.candidateProfile &&
        router.pathname !== Routes.recruiterProfile
      ) {
        return loader
      }
    } else {
      return loader
    }
  }

  return children
}
