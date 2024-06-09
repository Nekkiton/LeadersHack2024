import { useState } from 'react'
import Tabs from '@/components/ui/Tabs'
import ResponsesResponses from './ResponsesResponses'
import ResponsesInvites from './ResponsesInvites'
import styles from './Responses.module.scss'

export default function Vacancies() {
  const [activeKey, setActiveKey] = useState<'responses' | 'invites'>(
    'responses'
  )

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
      {activeKey === 'responses' && <ResponsesResponses />}
      {activeKey === 'invites' && <ResponsesInvites />}
    </div>
  )
}
