import { News } from '@/types/entities/news'
import { useToasts } from '@/lib/use-toasts'
import classNames from 'classnames'
import Image from '@/components/ui/Image'
import Button from '@/components/ui/Button'
import styles from './NewsCard.module.scss'
import moment from 'moment'

interface Props {
  className?: string
  news: News
}

export default function NewsCard({ className, news }: Props) {
  const toasts = useToasts()

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
          onClick={() => toasts.info({ content: 'Функционал в разработке' })}
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
