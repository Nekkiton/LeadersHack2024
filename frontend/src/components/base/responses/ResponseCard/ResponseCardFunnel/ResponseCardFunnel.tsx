import { useMemo, useState } from 'react'
import {
  ResponseStage,
  ResponseStageStatus,
} from '@/types/entities/response-stage'
import { Vacancy } from '@/types/entities/vacancy'
import { getUserName } from '@/lib/get-user-name'
import { useToasts } from '@/lib/use-toasts'
import { Role } from '@/types/entities/user'
import classNames from 'classnames'
import Button from '@/components/ui/Button'
import KeepRecruitingModal from '@/components/base/candidates/KeepRecruitingModal'
import RejectRecruitingModal from '@/components/base/candidates/RejectRecruitingModal'
import RejectVacancyModal from '@/components/base/vacancies/RejectVacancyModal'
import SetupInterviewModal from '@/components/base/vacancies/SetupInterviewModal'
import styles from './ResponseCardFunnel.module.scss'
import moment from 'moment'
import {
  Response,
  ResponseMessageType,
  ResponseStatus,
} from '@/types/entities/response'

interface Props {
  // responses: ResponseStage[]
  response: Response
  vacancy: Vacancy
  role: Role
}

export default function ResponseCardFunnel({ response, vacancy, role }: Props) {
  const toasts = useToasts()

  const [isKeepRecruitingModalShowed, setIsKeepRecruitingModalShowed] =
    useState(false)
  const [isRejectRecruitingModalShowed, setIsRejectRecruitingModalShowed] =
    useState(false)
  const [isRejectVacancyModalShowed, setIsRejectVacancyModalShowed] =
    useState(false)
  const [isSetupInterviewModalShowed, setIsSetupInterviewModalShowed] =
    useState(false)

  return (
    <>
      <div className={styles.container}>
        {response.messages.map((message, idx) => (
          <div className={styles.block} key={idx}>
            <p className={styles.blockTitle}>
              {
                {
                  [ResponseMessageType.CandidateRequest]: 'Отклик на вакансию',
                  [ResponseMessageType.CandidateAnswer]: '',
                  [ResponseMessageType.RecruiterRequest]: '',
                  [ResponseMessageType.NextStageRequest]: '',
                  [ResponseMessageType.Result]: 'Итог',
                }[message.type]
              }
            </p>
            <div className={styles.blockContent}>
              <div
                className={classNames(styles.message, {
                  [styles.outgoing]: role === message.sender_role,
                  [styles.incoming]: role !== message.sender_role,
                })}
              >
                <p className={styles.messageFrom}>
                  {message.sender_role === role ? 'Вы' : 'Ваш друг'}
                </p>
                <p>{message.text}</p>
                <p className={styles.messageDate}>
                  {moment(`${message.created_at}Z`).format(
                    'DD MMMM YYYY, HH:mm'
                  )}
                </p>
              </div>
            </div>
          </div>
        ))}
        {role === Role.Recruiter &&
          (response.status === ResponseStatus.WaitingForCandidate ||
            response.status === ResponseStatus.WaitingForRecruiter) && (
            <div className={styles.block}>
              <p className={styles.blockTitle}>Ваши действия</p>
              <div className={classNames(styles.blockContent, styles.controls)}>
                {/* <Button
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
            </Button> */}
              </div>
            </div>
          )}
        {role === Role.Candidate &&
          (response.status === ResponseStatus.WaitingForCandidate ||
            response.status === ResponseStatus.WaitingForRecruiter) && (
            <div className={styles.block}>
              <p className={styles.blockTitle}>Ваши действия</p>
              <div className={classNames(styles.blockContent, styles.controls)}>
                {response.status === ResponseStatus.WaitingForCandidate && (
                  <Button
                    type="text"
                    onClick={() => setIsSetupInterviewModalShowed(true)}
                  >
                    Выбрать время для интервью
                  </Button>
                )}
                <Button
                  className={styles.controlsRejectBtn}
                  type="text"
                  onClick={() => setIsRejectVacancyModalShowed(true)}
                >
                  Отказать
                </Button>
              </div>
            </div>
          )}
      </div>

      {/* <KeepRecruitingModal
        isShowed={isKeepRecruitingModalShowed}
        setIsShowed={setIsKeepRecruitingModalShowed}
        stage={curResponse.stage}
      />

      <RejectRecruitingModal
        isShowed={isRejectRecruitingModalShowed}
        setIsShowed={setIsRejectRecruitingModalShowed}
        stage={curResponse.stage}
      /> */}

      <RejectVacancyModal
        isShowed={isRejectVacancyModalShowed}
        setIsShowed={setIsRejectVacancyModalShowed}
      />

      <SetupInterviewModal
        isShowed={isSetupInterviewModalShowed}
        setIsShowed={setIsSetupInterviewModalShowed}
      />
    </>
  )

  // const curResponse = useMemo(
  //   () => responses[responses.length - 1],
  //   [responses]
  // )

  // const prevResponse: ResponseStage | null = useMemo(
  //   () => responses[responses.length - 2] ?? null,
  //   [responses]
  // )

  // const nextStage = useMemo(
  //   () => vacancy.stages?.[(curResponse.stage?.position ?? 0) + 1] ?? null,
  //   [vacancy, curResponse]
  // )

  // const candidateName = useMemo(() => {
  //   if (role === Role.Candidate) {
  //     return 'Вы'
  //   } else if (curResponse.candidate) {
  //     return getUserName(curResponse.candidate, 'Name Surname')
  //   } else {
  //     return 'Соискатель'
  //   }
  // }, [role, curResponse])

  // const recruiterName = useMemo(() => {
  //   if (role === Role.Recruiter) {
  //     return 'Вы'
  //     // } else if (vacancy.recruiter) {
  //     //   return getUserName(vacancy.recruiter, 'Name Surname')
  //     // TODO
  //   } else {
  //     return 'Соискатель'
  //   }
  // }, [role, vacancy])

  // const candidateAnswerTitle = useMemo(
  //   () => (role === Role.Candidate ? 'Ваш ответ' : 'Ответ кандидата'),
  //   [role]
  // )

  // if (!curResponse.stage || !vacancy.stages) return 'Данные не загружены'

  return (
    <>
      <div
        className={classNames(styles.container, {
          [styles.inverse]: role === Role.Candidate,
        })}
      >
        {prevResponse && (
          <Button
            className={styles.centerEl}
            type="text"
            onClick={() => toasts.info({ content: 'Функционал в разработке' })}
            // TODO: show all messages
          >
            Показать все этапы
          </Button>
        )}
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
                    <p className={styles.messageFrom}>{recruiterName}</p>
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
                  ? candidateAnswerTitle
                  : 'Отклик на вакансию'}
              </p>
              <div className={styles.blockContent}>
                <div className={classNames(styles.message, styles.incoming)}>
                  {curResponse.candidate && (
                    <p className={styles.messageFrom}>{candidateName}</p>
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
                <p className={styles.messageFrom}>{recruiterName}</p>
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
                {prevResponse ? candidateAnswerTitle : 'Отклик на вакансию'}
              </p>
              <div className={styles.blockContent}>
                <div className={classNames(styles.message, styles.incoming)}>
                  {curResponse.candidate && (
                    <p className={styles.messageFrom}>{candidateName}</p>
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
                  <p className={styles.messageFrom}>{recruiterName}</p>
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
                {prevResponse ? candidateAnswerTitle : 'Отклик на вакансию'}
              </p>
              <div className={styles.blockContent}>
                <div className={classNames(styles.message, styles.incoming)}>
                  {curResponse.candidate && (
                    <p className={styles.messageFrom}>{candidateName}</p>
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
                  <p className={styles.messageFrom}>{recruiterName}</p>
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
        {role === Role.Recruiter &&
          curResponse.status === ResponseStageStatus.WaitingForRecruiter && (
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

        {role === Role.Candidate &&
          curResponse.status !== ResponseStageStatus.RejectedByCandidate &&
          curResponse.status !== ResponseStageStatus.RejectedByRecruiter && (
            <div className={styles.block}>
              <p className={styles.blockTitle}>Ваши действия</p>
              <div className={classNames(styles.blockContent, styles.controls)}>
                {(curResponse.status ===
                  ResponseStageStatus.ApprovedByRecruiter ||
                  curResponse.status ===
                    ResponseStageStatus.WaitingForCandidate) && (
                  <Button
                    type="text"
                    onClick={() => setIsSetupInterviewModalShowed(true)}
                  >
                    Выбрать время для интервью
                  </Button>
                )}
                <Button
                  className={styles.controlsRejectBtn}
                  type="text"
                  onClick={() => setIsRejectVacancyModalShowed(true)}
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

      <RejectVacancyModal
        isShowed={isRejectVacancyModalShowed}
        setIsShowed={setIsRejectVacancyModalShowed}
      />

      <SetupInterviewModal
        isShowed={isSetupInterviewModalShowed}
        setIsShowed={setIsSetupInterviewModalShowed}
      />
    </>
  )
}
