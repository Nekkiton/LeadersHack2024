import { ReactNode } from 'react'
import styles from './AuthLayout.module.scss'

interface Props {
  children?: ReactNode
}

export default function AuthLayout({ children }: Props) {
  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <p className={styles.sidebarSibtitle}>АККРЕДИТОВАННАЯ ИТ-КОМПАНИЯ</p>
        <h1>Команда. Технологии. Драйв</h1>
        <p className={styles.sidebarHint}>
          Мы помогаем ИТ-специалистам преумножать таланты и строить карьерув
          компании профессионалов. Создаем условия работы, вдохновляющие на
          развитие
        </p>
      </div>
      <div className={styles.main}>{children}</div>
    </div>
  )
}
