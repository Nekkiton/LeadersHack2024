import { Vacancy, VacancyStatuses } from '@/types/entities/vacancy'
import classNames from 'classnames'
import styles from './VacancyStatus.module.scss'

interface Props {
  className?: string
  vacancy: Vacancy
}

export default function VacancyStatus({ className, vacancy }: Props) {
  return (
    <div
      className={classNames(
        className,
        styles.container,
        styles[VacancyStatuses[vacancy.status].color]
      )}
    >
      <span className={styles.mark} />
      <span>{VacancyStatuses[vacancy.status].title}</span>
    </div>
  )
}
