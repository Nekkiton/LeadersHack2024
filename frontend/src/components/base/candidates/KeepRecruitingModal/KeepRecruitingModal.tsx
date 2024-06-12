import { Controller, useForm } from 'react-hook-form'
import { Stage } from '@/types/entities/stage'
import { Response } from '@/types/entities/response'
import { useCurRecruiterAnswerToRespond } from '@/api/recruiters'
import Modal, { ModalStateProps } from '@/components/ui/Modal'
import Textarea from '@/components/ui/Textarea'
import Button from '@/components/ui/Button'

interface Props extends ModalStateProps {
  stage: Stage
  response: Response
  lastStage?: boolean
}

interface FormData {
  message: string
}

export default function KeepRecruitingModal({
  stage,
  response,
  lastStage: isLastPage,
  ...stateProps
}: Props) {
  const { control, handleSubmit } = useForm<FormData>({
    defaultValues: {
      message: stage.approve_template,
    },
  })

  const { mutate, status } = useCurRecruiterAnswerToRespond()

  const onSubmit = handleSubmit((data) => {
    mutate(
      { ...data, pk: response._id, status: 'approve' },
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
      header={
        isLastPage
          ? 'Отправить приглашение в команду'
          : 'Отправить приглашение на следующий этап'
      }
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
