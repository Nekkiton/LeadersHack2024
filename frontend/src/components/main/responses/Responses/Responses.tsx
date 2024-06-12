import { useEffect, useState } from 'react'
import { useCurCandidateResponses } from '@/api/candidates'
import Tabs from '@/components/ui/Tabs'
import RemoteData from '@/components/special/RemoteData'
import ResponsesResponses from './ResponsesResponses'
import ResponsesInvites from './ResponsesInvites'
import Pagination from '@/components/ui/Pagination'
import styles from './Responses.module.scss'
import { Site } from '@/config/site'

export default function Vacancies() {
  const [page, setPage] = useState(0)
  const [activeKey, setActiveKey] = useState<'recruiter' | 'candidate'>(
    'candidate'
  )

  useEffect(() => setPage(0), [activeKey])

  const responses = useCurCandidateResponses({
    page: page,
    limit: Site.cardsPerPage,
    inviter: activeKey,
  })

  return (
    <div className={styles.container}>
      <h1>Отклики и приглашения</h1>
      <Tabs
        items={[
          { key: 'candidate', value: 'Ваши отклики' },
          { key: 'recruiter', value: 'Приглашения на вакансии' },
        ]}
        value={activeKey}
        onChange={setActiveKey}
      />
      <RemoteData
        data={responses}
        renderSuccess={(data) => (
          <>
            {activeKey === 'candidate' && (
              <ResponsesResponses responses={data.items} />
            )}
            {activeKey === 'recruiter' && (
              <ResponsesInvites invites={data.items} />
            )}
            <Pagination
              page={data.page}
              totalPages={data.total_pages}
              loadPage={(val) => setPage(val)}
            />
          </>
        )}
      />
    </div>
  )
}
