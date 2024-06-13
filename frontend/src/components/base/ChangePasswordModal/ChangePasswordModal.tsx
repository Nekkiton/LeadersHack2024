import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useChangePassword } from '@/api/auth'
import Modal, { ModalStateProps } from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

interface FormData {
  old_password: string
  new_password: string
  newPasswordRepeat: string
}

export default function ChangePasswordModal(stateProps: ModalStateProps) {
  const { control, handleSubmit, watch, reset, trigger, formState } =
    useForm<FormData>()

  const { mutate, status } = useChangePassword()

  const onSubmit = handleSubmit((data) => {
    mutate(data, {
      onSettled: () => {
        stateProps.setIsShowed(false)
      },
      onSuccess: () => {
        reset()
      },
    })
  })

  const password = watch('new_password')
  const passwordRepeat = watch('newPasswordRepeat')

  useEffect(() => {
    if (formState.isSubmitted) {
      trigger('new_password')
      trigger('newPasswordRepeat')
    }
  }, [password, passwordRepeat, formState.isSubmitted, trigger])

  return (
    <Modal
      {...stateProps}
      header="Изменить пароль"
      width={310}
      onSubmit={(e) => {
        e.stopPropagation() // because form is inside another form
        onSubmit(e)
      }}
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
            Сохранить
          </Button>
        </>
      }
      form
    >
      <Controller
        control={control}
        name="old_password"
        rules={{
          required: true,
        }}
        render={({ field, fieldState }) => (
          <Input {...field} error={fieldState.error} label="Старый пароль" />
        )}
      />
      <Controller
        control={control}
        name="new_password"
        rules={{
          required: true,
          validate: (val) =>
            val === passwordRepeat ? true : 'Пароли не совпадают',
        }}
        render={({ field, fieldState }) => (
          <Input {...field} error={fieldState.error} label="Новый пароль" />
        )}
      />
      <Controller
        control={control}
        name="newPasswordRepeat"
        rules={{
          required: true,
          validate: (val) => (val === password ? true : 'Пароли не совпадают'),
        }}
        render={({ field, fieldState }) => (
          <Input {...field} error={fieldState.error} label="Повторите пароль" />
        )}
      />
    </Modal>
  )
}
