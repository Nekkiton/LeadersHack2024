import { Candidate } from '@/types/entities/candidate'
import { getUserName } from '@/lib/get-user-name'
import { getUserAge } from '@/lib/get-user-age'
import classNames from 'classnames'
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
            <p className={styles.light}>{candidate.job_title}</p>
            <p className={styles.light}>
              {getUserAge(candidate.birthday)}, {candidate.city}
            </p>
            <p className={styles.light}>TODO</p>
          </div>
        </div>
      </div>
      <div className={styles.block}>
        <div className={styles.blockTitleContainer}>
          <h6>Опыт работы</h6>
          <span>2 ujlf 1 vesx</span>
        </div>
        <div className={styles.blockContent}>
          <p className={styles.light}>Последнее место работы</p>
          <p>TODO</p>
          <p>TODO</p>
        </div>
      </div>
      <div className={styles.block}>
        <h6>Контакты</h6>
        <div className={styles.blockContent}>
          <p>{candidate.phone}</p>
          <Link
            className={styles.email}
            href={`mailto:${candidate.email}`}
            target="_blank"
          >
            {candidate.email}
          </Link>
          {candidate.telegram && (
            <Link href={`https://t.me/${candidate.telegram}`} target="_blank">
              <Icon icon="telegram" />
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
