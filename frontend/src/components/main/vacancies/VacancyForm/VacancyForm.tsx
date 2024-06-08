import { useEffect, useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { Site } from '@/config/site'
import { useCurUser } from '@/api/users'
import { useCreateVacancy } from '@/api/vacancies'
import { FormData, transformFormData } from './utils'
import Button from '@/components/ui/Button'
import Icon from '@/components/ui/Icon'
import Steps from '@/components/ui/Steps'
import VacancyFormInfo from './VacancyFormInfo'
import VacancyFormRecruiting from './VacancyFormRecruiting'
import styles from './VacancyForm.module.scss'

interface Props {
  backLink?: {
    url: string
    text: string
  }
}

// TODO: editing, copying from another vacancy

export default function VacancyForm({ backLink }: Props) {
  const user = useCurUser()

  const [activeStepIdx, setActiveStepIdx] = useState(0)

  const steps = [
    {
      name: 'Информация о вакансии',
      content: <VacancyFormInfo />,
    },
    {
      name: 'Воронка найма',
      content: <VacancyFormRecruiting />,
    },
  ]

  const methods = useForm<FormData>()
  const { handleSubmit, reset } = methods

  const { mutate: createVacancy, status } = useCreateVacancy()

  const submit = handleSubmit((data) => {
    if (activeStepIdx < steps.length - 1) {
      setActiveStepIdx(activeStepIdx + 1)
    } else {
      createVacancy(transformFormData(data))
    }
  })

  useEffect(() => {
    if (user.status === 'success' && user.value) {
      reset({
        stages: Site.recruitingDefaultStages.map((i) => ({
          ...i,
          approve_template: i.approve_template.replaceAll(
            'RECRUITER_NAME',
            user.value.name
          ),
        })),
      })
    }
  }, [user.status, reset])

  return (
    <div className={styles.container}>
      {backLink && (
        <Button type="text" href={backLink.url}>
          <Icon icon="chevronLeft" />
          {backLink.text}
        </Button>
      )}
      <h1>Создать вакансию</h1>
      <div className={styles.main}>
        <FormProvider {...methods}>
          <form className={styles.form} onSubmit={submit}>
            {steps[activeStepIdx].content}
            <div className={styles.formControls}>
              {activeStepIdx < steps.length - 1 && (
                <Button type="primary" htmlType="submit">
                  Далее
                </Button>
              )}
              {activeStepIdx > 0 && (
                <Button
                  type="secondary"
                  onClick={() => setActiveStepIdx(activeStepIdx - 1)}
                >
                  Назад
                </Button>
              )}
              {activeStepIdx === steps.length - 1 && (
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={status === 'pending'}
                >
                  Опубликовать
                </Button>
              )}
            </div>
          </form>
        </FormProvider>

        <div className={styles.sidebar}>
          <Steps
            items={steps.map((step, idx) => ({ key: idx, value: step.name }))}
            activeKey={activeStepIdx}
          />
          <Button
            type="text"
            href={Site.links.creatingVacancies}
            target="_blank"
          >
            <span>Подробнее о создании вакансий</span>
            <Icon icon="linkExternal" />
          </Button>
        </div>
      </div>
    </div>
  )
}
