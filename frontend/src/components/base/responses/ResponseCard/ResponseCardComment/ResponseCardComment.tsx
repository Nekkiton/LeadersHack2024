import { Controller, useForm } from 'react-hook-form'
import { Response } from '@/types/entities/response'
import { useCurRecruiterCommentResponse } from '@/api/recruiters'
import Textarea from '@/components/ui/Textarea'
import Button from '@/components/ui/Button'
import styles from './ResponseCardComment.module.scss'

interface Props {
  response: Response
}

interface FormData {
  comment: string
}

export default function ResponseCardComment({ response }: Props) {
  const { control, handleSubmit } = useForm<FormData>({
    defaultValues: {
      comment: response.comment ?? undefined,
    },
  })

  const { mutate, status } = useCurRecruiterCommentResponse()

  const onSubmit = handleSubmit((data) => {
    mutate({ ...data, pk: response._id })
  })

  return (
    <form className={styles.container} onSubmit={onSubmit}>
      <Controller
        control={control}
        name="comment"
        rules={{ required: true }}
        render={({ field, fieldState }) => (
          <Textarea
            {...field}
            error={fieldState.error}
            label="Пишите заметки о кандидате, чтобы ничего не забыть"
          />
        )}
      />
      <Button type="primary" htmlType="submit" loading={status === 'pending'}>
        Сохранить изменения
      </Button>
    </form>
  )
}
