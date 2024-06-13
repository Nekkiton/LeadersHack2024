import { Controller, useForm } from 'react-hook-form'
import { Candidate } from '@/types/entities/candidate'
import { Vacancy } from '@/types/entities/vacancy'
import { useCurRecruiterInviteCandidate } from '@/api/recruiters'
import Modal, { ModalStateProps } from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import Textarea from '@/components/ui/Textarea'

interface Props extends ModalStateProps {
  candidate: Candidate
  vacancy: Vacancy
}

interface FormData {
  message: string
}

export default function InviteCandidateModal({
  candidate,
  vacancy,
  ...stateProps
}: Props) {
  const { control, handleSubmit } = useForm<FormData>({
    defaultValues: {
      message: vacancy.stages?.[0].approve_template,
    },
  })

  const { mutate, status } = useCurRecruiterInviteCandidate()

  const onSubmit = handleSubmit((data) => {
    mutate(
      { ...data, vacancy_id: vacancy._id, candidate_id: candidate._id },
      {
        onSettled: () => stateProps.setIsShowed(false),
      }
    )
  })

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
      <Controller
        control={control}
        name="message"
        rules={{ required: true }}
        render={({ field, fieldState }) => (
          <Textarea
            {...field}
            error={fieldState.error}
            label="Текст приглашения"
          />
        )}
      />
    </Modal>
  )
}
