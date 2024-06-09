import { useFormContext, Controller } from 'react-hook-form'
import { VacancyStatuses } from '@/types/entities/vacancy'
import { useRecruiters } from '@/api/recruiters'
import { getUserName } from '@/lib/get-user-name'
import { useWorkScopes } from '@/api/work-scopes'
import { useSkills } from '@/api/skills'
import { Role } from '@/types/entities/user'
import { FiltersFormData } from '../utils'
import classNames from 'classnames'
import Button from '@/components/ui/Button'
import Icon from '@/components/ui/Icon'
import Select from '@/components/ui/Select'
import Input from '@/components/ui/Input'
import Image from '@/components/ui/Image'
import VacancyStatus from '@/components/base/vacancies/VacancyStatus'
import userImg from '@/assets/images/user.png'
import styles from './VacanciesFilters.module.scss'

interface Props {
  role: Role
}

export default function VacanciesFilters({ role }: Props) {
  const { control, formState, reset } = useFormContext<FiltersFormData>()

  const recruiters = useRecruiters({ enabled: role === Role.Recruiter })
  const skills = useSkills({ enabled: role === Role.Candidate })
  const workScopes = useWorkScopes()

  return (
    <div className={styles.container}>
      <Controller
        control={control}
        name="query"
        render={({ field }) => (
          <Input
            {...field}
            className={styles.input}
            placeholder="Поиск по вакансиям"
            prefix={<Icon icon="loupe" />}
          />
        )}
      />
      {role === Role.Recruiter && (
        <Controller
          control={control}
          name="statuses"
          render={({ field }) => (
            <Select
              {...field}
              placeholder="Все статусы"
              items={Object.keys(VacancyStatuses).map((key) => ({
                key,
                value:
                  VacancyStatuses[key as keyof typeof VacancyStatuses].title,
              }))}
              renderItem={({ key }) => (
                <VacancyStatus status={key as keyof typeof VacancyStatuses} />
              )}
              multiple
              longPopover
            />
          )}
        />
      )}
      {role === Role.Recruiter && (
        <Controller
          control={control}
          name="recruiters"
          render={({ field }) => (
            <Select
              {...field}
              placeholder="Все рекрутеры"
              items={
                recruiters.status === 'success'
                  ? recruiters.value.map((recruiter) => ({
                      key: recruiter.id,
                      value: recruiter,
                    }))
                  : []
              }
              renderItem={({ value }) => (
                <div className={styles.recruiter}>
                  <Image
                    className={styles.recruiterImg}
                    src={value.photo ?? userImg}
                    width={60}
                    height={60}
                  />
                  <p>{getUserName(value, 'Name Surname')}</p>
                </div>
              )}
              withConfirmation
              multiple
              longPopover
            />
          )}
        />
      )}
      <Controller
        control={control}
        name="work_scopes"
        render={({ field }) => (
          <Select
            {...field}
            placeholder="Все направления"
            items={
              workScopes.status === 'success'
                ? workScopes.value.map((i) => ({ key: i.id, value: i.scope }))
                : []
            }
            withConfirmation
            multiple
            longPopover
            inputtable
          />
        )}
      />
      {role === Role.Candidate && (
        <Controller
          control={control}
          name="skills"
          render={({ field }) => (
            <Select
              {...field}
              placeholder="Все ключевые навыки"
              items={
                skills.status === 'success'
                  ? skills.value.map((i) => ({ key: i.id, value: i.skill }))
                  : []
              }
              withConfirmation
              multiple
              longPopover
              inputtable
            />
          )}
        />
      )}
      <Button
        className={classNames(styles.clearBtn, {
          [styles.active]: formState.isDirty,
        })}
        type="text"
        onClick={() => reset()}
      >
        <Icon icon="times" />
        <span>Сбросить</span>
      </Button>
    </div>
  )
}
