import { useMemo, useState } from 'react'
import {
  ResponseStage,
  ResponseStageStatus,
} from '@/types/entities/response-stage'
import { Vacancy } from '@/types/entities/vacancy'
import { getUserName } from '@/lib/get-user-name'
import classNames from 'classnames'
import Button from '@/components/ui/Button'
import KeepRecruitingModal from '@/components/base/candidates/KeepRecruitingModal'
import RejectRecruitingModal from '@/components/base/candidates/RejectRecruitingModal'
import styles from './ResponseCardFunnel.module.scss'
import moment from 'moment'

interface Props {
  responses: ResponseStage[]
  vacancy: Vacancy
}

export default function ResponseCardFunnel({ responses, vacancy }: Props) {
  const [isKeepRecruitingModalShowed, setIsKeepRecruitingModalShowed] =
    useState(false)
  const [isRejectRecruitingModalShowed, setIsRejectRecruitingModalShowed] =
    useState(false)

  const curResponse = useMemo(
    () => responses[responses.length - 1],
    [responses]
  )

  const prevResponse: ResponseStage | null = useMemo(
    () => responses[responses.length - 2] ?? null,
    [responses]
  )

  const nextStage = useMemo(
    () => vacancy.stages?.[(curResponse.stage?.position ?? 0) + 1] ?? null,
    [vacancy, curResponse]
  )

  if (!curResponse.stage || !vacancy.stages) return null

  return (
    <>
      <div className={styles.container}>
        {(curResponse.status === ResponseStageStatus.WaitingForRecruiter ||
          curResponse.status === ResponseStageStatus.RejectedByCandidate) && (
          <>
            {(prevResponse ||
              curResponse.status ===
                ResponseStageStatus.RejectedByCandidate) && (
              <div className={styles.block}>
                <p className={styles.blockTitle}>
                  Приглашение на{' '}
                  {curResponse.status ===
                  ResponseStageStatus.WaitingForRecruiter
                    ? curResponse.stage.title
                    : nextStage?.title}
                </p>
                <div className={styles.blockContent}>
                  <div className={classNames(styles.message, styles.outgoing)}>
                    <p className={styles.messageFrom}>Вы</p>
                    {curResponse.recruiter_message}
                    <p className={styles.messageDate}>
                      {moment(curResponse.recruiter_message_timestamp).format(
                        'DD MMMM YYYY, HH:mm'
                      )}
                    </p>
                  </div>
                </div>
              </div>
            )}
            <div className={styles.block}>
              <p className={styles.blockTitle}>
                {prevResponse ||
                curResponse.status === ResponseStageStatus.RejectedByCandidate
                  ? 'Ответ кандидата'
                  : 'Отклик на вакансию'}
              </p>
              <div className={styles.blockContent}>
                <div className={classNames(styles.message, styles.incoming)}>
                  {curResponse.candidate && (
                    <p className={styles.messageFrom}>
                      {getUserName(curResponse.candidate, 'Name Surname')}
                    </p>
                  )}
                  {curResponse.candidate_message}
                  <p className={styles.messageDate}>
                    {moment(curResponse.candidate_timestamp).format(
                      'DD MMMM YYYY, HH:mm'
                    )}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
        {curResponse.status === ResponseStageStatus.WaitingForCandidate && (
          <div className={styles.block}>
            <p className={styles.blockTitle}>
              Приглашение на {nextStage?.title}
            </p>
            <div className={styles.blockContent}>
              <div className={classNames(styles.message, styles.outgoing)}>
                <p className={styles.messageFrom}>Вы</p>
                {curResponse.recruiter_message}
                <p className={styles.messageDate}>
                  {moment(curResponse.recruiter_message_timestamp).format(
                    'DD MMMM YYYY, HH:mm'
                  )}
                </p>
              </div>
            </div>
          </div>
        )}
        {curResponse.status === ResponseStageStatus.ApprovedByRecruiter && (
          <>
            <div className={styles.block}>
              <p className={styles.blockTitle}>
                {prevResponse ? 'Ответ кандидата' : 'Отклик на вакансию'}
              </p>
              <div className={styles.blockContent}>
                <div className={classNames(styles.message, styles.incoming)}>
                  {curResponse.candidate && (
                    <p className={styles.messageFrom}>
                      {getUserName(curResponse.candidate, 'Name Surname')}
                    </p>
                  )}
                  {curResponse.candidate_message}
                  <p className={styles.messageDate}>
                    {moment(curResponse.candidate_timestamp).format(
                      'DD MMMM YYYY, HH:mm'
                    )}
                  </p>
                </div>
              </div>
            </div>
            <div className={styles.block}>
              <p className={styles.blockTitle}>
                {nextStage ? `Приглашение на ${nextStage.title}` : 'Итог'}
              </p>
              <div className={styles.blockContent}>
                <div className={classNames(styles.message, styles.outgoing)}>
                  <p className={styles.messageFrom}>Вы</p>
                  {curResponse.recruiter_message}
                  <p className={styles.messageDate}>
                    {moment(curResponse.recruiter_message_timestamp).format(
                      'DD MMMM YYYY, HH:mm'
                    )}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
        {curResponse.status === ResponseStageStatus.RejectedByRecruiter && (
          <>
            <div className={styles.block}>
              <p className={styles.blockTitle}>
                {prevResponse ? 'Ответ кандидата' : 'Отклик на вакансию'}
              </p>
              <div className={styles.blockContent}>
                <div className={classNames(styles.message, styles.incoming)}>
                  {curResponse.candidate && (
                    <p className={styles.messageFrom}>
                      {getUserName(curResponse.candidate, 'Name Surname')}
                    </p>
                  )}
                  {curResponse.candidate_message}
                  <p className={styles.messageDate}>
                    {moment(curResponse.candidate_timestamp).format(
                      'DD MMMM YYYY, HH:mm'
                    )}
                  </p>
                </div>
              </div>
            </div>
            <div className={styles.block}>
              <p className={styles.blockTitle}>Итог</p>
              <div className={styles.blockContent}>
                <div className={classNames(styles.message, styles.outgoing)}>
                  <p className={styles.messageFrom}>Вы</p>
                  {curResponse.recruiter_message}
                  <p className={styles.messageDate}>
                    {moment(curResponse.recruiter_message_timestamp).format(
                      'DD MMMM YYYY, HH:mm'
                    )}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
        {curResponse.status === ResponseStageStatus.WaitingForRecruiter && (
          <div className={styles.block}>
            <p className={styles.blockTitle}>Ваши действия</p>
            <div className={classNames(styles.blockContent, styles.controls)}>
              <Button
                type="text"
                onClick={() => setIsKeepRecruitingModalShowed(true)}
              >
                {nextStage ? `Пригласить на ${nextStage.title}` : 'Принять'}
              </Button>
              <Button
                className={styles.controlsRejectBtn}
                type="text"
                onClick={() => setIsRejectRecruitingModalShowed(true)}
              >
                Отказать
              </Button>
            </div>
          </div>
        )}
      </div>

      <KeepRecruitingModal
        isShowed={isKeepRecruitingModalShowed}
        setIsShowed={setIsKeepRecruitingModalShowed}
        stage={curResponse.stage}
      />
      <RejectRecruitingModal
        isShowed={isRejectRecruitingModalShowed}
        setIsShowed={setIsRejectRecruitingModalShowed}
        stage={curResponse.stage}
      />
    </>
  )
}
