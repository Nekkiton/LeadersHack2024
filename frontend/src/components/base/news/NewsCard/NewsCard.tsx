import { News } from '@/types/entities/news'
import { Role } from '@/types/entities/user'
import { Routes } from '@/config/routes'
import moment from 'moment'
import classNames from 'classnames'
import Image from '@/components/ui/Image'
import Button from '@/components/ui/Button'
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
        <p className={styles.newsContent}>
          {news.text.replaceAll('\n', ' ').slice(0, 210)}...
        </p>
      </div>
      <div className={styles.footer}>
        <Button
          className={styles.transparentBtw}
          type="secondary"
          href={
            role === Role.Recruiter ? Routes.recruiterNewsSingle(news._id) : '#'
          }
        >
          Читать дальше
        </Button>
        <p className={styles.newsDate}>
          от {moment(`${news.publication_date}Z`).format('DD.MM.YYYY')}
        </p>
      </div>
    </div>
  )
}
