import { useMemo } from 'react'
import { useCurRecruiterNewsSingle, useNewsSingle } from '@/api/news'
import { Role } from '@/types/entities/user'
import ReactMarkdown from 'react-markdown'
import Button from '@/components/ui/Button'
import Icon from '@/components/ui/Icon'
import RemoteData from '@/components/special/RemoteData'
import Image from '@/components/ui/Image'
import styles from './NewsSingle.module.scss'

interface Props {
  role?: Role
  id: string
  backLink?: {
    url: string
    text: string
  }
}

export default function NewsSingle({ id, backLink, role }: Props) {
  const publicNews = useNewsSingle(id, { enabled: role !== Role.Recruiter })
  const recruiterNews = useCurRecruiterNewsSingle(id, {
    enabled: role === Role.Recruiter,
  })

  const news = useMemo(() => {
    if (role === Role.Recruiter) {
      return recruiterNews
    } else {
      return publicNews
    }
  }, [(publicNews as any).value, (recruiterNews as any).value, role])

  return (
    <div className={styles.container}>
      {backLink && (
        <Button href={backLink.url} type="text">
          <Icon icon="chevronLeft" />
          <span>{backLink.text}</span>
        </Button>
      )}
      <RemoteData
        data={news}
        renderSuccess={(news) => (
          <div className={styles.newsContainer}>
            <h1>{news.title}</h1>
            <div className={styles.newsContentContainer}>
              <Image
                className={styles.newsImg}
                src={news.image}
                width={1000}
                height={600}
              />
              <ReactMarkdown className={styles.newsContent}>
                {news.text}
              </ReactMarkdown>
            </div>
          </div>
        )}
      />
    </div>
  )
}
