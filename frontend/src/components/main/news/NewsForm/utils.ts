import moment, { Moment } from 'moment'
import { Attachment } from '@/types/entities/attachment'
import { News, UpdateNewsData } from '@/types/entities/news'

export interface FormData {
  title: string
  text: string
  image: Attachment
  publication_date: Moment | null
}

export const transformData = (data: FormData): UpdateNewsData => {
  return {
    ...data,
    image: data.image.data,
    publication_date: (data.publication_date ?? moment()).toISOString(),
  }
}

export const getInitialData = (news?: News): Partial<FormData> => {
  return {
    ...(news ?? {}),
    image: news
      ? {
          _id: 'attachment',
          created_at: '',
          name: 'Обложка',
          size: 1024 * 10,
          data: news.image,
        }
      : undefined,
    publication_date: news?.publication_date
      ? moment(`${news.publication_date}Z`)
      : null,
  }
}
