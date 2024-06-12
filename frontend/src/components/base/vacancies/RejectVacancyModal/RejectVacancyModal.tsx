import { Controller, useForm } from 'react-hook-form'
import { useCurCandidateAnswerToResponse } from '@/api/candidates'
import { Response } from '@/types/entities/response'
import Modal, { ModalStateProps } from '@/components/ui/Modal'
import Textarea from '@/components/ui/Textarea'
import Button from '@/components/ui/Button'

interface Props extends ModalStateProps {
  response: Response
}

interface FormData {
  message: string
}

export default function RejectVacancyModal({ response, ...stateProps }: Props) {
  const { control, handleSubmit } = useForm<FormData>()

  const { mutate, status } = useCurCandidateAnswerToResponse()

  const onSubmit = handleSubmit((data) => {
    mutate(
      {
        ...data,
        meet_at: null,
        meet_on: null,
        pk: response._id,
        status: 'reject',
      },
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
      header="Вы уверены, что хотите отказаться от этой вакансии?"
      width={475}
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
            Подтвердить отказ
          </Button>
        </>
      }
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
            label="Причина отказа"
            placeholder="Почему вы отказываетесь от вакансии?"
            height={108}
          />
        )}
      />
    </Modal>
  )
}
