import { Vacancy } from '@/types/entities/vacancy'
import styles from './VacancyCardInfo.module.scss'
import { getVacancySalary } from '@/lib/get-vacancy-salary'

interface Props {
  vacancy: Vacancy
}

export default function VacancyCardInfo({ vacancy }: Props) {
  return (
    <div className={styles.vacancyInfo}>
      <p className={styles.vacancyName}>{vacancy.title}</p>
      <div className={styles.vacancyInfoKeys}>
        <span>{vacancy.work_experience}</span>
        <span>{vacancy.work_type}</span>
        <span>{vacancy.work_schedule}</span>
        <span>{getVacancySalary(vacancy)}</span>
      </div>
    </div>
  )
}
