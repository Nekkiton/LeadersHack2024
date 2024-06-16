import { useState } from 'react'
import { Routes } from '@/config/routes'
import { useCurRecruiterNews } from '@/api/news'
import { Site } from '@/config/site'
import classNames from 'classnames'
import Icon from '@/components/ui/Icon'
import RemoteData from '@/components/special/RemoteData'
import Button from '@/components/ui/Button'
import NewsCard from '@/components/base/news/NewsCard'
import Pagination from '@/components/ui/Pagination'
import styles from './News.module.scss'

export default function News() {
  const [page, setPage] = useState(0)

  const news = useCurRecruiterNews({ page, limit: Site.cardsPerPage })

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Новости</h1>
        {(news.status !== 'success' || !!news.value.items.length) && (
          <Button type="primary" href={Routes.recruiterNewNews}>
            <Icon icon="plus" />
            <span>Создать новость</span>
          </Button>
        )}
      </div>
      <RemoteData
        data={news}
        renderSuccess={(news) => (
          <div
            className={classNames(styles.news, {
              [styles.full]: !news.items.length,
            })}
          >
            {news.items.length ? (
              news.items.map((i) => <NewsCard key={i._id} news={i} />)
            ) : (
              <div className={styles.nothing}>
                <Icon className={styles.nothingIcon} icon="documentLoupe" />
                <p>
                  Вы еще не создали ни одной новости.
                  <br />
                  Самое время это исправить
                </p>
                <Button type="primary" href={Routes.recruiterNewNews}>
                  <Icon icon="plus" />
                  <span>Создать новость</span>
                </Button>
              </div>
            )}
            <Pagination
              page={news.page}
              totalPages={news.total_pages}
              loadPage={(val) => setPage(val)}
            />
          </div>
        )}
      />
    </div>
  )
}
