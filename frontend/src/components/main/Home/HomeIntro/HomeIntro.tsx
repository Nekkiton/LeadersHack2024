import styles from './HomeIntro.module.scss'

export default function HomeIntro() {
  return (
    <div className={styles.container}>
      <p className={styles.subtitle}>ВАКАНСИИ</p>
      <h1 className={styles.title}>Найди работу мечты</h1>
      <p className={styles.description}>
        Мы создаем условия, где каждый может проявить себя, поддерживаем
        <br />
        стремление постоянно развиваться и помогаем строить карьеру
      </p>
    </div>
  )
}
