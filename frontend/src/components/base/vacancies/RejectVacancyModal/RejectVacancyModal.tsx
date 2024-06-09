import { Controller, useForm } from 'react-hook-form'
import Modal, { ModalStateProps } from '@/components/ui/Modal'
import Textarea from '@/components/ui/Textarea'
import Button from '@/components/ui/Button'

interface Props extends ModalStateProps {}

interface FormData {
  message: string
}

export default function RejectVacancyModal({ ...stateProps }: Props) {
  const { control, handleSubmit } = useForm<FormData>()

  const onSubmit = handleSubmit((data) => {
    console.log(data)
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
          <Button type="primary" htmlType="submit">
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
