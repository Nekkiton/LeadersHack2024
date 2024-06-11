import { Candidate } from '@/types/entities/candidate'
import Link from 'next/link'
import Icon from '@/components/ui/Icon'
import styles from './CandidateMain.module.scss'
import moment from 'moment'

interface Props {
  candidate: Candidate
}

export default function CandidateMain({ candidate }: Props) {
  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <div className={styles.cardsRow}>
          <div className={styles.card}>
            <p className={styles.cardTitle}>Контакты</p>
            <Link
              className={styles.fieldWithIcon}
              href={`tel:${candidate.phone}`}
            >
              <Icon icon="phone" />
              <span>{candidate.phone}</span>
            </Link>
            <Link
              className={styles.fieldWithIcon}
              href={`mailto:${candidate.email}`}
            >
              <Icon icon="mail" />
              <span>{candidate.email}</span>
            </Link>
            {candidate.telegram && (
              <Link href={`https://t.me/${candidate.telegram}`} target="_blank">
                <Icon icon="telegram" />
              </Link>
            )}
          </div>
          <div className={styles.card}>
            <p className={styles.cardTitle}>Ключевые навыки</p>
            <div className={styles.tags}>
              {candidate.skills?.map((skill) => (
                <span className={styles.tag} key={skill}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className={styles.cardsRow}>
          <div className={styles.card}>
            <p className={styles.cardTitle}>Образование</p>
            <p>TODO</p>
          </div>
          <div className={styles.card}>
            <p className={styles.cardTitle}>График работы</p>
            <p>TODO</p>
          </div>
          <div className={styles.card}>
            <p className={styles.cardTitle}>Формат работы</p>
            <p>TODO</p>
          </div>
          <div className={styles.card}>
            <p className={styles.cardTitle}>Стаж работы</p>
            <p>TODO</p>
          </div>
        </div>
        {!!candidate.work_history?.length && (
          <div className={styles.card}>
            <p className={styles.cardTitle}>Опыт работы</p>
            {candidate.work_history.map((work, idx) => (
              <div className={styles.work} key={idx}>
                <p className={styles.workDate}>
                  {moment(work.start_date).format('MMMM YYYY')} —{' '}
                  {work.end_date
                    ? moment(work.end_date).format('MMMM YYYY')
                    : 'по н.в.'}
                </p>
                <div className={styles.workJobContainer}>
                  <p className={styles.workJobName}>{work.job_title},</p>
                  <p>{work.company}</p>
                </div>
                <div>
                  <p>Задачи:</p>
                  <div className={styles.workTasks}>{work.responsabilites}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className={styles.sidebar}>
        <h6>История откликов</h6>
        coming soon
      </div>
    </div>
  )
}
