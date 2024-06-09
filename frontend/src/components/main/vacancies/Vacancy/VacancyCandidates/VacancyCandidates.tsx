import { Vacancy } from '@/types/entities/vacancy'
import { useCandidates } from '@/api/candidates'
import RemoteData from '@/components/special/RemoteData'
import CandidateCard from '@/components/base/candidates/CandidateCard'
import styles from './VacancyCandidates.module.scss'

interface Props {
  vacancy: Vacancy
}

export default function VacancyCandidates({ vacancy }: Props) {
  const candidates = useCandidates()

  return (
    <RemoteData
      data={candidates}
      renderSuccess={(candidates) => (
        <div className={styles.container}>
          <div className={styles.candidates}>
            {/* TODO: deal with pagination */}
            {candidates.data.map((candidate) => (
              <CandidateCard key={candidate.id} candidate={candidate} />
            ))}
          </div>
          <div className={styles.sidebar}>coming soong</div>
        </div>
      )}
    />
  )
}
