import { Vacancy } from '@/types/entities/vacancy'
import { getUserName } from '@/lib/get-user-name'
import { getVacancySalary } from '@/lib/get-vacancy-salary'
import { Role } from '@/types/entities/user'
import moment from 'moment'
import classNames from 'classnames'
import Button from '@/components/ui/Button'
import Image from '@/components/ui/Image'
import VacancyStatus from '@/components/base/vacancies/VacancyStatus'
import RadialProgressBar from '@/components/ui/RadialProgressBar'
import userImg from '@/assets/images/user.png'
import styles from './VacancyCard.module.scss'

interface Props {
  className?: string
  vacancy: Vacancy
  role: Role
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
        <span className={styles.headerTag}>{vacancy.scope_id}</span>
      </div>

      <div className={styles.main}>
        <div className={styles.vacancyInfo}>
          <p>{vacancy.title}</p>
          <div className={styles.vacancyInfoKeys}>
            <span>TODO</span>
            <span>TODO</span>
            <span>TODO</span>
            <span>{getVacancySalary(vacancy)}</span>
          </div>
        </div>
        {role === Role.Recruiter && vacancy.recruiter && (
          <div className={styles.user}>
            <Image
              className={styles.userImg}
              src={vacancy.recruiter.photo ?? userImg}
              width={100}
              height={100}
            />
            <div>
              <p>{getUserName(vacancy.recruiter, 'Name Surname')}</p>
              <p className={styles.userHint}>TODO</p>
            </div>
          </div>
        )}
      </div>

      {role === Role.Recruiter && vacancy.responses && (
        <>
          <span className={styles.separator} />
          <Button type="text">Откликов: {vacancy.responses.length}</Button>
        </>
      )}
    </div>
  )
}
