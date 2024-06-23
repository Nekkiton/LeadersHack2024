import { Controller, useForm } from 'react-hook-form'
import { useCurRecruiterSendResponseMessage } from '@/api/recruiters'
import { useCurCandidateSendResponseMessage } from '@/api/candidates'
import { Role } from '@/types/entities/user'
import { Response } from '@/types/entities/response'
import Button from '@/components/ui/Button'
import Textarea from '@/components/ui/Textarea'
import styles from './ResponseCardFunnelMessageForm.module.scss'

interface Props {
  setIsShowed: (val: boolean) => void
  role: Role
  response: Response
}

interface FormData {
  message: string
}

export default function ResponseCardFunnelMessageForm({
  setIsShowed,
  role,
  response,
}: Props) {
  const { control, handleSubmit } = useForm<FormData>()

  const { mutate: recruiterMutate, status: recruiterStatus } =
    useCurRecruiterSendResponseMessage()
  const { mutate: candidateMutate, status: candidateStatus } =
    useCurCandidateSendResponseMessage()

  const onSuccess = () => {
    setIsShowed(false)
  }

  const onSubmit = handleSubmit((data) => {
    if (role === Role.Candidate) {
      candidateMutate({ ...data, pk: response._id }, { onSuccess })
    } else if (role === Role.Recruiter) {
      recruiterMutate({ ...data, pk: response._id }, { onSuccess })
    }
  })

  return (
    <form className={styles.container} onSubmit={onSubmit}>
      <Controller
        control={control}
        name="message"
        rules={{ required: true }}
        render={({ field, fieldState }) => (
          <Textarea {...field} error={fieldState.error} />
        )}
      />
      <div className={styles.controls}>
        <Button
          type="primary"
          htmlType="submit"
          loading={
            recruiterStatus === 'pending' || candidateStatus === 'pending'
          }
        >
          Отправить
        </Button>
        <Button
          className={styles.controlsCancelBtn}
          type="text"
          onClick={() => setIsShowed(false)}
        >
          Отменить
        </Button>
      </div>
    </form>
  )
}
