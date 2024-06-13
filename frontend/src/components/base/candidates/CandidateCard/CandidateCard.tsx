import { useState } from 'react'
import { Routes } from '@/config/routes'
import { Candidate } from '@/types/entities/candidate'
import { Vacancy } from '@/types/entities/vacancy'
import CandidateCardInfo from '@/components/base/candidates/CandidateCardInfo'
import Button from '@/components/ui/Button'
import RadialProgressBar from '@/components/ui/RadialProgressBar'
import InviteCandidateModal from '@/components/base/candidates/InviteCandidateModal'
import styles from './CandidateCard.module.scss'

interface Props {
  candidate: Candidate
  type?: 'expandedTop' | 'expandedBottom'
  vacancy?: Vacancy
}

export default function CandidateCard({
  candidate,
  type = 'expandedTop',
  vacancy,
}: Props) {
  const [isInviteModalShowed, setIsInviteModalShowed] = useState(false)

  return (
    <>
      <div className={styles.container}>
        {type === 'expandedTop' && (
          <div className={styles.header}>
            {candidate.match !== undefined && (
              <div className={styles.matchPercent}>
                <RadialProgressBar value={candidate.match} />
                <span>{candidate.match}% соответствия</span>
              </div>
            )}
            <div className={styles.headerControls}>
              <Button
                type="primary"
                onClick={() => setIsInviteModalShowed(true)}
              >
                Пригласить
              </Button>
              <Button
                type="secondary"
                href={Routes.recruiterCandidate(candidate._id)}
                target="_blank"
              >
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
                <Button
                  type="secondary"
                  href={Routes.recruiterCandidate(candidate._id)}
                >
                  Открыть резюме
                </Button>
                <Button
                  type="text"
                  onClick={() => setIsInviteModalShowed(true)}
                >
                  Пригласить на вакансию
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      <InviteCandidateModal
        isShowed={isInviteModalShowed}
        setIsShowed={setIsInviteModalShowed}
        vacancy={vacancy}
        candidate={candidate}
      />
    </>
  )
}
