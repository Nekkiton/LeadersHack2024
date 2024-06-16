import { Candidate } from '@/types/entities/candidate'
import { useCandidateResponses } from '@/api/candidates'
import { Role } from '@/types/entities/user'
import { ResponseStatus } from '@/types/entities/response'
import { getUserPhone } from '@/lib/get-user-phone'
import moment from 'moment'
import Link from 'next/link'
import Icon from '@/components/ui/Icon'
import RemoteData from '@/components/special/RemoteData'
import styles from './CandidateMain.module.scss'

interface Props {
  candidate: Candidate
}

export default function CandidateMain({ candidate }: Props) {
  const responses = useCandidateResponses(candidate._id)

  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <div className={styles.cardsRow}>
          <div className={styles.card}>
            <p className={styles.cardTitle}>Контакты</p>
            <Link
              className={styles.fieldWithIcon}
              href={`tel:${getUserPhone(candidate)}`}
            >
              <Icon icon="phone" />
              <span>{getUserPhone(candidate)}</span>
            </Link>
            <Link
              className={styles.fieldWithIcon}
              href={`mailto:${candidate.email}`}
            >
              <Icon icon="mail" />
              <span>{candidate.email}</span>
            </Link>
            {candidate.telegram.trim() && (
              <Link
                href={`https://t.me/${candidate.telegram.trim()}`}
                target="_blank"
                style={{ alignSelf: 'flex-start' }}
              >
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
            <p>{candidate.education}</p>
          </div>
          <div className={styles.card}>
            <p className={styles.cardTitle}>График работы</p>
            <p>{candidate.work_schedule}</p>
          </div>
          <div className={styles.card}>
            <p className={styles.cardTitle}>Формат работы</p>
            <p>{candidate.work_type}</p>
          </div>
          <div className={styles.card}>
            <p className={styles.cardTitle}>Стаж работы</p>
            <p>{candidate.work_experience}</p>
          </div>
        </div>
        <div className={styles.card}>
          <p className={styles.cardTitle}>Опыт работы</p>
          {candidate.work_history.length ? (
            candidate.work_history.map((work, idx) => (
              <div className={styles.work} key={idx}>
                <p className={styles.workDate}>
                  {moment(`${work.start_date}Z`).format('MMMM YYYY')} —{' '}
                  {work.end_date
                    ? moment(`${work.end_date}Z`).format('MMMM YYYY')
                    : 'по н.в.'}
                </p>
                <div className={styles.workJobContainer}>
                  <p className={styles.workJobName}>{work.position},</p>
                  <p>{work.company}</p>
                </div>
                <div>
                  <p className={styles.workTasksTitle}>Задачи:</p>
                  <div className={styles.workTasks}>
                    {work.responsibilities}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>Не указан</p>
          )}
        </div>
      </div>

      <div className={styles.sidebar}>
        <h6>История откликов</h6>
        <RemoteData
          data={responses}
          renderSuccess={(responses) =>
            responses.length ? (
              responses.map((response) => (
                <div className={styles.sidebarResponse} key={response._id}>
                  <p className={styles.sidebarResponseDate}>
                    {moment(`${response.created_at}Z`).format('DD MMMM YYYY')}
                  </p>
                  <p className={styles.sidebarResponseTitle}>
                    {response.inviter === Role.Candidate
                      ? 'Отклик'
                      : 'Приглашение'}{' '}
                    на вакансию «{response.vacancy?.title}»
                  </p>
                  {response.status === ResponseStatus.Approved && (
                    <p>Принят на работу</p>
                  )}
                  {response.status === ResponseStatus.Rejected && (
                    <p>
                      Отказ на этапе «
                      {
                        response.vacancy?.stages?.find(
                          (i) => i._id === response.stage_id
                        )?.title
                      }
                      »
                    </p>
                  )}
                  {response.status !== ResponseStatus.Approved &&
                    response.status !== ResponseStatus.Rejected && (
                      <p>
                        В процессе на этапе «
                        {
                          response.vacancy?.stages?.find(
                            (i) => i._id === response.stage_id
                          )?.title
                        }
                        »
                      </p>
                    )}
                  {response.comment && (
                    <div className={styles.sidebarResponseComment}>
                      Комменатрий: {response.comment}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p>Откликов не было</p>
            )
          }
        />
      </div>
    </div>
  )
}
