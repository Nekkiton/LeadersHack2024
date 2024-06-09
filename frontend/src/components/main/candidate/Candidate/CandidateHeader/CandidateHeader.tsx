import { Candidate } from '@/types/entities/candidate'
import { getUserName } from '@/lib/get-user-name'
import { getUserAge } from '@/lib/get-user-age'
import Button from '@/components/ui/Button'
import Image from '@/components/ui/Image'
import userImg from '@/assets/images/user.png'
import styles from './CandidateHeader.module.scss'

interface Props {
  candidate: Candidate
}

export default function CandidateHeader({ candidate }: Props) {
  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <Image
          className={styles.userImg}
          src={candidate.photo ?? userImg}
          width={200}
          height={200}
        />
        <div className={styles.userInfo}>
          <h1>{getUserName(candidate, 'Name Surname')}</h1>
          <div className={styles.userInfoData}>
            <p>{candidate.job_title}</p>
            {candidate.birthday && (
              <p>
                {getUserAge(candidate.birthday)}, {candidate.city}
              </p>
            )}
            <p>TODO</p>
          </div>
        </div>
      </div>
      {/* TODO: action */}
      <Button type="primary" onClick={() => alert('comming soon')}>
        Пригласть на вакансию
      </Button>
    </div>
  )
}
