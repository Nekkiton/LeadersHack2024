import moment, { Moment } from 'moment'
import { Attachment } from '@/types/entities/attachment'
import { UpdateNewsData } from '@/types/entities/news'

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
