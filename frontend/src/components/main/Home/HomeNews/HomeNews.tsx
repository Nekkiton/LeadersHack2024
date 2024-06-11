import { useEffect, useState } from 'react'
import { useDailyNews, useNews } from '@/api/news'
import Tabs from '@/components/ui/Tabs'
import RemoteData from '@/components/special/RemoteData'
import NewsCard from '@/components/base/news/NewsCard'
import Pagination from '@/components/ui/Pagination'
import styles from './HomeNews.module.scss'

export default function HomeNews() {
  const [page, setPage] = useState(0)
  const [activeKey, setActiveKey] = useState<'daily' | 'all'>('daily')

  useEffect(() => {
    setPage(0)
  }, [activeKey])

  const dailyNews = useDailyNews({ enabled: activeKey === 'daily' })
  const news = useNews({ page }, { enabled: activeKey === 'all' })

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h2>Следи за развитием IT с нами</h2>
          <p>Каждый день выбираем для вас лучшие статьи из IT</p>
        </div>
        <Tabs
          items={[
            { key: 'daily', value: 'Ежедневный дайджест' },
            { key: 'all', value: 'Наши новости' },
          ]}
          value={activeKey}
          onChange={setActiveKey}
        />
        <div className={styles.newsList}>
          {activeKey === 'daily' && (
            <RemoteData
              data={dailyNews}
              renderSuccess={(newsList) =>
                newsList.map((newsItem) => (
                  <NewsCard
                    className={styles.newsItem}
                    news={newsItem}
                    key={newsItem._id}
                  />
                ))
              }
            />
          )}
          {activeKey === 'all' && (
            <RemoteData
              data={news}
              renderSuccess={(newsList) => (
                <>
                  {newsList.data.map((newsItem) => (
                    <NewsCard
                      className={styles.newsItem}
                      news={newsItem}
                      key={newsItem._id}
                    />
                  ))}
                  <Pagination
                    currentPage={newsList.current_page}
                    lastPage={newsList.last_page}
                    loadPage={(val) => setPage(val)}
                  />
                </>
              )}
            />
          )}
        </div>
      </div>
    </div>
  )
}
