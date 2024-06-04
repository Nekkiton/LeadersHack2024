import { ReactNode } from 'react'
import { useCurUser } from '@/api/users'
import Spinner from '@/components/ui/Spinner'
import styles from './PermissionManager.module.scss'

interface Props {
  permission?: 'auth' | 'role1' | 'role2'
  children: ReactNode
}

export default function PermissionManager({ permission, children }: Props) {
  const user = useCurUser({ enabled: !!permission })

  if (permission) {
    // TODO: error
    if (user.status === 'success') {
      if (!user.value) {
        return 'Need authentication'
      }
    } else {
      // TODO: styles
      return <Spinner />
    }
  }

  return children
}
