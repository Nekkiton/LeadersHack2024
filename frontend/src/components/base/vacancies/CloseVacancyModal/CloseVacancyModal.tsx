import { useRouter } from 'next/router'
import { Vacancy } from '@/types/entities/vacancy'
import { useCloseVacancy } from '@/api/vacancies'
import { Routes } from '@/config/routes'
import Modal, { ModalStateProps } from '@/components/ui/Modal'
import Button from '@/components/ui/Button'

interface Props extends ModalStateProps {
  vacancy: Vacancy
}

export default function CloseVacancyModal({ vacancy, ...stateProps }: Props) {
  const router = useRouter()

  const { mutate: closeVacancy_, status } = useCloseVacancy()

  const closeVacancy = () => {
    closeVacancy_(vacancy.id, {
      onSuccess: () => {
        router.push(Routes.recruiterVacancies)
      },
      onSettled: () => {
        stateProps.setIsShowed(false)
      },
    })
  }

  return (
    <Modal
      {...stateProps}
      header="Вы уверены, что хотите закрыть вакансию?"
      width={410}
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
            onClick={closeVacancy}
            loading={status === 'pending'}
          >
            Закрыть вакансию
          </Button>
        </>
      }
    >
      <p>
        Всем соискателям, которые сейчас откликнулись на эту вакансию придет
        автоматический отказ
      </p>
    </Modal>
  )
}
