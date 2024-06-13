import { Response } from '@/types/entities/response'
import { useCurCandidateAnswerToResponse } from '@/api/candidates'
import Modal, { ModalStateProps } from '@/components/ui/Modal'
import Button from '@/components/ui/Button'

interface Props extends ModalStateProps {
  response: Response
}

export default function SetupInterviewModal({
  response,
  ...stateProps
}: Props) {
  const { mutate, status } = useCurCandidateAnswerToResponse()

  const onSubmit = () => {
    mutate(
      {
        pk: response._id,
        status: 'approve',
        message: null,
        meet_on: null,
        meet_at: null,
      },
      {
        onSettled: () => {
          stateProps.setIsShowed(false)
        },
      }
    )
  }

  return (
    <Modal
      {...stateProps}
      header="Вы уверены, что хотите принять приглашение?"
      width={370}
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
            onClick={onSubmit}
            loading={status === 'pending'}
          >
            Принять
          </Button>
        </>
      }
    />
  )
}
