import Modal, { ModalStateProps } from '@/components/ui/Modal'
import Spinner from '@/components/ui/Spinner'
import styles from './CandidateRecognitionModal.module.scss'

export default function CandidateRecognitionModal(stateProps: ModalStateProps) {
  return (
    <Modal
      {...stateProps}
      header={
        <div className={styles.header}>
          <Spinner className={styles.spinner} />
          <h3>Идет распознавание</h3>
        </div>
      }
      width={397}
    >
      <p>Вычленяем информацию из вашего резюме. Не закрывайте страницу</p>
    </Modal>
  )
}
