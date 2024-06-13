import { useState } from 'react'
import Button from '@/components/ui/Button'
import Icon from '@/components/ui/Icon'
import ChangePasswordModal from '@/components/base/ChangePasswordModal'
import styles from './CandidateProfilePassword.module.scss'

export default function CandidateProfilePassword() {
  const [isPasswordModalShowed, setIsPasswordModalShowed] = useState(false)

  return (
    <>
      <div className={styles.container}>
        <div className={styles.main}>
          <h3>Пароль</h3>
          <p className={styles.mainHint}>Не менялся</p>
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
