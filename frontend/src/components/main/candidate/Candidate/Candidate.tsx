import { useCandidate } from '@/api/candidates'
import Button from '@/components/ui/Button'
import Icon from '@/components/ui/Icon'
import RemoteData from '@/components/special/RemoteData'
import CandidateHeader from './CandidateHeader'
import CandidateMain from './CandidateMain'
import styles from './Candidate.module.scss'

interface Props {
  id: string
  backLink?: {
    url: string
    text: string
  }
}

export default function Candidate({ id, backLink }: Props) {
  const candidate = useCandidate(id)

  return (
    <div className={styles.container}>
      {backLink && (
        <Button type="text" href={backLink.url}>
          <Icon icon="chevronLeft" />
          <span>{backLink.text}</span>
        </Button>
      )}
      <RemoteData
        data={candidate}
        renderSuccess={(candidate) => (
          <>
            <CandidateHeader candidate={candidate} />
            <CandidateMain candidate={candidate} />
          </>
        )}
      />
    </div>
  )
}
