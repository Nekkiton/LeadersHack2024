import { useState } from 'react'
import { Role } from '@/types/entities/user'
import {
  Vacancy,
  VacancyStatus,
  VacancyStatuses,
} from '@/types/entities/vacancy'
import { Site } from '@/config/site'
import { getVacancySalary } from '@/lib/get-vacancy-salary'
import { useCurCandidateVacancyResponse } from '@/api/candidates'
import { Routes } from '@/config/routes'
import classNames from 'classnames'
import moment from 'moment'
import Button from '@/components/ui/Button'
import Icon from '@/components/ui/Icon'
import Steps from '@/components/ui/Steps'
import AppearTransition from '@/components/ui/AppearTransition'
import RadialProgressBar from '@/components/ui/RadialProgressBar'
import RespondToVacancyModal from '@/components/base/vacancies/RespondToVacancyModal'
import VacancyInfoCandidateResponse from './VacancyInfoCandidateResponse'
import styles from './VacancyInfo.module.scss'

interface Props {
  vacancy: Vacancy
  role?: Role
}

export default function VacancyInfo({ vacancy, role }: Props) {
  const [isDescriptionShowed, setIsDescriptionShowed] = useState(
    role === Role.Recruiter ? false : true
  )
  const [isRespondModalShowed, setIsRespondModalShowed] = useState(false)

  const candidateResponse = useCurCandidateVacancyResponse(vacancy._id, {
    enabled: role === Role.Candidate,
  })

  return (
    <>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerTitleContainer}>
            <h1>{vacancy?.title}</h1>
            {role === Role.Candidate && vacancy.match !== undefined && (
              <div className={styles.headerMatchPercent}>
                <RadialProgressBar value={vacancy.match} />
                <span>Подходит на {vacancy.match}%</span>
              </div>
            )}
          </div>
          <div className={styles.headerControls}>
            {/* TODO: actions */}
            {role === Role.Recruiter && (
              <>
                <Button
                  type="text"
                  href={{
                    pathname: Routes.recruiterNewVacancy,
                    query: { copyId: vacancy._id },
                  }}
                >
                  <Icon icon="copy" />
                  <span>Создать копию</span>
                </Button>
                {vacancy.status === VacancyStatus.Active && (
                  <Button
                    className={styles.transparentBtn}
                    type="secondary"
                    href={Routes.recruiterEditVacancy(vacancy._id)}
                  >
                    <Icon icon="pen" />
                    <span>Редактировать</span>
                  </Button>
                )}
              </>
            )}
            {candidateResponse.status === 'success' &&
              !candidateResponse.value.length && (
                <Button
                  type="primary"
                  onClick={() => setIsRespondModalShowed(true)}
                >
                  Откликнуться
                </Button>
              )}
          </div>
        </div>

        <div className={styles.mainContainer}>
          <div className={styles.main}>
            <div className={classNames(styles.mainCard, styles.aThird)}>
              <p className={styles.mainCardTitle}>Опыт</p>
              <p>{vacancy.work_experience}</p>
            </div>
            <div className={classNames(styles.mainCard, styles.aThird)}>
              <p className={styles.mainCardTitle}>Формат работы</p>
              <p>{vacancy.work_type}</p>
            </div>
            <div className={classNames(styles.mainCard, styles.aThird)}>
              <p className={styles.mainCardTitle}>График</p>
              <p>{vacancy.work_schedule}</p>
            </div>
            <div className={classNames(styles.mainCard, styles.aThird)}>
              <p className={styles.mainCardTitle}>З/п</p>
              <p>{getVacancySalary(vacancy, true)}</p>
            </div>
            <div className={classNames(styles.mainCard, styles.aThird)}>
              <p className={styles.mainCardTitle}>Направление</p>
              <p>{vacancy.scope}</p>
            </div>
            <div className={classNames(styles.mainCard, styles.aThird)}>
              <p className={styles.mainCardTitle}>Дата создания вакансии</p>
              <p>{moment(`${vacancy.created_at}Z`).format('DD MMMM YYYY')}</p>
            </div>
            <div className={styles.mainCard}>
              <p className={styles.mainCardTitle}>Ключевые навыки</p>
              <div className={styles.mainCardTags}>
                {vacancy.skills.map((skill) => (
                  <span className={styles.mainCardTag} key={skill}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            {role === Role.Recruiter && (
              <Button
                onClick={() => setIsDescriptionShowed(!isDescriptionShowed)}
                type="secondary"
                fullWidth
              >
                <Icon
                  className={classNames(styles.mainDescriptionBtnIcon, {
                    [styles.active]: isDescriptionShowed,
                  })}
                  icon="chevronDown"
                />
                <span>
                  {isDescriptionShowed ? 'Скрыть' : 'Показать'} полное описание
                </span>
              </Button>
            )}
            <AppearTransition
              className={styles.mainDescriptionCardContainer}
              orientation="v"
              gap
            >
              {isDescriptionShowed && (
                <div className={styles.mainDescriptionCard}>
                  {vacancy.description && (
                    <div className={styles.mainDescriptionCardBlock}>
                      <p className={styles.mainDescriptionCardBlockTitle}>
                        Описание
                      </p>
                      <p>{vacancy.description}</p>
                    </div>
                  )}
                  <div
                    className={classNames(
                      styles.mainDescriptionCardBlock,
                      styles.aHalf
                    )}
                  >
                    <p className={styles.mainDescriptionCardBlockTitle}>
                      Задачи
                    </p>
                    <p>{vacancy.responsabilities}</p>
                  </div>
                  <div
                    className={classNames(
                      styles.mainDescriptionCardBlock,
                      styles.aHalf
                    )}
                  >
                    <p className={styles.mainDescriptionCardBlockTitle}>
                      Ожидания от соискателя
                    </p>
                    <p>{vacancy.candidate_expectation}</p>
                  </div>
                  {vacancy.additions && (
                    <div
                      className={classNames(
                        styles.mainDescriptionCardBlock,
                        styles.aHalf
                      )}
                    >
                      <p className={styles.mainDescriptionCardBlockTitle}>
                        Будет плюсом
                      </p>
                      <p>{vacancy.additions}</p>
                    </div>
                  )}
                  {vacancy.conditions && (
                    <div
                      className={classNames(
                        styles.mainDescriptionCardBlock,
                        styles.aHalf
                      )}
                    >
                      <p className={styles.mainDescriptionCardBlockTitle}>
                        Условия
                      </p>
                      <p>{vacancy.conditions}</p>
                    </div>
                  )}
                </div>
              )}
            </AppearTransition>
          </div>

          {role === Role.Recruiter && (
            <div className={styles.sidebar}>
              <p className={styles.sidebarHint}>Статус</p>
              <Steps
                items={[
                  { key: '', value: 'Создана' },
                  ...Object.keys(VacancyStatuses).map((key) => ({
                    key: key,
                    value:
                      VacancyStatuses[key as keyof typeof VacancyStatuses]
                        .title,
                  })),
                ]}
                activeKey={vacancy.status}
              />
              <Button
                type="text"
                href={Site.links.changingVacancyStatuses}
                target="_blank"
              >
                <span>Подробнее о смене статусов</span>
                <Icon icon="linkExternal" />
              </Button>
            </div>
          )}

          {role === Role.Candidate && (
            <VacancyInfoCandidateResponse vacancy={vacancy} />
          )}
        </div>
      </div>

      {role === Role.Candidate && (
        <RespondToVacancyModal
          isShowed={isRespondModalShowed}
          setIsShowed={setIsRespondModalShowed}
          vacancy={vacancy}
        />
      )}
    </>
  )
}
