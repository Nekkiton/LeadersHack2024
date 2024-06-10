import { useState } from 'react'
import { Role } from '@/types/entities/user'
import { useVacancy } from '@/api/vacancies'
import RemoteData from '@/components/special/RemoteData'
import Button from '@/components/ui/Button'
import Icon from '@/components/ui/Icon'
import Tabs from '@/components/ui/Tabs'
import VacancyInfo from './VacancyInfo'
import VacancyResponses from './VacancyResponses'
import VacancyCandidates from './VacancyCandidates'
import styles from './Vacancy.module.scss'

interface Props {
  id: string
  backLink?: {
    url: string
    text: string
  }
  role?: Role
}

export default function Vacancy({ id, backLink, role }: Props) {
  const vacancy = useVacancy(id)

  const [activeKey, setActiveKey] = useState<'responses' | 'candidates'>(
    'responses'
  )

  return (
    <div className={styles.container}>
      {backLink && (
        <Button type="text" href={backLink.url}>
          <Icon icon="chevronLeft" />
          <span>{backLink.text}</span>
        </Button>
      )}
      <RemoteData
        data={vacancy}
        renderSuccess={(vacancy) => (
          <div className={styles.main}>
            <VacancyInfo vacancy={vacancy} role={role} />
            {role === Role.Recruiter && (
              <div className={styles.tabsContainer}>
                <Tabs
                  items={[
                    { key: 'responses', value: 'Отклики' },
                    { key: 'candidates', value: 'Подходящие кандидаты' },
                  ]}
                  value={activeKey}
                  onChange={setActiveKey}
                />
                {activeKey === 'responses' && (
                  <VacancyResponses vacancy={vacancy} role={role} />
                )}
                {activeKey === 'candidates' && (
                  <VacancyCandidates vacancy={vacancy} />
                )}
              </div>
            )}
          </div>
        )}
      />
    </div>
  )
}
