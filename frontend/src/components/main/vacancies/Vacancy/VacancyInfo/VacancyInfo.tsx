import { useState } from 'react'
import { Role } from '@/types/entities/user'
import { Vacancy, VacancyStatuses } from '@/types/entities/vacancy'
import { getUserName } from '@/lib/get-user-name'
import { Site } from '@/config/site'
import { getVacancySalary } from '@/lib/get-vacancy-salary'
import classNames from 'classnames'
import moment from 'moment'
import Button from '@/components/ui/Button'
import Icon from '@/components/ui/Icon'
import Steps from '@/components/ui/Steps'
import AppearTransition from '@/components/ui/AppearTransition'
import styles from './VacancyInfo.module.scss'
import RadialProgressBar from '@/components/ui/RadialProgressBar'

interface Props {
  vacancy: Vacancy
  role?: Role
}

export default function VacancyInfo({ vacancy, role }: Props) {
  const [isDescriptionShowed, setIsDescriptionShowed] = useState(
    role === Role.Recruiter ? false : true
  )

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerTitleContainer}>
          <h1>{vacancy?.title}</h1>
          {role === Role.Candidate && (
            <div className={styles.headerMatchPercent}>
              <RadialProgressBar value={67} />
              <span>Подходит на 67%</span>
            </div>
          )}
        </div>
        <div className={styles.headerControls}>
          {/* TODO: actions */}
          {role === Role.Recruiter && (
            <>
              <Button type="text" onClick={() => alert('coming soon')}>
                <Icon icon="copy" />
                <span>Создать копию</span>
              </Button>
              <Button type="secondary" onClick={() => alert('coming soon')}>
                <Icon icon="pen" />
                <span>Редактировать</span>
              </Button>
            </>
          )}
          {role === Role.Candidate && (
            // TODO: and has no responses
            <Button type="primary" onClick={() => alert('coming soon')}>
              Откликнуться
            </Button>
          )}
        </div>
      </div>

      {role === Role.Recruiter && vacancy.recruiter && (
        <p className={styles.hint}>
          Ответственный рекрутер:{' '}
          {getUserName(vacancy.recruiter, 'Name Surname')}
        </p>
      )}

      <div className={styles.mainContainer}>
        <div className={styles.main}>
          <div className={classNames(styles.mainCard, styles.aThird)}>
            <p className={styles.mainCardTitle}>Опыт</p>
            <p>TODO</p>
          </div>
          <div className={classNames(styles.mainCard, styles.aThird)}>
            <p className={styles.mainCardTitle}>Формат работы</p>
            <p>TODO</p>
          </div>
          <div className={classNames(styles.mainCard, styles.aThird)}>
            <p className={styles.mainCardTitle}>График</p>
            <p>TODO</p>
          </div>
          <div className={classNames(styles.mainCard, styles.aThird)}>
            <p className={styles.mainCardTitle}>З/п</p>
            <p>{getVacancySalary(vacancy, true)}</p>
          </div>
          <div className={classNames(styles.mainCard, styles.aThird)}>
            <p className={styles.mainCardTitle}>Направление</p>
            <p>TODO</p>
          </div>
          <div className={classNames(styles.mainCard, styles.aThird)}>
            <p className={styles.mainCardTitle}>Дата создания вакансии</p>
            <p>{moment(vacancy.creation_date).format('DD MMMM YYYY')}</p>
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
                <div className={styles.mainDescriptionCardBlock}>
                  <p className={styles.mainDescriptionCardBlockTitle}>
                    Описание
                  </p>
                  <p>{vacancy.description}</p>
                </div>
                <div
                  className={classNames(
                    styles.mainDescriptionCardBlock,
                    styles.aHalf
                  )}
                >
                  <p className={styles.mainDescriptionCardBlockTitle}>Задачи</p>
                  <p>{vacancy.responsibilities}</p>
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
                    VacancyStatuses[key as keyof typeof VacancyStatuses].title,
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
          // TODO: hidden if there is no response
          <div
            className={classNames(styles.sidebar, { [styles.hidden]: true })}
          >
            <p className={styles.sidebarHint}>Статус отклика</p>
            coming soon
          </div>
        )}
      </div>
    </div>
  )
}
