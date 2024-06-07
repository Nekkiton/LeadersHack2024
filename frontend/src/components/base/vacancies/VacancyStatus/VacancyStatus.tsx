import {
  VacancyStatus as IVacancyStatus,
  VacancyStatuses,
} from '@/types/entities/vacancy'
import classNames from 'classnames'
import styles from './VacancyStatus.module.scss'

interface Props {
  className?: string
  status: IVacancyStatus
}

export default function VacancyStatus({ className, status }: Props) {
  return (
    <div
      className={classNames(
        className,
        styles.container,
        styles[VacancyStatuses[status].color]
      )}
    >
      <span className={styles.mark} />
      <span>{VacancyStatuses[status].title}</span>
    </div>
  )
}
