import HomeIntro from './HomeIntro'
import HomeOnboarding from './HomeOnboarding'
import styles from './Home.module.scss'

export default function Home() {
  return (
    <div className={styles.container}>
      <HomeIntro />
      <HomeOnboarding />
    </div>
  )
}
