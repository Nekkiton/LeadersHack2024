import { Candidate } from '@/types/entities/candidate'
import CandidateCardInfo from '@/components/base/candidates/CandidateCardInfo'
import Button from '@/components/ui/Button'
import RadialProgressBar from '@/components/ui/RadialProgressBar'
import styles from './CandidateCard.module.scss'

interface Props {
  candidate: Candidate
  type?: 'expandedTop' | 'expandedBottom'
}

export default function CandidateCard({
  candidate,
  type = 'expandedTop',
}: Props) {
  return (
    <div className={styles.container}>
      {type === 'expandedTop' && (
        <div className={styles.header}>
          <div className={styles.matchPercent}>
            <RadialProgressBar value={55} />
            <span>67% соответствия</span>
          </div>
          <div className={styles.headerControls}>
            {/* TODO: actions */}
            <Button type="primary" onClick={() => alert('coming soon')}>
              Пригласить
            </Button>
            <Button type="secondary" onClick={() => alert('coming soon')}>
              Открыть резюме
            </Button>
          </div>
        </div>
      )}
      <CandidateCardInfo candidate={candidate} />
      {type === 'expandedBottom' && (
        <>
          <span className={styles.separator} />
          <div className={styles.footer}>
            <div className={styles.footerTagsContainer}>
              <p className={styles.footerTagsTitle}>Ключевые навыки</p>
              <div className={styles.footerTags}>
                {candidate.skills.map((skill) => (
                  <span className={styles.footerTag} key={skill}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div className={styles.footerControls}>
              {/* TODO: actions */}
              <Button type="secondary" onClick={() => alert('coming soon')}>
                Открыть резюме
              </Button>
              <Button type="text" onClick={() => alert('coming soon')}>
                Пригласить на вакансию
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
