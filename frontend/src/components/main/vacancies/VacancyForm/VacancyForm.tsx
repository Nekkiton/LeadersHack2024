import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useForm, FormProvider } from 'react-hook-form'
import { Site } from '@/config/site'
import { useCurUser } from '@/api/users'
import { Routes } from '@/config/routes'
import { useCreateVacancy, useUpdateVacancy, useVacancy } from '@/api/vacancies'
import { FormData, getInitialData, transformFormData } from './utils'
import Button from '@/components/ui/Button'
import Icon from '@/components/ui/Icon'
import Steps from '@/components/ui/Steps'
import CloseVacancyModal from '@/components/base/vacancies/CloseVacancyModal'
import VacancyFormInfo from './VacancyFormInfo'
import VacancyFormRecruiting from './VacancyFormRecruiting'
import styles from './VacancyForm.module.scss'

interface Props {
  editId?: string
  copyId?: string
  backLink?: {
    url: string
    text: string
  }
}

// TODO: something's defenately wrong with default data
export default function VacancyForm({ backLink, editId, copyId }: Props) {
  const router = useRouter()
  const user = useCurUser()

  const [activeStepIdx, setActiveStepIdx] = useState(0)
  const [isCloseVacancyModalShowed, setIsCloseVacancyModalShowed] =
    useState(false)

  const vacancy = useVacancy((editId ?? copyId)!, {
    enabled: !!(editId ?? copyId),
  })

  const steps = [
    {
      name: 'Информация о вакансии',
      content: <VacancyFormInfo />,
    },
    {
      name: 'Воронка найма',
      content: (
        <VacancyFormRecruiting
          disabled={
            !!editId &&
            vacancy.status === 'success' &&
            !!vacancy.value.responses
          }
        />
      ),
    },
  ]

  const methods = useForm<FormData>({
    defaultValues: getInitialData(
      vacancy.status === 'success' ? vacancy.value : undefined // TODO
    ),
  })
  const { handleSubmit, reset, watch } = methods
  console.log(watch().stages)

  useEffect(() => {
    if (vacancy.status === 'success') {
      reset(getInitialData(vacancy.value)) // TODO
    }
  }, [vacancy.status])

  // TODO: handle errors
  const { mutate: createVacancy, status: createStatus } = useCreateVacancy()
  const { mutate: updateVacancy, status: updateStatus } = useUpdateVacancy()

  const submit = handleSubmit((data) => {
    if (activeStepIdx < steps.length - 1) {
      setActiveStepIdx(activeStepIdx + 1)
    } else if (editId) {
      updateVacancy(
        { ...transformFormData(data), pk: editId },
        {
          onSuccess: () => {
            router.push(Routes.recruiterVacancy(editId))
          },
        }
      )
    } else {
      createVacancy(transformFormData(data), {
        onSuccess: () => {
          router.push(Routes.recruiterVacancies)
        },
      })
    }
  })

  useEffect(() => {
    if (user.status === 'success' && user.value && !editId && !copyId) {
      reset({
        stages: Site.recruitingDefaultStages.map((i) => ({
          ...i,
          approve_template: i.approve_template.replaceAll(
            'RECRUITER_NAME',
            user.value?.name ?? '' // TODO
          ),
        })),
      })
    }
  }, [user.status, reset])

  return (
    <>
      <div className={styles.container}>
        {backLink && (
          <Button type="text" href={backLink.url}>
            <Icon icon="chevronLeft" />
            {backLink.text}
          </Button>
        )}
        <h1>{editId ? 'Редактировать вакансию' : 'Создать вакансию'}</h1>
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
                    loading={
                      updateStatus === 'pending' || createStatus === 'pending'
                    }
                  >
                    Опубликовать
                  </Button>
                )}
                {editId && (
                  <Button
                    className={styles.formControlsRemoveBtn}
                    type="text"
                    onClick={() => setIsCloseVacancyModalShowed(true)}
                  >
                    Закрыть вакансию
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

      {vacancy.status === 'success' && (
        <CloseVacancyModal
          isShowed={isCloseVacancyModalShowed}
          setIsShowed={setIsCloseVacancyModalShowed}
          vacancy={vacancy.value}
        />
      )}
    </>
  )
}
