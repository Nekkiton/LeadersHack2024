import { Response } from '@/types/entities/response'
import classNames from 'classnames'
import Button from '@/components/ui/Button'
import RadialProgressBar from '@/components/ui/RadialProgressBar'
import CandidateCardInfo from '@/components/base/candidates/CandidateCardInfo'
import styles from './ResponseCard.module.scss'

interface Props {
  className?: string
  response: Response
}

export default function ResponseCard({ className, response }: Props) {
  return (
    <div className={classNames(className, styles.container)}>
      <div className={styles.header}>
        <div className={styles.headerInfo}>
          <span className={styles.headerTag}>TODO</span>
          <div className={styles.headerMathPercent}>
            <RadialProgressBar value={55} />
            <span>55% соответствия</span>
          </div>
        </div>
        {/* TODO: action */}
        <Button type="secondary" onClick={() => alert('coming soon')}>
          Открыть резюме
        </Button>
      </div>
      {response.candidate && (
        <CandidateCardInfo candidate={response.candidate} />
      )}
      <span className={styles.separator} />
      *coming soong*
    </div>
  )
}
