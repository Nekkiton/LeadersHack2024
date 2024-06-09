import { useState } from 'react'
import { useCurCandidateResponses } from '@/api/candidates'
import Tabs from '@/components/ui/Tabs'
import RemoteData from '@/components/special/RemoteData'
import ResponsesResponses from './ResponsesResponses'
import ResponsesInvites from './ResponsesInvites'
import styles from './Responses.module.scss'

export default function Vacancies() {
  const [activeKey, setActiveKey] = useState<'responses' | 'invites'>(
    'responses'
  )

  const responses = useCurCandidateResponses()

  return (
    <div className={styles.container}>
      <h1>Отклики и приглашения</h1>
      <Tabs
        items={[
          { key: 'responses', value: 'Ваши отклики' },
          { key: 'invites', value: 'Приглашения на вакансии' },
        ]}
        value={activeKey}
        onChange={setActiveKey}
      />
      <RemoteData
        data={responses}
        renderSuccess={(data) => (
          <>
            {activeKey === 'responses' && (
              <ResponsesResponses responses={data.responses} />
            )}
            {activeKey === 'invites' && (
              <ResponsesInvites invites={data.invites} />
            )}
          </>
        )}
      />
    </div>
  )
}
