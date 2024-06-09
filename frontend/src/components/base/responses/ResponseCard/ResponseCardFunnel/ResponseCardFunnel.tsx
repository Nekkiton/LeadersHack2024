import { ResponseStage } from '@/types/entities/response-stage'
import styles from './ResponseCardFunnel.module.scss'

interface Props {
  response: ResponseStage
}

export default function ResponseCardFunnel({ response }: Props) {
  return <div className={styles.container}>coming soon</div>
}
