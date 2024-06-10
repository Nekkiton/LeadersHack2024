import HomeIntro from './HomeIntro'
import HomeOnboarding from './HomeOnboarding'
import HomeVacancies from './HomeVacancies'
import HomeNews from './HomeNews'
import styles from './Home.module.scss'

export default function Home() {
  return (
    <div className={styles.container}>
      <HomeIntro />
      <HomeOnboarding />
      <HomeVacancies />
      <HomeNews />
    </div>
  )
}
