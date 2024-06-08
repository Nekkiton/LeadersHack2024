import { useState } from 'react'
import { ResponseStage } from '@/types/entities/response-stage'
import classNames from 'classnames'
import Button from '@/components/ui/Button'
import RadialProgressBar from '@/components/ui/RadialProgressBar'
import CandidateCardInfo from '@/components/base/candidates/CandidateCardInfo'
import TabsLine from '@/components/ui/TabsLine'
import ResponseCardFunnel from './ResponseCardFunnel'
import styles from './ResponseCard.module.scss'

interface Props {
  className?: string
  response: ResponseStage
}

export default function ResponseCard({ className, response }: Props) {
  const [activeKey, setActiveKey] = useState<
    'funnel' | 'responsesHistory' | 'comments'
  >('funnel')

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
      <TabsLine
        items={[
          { key: 'funnel', value: 'Движение по воронке' },
          { key: 'responsesHistory', value: 'История откликов' },
          { key: 'comments', value: 'Комментарий' },
        ]}
        value={activeKey}
        onChange={setActiveKey}
      />
      {activeKey === 'funnel' && <ResponseCardFunnel response={response} />}
      {activeKey !== 'funnel' && 'coming soon'}
    </div>
  )
}
