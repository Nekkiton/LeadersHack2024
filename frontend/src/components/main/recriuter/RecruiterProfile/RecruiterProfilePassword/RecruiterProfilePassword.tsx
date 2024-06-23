import { useState } from 'react'
import { BaseUser, User } from '@/types/entities/user'
import moment from 'moment-timezone'
import Button from '@/components/ui/Button'
import Icon from '@/components/ui/Icon'
import ChangePasswordModal from '@/components/base/ChangePasswordModal'
import styles from './RecruiterProfilePassword.module.scss'

interface Props {
  user: BaseUser | User
}

export default function RecruiterProfilePassword({ user }: Props) {
  const [isPasswordModalShowed, setIsPasswordModalShowed] = useState(false)

  return (
    <>
      <div className={styles.container}>
        <div className={styles.main}>
          <h3>Пароль</h3>
          <p className={styles.mainHint}>
            {user.password_changed_at
              ? moment(`${user.password_changed_at}Z`).format(
                  'Изменен DD.MM.YYYY'
                )
              : 'Не менялся'}
          </p>
        </div>
        <Button type="text" onClick={() => setIsPasswordModalShowed(true)}>
          <Icon icon="pen" />
          <span>Изменить пароль</span>
        </Button>
      </div>

      <ChangePasswordModal
        isShowed={isPasswordModalShowed}
        setIsShowed={setIsPasswordModalShowed}
      />
    </>
  )
}
