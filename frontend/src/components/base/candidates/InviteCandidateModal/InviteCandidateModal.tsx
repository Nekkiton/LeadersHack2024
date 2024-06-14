import { Controller, useForm } from 'react-hook-form'
import { Candidate } from '@/types/entities/candidate'
import { Vacancy } from '@/types/entities/vacancy'
import { useCurRecruiterInviteCandidate } from '@/api/recruiters'
import { useCurRecruiterVacancies } from '@/api/vacancies'
import Modal, { ModalStateProps } from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import Textarea from '@/components/ui/Textarea'

interface Props extends ModalStateProps {
  candidate: Candidate
  vacancy?: Vacancy
}

interface FormData {
  message: string
  vacancy_id?: string
}

export default function InviteCandidateModal({
  candidate,
  vacancy,
  ...stateProps
}: Props) {
  const { control, handleSubmit } = useForm<FormData>({
    defaultValues: {
      message: vacancy?.stages?.[0].approve_template,
    },
  })

  const { mutate, status } = useCurRecruiterInviteCandidate()

  const onSubmit = handleSubmit((data) => {
    mutate(
      {
        ...data,
        vacancy_id: vacancy?._id ?? data.vacancy_id!,
        candidate_id: candidate._id,
      },
      {
        onSettled: () => {
          stateProps.setIsShowed(false)
        },
      }
    )
  })

  const vacancies = useCurRecruiterVacancies(
    { limit: 9999 },
    { enabled: !vacancy }
  )

  return (
    <Modal
      {...stateProps}
      header="Пригласить на вакансию"
      width={624}
      onSubmit={onSubmit}
      footer={
        <>
          <Button
            type="secondary"
            onClick={() => stateProps.setIsShowed(false)}
          >
            Отмена
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={status === 'pending'}
          >
            Пригласить
          </Button>
        </>
      }
      form
    >
      {!vacancy && (
        <Controller
          control={control}
          name="vacancy_id"
          rules={{ required: true }}
          render={({ field, fieldState }) => (
            <Select
              {...field}
              error={fieldState.error}
              label="Вакансия"
              placeholder="Выберите из списка"
              items={
                vacancies.status === 'success'
                  ? vacancies.value.items.map((i) => ({
                      key: i._id,
                      value: i.title,
                    }))
                  : []
              }
              inputtable
            />
          )}
        />
      )}
      <Controller
        control={control}
        name="message"
        rules={{ required: true }}
        render={({ field, fieldState }) => (
          <Textarea
            {...field}
            error={fieldState.error}
            label="Текст приглашения"
            height={170}
          />
        )}
      />
    </Modal>
  )
}
