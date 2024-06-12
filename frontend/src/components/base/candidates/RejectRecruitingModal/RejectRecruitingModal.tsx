import { Controller, useForm } from 'react-hook-form'
import { Stage } from '@/types/entities/stage'
import { Response } from '@/types/entities/response'
import { useCurRecruiterAnswerToRespond } from '@/api/recruiters'
import Modal, { ModalStateProps } from '@/components/ui/Modal'
import Textarea from '@/components/ui/Textarea'
import Button from '@/components/ui/Button'

interface Props extends ModalStateProps {
  response: Response
  stage: Stage
}

interface FormData {
  message: string
}

export default function RejectRecruitingModal({
  stage,
  response,
  ...stateProps
}: Props) {
  const { control, handleSubmit } = useForm<FormData>({
    defaultValues: { message: stage.reject_template },
  })

  const { mutate, status } = useCurRecruiterAnswerToRespond()

  const onSubmit = handleSubmit((data) => {
    mutate(
      { ...data, pk: response._id, status: 'reject' },
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
      header="Отправить отказ"
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
            Отказать
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
            label="Текст отказа"
            height={170}
          />
        )}
      />
    </Modal>
  )
}
