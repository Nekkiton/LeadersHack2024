import { useFormContext, Controller } from 'react-hook-form'
import { useWorkExperiences } from '@/api/work-experiences'
import { useSkills } from '@/api/skills'
import { FiltersFormData } from '../utils'
import classNames from 'classnames'
import Button from '@/components/ui/Button'
import Icon from '@/components/ui/Icon'
import Select from '@/components/ui/Select'
import Input from '@/components/ui/Input'
import styles from './CandidatesFilters.module.scss'

export default function CandidatesFilters() {
  const { control, formState, reset } = useFormContext<FiltersFormData>()

  const workExperiences = useWorkExperiences()
  const skills = useSkills()

  return (
    <div className={styles.container}>
      <Controller
        control={control}
        name="query"
        render={({ field }) => (
          <Input
            {...field}
            className={styles.input}
            placeholder="Поиск по ФИО"
            prefix={<Icon icon="loupe" />}
          />
        )}
      />
      <Controller
        control={control}
        name="work_experiences"
        render={({ field }) => (
          <Select
            {...field}
            placeholder="Опыт"
            items={
              workExperiences.status === 'success'
                ? workExperiences.value.map((experience) => ({
                    key: experience.id,
                    value: experience.experience,
                  }))
                : []
            }
            multiple
            longPopover
          />
        )}
      />
      <Controller
        control={control}
        name="skills"
        render={({ field }) => (
          <Select
            {...field}
            placeholder="Навыки"
            items={
              skills.status === 'success'
                ? skills.value.map((skill) => ({
                    key: skill.id,
                    value: skill.skill,
                  }))
                : []
            }
            withConfirmation
            multiple
            inputtable
            longPopover
          />
        )}
      />
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
