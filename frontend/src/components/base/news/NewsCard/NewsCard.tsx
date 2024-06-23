import { News } from '@/types/entities/news'
import { Role } from '@/types/entities/user'
import { Routes } from '@/config/routes'
import moment from 'moment'
import classNames from 'classnames'
import ReactMarkdown from 'react-markdown'
import Image from '@/components/ui/Image'
import Button from '@/components/ui/Button'
import Icon from '@/components/ui/Icon'
import styles from './NewsCard.module.scss'

interface Props {
  className?: string
  news: News
  role?: Role
}

export default function NewsCard({ className, news, role }: Props) {
  return (
    <div className={classNames(styles.container, className)}>
      <Image
        className={styles.newsImg}
        src={news.image}
        width={700}
        height={400}
        alt={news.title}
      />
      <div className={styles.textContainer}>
        <p className={styles.newsTitle}>{news.title}</p>
        <ReactMarkdown className={styles.newsContent}>
          {news.text.slice(0, 210) + '...'}
        </ReactMarkdown>
      </div>
      <div className={styles.footer}>
        <Button
          className={styles.transparentBtw}
          type="secondary"
          href={
            role === Role.Recruiter
              ? Routes.recruiterNewsSingle(news._id)
              : Routes.newsSingle(news._id)
          }
        >
          Читать дальше
        </Button>
        <div className={styles.footerExtra}>
          <p className={styles.newsDate}>
            от {moment(`${news.publication_date}Z`).format('DD.MM.YYYY')}
          </p>
          {role === Role.Recruiter && (
            <Button type="text" href={Routes.recruiterEditNews(news._id)}>
              <Icon icon="pen" />
              <span>Редактировать</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
