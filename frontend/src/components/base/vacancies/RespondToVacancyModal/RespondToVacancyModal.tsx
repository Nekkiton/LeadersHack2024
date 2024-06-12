import { Controller, useForm } from 'react-hook-form'
import { useRespondToVacancy } from '@/api/vacancies'
import { useToasts } from '@/lib/use-toasts'
import { Vacancy } from '@/types/entities/vacancy'
import Modal, { ModalStateProps } from '@/components/ui/Modal'
import Textarea from '@/components/ui/Textarea'
import Button from '@/components/ui/Button'

interface Props extends ModalStateProps {
  vacancy: Vacancy
}

interface FormData {
  message: string
}

export default function RespondToVacancyModal({
  vacancy,
  ...stateProps
}: Props) {
  const toasts = useToasts()

  const { control, handleSubmit } = useForm<FormData>()

  const { mutate: respond, status } = useRespondToVacancy()

  const onSubmit = handleSubmit((data) => {
    respond(
      { ...data, vacancy_id: vacancy._id },
      {
        onSettled: () => {
          stateProps.setIsShowed(false)
        },
      }
    )
  })

  return (
    <Modal
      {...stateProps}
      header="Откликнуться на вакансию"
      width={593}
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
            Отправить отклик
          </Button>
        </>
      }
      onSubmit={onSubmit}
      form
    >
      <Controller
        control={control}
        name="message"
        rules={{ required: true }}
        render={({ field, fieldState }) => (
          <Textarea
            {...field}
            error={fieldState.error}
            label="Сопроводительное письмо"
            placeholder="Напишите, почему вы хочешь проходить работать на этой должности"
            height={207}
          />
        )}
      />
    </Modal>
  )
}
