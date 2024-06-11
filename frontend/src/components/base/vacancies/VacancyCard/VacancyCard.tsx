import { Vacancy } from '@/types/entities/vacancy'
import { Role } from '@/types/entities/user'
import moment from 'moment'
import classNames from 'classnames'
import Button from '@/components/ui/Button'
import VacancyStatus from '@/components/base/vacancies/VacancyStatus'
import RadialProgressBar from '@/components/ui/RadialProgressBar'
import VacancyCardInfo from '@/components/base/vacancies/VacancyCardInfo'
import styles from './VacancyCard.module.scss'

interface Props {
  className?: string
  vacancy: Vacancy
  role?: Role
}

export default function VacancyCard({ className, vacancy, role }: Props) {
  return (
    <div className={classNames(className, styles.container)}>
      <div className={styles.header}>
        <div className={styles.headerInfo}>
          <p>От {moment('12.05.2012').format('DD MMMM YYYY')}</p>
          {role === Role.Recruiter && <VacancyStatus status={vacancy.status} />}
          {role === Role.Candidate && (
            <div className={styles.headerMatchPercent}>
              <RadialProgressBar value={67} />
              <span>Подходит на 67%</span>
            </div>
          )}
        </div>
        <span className={styles.headerTag}>{vacancy.scope}</span>
      </div>

      <VacancyCardInfo vacancy={vacancy} />

      {role === Role.Recruiter && vacancy.responses && (
        <>
          <span className={styles.separator} />
          <Button type="text">Откликов: {vacancy.responses.length}</Button>
        </>
      )}
    </div>
  )
}
