import { useMemo } from 'react'
import { Candidate } from '@/types/entities/candidate'
import { getUserName } from '@/lib/get-user-name'
import { getUserAge } from '@/lib/get-user-age'
import { getUserPhone } from '@/lib/get-user-phone'
import classNames from 'classnames'
import moment from 'moment'
import Link from 'next/link'
import Image from '@/components/ui/Image'
import Icon from '@/components/ui/Icon'
import userImg from '@/assets/images/user.png'
import styles from './CandidateCardInfo.module.scss'

interface Props {
  className?: string
  candidate: Candidate
}

export default function CandidateCardInfo({ className, candidate }: Props) {
  const lastWork = useMemo(() => candidate.work_history[0] ?? null, [candidate])

  const lastWorkDuration = useMemo(() => {
    if (!lastWork) return
    const duration = moment.duration(
      moment(lastWork.end_date ? `${lastWork.end_date}Z` : undefined).diff(
        moment(`${lastWork.start_date}Z`),
        'months'
      ),
      'months'
    )
    if (!duration.months()) {
      return 'меньше месяца'
    } else {
      return duration.humanize()
    }
  }, [lastWork])

  return (
    <div className={classNames(styles.container, className)}>
      <div className={styles.userImgContainer}>
        <Image
          className={styles.userImg}
          src={candidate.photo ?? userImg}
          width={60}
          height={60}
        />
        <div className={styles.block}>
          <h6>{getUserName(candidate, 'Name Surname')}</h6>
          <div className={styles.blockContent}>
            <p className={styles.light}>{candidate.desired_position}</p>
            {candidate.birthday && (
              <p className={styles.light}>
                {getUserAge(candidate.birthday)}, {candidate.city}
              </p>
            )}
            <p className={styles.light}>
              З/п от {candidate.salary_expectation} ₽
            </p>
          </div>
        </div>
      </div>
      <div className={styles.block}>
        <div className={styles.blockTitleContainer}>
          <h6>Опыт работы</h6>
          <span>{candidate.work_experience}</span>
        </div>
        {lastWork && (
          <div className={styles.blockContent}>
            <p className={styles.light}>Последнее место работы</p>
            <p>
              {lastWork.position}, {lastWork.company}
            </p>
            <p>{lastWorkDuration}</p>
          </div>
        )}
      </div>
      <div className={styles.block}>
        <h6>Контакты</h6>
        <div className={styles.blockContent}>
          <p>{getUserPhone(candidate)}</p>
          <Link
            className={styles.email}
            href={`mailto:${candidate.email}`}
            target="_blank"
          >
            {candidate.email}
          </Link>
          {candidate.telegram.trim() && (
            <Link
              href={`https://t.me/${candidate.telegram.trim()}`}
              target="_blank"
            >
              <Icon icon="telegram" />
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
