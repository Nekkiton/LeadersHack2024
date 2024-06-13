import { useMemo, useState } from 'react'
import { Vacancy } from '@/types/entities/vacancy'
import { Role } from '@/types/entities/user'
import {
  Response,
  ResponseMessageType,
  ResponseStatus,
} from '@/types/entities/response'
import moment from 'moment'
import classNames from 'classnames'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import AppearTransition from '@/components/ui/AppearTransition'
import KeepRecruitingModal from '@/components/base/candidates/KeepRecruitingModal'
import RejectRecruitingModal from '@/components/base/candidates/RejectRecruitingModal'
import RejectVacancyModal from '@/components/base/vacancies/RejectVacancyModal'
import SetupInterviewModal from '@/components/base/vacancies/SetupInterviewModal'
import styles from './ResponseCardFunnel.module.scss'

interface Props {
  response: Response
  vacancy: Vacancy
  role: Role
}

export default function ResponseCardFunnel({ response, vacancy, role }: Props) {
  const [isKeepRecruitingModalShowed, setIsKeepRecruitingModalShowed] =
    useState(false)
  const [isRejectRecruitingModalShowed, setIsRejectRecruitingModalShowed] =
    useState(false)
  const [isRejectVacancyModalShowed, setIsRejectVacancyModalShowed] =
    useState(false)
  const [isSetupInterviewModalShowed, setIsSetupInterviewModalShowed] =
    useState(false)

  const [areAllMsgsShowed, setAreAllMsgsShowed] = useState(false)

  const curStage = useMemo(() => {
    return vacancy.stages?.find((i) => i._id === response.stage_id) ?? null
  }, [vacancy, response])

  const nextStage = useMemo(() => {
    const curStageIdx = vacancy.stages?.findIndex(
      (i) => i._id === response.stage_id
    )
    if (curStageIdx === -1 || curStageIdx === undefined) return null
    return vacancy.stages?.[curStageIdx + 1] ?? null
  }, [vacancy, response])

  const renderMessageText = (message: Response['messages'][0]) => {
    if (!message.meet_url) {
      return message.text
    }
    const textParts = message.text.split(message.meet_url)
    return (
      <>
        {textParts[0]}
        <Link href={message.meet_url} target="_blank">
          {message.meet_url}
        </Link>
        {textParts[1]}
      </>
    )
  }

  return (
    <>
      <div className={styles.container}>
        <AppearTransition orientation="v" gap>
          {response.messages.length > 2 && !areAllMsgsShowed && (
            <Button
              className={styles.centerEl}
              type="text"
              onClick={() => setAreAllMsgsShowed(true)}
            >
              Показать все этапы
            </Button>
          )}
        </AppearTransition>
        {response.messages.map((message, idx) => (
          <AppearTransition key={idx} orientation="v" gap>
            {(areAllMsgsShowed || idx > response.messages.length - 3) && (
              <div className={styles.block}>
                <p className={styles.blockTitle}>
                  {
                    {
                      [ResponseMessageType.CandidateRequest]:
                        'Отклик на вакансию',
                      [ResponseMessageType.CandidateAnswer]:
                        role === Role.Candidate
                          ? 'Ваш ответ'
                          : 'Ответ кандидата',
                      [ResponseMessageType.RecruiterRequest]: `Приглашение на ${curStage?.title}`,
                      [ResponseMessageType.NextStageRequest]: `Приглашение на ${curStage?.title}`,
                      [ResponseMessageType.Result]:
                        response.status === ResponseStatus.Rejected
                          ? 'Отказ'
                          : 'Итог',
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
                      {message.sender_role === role
                        ? 'Вы'
                        : {
                            [Role.Candidate]: 'Кандидат',
                            [Role.Recruiter]: 'Рекрутер',
                          }[message.sender_role]}
                    </p>
                    <p>{renderMessageText(message)}</p>
                    <p className={styles.messageDate}>
                      {moment(`${message.created_at}Z`).format(
                        'DD MMMM YYYY, HH:mm'
                      )}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </AppearTransition>
        ))}
        {role === Role.Recruiter &&
          (response.status === ResponseStatus.WaitingForCandidate ||
            response.status === ResponseStatus.WaitingForRecruiter) && (
            <div className={styles.block}>
              <p className={styles.blockTitle}>Ваши действия</p>
              <div className={classNames(styles.blockContent, styles.controls)}>
                {response.status === ResponseStatus.WaitingForRecruiter && (
                  <Button
                    type="text"
                    onClick={() => setIsKeepRecruitingModalShowed(true)}
                  >
                    {nextStage ? `Пригласить на ${nextStage.title}` : 'Принять'}
                  </Button>
                )}
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

      {curStage && (
        <KeepRecruitingModal
          isShowed={isKeepRecruitingModalShowed}
          setIsShowed={setIsKeepRecruitingModalShowed}
          stage={curStage}
          response={response}
          lastStage={!nextStage}
        />
      )}

      {curStage && (
        <RejectRecruitingModal
          isShowed={isRejectRecruitingModalShowed}
          setIsShowed={setIsRejectRecruitingModalShowed}
          stage={curStage}
          response={response}
        />
      )}

      <RejectVacancyModal
        isShowed={isRejectVacancyModalShowed}
        setIsShowed={setIsRejectVacancyModalShowed}
        response={response}
      />

      {response.vacancy && (
        <SetupInterviewModal
          isShowed={isSetupInterviewModalShowed}
          setIsShowed={setIsSetupInterviewModalShowed}
          response={response}
          vacancy={response.vacancy}
        />
      )}
    </>
  )
}
