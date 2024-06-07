import { useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { Site } from '@/config/site'
import { FormData } from './utils'
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

export default function VacancyForm({ backLink }: Props) {
  const [activeStepIdx, setActiveStepIdx] = useState(1)

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

  const methods = useForm<FormData>({
    defaultValues: {
      stages: [
        {
          title: 'Неразобранные отклики',
          auto_interview: true,
          _isRequired: true,
        },
      ],
    },
  })
  const { handleSubmit } = methods

  const submit = handleSubmit((data) => {
    if (activeStepIdx < steps.length - 1) {
      setActiveStepIdx(activeStepIdx + 1)
    }
    console.log(data)
  })

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
                <Button type="primary" htmlType="submit">
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
