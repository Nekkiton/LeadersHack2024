import { Controller, useForm } from 'react-hook-form'
import { Stage } from '@/types/entities/stage'
import Modal, { ModalStateProps } from '@/components/ui/Modal'
import Textarea from '@/components/ui/Textarea'
import Button from '@/components/ui/Button'

interface Props extends ModalStateProps {
  stage: Stage
}

interface FormData {
  message: string
}

export default function KeepRecruitingModal({ stage, ...stateProps }: Props) {
  const { control, handleSubmit, reset } = useForm<FormData>({
    defaultValues: {
      message: stage.approve_template,
    },
  })

  const onSubmit = handleSubmit((data) => {
    console.log(data)
  })

  return (
    <Modal
      {...stateProps}
      header="Отправить приглашение на следующий этап"
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
          <Button type="primary" htmlType="submit">
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
