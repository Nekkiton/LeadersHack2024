import { useState } from 'react'
import { useNews } from '@/api/news'
import { Site } from '@/config/site'
import RemoteData from '@/components/special/RemoteData'
import NewsCard from '@/components/base/news/NewsCard'
import Pagination from '@/components/ui/Pagination'
import Icon from '@/components/ui/Icon'
import styles from './HomeNews.module.scss'

export default function HomeNews() {
  const [page, setPage] = useState(0)

  const news = useNews({ page, limit: Site.cardsPerPage })

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h2>Следи за развитием IT с нами</h2>
          <p>Каждый день выбираем для вас лучшие статьи из IT</p>
        </div>
        <div className={styles.newsList}>
          <RemoteData
            data={news}
            renderSuccess={(newsList) => (
              <>
                {newsList.items.length ? (
                  newsList.items.map((newsItem) => (
                    <NewsCard
                      className={styles.newsItem}
                      news={newsItem}
                      key={newsItem._id}
                    />
                  ))
                ) : (
                  <div className={styles.nothing}>
                    <Icon className={styles.nothingIcon} icon="documentLoupe" />
                    <p>Новостей пока нет</p>
                  </div>
                )}
                <Pagination
                  className={styles.newsPagination}
                  page={newsList.page}
                  totalPages={newsList.total_pages}
                  loadPage={(val) => setPage(val)}
                />
              </>
            )}
          />
        </div>
      </div>
    </div>
  )
}
